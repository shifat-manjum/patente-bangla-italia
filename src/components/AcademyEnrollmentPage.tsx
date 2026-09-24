import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Headphones, 
  Sparkles, 
  MessageCircle, 
  ShieldCheck, 
  ArrowLeft,
  Award
} from 'lucide-react';

interface AcademyEnrollmentPageProps {
  onBack: () => void;
  attemptedRound?: number;
}

export const AcademyEnrollmentPage: React.FC<AcademyEnrollmentPageProps> = ({
  onBack,
  attemptedRound = 21,
}) => {
  const whatsappMessage = encodeURIComponent(
    `Hello! I would like to enroll in the complete course on Patente Bangla Italia (Activating Round #${attemptedRound} to 240). Please share enrollment details.`
  );
  const whatsappUrl = `https://wa.me/393510000000?text=${whatsappMessage}`;

  const inclusions = [
    {
      icon: BookOpen,
      titleIt: 'Tutti i 240 Round Ufficiali (7.200+ Quiz)',
      titleBn: '২৪০টি সম্পূর্ণ রাউন্ড ও ৭,২০০+ মিনিস্ট্রিয়াল প্রশ্ন',
      desc: 'ইতালির পরিবহন মন্ত্রণালয়ের অফিশিয়াল ডাটাবেজের প্রতিটি প্রশ্নের সহজ বাংলা অনুবাদ, কঠিন শব্দের উচ্চারণ ও সঠিক ব্যাখ্যা।',
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900',
    },
    {
      icon: Headphones,
      titleIt: 'Simulazione Esame Orale con Voce Naturale',
      titleBn: 'অফিসিয়াল হেডফোন অডিও সিমুলেশন (ইতালিয়ান নারী কণ্ঠ)',
      desc: 'ইতালির মোটরিসাসিয়নের আসল পরীক্ষার মতো প্রতিটি প্রশ্ন নেটিভ ইতালিয়ান উচ্চারণে শুনুন, পড়ার পাশাপাশি শোনার দক্ষতা বাড়ান।',
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900',
    },
    {
      icon: Sparkles,
      titleIt: '25 Capitoli di Teoria e Parole Trabocchetto',
      titleBn: '২৫টি অধ্যায়ের থিওরি সামারি ও ট্রিক শব্দের তালিকা',
      desc: 'প্রতিটি চ্যাপ্টারের মূল ফাঁদ শব্দ (Trabocchetti) এবং দ্রুত মুখস্থ করার গোল্ডেন রুলস দিয়ে সাজানো পূর্ণাঙ্গ কোর্স।',
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900',
    },
    {
      icon: MessageCircle,
      titleIt: 'Supporto Diretto WhatsApp con Tutor',
      titleBn: 'সরাসরি হোয়াটসঅ্যাপ টিউটর মেন্টরশিপ সাপোর্ট',
      desc: 'কুইজ সমাধান করতে গিয়ে কোনো প্রশ্ন বুঝতে না পারলে সরাসরি আমাদের অভিজ্ঞ টিমের সাথে হোয়াটসঅ্যাপে সমাধান বুঝে নেওয়ার সুবিধা।',
      color: 'text-green-500 bg-green-50 dark:bg-green-950/60 border-green-200 dark:border-green-900',
    },
    {
      icon: ShieldCheck,
      titleIt: 'Aggiornamenti Ministeriali 2026 Gratuiti',
      titleBn: '২০২৬ সালের সকল নতুন প্রশ্ন ও লাইফটাইম এক্সেস',
      desc: 'কোনো মাসিক সাবস্ক্রিপশন বা অতিরিক্ত চার্জ নেই। একবার এনরোল করলে পরীক্ষায় পাস করার আগ পর্যন্ত আজীবন এক্সেস।',
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-900',
    },
    {
      icon: Award,
      titleIt: 'Revisione Errori Illimitata & Statistiche Cloud',
      titleBn: 'স্মার্ট ভুলের খাতা ও ক্লাউড প্রগ্রেস সিঙ্ক',
      desc: 'আপনার সব ভুল স্বয়ংক্রিয়ভাবে সংরক্ষিত থাকবে। মোবাইল ও কম্পিউটারে একই সাথে প্র্যাকটিস করার সুবিধা।',
      color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fadeIn pb-24">
      {/* Top Navigation Back Action */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-black transition cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← ড্যাশবোর্ডে ফিরে যান (Back)</span>
        </button>

        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
          Autoscuola Ufficiale Patente B
        </span>
      </div>

      {/* Hero Enrollment Showcase Banner */}
      <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-blue-900/60">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/40 border border-blue-400/40 text-xs sm:text-sm font-black text-blue-200">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>অফিসিয়াল একাডেমি লাইফটাইম এনরোলমেন্ট (Accesso Completo)</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              প্রথমবারেই ইতালিয়ান ড্রাইভিং লাইসেন্স (Patente B) পাসের পূর্ণাঙ্গ কোর্স
            </h1>
            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed max-w-3xl">
              আপনি বর্তমানে ১ থেকে ২০টি ফ্রি ফাউন্ডেশন রাউন্ডে প্র্যাকটিস করছেন। একাডেমি এনরোলমেন্টের মাধ্যমে আনলক করুন বাকি ২২০টি প্রো রাউন্ড, অফিসিয়াল অডিও সিমুলেশন এবং সরাসরি শিক্ষক সহায়তা।
            </p>
          </div>

          {/* Pricing Highlight Pill */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-4 shadow-inner">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-2xl font-black shadow-md">
                €
              </div>
              <div>
                <span className="text-xs text-blue-200 font-bold block">এককালীন লাইফটাইম ফি (Una Tantum)</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-white">€৪৯</span>
                  <span className="text-xs text-slate-400 line-through">€৯৯</span>
                  <span className="text-[11px] font-black text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/20">
                    ৫০% ছাড়
                  </span>
                </div>
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-4 px-6 sm:px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2.5 transition cursor-pointer shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 w-full sm:w-auto text-center"
            >
              <MessageCircle className="w-5 h-5 shrink-0" />
              <span>WhatsApp-এ যোগাযোগ ও অ্যাক্টিভেশন</span>
            </a>
          </div>
        </div>
      </div>

      {/* 6 Key Benefits Grid */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          এনরোলমেন্টের সাথে যা যা পাচ্ছেন (Cosa Include il Corso)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inclusions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-2xs hover:shadow-md transition space-y-2.5"
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {item.titleIt}
                    </p>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-snug">
                      {item.titleBn}
                    </h3>
                  </div>
                </div>
                <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed pl-12">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* How to Enroll / Process */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-5">
        <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
          অ্যাকাউন্ট অ্যাক্টিভ করার সহজ ৩ ধাপ:
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center mx-auto sm:mx-0">
              ১
            </span>
            <h4 className="font-black text-sm text-slate-900 dark:text-white">
              WhatsApp-এ মেসেজ দিন
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              নিচের লিংকে ক্লিক করে আপনার স্টুডেন্ট নাম ও ইমেইল আমাদের পাঠান।
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center mx-auto sm:mx-0">
              ২
            </span>
            <h4 className="font-black text-sm text-slate-900 dark:text-white">
              ফি নিশ্চিত করুন (€৪৯)
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Postepay, Bonifico, PayPal বা কার্ডের মাধ্যমে সহজ পেমেন্ট সম্পন্ন করুন।
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center mx-auto sm:mx-0">
              ৩
            </span>
            <h4 className="font-black text-sm text-slate-900 dark:text-white">
              ২৪০ রাউন্ড অ্যাক্টিভ! 🚀
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              পেমেন্ট কনফার্ম হওয়ামাত্র আপনার অ্যাকাউন্টে সম্পূর্ণ সিলেবাস আনলক হবে।
            </p>
          </div>
        </div>

        {/* CTA Bar */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-700">
          <div className="text-center sm:text-left">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              সরাসরি যোগাযোগ: Shifat Manjum (Founder & Lead Instructor)
            </p>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Bologna, Italy • info@patente-bangla.it
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>কনফার্ম করুন (WhatsApp)</span>
            </a>

            <button
              type="button"
              onClick={onBack}
              className="py-3 px-5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs transition cursor-pointer"
            >
              পরে করবো (Close)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
