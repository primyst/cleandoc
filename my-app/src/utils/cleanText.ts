export function cleanText(raw: string): string {
  // 1. Normalize line breaks (remove \r)
  let text = raw.replace(/\r/g, '')

  // 2. Collapse multiple spaces into a single space
  text = text.replace(/\s{2,}/g, ' ')

  // 3. Normalize multiple line breaks to max 2
  text = text.replace(/\n{3,}/g, '\n\n')

  // 4. Remove trailing spaces on each line
  text = text.replace(/[^\S\r\n]+$/gm, '')

  // 5. Trim text start and end
  text = text.trim()

  // 6. Capitalize first letter after a period, exclamation, or question mark
  text = text.replace(/(^|[.!?]\s+)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase())

  return text
}