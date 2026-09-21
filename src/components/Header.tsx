import React from 'react';
import { Download, Check, Columns, Loader2, FileText } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  onExportPDF: () => void;
  onExportDocx: () => void;
  onQuickDownload?: () => void;
  isExporting?: boolean;
  exportType?: 'pdf' | 'docx' | null;
}

export const Header: React.FC<HeaderProps> = ({
  onExportPDF,
  onExportDocx,
  onQuickDownload,
  isExporting = false,
  exportType = null,
}) => {
  const handlePdfClick = onExportPDF || onQuickDownload;

  return (
    <header className="no-print bg-white border-b border-slate-200 px-4 md:px-6 py-2 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Redesigned Brand Logo & Title */}
      <BrandLogo size="md" />

      {/* Center Indicator: Side-by-Side Live Synchronized badge */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 shadow-2xs">
        <Columns className="w-3.5 h-3.5 text-indigo-600" />
        <span className="font-semibold text-slate-700">Part 1: Editor</span>
        <span className="text-slate-300">|</span>
        <span className="font-semibold text-slate-700">Part 2: Live Preview</span>
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 ml-0.5 animate-pulse" title="Live synchronized" />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        <div className="hidden 2xl:flex items-center gap-1 text-xs text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
          <Check className="w-3.5 h-3.5" />
          <span>Live Auto-Sync</span>
        </div>

        {/* Word (.docx) Export Button */}
        <button
          id="header-btn-export-docx"
          onClick={onExportDocx}
          disabled={isExporting}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 border border-blue-200/90 rounded-lg transition-all shadow-2xs cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          title="Export as editable Microsoft Word document (.docx)"
        >
          {isExporting && exportType === 'docx' ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
              <span>Word...</span>
            </>
          ) : (
            <>
              <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="hidden sm:inline">Export Word</span>
              <span className="sm:hidden">Word</span>
              <span className="text-[10px] font-extrabold text-blue-600 bg-blue-100/90 px-1 py-0.2 rounded leading-none">.docx</span>
            </>
          )}
        </button>

        {/* PDF Export Button */}
        <button
          id="header-btn-export-pdf"
          onClick={handlePdfClick}
          disabled={isExporting}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg transition-all shadow-xs cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          title="Export formatted print-ready PDF"
        >
          {isExporting && exportType === 'pdf' ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
              <span>PDF...</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Export PDF</span>
              <span className="sm:hidden">PDF</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
