import { Document, Packer, Paragraph, HeadingLevel, TextRun } from 'docx'

export async function generateDocx(markdown: string) {
  const lines = markdown.split(/\n{2,}/)
  const paragraphs: Paragraph[] = []

  for (const line of lines) {
    let paragraph

    // Detect Markdown header
    if (line.startsWith('# ')) {
      paragraph = new Paragraph({
        text: line.replace(/^#\s+/, ''),
        heading: HeadingLevel.HEADING_1,
      })
    } else if (line.startsWith('## ')) {
      paragraph = new Paragraph({
        text: line.replace(/^##\s+/, ''),
        heading: HeadingLevel.HEADING_2,
      })
    } else if (/^[-*•]\s+/.test(line)) {
      paragraph = new Paragraph({
        text: line.replace(/^[-*•]\s+/, ''),
        bullet: { level: 0 },
      })
    } else {
      paragraph = new Paragraph({
        children: [new TextRun({ text: line, font: 'Calibri', size: 24 })],
      })
    }

    paragraphs.push(paragraph)
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  return blob
}