import React, { useState } from 'react';
import { X, User, Mail, Lock, Phone, ArrowRight, ShieldCheck, CheckCircle2, Sparkles, LogIn, UserPlus } from 'lucide-react';

export interface StudentUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isVip?: boolean;
  loggedInAt: string;
}

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

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
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
    if (!password || password.length < 4) {
      setError('পাসওয়ার্ড অন্তত ৪ অক্ষরের হতে হবে (Password minimum 4 chars)');
      return;
    }

    const newUser: StudentUser = {
      id: 'std_' + Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || undefined,
      isVip: false,
      loggedInAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem('patente_student_user', JSON.stringify(newUser));
      // Also save to students database in localStorage
      const existing = JSON.parse(localStorage.getItem('patente_registered_students') || '[]');
      existing.push(newUser);
      localStorage.setItem('patente_registered_students', JSON.stringify(existing));
    } catch {}

    onLoginSuccess(newUser);
    onClose();
  };

  const handleLogin = (e: React.FormEvent) => {
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

    // Check existing or create session
    let existingUser: StudentUser | null = null;
    try {
      const students: StudentUser[] = JSON.parse(localStorage.getItem('patente_registered_students') || '[]');
      existingUser = students.find((s) => s.email === email.trim().toLowerCase()) || null;
    } catch {}

    const loggedInUser: StudentUser = existingUser || {
      id: 'std_' + Date.now(),
      name: email.split('@')[0],
      email: email.trim().toLowerCase(),
      isVip: false,
      loggedInAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem('patente_student_user', JSON.stringify(loggedInUser));
    } catch {}

    onLoginSuccess(loggedInUser);
    onClose();
  };

  const handleQuickDemoLogin = () => {
    const demoUser: StudentUser = {
      id: 'std_demo_101',
      name: 'Demo Student (পরীক্ষার্থী)',
      email: 'student@autoscuola.it',
      phone: '+39 351 000 0000',
      isVip: false,
      loggedInAt: new Date().toISOString(),
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

        {/* Top Header Badge */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-xs font-bold text-[#FB6C00]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Student Portal • ফ্রি স্টুডেন্ট অ্যাকাউন্ট</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {mode === 'register' ? 'ফ্রি অ্যাকাউন্ট খুলুন ও পড়া শুরু করুন' : 'আপনার অ্যাকাউন্টে লগইন করুন'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {forcedMessage ||
              (mode === 'register'
                ? '২০টি ফ্রি রাউন্ড (৬০০ প্রশ্ন) শুরু করতে এবং আপনার প্রগ্রেস সেভ রাখতে ফ্রি রেজিস্ট্রেশন করুন।'
                : 'আপনার সংরক্ষিত স্কোর ও ভুল প্রশ্নের তালিকা দেখতে সাইন ইন করুন।')}
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
                পাসওয়ার্ড (Password) *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="কমপক্ষে ৪ অক্ষরের পাসওয়ার্ড"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Benefits Checklist */}
            <div className="p-3 rounded-xl bg-orange-50/60 dark:bg-orange-950/30 border border-orange-200/80 dark:border-orange-900/50 space-y-1 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                <Sparkles className="w-3.5 h-3.5 text-[#FB6C00]" />
                <span>অ্যাকাউন্ট তৈরি করলে যা যা পাবেন:</span>
              </div>
              <div className="grid grid-cols-1 gap-1 pt-1 text-[11px] text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ২০টি ফ্রি রাউন্ড (৬০০ মিনিস্টেরিয়াল প্রশ্ন)
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  যে কোনো ডিভাইসে প্রগ্রেস ও ভুল রিভিশন স্বয়ংক্রিয় সেভ
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-[#FB6C00] hover:bg-orange-600 text-white font-black text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Create Free Account & Start</span>
              <ArrowRight className="w-4 h-4" />
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
              className="w-full py-3 px-4 rounded-xl bg-[#FB6C00] hover:bg-orange-600 text-white font-black text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Sign In to Study</span>
              <ArrowRight className="w-4 h-4" />
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
