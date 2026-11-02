import React, { useState, useEffect } from 'react';
import { Download, Share2, PlusSquare, X, Smartphone, CheckCircle2, ArrowRight } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const InstallAppBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [installedSuccessfully, setInstalledSuccessfully] = useState(false);

  useEffect(() => {
    // 1. Check if already running as installed PWA app (standalone)
    const isInStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes('android-app://');

    if (isInStandaloneMode) {
      setIsStandalone(true);
      return;
    }

    // 2. Check if user dismissed it recently (dismissed for 1 day)
    try {
      const dismissedTime = localStorage.getItem('patente_app_banner_dismissed_at');
      if (dismissedTime) {
        const timePassed = Date.now() - parseInt(dismissedTime, 10);
        if (timePassed < 24 * 60 * 60 * 1000) {
          setIsDismissed(true);
        }
      }
    } catch {
      // ignore storage errors
    }

    // 3. Detect iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent) && !('MSStream' in window);
    setIsIos(isAppleDevice);

    // 4. Listen for Android / Chrome beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 5. Listen for app installed event
    const handleAppInstalled = () => {
      setInstalledSuccessfully(true);
      setDeferredPrompt(null);
      setTimeout(() => {
        setIsStandalone(true);
      }, 3000);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    // If iOS Safari, show the step-by-step visual instruction modal
    if (isIos) {
      setShowIosModal(true);
      return;
    }

    // If Android with native prompt ready
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setInstalledSuccessfully(true);
          setTimeout(() => setIsStandalone(true), 3500);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.error('PWA Install error:', err);
      }
    } else {
      // Fallback: If in an in-app browser (Facebook, Instagram) or prompt hasn't fired
      setShowIosModal(true);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem('patente_app_banner_dismissed_at', Date.now().toString());
    } catch {}
  };

  // Do not render if already running inside the installed app or dismissed
  if (isStandalone || isDismissed) {
    return null;
  }

  return (
    <>
      {/* ============================================================== */}
      {/* 1. FLOATING MOBILE SMART INSTALL BAR (Designed for Mobile Feed) */}
      {/* ============================================================== */}
      <aside aria-label="অ্যাপ ইনস্টল নোটিফিকেশন" className="fixed top-2.5 sm:top-4 left-3 right-3 sm:left-auto sm:right-4 sm:max-w-md z-50 animate-fadeIn">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d1527] via-[#101b33] to-[#0d1527] border-2 border-[#00F5D4]/40 shadow-2xl shadow-[#00F5D4]/20 p-3 sm:p-3.5 backdrop-blur-xl text-white">
          {/* Subtle neon glowing accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00F5D4] to-transparent animate-pulse" />

          {/* Dismiss button */}
          <button
            type="button"
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Close banner"
          >
            <X className="w-4 h-4" />
          </button>

          {installedSuccessfully ? (
            <div className="flex items-center gap-3 py-1">
              <CheckCircle2 className="w-7 h-7 text-[#00F5D4] shrink-0 animate-bounce" />
              <div>
                <p className="text-xs sm:text-sm font-bold text-white">
                  🎉 Patente Guru অ্যাপ মোবাইলে সফলভাবে সেভ হয়েছে!
                </p>
                <p className="text-[11px] text-slate-300">
                  এখন থেকে ফোনের হোম স্ক্রিন আইকন থেকে ১ ক্লিকেই কুইজ ওপেন করুন।
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {/* App Icon preview */}
              <div className="relative shrink-0">
                <img
                  src="/icon-192x192.png"
                  alt="Patente Guru App"
                  className="w-12 h-12 rounded-xl object-cover shadow-lg border border-white/20"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#00F5D4] text-[#05080c] flex items-center justify-center text-[10px] font-black">
                  ✓
                </span>
              </div>

              {/* Text Hook */}
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-[#00F5D4]/20 text-[#00F5D4] text-[10px] font-extrabold tracking-wide uppercase">
                    মোবাইল অ্যাপ
                  </span>
                  <span className="text-[11px] text-slate-300 font-semibold truncate">
                    নাম মনে রাখা লাগবে না!
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-black text-white mt-0.5 leading-snug">
                  ১ ক্লিকে ফোনের স্ক্রিনে সেভ করুন
                </h4>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleInstallClick}
                className="shrink-0 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#00F5D4] to-[#00bbf9] hover:from-[#00F5D4] hover:to-[#00F5D4] text-slate-950 font-black text-xs shadow-lg shadow-[#00F5D4]/30 flex items-center gap-1.5 active:scale-95 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>অ্যাপ নিন</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ============================================================== */}
      {/* 2. STEP-BY-STEP INSTRUCTION MODAL (For iPhone & In-App Browser) */}
      {/* ============================================================== */}
      {showIosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-3xl bg-[#0F172A] border border-cyan-500/30 p-5 shadow-2xl text-white">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowIosModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-4">
              <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-2">
                <Smartphone className="w-7 h-7" />
              </div>
              <h3 className="text-base font-black text-white">
                ফোনের হোম স্ক্রিনে অ্যাপ সেভ করুন
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                পরের বার আর নাম খুঁজতে হবে না—ফোনের স্ক্রিনে Patente Guru আইকন থাকবে!
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-3 my-4">
              {/* Step 1 */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 font-black text-xs flex items-center justify-center shrink-0">
                  ১
                </div>
                <div className="text-xs">
                  <p className="font-bold text-white flex items-center gap-1.5">
                    নিচে <Share2 className="w-3.5 h-3.5 text-cyan-400" /> <span className="text-cyan-400">Share</span> বাটনে চাপ দিন
                  </p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    (সাফারি বা ক্রোম ব্রাউজারের নিচে বা উপরে শেয়ার আইকন পাবেন)
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 font-black text-xs flex items-center justify-center shrink-0">
                  ২
                </div>
                <div className="text-xs">
                  <p className="font-bold text-white flex items-center gap-1.5">
                    <PlusSquare className="w-3.5 h-3.5 text-[#00F5D4]" /> <span className="text-[#00F5D4]">Add to Home Screen</span> চাপুন
                  </p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    অপশন লিস্ট থেকে 'হোম স্ক্রিনে যোগ করুন' সিলেক্ট করুন।
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 font-black text-xs flex items-center justify-center shrink-0">
                  ৩
                </div>
                <div className="text-xs">
                  <p className="font-bold text-white flex items-center gap-1.5">
                    উপরে <span className="text-amber-400">Add</span> বাটনে চাপ দিন
                  </p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    ব্যস! Patente Guru অ্যাপ আপনার ফোনের হোম স্ক্রিনে সেভ হয়ে যাবে।
                  </p>
                </div>
              </div>
            </div>

            {/* Note for Facebook In-App Browser */}
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200 text-center mb-3">
              💡 ফেসবুক বা টিকটকে থাকলে উপরে ডানদিকের তিনটি ডটে (⋮) চাপ দিয়ে <strong>"Open in Chrome / Safari"</strong> করে নিন।
            </div>

            <button
              type="button"
              onClick={() => setShowIosModal(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-black text-xs shadow-lg active:scale-95 transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>বুঝেছি, ধন্যবাদ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
