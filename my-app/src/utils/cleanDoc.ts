export function detectStructure(text: string) {
  const lines = text.split("\n").map((l) => l.trim());
  const structured: { type: string; content: string }[] = [];

  for (const line of lines) {
    if (!line) continue;

    if (/^[-*•]\s+/.test(line)) {
      structured.push({ type: "list", content: line.replace(/^[-*•]\s+/, "") });
    } else if (/^\d+[\).]\s+/.test(line)) {
      structured.push({ type: "numbered-list", content: line });
    } else if (line === line.toUpperCase() && line.length < 60) {
      structured.push({ type: "header", content: line });
    } else if (line.endsWith(":")) {
      structured.push({ type: "subheader", content: line });
    } else {
      structured.push({ type: "paragraph", content: line });
    }
  }

  return structured;
}

export function rebuildDocument(structured: { type: string; content: string }[]) {
  return structured
    .map((block) => {
      switch (block.type) {
        case "header":
          return `\n\n## ${block.content}\n`;
        case "subheader":
          return `\n**${block.content}**\n`;
        case "list":
          return `- ${block.content}`;
        case "numbered-list":
          return block.content;
        default:
          return block.content + "\n";
      }
    })
    .join("\n");
}