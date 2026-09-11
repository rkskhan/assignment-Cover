import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';
import { PaperSize } from '../types';

export interface ExportOptions {
  elementId: string;
  filename: string;
  paperSize: PaperSize;
  onStart?: () => void;
  onProgress?: (stage: string) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export async function exportCoverToPDF(options: ExportOptions): Promise<void> {
  const { elementId, filename, paperSize, onStart, onProgress, onComplete, onError } = options;

  try {
    onStart?.();
    onProgress?.('Preparing document render...');

    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Cover page element with id "${elementId}" not found`);
    }

    // Capture using html2canvas at scale 2.5 for crisp 300-DPI-like print quality
    onProgress?.('Rendering high-resolution vector elements...');
    
    // Save original styles if any need temporary adjustments
    const originalShadow = element.style.boxShadow;
    element.style.boxShadow = 'none'; // Avoid capturing drop-shadow in the actual PDF sheet

    const canvas = await html2canvas(element, {
      scale: 2.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      imageTimeout: 15000,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          clonedElement.style.boxShadow = 'none';
          clonedElement.style.transform = 'none';
          clonedElement.style.position = 'relative';
          clonedElement.style.top = '0px';
          clonedElement.style.left = '0px';
        }
      }
    });

    // Restore shadow
    element.style.boxShadow = originalShadow;

    onProgress?.('Compiling professional PDF...');

    // Standard paper dimensions in mm:
    // A4: 210 x 297 mm
    // US Letter: 215.9 x 279.4 mm
    const isA4 = paperSize === 'a4';
    const pdfWidth = isA4 ? 210 : 215.9;
    const pdfHeight = isA4 ? 297 : 279.4;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: isA4 ? 'a4' : 'letter',
      compress: true,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

    // Trigger download
    const cleanFilename = filename
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .replace(/_+/g, '_')
      .slice(0, 60);

    pdf.save(`${cleanFilename || 'assignment_cover'}.pdf`);

    // Celebratory confetti burst
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#1e3a8a', '#3b82f6', '#10b981', '#f59e0b'],
      });
    } catch {
      // Ignore confetti errors
    }

    onComplete?.();
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Error generating PDF:', error);
    onError?.(error);
  }
}

export function triggerPrintCover(): void {
  window.print();
}
