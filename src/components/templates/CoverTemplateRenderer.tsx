import React from 'react';
import { AssignmentData, StyleConfig } from '../../types';
import { ClassicTemplate } from './ClassicTemplate';
import { CambridgeTemplate } from './CambridgeTemplate';
import { ModernTemplate } from './ModernTemplate';
import { EditorialTemplate } from './EditorialTemplate';
import { TechTemplate } from './TechTemplate';
import { ExecutiveTemplate } from './ExecutiveTemplate';
import { GraphicOverlay } from './GraphicOverlays';

interface CoverTemplateRendererProps {
  data: AssignmentData;
  styleConfig: StyleConfig;
}

export const CoverTemplateRenderer: React.FC<CoverTemplateRendererProps> = ({ data, styleConfig }) => {
  const renderTemplateContent = () => {
    switch (styleConfig.template) {
      case 'cambridge':
        return <CambridgeTemplate data={data} styleConfig={styleConfig} />;
      case 'modern':
        return <ModernTemplate data={data} styleConfig={styleConfig} />;
      case 'editorial':
        return <EditorialTemplate data={data} styleConfig={styleConfig} />;
      case 'tech':
        return <TechTemplate data={data} styleConfig={styleConfig} />;
      case 'executive':
        return <ExecutiveTemplate data={data} styleConfig={styleConfig} />;
      case 'classic':
      default:
        return <ClassicTemplate data={data} styleConfig={styleConfig} />;
    }
  };

  const isCambridge = styleConfig.template === 'cambridge';
  const effectiveBorderColor = styleConfig.borderColor || styleConfig.accentColor;
  const borderWidth = styleConfig.borderWidth ?? 2;
  const borderInset = styleConfig.borderInset ?? 20;

  return (
    <div className="relative h-full w-full bg-white select-none overflow-hidden">
      {/* Graphic Overlay / Preset Background Art */}
      {styleConfig.graphicOverlay && styleConfig.graphicOverlay !== 'none' && (
        <GraphicOverlay
          style={styleConfig.graphicOverlay}
          accentColor={effectiveBorderColor}
          data={data}
        />
      )}

      {/* Watermark Overlay if enabled */}
      {styleConfig.showWatermark && styleConfig.watermarkText && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
          <span className="text-slate-200 text-6xl md:text-7xl font-bold uppercase tracking-widest transform -rotate-45 select-none opacity-40">
            {styleConfig.watermarkText}
          </span>
        </div>
      )}

      {/* Border Options */}
      {!isCambridge && styleConfig.borderStyle === 'single' && (
        <div
          className="absolute pointer-events-none z-20"
          style={{
            top: `${borderInset}px`,
            bottom: `${borderInset}px`,
            left: `${borderInset}px`,
            right: `${borderInset}px`,
            border: `${borderWidth}px solid ${effectiveBorderColor}`,
          }}
        />
      )}

      {!isCambridge && styleConfig.borderStyle === 'double' && (
        <div
          className="absolute pointer-events-none z-20"
          style={{
            top: `${borderInset}px`,
            bottom: `${borderInset}px`,
            left: `${borderInset}px`,
            right: `${borderInset}px`,
            border: `${Math.max(borderWidth, 3)}px double ${effectiveBorderColor}`,
          }}
        />
      )}

      {!isCambridge && styleConfig.borderStyle === 'thick-thin' && (
        <div
          className="absolute pointer-events-none z-20"
          style={{
            top: `${borderInset}px`,
            bottom: `${borderInset}px`,
            left: `${borderInset}px`,
            right: `${borderInset}px`,
            border: `${borderWidth + 2}px solid ${effectiveBorderColor}`,
            padding: '3px',
          }}
        >
          <div
            className="w-full h-full"
            style={{
              border: `1px solid ${effectiveBorderColor}`,
            }}
          />
        </div>
      )}

      {!isCambridge && styleConfig.borderStyle === 'rounded-box' && (
        <div
          className="absolute pointer-events-none z-20 rounded-2xl"
          style={{
            top: `${borderInset}px`,
            bottom: `${borderInset}px`,
            left: `${borderInset}px`,
            right: `${borderInset}px`,
            border: `${borderWidth}px solid ${effectiveBorderColor}`,
          }}
        />
      )}

      {!isCambridge && styleConfig.borderStyle === 'formal-corner' && (
        <div
          className="absolute pointer-events-none z-20"
          style={{
            top: `${borderInset}px`,
            bottom: `${borderInset}px`,
            left: `${borderInset}px`,
            right: `${borderInset}px`,
          }}
        >
          {/* Top-Left */}
          <div
            className="absolute top-0 left-0 w-8 h-8"
            style={{
              borderTop: `${borderWidth + 1}px solid ${effectiveBorderColor}`,
              borderLeft: `${borderWidth + 1}px solid ${effectiveBorderColor}`,
            }}
          >
            <div
              className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: effectiveBorderColor }}
            />
          </div>
          {/* Top-Right */}
          <div
            className="absolute top-0 right-0 w-8 h-8"
            style={{
              borderTop: `${borderWidth + 1}px solid ${effectiveBorderColor}`,
              borderRight: `${borderWidth + 1}px solid ${effectiveBorderColor}`,
            }}
          >
            <div
              className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: effectiveBorderColor }}
            />
          </div>
          {/* Bottom-Left */}
          <div
            className="absolute bottom-0 left-0 w-8 h-8"
            style={{
              borderBottom: `${borderWidth + 1}px solid ${effectiveBorderColor}`,
              borderLeft: `${borderWidth + 1}px solid ${effectiveBorderColor}`,
            }}
          >
            <div
              className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: effectiveBorderColor }}
            />
          </div>
          {/* Bottom-Right */}
          <div
            className="absolute bottom-0 right-0 w-8 h-8"
            style={{
              borderBottom: `${borderWidth + 1}px solid ${effectiveBorderColor}`,
              borderRight: `${borderWidth + 1}px solid ${effectiveBorderColor}`,
            }}
          >
            <div
              className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: effectiveBorderColor }}
            />
          </div>
        </div>
      )}

      {!isCambridge && styleConfig.borderStyle === 'accent-edge' && (
        <div
          className="absolute top-0 left-0 bottom-0 pointer-events-none z-20 flex"
          style={{ width: `${Math.max(borderWidth * 3, 10)}px` }}
        >
          <div
            className="h-full w-full"
            style={{ backgroundColor: effectiveBorderColor }}
          />
          <div
            className="h-full w-1 opacity-40"
            style={{ backgroundColor: effectiveBorderColor }}
          />
        </div>
      )}

      {!isCambridge && styleConfig.borderStyle === 'geometric-frame' && (
        <div
          className="absolute pointer-events-none z-20"
          style={{
            top: `${borderInset}px`,
            bottom: `${borderInset}px`,
            left: `${borderInset}px`,
            right: `${borderInset}px`,
            border: `${borderWidth}px solid ${effectiveBorderColor}`,
          }}
        >
          {/* Corner Notch Cutouts */}
          <div
            className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white"
            style={{ border: `1px solid ${effectiveBorderColor}` }}
          />
          <div
            className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white"
            style={{ border: `1px solid ${effectiveBorderColor}` }}
          />
          <div
            className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white"
            style={{ border: `1px solid ${effectiveBorderColor}` }}
          />
          <div
            className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white"
            style={{ border: `1px solid ${effectiveBorderColor}` }}
          />
        </div>
      )}

      {!isCambridge && styleConfig.borderStyle === 'dashed-architect' && (
        <div
          className="absolute pointer-events-none z-20"
          style={{
            top: `${borderInset}px`,
            bottom: `${borderInset}px`,
            left: `${borderInset}px`,
            right: `${borderInset}px`,
            border: `${borderWidth}px dashed ${effectiveBorderColor}`,
          }}
        >
          {/* Architectural Crosshair Marks */}
          <div
            className="absolute -top-2.5 -left-2.5 text-xs font-mono select-none"
            style={{ color: effectiveBorderColor }}
          >
            +
          </div>
          <div
            className="absolute -top-2.5 -right-2.5 text-xs font-mono select-none"
            style={{ color: effectiveBorderColor }}
          >
            +
          </div>
          <div
            className="absolute -bottom-2.5 -left-2.5 text-xs font-mono select-none"
            style={{ color: effectiveBorderColor }}
          >
            +
          </div>
          <div
            className="absolute -bottom-2.5 -right-2.5 text-xs font-mono select-none"
            style={{ color: effectiveBorderColor }}
          >
            +
          </div>
        </div>
      )}

      {!isCambridge && styleConfig.borderStyle === 'ornate-corners' && (
        <div
          className="absolute pointer-events-none z-20"
          style={{
            top: `${borderInset}px`,
            bottom: `${borderInset}px`,
            left: `${borderInset}px`,
            right: `${borderInset}px`,
            border: `${borderWidth}px solid ${effectiveBorderColor}`,
          }}
        >
          {/* Top-Left Ornate Florette */}
          <svg className="absolute -top-3 -left-3 w-6 h-6" viewBox="0 0 24 24" fill={effectiveBorderColor}>
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 2 C12 6 6 12 2 12 C6 12 12 18 12 22 C12 18 18 12 22 12 C18 12 12 6 12 2 Z" fillOpacity="0.4"/>
          </svg>
          {/* Top-Right Ornate Florette */}
          <svg className="absolute -top-3 -right-3 w-6 h-6" viewBox="0 0 24 24" fill={effectiveBorderColor}>
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 2 C12 6 6 12 2 12 C6 12 12 18 12 22 C12 18 18 12 22 12 C18 12 12 6 12 2 Z" fillOpacity="0.4"/>
          </svg>
          {/* Bottom-Left Ornate Florette */}
          <svg className="absolute -bottom-3 -left-3 w-6 h-6" viewBox="0 0 24 24" fill={effectiveBorderColor}>
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 2 C12 6 6 12 2 12 C6 12 12 18 12 22 C12 18 18 12 22 12 C18 12 12 6 12 2 Z" fillOpacity="0.4"/>
          </svg>
          {/* Bottom-Right Ornate Florette */}
          <svg className="absolute -bottom-3 -right-3 w-6 h-6" viewBox="0 0 24 24" fill={effectiveBorderColor}>
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 2 C12 6 6 12 2 12 C6 12 12 18 12 22 C12 18 18 12 22 12 C18 12 12 6 12 2 Z" fillOpacity="0.4"/>
          </svg>
        </div>
      )}

      {/* Main Content */}
      <div className="h-full w-full relative z-10">
        {renderTemplateContent()}
      </div>
    </div>
  );
};
