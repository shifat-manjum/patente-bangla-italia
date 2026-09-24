import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

export type AppTab = 'dashboard' | 'curriculum' | 'exam' | 'theory' | 'errors';

interface AppNavigationProps {
  currentTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  errorCount?: number;
  activeRound?: number;
}

export const AppNavigation: React.FC<AppNavigationProps> = ({
  currentTab,
  onTabChange,
  errorCount = 0,
}) => {
  const tabs = [
    {
      id: 'dashboard' as AppTab,
      label: 'Dashboard',
      subtext: 'Overview & Stats',
      icon: LayoutDashboard,
      neonColor: '#00D2FF', // Electric Cyan
      glowColor: 'rgba(0, 210, 255, 0.45)',
    },
    {
      id: 'curriculum' as AppTab,
      label: '240 Rounds',
      subtext: '7K+ Questions',
      icon: BookOpen,
      neonColor: '#00F5A0', // Modern Mint / Emerald
      glowColor: 'rgba(0, 245, 160, 0.45)',
    },
    {
      id: 'exam' as AppTab,
      label: 'Real Life Exam Simulator',
      subtext: '30 Qs Official / 20 Min',
      icon: Clock,
      neonColor: '#B249F8', // Hyper Violet
      glowColor: 'rgba(178, 73, 248, 0.45)',
    },
    {
      id: 'theory' as AppTab,
      label: 'Summarized Theory',
      subtext: '25 Chapters',
      icon: FileText,
      neonColor: '#FFB800', // Cyber Gold / Amber
      glowColor: 'rgba(255, 184, 0, 0.45)',
    },
    {
      id: 'errors' as AppTab,
      label: 'Error Review',
      subtext: errorCount > 0 ? `${errorCount} Errors Saved` : 'Revisione Errori',
      icon: AlertCircle,
      neonColor: '#FF3366', // Neon Crimson / Rose
      glowColor: 'rgba(255, 51, 102, 0.45)',
    },
  ];

  return (
    <>
      {/* Desktop & Tablet Top Tab Navigation Bar (Car Cockpit Ambient Style - 25% Taller Buttons) */}
      <nav className="hidden md:block bg-slate-950/85 dark:bg-black/90 backdrop-blur-xl border-b border-slate-800/80 sticky top-[80px] sm:top-[88px] z-30 shadow-xl transition-colors">
        <div className="max-w-[1600px] mx-auto px-[15px] py-3 sm:py-4">
          <div className="flex items-center justify-start xl:justify-center gap-2.5 lg:gap-4.5 overflow-x-auto no-scrollbar py-1 px-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  style={{
                    boxShadow: isActive
                      ? `0 4px 20px -2px ${tab.glowColor}, inset 0 1px 2px rgba(255,255,255,0.15)`
                      : '0 4px 12px -2px rgba(0, 0, 0, 0.5)',
                  }}
                  className={`group relative p-[2px] rounded-2xl cursor-pointer transition-all duration-200 shrink-0 select-none ${
                    isActive
                      ? 'scale-[1.02] -translate-y-0.5'
                      : 'hover:scale-[1.01] hover:-translate-y-0.5 opacity-90 hover:opacity-100'
                  } active:translate-y-0.5 active:scale-[0.98]` }
                >
                  {/* Slow Moving Dotted Neon Border (Car Cockpit Ambient LED Dot Trace) */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none rounded-2xl overflow-visible">
                    <rect
                      x="1"
                      y="1"
                      width="calc(100% - 2px)"
                      height="calc(100% - 2px)"
                      rx="15"
                      fill="none"
                      stroke={tab.neonColor}
                      strokeWidth={isActive ? '2.5' : '1.5'}
                      strokeDasharray="1 11"
                      strokeLinecap="round"
                      className="animate-neon-dots"
                      style={{
                        filter: isActive
                          ? `drop-shadow(0 0 3px ${tab.neonColor}) drop-shadow(0 0 7px ${tab.neonColor})`
                          : `drop-shadow(0 0 2px ${tab.neonColor})`,
                        opacity: isActive ? 1 : 0.4,
                      }}
                    />
                  </svg>

                  {/* Real Physical Push-Button Body with Top Bevel & Tactile Shading */}
                  <div
                    className={`relative z-10 w-full h-full rounded-[14px] px-3.5 py-3 sm:px-4.5 sm:py-3.5 lg:px-5 lg:py-3.5 min-h-[58px] lg:min-h-[64px] flex items-center gap-3 lg:gap-3.5 transition-all ${
                      isActive
                        ? 'bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white border-t border-slate-600/80 border-b border-black shadow-[0_4px_16px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.2)]'
                        : 'bg-gradient-to-b from-slate-950 via-slate-950 to-black text-white/90 hover:text-white border-t border-slate-800/80 border-b border-black shadow-[0_3px_10px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.08)] hover:from-slate-900 hover:via-slate-950 hover:to-black'
                    }`}
                  >
                    {/* Glowing Illuminated Icon in Metallic Bezel Frame */}
                    <div
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 border shadow-inner"
                      style={{
                        backgroundColor: isActive ? `${tab.neonColor}20` : '#0B1120',
                        boxShadow: isActive
                          ? `0 0 14px ${tab.neonColor}50, inset 0 1px 1px rgba(255,255,255,0.15)`
                          : 'inset 0 1px 1px rgba(255,255,255,0.08)',
                        borderColor: isActive ? `${tab.neonColor}70` : '#334155',
                      }}
                    >
                      <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5" style={{ color: isActive ? tab.neonColor : '#E2E8F0' }} />
                    </div>

                    {/* Dual-Tier Text with Physical LED Power Indicator */}
                    <div className="text-left flex flex-col justify-center">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm lg:text-base font-black text-white tracking-tight whitespace-nowrap drop-shadow-xs">
                          {tab.label}
                        </span>
                        {/* Glowing LED Dot indicator */}
                        <span
                          className={`w-1.5 h-1.5 rounded-full transition-all shrink-0 ${
                            isActive ? 'animate-pulse' : 'opacity-30'
                          }`}
                          style={{
                            backgroundColor: tab.neonColor,
                            boxShadow: isActive ? `0 0 6px ${tab.neonColor}` : 'none',
                          }}
                        />
                      </div>
                      <span
                        className="text-[9.5px] sm:text-[10px] lg:text-[11px] font-black tracking-wider uppercase whitespace-nowrap block mt-0.5"
                        style={{ color: isActive ? tab.neonColor : '#94A3B8' }}
                      >
                        {tab.subtext}
                      </span>
                    </div>

                    {/* Active Bottom Glow Line Indicator */}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
                        style={{
                          backgroundColor: tab.neonColor,
                          boxShadow: `0 0 10px ${tab.neonColor}`,
                        }}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar (Modern Ambient Cockpit Style - Scaled Height & Safe Touch Area) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 dark:bg-black/95 backdrop-blur-xl border-t border-slate-800/90 shadow-[0_-8px_25px_rgba(0,0,0,0.5)] safe-bottom select-none touch-manipulation">
        <div className="grid grid-cols-5 h-[68px] sm:h-[72px] px-1.5 py-1 gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center gap-1 relative transition-all duration-150 cursor-pointer rounded-xl py-1 ${
                  isActive
                    ? 'bg-gradient-to-b from-slate-900 to-black border-t border-slate-700/60 shadow-[0_2px_8px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.12)]'
                    : 'hover:bg-slate-900/40 active:scale-95'
                }`}
              >
                <div
                  className={`w-8.5 h-8.5 rounded-lg flex items-center justify-center relative transition-transform ${
                    isActive ? 'scale-105' : ''
                  }`}
                  style={{
                    backgroundColor: isActive ? `${tab.neonColor}20` : 'transparent',
                    border: isActive ? `1px solid ${tab.neonColor}60` : '1px solid transparent',
                    boxShadow: isActive ? `0 0 12px ${tab.neonColor}40, inset 0 1px 1px rgba(255,255,255,0.1)` : 'none',
                  }}
                >
                  <Icon
                    className={`w-4.5 h-4.5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`}
                    style={{ color: isActive ? tab.neonColor : '#94A3B8' }}
                  />
                  {tab.id === 'errors' && errorCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 text-[8px] font-black px-1.5 py-0.2 rounded-full bg-rose-500 text-white shadow-xs">
                      {errorCount > 99 ? '99+' : errorCount}
                    </span>
                  )}
                </div>
                <span
                  className="text-[9px] sm:text-[10px] tracking-tight whitespace-nowrap truncate max-w-[62px] text-center"
                  style={{
                    color: isActive ? '#FFFFFF' : '#94A3B8',
                    fontWeight: isActive ? 800 : 500,
                  }}
                >
                  {tab.id === 'exam' ? 'Exam Sim' : tab.label}
                </span>
                {isActive && (
                  <span
                    className="absolute bottom-0.5 w-6 h-0.5 rounded-full"
                    style={{
                      backgroundColor: tab.neonColor,
                      boxShadow: `0 0 8px ${tab.neonColor}`,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
