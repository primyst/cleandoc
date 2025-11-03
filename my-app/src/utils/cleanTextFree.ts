export function cleanTextFree(input: string): string {
  if (!input) return '';

  let cleaned = input;

  // Step 1: Trim and normalize spaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

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

  // Step 5: Capitalize first letters of sentences (basic)
  cleaned = cleaned.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());

  // Step 6: Fix lowercase “i” pronouns
  cleaned = cleaned.replace(/\bi\s/g, 'I ');

  // Step 7: Limit to 300 words for free users
  const words = cleaned.split(/\s+/);
  if (words.length > 300) {
    cleaned = words.slice(0, 300).join(' ') + '...';
  }

  return cleaned;
}