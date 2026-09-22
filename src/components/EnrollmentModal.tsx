import React from 'react';
import { 
  X, 
  GraduationCap, 
  Headphones, 
  BookOpen, 
  MessageCircle, 
  Sparkles, 
  ShieldCheck 
} from 'lucide-react';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueFree: () => void;
  attemptedRound?: number;
}

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({
  isOpen,
  onClose,
  onContinueFree,
  attemptedRound = 21,
}) => {
  if (!isOpen) return null;

  const whatsappMessage = encodeURIComponent(
    `Hello! I would like to enroll in the complete course on Patente Bangla Italia (Activating Round #${attemptedRound} to 240). Please share enrollment details.`
  );
  const whatsappUrl = `https://wa.me/393510000000?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 transform transition-all">
        {/* Top Academic Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 p-6 sm:p-8 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-700/60 border border-blue-500/40 text-xs font-bold text-blue-200">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>Official Driving Academy Enrollment</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
              Complete Syllabus & Full Academy Access
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              You are currently evaluating the Foundation Assessment (Rounds 1–20). Enroll to unlock the full 240 rounds syllabus and official exam simulation tools.
            </p>
          </div>
        </div>

        {/* Course Inclusions */}
        <div className="p-6 sm:p-8 space-y-5">
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              What is included with Official Enrollment:
            </span>

            <div className="space-y-2.5">
              {[
                {
                  icon: BookOpen,
                  title: 'Complete 240 Rounds (7,200+ Ministerial Questions)',
                  desc: 'Every official question from the Italian Highway Code with accurate Bengali explanations.',
                },
                {
                  icon: Headphones,
                  title: 'Official Oral Exam Headphone Audio Simulation',
                  desc: 'Listen to native Italian audio pronunciation for every question, exactly like in the exam hall.',
                },
                {
                  icon: Sparkles,
                  title: '25 Chapters Theory Cheat Sheets & Trap Keywords',
                  desc: 'Key rules and exam tricks explained in 90 seconds per chapter.',
                },
                {
                  icon: MessageCircle,
                  title: 'Direct WhatsApp Instructor Mentorship',
                  desc: 'Got stuck on a tricky question? Get immediate guidance from our experienced team in Italy.',
                },
                {
                  icon: ShieldCheck,
                  title: 'Lifetime 2026 Ministerial Updates Included',
                  desc: 'Continuous access and new ministerial question updates until you pass your exam.',
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="p-2 rounded-lg bg-blue-100/80 text-blue-700 shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs sm:text-sm font-bold text-slate-900">
                        {item.title}
                      </p>
                      <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 transition cursor-pointer shadow-md active:scale-98"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Confirm Enrollment via WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={onContinueFree}
              className="w-full py-2.5 px-4 rounded-xl text-slate-600 hover:text-slate-900 font-bold text-xs sm:text-sm text-center transition cursor-pointer hover:bg-slate-100"
            >
              Continue Foundation Assessment (Rounds 1–20 Free)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
