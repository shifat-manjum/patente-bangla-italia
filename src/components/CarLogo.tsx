import React from 'react';

interface CarLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const CarLogo: React.FC<CarLogoProps> = ({ className = '', size = 'md' }) => {
  const dimensions = {
    sm: 'h-6 sm:h-7 w-auto',
    md: 'h-9 sm:h-11 w-auto',
    lg: 'h-11 sm:h-14 w-auto',
    xl: 'h-14 sm:h-16 w-auto',
  };

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 group ${className}`}>
      <img
        src="/car-logo.png"
        alt="Patente Bangla Car Logo"
        className={`${dimensions[size]} object-contain drop-shadow-[0_4px_14px_rgba(0,0,0,0.25)] transition-transform duration-300 group-hover:scale-105 select-none pointer-events-none`}
        loading="eager"
      />
    </div>
  );
};
