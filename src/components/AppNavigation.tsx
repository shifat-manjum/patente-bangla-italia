import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

export type AppTab = 'dashboard' | 'curriculum' | 'theory' | 'exam' | 'errors';

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
      icon: LayoutDashboard,
      badge: null,
      badgeColor: '',
    },
    {
      id: 'curriculum' as AppTab,
      label: '240 Rounds',
      icon: BookOpen,
      badge: '1–20 Free',
      badgeColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20',
    },
    {
      id: 'theory' as AppTab,
      label: 'Theory Summaries',
      icon: FileText,
      badge: '25 Chapters',
      badgeColor: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20',
    },
    {
      id: 'exam' as AppTab,
      label: 'Exam Simulation',
      icon: Clock,
      badge: '30 Qs Official',
      badgeColor: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20',
    },
    {
      id: 'errors' as AppTab,
      label: 'Error Review',
      icon: AlertCircle,
      badge: errorCount > 0 ? (errorCount === 1 ? '1 Error' : `${errorCount} Errors`) : null,
      badgeColor: 'bg-rose-500 text-white shadow-xs',
    },
  ];

  return (
    <>
      {/* Desktop Top Tab Navigation Bar */}
      <nav className="hidden md:block bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 sticky top-16 z-30 shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Dynamic Segmented Navigation Tabs */}
            <div className="flex items-center gap-1.5 lg:gap-2.5 overflow-x-auto no-scrollbar py-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`group relative flex items-center gap-2.5 px-4 lg:px-4.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold tracking-tight whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-500/30'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                        isActive
                          ? 'text-white scale-110'
                          : 'text-slate-400 dark:text-slate-500 group-hover:text-blue-500'
                      }`}
                    />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full transition-colors shrink-0 ${
                          isActive
                            ? 'bg-white/20 text-white border border-white/30 backdrop-blur-xs'
                            : tab.badgeColor || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Status Pill (Gracefully hidden on narrower screens to prevent crowding) */}
            <div className="hidden xl:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Official 2026 Ministerial Syllabus</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-lg safe-bottom">
        <div className="grid grid-cols-5 h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center gap-0.5 relative transition-colors cursor-pointer ${
                  isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  {tab.id === 'errors' && errorCount > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 text-[9px] font-black px-1.5 py-0.2 rounded-full bg-rose-500 text-white shadow-xs">
                      {errorCount > 99 ? '99+' : errorCount}
                    </span>
                  )}
                  {tab.id === 'curriculum' && !isActive && (
                    <span className="absolute -top-1.5 -right-2 text-[8px] font-black px-1 py-0.2 rounded-full bg-emerald-500 text-white">
                      Free
                    </span>
                  )}
                </div>
                <span className={`text-[10px] tracking-tight whitespace-nowrap ${isActive ? 'font-black' : 'font-medium'}`}>
                  {tab.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 w-8 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-full"></span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
