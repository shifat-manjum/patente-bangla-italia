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
    },
    {
      id: 'curriculum' as AppTab,
      label: '240 Rounds',
      subtext: '7K+ Questions',
      icon: BookOpen,
    },
    {
      id: 'exam' as AppTab,
      label: 'Real Life Exam Simulator',
      subtext: '30 Qs Official / 20 Min',
      icon: Clock,
    },
    {
      id: 'theory' as AppTab,
      label: 'Summarized Theory',
      subtext: '25 Chapters',
      icon: FileText,
    },
    {
      id: 'errors' as AppTab,
      label: 'Error Review',
      subtext: errorCount > 0 ? `${errorCount} Errors Saved` : 'Revisione Errori',
      icon: AlertCircle,
    },
  ];

  return (
    <>
      {/* Desktop & Tablet Top Tab Navigation Bar (Adobe Dark Ambient Cockpit Style) */}
      <nav className="hidden md:block bg-[#0D1117]/90 backdrop-blur-xl border-b border-white/10 sticky top-[80px] sm:top-[88px] z-30 shadow-xl transition-colors">
        <div className="max-w-[1600px] mx-auto px-[15px] py-3 sm:py-4">
          <div className="flex items-center justify-start xl:justify-center gap-2.5 lg:gap-4 overflow-x-auto no-scrollbar py-1 px-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  style={{
                    boxShadow: isActive
                      ? '0 4px 20px -2px rgba(229, 46, 45, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.2)'
                      : '0 4px 12px -2px rgba(0, 0, 0, 0.5)',
                  }}
                  className={`group relative p-[2px] rounded-2xl cursor-pointer transition-all duration-200 shrink-0 select-none ${
                    isActive
                      ? 'scale-[1.02] -translate-y-0.5'
                      : 'hover:scale-[1.01] hover:-translate-y-0.5 opacity-90 hover:opacity-100'
                  } active:translate-y-0.5 active:scale-[0.98]` }
                >
                  {/* Subtle Moving Dotted LED Trace */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none rounded-2xl overflow-visible">
                    <rect
                      x="1"
                      y="1"
                      width="calc(100% - 2px)"
                      height="calc(100% - 2px)"
                      rx="15"
                      fill="none"
                      stroke={isActive ? '#E52E2D' : 'rgba(255, 255, 255, 0.12)'}
                      strokeWidth={isActive ? '2.5' : '1.2'}
                      strokeDasharray="1 11"
                      strokeLinecap="round"
                      className="animate-neon-dots"
                      style={{
                        filter: isActive ? 'drop-shadow(0 0 4px rgba(229, 46, 45, 0.8))' : 'none',
                        opacity: isActive ? 1 : 0.4,
                      }}
                    />
                  </svg>

                  {/* Physical Push-Button Body */}
                  <div
                    className={`relative z-10 w-full h-full rounded-[14px] px-3.5 py-3 sm:px-4.5 sm:py-3.5 lg:px-5 lg:py-3.5 min-h-[58px] lg:min-h-[64px] flex items-center gap-3 lg:gap-3.5 transition-all ${
                      isActive
                        ? 'bg-gradient-to-b from-[#1C2333] via-[#12161F] to-[#0D1117] text-white border-t border-white/30 border-b border-black shadow-[0_4px_16px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.2)]'
                        : 'bg-gradient-to-b from-[#151A26] via-[#12161F] to-[#0D1117] text-white/90 hover:text-white border-t border-white/10 border-b border-black shadow-[0_3px_10px_rgba(0,0,0,0.4)] hover:from-[#182030]'
                    }`}
                  >
                    {/* Illuminated Icon */}
                    <div
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 border"
                      style={{
                        backgroundColor: isActive ? 'rgba(229, 46, 45, 0.18)' : 'rgba(255, 255, 255, 0.05)',
                        borderColor: isActive ? 'rgba(229, 46, 45, 0.6)' : 'rgba(255, 255, 255, 0.1)',
                        boxShadow: isActive ? '0 0 14px rgba(229, 46, 45, 0.4)' : 'none',
                      }}
                    >
                      <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5" style={{ color: isActive ? '#FFFFFF' : '#94A3B8' }} />
                    </div>

                    {/* Dual-Tier Text with Adobe Crimson LED indicator */}
                    <div className="text-left flex flex-col justify-center">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm lg:text-base font-black text-white tracking-tight whitespace-nowrap">
                          {tab.label}
                        </span>
                        <span
                          className={`w-1.5 h-1.5 rounded-full transition-all shrink-0 ${
                            isActive ? 'animate-pulse' : 'opacity-30'
                          }`}
                          style={{
                            backgroundColor: isActive ? '#E52E2D' : '#64748B',
                            boxShadow: isActive ? '0 0 6px #E52E2D' : 'none',
                          }}
                        />
                      </div>
                      <span
                        className="text-[9.5px] sm:text-[10px] lg:text-[11px] font-black tracking-wider uppercase whitespace-nowrap block mt-0.5"
                        style={{ color: isActive ? '#FB6C00' : '#94A3B8' }}
                      >
                        {tab.subtext}
                      </span>
                    </div>

                    {/* Active Bottom Glow Line Indicator */}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
                        style={{
                          backgroundColor: '#E52E2D',
                          boxShadow: '0 0 10px #E52E2D',
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

      {/* Mobile Bottom Navigation Bar (Adobe Dark Ambient Cockpit Style) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0D1117]/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-8px_25px_rgba(0,0,0,0.6)] safe-bottom select-none touch-manipulation">
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
                    ? 'bg-white/10 border-t border-white/20 shadow-[0_2px_8px_rgba(0,0,0,0.6)]'
                    : 'hover:bg-white/5 active:scale-95'
                }`}
              >
                <div
                  className={`w-8.5 h-8.5 rounded-lg flex items-center justify-center relative transition-transform ${
                    isActive ? 'scale-105' : ''
                  }`}
                  style={{
                    backgroundColor: isActive ? 'rgba(229, 46, 45, 0.2)' : 'transparent',
                    border: isActive ? '1px solid rgba(229, 46, 45, 0.5)' : '1px solid transparent',
                    boxShadow: isActive ? '0 0 12px rgba(229, 46, 45, 0.35)' : 'none',
                  }}
                >
                  <Icon
                    className={`w-4.5 h-4.5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`}
                    style={{ color: isActive ? '#FFFFFF' : '#94A3B8' }}
                  />
                  {tab.id === 'errors' && errorCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 text-[8px] font-black px-1.5 py-0.2 rounded-full bg-[#E52E2D] text-white shadow-xs">
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
                      backgroundColor: '#E52E2D',
                      boxShadow: '0 0 8px #E52E2D',
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
