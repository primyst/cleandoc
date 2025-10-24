import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function POST(req: Request) {
  try {
    const { raw } = await req.json()

    const prompt = `
      Take the following messy text and format it with headers, bullet points, and paragraphs.
      Return Markdown only.
      Text: ${raw}
    `

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    })

    return NextResponse.json({ text: response.choices[0].message?.content })
  } catch (error) {
    console.error('AI format error:', error)
    return NextResponse.json({ error: 'Failed to format text' }, { status: 500 })
  }
}