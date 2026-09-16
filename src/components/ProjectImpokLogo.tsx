import React from 'react';

interface ProjectImpokLogoProps {
  className?: string;
  size?: number | string;
  variant?: 'color' | 'monochrome' | 'watermark' | 'light';
  ariaLabel?: string;
}

export const ProjectImpokLogo: React.FC<ProjectImpokLogoProps> = ({
  className = '',
  size = 40,
  variant = 'color',
  ariaLabel = 'Project Impok Seed Logo',
}) => {
  // Unique gradient IDs to prevent DOM collision if multiple instances render
  const idPrefix = React.useId().replace(/:/g, '');

  const grad1 = `${idPrefix}-seed-grad-1`;
  const grad2 = `${idPrefix}-seed-grad-2`;
  const grad3 = `${idPrefix}-seed-grad-3`;
  const grad4 = `${idPrefix}-seed-grad-4`;
  const gradCenter = `${idPrefix}-seed-grad-center`;

  if (variant === 'watermark') {
    return (
      <svg
        viewBox="0 0 100 134"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: size, height: typeof size === 'number' ? size * 1.34 : '100%' }}
        className={`pointer-events-none select-none ${className}`}
        aria-hidden="true"
      >
        {/* Outer capsule contour */}
        <path
          d="M 50 6 
             C 74 6, 88 32, 88 64 
             C 88 94, 72 120, 50 128 
             C 28 120, 12 94, 12 64 
             C 12 32, 26 6, 50 6 Z"
          fill="currentColor"
          fillOpacity="0.08"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeOpacity="0.2"
        />
        {/* Layer 1: Left sweep (Contribution & Foundation) */}
        <path
          d="M 50 10 
             C 66 22, 80 48, 78 78 
             C 74 100, 62 118, 50 124 
             C 38 100, 42 54, 50 10 Z"
          fill="currentColor"
          fillOpacity="0.14"
        />
        {/* Layer 2: Right sweep (Time & Compounding) */}
        <path
          d="M 50 10 
             C 34 22, 20 48, 22 78 
             C 26 100, 38 118, 50 124 
             C 62 100, 58 54, 50 10 Z"
          fill="currentColor"
          fillOpacity="0.12"
        />
        {/* Layer 3: Cross wave */}
        <path
          d="M 28 42 
             C 40 50, 60 70, 72 92 
             C 64 106, 52 114, 46 116 
             C 38 94, 30 68, 28 42 Z"
          fill="currentColor"
          fillOpacity="0.12"
        />
        {/* Central Upward Aperture */}
        <path
          d="M 50 36 
             C 58 52, 58 74, 50 90 
             C 42 74, 42 52, 50 36 Z"
          fill="currentColor"
          fillOpacity="0.18"
        />
        {/* Vertical Axis Line */}
        <line
          x1="50"
          y1="20"
          x2="50"
          y2="32"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.3"
        />
        <line
          x1="50"
          y1="92"
          x2="50"
          y2="110"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.3"
        />
      </svg>
    );
  }

  if (variant === 'monochrome') {
    return (
      <svg
        viewBox="0 0 100 134"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: size, height: typeof size === 'number' ? size * 1.34 : undefined }}
        className={`shrink-0 ${className}`}
        role="img"
        aria-label={ariaLabel}
      >
        {/* Base Seed Silhouette */}
        <path
          d="M 50 6 
             C 74 6, 88 32, 88 64 
             C 88 94, 72 120, 50 128 
             C 28 120, 12 94, 12 64 
             C 12 32, 26 6, 50 6 Z"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        {/* Layer 1: Left sweep (Contribution) */}
        <path
          d="M 50 12 C 68 26, 82 52, 80 82 C 76 104, 62 120, 50 126 C 40 100, 42 56, 50 12 Z"
          fill="currentColor"
          fillOpacity="0.25"
        />
        {/* Layer 2: Right sweep (Time) */}
        <path
          d="M 50 12 C 32 26, 18 52, 20 82 C 24 104, 38 120, 50 126 C 60 100, 58 56, 50 12 Z"
          fill="currentColor"
          fillOpacity="0.4"
        />
        {/* Central Upward Aperture */}
        <path
          d="M 50 42 C 57 56, 57 74, 50 88 C 43 74, 43 56, 50 42 Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 100 134"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, height: typeof size === 'number' ? size * 1.34 : undefined }}
      className={`shrink-0 transition-transform duration-300 ${className}`}
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        {/* Gradient 1: Left Wing / Foundation Arc (Deep Teal to Emerald) */}
        <linearGradient id={grad1} x1="16" y1="20" x2="80" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0D9488" />
          <stop offset="45%" stopColor="#059669" />
          <stop offset="100%" stopColor="#064E3B" />
        </linearGradient>

        {/* Gradient 2: Right Wing / Growth & Time Arc (Vibrant Emerald to Teal) */}
        <linearGradient id={grad2} x1="84" y1="20" x2="20" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="55%" stopColor="#0D9488" />
          <stop offset="100%" stopColor="#0F766E" />
        </linearGradient>

        {/* Gradient 3: Outer Capsule Rim Glow */}
        <linearGradient id={grad3} x1="50" y1="6" x2="50" y2="130" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34D399" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#10B981" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#059669" stopOpacity="0.85" />
        </linearGradient>

        {/* Gradient 4: Translucent Intersecting Dividend Arc */}
        <linearGradient id={grad4} x1="30" y1="35" x2="70" y2="95" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6EE7B7" stopOpacity="0.85" />
          <stop offset="60%" stopColor="#14B8A6" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#047857" stopOpacity="0.6" />
        </linearGradient>

        {/* Central Upward Transformation Core */}
        <linearGradient id={gradCenter} x1="50" y1="36" x2="50" y2="92" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A7F3D0" />
          <stop offset="50%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>

      {/* 1. Outer Elongated Seed Capsule / Silhouette */}
      <path
        d="M 50 6 
           C 74 6, 88 32, 88 64 
           C 88 94, 72 120, 50 128 
           C 28 120, 12 94, 12 64 
           C 12 32, 26 6, 50 6 Z"
        stroke={`url(#${grad3})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="#041B26"
        fillOpacity="0.3"
      />

      {/* 2. Layer A: Left Sweeping Petal (Contribution & Foundation) */}
      <path
        d="M 50 10 
           C 66 22, 80 48, 78 78 
           C 74 100, 62 118, 50 124 
           C 38 100, 42 54, 50 10 Z"
        fill={`url(#${grad1})`}
        fillOpacity="0.88"
      />

      {/* 3. Layer B: Right Sweeping Petal (Time & Compounding) */}
      <path
        d="M 50 10 
           C 34 22, 20 48, 22 78 
           C 26 100, 38 118, 50 124 
           C 62 100, 58 54, 50 10 Z"
        fill={`url(#${grad2})`}
        fillOpacity="0.78"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* 4. Layer C: Diagonal Cross-Wave (Accumulation & Dividends) */}
      <path
        d="M 28 42 
           C 40 50, 60 70, 72 92 
           C 64 106, 52 114, 46 116 
           C 38 94, 30 68, 28 42 Z"
        fill={`url(#${grad4})`}
        fillOpacity="0.65"
      />

      {/* 5. Central Negative Space / Luminous Upward Seed Core (Growth & Emergence) */}
      <path
        d="M 50 36 
           C 58 52, 58 74, 50 90 
           C 42 74, 42 52, 50 36 Z"
        fill={`url(#${gradCenter})`}
        filter="drop-shadow(0 1px 3px rgba(16, 185, 129, 0.4))"
      />

      {/* Subtle Central Ascending Axis Line */}
      <line
        x1="50"
        y1="22"
        x2="50"
        y2="34"
        stroke="#A7F3D0"
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.8"
      />
      <line
        x1="50"
        y1="92"
        x2="50"
        y2="108"
        stroke="#10B981"
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.6"
      />
    </svg>
  );
};
