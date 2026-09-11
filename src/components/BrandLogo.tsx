import React from 'react';

export const MonogramAIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg
    viewBox="0 0 120 120"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Monogram A Logo"
  >
    <defs>
      {/* Background Squircle Gradient */}
      <linearGradient id="monoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0F172A" />
        <stop offset="50%" stopColor="#1E1B4B" />
        <stop offset="100%" stopColor="#312E81" />
      </linearGradient>

      {/* Border Metallic Ring */}
      <linearGradient id="monoBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#818CF8" stopOpacity="0.9" />
        <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#6366F1" stopOpacity="0.7" />
      </linearGradient>

      {/* White Stem Gradient */}
      <linearGradient id="monoStemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#E2E8F0" />
      </linearGradient>

      {/* Gold Ribbon Gradient */}
      <linearGradient id="monoGoldRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="50%" stopColor="#FDE68A" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>

      {/* Gold Cap Gradient */}
      <linearGradient id="monoGoldCap" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>

      {/* Drop Shadow */}
      <filter id="monoShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#020617" floodOpacity="0.5" />
      </filter>
    </defs>

    {/* Squircle Shield */}
    <rect x="6" y="6" width="108" height="108" rx="28" fill="url(#monoBgGrad)" />
    <rect x="6" y="6" width="108" height="108" rx="28" stroke="url(#monoBorderGrad)" strokeWidth="1.8" />

    {/* The Monogram 'A' */}
    <g filter="url(#monoShadow)">
      {/* Left Leg of A */}
      <path d="M 52 28 L 60 28 L 47 67 L 33 67 Z" fill="url(#monoStemGrad)" />
      <path d="M 47 67 L 33 67 L 23 95 L 39 95 L 48 71 Z" fill="url(#monoStemGrad)" />
      <rect x="20" y="93" width="22" height="3" rx="1.5" fill="url(#monoStemGrad)" />

      {/* Right Leg of A */}
      <path d="M 60 28 L 68 28 L 87 67 L 73 67 Z" fill="url(#monoStemGrad)" />
      <path d="M 73 67 L 87 67 L 97 95 L 81 95 L 72 71 Z" fill="url(#monoStemGrad)" />
      <rect x="78" y="93" width="22" height="3" rx="1.5" fill="url(#monoStemGrad)" />

      {/* Mortarboard Cap Diamond at Apex */}
      <polygon
        points="60,17 77,24 60,31 43,24"
        fill="#1E1B4B"
        stroke="url(#monoGoldCap)"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="60" cy="24" r="2.2" fill="url(#monoGoldCap)" />
      <path
        d="M 60 24 Q 74 25 76 33 L 78 41"
        fill="none"
        stroke="url(#monoGoldCap)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <polygon points="76,41 80,41 78.5,46 77.5,46" fill="url(#monoGoldCap)" />

      {/* Golden Ribbon Crossbar */}
      <g>
        <path d="M 33 65 L 87 65 L 84 75 L 36 75 Z" fill="url(#monoGoldRibbon)" />
        <path d="M 33 65 L 36 75 L 30 73 Z" fill="#92400E" opacity="0.8" />
        <path d="M 87 65 L 84 75 L 90 73 Z" fill="#92400E" opacity="0.8" />
        <line
          x1="42"
          y1="70"
          x2="78"
          y2="70"
          stroke="#78350F"
          strokeWidth="1"
          strokeDasharray="2,2"
          opacity="0.5"
        />
      </g>

      {/* Inner Triangle */}
      <polygon points="60,37 67,58 53,58" fill="#4338CA" opacity="0.7" />
      <line x1="60" y1="37" x2="60" y2="52" stroke="url(#monoGoldCap)" strokeWidth="1.2" opacity="0.8" />
    </g>

    {/* Top Right Star Accent */}
    <g transform="translate(86, 15)">
      <path d="M 6 0 Q 6 6 12 6 Q 6 6 6 12 Q 6 6 0 6 Q 6 6 6 0 Z" fill="url(#monoGoldCap)" />
    </g>
  </svg>
);

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { box: 'w-8 h-8', textTitle: 'text-sm', textSub: 'text-[10px]' },
    md: { box: 'w-9 h-9', textTitle: 'text-base', textSub: 'text-[11px]' },
    lg: { box: 'w-11 h-11', textTitle: 'text-lg', textSub: 'text-xs' },
  };

  const { box, textTitle, textSub } = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Monogram 'A' Icon Mark */}
      <div
        className={`relative ${box} rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group flex-shrink-0 cursor-pointer`}
        title="Assignment Cover Maker (A)"
      >
        <MonogramAIcon className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-200" />
        {/* Subtle Ambient Hover Glow */}
        <div className="absolute inset-0 rounded-xl bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>

      {/* Brand Typographic Lockup */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2 leading-none">
            <h1 className={`font-bold tracking-tight text-slate-900 ${textTitle}`}>
              Assignment <span className="text-indigo-600 font-extrabold">Cover Maker</span>
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/70 shadow-2xs">
              JnU Edition
            </span>
          </div>
          <p className={`${textSub} text-slate-500 font-medium tracking-normal mt-1 flex items-center gap-1.5 leading-none`}>
            <span>Academic Cover Page Studio</span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-600 font-medium flex items-center gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Live PDF Exporter
            </span>
          </p>
        </div>
      )}
    </div>
  );
};
