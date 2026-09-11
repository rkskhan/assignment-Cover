import React from 'react';
import { AssignmentData, StyleConfig } from '../../types';
import { getFontFamilyStyle, getSpacingPadding, getLineHeightStyle } from './templateUtils';

interface TemplateProps {
  data: AssignmentData;
  styleConfig: StyleConfig;
}

export const TechTemplate: React.FC<TemplateProps> = ({ data, styleConfig }) => {
  const fontStyle = {
    fontFamily: getFontFamilyStyle(styleConfig.fontFamily),
    lineHeight: getLineHeightStyle(styleConfig),
  };
  const paddingClass = getSpacingPadding(styleConfig.spacing);
  const overlay = styleConfig.graphicOverlay ?? 'none';
  const isRightHeavy = [
    'diamond-ribbon',
    'growth-index-databook',
    'growth-index-edition',
    'sculptural-arch-ribbon',
    'cyan-wave',
    'ocean-wave',
    'architect-track',
  ].includes(overlay);

  return (
    <div
      className={`h-full w-full flex flex-col justify-between ${paddingClass} text-slate-900 bg-transparent font-mono relative overflow-hidden`}
      style={fontStyle}
    >
      {/* Technical Header Box */}
      <div className={`border-b-2 border-slate-900 pb-5 space-y-4 ${isRightHeavy ? 'max-w-[62%]' : ''}`}>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: styleConfig.accentColor }} />
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-600">
                LAB SPECIFICATION & TECHNICAL DOSSIER
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">
              {data.universityName || 'POLYTECHNIC INSTITUTE'}
            </h1>
            <p className="text-xs text-slate-600">
              {data.facultyName} {data.departmentName ? `// ${data.departmentName}` : ''}
            </p>
          </div>

          {data.logoUrl && !isRightHeavy && (
            <div className="border border-slate-300 p-1.5 bg-slate-50 rounded">
              <img
                src={data.logoUrl}
                alt="Logo"
                style={{ width: `${Math.min(data.logoWidth, 100)}px`, maxHeight: '75px' }}
                className="object-contain"
              />
            </div>
          )}
        </div>

        {/* Engineering Status Bar */}
        <div className="grid grid-cols-3 gap-2 text-xs bg-slate-100/90 backdrop-blur-xs p-2.5 rounded border border-slate-200">
          <div>
            <span className="text-slate-500 block text-[10px]">MODULE CODE:</span>
            <strong className="text-slate-800 font-bold">{data.courseCode || 'TECH-001'}</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">DOCUMENT TYPE:</span>
            <strong className="text-slate-800 font-bold">{data.assignmentType || 'LAB REPORT'}</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">STATUS:</span>
            <span className="inline-flex items-center text-emerald-700 font-bold text-[11px]">
              FINAL SUBMISSION
            </span>
          </div>
        </div>
      </div>

      {/* Main Technical Title Block */}
      <div className={`my-auto py-8 space-y-4 ${isRightHeavy ? 'max-w-[62%]' : ''}`}>
        <div className="space-y-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-800 inline-block">
            TOPIC // {data.courseName || 'Engineering Laboratory'}
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
            {data.title || 'Technical Project Title'}
          </h2>
        </div>

        {data.subtitle && (
          <div className="p-4 bg-white/90 backdrop-blur-xs border-l-2 border-slate-400 text-xs md:text-sm text-slate-700 leading-relaxed rounded-r">
            {data.subtitle}
          </div>
        )}
      </div>

      {/* Engineering Spec Metadata Table */}
      <div className={`space-y-4 border-t-2 border-slate-900 pt-5 ${isRightHeavy ? 'max-w-[62%]' : ''}`}>
        <div className="grid grid-cols-2 gap-4 text-xs">
          {/* Student Panel */}
          <div className="border border-slate-200 p-3 rounded space-y-1.5 bg-white/92 backdrop-blur-xs shadow-xs">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              PRIMARY INVESTIGATOR / STUDENT
            </div>
            <div className="text-sm font-bold text-slate-900">{data.studentName}</div>
            {data.studentId && (
              <div className="text-slate-700"><span className="text-slate-500">UID:</span> {data.studentId}</div>
            )}
            {data.program && (
              <div className="text-slate-600 text-[11px]">{data.program}</div>
            )}
            {data.batch && (
              <div className="text-slate-500 text-[11px]">{data.batch}</div>
            )}

            {data.additionalStudents && data.additionalStudents.length > 0 && (
              <div className="pt-2 mt-2 border-t border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold block">COLLABORATORS:</span>
                {data.additionalStudents.map((s) => (
                  <div key={s.id} className="text-[11px] text-slate-700">
                    {s.name} [{s.studentId}]
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Supervisor Panel */}
          <div className="border border-slate-200 p-3 rounded space-y-1.5 bg-white/92 backdrop-blur-xs shadow-xs">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              LAB SUPERVISOR / FACULTY
            </div>
            <div className="text-sm font-bold text-slate-900">{data.instructorName}</div>
            {data.instructorTitle && (
              <div className="text-slate-700 text-[11px]">{data.instructorTitle}</div>
            )}
            {data.instructorDept && (
              <div className="text-slate-600 text-[11px]">{data.instructorDept}</div>
            )}
            <div className="pt-2 text-[11px] text-slate-600">
              DATE: <span className="font-bold text-slate-900">{data.submissionDate || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Footer Hash Bar */}
        <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-200">
          <span>TERM: {data.academicYear || '2025/2026'}</span>
          <span>LOCATION: {data.campus || 'MAIN CAMPUS'}</span>
          <span>DOC-ID: REV-01</span>
        </div>
      </div>
    </div>
  );
};
