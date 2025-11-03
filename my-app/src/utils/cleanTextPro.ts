export function cleanTextPro(input: string): string {
  if (!input) return '';

  let text = input.trim();

  // 🧹 1. Normalize spaces and punctuation
  text = text.replace(/\r/g, '');
  text = text.replace(/\s+/g, ' ');
  text = text.replace(/\s([.,!?;:])/g, '$1');
  text = text.replace(/[!?]{2,}/g, (m) => m[0]);
  text = text.replace(/\.{3,}/g, '...');

  // ✍️ 2. Capitalize first letter of every sentence
  text = text.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());

  // 🙌 3. Fix lowercase "i" pronoun
  text = text.replace(/\bi\s/g, 'I ');

  // 🔤 4. Expand common contractions
  const contractions: Record<string, string> = {
    "can't": 'cannot',
    "won't": 'will not',
    "i'm": 'I am',
    "it's": 'It is',
    "doesn't": 'does not',
    "don't": 'do not',
    "they're": 'they are',
    "we're": 'we are',
  };
  for (const [key, value] of Object.entries(contractions)) {
    const regex = new RegExp(`\\b${key}\\b`, 'gi');
    text = text.replace(regex, value);
  }

  // 🧠 5. Smart paragraph detection
  // If a line looks like a header (ALL CAPS or ends with ":")
  const lines = text.split(/(?<=\n)|(?<=\.\s)/);
  const formatted: string[] = [];

  for (let line of lines) {
    line = line.trim();

    if (!line) continue;

    // Header-style line
    if ((/^[A-Z0-9 ,.'"()_-]+$/.test(line) && line.length > 3) || line.endsWith(':')) {
      formatted.push(`\n# ${line.charAt(0).toUpperCase() + line.slice(1).toLowerCase()}\n`);
    }
    // Bullet-like line (starts with "- " or "* ")
    else if (/^[-*•]\s+/.test(line)) {
      formatted.push(line);
    }
    // Normal paragraph
    else {
      formatted.push(line);
    }
  }

  text = formatted.join('\n\n');

  // 🪶 6. Remove repeated words
  text = text.replace(/\b(\w+)\s+\1\b/gi, '$1');

  // 💅 7. Add double spacing between paragraphs for readability
  text = text.replace(/\n{2,}/g, '\n\n');

  // 🚀 8. Capitalize start of document and ensure clean finish
  text = text.charAt(0).toUpperCase() + text.slice(1);
  if (!/[.!?]$/.test(text)) text += '.';

  return text.trim();
}