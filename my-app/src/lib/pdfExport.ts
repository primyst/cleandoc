import pdfMake from "pdfmake/build/pdfmake"
import pdfFonts from "pdfmake/build/vfs_fonts"

pdfMake.vfs = pdfFonts.pdfMake.vfs

export async function generatePDF(text: string) {
  // Split text into paragraphs
  const paragraphs = text.split("\n\n").map(p => ({ text: p, margin: [0, 4, 0, 4] }))

  const docDefinition = {
    content: paragraphs,
    defaultStyle: { font: "Helvetica", fontSize: 12 },
  }

  return new Promise<Blob>((resolve) => {
    pdfMake.createPdf(docDefinition).getBlob((blob) => resolve(blob))
  })
}