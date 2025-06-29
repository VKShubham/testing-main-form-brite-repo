import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import route from './routes/index.js';

const app = express();

// Increase limit to handle large base64 data
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(express.json({ limit: '20mb' }));

app.use(cors({
    origin: process.env.VITE_FRONTEND_URL || 'http://localhost:5173', 
    credentials: true
}));

app.use('/', route);

app.listen(3000, () => {
    console.log(`Server Listening on ${process.env.NODE_PORT}`);
});
