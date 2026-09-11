import React, { CSSProperties, ReactNode } from 'react';
import { FontId, SpacingDensity, BorderStyle, StyleConfig } from '../../types';
import { FONT_OPTIONS } from '../../presets';

export const GOLDEN_RATIO = 1.61803398875;

const UNICODE_ORDINAL_MAP: Record<string, string> = {
  'ᵗ': 't',
  'ʰ': 'h',
  'ˢ': 's',
  'ⁿ': 'n',
  'ᵈ': 'd',
  'ʳ': 'r',
};

const UNICODE_SUP_DIGITS: Record<string, string> = {
  '⁰': '0',
  '¹': '1',
  '²': '2',
  '³': '3',
  '⁴': '4',
  '⁵': '5',
  '⁶': '6',
  '⁷': '7',
  '⁸': '8',
  '⁹': '9',
  '⁺': '+',
  '⁻': '-',
};

const UNICODE_SUB_DIGITS: Record<string, string> = {
  '₀': '0',
  '₁': '1',
  '₂': '2',
  '₃': '3',
  '₄': '4',
  '₅': '5',
  '₆': '6',
  '₇': '7',
  '₈': '8',
  '₉': '9',
};

/**
 * Converts ordinal indicators in a string into Unicode superscripts (e.g., "18th" -> "18ᵗʰ", "1st" -> "1ˢᵗ").
 */
export function toUnicodeSuperscript(str: string): string {
  return str.replace(/\b(\d+)(st|nd|rd|th)\b/gi, (_, num, suffix) => {
    const s = suffix.toLowerCase();
    if (s === 'th') return `${num}ᵗʰ`;
    if (s === 'st') return `${num}ˢᵗ`;
    if (s === 'nd') return `${num}ⁿᵈ`;
    if (s === 'rd') return `${num}ʳᵈ`;
    return `${num}${suffix}`;
  });
}

/**
 * Parses and renders academic text with Microsoft Word-style superscript ordinals
 * (e.g. 18th, 18ᵗʰ, 1st, 2nd, 3rd, 4th, 7th, caret notation X^2, and <sup> tags).
 * Styled with zero line-height impact so paragraphs preserve MS Word "No Spacing".
 */
export function formatAcademicText(text: string | null | undefined): ReactNode {
  if (!text) return text ?? '';

  const tokenRegex = /(?:(\b\d+)(st|nd|rd|th|ST|ND|RD|TH)(?![a-zA-Z]))|(?:(\d+)([ᵗʰˢⁿᵈʳ]+))|(?:<sup[^>]*>(.*?)<\/sup>)|(?:<sub[^>]*>(.*?)<\/sub>)|(?:\^\(([^)]+)\))|(?:\^([a-zA-Z0-9]+)\^)|(?:([a-zA-Z0-9]+)\^([a-zA-Z0-9]+))|([⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]+)|([₀₁₂₃₄₅₆₇₈₉]+)/g;

  const elements: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.slice(lastIndex, match.index));
    }

    const key = `sup-${match.index}`;

    if (match[1] && match[2]) {
      // 18th, 1st, 2nd, etc.
      elements.push(match[1]);
      elements.push(
        React.createElement(
          'sup',
          { key, className: 'word-superscript' },
          match[2].toLowerCase()
        )
      );
    } else if (match[3] && match[4]) {
      // 18ᵗʰ, 1ˢᵗ, etc.
      elements.push(match[3]);
      const normalized = match[4]
        .split('')
        .map((ch) => UNICODE_ORDINAL_MAP[ch] || ch)
        .join('');
      elements.push(
        React.createElement(
          'sup',
          { key, className: 'word-superscript' },
          normalized
        )
      );
    } else if (match[5] !== undefined) {
      // <sup>...</sup>
      elements.push(
        React.createElement(
          'sup',
          { key, className: 'word-superscript' },
          match[5]
        )
      );
    } else if (match[6] !== undefined) {
      // <sub>...</sub>
      elements.push(
        React.createElement(
          'sub',
          { key, className: 'word-subscript' },
          match[6]
        )
      );
    } else if (match[7] !== undefined) {
      // ^(text)
      elements.push(
        React.createElement(
          'sup',
          { key, className: 'word-superscript' },
          match[7]
        )
      );
    } else if (match[8] !== undefined) {
      // ^text^
      elements.push(
        React.createElement(
          'sup',
          { key, className: 'word-superscript' },
          match[8]
        )
      );
    } else if (match[9] && match[10]) {
      // base^exponent
      elements.push(match[9]);
      elements.push(
        React.createElement(
          'sup',
          { key, className: 'word-superscript' },
          match[10]
        )
      );
    } else if (match[11]) {
      // standalone unicode superscript digits
      const normalDigits = match[11]
        .split('')
        .map((ch) => UNICODE_SUP_DIGITS[ch] || ch)
        .join('');
      elements.push(
        React.createElement(
          'sup',
          { key, className: 'word-superscript' },
          normalDigits
        )
      );
    } else if (match[12]) {
      // standalone unicode subscript digits
      const normalDigits = match[12]
        .split('')
        .map((ch) => UNICODE_SUB_DIGITS[ch] || ch)
        .join('');
      elements.push(
        React.createElement(
          'sub',
          { key, className: 'word-subscript' },
          normalDigits
        )
      );
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  if (elements.length === 0) return '';
  if (elements.length === 1) return elements[0];
  return React.createElement(React.Fragment, null, ...elements);
}

