import React from 'react';
import { Download, Check, Columns, Loader2 } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  onQuickDownload: () => void;
  isExporting?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onQuickDownload, isExporting = false }) => {
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
      <div className="flex items-center gap-3">
        <div className="hidden xl:flex items-center gap-1 text-xs text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
          <Check className="w-3.5 h-3.5" />
          <span>Live Auto-Sync</span>
        </div>

        <button
          onClick={onQuickDownload}
          disabled={isExporting}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg transition-all shadow-xs cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          title="Export formatted PDF"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
