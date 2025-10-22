export function detectSections(text: string) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const sections: { header: string; content: string }[] = [];
  let currentHeader = "";
  let currentContent = "";

  const headerRegex = /^[A-Z][A-Z\s\d\-:]+$/; // Detects ALL-CAPS headers

  for (const line of lines) {
    if (headerRegex.test(line) && line.length > 3) {
      if (currentHeader) {
        sections.push({ header: currentHeader, content: currentContent.trim() });
      }
      currentHeader = line;
      currentContent = "";
    } else {
      currentContent += line + " ";
    }
  }

  if (currentHeader) {
    sections.push({ header: currentHeader, content: currentContent.trim() });
  }

  return {
    title: lines[0],
    sections,
  };
}
