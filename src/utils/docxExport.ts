import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle as DocxBorderStyle,
  HeadingLevel,
  ImageRun,
} from 'docx';
import confetti from 'canvas-confetti';
import { AssignmentData, StyleConfig, PaperSize } from '../types';

export interface DocxExportOptions {
  data: AssignmentData;
  styleConfig: StyleConfig;
  filename: string;
  onStart?: () => void;
  onProgress?: (stage: string) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

// Map app fonts to standard Word typography
function mapFontToWord(fontId: string): string {
  switch (fontId) {
    case 'times':
      return 'Times New Roman';
    case 'cormorant':
    case 'eb-garamond':
      return 'Garamond';
    case 'cinzel':
    case 'baskerville':
      return 'Georgia';
    case 'inter':
      return 'Calibri';
    case 'outfit':
    case 'montserrat':
      return 'Arial';
    case 'mono':
      return 'Consolas';
    default:
      return 'Times New Roman';
  }
}

// Convert hex to docx color without '#'
function cleanHex(color: string, defaultColor = '1E3A8A'): string {
  if (!color) return defaultColor;
  return color.replace(/^#/, '').toUpperCase();
}

// Helper to convert data URL or remote image URL to Uint8Array for docx ImageRun
async function fetchImageAsUint8Array(url: string): Promise<{ data: Uint8Array; width: number; height: number; type: 'png' | 'jpg' } | null> {
  try {
    const isJpeg = url.toLowerCase().includes('.jpg') || url.toLowerCase().includes('.jpeg') || url.startsWith('data:image/jpeg');
    const imageType: 'png' | 'jpg' = isJpeg ? 'jpg' : 'png';

    const res = await fetch(url);
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);

    // Get image natural dimensions using an Image element
    const dimensions = await new Promise<{ width: number; height: number }>((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth || 120, height: img.naturalHeight || 120 });
      };
      img.onerror = () => {
        resolve({ width: 120, height: 120 });
      };
      img.src = url;
    });

    return {
      data: uint8,
      width: dimensions.width,
      height: dimensions.height,
      type: imageType,
    };
  } catch (err) {
    console.warn('Could not fetch logo image for DOCX:', err);
    return null;
  }
}

