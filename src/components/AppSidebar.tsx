import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Clock,
  FolderOpen,
  Percent,
  BarChart2,
  Sparkles,
  Zap,
  User,
  Moon,
  Sun,
  X,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Activity,
} from 'lucide-react';

interface AppSidebarProps {
  onOpenProfile: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  onOpenProfile,
  isDarkMode,
  setIsDarkMode,
}) => {
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    activeView,
    setActiveView,
    setIsAttendanceModalOpen,
    startZenMode,
    setIsAiDrawerOpen,
    overallAttendancePercentage,
    profile,
    bandwidth,
  } = useApp();

  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on Escape or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen, setIsSidebarOpen]);

  const isAttendanceSafe = overallAttendancePercentage >= 75;

  return (
    <>
      {/* 1. Left-Bottom Floating Sidebar Trigger Button (Exact structure & ARIA specs requested) */}
      <button
        type="button"
        id="planzo-bottom-sidebar-trigger"
        aria-controls="mobile-shell-sidebar-popover"
        aria-expanded={isSidebarOpen}
        aria-label="Open sidebar"
        data-sidebar-trigger=""
        data-icon-only=""
        data-variant="secondary"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed bottom-5 left-5 z-40 w-12 h-12 rounded-2xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-200 hover:text-teal-700 dark:hover:text-teal-400 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center group focus:outline-hidden focus:ring-2 focus:ring-teal-600/50"
        title="Open PlanZo Folders & Tools"
      >
        <span
          className="flex items-center justify-center transition-transform group-hover:scale-110"
          aria-hidden="true"
          data-button-icon=""
        >
          {/* Lightweight Shell Sidebar Toggle Icon */}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M9 3v18" />
            <path d="m14 9-3 3 3 3" />
          </svg>
        </span>

        {/* Live Status indicator */}
        <span
          className={`absolute top-2.5 right-2.5 w-2 h-2 rounded-full ${
            isAttendanceSafe ? 'bg-teal-500' : 'bg-rose-500'
          } animate-pulse`}
        />
      </button>

      {/* 2. Backdrop Blur Overlay when open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-stone-900/40 dark:bg-stone-950/60 backdrop-blur-xs transition-opacity animate-fadeIn"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 3. Popover / Sidebar Panel (Originating from Bottom-Left) */}
      {isSidebarOpen && (
        <div
          ref={popoverRef}
          id="mobile-shell-sidebar-popover"
          role="region"
          aria-label="Navigation sidebar"
          className="fixed bottom-20 left-5 z-50 w-80 sm:w-88 max-h-[85vh] bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col overflow-hidden animate-slideUp"
        >
          {/* Sidebar Top Header */}
          <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/70 dark:bg-stone-900/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-800 text-stone-100 flex items-center justify-center font-serif text-sm font-bold shadow-xs">
                P
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  PlanZo Navigation & Tools
                </h4>
                <p className="text-[10px] text-stone-500 font-mono">
                  {profile.name || 'Scholar'} · Sem {profile.semester}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
              title="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            
            {/* Section 1: The 5 Folders / Workspaces */}
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold">
                5 Academic Workspaces / Folders
              </div>

              {/* 1. Overview Hub */}
              <button
                onClick={() => {
                  setActiveView('home');
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-all ${
                  activeView === 'home'
                    ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-900 dark:text-teal-200 font-semibold'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 flex items-center justify-center">
                    <LayoutDashboard className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="leading-tight">1. Overview Hub</div>
                    <div className="text-[10px] text-stone-400">At-a-glance dashboard</div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {/* 2. Daily Routine & Schedule */}
              <button
                onClick={() => {
                  setActiveView('timeline');
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-all ${
                  activeView === 'timeline'
                    ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-900 dark:text-teal-200 font-semibold'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="leading-tight">2. Daily Routine & Schedule</div>
                    <div className="text-[10px] text-stone-400">Lectures & auto-calibration</div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {/* 3. Syllabus & Subject Vault */}
              <button
                onClick={() => {
                  setActiveView('academic');
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-all ${
                  activeView === 'academic'
                    ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-900 dark:text-teal-200 font-semibold'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-300 flex items-center justify-center">
                    <FolderOpen className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="leading-tight">3. Syllabus & Subject Vault</div>
                    <div className="text-[10px] text-stone-400">Notes, PYQs & viva questions</div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {/* 4. 75% Attendance Folder (Directly opens full subject breakdown) */}
              <button
                onClick={() => {
                  setIsSidebarOpen(false);
                  setIsAttendanceModalOpen(true);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
                    <Percent className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="leading-tight">4. 75% Attendance Folder</div>
                    <div className="text-[10px] text-stone-400">Subject-wise bunks & records</div>
                  </div>
                </div>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                    isAttendanceSafe
                      ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}
                >
                  {overallAttendancePercentage}%
                </span>
              </button>

              {/* 5. Pacing Insights & Reflection */}
              <button
                onClick={() => {
                  setActiveView('analytics');
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-all ${
                  activeView === 'analytics'
                    ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-900 dark:text-teal-200 font-semibold'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 flex items-center justify-center">
                    <BarChart2 className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="leading-tight">5. Insights & Reflection</div>
                    <div className="text-[10px] text-stone-400">Fatigue & daily energy pace</div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-stone-100 dark:border-stone-800" />

            {/* Section 2: One-Down-One Quick Launch Tools (Zener Mode, Senior Coach, Profile) */}
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold">
                Quick Tools & Modes
              </div>

              {/* One Down One: Zen Focus Mode */}
              <button
                onClick={() => {
                  setIsSidebarOpen(false);
                  startZenMode();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium bg-teal-800 text-stone-100 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600 transition-colors shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-teal-300" />
                  <div className="text-left">
                    <div className="font-semibold leading-tight">Zen Mode (Focus Timer)</div>
                    <div className="text-[10px] text-teal-200">Distraction-free sprint</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-900/60 text-teal-200">
                  Launch
                </span>
              </button>

              {/* One Down One: Senior Campus Mentor (AI Coach) */}
              <button
                onClick={() => {
                  setIsSidebarOpen(false);
                  setIsAiDrawerOpen(true);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-teal-50 dark:hover:bg-teal-950/50 hover:text-teal-900 dark:hover:text-teal-200 transition-colors border border-stone-200 dark:border-stone-800"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold leading-tight">Senior Campus Coach</div>
                    <div className="text-[10px] text-stone-400">Exam hacks, PYQs & viva tips</div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {/* Mental Bandwidth & Cognitive Load */}
              <button
                onClick={() => {
                  setIsSidebarOpen(false);
                  setActiveView('analytics');
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-colors border border-stone-200/80 dark:border-stone-800/80"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-stone-800 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold leading-tight flex items-center gap-1.5">
                      <span>Mental Bandwidth</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-stone-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300 capitalize font-medium">
                        {bandwidth.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-stone-400 truncate max-w-[170px]">
                      {bandwidth.densityScore}% density · {bandwidth.recommendation}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {/* One Down One: Student Profile Calibration */}
              <button
                onClick={() => {
                  setIsSidebarOpen(false);
                  onOpenProfile();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="leading-tight">Student Profile & Settings</div>
                    <div className="text-[10px] text-stone-400">College, branch & timings</div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={() => setIsDarkMode((prev) => !prev)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center">
                    {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </div>
                  <div className="text-left">
                    <div className="leading-tight">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</div>
                    <div className="text-[10px] text-stone-400">Adjust screen appearance</div>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-stone-400">
                  {isDarkMode ? 'Dark' : 'Light'}
                </span>
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
};
