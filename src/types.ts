export type TemplateId = 'classic' | 'modern' | 'cambridge' | 'editorial' | 'tech' | 'executive';

export type FontId = 
  | 'times'
  | 'cormorant' 
  | 'cinzel' 
  | 'baskerville' 
  | 'eb-garamond' 
  | 'inter' 
  | 'outfit' 
  | 'montserrat' 
  | 'mono';

export type BorderStyle = 
  | 'none' 
  | 'single' 
  | 'double' 
  | 'formal-corner' 
  | 'accent-edge'
  | 'geometric-frame'
  | 'dashed-architect'
  | 'thick-thin'
  | 'rounded-box'
  | 'ornate-corners';

export type GraphicOverlayStyle = 
  | 'none'
  | 'cyan-wave'
  | 'ocean-wave'
  | 'diamond-ribbon'
  | 'architect-track'
  | 'mint-leaf-wave'
  | 'diagonal-cut'
  | 'teal-lime-s'
  | 'classical-pillars'
  | 'prism-cascade'
  | 'mosaic-curves'
  | 'growth-index-databook'
  | 'growth-index-edition'
  | 'orbital-particle-globe'
  | 'sculptural-arch-ribbon';

export type PaperSize = 'a4' | 'letter';

export type SpacingDensity = 'compact' | 'balanced' | 'spacious';

export interface GroupMember {
  id: string;
  name: string;
  studentId: string;
}

export interface AssignmentData {
  universityName: string;
  facultyName: string;
  departmentName: string;
  campus: string;
  logoUrl: string | null;
  logoWidth: number; // in pixels
  logoPosition: 'center' | 'left' | 'right';
  
  title: string;
  subtitle: string;
  courseCode: string;
  courseName: string;
  assignmentType: string;
  
  studentName: string;
  studentId: string;
  additionalStudents: GroupMember[];
  program: string;
  batch: string;
  
  instructorName: string;
  instructorTitle: string;
  instructorDept: string;
  submissionDate: string;
  academicYear: string;
}

export type CoverSectionId = 
  | 'header-topic'      // Section 1: University Logo to Assignment Topic
  | 'submitted-to'      // Section 2: Submitted To (Instructor & Jagannath Univ., Dhaka-1100)
  | 'submitted-by'      // Section 3: Submitted By (Student Details & Jagannath Univ., Dhaka-1100)
  | 'submission-date'   // Section 4: Date of Submission
  | 'institution'       // Granular: Institution Crest & Names
  | 'course'            // Granular: Course Info
  | 'assignment'        // Granular: Assignment Topic
  | 'submission'        // Granular: Combined Submission Parties
  | 'footer';           // Granular: Footer

export type SubmissionLayout = 
  | 'side-by-side' 
  | 'swapped' 
  | 'stacked-instructor-first' 
  | 'stacked-student-first';

export type LineSpacingMode = 'word-no-space' | 'golden' | 'compact' | 'balanced' | 'relaxed' | 'custom';

export type FontSizeMode = 'golden' | 'compact' | 'standard' | 'large' | 'custom';

export interface StyleConfig {
  template: TemplateId;
  fontFamily: FontId;
  accentColor: string;
  borderStyle: BorderStyle;
  borderWidth?: number; // 1 to 6 px
  borderColor?: string;
  borderInset?: number; // 8 to 36 px
  graphicOverlay?: GraphicOverlayStyle;
  paperSize: PaperSize;
  spacing: SpacingDensity;
  showDivider: boolean;
  showWatermark: boolean;
  watermarkText: string;

  // Rearrange Sections & Layout
  sectionOrder?: CoverSectionId[];
  hiddenSections?: CoverSectionId[];
  submissionLayout?: SubmissionLayout;

  // Space between lines (Golden ratio & custom leading)
  lineSpacingMode?: LineSpacingMode;
  lineSpacingValue?: number; // e.g. 1.618 for golden, or 1.10 - 2.50
  sectionSpacingMultiplier?: number; // space between sections multiplier (0.6x to 2.0x, golden is 1.618)

  // Font size & typography scaling
  fontSizeMode?: FontSizeMode;
  fontScaleMultiplier?: number; // 0.75 to 1.40 (1.0 default, golden ratio preset 1.08)
}

export interface StylePreset {
  id: string;
  name: string;
  subtitle: string;
  template: TemplateId;
  fontFamily: FontId;
  accentColor: string;
  borderStyle: BorderStyle;
  graphicOverlay: GraphicOverlayStyle;
  badge: string;
  previewColor: string;
  previewSecondary?: string;
}

export interface FontOption {
  id: FontId;
  name: string;
  category: 'Serif' | 'Sans' | 'Display' | 'Monospace';
  fontFamilyClass: string;
  description: string;
}

export interface TemplateOption {
  id: TemplateId;
  name: string;
  description: string;
  badge: string;
}

export interface ColorPreset {
  name: string;
  hex: string;
  description: string;
}