export async function exportCoverToDocx(options: DocxExportOptions): Promise<void> {
  const { data, styleConfig, filename, onStart, onProgress, onComplete, onError } = options;

  try {
    onStart?.();
    onProgress?.('Preparing Word document structure...');

    const isA4 = styleConfig.paperSize === 'a4';
    // Page dimensions in twips (1/20 of a pt; 1 inch = 1440 twips)
    // A4: 8.27 x 11.69 inches = 11906 x 16838 twips
    // US Letter: 8.5 x 11.0 inches = 12240 x 15840 twips
    const pageWidth = isA4 ? 11906 : 12240;
    const pageHeight = isA4 ? 16838 : 15840;

    const fontName = mapFontToWord(styleConfig.fontFamily);
    const accentHex = cleanHex(styleConfig.accentColor, '1E3A8A');
    const darkSlateHex = '1E293B';
    const mutedSlateHex = '64748B';

    // Attempt to load logo image if available
    let logoImageRun: ImageRun | null = null;
    if (data.logoUrl) {
      onProgress?.('Processing university emblem/logo...');
      const imgInfo = await fetchImageAsUint8Array(data.logoUrl);
      if (imgInfo) {
        // Constrain logo display width between 60px and 140px, keeping aspect ratio
        const targetWidth = Math.min(Math.max(data.logoWidth || 96, 60), 140);
        const aspect = imgInfo.height / (imgInfo.width || 1);
        const targetHeight = Math.round(targetWidth * aspect);

        logoImageRun = new ImageRun({
          type: imgInfo.type,
          data: imgInfo.data,
          transformation: {
            width: targetWidth,
            height: targetHeight,
          },
        });
      }
    }

    onProgress?.('Formatting typography and layout...');

    const children: (Paragraph | Table)[] = [];

    // Optional Top Spacer
    children.push(
      new Paragraph({
        spacing: { before: 200, after: 100 },
      })
    );

    // 1. Logo (if available)
    if (logoImageRun) {
      let logoAlign: (typeof AlignmentType)[keyof typeof AlignmentType] = AlignmentType.CENTER;
      if (data.logoPosition === 'left') logoAlign = AlignmentType.START;
      if (data.logoPosition === 'right') logoAlign = AlignmentType.END;

      children.push(
        new Paragraph({
          alignment: logoAlign,
          children: [logoImageRun],
          spacing: { before: 100, after: 200 },
        })
      );
    }

    // 2. University / Institution Header
    if (data.universityName) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: data.universityName.toUpperCase(),
              font: fontName,
              size: 32, // 16pt
              bold: true,
              color: accentHex,
              characterSpacing: 20,
            }),
          ],
          spacing: { before: 100, after: 60 },
        })
      );
    }

    if (data.facultyName) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: data.facultyName,
              font: fontName,
              size: 24, // 12pt
              bold: true,
              color: darkSlateHex,
            }),
          ],
          spacing: { before: 40, after: 40 },
        })
      );
    }

    if (data.departmentName) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: data.departmentName,
              font: fontName,
              size: 22, // 11pt
              italics: true,
              color: mutedSlateHex,
            }),
          ],
          spacing: { before: 40, after: 60 },
        })
      );
    }

    if (data.campus) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: data.campus,
              font: fontName,
              size: 20, // 10pt
              color: mutedSlateHex,
            }),
          ],
          spacing: { before: 20, after: 240 },
        })
      );
    } else {
      // Small vertical spacer
      children.push(
        new Paragraph({
          spacing: { before: 100, after: 160 },
        })
      );
    }

    // Decorative Horizontal Divider in Word (Colored line table row or border)
    if (styleConfig.showDivider) {
      children.push(
        new Paragraph({
          border: {
            bottom: {
              color: accentHex,
              space: 4,
              style: DocxBorderStyle.SINGLE,
              size: 12, // 1.5pt
            },
          },
          spacing: { before: 100, after: 300 },
        })
      );
    }

    // 3. Course Details
    if (data.courseCode || data.courseName) {
      const courseText = [data.courseCode, data.courseName].filter(Boolean).join(' — ');
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: courseText.toUpperCase(),
              font: fontName,
              size: 22, // 11pt
              bold: true,
              color: accentHex,
            }),
          ],
          spacing: { before: 200, after: 80 },
        })
      );
    }

    // Assignment Type Badge (e.g. "Assignment", "Term Paper", "Lab Report")
    if (data.assignmentType) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: `[ ${data.assignmentType.toUpperCase()} ]`,
              font: fontName,
              size: 20, // 10pt
              bold: true,
              color: mutedSlateHex,
            }),
          ],
          spacing: { before: 60, after: 160 },
        })
      );
    }

    // 4. Topic / Assignment Title
    if (data.title) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: data.title,
              font: fontName,
              size: 40, // 20pt
              bold: true,
              color: darkSlateHex,
            }),
          ],
          spacing: { before: 200, after: 120 },
        })
      );
    }

    if (data.subtitle) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: data.subtitle,
              font: fontName,
              size: 24, // 12pt
              italics: true,
              color: mutedSlateHex,
            }),
          ],
          spacing: { before: 40, after: 360 },
        })
      );
    } else {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 260 },
        })
      );
    }

    // 5. Submission Section (Submitted To & Submitted By)
    // We construct a clean 2-column Word table with borderless cells for side-by-side or stacked
    const layout = styleConfig.submissionLayout || 'side-by-side';
    const isSwapped = layout === 'swapped';
    const isStacked = layout === 'stacked-instructor-first' || layout === 'stacked-student-first';

    // Cell 1: Submitted To content
    const submittedToParagraphs: Paragraph[] = [
      new Paragraph({
        children: [
          new TextRun({
            text: 'SUBMITTED TO:',
            font: fontName,
            size: 20,
            bold: true,
            color: accentHex,
          }),
        ],
        spacing: { before: 40, after: 60 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: data.instructorName || 'Instructor Name',
            font: fontName,
            size: 24,
            bold: true,
            color: darkSlateHex,
          }),
        ],
        spacing: { before: 20, after: 30 },
      }),
    ];

    if (data.instructorTitle) {
      submittedToParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: data.instructorTitle,
              font: fontName,
              size: 20,
              color: mutedSlateHex,
            }),
          ],
          spacing: { before: 20, after: 20 },
        })
      );
    }

    if (data.instructorDept) {
      submittedToParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: data.instructorDept,
              font: fontName,
              size: 20,
              color: mutedSlateHex,
            }),
          ],
          spacing: { before: 20, after: 20 },
        })
      );
    }

    if (data.universityName) {
      submittedToParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: data.universityName,
              font: fontName,
              size: 18,
              color: mutedSlateHex,
            }),
          ],
          spacing: { before: 20, after: 40 },
        })
      );
    }

    // Cell 2: Submitted By content
    const submittedByParagraphs: Paragraph[] = [
      new Paragraph({
        children: [
          new TextRun({
            text: 'SUBMITTED BY:',
            font: fontName,
            size: 20,
            bold: true,
            color: accentHex,
          }),
        ],
        spacing: { before: 40, after: 60 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: data.studentName || 'Student Name',
            font: fontName,
            size: 24,
            bold: true,
            color: darkSlateHex,
          }),
        ],
        spacing: { before: 20, after: 30 },
      }),
    ];

    if (data.studentId) {
      submittedByParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Student ID: ${data.studentId}`,
              font: fontName,
              size: 20,
              color: darkSlateHex,
            }),
          ],
          spacing: { before: 20, after: 20 },
        })
      );
    }

    if (data.program) {
      submittedByParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Program: ${data.program}`,
              font: fontName,
              size: 20,
              color: mutedSlateHex,
            }),
          ],
          spacing: { before: 20, after: 20 },
        })
      );
    }

    if (data.batch) {
      submittedByParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Batch / Sec: ${data.batch}`,
              font: fontName,
              size: 20,
              color: mutedSlateHex,
            }),
          ],
          spacing: { before: 20, after: 20 },
        })
      );
    }

    // Additional group members
    if (data.additionalStudents && data.additionalStudents.length > 0) {
      submittedByParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Group Members:',
              font: fontName,
              size: 18,
              bold: true,
              color: darkSlateHex,
            }),
          ],
          spacing: { before: 60, after: 20 },
        })
      );

      data.additionalStudents.forEach((member) => {
        submittedByParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `• ${member.name} (${member.studentId})`,
                font: fontName,
                size: 18,
                color: mutedSlateHex,
              }),
            ],
            spacing: { before: 10, after: 10 },
          })
        );
      });
    }

    // Invisible borders for table cells
    const noBorder = {
      style: DocxBorderStyle.NONE,
      size: 0,
      color: 'auto',
    };

    const cellBorders = {
      top: noBorder,
      bottom: noBorder,
      left: noBorder,
      right: noBorder,
    };

    if (isStacked) {
      if (layout === 'stacked-student-first') {
        children.push(...submittedByParagraphs);
        children.push(new Paragraph({ spacing: { before: 120, after: 120 } }));
        children.push(...submittedToParagraphs);
      } else {
        children.push(...submittedToParagraphs);
        children.push(new Paragraph({ spacing: { before: 120, after: 120 } }));
        children.push(...submittedByParagraphs);
      }
    } else {
      // 2-Column Table for Side-by-Side
      const leftContent = isSwapped ? submittedByParagraphs : submittedToParagraphs;
      const rightContent = isSwapped ? submittedToParagraphs : submittedByParagraphs;

      const submissionTable = new Table({
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
        borders: {
          top: noBorder,
          bottom: noBorder,
          left: noBorder,
          right: noBorder,
          insideHorizontal: noBorder,
          insideVertical: noBorder,
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                borders: cellBorders,
                children: leftContent,
                margins: { top: 100, bottom: 100, left: 100, right: 100 },
              }),
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                borders: cellBorders,
                children: rightContent,
                margins: { top: 100, bottom: 100, left: 100, right: 100 },
              }),
            ],
          }),
        ],
      });

      children.push(submissionTable);
    }

    // 6. Bottom Footer Details: Submission Date & Academic Year
    children.push(
      new Paragraph({
        spacing: { before: 360, after: 60 },
      })
    );

    if (data.submissionDate) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: `Date of Submission: ${data.submissionDate}`,
              font: fontName,
              size: 22,
              bold: true,
              color: darkSlateHex,
            }),
          ],
          spacing: { before: 100, after: 40 },
        })
      );
    }

    if (data.academicYear) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: `Academic Session: ${data.academicYear}`,
              font: fontName,
              size: 20,
              color: mutedSlateHex,
            }),
          ],
          spacing: { before: 20, after: 100 },
        })
      );
    }

    // Configure document page borders if user selected a border style
    let pageBorders = undefined;
    if (styleConfig.borderStyle && styleConfig.borderStyle !== 'none') {
      const borderLineStyle = styleConfig.borderStyle === 'double' ? DocxBorderStyle.DOUBLE : DocxBorderStyle.SINGLE;
      const bColor = cleanHex(styleConfig.borderColor || styleConfig.accentColor, '1E3A8A');
      const bSize = Math.min(Math.max((styleConfig.borderWidth || 2) * 8, 8), 36);

      pageBorders = {
        pageBorders: {
          top: { style: borderLineStyle, size: bSize, color: bColor, space: 24 },
          bottom: { style: borderLineStyle, size: bSize, color: bColor, space: 24 },
          left: { style: borderLineStyle, size: bSize, color: bColor, space: 24 },
          right: { style: borderLineStyle, size: bSize, color: bColor, space: 24 },
        },
      };
    }

    onProgress?.('Generating Word .docx file package...');

    // Assemble the complete Document
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              size: {
                width: pageWidth,
                height: pageHeight,
              },
              margin: {
                top: 1080, // ~0.75 in
                bottom: 1080,
                left: 1140, // ~0.8 in
                right: 1140,
              },
              ...(pageBorders || {}),
            },
          },
          children,
        },
      ],
    });

    onProgress?.('Packing and finalizing download...');

    // Generate Blob in browser
    const blob = await Packer.toBlob(doc);

    const cleanFilename =
      filename
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .replace(/_+/g, '_')
        .slice(0, 60) || 'assignment_cover';

    const outputName = `${cleanFilename}.docx`;

    // Download trigger
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = outputName;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    }, 1500);

    // Celebratory confetti
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#2563eb', '#1d4ed8', '#0284c7', '#38bdf8'],
      });
    } catch {
      // Ignore confetti issues
    }

    onComplete?.();
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Error generating DOCX document:', error);
    onError?.(error);
  }
}
