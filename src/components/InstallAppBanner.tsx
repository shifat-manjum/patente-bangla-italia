import React, { useState, useEffect } from 'react';
import { Download, Share2, PlusSquare, X, Smartphone, CheckCircle2, ArrowRight, PlayCircle, ExternalLink, Play } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const FACEBOOK_INSTALL_VIDEO_URL = 'https://www.facebook.com/share/r/1F24af5GGh/';

export const InstallAppBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);
  const [installedSuccessfully, setInstalledSuccessfully] = useState(false);

  useEffect(() => {
    try {
      localStorage.removeItem('patente_app_banner_dismissed_at');
    } catch {
      // ignore storage errors
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent) && !('MSStream' in window);
    setIsIos(isAppleDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
      setInstalledSuccessfully(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosModal(true);
      return;
    }

    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setInstalledSuccessfully(true);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.error('PWA Install error:', err);
      }
    } else {
      setShowIosModal(true);
    }
  };

  return (
    <>
      {/* ===================================================================== */}
      {/* FIXED SECTION ON TOP OF DOCUMENT UTILITY CARD (2 DIVS: 40% AND 60%)   */}
      {/* ===================================================================== */}
      <section
        id="install-app-video-section"
        aria-label="অ্যাপ ইনস্টল এবং ভিডিও গাইড সেকশন"
        className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#12161F] border border-slate-200 dark:border-white/10 shadow-sm"
      >
        <div className="flex flex-col lg:flex-row items-stretch gap-6">
          {/* ============================================================== */}
          {/* FIRST DIV (40%): APP INSTALL INSTRUCTIONS & DOWNLOAD BUTTON    */}
          {/* ============================================================== */}
          <div className="w-full lg:w-[40%] flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-orange-50/80 via-white to-amber-50/60 dark:from-[#171C28] dark:via-[#12161F] dark:to-[#1A1412] border border-orange-200/70 dark:border-white/10 space-y-4">
            <div className="space-y-3">
              {/* App Icon + Top Badge */}
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <img
                    src="/icon-192x192.png"
                    alt="Patente Guru App"
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover shadow-md border border-slate-200 dark:border-white/15"
                  />
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black shadow-xs">
                    ✓
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-[#FB6C00] text-white text-[10px] font-black uppercase tracking-wider">
                      মোবাইল অ্যাপ
                    </span>
                    <span className="text-xs font-bold text-[#FB6C00]">
                      নাম মনে রাখা লাগবে না!
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white mt-1 leading-snug">
                    ১ ক্লিকে ফোনের স্ক্রিনে সেভ করুন
                  </h3>
                </div>
              </div>

              {/* Quick Instructions */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                বারবার ব্রাউজারে ওয়েবসাইটের নাম না খুঁজে আপনার মোবাইলের হোম স্ক্রিনে <strong>PatenteGuru Mobile App</strong> সেভ করে রাখুন:
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
                  <span className="w-5 h-5 rounded-full bg-[#FB6C00]/15 text-[#FB6C00] font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    ১
                  </span>
                  <span className="text-slate-700 dark:text-slate-200">
                    <strong>Android / Chrome:</strong> নিচের বাটনে ক্লিক করে সরাসরি <strong>Install / Add to Home Screen</strong> চাপুন।
                  </span>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
                  <span className="w-5 h-5 rounded-full bg-[#FB6C00]/15 text-[#FB6C00] font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    ২
                  </span>
                  <span className="text-slate-700 dark:text-slate-200">
                    <strong>iPhone (Safari):</strong> নিচের <strong>Share</strong> আইকনে চাপ দিয়ে <strong>Add to Home Screen</strong> সিলেক্ট করুন।
                  </span>
                </div>
              </div>
            </div>

            {/* Install CTA Button */}
            <div className="pt-2">
              {installedSuccessfully ? (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-2.5 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>🎉 PatenteGuru অ্যাপ সফলভাবে ফোনের স্ক্রিনে সেভ হয়েছে!</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#E52E2D] to-[#FB6C00] hover:from-[#d02524] hover:to-[#e55e00] text-white font-black text-xs sm:text-sm shadow-lg shadow-[#FB6C00]/30 flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer text-center"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  <span>Click Here to Install PatenteGuru Mobile App</span>
                </button>
              )}
            </div>
          </div>

          {/* ============================================================== */}
          {/* SECOND DIV (60%): FACEBOOK INSTALL GUIDE VIDEO LINK CARD       */}
          {/* ============================================================== */}
          <div className="w-full lg:w-[60%] flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#161B26] border border-slate-200 dark:border-white/10 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-[#FB6C00] shrink-0" />
                <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                  📱 ১. অ্যাপ ইনস্টল গাইড (Install Guide Video)
                </h4>
              </div>
              <a
                href={FACEBOOK_INSTALL_VIDEO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-black flex items-center gap-1.5 shrink-0 shadow-xs transition"
                title="Watch Install Guide Video on Facebook"
              >
                <span>Watch on Facebook</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Lightweight Clickable Video Card (0 KB Extra Page Weight) */}
            <a
              href={FACEBOOK_INSTALL_VIDEO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-full min-h-[220px] sm:min-h-[250px] overflow-hidden rounded-xl bg-slate-950 border border-slate-800 shadow-md flex flex-col items-center justify-center p-6 text-center transition hover:border-[#FB6C00]/60"
            >
              {/* Background Poster Image with Dark Overlay */}
              <img
                src="/og-image.jpg"
                alt="PatenteGuru Mobile App Install Video Guide"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 group-hover:opacity-45 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-slate-950/70" />

              {/* Play Button & Video Callout */}
              <div className="relative z-10 flex flex-col items-center space-y-3 max-w-md">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#E52E2D] to-[#FB6C00] text-white flex items-center justify-center shadow-2xl shadow-[#FB6C00]/50 group-hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 fill-current ml-1" />
                </div>
                <div className="space-y-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#1877F2] text-white text-[10px] font-black uppercase tracking-wider">
                    Facebook Official Video Guide
                  </span>
                  <h5 className="text-sm sm:text-base font-black text-white">
                    কীভাবে ১ ক্লিকে ফোনের স্ক্রিনে PatenteGuru অ্যাপ সেভ করবেন?
                  </h5>
                  <p className="text-xs text-slate-300">
                    এখানে ক্লিক করে আমাদের অফিসিয়াল ফেসবুক ভিডিও গাইডটি দেখুন ↗
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* STEP-BY-STEP INSTRUCTION MODAL (For iPhone & In-App Browser)   */}
      {/* ============================================================== */}
      {showIosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-[#12161F] border border-slate-200 dark:border-white/15 p-5 shadow-2xl text-slate-900 dark:text-white">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowIosModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-4">
              <div className="inline-flex p-3 rounded-2xl bg-[#FB6C00]/10 border border-[#FB6C00]/20 text-[#FB6C00] mb-2">
                <Smartphone className="w-7 h-7" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                ফোনের হোম স্ক্রিনে অ্যাপ সেভ করুন
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                পরের বার আর নাম খুঁজতে হবে না—ফোনের স্ক্রিনে Patente Guru আইকন থাকবে!
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-3 my-4">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <div className="w-7 h-7 rounded-xl bg-[#FB6C00]/15 text-[#FB6C00] font-black text-xs flex items-center justify-center shrink-0">
                  ১
                </div>
                <div className="text-xs">
                  <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    নিচে <Share2 className="w-3.5 h-3.5 text-[#FB6C00]" /> <span className="text-[#FB6C00]">Share</span> বাটনে চাপ দিন
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    (সাফারি বা ক্রোম ব্রাউজারের নিচে বা উপরে শেয়ার আইকন পাবেন)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <div className="w-7 h-7 rounded-xl bg-[#FB6C00]/15 text-[#FB6C00] font-black text-xs flex items-center justify-center shrink-0">
                  ২
                </div>
                <div className="text-xs">
                  <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <PlusSquare className="w-3.5 h-3.5 text-emerald-500" /> <span className="text-emerald-600 dark:text-emerald-400">Add to Home Screen</span> চাপুন
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    অপশন লিস্ট থেকে 'হোম স্ক্রিনে যোগ করুন' সিলেক্ট করুন।
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <div className="w-7 h-7 rounded-xl bg-[#FB6C00]/15 text-[#FB6C00] font-black text-xs flex items-center justify-center shrink-0">
                  ৩
                </div>
                <div className="text-xs">
                  <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    উপরে <span className="text-[#FB6C00]">Add</span> বাটনে চাপ দিন
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    ব্যস! Patente Guru অ্যাপ আপনার ফোনের হোম স্ক্রিনে সেভ হয়ে যাবে।
                  </p>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-200 text-center mb-3">
              💡 ফেসবুক বা টিকটকে থাকলে উপরে ডানদিকের তিনটি ডটে (⋮) চাপ দিয়ে <strong>"Open in Chrome / Safari"</strong> করে নিন।
            </div>

            <button
              type="button"
              onClick={() => setShowIosModal(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#E52E2D] to-[#FB6C00] text-white font-black text-xs shadow-lg active:scale-95 transition cursor-pointer flex items-center justify-center gap-1.5"
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
