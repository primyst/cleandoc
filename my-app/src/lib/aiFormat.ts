import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function formatTextWithAI(raw: string) {
  const prompt = `
    Take the following messy text and format it with headers, bullet points, and paragraphs.
    Return Markdown only.
    Text: ${raw}
  `

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  })

  return response.choices[0].message?.content || raw
}