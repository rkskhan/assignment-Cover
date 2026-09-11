import html2canvas from 'html2canvas-pro';
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

    // Save original styles if any need temporary adjustments
    const originalShadow = element.style.boxShadow;
    element.style.boxShadow = 'none';

    onProgress?.('Rendering high-resolution vector and graphic elements...');

    const canvas = await html2canvas(element, {
      scale: 2.2, // Crisp print-ready resolution (~1750x2470 px for A4)
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
      imageTimeout: 15000,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          if (clonedElement.parentElement) {
            clonedElement.parentElement.style.width = `${clonedElement.offsetWidth || 794}px`;
            clonedElement.parentElement.style.height = `${clonedElement.offsetHeight || 1123}px`;
            clonedElement.parentElement.style.overflow = 'visible';
            clonedElement.parentElement.style.transform = 'none';
          }
          clonedElement.style.boxShadow = 'none';
          clonedElement.style.transform = 'none';
          clonedElement.style.position = 'relative';
          clonedElement.style.top = '0px';
          clonedElement.style.left = '0px';
          clonedElement.style.margin = '0px';
        }
      },
    });

    // Restore shadow
    element.style.boxShadow = originalShadow;

    onProgress?.('Compiling professional PDF document...');

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

    const imgData = canvas.toDataURL('image/jpeg', 0.96);
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

    onProgress?.('Saving PDF file...');

    const cleanFilename = filename
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .replace(/_+/g, '_')
      .slice(0, 60) || 'assignment_cover';

    const outputName = `${cleanFilename}.pdf`;

    // Multi-tier download mechanism ensuring support in iframe & sandboxed environments
    let downloaded = false;
    try {
      pdf.save(outputName);
      downloaded = true;
    } catch (saveError) {
      console.warn('pdf.save direct trigger failed, attempting blob fallback:', saveError);
    }

    if (!downloaded) {
      try {
        const blob = pdf.output('blob');
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = outputName;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(blobUrl);
        }, 1500);
        downloaded = true;
      } catch (blobError) {
        console.warn('Blob download fallback failed, trying data URI:', blobError);
        const dataUri = pdf.output('datauristring');
        const a = document.createElement('a');
        a.href = dataUri;
        a.download = outputName;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => document.body.removeChild(a), 1500);
      }
    }

    // Celebratory confetti burst
    try {
      confetti({
        particleCount: 45,
        spread: 55,
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
