import { Document, Packer, Paragraph, TextRun } from 'docx'

export async function generateDocx(content: string): Promise<Blob> {
  // Split text into paragraphs by double line breaks
  const paragraphs = content.split(/\n\n+/).map((p) => 
    new Paragraph({
      children: [new TextRun({ text: p, font: 'Poppins', size: 24 })],
    })
  )

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  })

  const buffer = await Packer.toBuffer(doc)
  return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
}