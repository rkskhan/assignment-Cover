import React from 'react';
import { AssignmentData, StyleConfig } from '../../types';
import { getFontFamilyStyle, getSpacingPadding, getLineHeightStyle } from './templateUtils';

interface TemplateProps {
  data: AssignmentData;
  styleConfig: StyleConfig;
}

export const ModernTemplate: React.FC<TemplateProps> = ({ data, styleConfig }) => {
  const fontStyle = {
    fontFamily: getFontFamilyStyle(styleConfig.fontFamily),
    lineHeight: getLineHeightStyle(styleConfig),
  };
  const paddingClass = getSpacingPadding(styleConfig.spacing);
  const overlay = styleConfig.graphicOverlay ?? 'none';

  // 1. Specialized layout for Sculptural Arch & Ribbon (Image 4: Annual Report style)
  if (overlay === 'sculptural-arch-ribbon') {
    return (
      <div
        className={`h-full w-full flex flex-col justify-between ${paddingClass} text-slate-900 bg-transparent relative overflow-hidden`}
        style={fontStyle}
      >
        {/* Left-constrained content column (max-w-[56%]) avoiding the right sculptural arch and cerulean ribbon */}
        <div className="w-full max-w-[56%] space-y-6">
          {/* Top Institution & Faculty */}
          <div className="space-y-1 pt-2">
            <h1 className="text-base md:text-lg font-black tracking-tight text-slate-900 uppercase">
              {data.universityName || 'UNIVERSITY / INSTITUTION'}
            </h1>
            {data.facultyName && (
              <p className="text-xs text-slate-500 font-medium">
                {data.facultyName} {data.departmentName ? `• ${data.departmentName}` : ''}
              </p>
            )}
          </div>

          {/* Logo if present */}
          {data.logoUrl && (
            <div className="py-1">
              <img
                src={data.logoUrl}
                alt="Logo"
                style={{ width: `${Math.min(data.logoWidth, 100)}px`, maxHeight: '70px' }}
                className="object-contain"
              />
            </div>
          )}

          {/* Category / Course pill */}
          <div className="space-y-1">
            <span className="text-xs font-bold tracking-widest uppercase block text-[#0284c7]">
              {data.courseCode ? `${data.courseCode} — ${data.courseName || ''}` : (data.assignmentType || 'ANNUAL REPORT')}
            </span>
          </div>

          {/* Hero Title Section */}
          <div className="space-y-3 pt-2">
            <h2 className="text-2xl md:text-3xl font-black text-slate-950 uppercase leading-tight tracking-tight">
              {data.title || 'Assignment Title'}
            </h2>
            <div className="w-16 h-1 bg-[#0284c7]" />
            {data.subtitle && (
              <p className="text-xs md:text-sm text-slate-600 font-normal leading-relaxed">
                {data.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Section constrained to left 56% */}
        <div className="w-full max-w-[56%] space-y-4">
          <div className="bg-white/90 backdrop-blur-xs p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
            {/* Student */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Submitted By
              </span>
              <p className="text-sm font-bold text-slate-900">{data.studentName || 'Student Name'}</p>
              {data.studentId && (
                <p className="text-xs text-slate-600 font-mono">ID: {data.studentId}</p>
              )}
              {data.program && (
                <p className="text-xs text-slate-500">{data.program} {data.batch ? `• ${data.batch}` : ''}</p>
              )}
            </div>

            {/* Supervisor */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Supervised / Evaluated By
              </span>
              <p className="text-sm font-bold text-slate-900">{data.instructorName || 'Instructor'}</p>
              {data.instructorTitle && (
                <p className="text-xs text-slate-600">{data.instructorTitle} {data.instructorDept ? `• ${data.instructorDept}` : ''}</p>
              )}
            </div>
          </div>

          {/* Submission Date & Session */}
          <div className="flex justify-between items-center text-xs text-slate-500 pt-1 border-t border-slate-200">
            <span>Date: <strong className="text-slate-800 font-semibold">{data.submissionDate || 'Today'}</strong></span>
            <span>Session: <strong className="text-slate-800 font-semibold">{data.academicYear || '2025–2026'}</strong></span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Specialized layout for Growth Corporates Data Book (Image 2: Visa Data Book style)
  if (overlay === 'growth-index-databook') {
    return (
      <div
        className={`h-full w-full flex flex-col justify-between ${paddingClass} pb-24 text-slate-900 bg-transparent relative overflow-hidden`}
        style={fontStyle}
      >
        {/* Top left institution branding (max-w-[62%] avoiding arrowheads) */}
        <div className="w-full max-w-[62%] space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold tracking-widest uppercase block text-[#0052cc]">
              Academic Research Report
            </span>
            <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-slate-900">
              {data.universityName || 'UNIVERSITY NAME'}
            </h1>
            {data.facultyName && (
              <p className="text-xs text-slate-600">
                {data.facultyName} {data.departmentName ? `• ${data.departmentName}` : ''}
              </p>
            )}
          </div>

          {/* Hero Title styled like Working Capital Index */}
          <div className="space-y-2 pt-4">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0033a0] leading-tight tracking-tight">
              {data.title || 'Growth Corporates Working Capital Index'}
            </h2>
            <div className="w-20 h-1 bg-[#38bdf8]" />
            <p className="text-sm font-bold text-slate-700 tracking-wide">
              {data.academicYear || '2025–2026'}
            </p>
            {data.subtitle && (
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed pt-1">
                {data.subtitle}
              </p>
            )}
          </div>

          {/* Course tag */}
          {data.courseCode && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 border border-sky-200 rounded-md text-xs font-bold text-[#0033a0]">
              <span>{data.courseCode}</span>
              {data.courseName && <span className="font-semibold text-slate-700">• {data.courseName}</span>}
            </div>
          )}
        </div>

        {/* Metadata section kept in left 62% and above solid bottom research bar */}
        <div className="w-full max-w-[62%] space-y-4">
          <div className="bg-white/95 backdrop-blur-xs p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Author */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Author / Student
                </span>
                <p className="text-xs md:text-sm font-bold text-slate-900">{data.studentName || 'Student Name'}</p>
                {data.studentId && <p className="text-xs text-slate-600 font-mono">ID: {data.studentId}</p>}
                {data.program && <p className="text-xs text-slate-500">{data.program}</p>}
              </div>

              {/* Supervisor */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Supervisor
                </span>
                <p className="text-xs md:text-sm font-bold text-slate-900">{data.instructorName || 'Professor'}</p>
                {data.instructorTitle && <p className="text-xs text-slate-600">{data.instructorTitle}</p>}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
            <span>Date: <strong className="text-slate-800 font-semibold">{data.submissionDate || 'Today'}</strong></span>
            <span>Edition: <strong className="text-slate-800 font-semibold">{data.batch || 'Primary Edition'}</strong></span>
          </div>
        </div>
      </div>
    );
  }

  // 3. Specialized layout for Orbital Particle Globe (Image 3: EUTAX Observatory style)
  if (overlay === 'orbital-particle-globe') {
    return (
      <div
        className={`h-full w-full flex flex-col justify-between ${paddingClass} text-slate-900 bg-transparent relative overflow-hidden`}
        style={fontStyle}
      >
        {/* Upper Left Title Zone (max-w-[70%]) */}
        <div className="w-full max-w-[70%] space-y-4 pt-12">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 block">
              {data.courseCode ? `${data.courseCode} • ${data.courseName || ''}` : (data.facultyName || 'GLOBAL RESEARCH')}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-950 uppercase tracking-tight leading-none pt-1">
              {data.title || 'GLOBAL TAX EVASION'}
            </h2>
            <div className="inline-block bg-slate-950 text-white font-black text-xs uppercase tracking-wider px-3.5 py-1 rounded-xs mt-2">
              {data.assignmentType || 'REPORT'} {data.academicYear || '2026'}
            </div>
            {data.subtitle && (
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed max-w-md pt-2">
                {data.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Center has the particle globe, lower area has think tank attribution credits */}
        <div className="w-full grid grid-cols-2 gap-4 items-end pt-8">
          {/* Student Attribution on the left */}
          <div className="bg-white/90 backdrop-blur-xs p-3.5 rounded-lg border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Prepared & Submitted By
            </span>
            <p className="text-xs md:text-sm font-bold text-slate-900">{data.studentName || 'Student Name'}</p>
            {data.studentId && <p className="text-[11px] text-slate-600 font-mono">ID: {data.studentId}</p>}
            {data.program && <p className="text-[11px] text-slate-500">{data.program} {data.batch ? `• ${data.batch}` : ''}</p>}
          </div>

          {/* Supervisor Attribution on the right (EUTAX Foreword style) */}
          <div className="bg-white/90 backdrop-blur-xs p-3.5 rounded-lg border border-slate-200/80 shadow-xs space-y-1 text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Supervised / Evaluated By
            </span>
            <p className="text-xs md:text-sm font-bold text-slate-900">{data.instructorName || 'Supervisor'}</p>
            {data.instructorTitle && <p className="text-[11px] text-slate-600">{data.instructorTitle}</p>}
            {data.instructorDept && <p className="text-[10px] text-slate-500">{data.instructorDept}</p>}
          </div>
        </div>
      </div>
    );
  }

  // 4. Default / Adaptive layout for other graphic presets & default
  const isRightHeavy = [
    'cyan-wave',
    'ocean-wave',
    'diamond-ribbon',
    'architect-track',
    'mosaic-curves',
    'prism-cascade',
    'growth-index-edition',
  ].includes(overlay);

  return (
    <div
      className={`h-full w-full flex flex-col justify-between ${paddingClass} text-slate-900 bg-transparent relative overflow-hidden`}
      style={fontStyle}
    >
      {/* Decorative colored top-right subtle accent mark (only when no full overlay) */}
      {(!styleConfig.graphicOverlay || styleConfig.graphicOverlay === 'none') && (
        <div
          className="absolute top-0 right-0 w-36 h-36 opacity-10 pointer-events-none -mr-12 -mt-12 rounded-full"
          style={{ backgroundColor: styleConfig.accentColor }}
        />
      )}

      {/* Top Header: Brand & Institution */}
      <div className={`space-y-4 ${isRightHeavy ? 'max-w-[62%]' : ''}`}>
        <div className="flex items-center justify-between border-b pb-6 border-slate-100">
          <div className="space-y-1">
            <span
              className="text-xs font-bold tracking-widest uppercase block"
              style={{ color: styleConfig.accentColor }}
            >
              Academic Submission
            </span>
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900">
              {data.universityName || 'UNIVERSITY NAME'}
            </h1>
            {data.facultyName && (
              <p className="text-xs md:text-sm text-slate-600 font-medium">
                {data.facultyName} {data.departmentName ? `• ${data.departmentName}` : ''}
              </p>
            )}
          </div>

          {data.logoUrl && !isRightHeavy && (
            <div className="flex-shrink-0">
              <img
                src={data.logoUrl}
                alt="Logo"
                style={{ width: `${Math.min(data.logoWidth, 120)}px`, maxHeight: '90px' }}
                className="object-contain"
              />
            </div>
          )}
        </div>

        {data.courseCode && (
          <div className="flex items-center gap-3 pt-2">
            <span
              className="px-2.5 py-1 text-xs font-bold rounded text-white"
              style={{ backgroundColor: styleConfig.accentColor }}
            >
              {data.courseCode}
            </span>
            {data.courseName && (
              <span className="text-sm font-semibold text-slate-700">
                {data.courseName}
              </span>
            )}
            {data.assignmentType && (
              <span className="ml-auto text-xs font-medium text-slate-500 tracking-wide uppercase">
                {data.assignmentType}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Hero Title Section */}
      <div className={`my-auto py-8 pl-4 border-l-4 space-y-4 ${isRightHeavy ? 'max-w-[62%]' : ''}`} style={{ borderColor: styleConfig.accentColor }}>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight tracking-tight">
          {data.title || 'Assignment Title'}
        </h2>
        {data.subtitle && (
          <p className="text-base md:text-lg text-slate-600 font-normal leading-relaxed max-w-xl">
            {data.subtitle}
          </p>
        )}
      </div>

      {/* Metadata Grid */}
      <div className={`space-y-6 ${isRightHeavy ? 'max-w-[62%]' : ''}`}>
        <div className={`grid grid-cols-2 gap-6 ${isRightHeavy ? 'bg-white/90 backdrop-blur-xs border border-slate-200/80 shadow-xs' : 'bg-slate-50 border border-slate-100'} p-6 rounded-xl`}>
          {/* Author info */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Author / Student
            </span>
            <p className="text-base font-bold text-slate-900">
              {data.studentName || 'Student Name'}
            </p>
            {data.studentId && (
              <p className="text-xs text-slate-600">
                ID: <span className="font-mono font-medium">{data.studentId}</span>
              </p>
            )}
            {data.program && (
              <p className="text-xs text-slate-600">{data.program}</p>
            )}
            {data.batch && (
              <p className="text-xs text-slate-500">{data.batch}</p>
            )}

            {data.additionalStudents && data.additionalStudents.length > 0 && (
              <div className="pt-2 mt-2 border-t border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Group Members:</span>
                {data.additionalStudents.map((mem) => (
                  <div key={mem.id} className="text-xs text-slate-700 font-medium">
                    {mem.name} <span className="text-slate-400 font-mono">({mem.studentId})</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instructor info */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Evaluator / Supervisor
            </span>
            <p className="text-base font-bold text-slate-900">
              {data.instructorName || 'Professor'}
            </p>
            {data.instructorTitle && (
              <p className="text-xs text-slate-700 font-medium">{data.instructorTitle}</p>
            )}
            {data.instructorDept && (
              <p className="text-xs text-slate-500">{data.instructorDept}</p>
            )}
          </div>
        </div>

        {/* Bottom meta line */}
        <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Submission Date: <strong className="text-slate-800 font-semibold">{data.submissionDate || 'Today'}</strong></span>
          <span>Academic Year: <strong className="text-slate-800 font-semibold">{data.academicYear || '2025–2026'}</strong></span>
        </div>
      </div>
    </div>
  );
};
