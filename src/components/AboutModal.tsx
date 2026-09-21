import React from 'react';
import { X, Mail, Globe, ShieldCheck, HeartHandshake, Compass } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl glass-box bg-slate-950/95 border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E73F1E]/15 border border-[#FB6C00]/30 text-xs font-bold text-[#FFDD9C]">
            <Compass className="w-3.5 h-3.5 text-[#F9B637]" />
            <span>আমাদের পরিচিতি ও মিশন</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            আমাদের সম্পর্কে (Chi Siamo)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            ইতালিতে প্রবাসী ভাই-বোনদের লাইসেন্স জয়ের নির্ভরযোগ্য সঙ্গী।
          </p>
        </div>

        {/* Founder Story Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#181316] to-[#120f11] border border-[#FB6C00]/40 space-y-4 text-left shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#E73F1E] via-[#FB6C00] to-[#F9B637] p-0.5 shadow-md shrink-0">
              <div className="w-full h-full bg-[#120f11] rounded-[14px] flex items-center justify-center text-xl font-black text-[#F9B637]">
                SM
              </div>
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Shifat Manjum</h3>
              <p className="text-xs text-[#F9B637] font-bold">
                Product Architect &amp; Founder, Zentixx
              </p>
              <p className="text-[11px] text-slate-400">
                সফটওয়্যার ডেভেলপার ও উদ্যোক্তা (ইতালি ও ইউরোপ)
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal pt-2 border-t border-white/10">
            <p>
              «ইতালিতে আসার পর একটি ড্রাইভিং লাইসেন্স (Patente B) পাওয়া মানে কেবল গাড়ি চালানো নয়—এটি কাজের নতুন দুয়ার উন্মোচন, স্বাধীনভাবে চলাফেরা এবং পরিবারের সুরক্ষা নিশ্চিত করার সবচেয়ে বড় চাবিকাঠি।»
            </p>
            <p>
              «কিন্তু বহু বছর ধরে আমি দেখেছি, কঠিন ইতালিয়ান ব্যাকরণ ও হাজার হাজার অপরিচিত শব্দের কারণে আমাদের বহু প্রবাসী ভাই-বোন বারবার পরীক্ষায় ফেল করেন। অনেকেই কাজের ব্যস্ততার কারণে নির্দিষ্ট সময়ে কোচিং বা জুম ক্লাসে বসতে পারেন না, আবার অনেকে অতিরিক্ত অর্থ খরচ করেও সঠিক গাইডলাইন পান না।»
            </p>
            <p className="text-[#FFDD9C] font-semibold">
              «সেই সমস্যাকে স্থায়ীভাবে সমাধান করতেই আমি এবং Zentixx টিম তৈরি করেছি Patente Bangla। আমাদের লক্ষ্য একটাই: উন্নত প্রযুক্তি ও কৃত্রিম বুদ্ধিমত্তার সাহায্যে প্রতিটি সরকারি প্রশ্নকে সহজ বাংলায় বুঝিয়ে দেওয়া, সঠিক উচ্চারণ শোনানো এবং পরীক্ষার ফাঁদ শব্দগুলো ধরিয়ে দেওয়া—যাতে যে কেউ নিজের সুবিধামতো সময়ে অনুশীলন করে প্রথম সুযোগেই সফল হতে পারেন।»
            </p>
          </div>

          {/* Social / Contact Links */}
          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs">
            <a
              href="mailto:khshifat@gmail.com"
              className="inline-flex items-center gap-1.5 text-[#F9B637] hover:text-white font-bold transition"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>khshifat@gmail.com</span>
            </a>
            <a
              href="https://github.com/shifat-manjum"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white font-bold transition"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>github.com/shifat-manjum</span>
            </a>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400 text-xs">
              ইকোসিস্টেম: <strong className="text-[#FFDD9C]">Zentixx Store • MyPdfTools</strong>
            </span>
          </div>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-[#FB6C00]/20 text-[#FB6C00] flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-black text-white">২৪/৭ যে কোনো সময়</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              বাসে, রেস্তোরাঁয় কাজের ব্রেকে কিংবা রাতে ঘুমানোর আগে—মোবাইল থেকেই সরাসরি অনুশীলন।
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-[#F9B637]/20 text-[#F9B637] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-black text-white">১০০% স্বচ্ছ ও বিশ্বস্ত</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              কোনো লুকানো চার্জ নেই। ২০০টি প্রশ্ন ফ্রি দিয়ে শুরু করুন, ভালো লাগলে এককালীন অ্যাক্সেস।
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-[#E73F1E]/20 text-[#E73F1E] flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-black text-white">কমিউনিটি ফার্স্ট</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              প্রবাসী বাংলাদেশিদের ইতালিতে প্রতিষ্ঠিত হতে প্রযুক্তিগতভাবে ক্ষমতায়ন করাই আমাদের অঙ্গীকার।
            </p>
          </div>
        </div>

        {/* Close Button Bottom */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-8 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-xs transition cursor-pointer"
          >
            বন্ধ করুন (Chiudi)
          </button>
        </div>
      </div>
    </div>
  );
};
