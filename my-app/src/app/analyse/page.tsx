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
      // PDF text extraction
      const data = await pdfParse(buffer)
      extractedText = data.text
    } else {
      // Image OCR extraction
      const result = await Tesseract.recognize(buffer, 'eng')
      extractedText = result.data.text
    }
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to analyze file.' }, { status: 500 })
  }

  return NextResponse.json({ text: extractedText })
}