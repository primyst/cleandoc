import { Document, Packer, Paragraph, HeadingLevel, TextRun } from 'docx'

export async function generateDocx(markdown: string) {
  const lines = markdown.split('\n\n')
  const children: Paragraph[] = []

  for (const line of lines) {
    if (line.startsWith('# ')) {
      children.push(new Paragraph({ text: line.replace('# ', ''), heading: HeadingLevel.HEADING_1 }))
    } else if (line.startsWith('## ')) {
      children.push(new Paragraph({ text: line.replace('## ', ''), heading: HeadingLevel.HEADING_2 }))
    } else if (/^[-*•]\s+/.test(line)) {
      children.push(new Paragraph({ text: line.replace(/^[-*•]\s+/, ''), bullet: { level: 0 } }))
    } else {
      children.push(new Paragraph({ children: [new TextRun({ text: line, font: 'Calibri' })] }))
    }
  }

  const doc = new Document({ sections: [{ properties: {}, children }] })
  const blob = await Packer.toBlob(doc)
  return blob
}