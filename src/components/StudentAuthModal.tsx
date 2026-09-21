import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  LogIn,
  UserPlus,
  Loader2,
  Cloud
} from 'lucide-react';
import { registerStudent, loginStudent } from '../services/studentService';
import type { StudentProfile } from '../services/studentService';
import { isFirebaseConfigured } from '../lib/firebase';

export type StudentUser = StudentProfile;

interface StudentAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: StudentUser) => void;
  initialMode?: 'login' | 'register';
  forcedMessage?: string;
}

export const StudentAuthModal: React.FC<StudentAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'register',
  forcedMessage,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const getFirebaseErrorMessage = (err: any): string => {
    const code = err?.code || '';
    if (code === 'auth/email-already-in-use') {
      return 'এই ইমেইল দিয়ে ইতোমধ্যে অ্যাকাউন্ট রয়েছে। দয়া করে Sign In করুন।';
    }
    if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
      return 'ভুল ইমেইল বা পাসওয়ার্ড দেওয়া হয়েছে। দয়া করে আবার চেষ্টা করুন।';
    }
    if (code === 'auth/weak-password') {
      return 'পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে (Firebase Security Rule)।';
    }
    if (code === 'auth/invalid-email') {
      return 'সঠিক ইমেইল ঠিকানা দিন (যেমন: name@gmail.com)।';
    }
    if (code === 'auth/network-request-failed') {
      return 'ইন্টারনেট কানেকশন সমস্যা। অনুগ্রহ করে আবার চেষ্টা করুন।';
    }
    return err?.message || 'একটি ত্রুটি ঘটেছে। আবার চেষ্টা করুন।';
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('দয়া করে আপনার পূর্ণ নাম লিখুন (Please enter your name)');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('সঠিক ইমেইল ঠিকানা দিন (Please enter a valid email)');
      return;
    }
    if (!password || password.length < 6) {
      setError('পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে (Password minimum 6 chars)');
      return;
    }

    try {
      setIsLoading(true);
      const student = await registerStudent(name, email, phone, password);
      onLoginSuccess(student);
      onClose();
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError('দয়া করে আপনার ইমেইল দিন (Please enter your email)');
      return;
    }
    if (!password) {
      setError('পাসওয়ার্ড দিন (Please enter password)');
      return;
    }

    try {
      setIsLoading(true);
      const student = await loginStudent(email, password);
      onLoginSuccess(student);
      onClose();
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = () => {
    const demoUser: StudentProfile = {
      uid: 'std_demo_101',
      name: 'Demo Student (পরীক্ষার্থী)',
      email: 'student@autoscuola.it',
      phone: '+39 351 000 0000',
      unlockedRound: 1,
      totalQuestionsAnswered: 0,
      completedRounds: {},
      mistakeIds: [],
      isVip: false,
      lastLoginAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem('patente_student_user', JSON.stringify(demoUser));
    } catch {}

    onLoginSuccess(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-left overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header Badge & Backend Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-xs font-bold text-[#FB6C00]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Student Portal • ফ্রি স্টুডেন্ট অ্যাকাউন্ট</span>
            </div>

            {isFirebaseConfigured ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                <Cloud className="w-3 h-3 text-emerald-500" />
                <span>Firebase Cloud Active</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                <span>⚡ Cloud Ready Backend</span>
              </span>
            )}
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {mode === 'register' ? 'ফ্রি অ্যাকাউন্ট খুলুন ও পড়া শুরু করুন' : 'আপনার অ্যাকাউন্টে লগইন করুন'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {forcedMessage ||
              (mode === 'register'
                ? '২০টি ফ্রি রাউন্ড (৬০০ প্রশ্ন) শুরু করতে এবং যেকোনো ডিভাইসে আপনার প্রগ্রেস সেভ রাখতে রেজিস্ট্রেশন করুন।'
                : 'আপনার সংরক্ষিত স্কোর, ভুল প্রশ্ন ও আনলক করা রাউন্ড দেখতে সাইন ইন করুন।')}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
            }}
            className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'register'
                ? 'bg-white dark:bg-slate-900 text-[#FB6C00] shadow-sm font-black'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account (নতুন)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'login'
                ? 'bg-white dark:bg-slate-900 text-[#FB6C00] shadow-sm font-black'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In (লগইন)</span>
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-bold text-rose-700 dark:text-rose-300">
            ⚠️ {error}
          </div>
        )}

        {/* Registration Form */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                পূর্ণ নাম (Full Name) *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: মোঃ শরিফুল ইসলাম"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                ইমেইল এড্রেস (Email Address) *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                ফোন বা হোয়াটসঅ্যাপ নম্বর (WhatsApp / Phone)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+39 351 ... অথবা +880 17 ..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                পাসওয়ার্ড (Password - কমপে ৭ অক্ষর) *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Benefits Checklist */}
            <div className="p-3 rounded-xl bg-orange-50/60 dark:bg-orange-950/30 border border-orange-200/80 dark:border-orange-900/50 space-y-1 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                <Sparkles className="w-3.5 h-3.5 text-[#FB6C00]" />
                <span>ক্লাউড অ্যাকাউন্টে যা যা যুক্ত থাকবে:</span>
              </div>
              <div className="grid grid-cols-1 gap-1 pt-1 text-[11px] text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ২০টি ফ্রি রাউন্ড (৬০০ মিনিস্টেরিয়াল প্রশ্ন)
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ক্লাউড ফায়ারস্টোরে স্বয়ংক্রিয় প্রগ্রেস ও স্কোর ব্যাকআপ
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-[#FB6C00] hover:bg-orange-600 disabled:opacity-60 text-white font-black text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Free Account & Start</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                ইমেইল এড্রেস (Email Address) *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                পাসওয়ার্ড (Password) *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="আপনার পাসওয়ার্ড দিন"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-[#FB6C00] hover:bg-orange-600 disabled:opacity-60 text-white font-black text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Study</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* 1-Click Quick Demo Login for instant test access */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
          >
            <span>⚡ 1-Click Quick Demo Login (পরীক্ষামূলক ডেমো লগইন)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
