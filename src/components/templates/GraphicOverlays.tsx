import React from 'react';
import { AssignmentData, GraphicOverlayStyle } from '../../types';

interface GraphicOverlayProps {
  style: GraphicOverlayStyle;
  accentColor?: string;
  data?: AssignmentData;
}

export const GraphicOverlay: React.FC<GraphicOverlayProps> = ({ style, data }) => {
  if (style === 'none') return null;

  switch (style) {
    // 1. Image 2: Clean Cyan & Mint Concentric Circular Waves
    case 'cyan-wave':
      return (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 500 700"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="cyanArc1" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="cyanArc2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.15" />
            </linearGradient>
            <linearGradient id="cyanBottom" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0f766e" stopOpacity="0.75" />
            </linearGradient>
          </defs>

          {/* Upper Right Concentric Arc */}
          <path
            d="M 230 0 C 370 60 480 180 500 340 L 500 0 Z"
            fill="url(#cyanArc1)"
          />
          <path
            d="M 290 0 C 400 90 470 200 500 310 L 500 0 Z"
            fill="#38bdf8"
            fillOpacity="0.25"
          />

          {/* Lower Right Flowing Arc */}
          <path
            d="M 500 370 C 440 450 350 510 240 550 C 340 600 440 640 500 680 Z"
            fill="url(#cyanArc2)"
          />
          <path
            d="M 120 700 C 230 650 380 620 500 640 L 500 700 Z"
            fill="url(#cyanBottom)"
          />
          
          {/* Subtle Accent Arc Lines */}
          <path
            d="M 200 0 C 360 80 470 210 500 380"
            fill="none"
            stroke="#0284c7"
            strokeWidth="1.5"
            strokeOpacity="0.4"
          />
          <path
            d="M 170 700 C 280 620 400 590 500 600"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="1.5"
            strokeOpacity="0.4"
          />
        </svg>
      );

    // 2. Image 3: Sweeping Cerulean & Deep Navy Ocean Waves
    case 'ocean-wave':
      return (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 500 700"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="oceanGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="50%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
            <linearGradient id="oceanGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1d4ed8" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
          </defs>

          {/* Primary Wave Banner Cutting Across Middle-Left */}
          <path
            d="M 0 160 C 90 230 210 320 380 300 C 440 290 480 260 500 240 L 500 245 C 440 295 340 335 220 330 C 110 325 30 250 0 200 Z"
            fill="#0284c7"
            fillOpacity="0.4"
          />
          <path
            d="M 0 160 C 110 240 230 330 390 300 C 440 290 480 260 500 240 L 500 265 C 420 320 310 350 190 335 C 90 320 20 250 0 210 Z"
            fill="url(#oceanGrad1)"
          />

          {/* Wave Swooshes in Bottom-Left */}
          <path
            d="M 0 320 C 60 350 140 360 200 350 L 190 360 C 120 370 50 360 0 335 Z"
            fill="#38bdf8"
            fillOpacity="0.6"
          />
          <path
            d="M 0 350 C 70 370 160 375 220 365 L 210 375 C 140 385 50 380 0 365 Z"
            fill="url(#oceanGrad2)"
          />
          
          {/* Bottom Dynamic Fin Arc */}
          <path
            d="M 230 540 C 270 580 290 640 285 700 L 255 700 C 260 650 240 600 210 565 Z"
            fill="#0284c7"
            fillOpacity="0.8"
          />
          <path
            d="M 120 420 C 190 460 260 530 290 610"
            fill="none"
            stroke="#0284c7"
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />
        </svg>
      );

    // 3. Image 4: Modern Isometric Rounded Diamond Ribbons
    case 'diamond-ribbon':
      return (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 500 700"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top Right Diamond Loop */}
          <g transform="translate(380, 110) rotate(-45)">
            {/* Shadow Track */}
            <rect x="-80" y="-80" width="160" height="160" rx="45" fill="none" stroke="#e2e8f0" strokeWidth="26"/>
            {/* Blue Vibrant Loop */}
            <path
              d="M -70 -70 L 20 -70 C 60 -70 70 -60 70 -20 L 70 60 C 70 70 60 70 45 70"
              fill="none"
              stroke="#0284c7"
              strokeWidth="24"
              strokeLinecap="round"
            />
            {/* Dark Accent Corner */}
            <path
              d="M -70 -70 L -20 -70 C 20 -70 30 -60 30 -20"
              fill="none"
              stroke="#0f172a"
              strokeWidth="24"
              strokeLinecap="round"
            />
          </g>

          {/* Bottom Left Diamond Loop */}
          <g transform="translate(70, 560) rotate(-45)">
            <rect x="-70" y="-70" width="140" height="140" rx="38" fill="none" stroke="#f1f5f9" strokeWidth="22"/>
            <path
              d="M -60 -60 L 10 -60 C 50 -60 60 -50 60 -10 L 60 50"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="20"
              strokeLinecap="round"
            />
            <path
              d="M -60 50 L -60 -10 C -60 -50 -50 -60 -10 -60"
              fill="none"
              stroke="#1e3a8a"
              strokeWidth="20"
              strokeLinecap="round"
            />
          </g>

          {/* Subtle Central Geometric Watermark lines */}
          <rect x="180" y="270" width="220" height="220" rx="45" fill="none" stroke="#f8fafc" strokeWidth="18" transform="rotate(45 290 380)"/>
        </svg>
      );

    // 4. Image 5: Architectural Rounded Track Loops
    case 'architect-track':
      return (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 500 700"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top Right Interlocking Loop Tracks */}
          <path
            d="M 320 0 L 320 60 C 320 100 350 130 390 130 L 500 130"
            fill="none"
            stroke="#034b82"
            strokeWidth="30"
            strokeLinecap="round"
          />
          <path
            d="M 360 0 L 360 40 C 360 70 380 90 410 90 L 500 90"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="22"
            strokeLinecap="round"
          />

          {/* Bottom Right Track Brackets */}
          <path
            d="M 500 240 L 410 320 C 360 365 350 440 390 490 L 500 620"
            fill="none"
            stroke="#0284c7"
            strokeWidth="28"
            strokeLinecap="round"
          />
          <path
            d="M 500 310 L 445 365 C 410 400 400 450 430 490 L 500 580"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="20"
            strokeLinecap="round"
          />

          {/* Bottom Left Subtle Accent Line */}
          <path
            d="M 150 700 L 260 590 C 290 560 340 560 370 590 L 460 700"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="24"
            strokeLinecap="round"
          />
        </svg>
      );

    // 5. Image 6: Fluid Mint & Seafoam Wave Margin
    case 'mint-leaf-wave':
      return (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 500 700"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="mintGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a7f3d0" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="mintGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0d9488" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#042f2e" stopOpacity="0.85" />
            </linearGradient>
          </defs>

          {/* Layer 1 (Pale Seafoam Backdrop) */}
          <path
            d="M 500 0 L 340 0 C 300 120 330 260 410 380 C 470 470 480 600 370 700 L 500 700 Z"
            fill="#ccfbf1"
            fillOpacity="0.6"
          />

          {/* Layer 2 (Flowing Mint Wave) */}
          <path
            d="M 500 0 L 380 0 C 350 140 370 270 450 370 C 500 440 500 570 420 700 L 500 700 Z"
            fill="url(#mintGrad1)"
          />

          {/* Layer 3 (Deep Emerald / Forest Curve) */}
          <path
            d="M 500 230 C 470 300 450 390 480 470 C 500 520 490 620 450 700 L 500 700 Z"
            fill="url(#mintGrad2)"
          />
        </svg>
      );

    // 6. Image 7: Bold Diagonal Geometry & Spring Green Angle Cut
    case 'diagonal-cut':
      return (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 500 700"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top-Left Diagonal Triangles */}
          <polygon points="0,0 320,0 0,260" fill="#65a30d" />
          <polygon points="0,0 190,0 0,150" fill="#3f6212" />
          <polygon points="0,0 100,0 0,80" fill="#14532d" />

          {/* Bottom-Right Diagonal Angle Blocks */}
          <polygon points="180,700 500,700 500,440" fill="#65a30d" />
          <polygon points="310,700 500,700 500,550" fill="#3f6212" />
          <polygon points="400,700 500,700 500,620" fill="#14532d" />

          {/* Central Frame Cut Accent Line */}
          <line x1="20" y1="280" x2="340" y2="20" stroke="#84cc16" strokeWidth="2.5" strokeOpacity="0.7"/>
          <line x1="160" y1="680" x2="480" y2="420" stroke="#84cc16" strokeWidth="2.5" strokeOpacity="0.7"/>
        </svg>
      );

    // 7. Image 8: Dual-Tone S-Curve Ribbon (Teal & Lime)
    case 'teal-lime-s':
      return (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 500 700"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="tealBand" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f766e" />
              <stop offset="50%" stopColor="#0d9488" />
              <stop offset="100%" stopColor="#042f2e" />
            </linearGradient>
          </defs>

          {/* Top-Left Origin Dot */}
          <circle cx="50" cy="50" r="12" fill="#0d9488" />

          {/* Radiant Lime Accent Ribbon Band */}
          <path
            d="M 0 160 C 220 120 420 220 500 340 L 500 410 C 390 270 200 190 0 230 Z"
            fill="#84cc16"
          />

          {/* Sweeping Deep Teal Gradient Arc */}
          <path
            d="M 0 140 C 220 100 420 200 500 320 L 500 0 L 0 0 Z"
            fill="url(#tealBand)"
          />

          {/* Bottom Right Complementary Curved Arc */}
          <path
            d="M 500 520 C 370 560 260 630 200 700 L 500 700 Z"
            fill="url(#tealBand)"
          />
          <path
            d="M 500 505 C 360 545 250 620 185 700 L 200 700 C 260 630 370 560 500 520 Z"
            fill="#84cc16"
          />
        </svg>
      );

    // 8. Image 9: Classical Architecture Columns & Arches Modern Art
    case 'classical-pillars':
      return (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 500 700"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Textured Background Tint */}
          <rect width="500" height="700" fill="#f8fafc" fillOpacity="0.4" />

          {/* Left Ionic Column Flutes & Capital */}
          <g fill="#2563eb" fillOpacity="0.85">
            {/* Ionic Capital Top Scroll */}
            <path d="M 0 0 L 110 0 C 130 20 110 60 75 60 C 45 60 40 30 65 30 C 80 30 85 45 75 45" fill="none" stroke="#2563eb" strokeWidth="18" strokeLinecap="round"/>
            <circle cx="75" cy="42" r="9" fill="#2563eb"/>
            
            {/* Left Column Shaft Flute 1 */}
            <rect x="0" y="80" width="45" height="420" rx="22" fill="#1d4ed8" fillOpacity="0.75" />
            {/* Left Column Shaft Flute 2 */}
            <rect x="52" y="110" width="36" height="360" rx="18" fill="#60a5fa" fillOpacity="0.65" />
            
            {/* Lower Inverted Capital Arch */}
            <path d="M 0 700 L 105 700 C 115 650 90 610 60 610 C 35 610 30 635 50 635 C 65 635 65 620 60 620" fill="none" stroke="#1e40af" strokeWidth="18" strokeLinecap="round"/>
            <circle cx="58" cy="625" r="9" fill="#1e40af"/>
          </g>

          {/* Right Ionic Column Elements */}
          <g fill="#2563eb" fillOpacity="0.85">
            {/* Right Ionic Capital Scroll */}
            <path d="M 500 0 L 390 0 C 370 20 390 60 425 60 C 455 60 460 30 435 30 C 420 30 415 45 425 45" fill="none" stroke="#3b82f6" strokeWidth="18" strokeLinecap="round"/>
            <circle cx="425" cy="42" r="9" fill="#3b82f6"/>

            {/* Right Column Flutes */}
            <rect x="455" y="90" width="45" height="450" rx="22" fill="#2563eb" fillOpacity="0.7" />
            <rect x="412" y="130" width="36" height="380" rx="18" fill="#93c5fd" fillOpacity="0.6" />

            {/* Right Lower Arch */}
            <path d="M 500 700 L 400 700 C 385 640 415 600 445 600 C 470 600 475 625 455 625 C 440 625 440 615 445 615" fill="none" stroke="#1d4ed8" strokeWidth="18" strokeLinecap="round"/>
            <circle cx="445" cy="620" r="9" fill="#1d4ed8"/>
          </g>
        </svg>
      );

    // 9. Image 10: Swirling Low-Poly Prism Shard Cascade
    case 'prism-cascade':
      return (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 500 700"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Dynamic Cascade climbing along left side from bottom to top */}
          <g opacity="0.95">
            {/* Top Yellow/Amber Shards */}
            <polygon points="0,140 18,150 0,165" fill="#f59e0b" />
            <polygon points="12,180 38,205 15,225" fill="#f97316" />
            <polygon points="20,290 55,275 40,320" fill="#f59e0b" />
            <polygon points="28,340 70,335 48,380" fill="#eab308" />
            <polygon points="45,395 95,385 70,445" fill="#fbbf24" />

            {/* Middle Lime & Green Shards */}
            <polygon points="80,520 150,545 105,585" fill="#84cc16" />
            <polygon points="110,600 175,615 130,660" fill="#10b981" />
            <polygon points="190,560 250,575 220,630" fill="#22c55e" />
            <polygon points="230,640 310,660 260,700" fill="#059669" />

            {/* Bottom Swirl Blue & Sapphire Shards */}
            <polygon points="275,545 345,585 295,640" fill="#0284c7" />
            <polygon points="340,635 425,665 375,700" fill="#1d4ed8" />
            <polygon points="380,570 455,605 410,670" fill="#1e40af" />
            <polygon points="440,610 500,600 480,680" fill="#0369a1" />
            <polygon points="470,660 500,640 500,700 450,700" fill="#1e3a8a" />
          </g>
        </svg>
      );

    // 10. Image 1: Cellular Mosaic Droplet Curves
    case 'mosaic-curves':
      return (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 500 700"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Large smooth cellular bubble arcs along right edge */}
          <path
            d="M 500 80 C 400 90 320 180 340 280 C 355 350 420 400 500 410 Z"
            fill="#0ea5e9"
            fillOpacity="0.8"
          />
          <path
            d="M 500 300 C 430 305 380 355 390 420 C 400 480 445 520 500 530 Z"
            fill="#1d4ed8"
            fillOpacity="0.85"
          />
          <path
            d="M 500 440 C 450 440 400 485 410 545 C 420 600 460 635 500 645 Z"
            fill="#06b6d4"
            fillOpacity="0.75"
          />
          <path
            d="M 500 550 C 460 550 420 595 435 650 C 445 680 470 700 500 700 Z"
            fill="#10b981"
            fillOpacity="0.8"
          />

          {/* Bottom Left Corner Droplet */}
          <path
            d="M 0 620 C 60 630 110 660 140 700 L 0 700 Z"
            fill="#10b981"
            fillOpacity="0.85"
          />
        </svg>
      );

    // 12. Design Preset 1: Growth Corporates Working Capital Index (Data Book Edition)
    case 'growth-index-databook':
      return (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 500 700"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="growthBlueGrad1" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0033a0" />
              <stop offset="60%" stopColor="#0052cc" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <linearGradient id="growthCyanGrad1" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="60%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#7dd3fc" />
            </linearGradient>
            <linearGradient id="growthPaleGrad1" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#e0f2fe" />
            </linearGradient>
            <filter id="ribbonShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="-2" dy="6" stdDeviation="6" floodColor="#001e60" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Pale cool grey angular background slice */}
          <polygon points="0,430 500,270 500,640 0,640" fill="#f8fafc" opacity="0.9" />

          {/* S-Curve Multi-Stripe 3D Ribbon */}
          <g filter="url(#ribbonShadow)">
            {/* Stripe 1: Deep Navy Blue (Bottom-most) */}
            <path
              d="M 0 580 C 100 520 220 540 310 400 C 370 300 400 240 422 195"
              fill="none"
              stroke="#0033a0"
              strokeWidth="11"
              strokeLinecap="round"
            />
            {/* Stripe 2: Royal Cobalt */}
            <path
              d="M 0 550 C 90 490 210 510 300 380 C 360 280 410 220 442 165"
              fill="none"
              stroke="#0052cc"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Stripe 3: Bright Azure Blue */}
            <path
              d="M 0 520 C 80 460 200 480 290 360 C 350 260 420 220 460 185"
              fill="none"
              stroke="#1d4ed8"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Stripe 4: Sky Blue */}
            <path
              d="M 0 490 C 70 430 190 450 280 340 C 340 240 430 220 472 175"
              fill="none"
              stroke="#0284c7"
              strokeWidth="11"
              strokeLinecap="round"
            />
            {/* Stripe 5: Bright Cyan */}
            <path
              d="M 0 460 C 60 400 180 420 270 320 C 330 220 425 210 465 195"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="9"
              strokeLinecap="round"
            />
            {/* Stripe 6: Pale Powder Blue (Top-most) */}
            <path
              d="M 0 430 C 50 370 170 390 260 300 C 320 210 415 200 455 190"
              fill="none"
              stroke="#bae6fd"
              strokeWidth="8"
              strokeLinecap="round"
            />

            {/* 3D Arrowhead Clusters Terminating in Upper Right */}
            {/* Arrow 1 */}
            <polygon points="414,198 422,175 433,195 423,190" fill="#0033a0" />
            {/* Arrow 2 (Highest point) */}
            <polygon points="432,170 442,146 453,168 443,162" fill="#0052cc" />
            {/* Arrow 3 */}
            <polygon points="450,188 460,166 471,186 461,180" fill="#1d4ed8" />
            {/* Arrow 4 */}
            <polygon points="462,178 472,156 483,176 473,170" fill="#0284c7" />
            {/* Arrow 5 */}
            <polygon points="455,198 465,178 475,196 466,192" fill="#38bdf8" />
          </g>

          {/* 3D Perspective Cross-ribbon Grid / Undertwist */}
          <g opacity="0.45">
            <line x1="280" y1="360" x2="330" y2="400" stroke="#0033a0" strokeWidth="1.5" strokeDasharray="3,3" />
            <line x1="295" y1="340" x2="345" y2="380" stroke="#0033a0" strokeWidth="1.5" strokeDasharray="3,3" />
            <line x1="310" y1="320" x2="360" y2="360" stroke="#0033a0" strokeWidth="1.5" strokeDasharray="3,3" />
            <line x1="325" y1="300" x2="375" y2="340" stroke="#0033a0" strokeWidth="1.5" strokeDasharray="3,3" />
          </g>

          {/* Top Right Institutional Alignment Mark */}
          <g transform="translate(360, 24)">
            {data?.logoUrl ? (
              <image href={data.logoUrl} x="30" y="0" width="95" height="38" preserveAspectRatio="xMidYMid meet" />
            ) : (
              <>
                <text x="125" y="20" textAnchor="end" fill="#0052cc" fontSize="13" fontWeight="800" fontStyle="italic" letterSpacing="0.04em">
                  {data?.universityName ? (data.universityName.length > 20 ? data.universityName.split(' ').map(w => w[0]).join('').slice(0, 6) : data.universityName) : 'UNIVERSITY'}
                </text>
                {data?.departmentName && (
                  <text x="125" y="32" textAnchor="end" fill="#64748b" fontSize="7" fontWeight="600" letterSpacing="0.04em">
                    {data.departmentName.length > 26 ? data.departmentName.slice(0, 26) + '...' : data.departmentName}
                  </text>
                )}
              </>
            )}
          </g>

          {/* Bottom Solid Research Report Bar (Visa Data Book style) */}
          <g transform="translate(0, 642)">
            <rect x="0" y="0" width="500" height="58" fill="#0052cc" />
            <rect x="0" y="0" width="500" height="2.5" fill="#38bdf8" />
            <text
              x="475"
              y="35"
              textAnchor="end"
              fill="#ffffff"
              fontSize="12"
              fontWeight="700"
              letterSpacing="0.03em"
            >
              {data?.courseCode ? `${data.courseCode} • ${data.courseName || data.assignmentType || 'Data Book'}` : (data?.courseName || data?.assignmentType || 'Academic Research Report')}
            </text>
          </g>
        </svg>
      );

    // 13. Design Preset 2: Growth Corporates (Regional Edition with Globe Medallion)
    case 'growth-index-edition':
      return (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 500 700"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="growthRegBlue" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0033a0" />
              <stop offset="100%" stopColor="#0052cc" />
            </linearGradient>
            <filter id="ribbonShadow2" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="-2" dy="6" stdDeviation="6" floodColor="#001e60" floodOpacity="0.22" />
            </filter>
          </defs>

          {/* S-Curve Multi-Stripe 3D Ribbon Arrows */}
          <g filter="url(#ribbonShadow2)">
            <path
              d="M 0 580 C 100 520 220 540 310 400 C 370 300 400 240 422 195"
              fill="none"
              stroke="#0033a0"
              strokeWidth="11"
              strokeLinecap="round"
            />
            <path
              d="M 0 550 C 90 490 210 510 300 380 C 360 280 410 220 442 165"
              fill="none"
              stroke="#0052cc"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M 0 520 C 80 460 200 480 290 360 C 350 260 420 220 460 185"
              fill="none"
              stroke="#1d4ed8"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M 0 490 C 70 430 190 450 280 340 C 340 240 430 220 472 175"
              fill="none"
              stroke="#0284c7"
              strokeWidth="11"
              strokeLinecap="round"
            />
            <path
              d="M 0 460 C 60 400 180 420 270 320 C 330 220 425 210 465 195"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <path
              d="M 0 430 C 50 370 170 390 260 300 C 320 210 415 200 455 190"
              fill="none"
              stroke="#bae6fd"
              strokeWidth="8"
              strokeLinecap="round"
            />

            {/* Ascending Arrowhead Tips */}
            <polygon points="414,198 422,175 433,195 423,190" fill="#0033a0" />
            <polygon points="432,170 442,146 453,168 443,162" fill="#0052cc" />
            <polygon points="450,188 460,166 471,186 461,180" fill="#1d4ed8" />
            <polygon points="462,178 472,156 483,176 473,170" fill="#0284c7" />
            <polygon points="455,198 465,178 475,196 466,192" fill="#38bdf8" />
          </g>

          {/* Top Right Institution Logo / Mark */}
          <g transform="translate(380, 24)">
            {data?.logoUrl ? (
              <image href={data.logoUrl} x="20" y="0" width="90" height="38" preserveAspectRatio="xMidYMid meet" />
            ) : (
              <text x="110" y="24" textAnchor="end" fill="#0052cc" fontSize="14" fontWeight="800" fontStyle="italic" letterSpacing="0.04em">
                {data?.universityName ? (data.universityName.length > 18 ? data.universityName.split(' ').map(w => w[0]).join('').slice(0, 6) : data.universityName) : 'UNIVERSITY'}
              </text>
            )}
          </g>

          {/* Bottom Right Regional Medallion & Edition Pill (from Image 1) */}
          <g transform="translate(320, 480)">
            {/* Soft sky-blue circular medallion backdrop */}
            <circle cx="75" cy="75" r="70" fill="#e0f2fe" opacity="0.9" />

            {/* Silhouetted Vector Map Contour */}
            <path
              d="M 35 48 C 42 38 52 32 65 30 C 75 28 85 24 95 26 C 105 28 112 35 116 42 C 122 50 120 60 115 68 C 110 75 105 82 98 90 C 90 98 84 105 78 112 C 72 110 65 105 60 98 C 55 92 48 85 42 78 C 36 70 32 60 35 48 Z"
              fill="#0052cc"
            />
            {/* Stylized Island Accents */}
            <circle cx="112" cy="35" r="3" fill="#0052cc" />
            <circle cx="106" cy="28" r="2.5" fill="#0052cc" />
            <circle cx="50" cy="98" r="3" fill="#0052cc" />
            <circle cx="36" cy="62" r="2" fill="#0052cc" />

            {/* Floating Edition / Session Pill Badge */}
            {(() => {
              const editionText = data?.batch
                ? `${data.batch} Edition`
                : data?.program
                ? `${data.program} Edition`
                : data?.academicYear
                ? `Session ${data.academicYear}`
                : 'Academic Edition';
              const pillWidth = Math.max(145, Math.min(220, editionText.length * 7.5 + 36));
              const pillOffset = pillWidth - 145;
              return (
                <g transform={`translate(${-25 - pillOffset}, 115)`}>
                  <rect x="0" y="0" width={pillWidth} height="28" rx="14" fill="#0052cc" />
                  <text
                    x={pillWidth / 2}
                    y="18"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="11.5"
                    fontWeight="700"
                    letterSpacing="0.03em"
                  >
                    {editionText}
                  </text>
                </g>
              );
            })()}
          </g>
        </svg>
      );

    // 14. Design Preset 3: EUTAX Observatory (Global Tax Evasion / Orbital Particle Sphere)
    case 'orbital-particle-globe':
      return (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 500 700"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="globeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="85%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </radialGradient>
          </defs>

          {/* Huge Translucent Watermark Rings in background (EUTAX cover style) */}
          <ellipse cx="270" cy="220" rx="185" ry="185" stroke="#f1f5f9" strokeWidth="48" fill="none" opacity="0.9" />
          <ellipse cx="370" cy="250" rx="140" ry="140" stroke="#f8fafc" strokeWidth="36" fill="none" opacity="0.9" />

          {/* Top-Left Institutional Badge Box */}
          <g transform="translate(35, 25)">
            <rect x="0" y="0" width="124" height="42" rx="3" fill="#004785" />
            <text x="62" y="23" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="900" letterSpacing="0.06em">
              {data?.universityName ? (data.universityName.length > 14 ? data.universityName.split(' ').map(w => w[0]).join('').slice(0, 6) : data.universityName) : 'RESEARCH'}
            </text>
            <text x="62" y="35" textAnchor="middle" fill="#bae6fd" fontSize="7.5" fontWeight="600" letterSpacing="0.04em">
              {data?.departmentName ? (data.departmentName.length > 18 ? data.departmentName.slice(0, 18) + '...' : data.departmentName) : (data?.facultyName ? data.facultyName.slice(0, 18) : 'Observatory')}
            </text>
          </g>

          {/* Central Radiating Data Sphere with Particle Cloud */}
          <g transform="translate(210, 440)">
            {/* The Globe Spherical Base */}
            <circle cx="0" cy="0" r="74" fill="url(#globeGlow)" stroke="#cbd5e1" strokeWidth="1" />

            {/* Matrix Latitude / Longitude Dots representing the Globe Grid */}
            {/* Latitudinal dot arcs */}
            {[-50, -35, -20, -5, 10, 25, 40, 55].map((y, rowIdx) => {
              const halfW = Math.sqrt(Math.max(0, 70 * 70 - y * y));
              const dotsCount = Math.floor(halfW / 7);
              const dots = [];
              for (let i = -dotsCount; i <= dotsCount; i++) {
                const x = i * 7;
                const distFromCenter = Math.sqrt(x * x + y * y);
                if (distFromCenter < 70) {
                  dots.push(
                    <circle
                      key={`gdot-${rowIdx}-${i}`}
                      cx={x}
                      cy={y}
                      r={distFromCenter > 55 ? 0.9 : 1.4}
                      fill={((rowIdx + i) % 3 === 0) ? '#004785' : ((rowIdx + i) % 4 === 0) ? '#3b82f6' : '#94a3b8'}
                      opacity="0.8"
                    />
                  );
                }
              }
              return dots;
            })}

            {/* Inner Dark Cobalt Orbital Arc */}
            <path
              d="M -75 0 A 75 75 0 0 1 -45 -60"
              fill="none"
              stroke="#004785"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Outer Amber / Orange Orbital Arc */}
            <path
              d="M -90 0 A 90 90 0 0 1 -50 -75"
              fill="none"
              stroke="#ea580c"
              strokeWidth="3.2"
              strokeLinecap="round"
            />

            {/* Radiating Particle Explosion / Data Rays towards Top-Right */}
            {/* Ray trajectories */}
            {[
              { angle: -25, len: 140, dots: 10, color: '#f59e0b' },
              { angle: -35, len: 160, dots: 12, color: '#ea580c' },
              { angle: -45, len: 175, dots: 13, color: '#004785' },
              { angle: -55, len: 155, dots: 11, color: '#3b82f6' },
              { angle: -65, len: 145, dots: 10, color: '#f59e0b' },
              { angle: -75, len: 130, dots: 9, color: '#004785' },
              { angle: -15, len: 120, dots: 8, color: '#3b82f6' },
            ].map((ray, rIdx) => {
              const rad = (ray.angle * Math.PI) / 180;
              const points = [];
              for (let d = 1; d <= ray.dots; d++) {
                const distance = 74 + (d / ray.dots) * (ray.len - 74);
                const px = Math.cos(rad) * distance + (Math.sin(d * 3) * 3);
                const py = Math.sin(rad) * distance + (Math.cos(d * 2) * 3);
                points.push(
                  <circle
                    key={`ray-${rIdx}-${d}`}
                    cx={px}
                    cy={py}
                    r={d % 2 === 0 ? 1.6 : 1.1}
                    fill={d % 3 === 0 ? '#f59e0b' : ray.color}
                    opacity={0.3 + (d / ray.dots) * 0.6}
                  />
                );
              }
              return (
                <g key={`ray-group-${rIdx}`}>
                  <line
                    x1={Math.cos(rad) * 76}
                    y1={Math.sin(rad) * 76}
                    x2={Math.cos(rad) * ray.len}
                    y2={Math.sin(rad) * ray.len}
                    stroke={ray.color}
                    strokeWidth="0.8"
                    strokeDasharray="2,5"
                    opacity="0.3"
                  />
                  {points}
                </g>
              );
            })}
          </g>

          {/* Bottom Right Academic Credits Alignment Block (EUTAX Style) */}
          <g transform="translate(370, 684)">
            <rect x="0" y="0" width="80" height="16" fill="#004785" />
          </g>
        </svg>
      );

    // 15. Design Preset 4: Architectural Annual Report (Sculptural Arch & Cerulean Ribbon)
    case 'sculptural-arch-ribbon':
      return (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 500 700"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="spineShadow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0.15" />
              <stop offset="25%" stopColor="#0f172a" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="ceruleanRibbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="60%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <filter id="archRibbonShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="-4" dy="6" stdDeviation="8" floodColor="#0f172a" floodOpacity="0.14" />
            </filter>
            <filter id="ribbonDrop" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="-3" dy="4" stdDeviation="5" floodColor="#0284c7" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* Book Spine Subtle Shadow on the left */}
          <rect x="0" y="0" width="22" height="700" fill="url(#spineShadow)" />

          {/* Top Left Minimalist Brand Mark */}
          <g transform="translate(50, 38)">
            <line x1="0" y1="12" x2="8" y2="0" stroke="#0284c7" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="8" y1="12" x2="16" y2="0" stroke="#0284c7" strokeWidth="3.5" strokeLinecap="round" />
            <text x="24" y="10" fill="#0f172a" fontSize="10" fontWeight="800" letterSpacing="0.12em">
              {data?.universityName ? (data.universityName.length > 24 ? data.universityName.slice(0, 24).toUpperCase() + '...' : data.universityName.toUpperCase()) : 'ACADEMIC REPORT'}
            </text>
          </g>

          {/* Large 3D Architectural C-Curve / Bracket in sculptural light grey */}
          <g filter="url(#archRibbonShadow)">
            {/* Outer soft shadow contour */}
            <path
              d="M 370 60 C 240 60 215 130 215 220 L 215 480 C 215 570 240 640 370 640"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="56"
              strokeLinecap="round"
            />
            {/* Main soft sculpted grey body */}
            <path
              d="M 370 60 C 240 60 215 130 215 220 L 215 480 C 215 570 240 640 370 640"
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="50"
              strokeLinecap="round"
            />
            {/* Inner bevel light highlight */}
            <path
              d="M 370 60 C 240 60 215 130 215 220 L 215 480 C 215 570 240 640 370 640"
              fill="none"
              stroke="#ffffff"
              strokeWidth="14"
              strokeLinecap="round"
              opacity="0.9"
            />
          </g>

          {/* Vibrant Cerulean Blue Vertical Ribbon Stripe with Inward Branching Notch */}
          <g filter="url(#ribbonDrop)">
            {/* Top vertical stem */}
            <rect x="362" y="0" width="32" height="235" fill="url(#ceruleanRibbonGrad)" />

            {/* Inward Branching Curvature / Bracket interlocking with the arch */}
            <path
              d="M 362 235 C 300 235 300 325 362 325 L 394 325 C 345 325 345 235 394 235 Z"
              fill="#0284c7"
            />
            <path
              d="M 362 235 C 305 235 305 325 362 325"
              fill="none"
              stroke="#0369a1"
              strokeWidth="2"
              opacity="0.3"
            />

            {/* Bottom vertical stem */}
            <rect x="362" y="325" width="32" height="375" fill="url(#ceruleanRibbonGrad)" />

            {/* Subtle inner linear highlight on the blue ribbon */}
            <line x1="368" y1="0" x2="368" y2="700" stroke="#ffffff" strokeWidth="1.5" opacity="0.3" />
          </g>
        </svg>
      );

    default:
      return null;
  }
};

