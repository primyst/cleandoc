export function cleanTextFree(input: string): string {
  if (!input) return '';

  // Step 1: Preserve paragraph structure while trimming
  let cleaned = input
    .split('\n')
    .map(line => line.trim().replace(/\s+/g, ' '))
    .filter(Boolean)
    .join('\n\n'); // keep double line breaks between paragraphs

  // Step 2: Remove emojis and unusual symbols
  cleaned = cleaned.replace(
    /[^\w\s.,!?'"()\-–—:;@#%&*[\]{}<>/=+\\|^$~`]/g,
    ''
  );

  // Step 3: Fix spacing before punctuation
  cleaned = cleaned.replace(/\s([.,!?;:])/g, '$1');

  // Step 4: Ensure sentence ends have proper punctuation
  if (!/[.!?]$/.test(cleaned)) {
    cleaned += '.';
  }

  // Step 5: Capitalize first letters of sentences
  cleaned = cleaned.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());

  // Step 6: Fix lowercase “i” pronouns
  cleaned = cleaned.replace(/\bi\s/g, 'I ');

  // Step 7: Limit to 300 words
  const words = cleaned.split(/\s+/);
  if (words.length > 300) {
    cleaned = words.slice(0, 300).join(' ') + '...';
  }

  return cleaned.trim();
}