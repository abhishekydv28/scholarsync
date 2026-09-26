import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HomeOverview } from './components/HomeOverview';
import { DailyTimeline } from './components/DailyTimeline';
import { AcademicHub } from './components/AcademicHub';
import { AttendanceTracker } from './components/AttendanceTracker';
import { AnalyticsView } from './components/AnalyticsView';
import { ZenModeModal } from './components/ZenModeModal';
import { AiCoachDrawer } from './components/AiCoachDrawer';
import { OnboardingModal } from './components/OnboardingModal';
import { ResourceModal } from './components/ResourceModal';
import { SubjectAttendanceFolderModal } from './components/SubjectAttendanceFolderModal';
import { AppSidebar } from './components/AppSidebar';
import { ArrowLeft } from 'lucide-react';

const ScholarSyncMain: React.FC = () => {
  const { activeView, setActiveView, profile } = useApp();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('planzo_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark class to html document and body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('planzo_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('planzo_theme', 'light');
    }
  }, [isDarkMode]);

  // Today's formatted date
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  return (
    <div className={`${isDarkMode ? 'dark' : ''} min-h-screen w-full max-w-full overflow-x-hidden bg-stone-100/70 dark:bg-[#0b0f17] text-stone-900 dark:text-stone-100 font-sans transition-colors selection:bg-teal-500/20`}>
      
      {/* Top Navigation */}
      <Navbar
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      {/* Main Content Viewport (Desktop 1440px baseline) */}
      <main className="max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 overflow-x-hidden">
        
        {/* If user navigated inside a specific feature, show a clean, non-intrusive back link */}
        {activeView !== 'home' && (
          <div className="flex items-center justify-between pb-2 border-b border-stone-200/80 dark:border-stone-800/80">
            <button
              onClick={() => setActiveView('home')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Overview</span>
            </button>
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400">
              PlanZo / {activeView === 'timeline' ? 'Daily Routine' : activeView === 'academic' ? 'Subject Vault' : activeView === 'attendance' ? '75% Attendance' : 'Insights & Analytics'}
            </span>
          </div>
        )}

        {/* Dynamic Main View Switcher */}
        <div>
          {activeView === 'home' && <HomeOverview />}
          {activeView === 'timeline' && <DailyTimeline />}
          {activeView === 'academic' && <AcademicHub />}
          {activeView === 'attendance' && <AttendanceTracker />}
          {activeView === 'analytics' && <AnalyticsView />}
        </div>

      </main>

      {/* Quiet Footer */}
      <footer className="mt-16 border-t border-stone-200/80 dark:border-stone-800/80 py-8 bg-white/40 dark:bg-stone-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800 dark:text-stone-200">ScholarSync</span>
            <span>·</span>
            <span>Intelligent B.Tech Academic Planning & Dynamic Auto-Correction</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono">
            <span>Built for B.Tech engineers · Consistency without burnout</span>
          </div>
        </div>
      </footer>

      {/* Floating Modals and Drawers */}
      <ZenModeModal />
      <AiCoachDrawer />
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
      <ResourceModal />
      <SubjectAttendanceFolderModal />

      {/* Floating Left-Bottom Sidebar Button & Popover */}
      <AppSidebar
        onOpenProfile={() => setIsOnboardingOpen(true)}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <ScholarSyncMain />
    </AppProvider>
  );
}
