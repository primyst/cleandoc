import { NextResponse } from 'next/server'
import Tesseract from 'tesseract.js'
import pdfParse from 'pdf-parse'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  let extractedText = ''

  try {
    if (file.name.endsWith('.pdf')) {
      const data = await pdfParse(buffer)
      extractedText = data.text
    } else {
      const result = await Tesseract.recognize(buffer, 'eng')
      extractedText = result.data.text
    }

    // --- Phase 3: Header & Section Detection ---
    const lines = extractedText.split('\n').map(line => line.trim()).filter(Boolean)
    const headers: string[] = []
    const sections: { title: string; content: string }[] = []

    let currentHeader = 'General'
    let currentContent = ''

    const headerRegex = /^([A-Z\s\d]+|[A-Z][a-z]+(\s[A-Z][a-z]+)*)[:\-]?$/ // Detects headers like INTRODUCTION or “Chapter One -”

    for (const line of lines) {
      if (headerRegex.test(line) && line.length > 3) {
        if (currentContent.trim()) {
          sections.push({ title: currentHeader, content: currentContent.trim() })
        }
        currentHeader = line.replace(/[:\-]+$/, '').trim()
        headers.push(currentHeader)
        currentContent = ''
      } else {
        currentContent += line + ' '
      }
    }

    if (currentContent.trim()) {
      sections.push({ title: currentHeader, content: currentContent.trim() })
    }

    return NextResponse.json({
      headers,
      sections,
      rawText: extractedText,
    })

  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to analyze file.' }, { status: 500 })
  }
}