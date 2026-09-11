import React from 'react';
import { AssignmentData, StyleConfig } from '../../types';
import { getFontFamilyStyle, getSpacingPadding, getLineHeightStyle } from './templateUtils';

interface TemplateProps {
  data: AssignmentData;
  styleConfig: StyleConfig;
}

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ data, styleConfig }) => {
  const fontStyle = {
    fontFamily: getFontFamilyStyle(styleConfig.fontFamily),
    lineHeight: getLineHeightStyle(styleConfig),
  };
  const paddingClass = getSpacingPadding(styleConfig.spacing);
  const overlay = styleConfig.graphicOverlay ?? 'none';
  const isEditionPreset = overlay === 'growth-index-edition';
  const isRightHeavy = isEditionPreset || overlay === 'diagonal-cut';

  return (
    <div
      className={`h-full w-full flex flex-col justify-between ${paddingClass} text-slate-900 bg-transparent relative overflow-hidden`}
      style={fontStyle}
    >
      {/* Top Section */}
      <div className={`space-y-4 ${isRightHeavy ? 'max-w-[62%]' : ''}`}>
        <div className="flex justify-between items-start border-b border-slate-300 pb-6">
          <div className="space-y-1">
            <h1
              className="text-lg md:text-xl font-bold uppercase tracking-widest"
              style={{ color: styleConfig.accentColor }}
            >
              {data.universityName || 'BUSINESS SCHOOL / INSTITUTION'}
            </h1>
            {data.facultyName && (
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                {data.facultyName}
              </p>
            )}
            {data.departmentName && (
              <p className="text-xs text-slate-500">{data.departmentName}</p>
            )}
          </div>

          {data.logoUrl && !isRightHeavy && (
            <div className="flex-shrink-0">
              <img
                src={data.logoUrl}
                alt="Logo"
                style={{ width: `${Math.min(data.logoWidth, 110)}px`, maxHeight: '85px' }}
                className="object-contain"
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
          <span>{data.courseCode ? `${data.courseCode} — ${data.courseName}` : data.courseName}</span>
          {data.assignmentType && (
            <span
              className="font-bold uppercase tracking-wider px-2 py-0.5 rounded"
              style={{
                backgroundColor: `${styleConfig.accentColor}12`,
                color: styleConfig.accentColor,
              }}
            >
              {data.assignmentType}
            </span>
          )}
        </div>
      </div>

      {/* Center Title */}
      <div className={`my-auto py-8 space-y-4 ${isRightHeavy ? 'max-w-[62%]' : ''}`}>
        <div className="w-16 h-1" style={{ backgroundColor: styleConfig.accentColor }} />
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight tracking-tight">
          {data.title || 'Executive Case Study & Strategic Analysis'}
        </h2>
        {data.subtitle && (
          <p className="text-sm text-slate-600 font-normal leading-relaxed max-w-xl">
            {data.subtitle}
          </p>
        )}
      </div>

      {/* Bottom Metadata Block */}
      <div className={`${isRightHeavy ? 'max-w-[58%] bg-white/95 backdrop-blur-xs p-5 rounded-xl border border-slate-200 shadow-xs' : 'border-t-2 border-slate-900 pt-6'} space-y-4`}>
        <div className={`${isEditionPreset ? 'space-y-3' : 'grid grid-cols-2 gap-6'} text-left`}>
          {/* Author */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
              Prepared By
            </span>
            <p className="text-sm font-bold text-slate-900">{data.studentName}</p>
            {data.studentId && (
              <p className="text-xs text-slate-600">Candidate ID: <span className="font-mono">{data.studentId}</span></p>
            )}
            {data.program && (
              <p className="text-xs text-slate-600">{data.program}</p>
            )}
            {data.batch && (
              <p className="text-xs text-slate-500">{data.batch}</p>
            )}

            {data.additionalStudents && data.additionalStudents.length > 0 && (
              <div className="pt-2 mt-2 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Team Members:</span>
                {data.additionalStudents.map((mem) => (
                  <div key={mem.id} className="text-xs text-slate-700">
                    {mem.name} ({mem.studentId})
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instructor */}
          <div className={`space-y-1 ${isEditionPreset ? 'pt-2 border-t border-slate-100' : ''}`}>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
              Reviewed By
            </span>
            <p className="text-sm font-bold text-slate-900">{data.instructorName}</p>
            {data.instructorTitle && (
              <p className="text-xs text-slate-700">{data.instructorTitle}</p>
            )}
            {data.instructorDept && (
              <p className="text-xs text-slate-500">{data.instructorDept}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-200">
          <span>Submission: <strong className="text-slate-800">{data.submissionDate || 'N/A'}</strong></span>
          <span>Session: <strong className="text-slate-800">{data.academicYear || '2025–2026'}</strong></span>
        </div>
      </div>
    </div>
  );
};
