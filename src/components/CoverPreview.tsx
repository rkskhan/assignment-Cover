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
  ArrowUpDown
} from 'lucide-react';
import { AssignmentData, StyleConfig } from '../types';
import { CoverTemplateRenderer } from './templates/CoverTemplateRenderer';
import { exportCoverToPDF, triggerPrintCover } from '../utils/pdfExport';

interface CoverPreviewProps {
  data: AssignmentData;
  styleConfig: StyleConfig;
  onOpenLayoutTab?: () => void;
}

export const CoverPreview: React.FC<CoverPreviewProps> = ({ data, styleConfig, onOpenLayoutTab }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(55);
  const [hasManuallyZoomed, setHasManuallyZoomed] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportStage, setExportStage] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

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
    if (isExporting) return;

    const baseName = `${data.courseCode || 'Assignment'}_${data.studentName || 'Cover'}`;
    const filename = `${baseName}_Cover_Page`;

    await exportCoverToPDF({
      elementId: 'assignment-cover-target',
      filename,
      paperSize: styleConfig.paperSize,
      onStart: () => {
        setIsExporting(true);
        setExportStage('Initializing render...');
      },
      onProgress: (stage) => {
        setExportStage(stage);
      },
      onComplete: () => {
        setIsExporting(false);
        setExportStage('');
      },
      onError: (err) => {
        setIsExporting(false);
        setExportStage('');
        alert(`Export failed: ${err.message}. You can also use the 'Print / Vector' button to save as PDF!`);
      },
    });
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

          {/* Instant PDF Export Button */}
          <button
            id="btn-download-pdf"
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg transition-all shadow-sm hover:shadow cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Exporting PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
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
          <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
          <div>
            <p className="font-bold">Generating Professional PDF...</p>
            <p className="text-slate-300 text-[11px]">{exportStage || 'Please wait a moment'}</p>
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
        <span className="text-slate-400">
          Export creates print-ready 300 DPI PDF with embedded typography and crest.
        </span>
      </div>
    </div>
  );
};
