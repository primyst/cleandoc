export function cleanTextPro(input: string): string {
  if (!input) return '';

  let cleaned = input.trim();

  // Step 1: Normalize spaces and punctuation
  cleaned = cleaned.replace(/\s+/g, ' ');
  cleaned = cleaned.replace(/\s([.,!?;:])/g, '$1');

  // Step 2: Remove excessive punctuation
  cleaned = cleaned.replace(/[!?]{2,}/g, (m) => m[0]);
  cleaned = cleaned.replace(/\.{3,}/g, '...');

  // Step 3: Smart capitalization for sentences
  cleaned = cleaned.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());

  // Step 4: Fix lowercase “i”
  cleaned = cleaned.replace(/\bi\s/g, 'I ');

  // Step 5: Expand common contractions for clarity
  cleaned = cleaned.replace(/\bcan't\b/gi, 'cannot');
  cleaned = cleaned.replace(/\bwon't\b/gi, 'will not');
  cleaned = cleaned.replace(/\bI'm\b/gi, 'I am');
  cleaned = cleaned.replace(/\bIt's\b/gi, 'It is');
  cleaned = cleaned.replace(/\bdoesn't\b/gi, 'does not');

  // Step 6: Insert paragraph breaks for readability (simulate “doc cleanup”)
  cleaned = cleaned.replace(/([.!?])\s+/g, '$1\n\n');

  // Step 7: Remove accidental repeated words
  cleaned = cleaned.replace(/\b(\w+)\s+\1\b/gi, '$1');

  // Step 8: Capitalize document start
  cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);

  return cleaned;
}