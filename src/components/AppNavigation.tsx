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
      {/* Desktop Top Tab Navigation Bar (Car Cockpit Ambient Style) */}
      <nav className="hidden md:block bg-slate-950/85 dark:bg-black/90 backdrop-blur-xl border-b border-slate-800/80 sticky top-16 z-30 shadow-xl transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-center gap-3 lg:gap-4 overflow-x-auto no-scrollbar py-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  style={{
                    boxShadow: isActive
                      ? `0 0 25px ${tab.glowColor}, inset 0 0 12px ${tab.neonColor}20`
                      : `0 0 15px ${tab.glowColor}`,
                  }}
                  className={`group relative p-[1.8px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 shrink-0 transform hover:-translate-y-0.5 ${
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

                  {/* Inner Button Body (Cockpit Dashboard Slate with High Contrast Text) */}
                  <div
                    className={`relative z-10 w-full h-full rounded-[14.5px] px-4 py-2.5 lg:px-5 lg:py-2.5 flex items-center gap-3 transition-all ${
                      isActive
                        ? 'bg-slate-900/95 dark:bg-black/95 text-white'
                        : 'bg-slate-950/90 hover:bg-slate-900/90 dark:bg-black/90 text-white'
                    }`}
                  >
                    {/* Glowing Illuminated Icon */}
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
                      style={{
                        backgroundColor: `${tab.neonColor}18`,
                        border: `1px solid ${tab.neonColor}50`,
                        boxShadow: `0 0 10px ${tab.neonColor}40`,
                      }}
                    >
                      <Icon className="w-4 h-4" style={{ color: tab.neonColor }} />
                    </div>

                    {/* Dual-Tier Text: Clean Title + Matching Neon Subtext */}
                    <div className="text-left flex flex-col justify-center">
                      <span className="text-xs lg:text-sm font-black text-white tracking-tight whitespace-nowrap drop-shadow-xs">
                        {tab.label}
                      </span>
                      <span
                        className="text-[9.5px] lg:text-[10px] font-black tracking-wider uppercase whitespace-nowrap block"
                        style={{ color: tab.neonColor }}
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
                          boxShadow: `0 0 12px ${tab.neonColor}`,
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

      {/* Mobile Bottom Navigation Bar (Modern Ambient Cockpit Style) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 dark:bg-black/95 backdrop-blur-xl border-t border-slate-800 shadow-2xl safe-bottom">
        <div className="grid grid-cols-5 h-16">
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
                  className="w-7 h-7 rounded-lg flex items-center justify-center relative transition-transform"
                  style={{
                    backgroundColor: isActive ? `${tab.neonColor}25` : 'transparent',
                    boxShadow: isActive ? `0 0 14px ${tab.neonColor}50` : 'none',
                  }}
                >
                  <Icon
                    className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`}
                    style={{ color: isActive ? tab.neonColor : '#94A3B8' }}
                  />
                  {tab.id === 'errors' && errorCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 text-[8px] font-black px-1.5 py-0.2 rounded-full bg-rose-500 text-white shadow-xs">
                      {errorCount > 99 ? '99+' : errorCount}
                    </span>
                  )}
                </div>
                <span
                  className="text-[9px] tracking-tight whitespace-nowrap truncate max-w-[62px]"
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
