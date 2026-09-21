import React from 'react';
import { Sun, Moon, BookOpen } from 'lucide-react';

export type ThemeMode = 'light' | 'sepia' | 'dark';

interface ThemeSwitcherProps {
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentTheme, onThemeChange }) => {
  return (
    <div className="flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold">
      {/* Light Theme */}
      <button
        type="button"
        onClick={() => onThemeChange('light')}
        className={`px-2 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
          currentTheme === 'light'
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-500 hover:text-slate-800'
        }`}
        title="Light School Theme (ডিফল্ট)"
      >
        <Sun className="w-3.5 h-3.5 text-amber-500" />
        <span className="hidden md:inline">Light</span>
      </button>

      {/* Sepia Reader Theme */}
      <button
        type="button"
        onClick={() => onThemeChange('sepia')}
        className={`px-2 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
          currentTheme === 'sepia'
            ? 'bg-[#FBF0D9] text-[#704214] shadow-sm'
            : 'text-slate-500 hover:text-slate-800'
        }`}
        title="Reader Mood (চোখের আরামদায়ক রিডার থিম)"
      >
        <BookOpen className="w-3.5 h-3.5 text-[#B45309]" />
        <span className="hidden md:inline">Reader</span>
      </button>

      {/* Dark Theme */}
      <button
        type="button"
        onClick={() => onThemeChange('dark')}
        className={`px-2 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
          currentTheme === 'dark'
            ? 'bg-slate-900 text-white shadow-sm'
            : 'text-slate-500 hover:text-slate-800'
        }`}
        title="Dark Night Theme (রাতের ডার্ক মুড)"
      >
        <Moon className="w-3.5 h-3.5 text-indigo-400" />
        <span className="hidden md:inline">Dark</span>
      </button>
    </div>
  );
};
