import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'

// Define styles for the PDF
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: 48, // 1 inch padding (72 points = 1 inch, so 48 points ≈ 0.67 inch)
        fontSize: 10,
        lineHeight: 1,
        fontFamily: 'Helvetica',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 24,
        fontFamily: 'Helvetica-Bold',
    },
    heading: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
        fontFamily: 'Helvetica-Bold',
    },
    paragraph: {
        marginBottom: 12,
        textAlign: 'justify',
        lineHeight: 1,
    },
    indentedParagraph: {
        marginBottom: 12,
        textAlign: 'justify',
        lineHeight: 1,
        paddingLeft: 24,
    },
    bold: {
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        right: 72,
        fontSize: 8,
        textAlign: 'right',
    },
    signatureSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 32,
        marginBottom: 32,
    },
    signatureBlock: {
        width: '45%',
    },
    signatureTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: 'Helvetica-Bold',
    },
    signatureImage: {
        width: 120,
        height: 64,
        marginVertical: 2,
    },
    signatureLine: {
        borderBottom: '1 solid black',
        height: 48,
        marginBottom: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    signatureText: {
        fontSize: 9,
        marginBottom: 4,
    },
    witnessText: {
        marginTop: 8,
        fontSize: 10,
        textAlign: 'justify',
    },
})

interface ContractPDFProps {
    formData: any
    signature?: string
    briteSignature?: string
}

