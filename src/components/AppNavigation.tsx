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
      {/* Desktop Top Tab Navigation Bar (Car Cockpit Ambient Style - 25% Taller Buttons) */}
      <nav className="hidden md:block bg-slate-950/85 dark:bg-black/90 backdrop-blur-xl border-b border-slate-800/80 sticky top-[80px] sm:top-[88px] z-30 shadow-xl transition-colors">
        <div className="max-w-[1600px] mx-auto px-[15px] py-3.5 sm:py-4">
          <div className="flex items-center justify-center gap-3.5 lg:gap-4.5 overflow-x-auto no-scrollbar py-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  style={{
                    boxShadow: isActive
                      ? `0 0 25px ${tab.glowColor}, inset 0 0 12px ${tab.neonColor}25`
                      : `0 0 15px ${tab.glowColor}`,
                  }}
                  className={`group relative p-[2px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 shrink-0 transform hover:-translate-y-0.5 ${
                    isActive ? 'scale-[1.02]' : 'hover:scale-[1.01]'
                  }`}
                >
                  {/* Moving Neon Light Line Around Border (Like Modern Car Ambient Cockpit Lighting) */}
                  <span
                    className="absolute inset-[-250%] animate-ambient-beam pointer-events-none"
                    style={{
                      background: `conic-gradient(from 0deg, transparent 0%, transparent 68%, ${tab.neonColor} 84%, #ffffff 94%, ${tab.neonColor} 100%)`,
                    }}
                  />

                  {/* Inner Button Body (+25% Height: py-3.5 sm:py-4 with min-h-[62px] lg:min-h-[66px]) */}
                  <div
                    className={`relative z-10 w-full h-full rounded-[14px] px-4.5 py-3.5 sm:px-5 sm:py-4 min-h-[62px] lg:min-h-[66px] flex items-center gap-3.5 transition-all ${
                      isActive
                        ? 'bg-slate-900/95 dark:bg-black/95 text-white'
                        : 'bg-slate-950/90 hover:bg-slate-900/90 dark:bg-black/90 text-white'
                    }`}
                  >
                    {/* Glowing Illuminated Icon (Slightly larger for proportional height) */}
                    <div
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
                      style={{
                        backgroundColor: `${tab.neonColor}18`,
                        border: `1px solid ${tab.neonColor}50`,
                        boxShadow: `0 0 12px ${tab.neonColor}40`,
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: tab.neonColor }} />
                    </div>

                    {/* Dual-Tier Text: Prominent Title + Matching Neon Subtext */}
                    <div className="text-left flex flex-col justify-center">
                      <span className="text-sm sm:text-base font-black text-white tracking-tight whitespace-nowrap drop-shadow-xs">
                        {tab.label}
                      </span>
                      <span
                        className="text-[10px] sm:text-[11px] font-black tracking-wider uppercase whitespace-nowrap block mt-0.5"
                        style={{ color: tab.neonColor }}
                      >
                        {tab.subtext}
                      </span>
                    </div>

                    {/* Active Bottom Glow Line Indicator */}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-4 right-4 h-0.5 sm:h-1 rounded-full"
                        style={{
                          backgroundColor: tab.neonColor,
                          boxShadow: `0 0 14px ${tab.neonColor}`,
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

      {/* Mobile Bottom Navigation Bar (Modern Ambient Cockpit Style - Scaled Height) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 dark:bg-black/95 backdrop-blur-xl border-t border-slate-800 shadow-2xl safe-bottom">
        <div className="grid grid-cols-5 h-[70px]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="flex flex-col items-center justify-center gap-1 relative transition-colors cursor-pointer"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center relative transition-transform"
                  style={{
                    backgroundColor: isActive ? `${tab.neonColor}25` : 'transparent',
                    boxShadow: isActive ? `0 0 14px ${tab.neonColor}50` : 'none',
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
                  className="text-[9.5px] tracking-tight whitespace-nowrap truncate max-w-[64px]"
                  style={{
                    color: isActive ? '#FFFFFF' : '#94A3B8',
                    fontWeight: isActive ? 800 : 500,
                  }}
                >
                  {tab.id === 'exam' ? 'Exam Sim' : tab.label}
                </span>
                {isActive && (
                  <span
                    className="absolute bottom-0 w-8 h-1 rounded-t-full"
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
