export default function cleanTextPro(input: string, forExport = false): string {
  if (!input) return '';

  let text = input.trim();

  // Normalize whitespace and remove excess line breaks
  text = text.replace(/\r/g, '');
  text = text.replace(/\s+/g, ' ');
  text = text.replace(/\s*([.,!?;:])\s*/g, '$1 ');
  text = text.replace(/\s{2,}/g, ' ');

  // Fix repeated punctuation and ellipses
  text = text.replace(/([!?]){2,}/g, '$1');
  text = text.replace(/\.{3,}/g, '...');

  // Ensure space after punctuation
  text = text.replace(/([.!?])(?=\w)/g, '$1 ');

  // Capitalize first letters after sentence endings
  text = text.replace(/(^\s*\w|[.!?]\s*\w)/g, (match) => match.toUpperCase());

  // Fix lowercase "i" when used as pronoun
  text = text.replace(/\bi\s/g, 'I ');

  // Expand common contractions
  const contractions: Record<string, string> = {
    "can't": "cannot",
    "won't": "will not",
    "i'm": "I am",
    "it's": "It is",
    "doesn't": "does not",
    "don't": "do not",
    "they're": "they are",
    "we're": "we are",
  };
  for (const [key, value] of Object.entries(contractions)) {
    const regex = new RegExp(`\\b${key}\\b`, 'gi');
    text = text.replace(regex, value);
  }

  // Remove unwanted or repeated symbols
  text = text.replace(/[☢️⚡🧿💫]/g, '');
  text = text.replace(/([.,!?])\1+/g, '$1');

  // Split into sections by sentence or colon
  const sections = text.split(/(?<=[.!?])\s+|(?<=:)\s*/);
  const formatted: string[] = [];

  for (let part of sections) {
    part = part.trim();
    if (!part) continue;

    const isHeader =
      (/^[A-Z0-9 ,.'"()_-]+$/.test(part) && part.split(' ').length <= 6) ||
      part.endsWith(':');

    if (isHeader) {
      if (forExport) {
        formatted.push(`\n### ${part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()}\n`);
      } else {
        formatted.push(`**${part.charAt(0).toUpperCase() + part.slice(1)}**`);
      }
    } else {
      formatted.push(part);
    }
  }

  text = formatted.join('\n\n');

  // Remove repeated words like "the the"
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
  text = text.replace(
    /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
    '**$1**'
  );
  text = text.replace(/\b\d{4,}\b/g, (num) => `**${num}**`);
  text = text.replace(/\b(₦|\$|€|£)\s*\d+(\.\d{1,2})?\b/g, (m) => `**${m}**`);

  // Insert paragraph breaks for readability
  text = text.replace(/([.!?])\s+/g, '$1\n\n');

  // Final polish
  text = text.charAt(0).toUpperCase() + text.slice(1);
  if (!/[.!?]$/.test(text)) text += '.';

  return text.trim();
}