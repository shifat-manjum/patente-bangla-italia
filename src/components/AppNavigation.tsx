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
      sublabel: 'Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'curriculum' as AppTab,
      label: '240 Rounds',
      sublabel: 'Syllabus',
      icon: BookOpen,
      badge: '1-20 Free',
    },
    {
      id: 'theory' as AppTab,
      label: 'Theory Summaries',
      sublabel: '25 Chapters',
      icon: FileText,
      badge: 'Cheat Sheets',
    },
    {
      id: 'exam' as AppTab,
      label: 'Exam Simulation',
      sublabel: '30 Qs / 20 Min',
      icon: Clock,
      badge: 'Audio Mode',
    },
    {
      id: 'errors' as AppTab,
      label: 'Error Review',
      sublabel: 'Mistakes',
      icon: AlertCircle,
      badge: errorCount > 0 ? String(errorCount) : null,
      badgeColor: 'bg-rose-500 text-white',
    },
  ];

  return (
    <>
      {/* Desktop Top Tab Navigation Bar */}
      <nav className="hidden md:block bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-16 z-30 shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex space-x-1 lg:space-x-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span
                        className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                          tab.badgeColor || (isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300')
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
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
                  {tab.badge && (
                    <span
                      className={`absolute -top-1.5 -right-2.5 text-[9px] font-black px-1 rounded-full ${
                        tab.badgeColor || 'bg-blue-600 text-white'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] tracking-tight ${isActive ? 'font-black' : 'font-medium'}`}>
                  {tab.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 w-8 h-1 bg-blue-600 rounded-t-full"></span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
