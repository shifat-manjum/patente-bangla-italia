import React, { useState } from 'react';
import {
  ShieldCheck,
  Info,
  GraduationCap,
  LogOut,
  LogIn,
  ChevronDown,
  Phone,
  FileText
} from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';
import type { ThemeMode } from './ThemeSwitcher';
import { StudyMusicPlayer } from './StudyMusicPlayer';
import type { StudentUser } from './StudentAuthModal';
import { CarLogo } from './CarLogo';

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
  onOpenInvoice?: () => void;
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
  onOpenInvoice,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-[1600px] mx-auto px-[15px] py-3.5 sm:py-5 space-y-3 sm:space-y-4">
        {/* Top Line: Brand & VIP Upgrade Action */}
        <div className="flex items-center justify-between gap-3 sm:gap-4 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Sleek Modern Transparent Car Logo */}
            <CarLogo size="lg" className="shrink-0" />

            <div>
              <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                <span className="font-black text-xl sm:text-3xl tracking-tight text-slate-900 dark:text-white">
                  Patente<span className="text-[#FB6C00]">Bangla</span>
                </span>
                <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[9px] sm:text-[11px] font-black bg-orange-50 dark:bg-orange-950/50 text-[#FB6C00] border border-orange-200 dark:border-orange-800">
                  AUTOSCUOLA 2026
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block mt-0.5">
                ইতালিয়ান ড্রাইভিং লাইসেন্স স্কুল কুইজ • সহজ বাংলা ব্যাখ্যা ও অডিও
              </p>
              <div className="inline-flex items-center gap-1.5 sm:gap-2 mt-1 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[10.5px] sm:text-[12px] font-black tracking-wide leading-tight">
                <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-emerald-500"></span>
                </span>
                <span>Official 2026 Ministerial Questions • সরকারি অফিসিয়াল সিলেবাস</span>
              </div>
            </div>
          </div>

          {/* Right Status / Theme / Music / Student Pass Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-between sm:justify-end w-full sm:w-auto pt-2.5 sm:pt-0 border-t border-slate-100 sm:border-0 dark:border-slate-800">
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
                  className="py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
                  title="Your Student Profile"
                >
                  <div className="w-6 h-6 rounded-full bg-[#FB6C00] text-white flex items-center justify-center text-xs font-black uppercase shadow-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="max-w-[90px] sm:max-w-[130px] truncate">{currentUser.name}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
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
                              ACADEMY PRO
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[10px] font-black uppercase">
                              FREE FOUNDATION
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      {isVip && onOpenInvoice && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileOpen(false);
                            onOpenInvoice();
                          }}
                          className="w-full py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer border border-blue-200 dark:border-blue-900/50"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>অফিসিয়াল ইনভয়েস (Fattura PDF)</span>
                        </button>
                      )}

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
                className="py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 text-[#FB6C00] border border-orange-200 dark:border-orange-800 text-xs sm:text-sm font-black transition flex items-center gap-2 cursor-pointer shadow-xs"
                title="Student Login / Register"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Register</span>
              </button>
            )}

            {/* About Us */}
            <button
              type="button"
              onClick={onOpenAbout}
              className="py-2 sm:py-2.5 px-3 sm:px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer"
              title="About Us & Founder"
            >
              <Info className="w-4 h-4 text-[#FB6C00]" />
              <span className="hidden lg:inline">About</span>
            </button>

            {/* Admin Portal Button */}
            <button
              type="button"
              onClick={onOpenAdmin}
              className="py-2 sm:py-2.5 px-2.5 sm:px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold transition flex items-center gap-1 cursor-pointer"
              title="Admin CRM Portal (khshifat@gmail.com)"
            >
              <ShieldCheck className="w-4 h-4 text-slate-500" />
              <span className="hidden xl:inline text-xs">Admin</span>
            </button>

            {/* Academy Enrollment CTA */}
            {!isVip ? (
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">Foundation Access</span>
                  <span className="text-xs sm:text-sm font-black text-blue-600 dark:text-blue-400">
                    {Math.min(600, totalQuestionsAnswered)} / 600 Qs
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onOpenPaywall}
                  className="py-2 sm:py-3 px-3 sm:px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm shadow-md shadow-blue-500/20 hover:scale-105 active:scale-95 transition cursor-pointer flex items-center gap-1.5 sm:gap-2 shrink-0"
                >
                  <GraduationCap className="w-4 h-4 text-white shrink-0" />
                  <span>Academy Enrollment</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-black">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="hidden sm:inline">Enrolled Student (240 Rounds)</span>
                  <span className="sm:hidden">Pro Pass</span>
                </div>

                {onOpenInvoice && (
                  <button
                    type="button"
                    onClick={onOpenInvoice}
                    className="py-2 px-2.5 sm:px-3 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    title="Scarica e Stampa Ricevuta Ufficiale (Download Invoice PDF)"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span className="hidden md:inline">রসিদ / Fattura</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
