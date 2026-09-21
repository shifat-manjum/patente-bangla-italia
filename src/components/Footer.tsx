import React from 'react';
import type { NavTab } from './Header';

interface FooterProps {
  setActiveTab: (tab: NavTab) => void;
  onOpenAbout: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenAbout }) => {
  return (
    <footer className="mt-20 border-t border-white/10 glass-box bg-slate-950/85 backdrop-blur-2xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand & Purpose */}
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="font-black text-lg text-white">
                Patente<span className="text-emerald-400">Bangla</span> Italia 🇮🇹🇧🇩
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
              ইতালিতে বসবাসরত সকল ভাই ও বোনেদের জন্য ইতালিয়ান ড্রাইভিং লাইসেন্স (Patente B) এর প্রথম পূর্ণাঙ্গ বাংলা সহায়িকা।
              অফিশিয়াল কুইজের সহজ বাংলা অনুবাদ, কঠিন শব্দের উচ্চারণ এবং কেন সত্য বা মিথ্যা তার যৌক্তিক ব্যাখ্যা।
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">
              দ্রুত লিঙ্ক (Navigazione)
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={onOpenAbout}
                  className="hover:text-emerald-400 font-bold text-emerald-300 transition cursor-pointer flex items-center gap-1.5"
                >
                  ℹ️ আমাদের সম্পর্কে (Chi Siamo)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('exam')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  🎯 সিমুলেশন পরীক্ষা (Simulazione Esame)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('topics')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  📚 অধ্যায়ভিত্তিক কুইজ (Quiz per Capitolo)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('vocab')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  📖 শব্দকোষ ও উচ্চারণ (Dizionario)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('mistakes')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  ❌ ভুল প্রশ্ন রিভিশন (I Miei Errori)
                </button>
              </li>
              <li className="pt-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('admin')}
                  className="hover:text-amber-400 text-amber-400/80 font-bold transition cursor-pointer flex items-center gap-1.5"
                >
                  🔒 অ্যাডমিন প্রশ্ন ব্যাংক (Master DB)
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-[11px] text-slate-400 space-y-1 leading-relaxed">
          <p className="font-bold text-slate-300">
            ⚠️ Disclaimer Legale &amp; Trasparenza (আইনি তথ্য):
          </p>
          <p>
            PatenteBangla Italia è una piattaforma didattica indipendente per l'apprendimento e lo studio del Codice della Strada italiano per la comunità bengalese. Questo sito **NON è affiliato, sponsorizzato o gestito dal Ministero delle Infrastrutture e dei Trasporti (MIT)** né dalla Motorizzazione Civile. I testi delle domande ministeriali sono basati sui listati ufficiali di pubblico dominio.
          </p>
        </div>

        <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} PatenteBangla Italia. 100% Free &amp; Open Learning.
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <button
              type="button"
              onClick={onOpenAbout}
              className="hover:text-emerald-400 underline transition cursor-pointer font-medium"
            >
              Shifat Manjum (Zentixx)
            </button>
            <span>•</span>
            <span>কমিউনিটির উপকারের জন্য নির্মিত</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
