import React from 'react';
import { AssignmentData, StyleConfig } from '../../types';
import { getFontFamilyStyle, getLineHeightStyle } from './templateUtils';

interface TemplateProps {
  data: AssignmentData;
  styleConfig: StyleConfig;
}

export const EditorialTemplate: React.FC<TemplateProps> = ({ data, styleConfig }) => {
  const fontStyle = {
    fontFamily: getFontFamilyStyle(styleConfig.fontFamily),
    lineHeight: getLineHeightStyle(styleConfig),
  };

  return (
    <div
      className="h-full w-full flex flex-col justify-between text-slate-900 bg-transparent"
      style={fontStyle}
    >
      {/* Top Prominent Banner */}
      <div
        className="p-8 text-white flex items-center justify-between shadow-sm"
        style={{ backgroundColor: styleConfig.accentColor }}
      >
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-widest text-white/80 font-medium">
            Academic Report & Coursework
          </p>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white uppercase">
            {data.universityName || 'UNIVERSITY NAME'}
          </h1>
          {data.facultyName && (
            <p className="text-xs text-white/90">{data.facultyName}</p>
          )}
        </div>

        {data.logoUrl && (
          <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
            <img
              src={data.logoUrl}
              alt="Logo"
              style={{ width: `${Math.min(data.logoWidth, 100)}px`, maxHeight: '80px' }}
              className="object-contain filter brightness-0 invert"
              onError={(e) => {
                // If invert fails for colored logos, remove filter
                (e.currentTarget as HTMLElement).className = 'object-contain';
              }}
            />
          </div>
        )}
      </div>

      {/* Main Body */}
      <div className="p-10 md:p-14 flex-1 flex flex-col justify-between">
        {/* Course & Type Badges */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {data.assignmentType && (
              <span
                className="text-xs font-bold tracking-wider uppercase px-3 py-1 rounded"
                style={{
                  backgroundColor: `${styleConfig.accentColor}15`,
                  color: styleConfig.accentColor,
                }}
              >
                {data.assignmentType}
              </span>
            )}
            {data.courseCode && (
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {data.courseCode} {data.courseName ? `• ${data.courseName}` : ''}
              </span>
            )}
          </div>

          <div className="space-y-3 pt-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
              {data.title || 'Assignment Title'}
            </h2>
            {data.subtitle && (
              <p className="text-base text-slate-600 leading-relaxed font-normal">
                {data.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Two-Column Metadata Box */}
        <div className="pt-8">
          <div className="grid grid-cols-2 gap-8 p-6 bg-slate-50/80 rounded-lg border border-slate-200/80">
            {/* Student Column */}
            <div className="space-y-1.5 border-r border-slate-200 pr-4">
              <span
                className="text-[11px] font-bold uppercase tracking-wider block"
                style={{ color: styleConfig.accentColor }}
              >
                Prepared By
              </span>
              <p className="text-base font-bold text-slate-900">{data.studentName}</p>
              {data.studentId && (
                <p className="text-xs text-slate-600 font-mono">ID: {data.studentId}</p>
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
                    <div key={mem.id} className="text-xs text-slate-700">
                      {mem.name} <span className="text-slate-400">({mem.studentId})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Instructor Column */}
            <div className="space-y-1.5 pl-2">
              <span
                className="text-[11px] font-bold uppercase tracking-wider block"
                style={{ color: styleConfig.accentColor }}
              >
                Presented To
              </span>
              <p className="text-base font-bold text-slate-900">{data.instructorName}</p>
              {data.instructorTitle && (
                <p className="text-xs text-slate-700">{data.instructorTitle}</p>
              )}
              {data.instructorDept && (
                <p className="text-xs text-slate-500">{data.instructorDept}</p>
              )}
              <div className="pt-4 text-xs text-slate-500">
                <span>Date: <strong className="text-slate-800">{data.submissionDate || 'N/A'}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Footer Bar */}
      <div className="px-10 py-4 bg-slate-100/70 border-t border-slate-200 text-xs text-slate-500 flex justify-between">
        <span>{data.departmentName || 'Academic Department'}</span>
        <span>Academic Year: {data.academicYear || '2025–2026'}</span>
      </div>
    </div>
  );
};
