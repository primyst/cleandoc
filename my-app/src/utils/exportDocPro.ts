import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableCell,
  TableRow,
  WidthType,
  BorderStyle,
} from 'docx';
import { saveAs } from 'file-saver';

interface ExportOptions {
  showGeneratedBy?: boolean;
  username?: string;
}

type LineType = 'header' | 'subheader' | 'bullet' | 'numbered' | 'table' | 'paragraph' | 'specialBlock';

interface ParsedLine {
  type: LineType;
  content: string;
  level?: number; // for nested lists
}

const HEADER_KEYWORDS = [
  'Chapter', 'Section', 'Part', 'Key Highlights', 'Next Steps', 'Conclusion', 'Note', 'Urgent Attention'
];

export async function exportDocProNextGenV2(
  cleanedText: string,
  options: ExportOptions = {}
) {
  if (!cleanedText) return;

  const { showGeneratedBy = false, username } = options;

  // Step 1️⃣ Parse text into structured lines
  const lines = cleanedText.split(/\n+/).map(l => l.trim()).filter(Boolean);
  const parsedLines: ParsedLine[] = [];

  for (let line of lines) {
    // Skip inline mentions, only detect standalone headers
    const words = line.split(' ');

    // Header detection (standalone, starts with keywords)
    const isStandaloneHeader = HEADER_KEYWORDS.some(keyword =>
      line.startsWith(keyword) && words.length <= 8
    );

    if (isStandaloneHeader) {
      parsedLines.push({ type: 'header', content: line });
      continue;
    }

    // Special block detection
    const isSpecialBlock = ['Key Highlights', 'Next Steps', 'Note', 'Urgent Attention'].some(k =>
      line.startsWith(k)
    );
    if (isSpecialBlock) {
      parsedLines.push({ type: 'specialBlock', content: line });
      continue;
    }

    // Bullet / numbered detection
    const bulletMatch = line.match(/^(\s*)([-*]|\d+[.)])\s+(.*)$/);
    if (bulletMatch) {
      const [_, spaces, marker, content] = bulletMatch;
      const level = Math.floor(spaces.length / 2); // 2 spaces per indent
      parsedLines.push({
        type: /\d+[.)]/.test(marker) ? 'numbered' : 'bullet',
        content,
        level,
      });
      continue;
    }

    // Table detection (pipe-separated)
    if (line.includes('|')) {
      parsedLines.push({ type: 'table', content: line });
      continue;
    }

    // Default to normal paragraph
    parsedLines.push({ type: 'paragraph', content: line });
  }

  // Step 2️⃣ Convert parsed lines into docx content
  const paragraphs: Paragraph[] = [];

  parsedLines.forEach(parsed => {
    const { type, content, level = 0 } = parsed;

    // Inline formatting: **bold** and _italic_
    const parts: TextRun[] = [];
    let remaining = content;
    const regex = /(\*\*[^*]+\*\*|_[^_]+_)/g;
    let match: RegExpExecArray | null;
    let lastIndex = 0;

    while ((match = regex.exec(content))) {
      if (match.index > lastIndex) {
        parts.push(new TextRun({ text: content.slice(lastIndex, match.index) }));
      }

      const raw = match[0];
      if (raw.startsWith('**')) {
        parts.push(new TextRun({ text: raw.slice(2, -2), bold: true }));
      } else if (raw.startsWith('_')) {
        parts.push(new TextRun({ text: raw.slice(1, -1), italics: true }));
      }

      lastIndex = match.index + raw.length;
    }
    if (lastIndex < content.length) {
      parts.push(new TextRun({ text: content.slice(lastIndex) }));
    }

    switch (type) {
      case 'header':
        paragraphs.push(
          new Paragraph({
            children: parts,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          })
        );
        break;

      case 'subheader':
        paragraphs.push(
          new Paragraph({
            children: parts,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
          })
        );
        break;

      case 'specialBlock':
        paragraphs.push(
          new Paragraph({
            children: parts,
            spacing: { before: 200, after: 200 },
            shading: { fill: 'FFFFCC' },
          })
        );
        break;

      case 'bullet':
        paragraphs.push(
          new Paragraph({
            children: parts,
            bullet: { level },
            spacing: { after: 150 },
          })
        );
        break;

      case 'numbered':
        paragraphs.push(
          new Paragraph({
            children: parts,
            numbering: { reference: 'numbered-list', level },
            spacing: { after: 150 },
          })
        );
        break;

      case 'table': {
        // Simple single-row table detection for demonstration
        const cells = content.split('|').map(c =>
          new TableCell({
            children: [new Paragraph({ text: c.trim() })],
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
            borders: { top: { style: BorderStyle.SINGLE, size: 1, color: '000000' }, bottom: { style: BorderStyle.SINGLE, size: 1, color: '000000' }, left: { style: BorderStyle.SINGLE, size: 1, color: '000000' }, right: { style: BorderStyle.SINGLE, size: 1, color: '000000' } },
          })
        );
        paragraphs.push(
          new Table({
            rows: [new TableRow({ children: cells })],
            width: { size: 100, type: WidthType.PERCENTAGE },
          }) as unknown as Paragraph
        );
        break;
      }

      case 'paragraph':
      default:
        paragraphs.push(
          new Paragraph({
            children: parts,
            spacing: { after: 150 },
          })
        );
    }
  });

  // Step 3️⃣ Optional closing note
  if (showGeneratedBy) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Generated by CleanDoc Pro${username ? ` — ${username}` : ''}`,
            italics: true,
            color: '555555',
            size: 18,
          }),
        ],
        spacing: { before: 400 },
        alignment: AlignmentType.RIGHT,
      })
    );
  }

  // Step 4️⃣ Create document
  const doc = new Document({
    numbering: {
      config: [
        {
          reference: 'numbered-list',
          levels: Array.from({ length: 9 }, (_, i) => ({
            level: i,
            format: 'decimal',
            text: '%1.',
            alignment: AlignmentType.START,
          })),
        },
      ],
    },
    sections: [{ children: paragraphs }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, 'CleanDoc_Pro_NextGenV2.docx');
}