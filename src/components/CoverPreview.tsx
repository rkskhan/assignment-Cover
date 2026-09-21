import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileCheck,
  Loader2,
  CheckCircle2,
  Share2,
  ArrowUpDown,
  AlertCircle,
  X,
  FileText
} from 'lucide-react';
import { AssignmentData, StyleConfig } from '../types';
import { CoverTemplateRenderer } from './templates/CoverTemplateRenderer';
import { exportCoverToPDF, triggerPrintCover } from '../utils/pdfExport';
import { exportCoverToDocx } from '../utils/docxExport';

interface CoverPreviewProps {
  data: AssignmentData;
  styleConfig: StyleConfig;
  onOpenLayoutTab?: () => void;
  isExporting?: boolean;
  exportType?: 'pdf' | 'docx' | null;
  exportStage?: string;
  exportError?: string | null;
  onExportPDF?: () => void;
  onExportDocx?: () => void;
  onDismissError?: () => void;
}

export const CoverPreview: React.FC<CoverPreviewProps> = ({
  data,
  styleConfig,
  onOpenLayoutTab,
  isExporting: externalIsExporting,
  exportType: externalExportType,
  exportStage: externalExportStage,
  exportError: externalExportError,
  onExportPDF,
  onExportDocx,
  onDismissError,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(55);
  const [hasManuallyZoomed, setHasManuallyZoomed] = useState<boolean>(false);
  const [internalIsExporting, setInternalIsExporting] = useState<boolean>(false);
  const [internalExportType, setInternalExportType] = useState<'pdf' | 'docx' | null>(null);
  const [internalExportStage, setInternalExportStage] = useState<string>('');
  const [internalExportError, setInternalExportError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const isExporting = externalIsExporting ?? internalIsExporting;
  const exportType = externalExportType ?? internalExportType;
  const exportStage = externalExportStage ?? internalExportStage;
  const exportError = externalExportError ?? internalExportError;

  // Aspect ratio calculation
  const isA4 = styleConfig.paperSize === 'a4';
  const targetWidth = 794;
  const targetHeight = isA4 ? 1123 : 1056;

  // Fit to screen calculation - guarantees the entire document fits strictly within the viewport
  const calculateFitZoom = useCallback(() => {
    if (!containerRef.current) return 55;
    const { clientWidth, clientHeight } = containerRef.current;
    if (clientWidth <= 0 || clientHeight <= 0) return 55;

    const paddingX = 40;
    const paddingY = 40;
    const scaleX = (clientWidth - paddingX) / targetWidth;
    const scaleY = (clientHeight - paddingY) / targetHeight;
    const bestScale = Math.min(scaleX, scaleY);
    // Math.floor ensures scaled dimensions are strictly smaller than the canvas container
    return Math.min(100, Math.max(25, Math.floor(bestScale * 100)));
  }, [targetWidth, targetHeight]);

  const fitToScreen = useCallback(() => {
    const fitted = calculateFitZoom();
    setZoomLevel(fitted);
    setHasManuallyZoomed(false);
  }, [calculateFitZoom]);

  // Initial fit on mount and whenever paper standard changes
  useEffect(() => {
    fitToScreen();
    const raf = requestAnimationFrame(() => {
      fitToScreen();
    });
    return () => cancelAnimationFrame(raf);
  }, [fitToScreen, isA4]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!hasManuallyZoomed) {
        fitToScreen();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [fitToScreen, hasManuallyZoomed]);

  // ResizeObserver to adapt zoom if container size changes (unless manually zoomed)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      if (!hasManuallyZoomed) {
        const fitted = calculateFitZoom();
        setZoomLevel(fitted);
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [calculateFitZoom, hasManuallyZoomed]);

  const handleDownloadPDF = async () => {
    if (onExportPDF) {
      onExportPDF();
      return;
    }

    if (isExporting) return;

    const baseName = `${data.courseCode || 'Assignment'}_${data.studentName || 'Cover'}`;
    const filename = `${baseName}_Cover_Page`;

    await exportCoverToPDF({
      elementId: 'assignment-cover-target',
      filename,
      paperSize: styleConfig.paperSize,
      onStart: () => {
        setInternalIsExporting(true);
        setInternalExportError(null);
        setInternalExportStage('Initializing high-resolution render...');
      },
      onProgress: (stage) => {
        setInternalExportStage(stage);
      },
      onComplete: () => {
        setInternalIsExporting(false);
        setInternalExportStage('');
      },
      onError: (err) => {
        setInternalIsExporting(false);
        setInternalExportType(null);
        setInternalExportStage('');
        setInternalExportError(err.message || 'Export error encountered');
      },
    });
  };

  const handleDownloadDocx = async () => {
    if (onExportDocx) {
      onExportDocx();
      return;
    }

    if (isExporting) return;

    const baseName = `${data.courseCode || 'Assignment'}_${data.studentName || 'Cover'}`;
    const filename = `${baseName}_Cover_Page`;

    await exportCoverToDocx({
      data,
      styleConfig,
      filename,
      onStart: () => {
        setInternalIsExporting(true);
        setInternalExportType('docx');
        setInternalExportError(null);
        setInternalExportStage('Preparing Word document structure...');
      },
      onProgress: (stage) => {
        setInternalExportStage(stage);
      },
      onComplete: () => {
        setInternalIsExporting(false);
        setInternalExportType(null);
        setInternalExportStage('');
      },
      onError: (err) => {
        setInternalIsExporting(false);
        setInternalExportType(null);
        setInternalExportStage('');
        setInternalExportError(err.message || 'Word (.docx) export failed');
      },
    });
  };

  const handleDismissError = () => {
    if (onDismissError) {
      onDismissError();
    } else {
      setInternalExportError(null);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-100/90 relative overflow-hidden">
      {/* Preview Toolbar */}
      <div className="px-4 py-2.5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shadow-2xs z-10">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
            <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>{isA4 ? 'A4 Format' : 'US Letter'}</span>
            <span className="text-slate-400 text-[10px] hidden sm:inline">
              {isA4 ? '(210 × 297 mm)' : '(8.5 × 11 in)'}
            </span>
          </span>

          {onOpenLayoutTab && (
            <button
              id="btn-open-layout-preview"
              type="button"
              onClick={onOpenLayoutTab}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              title="Customize section layout and line spacing"
            >
              <ArrowUpDown className="w-3 h-3 text-indigo-600" />
              <span>Rearrange</span>
            </button>
          )}
        </div>

        {/* Action Buttons: Zoom & Export */}
        <div className="flex items-center gap-2">

          {/* Zoom controls */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-xs text-slate-700">
            <button
              id="btn-zoom-out"
              onClick={() => {
                setZoomLevel((prev) => Math.max(30, prev - 10));
                setHasManuallyZoomed(true);
              }}
              className="p-1.5 hover:bg-white rounded transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={fitToScreen}
              className="px-2 font-mono font-medium text-[11px] min-w-[42px] text-center hover:text-indigo-600 cursor-pointer"
              title="Click to auto-fit to screen"
            >
              {zoomLevel}%
            </button>
            <button
              id="btn-zoom-in"
              onClick={() => {
                setZoomLevel((prev) => Math.min(150, prev + 10));
                setHasManuallyZoomed(true);
              }}
              className="p-1.5 hover:bg-white rounded transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              id="btn-zoom-fit"
              onClick={fitToScreen}
              className="p-1.5 hover:bg-white rounded transition-colors cursor-pointer text-[11px] font-medium flex items-center gap-1 text-slate-700 hover:text-indigo-600"
              title="Fit to Window"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden xl:inline text-[10px] font-semibold">Fit</span>
            </button>
          </div>

          {/* Print / Vector Button */}
          <button
            id="btn-print-cover"
            onClick={triggerPrintCover}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            title="Print or Save via Browser System Dialog"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Print / Vector</span>
          </button>

          {/* Word (.docx) Export Button */}
          <button
            id="btn-download-docx"
            onClick={handleDownloadDocx}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 border border-blue-200/90 rounded-lg transition-all shadow-2xs hover:shadow-xs cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            title="Export fully editable Microsoft Word document (.docx)"
          >
            {isExporting && exportType === 'docx' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                <span>Word...</span>
              </>
            ) : (
              <>
                <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="hidden sm:inline">Word (.docx)</span>
                <span className="sm:hidden">Word</span>
              </>
            )}
          </button>

          {/* Instant PDF Export Button */}
          <button
            id="btn-download-pdf"
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg transition-all shadow-xs hover:shadow cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            title="Export print-ready PDF"
          >
            {isExporting && exportType === 'pdf' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                <span>Exporting PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span>Export PDF</span>
              </>
            )}
          </button>

          {/* Quick Share Link */}
          <button
            onClick={handleShare}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Copy shareable app link"
          >
            {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Exporting Progress Overlay Notification */}
      {isExporting && (
        <div className="absolute top-16 right-6 z-30 bg-slate-900/90 text-white text-xs px-4 py-3 rounded-xl shadow-xl backdrop-blur-sm flex items-center gap-3 animate-pulse border border-slate-700">
          <Loader2 className={`w-4 h-4 animate-spin ${exportType === 'docx' ? 'text-blue-400' : 'text-indigo-400'}`} />
          <div>
            <p className="font-bold">
              {exportType === 'docx' ? 'Generating Editable Word Document (.docx)...' : 'Generating Professional PDF...'}
            </p>
            <p className="text-slate-300 text-[11px]">{exportStage || 'Please wait a moment'}</p>
          </div>
        </div>
      )}

      {/* Error Notification Toast */}
      {exportError && (
        <div className="absolute top-16 right-6 z-30 bg-rose-950/90 text-white text-xs p-4 rounded-xl shadow-2xl backdrop-blur-md flex items-start gap-3 border border-rose-700/80 max-w-sm">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1.5">
            <p className="font-bold text-rose-100">PDF Render Note</p>
            <p className="text-rose-200/90 text-[11px] leading-relaxed">{exportError}</p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  handleDismissError();
                  triggerPrintCover();
                }}
                className="px-2.5 py-1 bg-white text-rose-900 rounded-md font-bold text-[11px] hover:bg-rose-100 transition-colors shadow-xs cursor-pointer"
              >
                Print to PDF (Vector)
              </button>
              <button
                onClick={handleDismissError}
                className="p-1 text-rose-300 hover:text-white rounded cursor-pointer"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Paper Desk / Stage */}
      <div
        id="assignment-cover-canvas-container"
        ref={containerRef}
        className="flex-1 min-h-0 overflow-auto p-4 md:p-6 flex items-center justify-center custom-scrollbar"
      >
        {/* Scaled Dimension Bounding Box (Matches exact scaled pixels in DOM layout) */}
        <div
          style={{
            width: `${Math.round(targetWidth * (zoomLevel / 100))}px`,
            height: `${Math.round(targetHeight * (zoomLevel / 100))}px`,
            position: 'relative',
            flexShrink: 0,
            transition: 'width 0.15s ease-out, height 0.15s ease-out',
          }}
          className="my-auto shadow-2xl ring-1 ring-black/10 rounded-sm"
        >
          {/* Printable Page Container (Full 794px resolution, scaled inside wrapper) */}
          <div
            id="assignment-cover-target"
            style={{
              width: `${targetWidth}px`,
              height: `${targetHeight}px`,
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: '0 0',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
            className="bg-white rounded-sm overflow-hidden print:shadow-none print:ring-0"
          >
            <CoverTemplateRenderer data={data} styleConfig={styleConfig} />
          </div>
        </div>
      </div>

      {/* Bottom Hint Banner */}
      <div className="px-5 py-2 bg-white/80 border-t border-slate-200/80 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2 backdrop-blur-xs">
        <span>
          Editing in <strong className="text-slate-700">Part 1</strong> updates this preview in real-time.
        </span>
        <span className="text-slate-500">
          Export as <strong className="text-indigo-600 font-semibold">PDF</strong> (print-ready) or <strong className="text-blue-600 font-semibold">Word (.docx)</strong> (fully editable in Microsoft Word & Google Docs).
        </span>
      </div>
    </div>
  );
};
