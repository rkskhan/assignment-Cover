import React from 'react';
import { AssignmentData, StyleConfig, CoverSectionId } from '../../types';
import { DEFAULT_SECTION_ORDER } from '../../presets';
import {
  getFontFamilyStyle,
  getSpacingPadding,
  getLineHeightStyle,
  getScaledFontSize,
  formatAcademicText,
} from './templateUtils';

interface TemplateProps {
  data: AssignmentData;
  styleConfig: StyleConfig;
}

export const ClassicTemplate: React.FC<TemplateProps> = ({ data, styleConfig }) => {
  const fontStyle = { fontFamily: getFontFamilyStyle(styleConfig.fontFamily) };
  const paddingClass = getSpacingPadding(styleConfig.spacing);
  const lineHeight = getLineHeightStyle(styleConfig);

  // Section Ordering and Visibility
  const rawOrder = styleConfig.sectionOrder && styleConfig.sectionOrder.length > 0 
    ? styleConfig.sectionOrder 
    : DEFAULT_SECTION_ORDER;
  const hidden = styleConfig.hiddenSections || [];
  const activeSections = rawOrder.filter((s) => !hidden.includes(s));

  // Determine submission columns layout if combined
  const subLayout = styleConfig.submissionLayout || 'stacked-instructor-first';

  // ================= SECTION 1: UNIVERSITY LOGO TO ASSIGNMENT TOPIC =================
  // MS Word "No Spacing" Format: zero margin, tight single line spacing
  const renderHeaderToTopic = () => (
    <div className="flex flex-col items-center text-center select-none" style={{ lineHeight }}>
      {/* University Logo */}
      {data.logoUrl && (
        <div
          className={`mb-2 flex ${
            data.logoPosition === 'left'
              ? 'self-start'
              : data.logoPosition === 'right'
              ? 'self-end'
              : 'self-center'
          }`}
        >
          <img
            src={data.logoUrl}
            alt="University Logo"
            style={{ width: `${data.logoWidth}px`, maxHeight: '140px' }}
            className="object-contain"
          />
        </div>
      )}

      {/* University Name */}
      <p
        className="font-bold tracking-normal m-0 p-0"
        style={{
          color: styleConfig.accentColor,
          fontSize: getScaledFontSize(26, styleConfig, true),
          lineHeight,
        }}
      >
        {data.universityName || 'Jagannath University'}
      </p>

      {/* Faculty Name (if present) */}
      {data.facultyName && (
        <p
          className="font-semibold text-slate-700 m-0 p-0"
          style={{ fontSize: getScaledFontSize(15, styleConfig), lineHeight }}
        >
          {data.facultyName}
        </p>
      )}

      {/* Department Name */}
      {data.departmentName && (
        <p
          className="font-bold m-0 p-0"
          style={{
            color: styleConfig.accentColor,
            fontSize: getScaledFontSize(18, styleConfig),
            lineHeight,
          }}
        >
          {data.departmentName}
        </p>
      )}

      {/* Course Title */}
      {data.courseName && (
        <p
          className="font-bold text-slate-900 m-0 p-0"
          style={{ fontSize: getScaledFontSize(17, styleConfig), lineHeight }}
        >
          Course title: {formatAcademicText(data.courseName)}
        </p>
      )}

      {/* Course Code */}
      {data.courseCode && (
        <p
          className="font-bold text-slate-900 m-0 p-0"
          style={{ fontSize: getScaledFontSize(17, styleConfig), lineHeight }}
        >
          Course code: {formatAcademicText(data.courseCode)}
        </p>
      )}

      {/* Assignment Classification */}
      <p
        className="font-bold text-slate-900 m-0 p-0"
        style={{
          fontSize: getScaledFontSize(23, styleConfig, true),
          lineHeight,
        }}
      >
        {formatAcademicText(data.assignmentType || 'Assignment')}
      </p>

      {/* On */}
      <p
        className="font-bold text-slate-900 m-0 p-0"
        style={{ fontSize: getScaledFontSize(19, styleConfig), lineHeight }}
      >
        On
      </p>

      {/* Topic / Title */}
      <p
        className="font-bold text-slate-900 m-0 p-0 max-w-xl"
        style={{
          fontSize: getScaledFontSize(25, styleConfig, true),
          lineHeight,
        }}
      >
        {formatAcademicText(data.title || 'Assignment Title')}
      </p>

      {/* Subtitle if any */}
      {data.subtitle && (
        <p
          className="text-slate-600 italic m-0 p-0 max-w-lg"
          style={{ fontSize: getScaledFontSize(14, styleConfig), lineHeight }}
        >
          {formatAcademicText(data.subtitle)}
        </p>
      )}

      {styleConfig.showDivider && (
        <div className="w-24 h-0.5 mt-2 mx-auto" style={{ backgroundColor: styleConfig.accentColor }} />
      )}
    </div>
  );

  // ================= SECTION 2: SUBMITTED TO =================
  // From "Submitted to:" to "Jagannath University, Dhaka-1100."
  const renderInstructorContent = (customClass = 'pl-2 sm:pl-4') => (
    <div className={`text-left select-none ${customClass}`} style={{ lineHeight }}>
      <p
        className="font-bold m-0 p-0"
        style={{
          color: styleConfig.accentColor,
          fontSize: getScaledFontSize(18, styleConfig),
          lineHeight,
        }}
      >
        Submitted to:
      </p>
      <p
        className="font-bold text-slate-900 m-0 p-0"
        style={{ fontSize: getScaledFontSize(16, styleConfig), lineHeight }}
      >
        {data.instructorName || 'Instructor Name'}
      </p>
      {data.instructorTitle && (
        <p
          className="text-slate-800 m-0 p-0"
          style={{ fontSize: getScaledFontSize(14, styleConfig), lineHeight }}
        >
          {data.instructorTitle}
        </p>
      )}
      {data.instructorDept && (
        <p
          className="text-slate-800 m-0 p-0 whitespace-pre-line"
          style={{ fontSize: getScaledFontSize(14, styleConfig), lineHeight }}
        >
          {data.instructorDept}
        </p>
      )}
      {data.campus && (
        <p
          className="text-slate-800 m-0 p-0"
          style={{ fontSize: getScaledFontSize(14, styleConfig), lineHeight }}
        >
          {data.campus}
        </p>
      )}
    </div>
  );

  const renderSubmittedTo = () => (
    <div className="w-full grid grid-cols-2 select-none">
      {renderInstructorContent('pl-2 sm:pl-4')}
      <div />
    </div>
  );

  // ================= SECTION 3: SUBMITTED BY & STUDENT DETAILS =================
  // Divided down the middle (50% width), positioned on the right half with left-alignment
  const renderStudentContent = (customClass = 'pl-2 sm:pl-4') => (
    <div className={`text-left select-none ${customClass}`} style={{ lineHeight }}>
      <p
        className="font-bold m-0 p-0"
        style={{
          color: styleConfig.accentColor,
          fontSize: getScaledFontSize(18, styleConfig),
          lineHeight,
        }}
      >
        Submitted by:
      </p>
      <p
        className="font-medium text-slate-900 m-0 p-0"
        style={{ fontSize: getScaledFontSize(16, styleConfig), lineHeight }}
      >
        {data.studentName || 'Student Name'}
      </p>
      {data.studentId && (
        <p
          className="text-slate-800 m-0 p-0"
          style={{ fontSize: getScaledFontSize(14, styleConfig), lineHeight }}
        >
          ID: {data.studentId}
        </p>
      )}
      {data.batch && (
        <p
          className="text-slate-800 m-0 p-0"
          style={{ fontSize: getScaledFontSize(14, styleConfig), lineHeight }}
        >
          Batch: {formatAcademicText(data.batch)}
        </p>
      )}
      {data.program && (
        <p
          className="text-slate-800 m-0 p-0"
          style={{ fontSize: getScaledFontSize(14, styleConfig), lineHeight }}
        >
          {formatAcademicText(data.program)}
        </p>
      )}
      {data.campus && (
        <p
          className="text-slate-800 m-0 p-0"
          style={{ fontSize: getScaledFontSize(14, styleConfig), lineHeight }}
        >
          {formatAcademicText(data.campus)}
        </p>
      )}
      {data.academicYear && (
        <p
          className="text-slate-800 m-0 p-0"
          style={{ fontSize: getScaledFontSize(14, styleConfig), lineHeight }}
        >
          Session: {formatAcademicText(data.academicYear)}
        </p>
      )}

      {/* Additional Group Members if any */}
      {data.additionalStudents && data.additionalStudents.length > 0 && (
        <div className="mt-1 pt-1 border-t border-dashed border-slate-300">
          <p
            className="font-bold text-slate-500 uppercase tracking-wider m-0 p-0 text-[11px]"
          >
            Group Partners:
          </p>
          {data.additionalStudents.map((partner) => (
            <p
              key={partner.id}
              className="text-slate-800 m-0 p-0 text-[13px]"
            >
              <span className="font-medium">{partner.name}</span>
              {partner.studentId && <span className="text-slate-600"> ({partner.studentId})</span>}
            </p>
          ))}
        </div>
      )}
    </div>
  );

  // Section 3: Page divided in the middle (50%), placed on the right side in left alignment
  const renderSubmittedBy = () => (
    <div className="w-full grid grid-cols-2 select-none">
      <div /> {/* Left half of page remains empty */}
      {renderStudentContent('pl-2 sm:pl-4')}
    </div>
  );

  // ================= SECTION 4: DATE OF SUBMISSION =================
  const renderSubmissionDate = () => {
    if (!data.submissionDate) return null;
    return (
      <div className="text-center select-none pt-2" style={{ lineHeight }}>
        <p
          className="font-bold text-slate-900 m-0 p-0"
          style={{ fontSize: getScaledFontSize(17, styleConfig), lineHeight }}
        >
          Date of Submission: <span className="font-normal">{formatAcademicText(data.submissionDate)}</span>
        </p>
      </div>
    );
  };

  // Granular Institution Only
  const renderInstitution = () => (
    <div className="flex flex-col items-center text-center select-none" style={{ lineHeight }}>
      {data.logoUrl && (
        <div className="mb-2 flex self-center">
          <img
            src={data.logoUrl}
            alt="University Logo"
            style={{ width: `${data.logoWidth}px`, maxHeight: '140px' }}
            className="object-contain"
          />
        </div>
      )}
      <p
        className="font-bold tracking-normal m-0 p-0"
        style={{
          color: styleConfig.accentColor,
          fontSize: getScaledFontSize(26, styleConfig, true),
          lineHeight,
        }}
      >
        {data.universityName || 'Jagannath University'}
      </p>
      {data.departmentName && (
        <p
          className="font-bold m-0 p-0"
          style={{
            color: styleConfig.accentColor,
            fontSize: getScaledFontSize(18, styleConfig),
            lineHeight,
          }}
        >
          {data.departmentName}
        </p>
      )}
      {data.facultyName && (
        <p
          className="font-semibold text-slate-700 m-0 p-0"
          style={{ fontSize: getScaledFontSize(15, styleConfig), lineHeight }}
        >
          {data.facultyName}
        </p>
      )}
    </div>
  );

  // Granular Course Only
  const renderCourse = () => {
    if (!data.courseName && !data.courseCode) return null;
    return (
      <div className="text-center text-slate-900 select-none" style={{ lineHeight }}>
        {data.courseName && (
          <p
            className="font-bold m-0 p-0"
            style={{ fontSize: getScaledFontSize(17, styleConfig), lineHeight }}
          >
            Course title: {formatAcademicText(data.courseName)}
          </p>
        )}
        {data.courseCode && (
          <p
            className="font-bold m-0 p-0"
            style={{ fontSize: getScaledFontSize(17, styleConfig), lineHeight }}
          >
            Course code: {formatAcademicText(data.courseCode)}
          </p>
        )}
      </div>
    );
  };

  // Granular Assignment Only
  const renderAssignment = () => (
    <div className="flex flex-col items-center text-center select-none" style={{ lineHeight }}>
      <p
        className="font-bold text-slate-900 m-0 p-0"
        style={{ fontSize: getScaledFontSize(23, styleConfig, true), lineHeight }}
      >
        {formatAcademicText(data.assignmentType || 'Assignment')}
      </p>
      <p
        className="font-bold text-slate-900 m-0 p-0"
        style={{ fontSize: getScaledFontSize(19, styleConfig), lineHeight }}
      >
        On
      </p>
      <p
        className="font-bold text-slate-900 m-0 p-0 max-w-xl"
        style={{ fontSize: getScaledFontSize(25, styleConfig, true), lineHeight }}
      >
        {formatAcademicText(data.title || 'Assignment Title')}
      </p>
      {data.subtitle && (
        <p
          className="text-slate-600 italic m-0 p-0 max-w-lg"
          style={{ fontSize: getScaledFontSize(14, styleConfig), lineHeight }}
        >
          {formatAcademicText(data.subtitle)}
        </p>
      )}
    </div>
  );

  // Combined Submission (when using combined 'submission' section or side-by-side)
  const renderSubmissionCombined = () => {
    if (subLayout === 'stacked-instructor-first') {
      return (
        <div className="space-y-4">
          {renderSubmittedTo()}
          {renderSubmittedBy()}
        </div>
      );
    }
    if (subLayout === 'stacked-student-first') {
      return (
        <div className="space-y-4">
          {renderSubmittedBy()}
          {renderSubmittedTo()}
        </div>
      );
    }
    if (subLayout === 'swapped') {
      return (
        <div className="grid grid-cols-2 gap-6 text-left items-start w-full">
          {renderStudentContent('')}
          {renderInstructorContent('pl-4 sm:pl-8')}
        </div>
      );
    }
    // Default side-by-side
    return (
      <div className="grid grid-cols-2 gap-6 text-left items-start w-full">
        {renderInstructorContent('')}
        {renderStudentContent('pl-4 sm:pl-8')}
      </div>
    );
  };

  const renderSectionNode = (sectionId: CoverSectionId) => {
    switch (sectionId) {
      case 'header-topic':
        return renderHeaderToTopic();
      case 'submitted-to':
        return renderSubmittedTo();
      case 'submitted-by':
        return renderSubmittedBy();
      case 'submission-date':
        return renderSubmissionDate();
      case 'institution':
        return renderInstitution();
      case 'course':
        return renderCourse();
      case 'assignment':
        return renderAssignment();
      case 'submission':
        return renderSubmissionCombined();
      case 'footer':
        return renderSubmissionDate();
      default:
        return null;
    }
  };

  return (
    <div
      className={`h-full w-full flex flex-col justify-between ${paddingClass} text-slate-900 bg-transparent`}
      style={{
        ...fontStyle,
        lineHeight,
      }}
    >
      {activeSections.map((secId) => (
        <React.Fragment key={secId}>
          {renderSectionNode(secId)}
        </React.Fragment>
      ))}
    </div>
  );
};
