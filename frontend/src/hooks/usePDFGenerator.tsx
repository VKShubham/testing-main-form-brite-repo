import { pdf } from '@react-pdf/renderer'
import { ContractPDF } from '../components/ContractPDF'

export interface StoredFileData {
  name: string
  size: number
  type: string
  dataUrl: string
  lastModified: number
}

export const usePDFGenerator = () => {
  const generatePDF = async (formData: any, signature?: string, briteSignature?: string): Promise<StoredFileData | null> => {
    try {
      // Generate the PDF document
      const pdfDoc = <ContractPDF formData={formData} signature={signature} briteSignature={briteSignature} />
      
      // Convert to blob
      const blob = await pdf(pdfDoc).toBlob()
      
      // Convert blob to data URL
      const reader = new FileReader()
      const dataUrlPromise = new Promise<string>((resolve) => {
        reader.onload = () => {
          resolve(reader.result as string)
        }
        reader.readAsDataURL(blob)
      })
      
      const dataUrl = await dataUrlPromise
      
      // Create StoredFileData object
      const pdfData: StoredFileData = {
        name: `brite-provider-agreement-${Date.now()}.pdf`,
        size: blob.size,
        type: 'application/pdf',
        dataUrl: dataUrl,
        lastModified: new Date().getTime(),
      }
      
      return pdfData
    } catch (error) {
      console.error('Error generating PDF with @react-pdf/renderer:', error)
      throw error
    }
  }

  const downloadPDF = async (formData: any, signature?: string, briteSignature?: string): Promise<StoredFileData | null> => {
    try {
      const pdfData = await generatePDF(formData, signature, briteSignature)
      
      if (pdfData) {
        // Create download link
        const blob = await fetch(pdfData.dataUrl).then(r => r.blob())
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'brite-provider-agreement.pdf'
        link.click()
        setTimeout(() => URL.revokeObjectURL(url), 100)
      }
      
      return pdfData
    } catch (error) {
      console.error('Error downloading PDF:', error)
      throw error
    }
  }

  return {
    generatePDF,
    downloadPDF,
  }
}
