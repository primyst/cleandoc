export function cleanText(raw: string): string {
  if (!raw) return ''

  // 1. Normalize line breaks
  let text = raw.replace(/\r/g, '')

  // 2. Collapse multiple spaces
  text = text.replace(/\s{2,}/g, ' ')

  // 3. Normalize multiple line breaks
  text = text.replace(/\n{3,}/g, '\n\n')

  // 4. Remove trailing spaces
  text = text.replace(/[^\S\r\n]+$/gm, '')

  // 5. Trim overall
  text = text.trim()

  // 6. Capitalize first letters after punctuation
  text = text.replace(/(^|[.!?]\s+)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase())

  // 7. Split into structured lines
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  const formattedLines: string[] = []

  for (let line of lines) {
    // Detect headers (ALL CAPS or ending with ":")
    if ((/^[A-Z0-9 ,.'"-]+$/.test(line) && line.length > 3) || line.endsWith(':')) {
      formattedLines.push(`# ${line.charAt(0).toUpperCase() + line.slice(1).toLowerCase()}`)
    }
    // Detect bullet points
    else if (/^[-*•]\s+/.test(line)) {
      formattedLines.push(line)
    }
    // Otherwise normal paragraph
    else {
      formattedLines.push(line)
    }
  }

  return formattedLines.join('\n\n')
}