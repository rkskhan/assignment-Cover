import React, { useState, useRef } from 'react';
import {
  School,
  FileText,
  User,
  GraduationCap,
  Palette,
  Upload,
  Trash2,
  Plus,
  Calendar,
  Image as ImageIcon,
  Check,
  RotateCcw,
  Sparkles,
  Sliders,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  GripVertical,
  Type,
  SlidersHorizontal,
  BookMarked,
  Users,
  Superscript,
} from 'lucide-react';
import { toUnicodeSuperscript } from './templates/templateUtils';
import {
  AssignmentData,
  StyleConfig,
  TemplateId,
  FontId,
  BorderStyle,
  PaperSize,
  SpacingDensity,
  GraphicOverlayStyle,
  CoverSectionId,
  SubmissionLayout,
  LineSpacingMode,
  FontSizeMode,
} from '../types';
import {
  FONT_OPTIONS,
  TEMPLATE_OPTIONS,
  COLOR_PRESETS,
  STYLE_PRESETS,
  BORDER_STYLE_OPTIONS,
  DEFAULT_SECTION_ORDER,
  SECTION_METADATA,
  SECTION_ORDER_PRESETS,
} from '../presets';

export type EditorTabType = 'details' | 'design' | 'rearrange';

interface EditorPanelProps {
  data: AssignmentData;
  setData: React.Dispatch<React.SetStateAction<AssignmentData>>;
  styleConfig: StyleConfig;
  setStyleConfig: React.Dispatch<React.SetStateAction<StyleConfig>>;
  onReset: () => void;
  activeTab?: EditorTabType;
  setActiveTab?: (tab: EditorTabType) => void;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
  data,
  setData,
  styleConfig,
  setStyleConfig,
  onReset,
  activeTab: externalActiveTab,
  setActiveTab: externalSetActiveTab,
}) => {
  const [internalTab, setInternalTab] = useState<EditorTabType>('details');
  const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalTab;
  const setActiveTab = externalSetActiveTab !== undefined ? externalSetActiveTab : setInternalTab;
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Field change helper
  const handleFieldChange = <K extends keyof AssignmentData>(key: K, value: AssignmentData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  // Style change helper
  const handleStyleChange = <K extends keyof StyleConfig>(key: K, value: StyleConfig[K]) => {
    setStyleConfig((prev) => ({ ...prev, [key]: value }));
  };

  // Image Upload handler
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, SVG, WebP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        handleFieldChange('logoUrl', result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Add group member
  const addGroupMember = () => {
    const newMember = {
      id: Date.now().toString(),
      name: '',
      studentId: '',
    };
    handleFieldChange('additionalStudents', [...(data.additionalStudents || []), newMember]);
  };

  // Remove group member
  const removeGroupMember = (id: string) => {
    handleFieldChange(
      'additionalStudents',
      (data.additionalStudents || []).filter((item) => item.id !== id)
    );
  };

  // Update group member
  const updateGroupMember = (id: string, field: 'name' | 'studentId', val: string) => {
    handleFieldChange(
      'additionalStudents',
      (data.additionalStudents || []).map((item) =>
        item.id === id ? { ...item, [field]: val } : item
      )
    );
  };

  // Section Reordering Helpers
  const currentSectionOrder: CoverSectionId[] =
    styleConfig.sectionOrder && styleConfig.sectionOrder.length > 0
      ? styleConfig.sectionOrder
      : DEFAULT_SECTION_ORDER;

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentSectionOrder.length) return;
    const newOrder = [...currentSectionOrder];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIndex, 0, moved);
    handleStyleChange('sectionOrder', newOrder);
  };

  const toggleSectionVisibility = (sectionId: CoverSectionId) => {
    const currentHidden = styleConfig.hiddenSections || [];
    const isHidden = currentHidden.includes(sectionId);
    const newHidden = isHidden
      ? currentHidden.filter((id) => id !== sectionId)
      : [...currentHidden, sectionId];
    handleStyleChange('hiddenSections', newHidden);
  };

  const applySectionOrderPreset = (order: CoverSectionId[]) => {
    handleStyleChange('sectionOrder', order);
  };

  // Line Spacing Helpers
  const applyWordNoSpacing = () => {
    setStyleConfig((prev) => ({
      ...prev,
      lineSpacingMode: 'word-no-space',
      lineSpacingValue: 1.15,
    }));
  };

  const applyGoldenRatioLineSpacing = () => {
    setStyleConfig((prev) => ({
      ...prev,
      lineSpacingMode: 'golden',
      lineSpacingValue: 1.618,
    }));
  };

  const setLineSpacingMode = (mode: LineSpacingMode) => {
    let val = 1.15;
    if (mode === 'word-no-space') val = 1.15;
    else if (mode === 'compact') val = 1.25;
    else if (mode === 'balanced') val = 1.45;
    else if (mode === 'relaxed') val = 1.80;
    else if (mode === 'golden') val = 1.618;
    else if (mode === 'custom') val = styleConfig.lineSpacingValue ?? 1.15;

    setStyleConfig((prev) => ({
      ...prev,
      lineSpacingMode: mode,
      lineSpacingValue: val,
    }));
  };

  // Font Size Scaling Helpers
  const applyGoldenRatioFontSize = () => {
    setStyleConfig((prev) => ({
      ...prev,
      fontSizeMode: 'golden',
      fontScaleMultiplier: 1.05,
    }));
  };

  const setFontSizeMode = (mode: FontSizeMode) => {
    let multiplier = 1.0;
    if (mode === 'compact') multiplier = 0.90;
    else if (mode === 'standard') multiplier = 1.00;
    else if (mode === 'large') multiplier = 1.15;
    else if (mode === 'golden') multiplier = 1.05;
    else if (mode === 'custom') multiplier = styleConfig.fontScaleMultiplier ?? 1.0;

    setStyleConfig((prev) => ({
      ...prev,
      fontSizeMode: mode,
      fontScaleMultiplier: multiplier,
    }));
  };

  const getSectionIcon = (id: CoverSectionId) => {
    switch (id) {
      case 'header-topic':
        return <School className="w-4 h-4 text-indigo-600" />;
      case 'submitted-to':
        return <GraduationCap className="w-4 h-4 text-amber-600" />;
      case 'submitted-by':
        return <User className="w-4 h-4 text-emerald-600" />;
      case 'submission-date':
        return <Calendar className="w-4 h-4 text-purple-600" />;
      case 'institution':
        return <School className="w-4 h-4 text-indigo-600" />;
      case 'course':
        return <BookMarked className="w-4 h-4 text-emerald-600" />;
      case 'assignment':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'submission':
        return <Users className="w-4 h-4 text-amber-600" />;
      case 'footer':
        return <Calendar className="w-4 h-4 text-purple-600" />;
      default:
        return <FileText className="w-4 h-4 text-slate-600" />;
    }
  };

  const assignmentTypeChips = [
    'Assignment',
    'Term Paper',
    'Lab Report',
    'Capstone Thesis',
    'Case Study',
    'Project Proposal',
    'Final Report',
    'Dissertation',
  ];

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* 3 Main Tabs Navigation with integrated Reset action */}
      <div className="p-3 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between gap-2">
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-200/60 rounded-xl flex-1">
          <button
            id="tab-details"
            type="button"
            onClick={() => setActiveTab('details')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 text-xs font-bold rounded-lg transition-all text-center cursor-pointer ${
              activeTab === 'details'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            <FileText className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Details</span>
          </button>

          <button
            id="tab-design"
            type="button"
            onClick={() => setActiveTab('design')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 text-xs font-bold rounded-lg transition-all text-center cursor-pointer ${
              activeTab === 'design'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            <Palette className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Design</span>
          </button>

          <button
            id="tab-rearrange"
            type="button"
            onClick={() => setActiveTab('rearrange')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 text-xs font-bold rounded-lg transition-all text-center cursor-pointer ${
              activeTab === 'rearrange'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            <ArrowUpDown className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Rearrange</span>
          </button>
        </div>

        <button
          id="btn-reset-data"
          onClick={onReset}
          className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-rose-600 transition-colors cursor-pointer px-2 py-1.5 rounded-lg hover:bg-rose-50"
          title="Reset to default example"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">Reset</span>
        </button>
      </div>

      {/* Tab Panels Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
        {/* ================= TAB 1: DETAILS (UNIVERSITY, ASSIGNMENT, STUDENT, INSTRUCTOR) ================= */}
        {activeTab === 'details' && (
          <div className="space-y-8">
            {/* Section 1: University & Faculty */}
            <div className="space-y-5">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                  <School className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">University & Faculty Details</h3>
                  <p className="text-xs text-slate-500">Official institution name, faculty, department, and seal logo.</p>
                </div>
              </div>

              <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  University / College / Institute Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-university-name"
                  type="text"
                  value={data.universityName}
                  onChange={(e) => handleFieldChange('universityName', e.target.value)}
                  placeholder="e.g. STANFORD UNIVERSITY"
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Faculty / School Name
                  </label>
                  <input
                    id="input-faculty-name"
                    type="text"
                    value={data.facultyName}
                    onChange={(e) => handleFieldChange('facultyName', e.target.value)}
                    placeholder="e.g. Faculty of Engineering"
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department / Division
                  </label>
                  <input
                    id="input-department-name"
                    type="text"
                    value={data.departmentName}
                    onChange={(e) => handleFieldChange('departmentName', e.target.value)}
                    placeholder="e.g. Dept. of Computer Science"
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Campus / City / Location <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  id="input-campus-name"
                  type="text"
                  value={data.campus}
                  onChange={(e) => handleFieldChange('campus', e.target.value)}
                  placeholder="e.g. Main Campus, Building 4"
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* University Logo Upload Section */}
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                    University Crest / Logo
                  </h4>
                  <p className="text-xs text-slate-500">Official Jagannath University crest (JnUlogo.png) or custom upload</p>
                </div>
                <div className="flex items-center gap-2">
                  {data.logoUrl !== '/JnUlogo.png' && (
                    <button
                      id="btn-default-jnu-logo"
                      type="button"
                      onClick={() => handleFieldChange('logoUrl', '/JnUlogo.png')}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 cursor-pointer bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded border border-indigo-100 transition-colors"
                      title="Set to default JnUlogo.png"
                    >
                      <RotateCcw className="w-3 h-3" /> Default JnU Logo
                    </button>
                  )}
                  {data.logoUrl && (
                    <button
                      id="btn-remove-logo"
                      type="button"
                      onClick={() => handleFieldChange('logoUrl', null)}
                      className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Upload Dropzone */}
              <div
                id="logo-dropzone"
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                  isDragOver
                    ? 'border-indigo-500 bg-indigo-50/60'
                    : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/60'
                }`}
              >
                <input
                  ref={fileInputRef}
                  id="logo-file-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />

                {data.logoUrl ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-24 h-24 p-2 bg-white rounded-lg shadow-xs border border-slate-200 flex items-center justify-center">
                      <img
                        src={data.logoUrl}
                        alt="Current logo"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <span className="text-xs font-semibold text-indigo-600">
                      Click or drag to replace logo
                    </span>
                    <span className="text-[11px] text-slate-400">
                      PNG, JPG, SVG or WebP accepted
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-semibold text-slate-800">
                      Click to upload university logo or drag & drop here
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Recommended: Transparent PNG or crisp vector SVG
                    </div>
                  </div>
                )}
              </div>

              {/* Logo Controls: Width Slider & Alignment */}
              {data.logoUrl && (
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5" /> Logo Display Size:
                    </span>
                    <span className="font-mono text-slate-600">{data.logoWidth}px</span>
                  </div>
                  <input
                    id="slider-logo-width"
                    type="range"
                    min="60"
                    max="180"
                    step="5"
                    value={data.logoWidth}
                    onChange={(e) => handleFieldChange('logoWidth', Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-semibold text-slate-700">Logo Alignment:</span>
                    <div className="flex items-center border border-slate-300 rounded-lg p-0.5 bg-white">
                      <button
                        id="btn-align-left"
                        onClick={() => handleFieldChange('logoPosition', 'left')}
                        className={`p-1.5 rounded text-xs cursor-pointer ${
                          data.logoPosition === 'left' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                        title="Align Left"
                      >
                        <AlignLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        id="btn-align-center"
                        onClick={() => handleFieldChange('logoPosition', 'center')}
                        className={`p-1.5 rounded text-xs cursor-pointer ${
                          data.logoPosition === 'center' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                        title="Align Center"
                      >
                        <AlignCenter className="w-3.5 h-3.5" />
                      </button>
                      <button
                        id="btn-align-right"
                        onClick={() => handleFieldChange('logoPosition', 'right')}
                        className={`p-1.5 rounded text-xs cursor-pointer ${
                          data.logoPosition === 'right' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                        title="Align Right"
                      >
                        <AlignRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Assignment & Course */}
          <div className="space-y-5 pt-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Assignment & Course Details</h3>
                <p className="text-xs text-slate-500">Provide the title, course code, and assignment classification.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assignment / Project Title <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="input-assignment-title"
                  rows={3}
                  value={data.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  placeholder="e.g. Comparative Analysis of Transformer Architectures..."
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-900 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subtitle or Topic Description <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  id="input-assignment-subtitle"
                  type="text"
                  value={data.subtitle}
                  onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                  placeholder="e.g. An Empirical Evaluation on Memory Overhead & Precision"
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Course Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="input-course-code"
                    type="text"
                    value={data.courseCode}
                    onChange={(e) => handleFieldChange('courseCode', e.target.value)}
                    placeholder="e.g. CS-448B"
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Course / Subject Name
                  </label>
                  <input
                    id="input-course-name"
                    type="text"
                    value={data.courseName}
                    onChange={(e) => handleFieldChange('courseName', e.target.value)}
                    placeholder="e.g. Advanced Artificial Intelligence"
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Assignment Type Quick Chips */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Assignment Document Type
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {assignmentTypeChips.map((chip) => (
                    <button
                      key={chip}
                      id={`chip-type-${chip.toLowerCase().replace(/\s+/g, '-')}`}
                      type="button"
                      onClick={() => handleFieldChange('assignmentType', chip)}
                      className={`text-xs px-2.5 py-1 rounded-md border font-medium cursor-pointer transition-colors ${
                        data.assignmentType === chip
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
                <input
                  id="input-assignment-type"
                  type="text"
                  value={data.assignmentType}
                  onChange={(e) => handleFieldChange('assignmentType', e.target.value)}
                  placeholder="Or type custom type e.g. Final Capstone Project"
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-1"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Student & Team */}
          <div className="space-y-5 pt-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Student & Author Details</h3>
                  <p className="text-xs text-slate-500">
                    Individual student information and co-author/group partner support.
                  </p>
                </div>
              </div>
              {data.additionalStudents?.length > 0 && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {1 + data.additionalStudents.length} Students
                </span>
              )}
            </div>

            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Primary Student
                </span>
                <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  Lead Author
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="input-student-name"
                    type="text"
                    value={data.studentName}
                    onChange={(e) => handleFieldChange('studentName', e.target.value)}
                    placeholder="e.g. Alexander Vance"
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student ID / Roll / Reg No <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="input-student-id"
                    type="text"
                    value={data.studentId}
                    onChange={(e) => handleFieldChange('studentId', e.target.value)}
                    placeholder="e.g. ST-2023-88941"
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Degree / Program
                  </label>
                  <input
                    id="input-student-program"
                    type="text"
                    value={data.program}
                    onChange={(e) => handleFieldChange('program', e.target.value)}
                    placeholder="e.g. B.Sc. in Computer Science"
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Batch / Section / Semester
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        if (data.batch) {
                          handleFieldChange('batch', toUnicodeSuperscript(data.batch));
                        } else {
                          handleFieldChange('batch', '18ᵗʰ Section: B');
                        }
                      }}
                      title="Convert ordinals to MS Word superscript (e.g. 18th → 18ᵗʰ)"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded transition-colors cursor-pointer"
                    >
                      <Superscript className="w-3 h-3" />
                      <span>Word x² Suffix</span>
                    </button>
                  </div>
                  <input
                    id="input-student-batch"
                    type="text"
                    value={data.batch}
                    onChange={(e) => handleFieldChange('batch', e.target.value)}
                    placeholder="e.g. 18ᵗʰ Section: B or 18th"
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    <span className="text-[10px] text-slate-400 font-medium">Quick Word ordinals:</span>
                    {['18ᵗʰ Section: B', '18ᵗʰ', '1ˢᵗ', '2ⁿᵈ', '3ʳᵈ', '4ᵗʰ'].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handleFieldChange('batch', preset)}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 font-medium border border-slate-200 transition-colors cursor-pointer"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Group Members (Co-Authors) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Group Partners & Co-Authors
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Add partners for group submissions and joint capstones
                  </p>
                </div>
                <button
                  id="btn-add-partner"
                  type="button"
                  onClick={addGroupMember}
                  className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Partner
                </button>
              </div>

              {data.additionalStudents && data.additionalStudents.length > 0 ? (
                <div className="space-y-2.5">
                  {data.additionalStudents.map((partner, index) => (
                    <div
                      key={partner.id}
                      className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3"
                    >
                      <span className="text-xs font-bold text-slate-400">#{index + 2}</span>
                      <div className="grid grid-cols-2 gap-2 flex-1">
                        <input
                          type="text"
                          value={partner.name}
                          onChange={(e) => updateGroupMember(partner.id, 'name', e.target.value)}
                          placeholder="Partner Full Name"
                          className="text-xs px-2.5 py-1.5 bg-white rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                        />
                        <input
                          type="text"
                          value={partner.studentId}
                          onChange={(e) => updateGroupMember(partner.id, 'studentId', e.target.value)}
                          placeholder="Student ID / Roll"
                          className="text-xs px-2.5 py-1.5 bg-white rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeGroupMember(partner.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                        title="Remove member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  No group members added yet. Click &quot;Add Partner&quot; if this is a group project.
                </p>
              )}
            </div>
          </div>

          {/* Section 4: Instructor & Submission */}
          <div className="space-y-5 pt-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Instructor & Submission Details</h3>
                <p className="text-xs text-slate-500">Specify the professor, date, and academic term.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Submitted To: Instructor / Professor Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-instructor-name"
                  type="text"
                  value={data.instructorName}
                  onChange={(e) => handleFieldChange('instructorName', e.target.value)}
                  placeholder="e.g. Dr. Evelyn Montgomery, Ph.D."
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Designation / Academic Title
                  </label>
                  <input
                    id="input-instructor-title"
                    type="text"
                    value={data.instructorTitle}
                    onChange={(e) => handleFieldChange('instructorTitle', e.target.value)}
                    placeholder="e.g. Associate Professor"
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Instructor Department / School
                  </label>
                  <input
                    id="input-instructor-dept"
                    type="text"
                    value={data.instructorDept}
                    onChange={(e) => handleFieldChange('instructorDept', e.target.value)}
                    placeholder="e.g. School of Computing"
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Submission Date
                    </label>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          const now = new Date();
                          const day = now.getDate();
                          const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                          const suffix = (day === 1 || day === 21 || day === 31) ? 'ˢᵗ' : (day === 2 || day === 22) ? 'ⁿᵈ' : (day === 3 || day === 23) ? 'ʳᵈ' : 'ᵗʰ';
                          handleFieldChange('submissionDate', `${day}${suffix} ${months[now.getMonth()]}, ${now.getFullYear()}`);
                        }}
                        title="Set date with MS Word superscript ordinal (e.g. 7ᵗʰ April, 2026)"
                        className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5 cursor-pointer bg-indigo-50 px-1.5 py-0.5 rounded"
                      >
                        <Superscript className="w-2.5 h-2.5" /> Word Date
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFieldChange('submissionDate', '07/04/2026')}
                        className="text-[10px] font-semibold text-slate-500 hover:text-slate-700 cursor-pointer bg-slate-100 px-1.5 py-0.5 rounded"
                      >
                        07/04/2026
                      </button>
                    </div>
                  </div>
                  <input
                    id="input-submission-date"
                    type="text"
                    value={data.submissionDate}
                    onChange={(e) => handleFieldChange('submissionDate', e.target.value)}
                    placeholder="e.g. 07/04/2026 or 7th April, 2026"
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Academic Session / Year
                  </label>
                  <input
                    id="input-academic-year"
                    type="text"
                    value={data.academicYear}
                    onChange={(e) => handleFieldChange('academicYear', e.target.value)}
                    placeholder="e.g. 2025 – 2026"
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

        {/* ================= TAB 3: REARRANGE (SECTION ORDER, SPACING & LAYOUT) ================= */}
        {activeTab === 'rearrange' && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-bold text-slate-900">Project Layout & Section Rearrange</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                  <span>Golden Ratio</span>
                  <span className="font-serif italic font-black">φ</span>
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Rearrange sections on your cover page (move up/down or toggle visibility), customize line spacing with harmonic Golden Ratio (<span className="font-serif italic font-bold">φ = 1.618</span>), and adjust font size scales.
              </p>
            </div>

            {/* 1. Quick Section Order Presets */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                1. Structural Layout Presets
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SECTION_ORDER_PRESETS.map((preset) => {
                  const isCurrent =
                    JSON.stringify(currentSectionOrder) === JSON.stringify(preset.order);
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applySectionOrderPreset(preset.order)}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        isCurrent
                          ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-600'
                          : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900">{preset.name}</span>
                        {isCurrent && (
                          <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-100 px-1.5 py-0.2 rounded">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight">
                        {preset.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Reorderable Section List */}
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                    2. Section Order Hierarchy
                  </label>
                  <p className="text-xs text-slate-500">
                    Move sections up or down to change their position from top to bottom.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleStyleChange('sectionOrder', DEFAULT_SECTION_ORDER)}
                  className="text-xs text-slate-500 hover:text-indigo-600 font-medium cursor-pointer"
                  title="Reset to default academic order"
                >
                  Reset Order
                </button>
              </div>

              <div className="space-y-2">
                {currentSectionOrder.map((sectionId, index) => {
                  const meta = SECTION_METADATA[sectionId];
                  const isHidden = (styleConfig.hiddenSections || []).includes(sectionId);
                  const isFirst = index === 0;
                  const isLast = index === currentSectionOrder.length - 1;

                  return (
                    <div
                      key={sectionId}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        isHidden
                          ? 'bg-slate-50 border-dashed border-slate-300 opacity-60'
                          : 'bg-white border-slate-200 shadow-2xs hover:border-indigo-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">
                          #{index + 1}
                        </span>
                        <div className="flex-shrink-0">
                          {getSectionIcon(sectionId)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold truncate ${isHidden ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                              {meta?.name || sectionId}
                            </span>
                            {isHidden && (
                              <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                                Hidden
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">
                            {meta?.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                        {/* Move Up */}
                        <button
                          type="button"
                          onClick={() => moveSection(index, 'up')}
                          disabled={isFirst}
                          className={`p-1.5 rounded hover:bg-slate-100 cursor-pointer ${
                            isFirst ? 'opacity-25 cursor-not-allowed' : 'text-slate-600 hover:text-slate-900'
                          }`}
                          title="Move section up"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>

                        {/* Move Down */}
                        <button
                          type="button"
                          onClick={() => moveSection(index, 'down')}
                          disabled={isLast}
                          className={`p-1.5 rounded hover:bg-slate-100 cursor-pointer ${
                            isLast ? 'opacity-25 cursor-not-allowed' : 'text-slate-600 hover:text-slate-900'
                          }`}
                          title="Move section down"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>

                        {/* Toggle Visibility */}
                        <button
                          type="button"
                          onClick={() => toggleSectionVisibility(sectionId)}
                          className={`p-1.5 rounded hover:bg-slate-100 cursor-pointer ${
                            isHidden ? 'text-rose-500 hover:text-rose-700' : 'text-slate-500 hover:text-indigo-600'
                          }`}
                          title={isHidden ? 'Show this section' : 'Hide this section'}
                        >
                          {isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Submission & Sign-off Alignment Layout */}
            <div className="space-y-2.5 pt-3 border-t border-slate-200">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                3. Submission Parties Layout (Student & Instructor)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'side-by-side', label: 'Side by Side', desc: 'Instructor (L) & Student (R)' },
                  { id: 'swapped', label: 'Swapped Columns', desc: 'Student (L) & Instructor (R)' },
                  { id: 'stacked', label: 'Stacked Rows', desc: 'Instructor Top, Student Below' },
                  { id: 'stacked-student-first', label: 'Student First Stack', desc: 'Student Top, Instructor Below' },
                ].map((layout) => (
                  <button
                    key={layout.id}
                    type="button"
                    onClick={() => handleStyleChange('submissionLayout', layout.id as SubmissionLayout)}
                    className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                      (styleConfig.submissionLayout ?? 'side-by-side') === layout.id
                        ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-600'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-800">{layout.label}</div>
                    <div className="text-[10px] text-slate-500">{layout.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Space Between Lines (Line Spacing / Leading) */}
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
                    4. Space Between Lines (Line Spacing)
                  </label>
                  <p className="text-xs text-slate-500">
                    Choose MS Word "No Spacing" academic standard (1.15×, 0 pt paragraph gap) or Golden Ratio (<span className="font-serif italic font-bold">φ = 1.618</span>).
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  {styleConfig.lineSpacingMode === 'word-no-space'
                    ? '1.15× (MS Word No Spacing)'
                    : styleConfig.lineSpacingMode === 'golden'
                    ? '1.618× (Golden Ratio φ)'
                    : `${(styleConfig.lineSpacingValue ?? 1.15).toFixed(2)}×`}
                </span>
              </div>

              {/* Spacing Quick Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* MS Word "No Spacing" Default Button */}
                <button
                  type="button"
                  onClick={applyWordNoSpacing}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                    styleConfig.lineSpacingMode === 'word-no-space'
                      ? 'border-blue-600 bg-gradient-to-r from-blue-50/90 to-indigo-50/70 ring-1 ring-blue-600 shadow-xs'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-blue-50/40 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-blue-700 text-white font-sans font-black text-xs flex items-center justify-center flex-shrink-0 shadow-2xs">
                      W
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-blue-950">
                          MS Word "No Spacing"
                        </span>
                        <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-blue-200/80 text-blue-900">
                          Default (1.15×)
                        </span>
                      </div>
                      <p className="text-[11px] text-blue-800/80 leading-tight mt-0.5">
                        0 pt space before/after, tight academic single-line rhythm.
                      </p>
                    </div>
                  </div>
                  {styleConfig.lineSpacingMode === 'word-no-space' && (
                    <span className="text-xs font-bold text-blue-700 flex items-center gap-1 flex-shrink-0">
                      <Check className="w-4 h-4" />
                    </span>
                  )}
                </button>

                {/* Golden Ratio Highlight Button */}
                <button
                  type="button"
                  onClick={applyGoldenRatioLineSpacing}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                    styleConfig.lineSpacingMode === 'golden'
                      ? 'border-amber-500 bg-gradient-to-r from-amber-50/80 to-yellow-50/60 ring-1 ring-amber-500 shadow-xs'
                      : 'border-slate-200 bg-amber-50/30 hover:bg-amber-50/60 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-amber-500 text-white font-serif italic font-black text-sm flex items-center justify-center flex-shrink-0 shadow-2xs">
                      φ
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-amber-950">
                          Golden Ratio Spacing
                        </span>
                        <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-amber-200/80 text-amber-900">
                          1.618×
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-800/80 leading-tight mt-0.5">
                        Harmonic divine proportion vertical rhythm.
                      </p>
                    </div>
                  </div>
                  {styleConfig.lineSpacingMode === 'golden' && (
                    <span className="text-xs font-bold text-amber-700 flex items-center gap-1 flex-shrink-0">
                      <Check className="w-4 h-4" />
                    </span>
                  )}
                </button>
              </div>

              {/* Presets Grid */}
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { mode: 'word-no-space' as const, label: 'Word (0pt)', val: '1.15×' },
                  { mode: 'compact' as const, label: 'Compact', val: '1.25×' },
                  { mode: 'balanced' as const, label: 'Balanced', val: '1.45×' },
                  { mode: 'relaxed' as const, label: 'Relaxed', val: '1.80×' },
                  { mode: 'custom' as const, label: 'Custom', val: 'Slider' },
                ].map((item) => (
                  <button
                    key={item.mode}
                    type="button"
                    onClick={() => setLineSpacingMode(item.mode)}
                    className={`p-2 rounded-lg border text-center cursor-pointer transition-all ${
                      styleConfig.lineSpacingMode === item.mode
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold shadow-2xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="text-[11px] font-semibold truncate">{item.label}</div>
                    <div className="text-[10px] text-slate-500">{item.val}</div>
                  </button>
                ))}
              </div>

              {/* Custom Line Spacing Slider */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Custom Line Height:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {(styleConfig.lineSpacingValue ?? 1.15).toFixed(2)}×
                  </span>
                </div>
                <input
                  type="range"
                  min="1.00"
                  max="2.40"
                  step="0.02"
                  value={styleConfig.lineSpacingValue ?? 1.15}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setStyleConfig((prev) => ({
                      ...prev,
                      lineSpacingMode: Math.abs(val - 1.15) < 0.01 ? 'word-no-space' : Math.abs(val - 1.618) < 0.01 ? 'golden' : 'custom',
                      lineSpacingValue: val,
                    }));
                  }}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span className="text-blue-700 font-bold">1.15× (Word No Spacing)</span>
                  <span className="text-amber-700 font-bold">1.618× (Golden Ratio φ)</span>
                  <span>2.40× (Spacious)</span>
                </div>
              </div>

              {/* MS Word Typography & Superscript Fidelity Info */}
              <div className="p-3 rounded-xl border border-blue-200/80 bg-gradient-to-r from-blue-50/60 to-indigo-50/40 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-950">
                  <Superscript className="w-4 h-4 text-blue-600" />
                  <span>MS Word Superscript & Academic Typography</span>
                </div>
                <p className="text-[11px] text-blue-900/80 leading-relaxed">
                  Ordinal suffixes (such as 18<sup className="word-superscript">th</sup>, 1<sup className="word-superscript">st</sup>, 2<sup className="word-superscript">nd</sup>, 3<sup className="word-superscript">rd</sup>, 4<sup className="word-superscript">th</sup>) and dates (7<sup className="word-superscript">th</sup> April) are automatically rendered with authentic MS Word elevated baseline and zero line-height impact, maintaining identical line height and no-spacing paragraph rhythm.
                </p>
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="text-[10px] text-blue-700 font-semibold">Active rendering:</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-white rounded border border-blue-200 text-blue-950 font-serif">
                    18<sup className="word-superscript">th</sup> Section: B
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-white rounded border border-blue-200 text-blue-950 font-serif">
                    1<sup className="word-superscript">st</sup> Semester
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-white rounded border border-blue-200 text-blue-950 font-serif">
                    7<sup className="word-superscript">th</sup> April
                  </span>
                </div>
              </div>
            </div>

            {/* 5. Font Size Scaling (Golden Ratio & Custom) */}
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-indigo-600" />
                    5. Font Size & Typographic Scale
                  </label>
                  <p className="text-xs text-slate-500">
                    Scale heading and body typography with the Golden Ratio or custom font sizes.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  {styleConfig.fontSizeMode === 'golden'
                    ? 'Golden Proportion (φ)'
                    : `${Math.round((styleConfig.fontScaleMultiplier ?? 1.0) * 100)}%`}
                </span>
              </div>

              {/* Golden Ratio Typography Scale Button */}
              <button
                type="button"
                onClick={applyGoldenRatioFontSize}
                className={`w-full p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                  styleConfig.fontSizeMode === 'golden'
                    ? 'border-amber-500 bg-gradient-to-r from-amber-50/80 to-yellow-50/60 ring-1 ring-amber-500 shadow-xs'
                    : 'border-amber-200 bg-amber-50/30 hover:bg-amber-50/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-amber-500 text-white font-serif italic font-black text-sm flex items-center justify-center flex-shrink-0 shadow-2xs">
                    φ
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-950">
                        Golden Ratio Typography Scale
                      </span>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-amber-200/80 text-amber-900">
                        Harmonic Scale
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-800/80 leading-tight mt-0.5">
                      Scales title, headings, and labels according to classical mathematical powers of 1.618.
                    </p>
                  </div>
                </div>
                {styleConfig.fontSizeMode === 'golden' && (
                  <span className="text-xs font-bold text-amber-700 flex items-center gap-1 flex-shrink-0">
                    <Check className="w-4 h-4" /> Active
                  </span>
                )}
              </button>

              {/* Presets Grid */}
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { mode: 'compact' as const, label: 'Compact', val: '90%' },
                  { mode: 'standard' as const, label: 'Standard', val: '100%' },
                  { mode: 'large' as const, label: 'Large', val: '115%' },
                  { mode: 'custom' as const, label: 'Custom', val: 'Slider' },
                ].map((item) => (
                  <button
                    key={item.mode}
                    type="button"
                    onClick={() => setFontSizeMode(item.mode)}
                    className={`p-2 rounded-lg border text-center cursor-pointer transition-all ${
                      styleConfig.fontSizeMode === item.mode
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold shadow-2xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-semibold">{item.label}</div>
                    <div className="text-[10px] text-slate-500">{item.val}</div>
                  </button>
                ))}
              </div>

              {/* Custom Font Scale Slider */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Custom Typography Scale:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {Math.round((styleConfig.fontScaleMultiplier ?? 1.0) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.40"
                  step="0.01"
                  value={styleConfig.fontScaleMultiplier ?? 1.0}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setStyleConfig((prev) => ({
                      ...prev,
                      fontSizeMode: 'custom',
                      fontScaleMultiplier: val,
                    }));
                  }}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>75% (Small)</span>
                  <span>100% (Standard)</span>
                  <span>140% (Oversized)</span>
                </div>
              </div>
            </div>

            {/* 6. Space Between Sections (Vertical Margins) */}
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                    6. Vertical Gap Between Sections
                  </label>
                  <p className="text-xs text-slate-500">
                    Fine-tune how much vertical distance separates the 5 main sections.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  {(styleConfig.sectionSpacingMultiplier ?? 1.0).toFixed(2)}×
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { mult: 0.75, label: 'Tight', sub: '0.75×' },
                  { mult: 1.0, label: 'Standard', sub: '1.00×' },
                  { mult: 1.35, label: 'Spacious', sub: '1.35×' },
                  { mult: 1.618, label: 'Golden φ', sub: '1.618×' },
                ].map((gap) => (
                  <button
                    key={gap.mult}
                    type="button"
                    onClick={() => handleStyleChange('sectionSpacingMultiplier', gap.mult)}
                    className={`p-2 rounded-lg border text-center cursor-pointer transition-all ${
                      Math.abs((styleConfig.sectionSpacingMultiplier ?? 1.0) - gap.mult) < 0.05
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold shadow-2xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-semibold">{gap.label}</div>
                    <div className="text-[10px] text-slate-500">{gap.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: DESIGN (FONTS, THEMES, BORDERS & STYLING) ================= */}
        {activeTab === 'design' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Typography & Visual Styling</h3>
              <p className="text-xs text-slate-500">
                Choose design themes, borders, typography, and accent colors for your assignment.
              </p>
            </div>

            {/* 1. Design & Graphic Style Presets (Analyzed from Reference Cover Art) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  1. Design & Graphic Style Presets
                </label>
                <span className="text-[11px] text-slate-400 font-medium">{STYLE_PRESETS.length} Curated Presets</span>
              </div>
              <p className="text-xs text-slate-500">
                Click any preset to instantly apply matching cover graphics, font family, colors, and layout:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {STYLE_PRESETS.map((preset) => {
                  const isSelected =
                    (styleConfig.graphicOverlay ?? 'none') === preset.graphicOverlay &&
                    styleConfig.accentColor.toLowerCase() === preset.accentColor.toLowerCase();

                  return (
                    <button
                      key={preset.id}
                      id={preset.id}
                      type="button"
                      onClick={() => {
                        handleStyleChange('template', preset.template);
                        handleStyleChange('fontFamily', preset.fontFamily);
                        handleStyleChange('accentColor', preset.accentColor);
                        handleStyleChange('graphicOverlay', preset.graphicOverlay);
                        handleStyleChange('borderStyle', preset.borderStyle);
                      }}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between relative ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3.5 h-3.5 rounded-full flex-shrink-0 border border-white shadow-2xs"
                              style={{ backgroundColor: preset.previewColor }}
                            />
                            {preset.previewSecondary && (
                              <span
                                className="w-3 h-3 -ml-1 rounded-full flex-shrink-0 border border-white shadow-2xs"
                                style={{ backgroundColor: preset.previewSecondary }}
                              />
                            )}
                            <span className="text-xs font-bold text-slate-900">{preset.name}</span>
                          </div>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                            {preset.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {preset.subtitle}
                        </p>
                      </div>

                      {isSelected && (
                        <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-indigo-600">
                          <Check className="w-3.5 h-3.5" /> Active Preset
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Cover Page Border & Border Style Options */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                    2. Cover Page Border & Framing
                  </label>
                  <p className="text-xs text-slate-500">
                    Select border layout, line weight, inset margin, and custom frame colors.
                  </p>
                </div>
                {styleConfig.borderStyle !== 'none' && (
                  <button
                    type="button"
                    onClick={() => handleStyleChange('borderStyle', 'none')}
                    className="text-[11px] text-rose-500 hover:text-rose-700 font-semibold cursor-pointer"
                  >
                    Disable Border
                  </button>
                )}
              </div>

              {/* Border Style Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                {BORDER_STYLE_OPTIONS.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => handleStyleChange('borderStyle', b.id)}
                    className={`py-2 px-2.5 rounded-lg border font-medium text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1 ${
                      styleConfig.borderStyle === b.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold ring-1 ring-indigo-500 shadow-2xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700 bg-white'
                    }`}
                  >
                    <span className="text-xs">{b.label}</span>
                  </button>
                ))}
              </div>

              {/* Detailed Border Customization (when border is active) */}
              {styleConfig.borderStyle !== 'none' && (
                <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200 space-y-3">
                  {/* Border Width / Thickness */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Border Thickness
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { val: 1, label: 'Fine (1px)' },
                        { val: 2, label: 'Standard (2px)' },
                        { val: 3.5, label: 'Medium (3.5px)' },
                        { val: 5, label: 'Bold (5px)' },
                      ].map((thick) => (
                        <button
                          key={thick.val}
                          type="button"
                          onClick={() => handleStyleChange('borderWidth', thick.val)}
                          className={`py-1.5 px-2 text-xs font-semibold rounded cursor-pointer transition-all ${
                            (styleConfig.borderWidth ?? 2) === thick.val
                              ? 'bg-indigo-600 text-white shadow-2xs'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {thick.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Border Inset / Margins */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Border Inset Margin
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { val: 12, label: 'Tight (12px)' },
                        { val: 20, label: 'Standard (20px)' },
                        { val: 32, label: 'Spacious (32px)' },
                      ].map((inset) => (
                        <button
                          key={inset.val}
                          type="button"
                          onClick={() => handleStyleChange('borderInset', inset.val)}
                          className={`py-1.5 px-2 text-xs font-semibold rounded cursor-pointer transition-all ${
                            (styleConfig.borderInset ?? 20) === inset.val
                              ? 'bg-indigo-600 text-white shadow-2xs'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {inset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Border Color */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-semibold text-slate-700">Border Color:</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleStyleChange('borderColor', undefined)}
                        className={`text-xs px-2.5 py-1 rounded cursor-pointer font-medium ${
                          !styleConfig.borderColor
                            ? 'bg-indigo-100 text-indigo-700 font-bold'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Match Accent Color
                      </button>
                      <input
                        type="color"
                        value={styleConfig.borderColor || styleConfig.accentColor}
                        onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                        title="Custom border color"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Font Family Selector */}
            <div className="space-y-2.5 pt-4 border-t border-slate-200">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                3. Font Family Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {FONT_OPTIONS.map((font) => (
                  <button
                    key={font.id}
                    id={`font-opt-${font.id}`}
                    type="button"
                    onClick={() => handleStyleChange('fontFamily', font.id)}
                    className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                      styleConfig.fontFamily === font.id
                        ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div
                      className="text-sm font-bold text-slate-900 mb-0.5 truncate"
                      style={{ fontFamily: font.fontFamilyClass }}
                    >
                      {font.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-sans">{font.category}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Line Spacing & Font Size (Golden Ratio φ & Custom) */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
                    4. Line Spacing & Font Size (Golden Ratio φ)
                  </label>
                  <p className="text-xs text-slate-500">
                    Apply divine proportion vertical leading (1.618×) and harmonic typography scaling.
                  </p>
                </div>
              </div>

              {/* Space Between Lines Controls */}
              <div className="space-y-2 p-3 bg-slate-50/80 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Space Between Lines (Leading):</span>
                  <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    {styleConfig.lineSpacingMode === 'golden'
                      ? '1.618× (Golden Ratio φ)'
                      : `${(styleConfig.lineSpacingValue ?? 1.618).toFixed(2)}×`}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={applyGoldenRatioLineSpacing}
                    className={`p-2 rounded-lg border text-left cursor-pointer transition-all flex items-center gap-2 ${
                      styleConfig.lineSpacingMode === 'golden'
                        ? 'border-amber-500 bg-amber-50/80 text-amber-950 font-bold ring-1 ring-amber-400'
                        : 'border-amber-200 bg-white text-slate-700 hover:bg-amber-50/40'
                    }`}
                  >
                    <span className="w-5 h-5 rounded bg-amber-500 text-white font-serif italic font-bold text-xs flex items-center justify-center flex-shrink-0">
                      φ
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">Golden Ratio</div>
                      <div className="text-[10px] text-amber-700 font-mono">1.618×</div>
                    </div>
                  </button>

                  {[
                    { mode: 'compact' as const, label: 'Compact', val: '1.25×' },
                    { mode: 'balanced' as const, label: 'Balanced', val: '1.45×' },
                    { mode: 'relaxed' as const, label: 'Relaxed', val: '1.80×' },
                  ].map((item) => (
                    <button
                      key={item.mode}
                      type="button"
                      onClick={() => setLineSpacingMode(item.mode)}
                      className={`p-2 rounded-lg border text-center cursor-pointer transition-all ${
                        styleConfig.lineSpacingMode === item.mode
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold shadow-2xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="text-xs font-semibold">{item.label}</div>
                      <div className="text-[10px] text-slate-500">{item.val}</div>
                    </button>
                  ))}
                </div>

                {/* Custom Line Spacing Slider */}
                <div className="pt-2">
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>Custom Line Spacing:</span>
                    <span className="font-mono font-bold text-slate-800">
                      {(styleConfig.lineSpacingValue ?? 1.618).toFixed(2)}×
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1.10"
                    max="2.40"
                    step="0.02"
                    value={styleConfig.lineSpacingValue ?? 1.618}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setStyleConfig((prev) => ({
                        ...prev,
                        lineSpacingMode: Math.abs(val - 1.618) < 0.01 ? 'golden' : 'custom',
                        lineSpacingValue: val,
                      }));
                    }}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Font Size Scaling Controls */}
              <div className="space-y-2 p-3 bg-slate-50/80 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Font Size Hierarchy & Scale:</span>
                  <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    {styleConfig.fontSizeMode === 'golden'
                      ? 'Golden Proportion (φ)'
                      : `${Math.round((styleConfig.fontScaleMultiplier ?? 1.0) * 100)}%`}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={applyGoldenRatioFontSize}
                    className={`p-2 rounded-lg border text-left cursor-pointer transition-all flex items-center gap-2 ${
                      styleConfig.fontSizeMode === 'golden'
                        ? 'border-amber-500 bg-amber-50/80 text-amber-950 font-bold ring-1 ring-amber-400'
                        : 'border-amber-200 bg-white text-slate-700 hover:bg-amber-50/40'
                    }`}
                  >
                    <span className="w-5 h-5 rounded bg-amber-500 text-white font-serif italic font-bold text-xs flex items-center justify-center flex-shrink-0">
                      φ
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">Golden Scale</div>
                      <div className="text-[10px] text-amber-700 font-mono">1.618ⁿ</div>
                    </div>
                  </button>

                  {[
                    { mode: 'compact' as const, label: 'Compact', val: '90%' },
                    { mode: 'standard' as const, label: 'Standard', val: '100%' },
                    { mode: 'large' as const, label: 'Large', val: '115%' },
                  ].map((item) => (
                    <button
                      key={item.mode}
                      type="button"
                      onClick={() => setFontSizeMode(item.mode)}
                      className={`p-2 rounded-lg border text-center cursor-pointer transition-all ${
                        styleConfig.fontSizeMode === item.mode
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold shadow-2xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="text-xs font-semibold">{item.label}</div>
                      <div className="text-[10px] text-slate-500">{item.val}</div>
                    </button>
                  ))}
                </div>

                {/* Custom Font Size Slider */}
                <div className="pt-2">
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>Custom Font Scale:</span>
                    <span className="font-mono font-bold text-slate-800">
                      {Math.round((styleConfig.fontScaleMultiplier ?? 1.0) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.75"
                    max="1.40"
                    step="0.01"
                    value={styleConfig.fontScaleMultiplier ?? 1.0}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setStyleConfig((prev) => ({
                        ...prev,
                        fontSizeMode: 'custom',
                        fontScaleMultiplier: val,
                      }));
                    }}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* 5. Accent Color Palette */}
            <div className="space-y-2.5 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  5. Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500 uppercase">{styleConfig.accentColor}</span>
                  <input
                    type="color"
                    value={styleConfig.accentColor}
                    onChange={(e) => handleStyleChange('accentColor', e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                    title="Custom color picker"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color.hex}
                    type="button"
                    onClick={() => handleStyleChange('accentColor', color.hex)}
                    className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${
                      styleConfig.accentColor.toLowerCase() === color.hex.toLowerCase()
                        ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full flex-shrink-0 shadow-2xs"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-xs font-medium text-slate-700 truncate">{color.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 6. Layout Template Structure */}
            <div className="space-y-2.5 pt-4 border-t border-slate-200">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                6. Layout Structure Template
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {TEMPLATE_OPTIONS.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    id={`template-opt-${tmpl.id}`}
                    type="button"
                    onClick={() => handleStyleChange('template', tmpl.id)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between relative ${
                      styleConfig.template === tmpl.id
                        ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900">{tmpl.name}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {tmpl.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {tmpl.description}
                      </p>
                    </div>

                    {styleConfig.template === tmpl.id && (
                      <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-indigo-600">
                        <Check className="w-3.5 h-3.5" /> Selected
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 7. Paper Size & Spacing Controls */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Paper Standard
                </label>
                <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => handleStyleChange('paperSize', 'a4')}
                    className={`py-1.5 text-xs font-bold rounded cursor-pointer ${
                      styleConfig.paperSize === 'a4'
                        ? 'bg-white text-indigo-700 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    A4 (Global)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStyleChange('paperSize', 'letter')}
                    className={`py-1.5 text-xs font-bold rounded cursor-pointer ${
                      styleConfig.paperSize === 'letter'
                        ? 'bg-white text-indigo-700 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    US Letter
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Inner Margin Density
                </label>
                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg">
                  {(['compact', 'balanced', 'spacious'] as const).map((density) => (
                    <button
                      key={density}
                      type="button"
                      onClick={() => handleStyleChange('spacing', density)}
                      className={`py-1.5 text-xs capitalize font-medium rounded cursor-pointer ${
                        styleConfig.spacing === density
                          ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                          : 'text-slate-600'
                      }`}
                    >
                      {density[0].toUpperCase() + density.slice(1, 4)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Watermark Toggle */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-800 cursor-pointer flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={styleConfig.showWatermark}
                    onChange={(e) => handleStyleChange('showWatermark', e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 accent-indigo-600"
                  />
                  Add Background Watermark (e.g. DRAFT)
                </label>
              </div>

              {styleConfig.showWatermark && (
                <input
                  type="text"
                  value={styleConfig.watermarkText}
                  onChange={(e) => handleStyleChange('watermarkText', e.target.value)}
                  placeholder="e.g. DRAFT / CONFIDENTIAL"
                  className="w-full text-xs px-3 py-1.5 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white uppercase font-bold"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