export const ContractPDF: React.FC<ContractPDFProps> = ({ formData, signature, briteSignature }) => {
    const currentDate = new Date()
        .toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" })
        .replace(/\//g, "-")

    const practiceAddress = formData.locations && formData.locations[0]
        ? `${formData.locations[0].streetAddress}, ${formData.locations[0]?.streetAddressLine2 ? formData.locations[0].streetAddressLine2 + ", " : ""
        }${formData.locations[0]?.city}, ${formData.locations[0]?.state}, ${formData.locations[0]?.zipCode}`
        : ""

    return (
        <Document>
            {/* Page 1 */}
            <Page size="A4" style={styles.page}>
                <Text style={styles.title}>BRITE-PROVIDER AGREEMENT</Text>

                <Text style={styles.paragraph}>
                    This Agreement is entered into as of <Text style={styles.bold}>{currentDate}</Text> (the "Effective Date") by and between BRITE ("BRITE" or "Us"), a project of the Menopause Method®, Inc. ("MM"), 1058 N. Tamiami Trail, Ste 108, Sarasota FL 34236, and <Text style={styles.bold}>{formData.practiceName}</Text>, a health care provider engaging with BRITE either as an individual or as a health care practice that employs licensed health care professionals with a principal place of business located at <Text style={styles.bold}>{practiceAddress}</Text> (hereinafter referred to as "Provider") (collectively referred to as "the Parties").
                </Text>

                <Text style={styles.indentedParagraph}>
                    BRITE is a Service, Software Platform and Pharmaceutical Product fulfillment service that includes prescription ordering, tracking and fulfillment; payment services; access to patented materials; hormone-focused electronic health records; clinical decision making support tools; and access to patient clinical data collection through the BRITE patient membership program providing direct access by Provider to the BRITE App and its patient data for the provision of these Services and Products.
                </Text>

                <Text style={styles.indentedParagraph}>
                    Provider operates a health care practice independently or that employs or contracts with licensed health care professionals whose scopes of practice include the health care services contemplated by this Agreement. Provider's patients shall pay Provider directly for services, inclusive of the cost of hormone prescriptions, on a monthly or annual subscription model that includes medical visits for the purpose of hormone replacement product prescribing (hereinafter "Patient Subscription"). Provider shall pay BRITE for Products and Services per the terms of this Agreement.
                </Text>

                <Text style={styles.paragraph}>
                    For good and valuable consideration the Parties agree is sufficient, the Parties agree to the following terms and conditions:
                </Text>

                <Text style={styles.heading}>Section 1: Service, Platform Access and Product Fulfillment Fees</Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>1.1 Monthly Access Fee.</Text> Provider will pay $99 per month per licensed professional to access the BRITE for access to its Services and Software platform. This fee is inclusive of an unlimited number of patients. Access to the BRITE App for patients is co-branded and is included in the price. BRITE will provide access to the BRITE app and fulfill prescription orders for the consideration set forth in this Agreement
                </Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>1.2 Monthly Product Fees.</Text> In addition, Provider will pay BRITE the monthly fee for each patient for the fulfillment of hormonal product orders based upon the number of hormone products ordered on a monthly basis as set forth in the preceding pricing table. The monthly fee is due and payable at the beginning of the month. Patients for whom payment to BRITE is made on an annual basis shall receive a 10% discount. This fee is monthly independent of the frequency at which hormone products are shipped, as they are generally intended to last between one and three months. Neither Provider nor BRITE shall impose additional charges for hormone products and related services on Provider's patients. Provider may determine the monthly or annual fee for the Patient Subscription, except that it shall be commercially reasonable in Provider's market and
                </Text>

                <View style={styles.footer}>
                    <Text>BRITE-PROVIDER AGREEMENT</Text>
                    <Text>Rev. Date May 2, 2025</Text>
                    <Text>Page 1</Text>
                </View>
            </Page>

            {/* Page 2 */}
            <Page size="A4" style={styles.page}>
                <Text style={styles.paragraph}>
                    not greater than $500 per month ($6,000 per year). The Provider's agreement with their patients shall include the term that in the event of early termination, a patient that is on an annual plan will get a prorated return if the patient leaves the practice early. Patients who have opted for monthly payments will have additional billing terminated. Provider shall give notice to BRITE of patient termination by archiving the patient in the BRITE App, which will terminate the hormone product standing orders and billing.
                </Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>1.3 Patient Subscription Fee.</Text> Provider shall charge their patients a Patient Subscription fee that covers their medical services and the cost of BRITE hormone products. The fee may be set to include shipping costs that are then paid by Provider to BRITE, or non-inclusive and shipping costs would be paid by the patient for each order. The fees to Provider are exclusive of shipping costs. Prescriptions are compounded and generally ship within 48 business hours of submission. The Patient Subscription fee shall cover all hormonal services and products and Provider shall not charge Patient any additional charges for Services or Products. This restriction does not encumber Provider's ability to charge Patients for other medical services that are provided; only patient care that is directly tied to the prescribing of hormones are included in the subscription cost.
                </Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>1.4</Text> BRITE may, at its discretion as may change from time to time, make available discounted pharmaceuticals other than hormonal preparations. These prescriptions are not part of the subscription model but paid for at the time of purchase at BRITE's then published rate. The Provider can either collect and pay directly or elect to have BRITE bill the patient directly, except that the fee shall be the same in either event and Provider cannot mark up the cost of these prescription items. The Provider can also elect whether to pay shipping or instruct BRITE to bill the patient for shipping.
                </Text>

                <Text style={styles.heading}>Section 2: Limited Electronic Health Record</Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>2.1 License and Access.</Text> BRITE grants Provider a non-exclusive, non-transferable license to access and use the BRITE EHR program during the Term, solely for Provider's health care practice purposes. This license applies to any and all licensed health care practitioners employed or contracted by Provider during their tenure with Provider upon notice of the practitioner to BRITE.
                </Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>2.2 Designed for Hormonal Practice; EHR Limitations.</Text> The BRITE EHR is tailored to support the practice of bioidentical hormone replacement therapies. Provider may, at his or her option and risk, use the EHR for other medical services delivered in addition to hormone prescribing. Its use as a general purpose EHR to document other areas of practice may have limitations. Provider should be aware of these limitations and take necessary steps to ensure proper charting. If Provider adopts to use the BRITE EHR alongside another EHR for other practice specialties, Provider should ensure and is responsible to use the EHRs such that documentation is coordinated and integrated to avoid creating barriers to full access to a patient's
                </Text>

                <View style={styles.footer}>
                    <Text>BRITE-PROVIDER AGREEMENT</Text>
                    <Text>Rev. Date May 2, 2025</Text>
                    <Text>Page 2</Text>
                </View>
            </Page>

            {/* Page 3 */}
            <Page size="A4" style={styles.page}>
                <Text style={styles.paragraph}>medical data.</Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>2.3 User Access and Credentials.</Text> Provider and its licensed practitioners, if any, shall safeguard user credentials and restrict access to authorized personnel only.
                </Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>2.4 Support and Maintenance; Data Backups.</Text> BRITE shall provide usual and customary support, maintenance and implement appropriate safeguards to prevent unauthorized use or disclosure of protected health information and shall promptly report any breaches to Provider as required by law. While BRITE agrees to perform regular data backups via its cloud service provider, Provider is responsible for maintaining independent backups of critical data.
                </Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>2.5 HIPAA Security Guarantees.</Text> The BRITE EHR is designed to be and compliant with HIPAA security requirements. Provider shall implement administrative, physical, and technical safeguards designed to protect the security and confidentiality of Protected Health Information ("PHI") at their access points to the EHR as required by HIPAA.
                </Text>

                <Text style={styles.indentedParagraph}>
                    <Text style={styles.bold}>2.5.1</Text> Company shall notify the without unreasonable delay (and no later than 48 hours) upon discovering a breach or suspected breach of Protected Health Information (PHI). Provider retains ultimate responsibility for notifying affected individuals, regulators (e.g., HHS, FTC), and, if applicable, the media, within 60 days of discovery.
                </Text>

                <Text style={styles.indentedParagraph}>
                    <Text style={styles.bold}>2.5.2</Text> Company agrees to indemnify the Provider for third-party claims, fines, or penalties arising directly from the Company's negligence or failure to comply with this agreement, including reimbursement for breach-related costs, including forensic investigations, credit monitoring, legal fees, and regulatory fines, provided the breach resulted from the Data Company's actions.
                </Text>

                <Text style={styles.indentedParagraph}>
                    <Text style={styles.bold}>2.5.3</Text> Company shall maintain HIPAA-compliant safeguards, including encryption of PHI at rest and in transit, conduct annual penetration testing and remediate vulnerabilities within 30 days, restrict data access to personnel with background checks and role-based permissions, provide proof of cybersecurity insurance with a minimum coverage of $5 million per breach, covering breach response, regulatory fines, and third-party claims
                </Text>

                <Text style={styles.indentedParagraph}>
                    <Text style={styles.bold}>2.5.4</Text> The parties agree to comply with HIPAA and state breach notification laws (e.g., California's CCPA).
                </Text>

                <Text style={styles.heading}>Section 3. Payment Terms.</Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>3.1 Payment Terms.</Text> Fees are due within thirty (30) days of invoice issuance. Late payments are subject to interest at a rate of 1.5% per month or the maximum amount allowed by law, whichever is less.
                </Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>3.2 Payment Authorization.</Text> BRITE requires payment through either Automatic Withdrawal
                </Text>

                <View style={styles.footer}>
                    <Text>BRITE-PROVIDER AGREEMENT</Text>
                    <Text>Rev. Date May 2, 2025</Text>
                    <Text>Page 3</Text>
                </View>
            </Page>

            {/* Page 4 */}
            <Page size="A4" style={styles.page}>
                <Text style={styles.paragraph}>
                    (ACH) via a valid U.S. financial institution checking account or by way of Visa, MasterCard, Discover or American Express credit cards. A valid credit card or U.S. financial institution checking account number must be on file with BRITE at all times for the Provider. Either method of payment requires that Provider be the authorized signer on the account(s) and that BRITE is authorized to keep this information on file. This is a legal agreement between the Provider and BRITE, stating the terms that govern Provider's payment obligations to BRITE. If the method of payment is rejected, Provider has three days to provide a new payment method. If this is not completed in a timely fashion, BRITE may charge interest at the rate of 3% per month. If not resolved in 14 days, BRITE will pause all new prescription shipments. This Agreement, together with all updates, additional terms, and all of BRITE's rules and policies, collectively constitute the Payment Agreement between the Provider and BRITE. In the event Patient submits for products outside of the subscription plan, Provider authorizes BRITE to bill Provider's account for any product should BRITE not be able to realize payment directly from patient after 15 days of collections activities.
                </Text>

                <Text style={styles.heading}>Section 4: General Terms and Conditions of Use</Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>4.1 License and Professional Verifications.</Text> Provider will submit all necessary information demonstrating its licensed health care professional(s) possess required licensure in good standing to Exostar's EPCS certification program. Exostar approval is required to engage in the BRITE program. Provider has a continuing obligation to give notice if any change occurs to him or her or its staff's said license or registration. If Provider and/or its licensed practitioner staff intend to order Schedule III-V drugs, Provider shall provide a copy of his, her and/or each such staff member's federal and relevant state CDS registrations. To use the Site to place product orders for patients, Provider represents that he or she or its staff are maintaining appropriate licensure from governmental authorities or regulatory agencies including federal and state CDS registrations for prescribing controlled substances if testosterone or other CDS are ordered. Provider will provide BRITE with their National Provider Identifier (NPI).
                </Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>4.2 Compliance with State and Local Law.</Text> Provider is solely responsible to ensure that the manner in which he or she and/or licensed practitioner staff implement the BRITE program in their practice is in full compliance with all applicable state and local laws as well as any professional or organizational rules or regulations. Provider and licensed practitioner(s) agree that practitioner(s) shall act in accordance with all licensing and ethical standards applicable to health professionals. BRITE takes no responsibility if Provider's participation in the BRITE program is in violation of any of said laws, rules, or regulations. Provider agrees to follow all disclosed Provider terms and conditions, HIPAA requirements, and abide by all state and federal laws as a requirement for maintaining this Agreement. Provider is solely responsible for all compliance obligations. BRITE does not offer any advice about potentially applicable laws or compliance with them. BRITE also does not express any opinions about whether the products or Services are appropriate for your patients.
                </Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>4.3 Product Reimbursement Not Available for Beneficiaries of Insurance or Medicare/</Text>
                </Text>

                <View style={styles.footer}>
                    <Text>BRITE-PROVIDER AGREEMENT</Text>
                    <Text>Rev. Date May 2, 2025</Text>
                    <Text>Page 4</Text>
                </View>
            </Page>

            {/* Page 5 */}
            <Page size="A4" style={styles.page}>
                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>Medicaid.</Text> Provider recognizes that the BRITE ordering application is for cash only product orders and may not be submitted to Medicare, medical insurance or other third-party payor for reimbursement. Providers and patients waive any third-party reimbursement for products purchased via BRITE.
                </Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>4.4 Communication.</Text> Neither Provider nor any practitioner shall contact any of BRITE's independent compounding pharmacies, laboratories or other subcontractors under any circumstances. These entities are contracted by BRITE and all questions and concerns regarding any pharmacy order MUST be directed to BRITE at phone and email
                </Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>4.5 Representations; Disclaimer of Liability.</Text> Neither Provider nor any practitioner shall make any representations, warranties, guarantees, indemnities, commitments, or other similar claims actually, apparently, or ostensibly on behalf of BRITE or any compounding pharmacy or product manufacturer, distributor or laboratory that are inconsistent with these Terms. BRITE and its suppliers and distributor partners disclaim any and all liability for any statements Provider may make regarding the products or Services to patients, including any claims that a product or Service diagnoses or treats specific diseases or conditions that do not explicitly appear on the product label.
                </Text>

                <Text style={styles.heading}>Section 5: Information Security.</Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>5.1 Confidential Information.</Text> "Confidential Information" includes all non-public information disclosed by one Party to the other, whether orally or in writing, that is designated as confidential or that reasonably should be understood to be confidential. Each Party agrees to protect Confidential Information with the same level of care it uses to protect its own confidential information, but not less than a reasonable standard of care.
                </Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>5.2 Intellectual Property.</Text> BRITE Services are the intellectual property of and owned by BRITE / Menopause Method, specific services of which are patent pending. Provider agrees that the products and Services BRITE provides to its Providers are for the exclusive use of Provider and patients of Provider and may not be re-sold to any third-party. Any reselling, attempt to reverse engineer or otherwise transfer the intellectual property of BRITE Products or Services to persons or entities other than Provider's then existing patients is expressly forbidden and cause for immediate suspension and/or termination of Provider's BRITE account and for the imposition of damages if so ordered by an arbitrator under Section 9.
                </Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>5.3 Business Associate Agreement.</Text> The Parties shall enter into a Business Associate Agreement ("BAA") in compliance with HIPAA, attached hereto as Exhibit C.
                </Text>

                <Text style={styles.heading}>Section 6: Warranty Disclaimers and Limitations of Liability</Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>6.1 No Service Warranty.</Text> BRITE does not warrant that the Services, including but not limited to the BRITE APP and EHR Services, will be error-free or uninterrupted. Provider assumes all
                </Text>

                <View style={styles.footer}>
                    <Text>BRITE-PROVIDER AGREEMENT</Text>
                    <Text>Rev. Date May 2, 2025</Text>
                    <Text>Page 5</Text>
                </View>
            </Page>

            {/* Page 6 */}
            <Page size="A4" style={styles.page}>
                <Text style={styles.paragraph}>
                    risks. THE BRITE APP AND EHR PROGRAM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. IN NO EVENT SHALL PROVIDER BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO THIS AGREEMENT OR THE USE OF THE EHR PROGRAM, EVEN IF PROVIDER HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                </Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>6.2 Exclusion of Certain Damages.</Text> In no event shall Company A be liable for any indirect, incidental, consequential, special, punitive, or exemplary damages, including but not limited to loss of profits, revenue, or data, arising out of or in connection with this Agreement, even if advised of the possibility of such damages.
                </Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>6.3 Aggregate Liability.</Text> BRITE's total cumulative liability arising out of or related to this Agreement shall not exceed the Fees paid by Provider to Provider in the twelve (12) months preceding the claim.
                </Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>6.4 Limited Product Warranty.</Text> The hormone drug and base are provided "as is" without any warranty of any kind, expressed or implied. Manufacturer disclaims any and all warranties concerning the Drug and Base, including any implied warranties of merchantability, fitness for a particular purpose, quality, safety, efficacy, or accuracy. This compounded hormone is provided "as is" and without any representation or warranty, express or implied. BRITE, its employees, agents, and representatives, specifically disclaim the Warranty of Merchantability: We do not warrant that the compounded hormone will meet your requirements or that its use will be uninterrupted or error-free; the Warranty of Fitness for a Particular Purpose: We do not warrant that the compounded hormone will be fit for your intended purpose. Provider acknowledges and agrees that you have exercised your independent judgment in acquiring the compounded hormone and have not relied on any representation we have made which has not been stated expressly in this disclaimer or public material produced by us. In the event of product defects, BRITE's liability is limited to replacing the Product or refunding the purchase price. In no event shall Manufacturer be liable for any direct, indirect, punitive, incidental, or consequential damages arising out of or relating to the Drug or Base. This disclaimer is governed by the laws of the United States and the Provider's state, and any disputes will be resolved through arbitration.
                </Text>

                <Text style={styles.heading}>Section 7: Indemnification/Releases/Waivers</Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>7.1 By BRITE.</Text> BRITE agrees to indemnify and hold harmless Provider from and against any claims, liabilities, or damages arising from BRITE's breach of this Agreement or violation of applicable laws.
                </Text>

                <View style={styles.footer}>
                    <Text>BRITE-PROVIDER AGREEMENT</Text>
                    <Text>Rev. Date May 2, 2025</Text>
                    <Text>Page 6</Text>
                </View>
            </Page>

            {/* Page 7 */}
            <Page size="A4" style={styles.page}>
                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>7.2 By Provider.</Text> Provider agrees to indemnify and hold harmless BRITE from and against any claims arising from Provider's willful misconduct or gross negligence.
                </Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>7.3 Limited Provider Release.</Text> Provider releases and discharges BRITE, its employees, agents, and representatives, from any and all claims, liabilities, damages, actions, causes of action, costs, loss, or expense, including attorney fees, present or future, whether known or unknown, anticipated or unanticipated, resulting from or arising out of the compounding, dispensing or use of the Drug Products. This release and waiver applies to any and all claims, including but not limited to product liability claims, breach of warranty and negligence. Notwithstanding the foregoing, if there is substantial evidence that a product deviated from Company's specifications that contributed to actual harm to a patient, Company shall indemnify Provider. Any such damages shall be limited to actual damages suffered by a patient. Damages to Provider, including but not limited to, lost wages or income or damages to reputation are hereby waived.
                </Text>

                <Text style={styles.heading}>Section 8: Optional Access to Evexia Diagnostic Laboratory Ordering System ("EDLOS").</Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>8.1 Diagnostic Lab Ordering.</Text> A Provider electing to use EDLOS services may order via the BRITE / Evexia portal for managing ordering and payment for diagnostic laboratory testing that BRITE makes accessible to opted-in Providers and their patients. Providers who elect to participate in this optional add-on service can access BRITE's negotiated rates for diagnostic laboratory evaluations. Provider recommends appropriate panels/tests to the patient who can submit through BRITE, which acts as a portal to the Evexia Direct-to-Consumer lab order and provision system in those states which allow DTC testing. (Currently all states but New York, New Jersey and Maryland.)
                </Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>8.2 EDLOS Services.</Text> BRITE shall manage all aspects of ordering including creation of requisition slips, tracking, sharing results as agreed by patient with Provider and patient, collecting payment and disbursing to Evexia or other assigned laboratory, agreed interpretation fee to Provider and the portion due BRITE for its services, provide clinical decision and support tools that consider collected patient data, and BRITE guidelines and indications from test results as overseen by BRITE's Chief Medical Officer.
                </Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>8.3 Payment/Fees.</Text> BRITE shall publish to Provider its negotiated discounted rate for diagnostic laboratory services. On Provider's recommendation, their patient may access the ordering system and place orders for diagnostic laboratory services. The patient shall pay the listed price of the lab at the time an order is submitted which will include the lab service fee, a fee for the BRITE clinical decision support tools, and interpretation fee on terms negotiated with Provider. Such fees will be within the usual and customary allowed fees for test interpretation.
                </Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>8.4 Interpretation Fees.</Text> Provider shall set an interpretation fee that is reasonable and customary for the industry and supported by the fair market value of services rendered. 8.5
                </Text>

                <View style={styles.footer}>
                    <Text>BRITE-PROVIDER AGREEMENT</Text>
                    <Text>Rev. Date May 2, 2025</Text>
                    <Text>Page 7</Text>
                </View>
            </Page>

            {/* Page 8 */}
            <Page size="A4" style={styles.page}>
                <Text style={styles.paragraph}>
                    Lab Testing Reimbursement Not Available for Beneficiaries of Insurance or Medicare/Medicaid. Provider recognizes that EDLOS ordering is only for cash orders and may not be submitted to Medicare, medical insurance or other third-party payor for reimbursement. Providers and patients waive any third-party reimbursement, Orders for labs that may be covered by Medicare, insurance or other third-party payor should be submitted directly to a laboratory of the physician's choice.
                </Text>

                <Text style={styles.heading}>Section 9: Dispute Resolution</Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>9.1 Dispute Resolution.</Text> In the event of a dispute, the Parties shall identify a mediator that is mutually agreeable and confer in good faith to attempt to resolve any dispute arising under this Agreement, including that of termination by either party of this Agreement. The Parties agree that any dispute between the parties which cannot be so resolved, or upon agreement that the matter should proceed directly to arbitration, shall be determined by final and binding arbitration in accordance with the rules of the American Arbitration Association. Each party shall bear its own costs of mediation and arbitration except that the arbitrator may, in the interest of a just result, order the non-prevailing party to be responsible for the prevailing parties fees and costs, including reasonable attorney's fees. The parties agree that the matter may be determined by telephonic and digital means rather than requiring personal appearances.
                </Text>

                <Text style={styles.heading}>Section 10: Termination.</Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>10.1 Term.</Text> This Agreement shall commence on the Effective Date and remain in effect for an initial term of [one (1) year] (the "Initial Term"), renewing automatically for successive one-year terms unless terminated in accordance with this Section.
                </Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>10.2 Termination at Will.</Text> Either Party may terminate this Agreement upon thirty (30) days' written notice.
                </Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>10.3 Termination for Cause.</Text> Either Party may terminate this Agreement immediately if the other Party materially breaches its obligations and fails to cure such breach within ten (10) business days after receipt of written notice
                </Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>10.4 Effects of Termination.</Text> Provider is financially responsible for all products or services ordered even though Provider has requested termination of said account
                </Text>

                <Text style={styles.heading}>Section 11: General Provisions</Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>11.1 Governing Law.</Text> This Agreement shall be governed by the laws of the United States,
                </Text>

                <View style={styles.footer}>
                    <Text>BRITE-PROVIDER AGREEMENT</Text>
                    <Text>Rev. Date May 2, 2025</Text>
                    <Text>Page 8</Text>
                </View>
            </Page>

            {/* Page 9 - Final page with signatures */}
            <Page size="A4" style={styles.page}>
                <Text style={styles.paragraph}>without regard to any specific state's choice of law principles.</Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>11.2 Entire Agreement.</Text> This Agreement, including its Exhibits, constitutes the entire agreement between the Parties and supersedes all prior agreements or understandings. Amendments. This Agreement may be amended only by a written document signed by both Parties.
                </Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>11.3 The Rights of Practitioners within an Entity.</Text> Licensed practitioners within a Provider shall have the same obligations as the Provider under this Agreement when such a reading would give force and effect to the intent of the Agreement.
                </Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>11.4 Assignment.</Text> Provider may not assign this Agreement without Provider's prior written consent. Provider may assign this Agreement to an affiliate or successor without Provider's consent.
                </Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>11.5 Notices.</Text> Notices under this Agreement shall be delivered to the addresses specified above by certified mail, return receipt requested, or via electronic delivery with confirmation of receipt.
                </Text>

                <Text style={styles.witnessText}>
                    IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date.
                </Text>

                <View style={styles.signatureSection}>
                    {/* BRITE Signature Block */}
                    <View style={styles.signatureBlock}>
                        <Text style={styles.signatureTitle}>BRITE :</Text>
                        <Text style={styles.signatureText}>By: Joshua Rosensweet</Text>
                        <Text style={styles.signatureText}>BRITE/Menopause Method, Inc</Text>

                        {briteSignature ? (
                            <Image style={styles.signatureImage} src={briteSignature} />
                        ) : (
                            <View style={styles.signatureLine}>
                                <Text style={{ fontSize: 8 }}>Signature</Text>
                            </View>
                        )}

                        <Text style={styles.signatureText}>Name: Joshua Rosensweet</Text>
                        <Text style={styles.signatureText}>Title: Vice President</Text>
                        <Text style={styles.signatureText}>Date: {currentDate}</Text>
                    </View>

                    {/* Provider Signature Block */}
                    <View style={styles.signatureBlock}>
                        <Text style={styles.signatureTitle}>PROVIDER :</Text>
                        <Text style={styles.signatureText}>By: {formData.fullName}</Text>
                        <Text style={styles.signatureText}>{formData.practiceName}</Text>

                        {signature ? (
                            <Image style={styles.signatureImage} src={signature} />
                        ) : (
                            <View style={styles.signatureLine}>
                                <Text style={{ fontSize: 8 }}>Signature Required</Text>
                            </View>
                        )}

                        <Text style={styles.signatureText}>Date: {currentDate}</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text>BRITE-PROVIDER AGREEMENT</Text>
                    <Text>Rev. Date May 2, 2025</Text>
                    <Text>Page 9</Text>
                </View>
            </Page>
        </Document>
    )
}

export default ContractPDF
