"use client"

import { useContext, useEffect, useRef, useState } from "react"
import Footer from "../common/Footer"
import AppContext from "../context/AppContext"
import { AiOutlineReload } from "react-icons/ai"
import { showToast } from "../common/toast"
import Heading from "../common/Heading"
import SignatureModal from "./SignatureModel"
import sign from "../../public/signature.png"
import { usePDFGenerator } from "../hooks/usePDFGenerator"

// Add this interface at the top of the file
interface StoredFileData {
  name: string
  size: number
  type: string
  lastModified: number
  dataUrl: string
}

export default function BriteProviderAgreement() {
  const [currentPage, setCurrentPage] = useState(1)
  const { setStep, formData, setFormData } = useContext(AppContext)
  const totalPages = 9
  const pageRefs = useRef<HTMLDivElement[]>(Array(totalPages).fill(null))
  const containerRef = useRef<HTMLDivElement>(null)
  const [showModal, setShowModal] = useState(false)
  const [signature, setSignature] = useState<string | null>(null)
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  
  // Use the new PDF generator hook
  const { generatePDF: generatePDFWithReactPDF, downloadPDF: downloadPDFWithReactPDF } = usePDFGenerator()

  // Initialize IndexedDB
  useEffect(() => {
    const initIndexedDB = () => {
      const request = indexedDB.open("BriteDB", 1)

      request.onerror = (event) => {
        console.error("IndexedDB error:", event)
        showToast("Failed to initialize database storage", "error")
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create object store for PDF data if it doesn't exist
        if (!db.objectStoreNames.contains("pdfData")) {
          db.createObjectStore("pdfData")
        }
      }
    }

    initIndexedDB()
  }, [])

  // Function to store PDF in IndexedDB
  const storePdfInIndexedDB = async (pdfData: StoredFileData) => {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open("BriteDB", 1)

      request.onerror = (event) => {
        console.error("IndexedDB error:", event)
        reject("Failed to open IndexedDB")
      }

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        const transaction = db.transaction(["pdfData"], "readwrite")
        const store = transaction.objectStore("pdfData")

        // Store the PDF data with a key
        const storeRequest = store.put(pdfData, "currentPdf")

        storeRequest.onsuccess = () => {
          console.log("PDF stored in IndexedDB successfully")
          resolve()
        }

        storeRequest.onerror = (event) => {
          console.error("Error storing PDF in IndexedDB:", event)
          reject("Failed to store PDF in IndexedDB")
        }
      }
    })
  }

  /*
  // Legacy PDF generation functions - replaced with react-pdf/renderer
  // These have been commented out as they depend on html2canvas and jsPDF
  
  // Optimized PDF generation function
  const generatePDF = async (shouldDownload = true) => {
    if (!containerRef.current) {
      showToast("Container reference not found", "error")
      return null
    }

    try {
      setIsGeneratingPdf(true)
      // Initialize PDF with precise dimensions
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
        compress: true, // Enable compression for smaller file size
      })

      // Get PDF dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()

      // Filter out null refs
      const validPageRefs = pageRefs.current.filter((ref) => ref !== null)

      if (validPageRefs.length === 0) {
        showToast("No page references found", "error")
        return null
      }

      // Process each page individually with consistent settings
      for (let i = 0; i < validPageRefs.length; i++) {
        const pageElement = validPageRefs[i]

        // Create a clone of the page for PDF generation
        const clone = pageElement.cloneNode(true) as HTMLElement

        // Create a temporary container for the clone
        const tempContainer = document.createElement("div")
        tempContainer.style.position = "absolute"
        tempContainer.style.left = "-9999px"
        tempContainer.style.width = "8.5in"
        tempContainer.style.backgroundColor = "#ffffff"
        tempContainer.appendChild(clone)
        document.body.appendChild(tempContainer)

        // Style the clone for consistent rendering
        clone.style.width = "8.5in"
        clone.style.minHeight = "11in"
        clone.style.padding = "1in"
        clone.style.margin = "0"
        clone.style.backgroundColor = "#ffffff"
        clone.style.boxShadow = "none"
        clone.style.transform = "none"
        clone.style.position = "relative"

        // Apply consistent styling to all elements in the clone
        const allElements = clone.querySelectorAll("*")
        allElements.forEach((el) => {
          if (el instanceof HTMLElement) {
            // Ensure consistent text color
            el.style.color = "#000000"

            // Remove backgrounds except white
            if (
              el.style.backgroundColor &&
              el.style.backgroundColor !== "white" &&
              el.style.backgroundColor !== "#ffffff"
            ) {
              el.style.backgroundColor = "#ffffff"
            }

            // Ensure consistent font size
            if (el.tagName === "P") {
              el.style.fontSize = "10pt"
              el.style.lineHeight = "1.4"
            } else if (el.tagName === "H1") {
              el.style.fontSize = "16pt"
            } else if (el.tagName === "H2") {
              el.style.fontSize = "12pt"
            } else if (el.classList.contains("text-xs")) {
              el.style.fontSize = "8pt"
            }

            // Ensure consistent font family
            el.style.fontFamily = "Arial, sans-serif"

            // Remove any scrollbars
            el.style.overflow = "visible"
          }
        })

        // Force a repaint before capturing
        await new Promise((resolve) => setTimeout(resolve, 50))

        // Capture with optimized quality settings
        const canvas = await html2canvas(clone, {
          scale: 2, // Reduced scale for smaller file size while maintaining quality
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          logging: false,
        })

        // Clean up the temporary container
        document.body.removeChild(tempContainer)

        // Calculate dimensions to fit the page properly
        const imgWidth = pdfWidth
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        // Add a new page if not the first page
        if (i > 0) {
          pdf.addPage()
        }

        // Add the image to PDF with exact positioning
        pdf.addImage(
          canvas.toDataURL("image/jpeg", 0.85), // Reduced quality for smaller file size
          "JPEG",
          0,
          0,
          imgWidth,
          imgHeight > pdfHeight ? pdfHeight : imgHeight,
          undefined,
          "FAST",
        )

        // Allow time for garbage collection between pages
        await new Promise((resolve) => setTimeout(resolve, 50))
      }

      // Get the PDF as a blob with optimized settings
      const generatedPdfBlob = pdf.output("blob")

      // Convert blob to data URL
      const reader = new FileReader()
      const dataUrlPromise = new Promise<string>((resolve) => {
        reader.onload = () => {
          resolve(reader.result as string)
        }
        reader.readAsDataURL(generatedPdfBlob)
      })

      const dataUrl = await dataUrlPromise

      // Create a StoredFileData object WITH the dataUrl
      const pdfData: StoredFileData = {
        name: `brite-provider-agreement-${Date.now()}.pdf`,
        size: generatedPdfBlob.size,
        type: "application/pdf",
        dataUrl: dataUrl,
        lastModified: new Date().getTime(),
      }

      // Store PDF in IndexedDB
      await storePdfInIndexedDB(pdfData)

      // Update formData with the PDF data including dataUrl
      if (setFormData) {
        setFormData({
          ...formData,
          // pdfAttachment: pdfData,
          pdfGenerated: true,
        })
      }

      // Only download if shouldDownload is true
      if (shouldDownload) {
        // Automatically download the PDF
        const url = URL.createObjectURL(generatedPdfBlob)
        const link = document.createElement("a")
        link.href = url
        link.download = "brite-provider-agreement.pdf"
        link.click()
        setTimeout(() => URL.revokeObjectURL(url), 100)
      }

      return pdfData
    } catch (error) {
      console.error("Error generating PDF:", error)
      showToast("Error generating PDF. Please try again.", "error")
      return null
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  // Alternative PDF generation method as fallback
  const generatePDFAlternative = async (shouldDownload = true) => {
    if (!containerRef.current) return null

    try {
      setIsGeneratingPdf(true)
      // Initialize PDF with optimized settings
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
        compress: true, // Enable compression for smaller file size
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()

      // Process each page with consistent styling
      for (let i = 0; i < pageRefs.current.length; i++) {
        const page = pageRefs.current[i]
        if (!page) continue

        // Apply consistent styling directly to the page for capture
        const originalStyles = {
          fontSize: page.style.fontSize,
          lineHeight: page.style.lineHeight,
          fontFamily: page.style.fontFamily,
          transform: page.style.transform,
          position: page.style.position,
          width: page.style.width,
          height: page.style.height,
          padding: page.style.padding,
          margin: page.style.margin,
          boxShadow: page.style.boxShadow,
        }

        // Apply temporary styles for consistent capture
        page.style.transform = "none"
        page.style.position = "relative"
        page.style.width = "8.5in"
        page.style.padding = "1in"
        page.style.margin = "0"
        page.style.boxShadow = "none"

        // Apply consistent text styling to all elements
        const allElements = page.querySelectorAll("*")
        const originalElementStyles: { el: HTMLElement; styles: Record<string, string> }[] = []

        allElements.forEach((el) => {
          if (el instanceof HTMLElement) {
            // Save original styles
            originalElementStyles.push({
              el,
              styles: {
                color: el.style.color,
                backgroundColor: el.style.backgroundColor,
                fontSize: el.style.fontSize,
                lineHeight: el.style.lineHeight,
                fontFamily: el.style.fontFamily,
                overflow: el.style.overflow,
              },
            })

            // Apply consistent styling
            el.style.color = "#000000"

            if (
              el.style.backgroundColor &&
              el.style.backgroundColor !== "white" &&
              el.style.backgroundColor !== "#ffffff"
            ) {
              el.style.backgroundColor = "#ffffff"
            }

            // Apply consistent font sizes
            if (el.tagName === "P") {
              el.style.fontSize = "10pt"
              el.style.lineHeight = "1.4"
            } else if (el.tagName === "H1") {
              el.style.fontSize = "16pt"
            } else if (el.tagName === "H2") {
              el.style.fontSize = "12pt"
            } else if (el.classList.contains("text-xs")) {
              el.style.fontSize = "8pt"
            }

            el.style.fontFamily = "Arial, sans-serif"
            el.style.overflow = "visible"
          }
        })

        // Force a repaint before capturing
        await new Promise((resolve) => setTimeout(resolve, 50))

        // Capture the page with optimized settings
        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          logging: false,
        })

        // Restore original styles
        Object.entries(originalStyles).forEach(([key, value]) => {
          if (value) page.style[key as any] = value
        })

        // Restore original element styles
        originalElementStyles.forEach(({ el, styles }) => {
          Object.entries(styles).forEach(([key, value]) => {
            if (value) el.style[key as any] = value
          })
        })

        // Calculate dimensions
        const imgWidth = pdfWidth
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        // Add a new page if not the first page
        if (i > 0) {
          pdf.addPage()
        }

        // Add the image to PDF with optimized settings
        pdf.addImage(
          canvas.toDataURL("image/jpeg", 0.85), // Reduced quality for smaller file size
          "JPEG",
          0,
          0,
          imgWidth,
          imgHeight > pdfHeight ? pdfHeight : imgHeight,
        )

        // Allow time for garbage collection
        await new Promise((resolve) => setTimeout(resolve, 50))
      }

      // Get the PDF as a blob
      const generatedPdfBlob = pdf.output("blob")

      // Convert blob to data URL
      const reader = new FileReader()
      const dataUrlPromise = new Promise<string>((resolve) => {
        reader.onload = () => {
          resolve(reader.result as string)
        }
        reader.readAsDataURL(generatedPdfBlob)
      })

      const dataUrl = await dataUrlPromise

      // Create a StoredFileData object WITH the dataUrl
      const pdfData: StoredFileData = {
        name: `brite-provider-agreement-${Date.now()}.pdf`,
        size: generatedPdfBlob.size,
        type: "application/pdf",
        dataUrl: dataUrl,
        lastModified: new Date().getTime(),
      }

      // Store PDF in IndexedDB
      await storePdfInIndexedDB(pdfData)

      // Update formData with the PDF data including dataUrl
      if (setFormData) {
        setFormData({
          ...formData,
          // pdfAttachment: pdfData,
          pdfGenerated: true,
        })
      }

      // Only download if shouldDownload is true
      if (shouldDownload) {
        // Automatically download the PDF
        const url = URL.createObjectURL(generatedPdfBlob)
        const link = document.createElement("a")
        link.href = url
        link.download = "brite-provider-agreement.pdf"
        link.click()
        setTimeout(() => URL.revokeObjectURL(url), 100)
      }

      return pdfData
    } catch (error) {
      console.error("Error in alternative PDF generation:", error)
      showToast("Error generating PDF with alternative method.", "error")
      return null
    } finally {
      setIsGeneratingPdf(false)
    }
  }
  */

  // Function to generate PDF using react-pdf/renderer
  const tryGeneratePDF = async (shouldDownload = false) => {
    try {
      setIsGeneratingPdf(true)
      
      if (shouldDownload) {
        // Generate and download PDF
        const result = await downloadPDFWithReactPDF(formData, signature || undefined, sign)
        
        if (result && setFormData) {

          // Store PDF in IndexedDB
          await storePdfInIndexedDB(result)

          setFormData({
            ...formData,
            pdfGenerated: true,
          })
        }
        
        return result
      } else {
        // Generate PDF without downloading
        const result = await generatePDFWithReactPDF(formData, signature || undefined, sign)
        
        if (result && setFormData) {
          
          // Store PDF in IndexedDB
          await storePdfInIndexedDB(result)
          
          setFormData({
            ...formData,
            pdfGenerated: true,
          })
        }
        
        return result
      }
    } catch (error) {
      console.error("PDF generation failed:", error)
      showToast("Failed to generate PDF. Please try again.", "error")
      return null
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  // Set up intersection observer to detect which page is currently visible
  useEffect(() => {
    const options = {
      root: containerRef.current,
      rootMargin: "0px",
      threshold: 0.1,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const pageIndex = pageRefs.current.findIndex((ref) => ref === entry.target)
          if (pageIndex !== -1) {
            setCurrentPage(pageIndex + 1)
          }
        }
      })
    }, options)

    pageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => {
      pageRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref)
      })
    }
  }, [])

  return (
    <div className="container-home bg-main">
      <Heading text="BRITE-PROVIDER AGREEMENT"></Heading>

      <div className="flex flex-col items-center relative">
        {/* Document container */}
        <div className="mb-2 mx-10 max-h-[calc(100vh-350px)] overflow-auto text-black relative" ref={containerRef}>
          <div className="px-4 bg-main !text-black">
            {/* Page 1 */}
            <div
              className="min-h-[1100px] space-y-6 mb-8 bg-white p-12 shadow-lg"
              ref={(el) => {
                if (el) pageRefs.current[0] = el
              }}
            >
              <h1 className="text-center text-2xl font-bold mb-6">BRITE-PROVIDER AGREEMENT</h1>
              <p className="text-justify">
                This Agreement is entered into as of
                <strong className="mx-1">
                  {new Date()
                    .toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" })
                    .replace(/\//g, "-")}
                </strong>
                ( the "Effective Date") by and between BRITE ("BRITE" or "Us"), a project of the Menopause Method®, Inc.
                ("MM"), 1058 N. Tamiami Trail, Ste 108, Sarasota FL 34236, and <strong>{formData.practiceName}</strong>
                , a health care provider engaging with BRITE either as an individual or as a health care practice that
                employs licensed health care professionals with a principal place of business located at
                <strong>
                  {" "}
                  {formData.locations[0].streetAddress +
                    ", " +
                    (formData.locations[0]?.streetAddressLine2 && formData.locations[0].streetAddressLine2 + ", ") +
                    formData.locations[0]?.city +", "+
                    formData.locations[0]?.state +
                    ", " +
                    formData.locations[0]?.zipCode}
                </strong>
                (hereinafter referred to as "Provider") (collectively referred to as "the Parties").
              </p>
              <p className="text-justify pl-8">
                BRITE is a Service, Software Platform and Pharmaceutical Product fulfillment service that includes
                prescription ordering, tracking and fulfillment; payment services; access to patented materials;
                hormone-focused electronic health records; clinical decision making support tools; and access to patient
                clinical data collection through the BRITE patient membership program providing direct access by
                Provider to the BRITE App and its patient data for the provision of these Services and Products.
              </p>
              <p className="text-justify pl-8">
                Provider operates a health care practice independently or that employs or contracts with licensed health
                care professionals whose scopes of practice include the health care services contemplated by this
                Agreement. Provider's patients shall pay Provider directly for services, inclusive of the cost of
                hormone prescriptions, on a monthly or annual subscription model that includes medical visits for the
                purpose of hormone replacement product prescribing (hereinafter "Patient Subscription"). Provider shall
                pay BRITE for Products and Services per the terms of this Agreement.
              </p>
              <p className="text-justify">
                For good and valuable consideration the Parties agree is sufficient, the Parties agree to the following
                terms and conditions:
              </p>
              <div>
                <h2 className="font-bold">Section 1: Service, Platform Access and Product Fulfillment Fees</h2>
                <p className="text-justify">
                  <span className="font-bold">1.1 Monthly Access Fee.</span> Provider will pay $99 per month per
                  licensed professional to access the BRITE for access to its Services and Software platform. This fee
                  is inclusive of an unlimited number of patients. Access to the BRITE App for patients is co-branded
                  and is included in the price. BRITE will provide access to the BRITE app and fulfill prescription
                  orders for the consideration set forth in this Agreement
                </p>
                <p className="text-justify">
                  <span className="font-bold">1.2 Monthly Product Fees.</span> In addition, Provider will pay BRITE the
                  monthly fee for each patient for the fulfillment of hormonal product orders based upon the number of
                  hormone products ordered on a monthly basis as set forth in the preceding pricing table. The monthly
                  fee is due and payable at the beginning of the month. Patients for whom payment to BRITE is made on an
                  annual basis shall receive a 10% discount. This fee is monthly independent of the frequency at which
                  hormone products are shipped, as they are generally intended to last between one and three months.
                  Neither Provider nor BRITE shall impose additional charges for hormone products and related services
                  on Provider's patients. Provider may determine the monthly or annual fee for the Patient Subscription,
                  except that it shall be commercially reasonable in Provider's market and
                </p>
              </div>
              <div className="text-right text-xs mt-4">
                <p>BRITE-PROVIDER AGREEMENT</p>
                <p>Rev. Date May 2, 2025</p>
                <p>Page 1</p>
              </div>
            </div>

            {/* Page 2 */}
            <div
              className="min-h-[1100px] space-y-6 mb-8 bg-white p-12"
              ref={(el) => {
                if (el) pageRefs.current[1] = el
              }}
            >
              <p className="text-justify">
                not greater than $500 per month ($6,000 per year). The Provider's agreement with their patients shall
                include the term that in the event of early termination, a patient that is on an annual plan will get a
                prorated return if the patient leaves the practice early. Patients who have opted for monthly payments
                will have additional billing terminated. Provider shall give notice to BRITE of patient termination by
                archiving the patient in the BRITE App, which will terminate the hormone product standing orders and
                billing.
              </p>
              <p className="text-justify">
                <span className="font-bold">1.3 Patient Subscription Fee.</span> Provider shall charge their patients a
                Patient Subscription fee that covers their medical services and the cost of BRITE hormone products. The
                fee may be set to include shipping costs that are then paid by Provider to BRITE, or non-inclusive and
                shipping costs would be paid by the patient for each order. The fees to Provider are exclusive of
                shipping costs. Prescriptions are compounded and generally ship within 48 business hours of submission.
                The Patient Subscription fee shall cover all hormonal services and products and Provider shall not
                charge Patient any additional charges for Services or Products. This restriction does not encumber
                Provider's ability to charge Patients for other medical services that are provided; only patient care
                that is directly tied to the prescribing of hormones are included in the subscription cost.
              </p>
              <p className="text-justify">
                <span className="font-bold">1.4</span> BRITE may, at its discretion as may change from time to time,
                make available discounted pharmaceuticals other than hormonal preparations. These prescriptions are not
                part of the subscription model but paid for at the time of purchase at BRITE's then published rate. The
                Provider can either collect and pay directly or elect to have BRITE bill the patient directly, except
                that the fee shall be the same in either event and Provider cannot mark up the cost of these
                prescription items. The Provider can also elect whether to pay shipping or instruct BRITE to bill the
                patient for shipping.
              </p>
              <div>
                <h2 className="font-bold">Section 2: Limited Electronic Health Record</h2>
                <p className="text-justify">
                  <span className="font-bold">2.1 License and Access.</span> BRITE grants Provider a non-exclusive,
                  non-transferable license to access and use the BRITE EHR program during the Term, solely for
                  Provider's health care practice purposes. This license applies to any and all licensed health care
                  practitioners employed or contracted by Provider during their tenure with Provider upon notice of the
                  practitioner to BRITE.
                </p>
                <p className="text-justify">
                  <span className="font-bold">2.2 Designed for Hormonal Practice; EHR Limitations.</span> The BRITE EHR
                  is tailored to support the practice of bioidentical hormone replacement therapies. Provider may, at
                  his or her option and risk, use the EHR for other medical services delivered in addition to hormone
                  prescribing. Its use as a general purpose EHR to document other areas of practice may have
                  limitations. Provider should be aware of these limitations and take necessary steps to ensure proper
                  charting. If Provider adopts to use the BRITE EHR alongside another EHR for other practice
                  specialties, Provider should ensure and is responsible to use the EHRs such that documentation is
                  coordinated and integrated to avoid creating barriers to full access to a patient's
                </p>
              </div>
              <div className="text-right text-xs mt-4">
                <p>BRITE-PROVIDER AGREEMENT</p>
                <p>Rev. Date May 2, 2025</p>
                <p>Page 2</p>
              </div>
            </div>

            {/* Pages 3-9 follow the same pattern - copied from original */}
            {/* Page 3 */}
            <div
              className="min-h-[1100px] space-y-6 mb-8 bg-white p-12"
              ref={(el) => {
                if (el) pageRefs.current[2] = el
              }}
            >
              <p className="text-justify">medical data.</p>
              <p className="text-justify">
                <span className="font-bold">2.3 User Access and Credentials.</span> Provider and its licensed
                practitioners, if any, shall safeguard user credentials and restrict access to authorized personnel
                only.
              </p>
              <p className="text-justify">
                <span className="font-bold">2.4 Support and Maintenance; Data Backups.</span> BRITE shall provide usual
                and customary support, maintenance and implement appropriate safeguards to prevent unauthorized use or
                disclosure of protected health information and shall promptly report any breaches to Provider as
                required by law. While BRITE agrees to perform regular data backups via its cloud service provider,
                Provider is responsible for maintaining independent backups of critical data.
              </p>
              <p className="text-justify">
                <span className="font-bold">2.5 HIPAA Security Guarantees.</span> The BRITE EHR is designed to be and
                compliant with HIPAA security requirements. Provider shall implement administrative, physical, and
                technical safeguards designed to protect the security and confidentiality of Protected Health
                Information ("PHI") at their access points to the EHR as required by HIPAA.
              </p>
              <p className="text-justify pl-8">
                <span className="font-bold">2.5.1</span> Company shall notify the without unreasonable delay (and no
                later than 48 hours) upon discovering a breach or suspected breach of Protected Health Information
                (PHI). Provider retains ultimate responsibility for notifying affected individuals, regulators (e.g.,
                HHS, FTC), and, if applicable, the media, within 60 days of discovery.
              </p>
              <p className="text-justify pl-8">
                <span className="font-bold">2.5.2</span> Company agrees to indemnify the Provider for third-party
                claims, fines, or penalties arising directly from the Company's negligence or failure to comply with
                this agreement, including reimbursement for breach-related costs, including forensic investigations,
                credit monitoring, legal fees, and regulatory fines, provided the breach resulted from the Data
                Company's actions.
              </p>
              <p className="text-justify pl-8">
                <span className="font-bold">2.5.3</span> Company shall maintain HIPAA-compliant safeguards, including
                encryption of PHI at rest and in transit, conduct annual penetration testing and remediate
                vulnerabilities within 30 days, restrict data access to personnel with background checks and role-based
                permissions, provide proof of cybersecurity insurance with a minimum coverage of $5 million per breach,
                covering breach response, regulatory fines, and third-party claims
              </p>
              <p className="text-justify pl-8">
                <span className="font-bold">2.5.4</span> The parties agree to comply with HIPAA and state breach
                notification laws (e.g., California's CCPA).
              </p>
              <div>
                <h2 className="font-bold">Section 3. Payment Terms.</h2>
                <p className="text-justify">
                  <span className="font-bold">3.1 Payment Terms.</span> Fees are due within thirty (30) days of invoice
                  issuance. Late payments are subject to interest at a rate of 1.5% per month or the maximum amount
                  allowed by law, whichever is less.
                </p>
                <p className="text-justify">
                  <span className="font-bold">3.2 Payment Authorization.</span> BRITE requires payment through either
                  Automatic Withdrawal
                </p>
              </div>
              <div className="text-right text-xs mt-4">
                <p>BRITE-PROVIDER AGREEMENT</p>
                <p>Rev. Date May 2, 2025</p>
                <p>Page 3</p>
              </div>
            </div>

            {/* Page 4 */}
            <div
              className="min-h-[1100px] space-y-6 mb-8 bg-white p-12"
              ref={(el) => {
                if (el) pageRefs.current[3] = el
              }}
            >
              <p className="text-justify">
                (ACH) via a valid U.S. financial institution checking account or by way of Visa, MasterCard, Discover or
                American Express credit cards. A valid credit card or U.S. financial institution checking account number
                must be on file with BRITE at all times for the Provider. Either method of payment requires that
                Provider be the authorized signer on the account(s) and that BRITE is authorized to keep this
                information on file. This is a legal agreement between the Provider and BRITE, stating the terms that
                govern Provider's payment obligations to BRITE. If the method of payment is rejected, Provider has three
                days to provide a new payment method. If this is not completed in a timely fashion, BRITE may charge
                interest at the rate of 3% per month. If not resolved in 14 days, BRITE will pause all new prescription
                shipments. This Agreement, together with all updates, additional terms, and all of BRITE's rules and
                policies, collectively constitute the Payment Agreement between the Provider and BRITE. In the event
                Patient submits for products outside of the subscription plan, Provider authorizes BRITE to bill
                Provider's account for any product should BRITE not be able to realize payment directly from patient
                after 15 days of collections activities.
              </p>
              <div>
                <h2 className="font-bold">Section 4: General Terms and Conditions of Use</h2>
                <p className="text-justify">
                  <span className="font-bold">4.1 License and Professional Verifications.</span> Provider will submit
                  all necessary information demonstrating its licensed health care professional(s) possess required
                  licensure in good standing to Exostar's EPCS certification program. Exostar approval is required to
                  engage in the BRITE program. Provider has a continuing obligation to give notice if any change occurs
                  to him or her or its staff's said license or registration. If Provider and/or its licensed
                  practitioner staff intend to order Schedule III-V drugs, Provider shall provide a copy of his, her
                  and/or each such staff member's federal and relevant state CDS registrations. To use the Site to place
                  product orders for patients, Provider represents that he or she or its staff are maintaining
                  appropriate licensure from governmental authorities or regulatory agencies including federal and state
                  CDS registrations for prescribing controlled substances if testosterone or other CDS are ordered.
                  Provider will provide BRITE with their National Provider Identifier (NPI).
                </p>
                <p className="text-justify">
                  <span className="font-bold">4.2 Compliance with State and Local Law.</span> Provider is solely
                  responsible to ensure that the manner in which he or she and/or licensed practitioner staff implement
                  the BRITE program in their practice is in full compliance with all applicable state and local laws as
                  well as any professional or organizational rules or regulations. Provider and licensed practitioner(s)
                  agree that practitioner(s) shall act in accordance with all licensing and ethical standards applicable
                  to health professionals. BRITE takes no responsibility if Provider's participation in the BRITE
                  program is in violation of any of said laws, rules, or regulations. Provider agrees to follow all
                  disclosed Provider terms and conditions, HIPAA requirements, and abide by all state and federal laws
                  as a requirement for maintaining this Agreement. Provider is solely responsible for all compliance
                  obligations. BRITE does not offer any advice about potentially applicable laws or compliance with
                  them. BRITE also does not express any opinions about whether the products or Services are appropriate
                  for your patients.
                </p>
                <p className="text-justify">
                  <span className="font-bold">
                    4.3 Product Reimbursement Not Available for Beneficiaries of Insurance or Medicare/
                  </span>
                </p>
              </div>
              <div className="text-right text-xs mt-4">
                <p>BRITE-PROVIDER AGREEMENT</p>
                <p>Rev. Date May 2, 2025</p>
                <p>Page 4</p>
              </div>
            </div>

            {/* Page 5 */}
            <div
              className="min-h-[1100px] space-y-6 mb-8 bg-white p-12"
              ref={(el) => {
                if (el) pageRefs.current[4] = el
              }}
            >
              <p className="text-justify">
                <span className="font-bold">Medicaid.</span> Provider recognizes that the BRITE ordering application is
                for cash only product orders and may not be submitted to Medicare, medical insurance or other
                third-party payor for reimbursement. Providers and patients waive any third-party reimbursement for
                products purchased via BRITE.
              </p>
              <p className="text-justify">
                <span className="font-bold">4.4 Communication.</span> Neither Provider nor any practitioner shall
                contact any of BRITE's independent compounding pharmacies, laboratories or other subcontractors under
                any circumstances. These entities are contracted by BRITE and all questions and concerns regarding any
                pharmacy order MUST be directed to BRITE at phone and email
              </p>
              <p className="text-justify">
                <span className="font-bold">4.5 Representations; Disclaimer of Liability.</span> Neither Provider nor
                any practitioner shall make any representations, warranties, guarantees, indemnities, commitments, or
                other similar claims actually, apparently, or ostensibly on behalf of BRITE or any compounding pharmacy
                or product manufacturer, distributor or laboratory that are inconsistent with these Terms. BRITE and its
                suppliers and distributor partners disclaim any and all liability for any statements Provider may make
                regarding the products or Services to patients, including any claims that a product or Service diagnoses
                or treats specific diseases or conditions that do not explicitly appear on the product label.
              </p>
              <div>
                <h2 className="font-bold">Section 5: Information Security.</h2>
                <p className="text-justify">
                  <span className="font-bold">5.1 Confidential Information.</span> "Confidential Information" includes
                  all non-public information disclosed by one Party to the other, whether orally or in writing, that is
                  designated as confidential or that reasonably should be understood to be confidential. Each Party
                  agrees to protect Confidential Information with the same level of care it uses to protect its own
                  confidential information, but not less than a reasonable standard of care.
                </p>
                <p className="text-justify">
                  <span className="font-bold">5.2 Intellectual Property.</span> BRITE Services are the intellectual
                  property of and owned by BRITE / Menopause Method, specific services of which are patent pending.
                  Provider agrees that the products and Services BRITE provides to its Providers are for the exclusive
                  use of Provider and patients of Provider and may not be re-sold to any third-party. Any reselling,
                  attempt to reverse engineer or otherwise transfer the intellectual property of BRITE Products or
                  Services to persons or entities other than Provider's then existing patients is expressly forbidden
                  and cause for immediate suspension and/or termination of Provider's BRITE account and for the
                  imposition of damages if so ordered by an arbitrator under Section 9.
                </p>
                <p className="text-justify">
                  <span className="font-bold">5.3 Business Associate Agreement.</span> The Parties shall enter into a
                  Business Associate Agreement ("BAA") in compliance with HIPAA, attached hereto as Exhibit C.
                </p>
              </div>
              <div>
                <h2 className="font-bold">Section 6: Warranty Disclaimers and Limitations of Liability</h2>
                <p className="text-justify">
                  <span className="font-bold">6.1 No Service Warranty.</span> BRITE does not warrant that the Services,
                  including but not limited to the BRITE APP and EHR Services, will be error-free or uninterrupted.
                  Provider assumes all
                </p>
              </div>
              <div className="text-right text-xs mt-4">
                <p>BRITE-PROVIDER AGREEMENT</p>
                <p>Rev. Date May 2, 2025</p>
                <p>Page 5</p>
              </div>
            </div>

            {/* Page 6 */}
            <div
              className="min-h-[1100px] space-y-6 mb-8 bg-white p-12"
              ref={(el) => {
                if (el) pageRefs.current[5] = el
              }}
            >
              <p className="text-justify">
                risks. THE BRITE APP AND EHR PROGRAM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTY OF ANY
                KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. IN NO EVENT SHALL PROVIDER BE LIABLE FOR ANY
                INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO THIS
                AGREEMENT OR THE USE OF THE EHR PROGRAM, EVEN IF PROVIDER HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH
                DAMAGES.
              </p>
              <p className="text-justify">
                <span className="font-bold">6.2 Exclusion of Certain Damages.</span> In no event shall Company A be
                liable for any indirect, incidental, consequential, special, punitive, or exemplary damages, including
                but not limited to loss of profits, revenue, or data, arising out of or in connection with this
                Agreement, even if advised of the possibility of such damages.
              </p>
              <p className="text-justify">
                <span className="font-bold">6.3 Aggregate Liability.</span> BRITE's total cumulative liability arising
                out of or related to this Agreement shall not exceed the Fees paid by Provider to Provider in the twelve
                (12) months preceding the claim.
              </p>
              <p className="text-justify">
                <span className="font-bold">6.4 Limited Product Warranty.</span> The hormone drug and base are provided
                "as is" without any warranty of any kind, expressed or implied. Manufacturer disclaims any and all
                warranties concerning the Drug and Base, including any implied warranties of merchantability, fitness
                for a particular purpose, quality, safety, efficacy, or accuracy. This compounded hormone is provided
                "as is" and without any representation or warranty, express or implied. BRITE, its employees, agents,
                and representatives, specifically disclaim the Warranty of Merchantability: We do not warrant that the
                compounded hormone will meet your requirements or that its use will be uninterrupted or error-free; the
                Warranty of Fitness for a Particular Purpose: We do not warrant that the compounded hormone will be fit
                for your intended purpose. Provider acknowledges and agrees that you have exercised your independent
                judgment in acquiring the compounded hormone and have not relied on any representation we have made
                which has not been stated expressly in this disclaimer or public material produced by us. In the event
                of product defects, BRITE's liability is limited to replacing the Product or refunding the purchase
                price. In no event shall Manufacturer be liable for any direct, indirect, punitive, incidental, or
                consequential damages arising out of or relating to the Drug or Base. This disclaimer is governed by the
                laws of the United States and the Provider's state, and any disputes will be resolved through
                arbitration.
              </p>
              <div>
                <h2 className="font-bold">Section 7: Indemnification/Releases/Waivers</h2>
                <p className="text-justify">
                  <span className="font-bold">7.1 By BRITE.</span> BRITE agrees to indemnify and hold harmless Provider
                  from and against any claims, liabilities, or damages arising from BRITE's breach of this Agreement or
                  violation of applicable laws.
                </p>
              </div>
              <div className="text-right text-xs mt-4">
                <p>BRITE-PROVIDER AGREEMENT</p>
                <p>Rev. Date May 2, 2025</p>
                <p>Page 6</p>
              </div>
            </div>

            {/* Page 7 */}
            <div
              className="min-h-[1100px] space-y-6 mb-8 bg-white p-12"
              ref={(el) => {
                if (el) pageRefs.current[6] = el
              }}
            >
              <p className="text-justify">
                <span className="font-bold">7.2 By Provider.</span> Provider agrees to indemnify and hold harmless BRITE
                from and against any claims arising from Provider's willful misconduct or gross negligence.
              </p>
              <p className="text-justify">
                <span className="font-bold">7.3 Limited Provider Release.</span> Provider releases and discharges BRITE,
                its employees, agents, and representatives, from any and all claims, liabilities, damages, actions,
                causes of action, costs, loss, or expense, including attorney fees, present or future, whether known or
                unknown, anticipated or unanticipated, resulting from or arising out of the compounding, dispensing or
                use of the Drug Products. This release and waiver applies to any and all claims, including but not
                limited to product liability claims, breach of warranty and negligence. Notwithstanding the foregoing,
                if there is substantial evidence that a product deviated from Company's specifications that contributed
                to actual harm to a patient, Company shall indemnify Provider. Any such damages shall be limited to
                actual damages suffered by a patient. Damages to Provider, including but not limited to, lost wages or
                income or damages to reputation are hereby waived.
              </p>
              <div>
                <h2 className="font-bold">
                  Section 8: Optional Access to Evexia Diagnostic Laboratory Ordering System ("EDLOS").
                </h2>
                <p className="text-justify">
                  <span className="font-bold">8.1 Diagnostic Lab Ordering.</span> A Provider electing to use EDLOS
                  services may order via the BRITE / Evexia portal for managing ordering and payment for diagnostic
                  laboratory testing that BRITE makes accessible to opted-in Providers and their patients. Providers who
                  elect to participate in this optional add-on service can access BRITE's negotiated rates for
                  diagnostic laboratory evaluations. Provider recommends appropriate panels/tests to the patient who can
                  submit through BRITE, which acts as a portal to the Evexia Direct-to-Consumer lab order and provision
                  system in those states which allow DTC testing. (Currently all states but New York, New Jersey and
                  Maryland.)
                </p>
                <p className="text-justify">
                  <span className="font-bold">8.2 EDLOS Services.</span> BRITE shall manage all aspects of ordering
                  including creation of requisition slips, tracking, sharing results as agreed by patient with Provider
                  and patient, collecting payment and disbursing to Evexia or other assigned laboratory, agreed
                  interpretation fee to Provider and the portion due BRITE for its services, provide clinical decision
                  and support tools that consider collected patient data, and BRITE guidelines and indications from test
                  results as overseen by BRITE's Chief Medical Officer.
                </p>
                <p className="text-justify">
                  <span className="font-bold">8.3 Payment/Fees.</span> BRITE shall publish to Provider its negotiated
                  discounted rate for diagnostic laboratory services. On Provider's recommendation, their patient may
                  access the ordering system and place orders for diagnostic laboratory services. The patient shall pay
                  the listed price of the lab at the time an order is submitted which will include the lab service fee,
                  a fee for the BRITE clinical decision support tools, and interpretation fee on terms negotiated with
                  Provider. Such fees will be within the usual and customary allowed fees for test interpretation.
                </p>
                <p className="text-justify">
                  <span className="font-bold">8.4 Interpretation Fees.</span> Provider shall set an interpretation fee
                  that is reasonable and customary for the industry and supported by the fair market value of services
                  rendered. 8.5
                </p>
              </div>
              <div className="text-right text-xs mt-4">
                <p>BRITE-PROVIDER AGREEMENT</p>
                <p>Rev. Date May 2, 2025</p>
                <p>Page 7</p>
              </div>
            </div>

            {/* Page 8 */}
            <div
              className="min-h-[1100px] space-y-6 mb-8 bg-white p-12"
              ref={(el) => {
                if (el) pageRefs.current[7] = el
              }}
            >
              <p className="text-justify">
                Lab Testing Reimbursement Not Available for Beneficiaries of Insurance or Medicare/Medicaid. Provider
                recognizes that EDLOS ordering is only for cash orders and may not be submitted to Medicare, medical
                insurance or other third-party payor for reimbursement. Providers and patients waive any third-party
                reimbursement, Orders for labs that may be covered by Medicare, insurance or other third-party payor
                should be submitted directly to a laboratory of the physician's choice.
              </p>
              <div>
                <h2 className="font-bold">Section 9: Dispute Resolution</h2>
                <p className="text-justify">
                  <span className="font-bold">9.1 Dispute Resolution.</span> In the event of a dispute, the Parties
                  shall identify a mediator that is mutually agreeable and confer in good faith to attempt to resolve
                  any dispute arising under this Agreement, including that of termination by either party of this
                  Agreement. The Parties agree that any dispute between the parties which cannot be so resolved, or upon
                  agreement that the matter should proceed directly to arbitration, shall be determined by final and
                  binding arbitration in accordance with the rules of the American Arbitration Association. Each party
                  shall bear its own costs of mediation and arbitration except that the arbitrator may, in the interest
                  of a just result, order the non-prevailing party to be responsible for the prevailing parties fees and
                  costs, including reasonable attorney's fees. The parties agree that the matter may be determined by
                  telephonic and digital means rather than requiring personal appearances.
                </p>
              </div>
              <div>
                <h2 className="font-bold">Section 10: Termination.</h2>
                <p className="text-justify">
                  <span className="font-bold">10.1 Term.</span> This Agreement shall commence on the Effective Date and
                  remain in effect for an initial term of [one (1) year] (the "Initial Term"), renewing automatically
                  for successive one-year terms unless terminated in accordance with this Section.
                </p>
                <p className="text-justify">
                  <span className="font-bold">10.2 Termination at Will.</span> Either Party may terminate this Agreement
                  upon thirty (30) days' written notice.
                </p>
                <p className="text-justify">
                  <span className="font-bold">10.3 Termination for Cause.</span> Either Party may terminate this
                  Agreement immediately if the other Party materially breaches its obligations and fails to cure such
                  breach within ten (10) business days after receipt of written notice
                </p>
                <p className="text-justify">
                  <span className="font-bold">10.4 Effects of Termination.</span> Provider is financially responsible
                  for all products or services ordered even though Provider has requested termination of said account
                </p>
              </div>
              <div>
                <h2 className="font-bold">Section 11: General Provisions</h2>
                <p className="text-justify">
                  <span className="font-bold">11.1 Governing Law.</span> This Agreement shall be governed by the laws of
                  the United States,
                </p>
              </div>
              <div className="text-right text-xs mt-4">
                <p>BRITE-PROVIDER AGREEMENT</p>
                <p>Rev. Date May 2, 2025</p>
                <p>Page 8</p>
              </div>
            </div>

            {/* Page 9 */}
            <div
              className="min-h-[1100px] space-y-6 bg-white p-12"
              ref={(el) => {
                if (el) pageRefs.current[8] = el
              }}
            >
              <p className="text-justify">without regard to any specific state's choice of law principles.</p>
              <p className="text-justify">
                <span className="font-bold">11.2 Entire Agreement.</span> This Agreement, including its Exhibits,
                constitutes the entire agreement between the Parties and supersedes all prior agreements or
                understandings. Amendments. This Agreement may be amended only by a written document signed by both
                Parties.
              </p>
              <p className="text-justify">
                <span className="font-bold">11.3 The Rights of Practitioners within an Entity.</span> Licensed
                practitioners within a Provider shall have the same obligations as the Provider under this Agreement
                when such a reading would give force and effect to the intent of the Agreement.
              </p>
              <p className="text-justify">
                <span className="font-bold">11.4 Assignment.</span> Provider may not assign this Agreement without
                Provider's prior written consent. Provider may assign this Agreement to an affiliate or successor
                without Provider's consent.
              </p>
              <p className="text-justify">
                <span className="font-bold">11.5 Notices.</span> Notices under this Agreement shall be delivered to the
                addresses specified above by certified mail, return receipt requested, or via electronic delivery with
                confirmation of receipt.
              </p>
              <p className="mt-4">
                IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date.
              </p>

              <div className="flex justify-between mt-8">
                <div className="flex justify-between mt-2 w-full">
                  {/* Left: BRITE Provider */}
                  <div className="w-1/2 pr-4 space-y-1">
                    <p className="text-gray-800 font-bold text-base">BRITE :</p>
                    <div>
                      <p className="text-sm font-medium">By: Joshua Rosensweet</p>
                      <p className="text-sm">BRITE/Menopause Method, Inc</p>
                    </div>

                    <img src={sign || "/placeholder.svg"} alt="" className="h-16" />
                    <div className="space-y-1 text-sm">
                      <div className="flex gap-2 text-sm font-medium">
                        Name : <p className="font-normal ml-1">Joshua Rosensweet</p>
                      </div>
                      <div className="flex gap-2 text-sm font-medium">
                        Title : <p className="font-normal ml-1">Vice President</p>
                      </div>
                      <div className="flex gap-2 text-sm font-medium">
                        Date :{" "}
                        <p className="font-normal ml-1">
                          {new Date()
                            .toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            })
                            .replace(/\//g, "-")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Practitioner */}
                  <div className="w-1/2 pl-4 ">
                    <p className="font-bold text-base">PROVIDER :</p>

                    {/* Signature Field */}
                    <div>
                      <div className="flex gap-2 text-sm mt-1">
                        By: <p className="font-semibold ">{formData.fullName}</p>
                      </div>
                    </div>

                    {/* Signature Under Company Name */}
                    <div className="text-sm">
                      <p className="flex gap-2 text-sm font-semibold">{formData.practiceName}</p>
                      <div className="my-2 min-h-[64px] flex items-center justify-between">
                        {signature ? (
                          <div className="flex items-center space-x-2">
                            <img
                              src={signature || "/placeholder.svg"}
                              alt="Company Signature"
                              className={`h-16 rounded ${!isGeneratingPdf && "border-2 border-dotted"}`}
                            />
                            {!isGeneratingPdf && (
                              <AiOutlineReload
                                onClick={() => setShowModal(true)}
                                className="text-lg cursor-pointer hover:text-blue-600"
                              />
                            )}
                          </div>
                        ) : (
                          <div className="border-2 border-dotted border-gray-400 h-16 px-4 flex items-center justify-center">
                            <button
                              onClick={() => setShowModal(true)}
                              className="text-blue-600 hover:text-blue-800"
                              disabled={isGeneratingPdf}
                            >
                              Click to sign here
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 text-sm font-medium">
                      Date :{" "}
                      <p className="font-normal w-1/2">
                        {new Date()
                          .toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          })
                          .replace(/\//g, "-")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-right text-xs mt-8 text-gray-500">
                <p>BRITE-PROVIDER AGREEMENT</p>
                <p>Rev. Date May 2, 2025</p>
                <p>Page 9</p>
              </div>
            </div>
          </div>
        </div>

        {/* Page indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg z-10 text-black">
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      </div>

      {/* Signature Modal */}
      <SignatureModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={(dataUrl: string) => setSignature(dataUrl)}
      />
      <DownloadModal
        show={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        onDownload={async () => {
          try {
            await tryGeneratePDF(true)
            setShowDownloadModal(false)
            setStep(19)
          } catch (error) {
            console.error("Error generating PDF:", error)
            showToast("Error generating PDF. Please try again.", "error")
          }
        }}
        onContinue={async () => {
          try {
            // Generate the PDF in the background but don't download it
            const result = await tryGeneratePDF()

            // Only set pdfGenerated to true if we actually generated a PDF
            if (result && setFormData) {
              setFormData({
                ...formData,
                pdfGenerated: true,
              })
            }

            setShowDownloadModal(false)
            setStep(19)
          } catch (error) {
            console.error("Error generating PDF:", error)
            showToast("Error generating PDF, but continuing to next step.", "warning")
            setShowDownloadModal(false)
            setStep(19)
          }
        }}
        isGeneratingPdf={isGeneratingPdf}
      />
      <Footer
        handleNextStep={async () => {
          if (!signature) {
            showToast("Please sign the document before proceeding.", "error")
            return
          }

          // Show the download modal instead of generating PDF directly
          setShowDownloadModal(true)
        }}
        handlePreviousStep={() => {
          if (formData.isMultipleMember) {
            setStep(17)
          } else {
            setStep(16)
          }
        }}
      />
    </div>
  )
}

function DownloadModal({ show, onDownload, onContinue, isGeneratingPdf }:any) {
  if (!show) return null

  const [isDownloading, setIsDownloading] = useState(false)

  return (
    <div className="fixed inset-0 text-black bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Keep a copy of the contract</h2>
        <p className="mb-6">Would you like to download the a copy of this signed agreement for your records ? </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
         
            {isGeneratingPdf ? (
            !isDownloading && 
             <button
            onClick={onContinue}
            disabled={isGeneratingPdf}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
             <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
              </button>
            ) : (
               <button
            onClick={onContinue}
            disabled={isGeneratingPdf}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
              Continue Without Download
                 </button>
            )}
       

         
            {isGeneratingPdf ? (
              isDownloading &&(

                 <button
            onClick={()=>{onDownload();setIsDownloading(true);}}
            disabled={isGeneratingPdf}
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
                  <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating PDF...
              </span>
              </button>
              )
            
            ) : (
               <button
            onClick={()=>{onDownload();setIsDownloading(true);}}
            disabled={isGeneratingPdf}
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
              Download PDF
               </button>
            )}
     
        </div>
      </div>
    </div>
  )
}
