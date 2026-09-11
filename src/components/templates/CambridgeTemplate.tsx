import React from 'react';
import { AssignmentData, StyleConfig } from '../../types';
import { getFontFamilyStyle, getLineHeightStyle, formatAcademicText } from './templateUtils';

interface TemplateProps {
  data: AssignmentData;
  styleConfig: StyleConfig;
}

export const CambridgeTemplate: React.FC<TemplateProps> = ({ data, styleConfig }) => {
  const fontStyle = {
    fontFamily: getFontFamilyStyle(styleConfig.fontFamily),
    lineHeight: getLineHeightStyle(styleConfig),
  };

  return (
    <div
      className="h-full w-full p-8 md:p-10 flex flex-col justify-between text-slate-900 bg-transparent"
      style={fontStyle}
    >
      {/* Outer Cambridge Framing */}
      <div
        className="h-full w-full border-4 p-4 flex flex-col justify-between"
        style={{ borderColor: styleConfig.accentColor }}
      >
        <div
          className="h-full w-full border border-dashed p-6 flex flex-col justify-between"
          style={{ borderColor: `${styleConfig.accentColor}80` }}
        >
          {/* Header */}
          <div className="text-center flex flex-col items-center space-y-2.5">
            {data.logoUrl && (
              <div className="mb-2">
                <img
                  src={data.logoUrl}
                  alt="Institution Crest"
                  style={{ width: `${data.logoWidth}px`, maxHeight: '130px' }}
                  className="object-contain mx-auto"
                />
              </div>
            )}
            <h1
              className="text-xl md:text-2xl font-extrabold uppercase tracking-widest"
              style={{ color: styleConfig.accentColor }}
            >
              {data.universityName || 'COLLEGE OR UNIVERSITY'}
            </h1>
            {data.facultyName && (
              <p className="text-xs md:text-sm font-semibold tracking-wide text-slate-700 uppercase">
                {data.facultyName}
              </p>
            )}
            {data.departmentName && (
              <p className="text-xs text-slate-600 font-medium">
                {data.departmentName}
              </p>
            )}
            <div className="w-32 h-0.5 mx-auto mt-2" style={{ backgroundColor: styleConfig.accentColor }} />
          </div>

          {/* Title Box */}
          <div className="my-auto py-6 text-center space-y-4">
            {data.courseCode && (
              <div className="inline-block px-3 py-1 bg-slate-100 rounded text-xs font-bold tracking-wider text-slate-800 uppercase">
                Course: {data.courseCode} {data.courseName ? `| ${data.courseName}` : ''}
              </div>
            )}

            <div className="max-w-md mx-auto space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 leading-snug">
                {data.title || 'Assignment Title'}
              </h2>
              {data.subtitle && (
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed italic">
                  {data.subtitle}
                </p>
              )}
            </div>

            {data.assignmentType && (
              <p
                className="text-xs font-bold uppercase tracking-widest pt-2"
                style={{ color: styleConfig.accentColor }}
              >
                — {data.assignmentType} —
              </p>
            )}
          </div>

          {/* Structured Table for Submission Info */}
          <div className="space-y-4">
            <div className="border border-slate-300 rounded overflow-hidden text-xs">
              <div className="grid grid-cols-2 divide-x divide-slate-300">
                {/* Left Column: Student */}
                <div className="p-3 bg-slate-50/50 space-y-1">
                  <span
                    className="font-bold uppercase tracking-wider block text-[10px]"
                    style={{ color: styleConfig.accentColor }}
                  >
                    Candidate Details
                  </span>
                  <div className="font-semibold text-slate-900 text-sm">{data.studentName}</div>
                  {data.studentId && <div><span className="text-slate-500 font-medium">Roll / ID:</span> {data.studentId}</div>}
                  {data.program && <div><span className="text-slate-500 font-medium">Program:</span> {formatAcademicText(data.program)}</div>}
                  {data.batch && <div><span className="text-slate-500 font-medium">Batch:</span> {formatAcademicText(data.batch)}</div>}

                  {data.additionalStudents && data.additionalStudents.length > 0 && (
                    <div className="pt-2 mt-2 border-t border-slate-200">
                      <span className="text-[10px] text-slate-500 font-semibold uppercase block">Co-Authors:</span>
                      {data.additionalStudents.map((s) => (
                        <div key={s.id} className="text-[11px] text-slate-700">
                          {s.name} ({s.studentId})
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Column: Instructor */}
                <div className="p-3 space-y-1">
                  <span
                    className="font-bold uppercase tracking-wider block text-[10px]"
                    style={{ color: styleConfig.accentColor }}
                  >
                    Faculty Supervisor
                  </span>
                  <div className="font-semibold text-slate-900 text-sm">{data.instructorName}</div>
                  {data.instructorTitle && <div className="text-slate-700">{formatAcademicText(data.instructorTitle)}</div>}
                  {data.instructorDept && <div className="text-slate-600">{formatAcademicText(data.instructorDept)}</div>}
                </div>
              </div>
            </div>

            {/* Bottom Meta */}
            <div className="flex justify-between items-center text-[11px] text-slate-500 px-1">
              <div>Date: <strong className="text-slate-700">{formatAcademicText(data.submissionDate) || 'N/A'}</strong></div>
              <div>Session: <strong className="text-slate-700">{formatAcademicText(data.academicYear) || 'Current'}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
