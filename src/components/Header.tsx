import React, { useState } from 'react';
import {
  ShieldCheck,
  Info,
  GraduationCap,
  LogOut,
  LogIn,
  ChevronDown,
  Phone
} from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';
import type { ThemeMode } from './ThemeSwitcher';
import { StudyMusicPlayer } from './StudyMusicPlayer';
import type { StudentUser } from './StudentAuthModal';

export type NavTab = 'rounds' | 'exam' | 'hotshot' | 'topics' | 'vocab' | 'mistakes' | 'admin';

interface HeaderProps {
  totalQuestionsAnswered: number;
  isVip: boolean;
  onOpenPaywall: () => void;
  onOpenAbout: () => void;
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  currentUser: StudentUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalQuestionsAnswered,
  isVip,
  onOpenPaywall,
  onOpenAbout,
  currentTheme,
  onThemeChange,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenAdmin,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-3">
        {/* Top Line: Brand & VIP Upgrade Action */}
        <div className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E73F1E] via-[#FB6C00] to-[#F9B637] p-0.5 shadow-md shadow-orange-500/20 shrink-0">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center text-sm font-black text-slate-900 dark:text-white shadow-inner">
                🇮🇹🇧🇩
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                  Patente<span className="text-[#FB6C00]">Bangla</span>
                </span>
                <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-orange-50 dark:bg-orange-950/50 text-[#FB6C00] border border-orange-200 dark:border-orange-800">
                  AUTOSCUOLA 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                ইতালিয়ান ড্রাইভিং লাইসেন্স স্কুল কুইজ • সহজ বাংলা ব্যাখ্যা ও অডিও
              </p>
            </div>
          </div>

          {/* Right Status / Theme / Music / Student Pass Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-end">
            {/* 3-Way Theme Switcher (Light / Reader / Dark) */}
            <ThemeSwitcher currentTheme={currentTheme} onThemeChange={onThemeChange} />

            {/* Study Ambient Concentration Music */}
            <StudyMusicPlayer />

            {/* Student Auth / Profile Menu */}
            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="py-1.5 px-2.5 sm:px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="Your Student Profile"
                >
                  <div className="w-5 h-5 rounded-full bg-[#FB6C00] text-white flex items-center justify-center text-[10px] font-black uppercase">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="max-w-[85px] sm:max-w-[120px] truncate">{currentUser.name}</span>
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown Card */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 z-50 animate-fadeIn text-left">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center text-sm font-black uppercase shadow-md shrink-0">
                        {currentUser.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {currentUser.name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {currentUser.email}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      {currentUser.phone && (
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                          <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">{currentUser.phone}</span>
                        </div>
                      )}

                      <div className="p-2.5 rounded-xl bg-orange-50/70 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-900/40">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Plan Status</span>
                          {currentUser.isVip || isVip ? (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-black uppercase">
                              Pro Pass
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-orange-500 text-white text-[10px] font-black uppercase">
                              Free 20 Rounds
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                          {currentUser.isVip || isVip
                            ? 'All 240 rounds & 7,100+ questions unlocked.'
                            : '20 free rounds (600 questions) active.'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          onLogout();
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer border border-rose-200 dark:border-rose-900/50"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out (সাইন আউট)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="py-1.5 px-2.5 sm:px-3 rounded-xl bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 text-[#FB6C00] border border-orange-200 dark:border-orange-800 text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="Student Login / Register"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In / Register</span>
              </button>
            )}

            {/* About Us */}
            <button
              type="button"
              onClick={onOpenAbout}
              className="py-1.5 px-2.5 sm:px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              title="About Us & Founder"
            >
              <Info className="w-3.5 h-3.5 text-[#FB6C00]" />
              <span className="hidden lg:inline">About</span>
            </button>

            {/* Admin Portal Button */}
            <button
              type="button"
              onClick={onOpenAdmin}
              className="py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              title="Admin CRM Portal (khshifat@gmail.com)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden xl:inline text-[11px]">Admin</span>
            </button>

            {/* Academy Enrollment CTA */}
            {!isVip ? (
              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">Foundation Access</span>
                  <span className="text-xs font-black text-blue-600 dark:text-blue-400">
                    {Math.min(600, totalQuestionsAnswered)} / 600 Qs
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onOpenPaywall}
                  className="py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-500/20 hover:scale-105 active:scale-95 transition cursor-pointer flex items-center gap-1.5"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-white" />
                  <span>Academy Enrollment</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-black">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Enrolled Student (240 Rounds)</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

