import React from 'react';
import { Sun, Moon, BookOpen } from 'lucide-react';

export type ThemeMode = 'light' | 'sepia' | 'dark';

interface ThemeSwitcherProps {
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentTheme, onThemeChange }) => {
  return (
    <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold">
      {/* Light Theme */}
      <button
        type="button"
        onClick={() => onThemeChange('light')}
        className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
          currentTheme === 'light'
            ? 'bg-white text-slate-900 shadow-xs font-black'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
        }`}
        title="Light School Theme (ডিফল্ট)"
      >
        <Sun className="w-4 h-4 text-amber-500" />
        <span className="hidden md:inline">Light</span>
      </button>

      {/* Sepia Reader Theme */}
      <button
        type="button"
        onClick={() => onThemeChange('sepia')}
        className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
          currentTheme === 'sepia'
            ? 'bg-[#FBF0D9] text-[#704214] shadow-xs font-black'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
        }`}
        title="Reader Mood (চোখের আরামদায়ক রিডার থিম)"
      >
        <BookOpen className="w-4 h-4 text-[#B45309]" />
        <span className="hidden md:inline">Reader</span>
      </button>

      {/* Dark Theme */}
      <button
        type="button"
        onClick={() => onThemeChange('dark')}
        className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
          currentTheme === 'dark'
            ? 'bg-slate-900 text-white shadow-xs font-black'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
        }`}
        title="Dark Night Theme (রাতের ডার্ক মুড)"
      >
        <Moon className="w-4 h-4 text-indigo-400" />
        <span className="hidden md:inline">Dark</span>
      </button>
    </div>
  );
};

