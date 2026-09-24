import React from 'react';

interface CarLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CarLogo: React.FC<CarLogoProps> = ({ className = '', size = 'md' }) => {
  const dimensions = {
    sm: 'w-7 h-5',
    md: 'w-10 h-7 sm:w-12 sm:h-8',
    lg: 'w-16 h-10 sm:w-20 sm:h-12'
  };

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 group ${className}`}>
      <svg
        viewBox="0 0 80 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${dimensions[size]} transition-all duration-300 group-hover:scale-105 filter drop-shadow-[0_2px_10px_rgba(251,108,0,0.35)]`}
      >
        <defs>
          {/* Main Car Body Gradient - Vibrant Orange to Crimson Red */}
          <linearGradient id="brandCarBodyGrad" x1="4" y1="12" x2="76" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFA23A" />
            <stop offset="40%" stopColor="#FB6C00" />
            <stop offset="85%" stopColor="#E73F1E" />
            <stop offset="100%" stopColor="#C22709" />
          </linearGradient>

          {/* Roof & Pillars Highlight */}
          <linearGradient id="brandCarRoofGrad" x1="22" y1="6" x2="52" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFC875" />
            <stop offset="60%" stopColor="#FB6C00" />
            <stop offset="100%" stopColor="#B92508" />
          </linearGradient>

          {/* Windshield & Side Windows - Sky Blue Reflex */}
          <linearGradient id="brandCarGlassGrad" x1="24" y1="8" x2="50" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#0284C7" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0369A1" stopOpacity="0.4" />
          </linearGradient>

          {/* Headlight LED Beam Glow */}
          <linearGradient id="brandHeadlightBeam" x1="68" y1="24" x2="80" y2="27" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </linearGradient>

          {/* Alloy Wheel Rim Gradient */}
          <linearGradient id="brandWheelRim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="50%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
        </defs>

        {/* Speed Wind Streaks (Aerodynamic motion) */}
        <path
          d="M2 28 H12 M5 32 H11"
          stroke="#FB6C00"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeOpacity="0.6"
        />

        {/* Main Aerodynamic Car Silhouette */}
        <path
          d="M11 27 C11 23 15 22 19 22 C23 14 29 7 40 6 C50 6 56 12 60 21 C67 21 72 22 74 25 C76 28 75 31 71 32 C70 32 68.5 32 67.5 31 C65 26.5 58 26.5 55.5 31 H29 C26.5 26.5 19.5 26.5 17 31 C14 31 11 30 11 27 Z"
          fill="url(#brandCarBodyGrad)"
        />

        {/* Sleek Cabin / Windows */}
        <path
          d="M24 20 C26 14 31 8 40 7.5 C48 7.5 53 12.5 57 20 H24 Z"
          fill="url(#brandCarGlassGrad)"
          stroke="url(#brandCarRoofGrad)"
          strokeWidth="1.2"
        />

        {/* B-Pillar */}
        <line
          x1="39"
          y1="8"
          x2="40.5"
          y2="20"
          stroke="#0F172A"
          strokeWidth="1.6"
          strokeOpacity="0.65"
        />

        {/* Dynamic Shoulder Line (Reflects light) */}
        <path
          d="M18 21 C28 20 48 19 70 24"
          stroke="#FFE4C4"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeOpacity="0.85"
        />

        {/* Modern LED Headlight & Projection Beam */}
        <path
          d="M68 23.5 L73 24 C73.8 24.8 73.5 26 72 26.5 L67.5 25.5 Z"
          fill="#FEF08A"
        />
        <polygon
          points="72,24.5 80,22.5 80,28 71.5,26.5"
          fill="url(#brandHeadlightBeam)"
        />

        {/* Ruby Rear Tail Light */}
        <path
          d="M11.5 24.5 C11 25.2 11 26.8 12 27.5 L14 27 L14 24.5 Z"
          fill="#EF4444"
        />

        {/* Rear Wheel (Tire + Rim + Hub) */}
        <g transform="translate(23, 31)">
          <circle cx="0" cy="0" r="6.2" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
          <circle cx="0" cy="0" r="3.8" fill="url(#brandWheelRim)" />
          <circle cx="0" cy="0" r="1.4" fill="#0F172A" />
        </g>

        {/* Front Wheel (Tire + Rim + Hub) */}
        <g transform="translate(61.5, 31)">
          <circle cx="0" cy="0" r="6.2" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
          <circle cx="0" cy="0" r="3.8" fill="url(#brandWheelRim)" />
          <circle cx="0" cy="0" r="1.4" fill="#0F172A" />
        </g>
      </svg>
    </div>
  );
};
