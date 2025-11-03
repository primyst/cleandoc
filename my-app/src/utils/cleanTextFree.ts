export function cleanTextFree(input: string): string {
  if (!input) return '';

  let cleaned = input.trim();

  // 1️⃣ Normalize spaces and punctuation
  cleaned = cleaned.replace(/\r/g, '');
  cleaned = cleaned.replace(/\s+/g, ' ');
  cleaned = cleaned.replace(/\s([.,!?;:])/g, '$1');

  // 2️⃣ Basic capitalization and sentence fix
  cleaned = cleaned.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());

  // 3️⃣ Fix lowercase “i” pronouns
  cleaned = cleaned.replace(/\bi\s/g, 'I ');

  // 4️⃣ Remove unwanted characters/emojis
  cleaned = cleaned.replace(
    /[^\w\s.,!?'"()\-–—:;@#%&*[\]{}<>/=+\\|^$~`]/g,
    ''
  );

  // 5️⃣ Ensure sentence ends with punctuation
  if (!/[.!?]$/.test(cleaned)) cleaned += '.';

  // 6️⃣ Limit output length for Free users
  const words = cleaned.split(/\s+/);
  if (words.length > 300) cleaned = words.slice(0, 300).join(' ') + '...';

  // 7️⃣ Add simple paragraph breaks for long text
  cleaned = cleaned.replace(/([.!?])\s+/g, '$1\n\n');

  return cleaned.trim();
}