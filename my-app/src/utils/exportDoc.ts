import { Document, Packer, Paragraph, HeadingLevel, TextRun } from "docx"

export async function generateDocx(markdown: string) {
  const lines = markdown.split("\n\n")
  const doc = new Document()

  lines.forEach(line => {
    let paragraph

    // Detect Markdown header
    if (line.startsWith("# ")) {
      paragraph = new Paragraph({
        text: line.replace("# ", ""),
        heading: HeadingLevel.HEADING_1,
      })
    } else if (line.startsWith("## ")) {
      paragraph = new Paragraph({
        text: line.replace("## ", ""),
        heading: HeadingLevel.HEADING_2,
      })
    } else if (/^[-*•]\s+/.test(line)) {
      paragraph = new Paragraph({
        text: line.replace(/^[-*•]\s+/, ""),
        bullet: { level: 0 },
      })
    } else {
      paragraph = new Paragraph({
        children: [new TextRun({ text: line, font: "Calibri" })],
      })
    }

    doc.addSection({
      properties: {},
      children: [paragraph],
    })
  })

  const blob = await Packer.toBlob(doc)
  return blob
}