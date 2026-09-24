import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  FolderOpen,
  BarChart2,
  ShieldCheck,
  Sun,
  Moon,
  Wind,
  Clock,
  Percent,
} from 'lucide-react';

interface NavbarProps {
  onOpenOnboarding: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenOnboarding, isDarkMode, setIsDarkMode }) => {
  const {
    profile,
    activeView,
    setActiveView,
    bandwidth,
    startZenMode,
    setIsAiDrawerOpen,
    overallAttendancePercentage,
  } = useApp();

  const isAttendanceSafe = overallAttendancePercentage >= 75;

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-stone-50/95 backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/95 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Campus Context */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-800 text-stone-100 flex items-center justify-center font-serif text-lg font-bold shadow-xs">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-900 dark:text-stone-100 text-base tracking-tight">ScholarSync</span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-stone-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-mono">
                  B.Tech Sem {profile.semester}
                </span>
              </div>
              <button
                onClick={onOpenOnboarding}
                className="text-xs text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 transition-colors flex items-center gap-1 text-left truncate max-w-[190px] sm:max-w-xs"
                title="Change college, branch or habits"
              >
                <span>{profile.college.split(' ')[0]}</span>
                <span>·</span>
                <span className="truncate">{profile.branch.split('(')[0]}</span>
              </button>
            </div>
          </div>

          {/* Center Navigation Tabs (Segmented Control) */}
          <nav className="hidden lg:flex items-center p-1 bg-stone-200/60 dark:bg-stone-800/80 rounded-xl text-xs">
            <button
              onClick={() => setActiveView('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeView === 'timeline'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Daily Flow</span>
            </button>

            <button
              onClick={() => setActiveView('academic')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeView === 'academic'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Subject Folders</span>
            </button>

            {/* 75% Attendance Tab with Live Percentage Badge */}
            <button
              onClick={() => setActiveView('attendance')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeView === 'attendance'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Percent className="w-3.5 h-3.5" />
              <span>75% Attendance</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                isAttendanceSafe
                  ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
              }`}>
                {overallAttendancePercentage}%
              </span>
            </button>

            <button
              onClick={() => setActiveView('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeView === 'analytics'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Insights & Reflection</span>
            </button>
          </nav>

          {/* Right Action Tools: Zen Mode, Campus Senior Coach & Theme */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Quick 75% status badge on mobile */}
            <button
              onClick={() => setActiveView('attendance')}
              className={`flex lg:hidden items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${
                isAttendanceSafe
                  ? 'border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-300'
                  : 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300'
              }`}
              title="Open 75% Attendance Tracker"
            >
              <span>{overallAttendancePercentage}%</span>
            </button>

            {/* Zen Mode Button */}
            <button
              onClick={() => startZenMode()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 transition-all shadow-xs"
              title="Open distraction-free Zen focus screen"
            >
              <Wind className="w-3.5 h-3.5 text-teal-400 dark:text-teal-600" />
              <span className="hidden sm:inline">Zen Mode</span>
            </button>

            {/* Campus Senior Coach Drawer */}
            <button
              onClick={() => setIsAiDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-teal-700/30 text-teal-800 dark:text-teal-300 bg-teal-50/70 dark:bg-teal-950/40 hover:bg-teal-100 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span className="hidden sm:inline">Senior Coach</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Row (4 items) */}
        <div className="grid grid-cols-4 lg:hidden py-2 border-t border-stone-200 dark:border-stone-800 text-center text-xs font-medium">
          <button
            onClick={() => setActiveView('timeline')}
            className={`py-1 ${activeView === 'timeline' ? 'font-bold text-teal-800 dark:text-teal-400' : 'text-stone-500'}`}
          >
            Daily Flow
          </button>
          <button
            onClick={() => setActiveView('academic')}
            className={`py-1 ${activeView === 'academic' ? 'font-bold text-teal-800 dark:text-teal-400' : 'text-stone-500'}`}
          >
            Folders
          </button>
          <button
            onClick={() => setActiveView('attendance')}
            className={`py-1 ${activeView === 'attendance' ? 'font-bold text-teal-800 dark:text-teal-400' : 'text-stone-500'}`}
          >
            Attendance
          </button>
          <button
            onClick={() => setActiveView('analytics')}
            className={`py-1 ${activeView === 'analytics' ? 'font-bold text-teal-800 dark:text-teal-400' : 'text-stone-500'}`}
          >
            Reflect
          </button>
        </div>

      </div>
    </header>
  );
};
