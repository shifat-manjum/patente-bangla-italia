import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  LogIn,
  UserPlus,
  Loader2,
  AlertCircle,
  GraduationCap,
  Eye,
  EyeOff,
} from 'lucide-react';
import { registerStudent, loginStudent } from '../services/studentService';
import type { StudentProfile } from '../services/studentService';

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
  initialMode = 'login',
  forcedMessage,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneCountry, setPhoneCountry] = useState('+39');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Success screen state after successful registration
  const [registeredStudent, setRegisteredStudent] = useState<StudentUser | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Validation Policies
  const isNameValid = (val: string) => {
    const trimmed = val.trim();
    if (trimmed.length < 3) return false;
    return /^[\p{L}\s'-]+$/u.test(trimmed);
  };

  const isEmailValid = (val: string) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val.trim());
  };

  const isPhoneValid = (prefix: string, rawNumber: string) => {
    let digits = rawNumber.replace(/\D/g, '');
    if (!digits) return false;

    // Reject trivial short repetitive dummy numbers
    if (digits.length < 6 || /^(\d)\1+$/.test(digits) || digits === '123456' || digits === '12345678') {
      return false;
    }

    if (prefix === '+39') {
      // Italian mobile numbers start with 3 and have 9 to 10 digits (strip leading zero if entered)
      digits = digits.replace(/^0+/, '');
      return digits.length >= 9 && digits.length <= 10;
    }
    if (prefix === '+880') {
      // Bangladeshi mobile numbers start with 1 and have 10 digits
      digits = digits.replace(/^0+/, '');
      return digits.length === 10;
    }

    // Generic international format
    return digits.length >= 7 && digits.length <= 14;
  };

  const isPasswordValid = (val: string) => {
    if (val.length < 6) return false;
    // Reject common trivial sequences
    const trivial = ['123456', '1234567', '12345678', '000000', '111111', 'password', 'qwerty'];
    if (trivial.includes(val.toLowerCase())) return false;
    // Must contain both letters and numbers
    const hasLetters = /[a-zA-Z]/.test(val);
    const hasNumbers = /[0-9]/.test(val);
    return hasLetters && hasNumbers;
  };

  const getFirebaseErrorMessage = (err: any): string => {
    const code = err?.code || '';
    if (code === 'auth/email-already-in-use') {
      return 'এই ইমেইল দিয়ে ইতোমধ্যে অ্যাকাউন্ট রয়েছে। দয়া করে Sign In (লগইন) করুন।';
    }
    if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
      return 'ভুল ইমেইল বা পাসওয়ার্ড দেওয়া হয়েছে। দয়া করে আবার সঠিক তথ্য দিয়ে চেষ্টা করুন।';
    }
    if (code === 'auth/weak-password') {
      return 'পাসওয়ার্ড অত্যন্ত সহজ। অন্তত ৬ অক্ষর এবং সাথে সংখ্যা ও অক্ষর মিলিয়ে লিখুন।';
    }
    if (code === 'auth/invalid-email') {
      return 'সঠিক ইমেইল এড্রেস লিখুন (যেমন: name@gmail.com)।';
    }
    if (code === 'auth/network-request-failed') {
      return 'ইন্টারনেট কানেকশন সমস্যা। অনুগ্রহ করে আবার চেষ্টা করুন।';
    }
    return err?.message || 'একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।';
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1. Validate Name Group Policy
    if (!isNameValid(name)) {
      setError('নথিপত্র অনুযায়ী আপনার পূর্ণ নাম (First Name ও Last Name) ইংরেজিতে লিখুন (অন্তত ৩ অক্ষর)।');
      return;
    }

    // 2. Validate Email Group Policy
    if (!isEmailValid(email)) {
      setError('সঠিক ইমেইল ঠিকানা দিন (যেমন: marco.rossi@gmail.com)।');
      return;
    }

    // 3. Validate Phone Group Policy (Strict Italian Mobile)
    if (!isPhoneValid(phoneCountry, phoneNumber)) {
      if (phoneCountry === '+39') {
        setError('সঠিক ইতালিয়ান মোবাইল নম্বর দিন (ইতালিয়ান মোবাইল ৩ দিয়ে শুরু এবং ৯-১০ ডিজিটের হয়, যেমন: 328 123 4567)। ভুয়া নম্বর গ্রহণযোগ্য নয়।');
      } else {
        setError('সঠিক WhatsApp নম্বর দিন (নম্বরটি অন্তত ৮-১০ ডিজিটের হতে হবে)।');
      }
      return;
    }

    // 4. Validate Password Policy
    if (!isPasswordValid(password)) {
      setError('সহজ অথচ নিরাপদ পাসওয়ার্ড দিন: অন্তত ৬ অক্ষর এবং সাথে অক্ষর ও সংখ্যা মিলিয়ে লিখুন (যেমন: Patente26)।');
      return;
    }

    const cleanPhone = `${phoneCountry} ${phoneNumber.trim()}`;

    try {
      setIsLoading(true);
      const student = await registerStudent(name.trim(), email.trim(), cleanPhone, password);
      setIsLoading(false);
      setRegisteredStudent(student);
    } catch (err: any) {
      setIsLoading(false);
      setError(getFirebaseErrorMessage(err));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError('দয়া করে আপনার নিবন্ধিত ইমেইল এড্রেস দিন');
      return;
    }
    if (!password) {
      setError('দয়া করে আপনার পাসওয়ার্ড দিন');
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

  const handleWelcomeContinue = () => {
    if (registeredStudent) {
      onLoginSuccess(registeredStudent);
    }
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-5 flex min-h-full items-center justify-center bg-black/75 backdrop-blur-md animate-fadeIn text-left"
      role="dialog"
      aria-modal="true"
    >
      {/* Click Outside Backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Card */}
      <div 
        className="relative w-full max-w-md my-auto bg-white dark:bg-[#12161F] border border-slate-200 dark:border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl z-10 max-h-[92vh] flex flex-col overflow-hidden transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition cursor-pointer z-20"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* REGISTRATION SUCCESS / THANK YOU VIEW */}
        {registeredStudent ? (
          <div className="py-2 space-y-4 text-center animate-fadeIn overflow-y-auto no-scrollbar pr-1 -mr-1">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-2xl shadow-lg shadow-emerald-500/15">
              🎉
            </div>

            <div className="space-y-1">
              <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Registration Successful • Welcome!
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Benvenuto su Patente Bangla!
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                Welcome <strong>{registeredStudent.name}</strong>! Your student account is now active and ready.
              </p>
            </div>

            {/* Unlocked Benefits Banner */}
            <div className="p-3.5 rounded-2xl bg-orange-50/60 dark:bg-white/5 border border-orange-200/70 dark:border-white/10 text-left space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
                <GraduationCap className="w-4 h-4 text-[#FB6C00]" />
                <span>Active Account Benefits:</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Round 1 Unlocked</strong> — Pass with ≤ 3 errors to unlock next round</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Up to <strong>20 Assessment Rounds (600 Questions)</strong> free progress tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Cloud sync for mistake notebook & profile data</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={handleWelcomeContinue}
              className="w-full py-3 px-4 rounded-2xl bg-[#FB6C00] hover:bg-orange-600 text-white font-black text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98"
            >
              <span>Start Free Round 1 (প্রথম রাউন্ড শুরু করুন)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            {/* Modal Header & Tab Switcher (Fixed at top) */}
            <div className="shrink-0 space-y-3 pb-2 border-b border-slate-100 dark:border-white/10">
              <div className="pr-8">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  {mode === 'login' ? 'Sign In to Student Portal' : 'Create Free Student Account'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  {forcedMessage ||
                    (mode === 'login'
                      ? 'Log in to access your unlocked rounds and practice mistakes.'
                      : 'Register to unlock Round 1 and save your official exam progress.')}
                </p>
              </div>

              {/* Segmented Tab Switcher */}
              <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError('');
                  }}
                  className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    mode === 'login'
                      ? 'bg-white dark:bg-white/15 text-[#FB6C00] dark:text-white shadow-xs font-black'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError('');
                  }}
                  className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    mode === 'register'
                      ? 'bg-white dark:bg-white/15 text-[#FB6C00] dark:text-white shadow-xs font-black'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Create Account</span>
                </button>
              </div>
            </div>

            {/* Scrollable Form Body */}
            <div className="overflow-y-auto overflow-x-hidden pr-1 -mr-1 pt-3 space-y-3.5 no-scrollbar scrollbar-none flex-1">
              {/* Error Notification */}
              {error && (
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs font-bold text-rose-700 dark:text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{error}</span>
                </div>
              )}

              {/* LOGIN FORM */}
              {mode === 'login' && (
                <form onSubmit={handleLogin} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-[#0D1117] text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FB6C00] focus:border-[#FB6C00] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-[#0D1117] text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FB6C00] focus:border-[#FB6C00] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 mt-2 rounded-2xl bg-[#FB6C00] hover:bg-orange-600 disabled:opacity-60 text-white font-black text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      নতুন শিক্ষার্থী?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setMode('register');
                          setError('');
                        }}
                        className="font-bold text-[#FB6C00] hover:underline cursor-pointer"
                      >
                        ফ্রি অ্যাকাউন্ট তৈরি করুন
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* REGISTRATION FORM */}
              {mode === 'register' && (
                <form onSubmit={handleRegister} className="space-y-3">
                  {/* Full Legal Name */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Full Name *
                      </label>
                      {name && (
                        <span className={`text-[10px] font-bold ${isNameValid(name) ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {isNameValid(name) ? '✓ Valid' : 'Min 3 chars'}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="আপনার নাম (যেমন: Rock Man)"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-[#0D1117] text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FB6C00] focus:border-[#FB6C00] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Email Address *
                      </label>
                      {email && (
                        <span className={`text-[10px] font-bold ${isEmailValid(email) ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {isEmailValid(email) ? '✓ Valid' : 'Invalid format'}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="info@example.it"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-[#0D1117] text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FB6C00] focus:border-[#FB6C00] transition-colors"
                      />
                    </div>
                  </div>

                  {/* WhatsApp Phone Number */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        WhatsApp Phone *
                      </label>
                      {phoneNumber && (
                        <span className={`text-[10px] font-bold ${isPhoneValid(phoneCountry, phoneNumber) ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {isPhoneValid(phoneCountry, phoneNumber) ? '✓ Valid' : 'Invalid number'}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={phoneCountry}
                        onChange={(e) => setPhoneCountry(e.target.value)}
                        aria-label="Country Code"
                        className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-[#0D1117] text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#FB6C00] shrink-0 cursor-pointer"
                      >
                        <option value="+39">🇮🇹 +39</option>
                        <option value="+880">🇧🇩 +880</option>
                        <option value="+49">🇩🇪 +49</option>
                        <option value="+33">🇫🇷 +33</option>
                        <option value="+44">🇬🇧 +44</option>
                      </select>
                      <div className="relative flex-1">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="tel"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="328 123 4567"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-[#0D1117] text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FB6C00] focus:border-[#FB6C00] transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Password *
                      </label>
                      {password && (
                        <span className={`text-[10px] font-bold ${isPasswordValid(password) ? 'text-emerald-600' : 'text-amber-500'}`}>
                          {isPasswordValid(password) ? '✓ Strong' : 'Min 6 (Letters + Numbers)'}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-[#0D1117] text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FB6C00] focus:border-[#FB6C00] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Compact Benefits Checklist */}
                  <div className="p-3 rounded-2xl bg-orange-50/70 dark:bg-orange-950/20 border border-orange-200/70 dark:border-orange-900/40 space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                      <Sparkles className="w-3.5 h-3.5 text-[#FB6C00]" />
                      <span>Free Account Benefits:</span>
                    </div>
                    <div className="grid grid-cols-1 gap-1 pt-0.5 text-[11px] text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        Sequential Unlocking: Round 1 open, pass to unlock up to Round 20
                      </span>
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        Mistake Notebook &amp; progress synchronized to your profile
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-2xl bg-[#FB6C00] hover:bg-orange-600 disabled:opacity-60 text-white font-black text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Creating Account & Unlocking Round 1...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-1 pb-1">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      ইতোমধ্যে অ্যাকাউন্ট আছে?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setMode('login');
                          setError('');
                        }}
                        className="font-bold text-[#FB6C00] hover:underline cursor-pointer"
                      >
                        সাইন ইন করুন (Sign In)
                      </button>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
