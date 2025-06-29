import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid'; // For unique file names
import logger from '../utils/logger.js';

dotenv.config();

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const router = express.Router();
const upload = multer();
const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

// Validate required environment variables
if (!APPS_SCRIPT_URL) {
    logger.error('❌ APPS_SCRIPT_URL is not defined in environment variables.');
    process.exit(1);
}

if (!process.env.STRIPE_SECRET_KEY) {
    logger.error('❌ STRIPE_SECRET_KEY is not defined in environment variables.');
    process.exit(1);
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const logFailedPayload = async (payload, errors = []) => {
    try {
        const logsDir = path.join('logs', 'failed-payloads');
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }

        const filename = `failed-${new Date().toISOString().replace(/[:.]/g, '-')}-${uuidv4()}.json`;
        const filePath = path.join(logsDir, filename);

        const logData = {
            timestamp: new Date().toISOString(),
            payload,
            errors,
        };

        fs.writeFileSync(filePath, JSON.stringify(logData, null, 2), 'utf-8');
        logger.error(`❌ Payload logged to ${filePath}`);
    } catch (err) {
        logger.error('⚠️ Failed to write failed payload to file:', err);
    }
};

const fireAppScriptWithRetries = async (payload, retries = 4, delayMs = 1000) => {
    const errorList = [];

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await axios.post(APPS_SCRIPT_URL, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.data?.success === true) {
                logger.info(`✅ AppScript request succeeded on attempt ${attempt}`);
                return;
            } else {
                const errMsg = `⚠️ Attempt ${attempt} failed with response: ${JSON.stringify(response.data)}`;
                logger.warn(errMsg);
                errorList.push(errMsg);
            }
        } catch (error) {
            const errMsg = `❌ Attempt ${attempt} error: ${error?.response?.data || error.message}`;
            logger.error(errMsg);
            errorList.push(errMsg);
        }

        if (attempt < retries) {
            await delay(delayMs * attempt); // Exponential backoff
        }
    }

    logger.error('🚨 All retry attempts to AppScript failed.');
    await logFailedPayload(payload, errorList);
};

async function verifyPaymentStatus(sessionId) {
    try {
        if (!sessionId) {
            logger.warn('❗ No session ID provided for payment verification');
            return false;
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const isPaid = session.payment_status === 'paid';

        logger.info(`💳 Payment verification for session ${sessionId}: ${isPaid ? 'PAID' : 'NOT PAID'}`);
        return isPaid;
    } catch (error) {
        logger.error('❌ Payment verification error:', error.message);
        return false;
    }
}

function validateFormData(formData) {
    const requiredFields = ['practiceName', 'fullName', 'phone', 'email', 'commission', 'hormone', 'owners', 'locations', 'providers', 'kits', 'members'];
    for (const field of requiredFields) {
        if(field === 'logo' || field === 'pdf') {
            continue;
        }
        console.log(field, " :- ", formData[field])
        if (field === 'owners' || field === 'locations' || field === 'providers' || field === 'kits' || field === 'members') {
            if (field === 'owners') {
                if (formData['isSoleOwner'] === false && (!formData[field] || !Array.isArray(formData[field]) || formData[field].length === 0)) {
                    console.log('❗ Owners field is required when isSoleOwner is false');
                    return false;
                }
            }
            if (field === 'members') {
                if (formData['isMultipleMember'] && (!formData[field] || !Array.isArray(formData[field]) || formData[field].length === 0)) {
                    console.log('❗ Members field is required when isMultipleMember is true');
                    return false;
                }
            }
            if(field === 'locations' || field === 'providers' || field === 'kits') {
                if (!formData[field] || !Array.isArray(formData[field]) || formData[field].length === 0) {
                    console.log(`❗ ${field.charAt(0).toUpperCase() + field.slice(1)} field is required and must be a non-empty array`);
                    return false;
                }
            }
        } else if (!formData[field] || String(formData[field]).trim() === '') {
            console.log(`❗ ${field.charAt(0).toUpperCase() + field.slice(1)} field is required and cannot be empty`);
            return false;
        }
    }
    return true;
}

router.post('/send-data', upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'pdf', maxCount: 1 }
]), async (req, res) => {
    try {
        // Get session ID from headers
        const sessionId = req.headers['x-session-id'];

        if (!sessionId) {
            logger.warn('❗ Missing payment session ID.');
            return res.status(400).json({ error: 'Missing payment session ID' });
        }

        const logoFile = req.files.logo[0]; // Binary file
        const pdfFile = req.files.pdf[0];   // Binary file
        const formData = {}

        Object.keys(req.body).forEach(key => {
            if (req.body[key] !== undefined && req.body[key] !== null) {
                if (key === 'locations' || key === 'providers' || key === 'kits' || key === 'members' || key === 'owners') {
                    formData[key] = JSON.parse(req.body[key] || '[]');
                } else if (key === 'isSoleOwner' || key === 'isMultipleMember') {
                    formData[key] = req.body[key] === 'true' ? true : false;
                } else {
                    formData[key] = req.body[key];
                }
            }
        });

        // Validate form data
        if (!validateFormData(formData)) {
            return res.status(400).json({ error: 'Invalid form data' });
        }

        const logoBase64 = logoFile.buffer.toString('base64');
        const pdfBase64 = pdfFile.buffer.toString('base64');

        const data = {
            ...formData,
            logo: {
                filename: logoFile.originalname,
                mimetype: logoFile.mimetype,
                fileData: logoBase64
            },
            pdf: {
                filename: pdfFile.originalname,
                mimetype: pdfFile.mimetype,
                fileData: pdfBase64
            }
        }

        // Verify payment status first
        const isPaymentValid = await verifyPaymentStatus(sessionId);

        if (!isPaymentValid) {
            logger.warn('❗ Payment verification failed for session:', sessionId);
            logFailedPayload(data, ['Payment not verified']);
            return res.status(402).json({ error: 'Payment not verified' });
        }

        if (!data || Object.keys(data).length === 0) {
            logger.warn('❗ Received empty request body.');
            return res.status(400).json({ message: 'Request body is empty or invalid' });
        }

        res.status(200).json({ success: true, message: 'Request accepted. Background task queued.' });

        setImmediate(() => {
            fireAppScriptWithRetries(data).catch(err => {
                logger.error('🔥 Unexpected error during background execution:', err);
            });
        });

    } catch (error) {
        logger.error('❌ Error in send-data route:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/create-checkout-session', async (req, res) => {
    try {
        const { priceId, successUrl, cancelUrl, formData } = req.body;

        if(!validateFormData(formData)) {
            return res.json({ success: false, message: "Invalid Form Data"})
        }

        const session = await stripe.checkout.sessions.create({
            line_items: [{
                price: priceId,
                quantity: 1,
            }],
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
        });

        res.json({ success: true, sessionId: session.id });
    } catch (error) {
        console.error('Create checkout session error:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
});

export default router;
