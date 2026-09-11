/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AssignmentData, StyleConfig } from './types';
import { INITIAL_ASSIGNMENT_DATA, INITIAL_STYLE_CONFIG } from './presets';
import { Header } from './components/Header';
import { EditorPanel, EditorTabType } from './components/EditorPanel';
import { CoverPreview } from './components/CoverPreview';
import { exportCoverToPDF } from './utils/pdfExport';

export default function App() {
  const [editorTab, setEditorTab] = useState<EditorTabType>('details');
  // Load saved draft from localStorage or fallback to defaults
  const [data, setData] = useState<AssignmentData>(() => {
    try {
      const saved = localStorage.getItem('assignment_cover_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.universityName === 'STANFORD UNIVERSITY') {
          return INITIAL_ASSIGNMENT_DATA;
        }
        // If logo is the older default data URL, missing, or previous svg, upgrade to official /JnUlogo.png
        if (!parsed.logoUrl || parsed.logoUrl.startsWith('data:image/svg+xml') || parsed.logoUrl === '/JnUlogo.svg' || parsed.logoUrl.includes('JnUlogo.svg')) {
          parsed.logoUrl = '/JnUlogo.png';
        }
        return { ...INITIAL_ASSIGNMENT_DATA, ...parsed };
      }
    } catch {
      // Fallback
    }
    return INITIAL_ASSIGNMENT_DATA;
  });

  const [styleConfig, setStyleConfig] = useState<StyleConfig>(() => {
    try {
      const saved = localStorage.getItem('assignment_cover_style');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.accentColor === '#1e3a8a') {
          return INITIAL_STYLE_CONFIG;
        }
        // If font was the previous default 'cormorant', update to requested 'times'
        if (!parsed.fontFamily || parsed.fontFamily === 'cormorant') {
          parsed.fontFamily = 'times';
        }
        return { ...INITIAL_STYLE_CONFIG, ...parsed, paperSize: parsed.paperSize || 'a4' };
      }
    } catch {
      // Fallback
    }
    return INITIAL_STYLE_CONFIG;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('assignment_cover_data', JSON.stringify(data));
    } catch {
      // Ignore
    }
  }, [data]);

  useEffect(() => {
    try {
      localStorage.setItem('assignment_cover_style', JSON.stringify(styleConfig));
    } catch {
      // Ignore
    }
  }, [styleConfig]);

  const handleReset = () => {
    if (window.confirm('Reset assignment details and styling to standard default example?')) {
      setData(INITIAL_ASSIGNMENT_DATA);
      setStyleConfig(INITIAL_STYLE_CONFIG);
      localStorage.removeItem('assignment_cover_data');
      localStorage.removeItem('assignment_cover_style');
    }
  };

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportStage, setExportStage] = useState<string>('');
  const [exportError, setExportError] = useState<string | null>(null);

  const handleExportPDF = async () => {
    if (isExporting) return;
    const baseName = `${data.courseCode || 'Assignment'}_${data.studentName || 'Cover'}`;
    const filename = `${baseName}_Cover_Page`;

    await exportCoverToPDF({
      elementId: 'assignment-cover-target',
      filename,
      paperSize: styleConfig.paperSize,
      onStart: () => {
        setIsExporting(true);
        setExportError(null);
        setExportStage('Rendering high-resolution document...');
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
        setExportError(err.message || 'Export failed. You can use Print / Vector as a 100% reliable alternative.');
      },
    });
  };

  return (
    <div className="h-screen w-screen max-h-screen max-w-screen overflow-hidden flex flex-col bg-slate-100 text-slate-900 font-sans">
      {/* Top Application Bar */}
      <Header onQuickDownload={handleExportPDF} isExporting={isExporting} />

      {/* Main 2-Part Workspace Container: Both Part 1 & Part 2 Visible Side by Side */}
      <main className="flex-1 min-h-0 flex flex-row overflow-hidden relative">
        {/* Part 1: Details Editor Panel (Left Column) */}
        <section
          id="editor-part-1"
          className="editor-column w-[340px] sm:w-[380px] md:w-[420px] lg:w-[460px] xl:w-[500px] 2xl:w-[540px] h-full flex-shrink-0 z-10 border-r border-slate-200 flex flex-col bg-white overflow-hidden shadow-xs"
        >
          <EditorPanel
            data={data}
            setData={setData}
            styleConfig={styleConfig}
            setStyleConfig={setStyleConfig}
            onReset={handleReset}
            activeTab={editorTab}
            setActiveTab={setEditorTab}
          />
        </section>

        {/* Part 2: Live Layout Preview & PDF Exporter (Right Column - Always Side by Side) */}
        <section
          id="preview-part-2"
          className="flex-1 h-full min-w-0 overflow-hidden flex flex-col bg-slate-100"
        >
          <CoverPreview
            data={data}
            styleConfig={styleConfig}
            onOpenLayoutTab={() => setEditorTab('rearrange')}
            isExporting={isExporting}
            exportStage={exportStage}
            exportError={exportError}
            onExportPDF={handleExportPDF}
            onDismissError={() => setExportError(null)}
          />
        </section>
      </main>
    </div>
  );
}