export function getFontFamilyStyle(fontId: FontId): string {
  const found = FONT_OPTIONS.find((f) => f.id === fontId);
  return found ? found.fontFamilyClass : "'Cormorant Garamond', Georgia, serif";
}

export function getSpacingPadding(spacing: SpacingDensity): string {
  switch (spacing) {
    case 'compact':
      return 'p-8 md:p-10';
    case 'spacious':
      return 'p-14 md:p-18';
    case 'balanced':
    default:
      return 'p-10 md:p-14';
  }
}

/**
 * Returns line-height multiplier based on MS Word No Spacing, Golden Ratio, or custom configuration
 */
export function getLineHeightStyle(styleConfig: StyleConfig): number {
  if (styleConfig.lineSpacingMode === 'word-no-space') {
    return 1.15; // MS Word "No Spacing" single line-height
  }
  if (styleConfig.lineSpacingMode === 'golden') {
    return GOLDEN_RATIO; // 1.61803...
  }
  if (styleConfig.lineSpacingMode === 'compact') {
    return 1.25;
  }
  if (styleConfig.lineSpacingMode === 'balanced') {
    return 1.45;
  }
  if (styleConfig.lineSpacingMode === 'relaxed') {
    return 1.80;
  }
  if (styleConfig.lineSpacingMode === 'custom' && typeof styleConfig.lineSpacingValue === 'number') {
    return styleConfig.lineSpacingValue;
  }
  return styleConfig.lineSpacingValue ?? 1.15;
}

/**
 * Returns font-scaling multiplier based on Golden Ratio or custom configuration
 */
export function getFontScaleMultiplier(styleConfig: StyleConfig): number {
  if (styleConfig.fontSizeMode === 'golden') {
    return 1.05;
  }
  if (styleConfig.fontSizeMode === 'compact') {
    return 0.90;
  }
  if (styleConfig.fontSizeMode === 'standard') {
    return 1.00;
  }
  if (styleConfig.fontSizeMode === 'large') {
    return 1.15;
  }
  if (styleConfig.fontSizeMode === 'custom' && typeof styleConfig.fontScaleMultiplier === 'number') {
    return styleConfig.fontScaleMultiplier;
  }
  return styleConfig.fontScaleMultiplier ?? 1.0;
}

/**
 * Golden Ratio typographic sizing calculator
 * Step 0 = Base body (e.g. 15px)
 * Step 1 = Subhead (15 * 1.272 ~= 19px)
 * Step 2 = Section heading (15 * 1.618 ~= 24px)
 * Step 3 = Page Title (15 * 1.618^1.5 ~= 31px)
 * Step 4 = Hero Title (15 * 1.618^2 ~= 39px)
 */
export function getScaledFontSize(basePx: number, styleConfig: StyleConfig, isGoldenHeading?: boolean): string {
  const scale = getFontScaleMultiplier(styleConfig);
  if (styleConfig.fontSizeMode === 'golden' && isGoldenHeading) {
    return `${Math.round(basePx * 1.12 * scale)}px`;
  }
  return `${Math.round(basePx * scale)}px`;
}

export function getBorderClasses(borderStyle: BorderStyle, accentColor: string): {
  containerClass: string;
  innerBorderClass?: string;
  style?: CSSProperties;
} {
  switch (borderStyle) {
    case 'single':
      return {
        containerClass: 'relative border-2',
        style: { borderColor: accentColor },
      };
    case 'double':
      return {
        containerClass: 'relative border-4 p-2',
        innerBorderClass: 'border border-solid h-full w-full flex flex-col justify-between',
        style: { borderColor: accentColor },
      };
    case 'formal-corner':
      return {
        containerClass: 'relative border',
        style: { borderColor: `${accentColor}40` },
      };
    case 'accent-edge':
      return {
        containerClass: 'relative border-l-8',
        style: { borderLeftColor: accentColor },
      };
    case 'none':
    default:
      return {
        containerClass: 'relative',
      };
  }
}
