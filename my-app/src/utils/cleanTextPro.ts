export default function cleanTextPro(input: string, forExport = false): string {
  if (!input) return '';

  let text = input.trim();

  // Normalize whitespace and punctuation
  text = text.replace(/\r/g, '');
  text = text.replace(/\s+/g, ' ');
  text = text.replace(/([.,!?])(?=[^\s])/g, '$1 ');
  text = text.replace(/([!?]){2,}/g, '$1');
  text = text.replace(/\.{3,}/g, '...');

  // Capitalize first letters
  text = text.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());

  // Fix lowercase “i”
  text = text.replace(/\bi\s/g, 'I ');

  // Expand contractions
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

  // Remove unwanted symbols (keep expressive emojis)
  text = text.replace(/[☢️⚡🧿💫]/g, '');

  // Split into sentences/sections
  const lines = text.split(/(?<=\.\s)/);
  const formatted: string[] = [];

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    const isHeader =
      (/^[A-Z0-9 ,.'"()_-]+$/.test(line) && line.split(' ').length <= 6) ||
      line.endsWith(':');

    if (isHeader) {
      if (forExport) {
        formatted.push(`\n### ${line.charAt(0).toUpperCase() + line.slice(1).toLowerCase()}\n`);
      } else {
        formatted.push(`**${line.charAt(0).toUpperCase() + line.slice(1)}**`);
      }
    } else {
      formatted.push(line);
    }
  }

  text = formatted.join('\n\n');

  // Remove repeated words
  text = text.replace(/\b(\w+)\s+\1\b/gi, '$1');

  // Highlight important keywords
  const keywords = [
    'Name', 'Date', 'Email', 'Phone', 'Address', 'Amount', 'Price',
    'Deadline', 'Signature', 'Department', 'Title', 'Reference',
    'Subject', 'Note', 'Terms', 'Agreement'
  ];
  for (const word of keywords) {
    const regex = new RegExp(`\\b(${word})\\b`, 'gi');
    text = text.replace(regex, '**$1**');
  }

  // Highlight emails, numbers, and currency
  text = text.replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '**$1**');
  text = text.replace(/\b\d{4,}\b/g, (num) => `**${num}**`);
  text = text.replace(/\b(\$|₦|€|£)\d+(\.\d{1,2})?\b/g, (m) => `**${m}**`);

  // Add paragraph breaks for readability
  text = text.replace(/([.!?])\s+/g, '$1\n\n');

  // Final polish
  text = text.charAt(0).toUpperCase() + text.slice(1);
  if (!/[.!?]$/.test(text)) text += '.';

  return text.trim();
}