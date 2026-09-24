import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { MentalBandwidthMeter } from './components/MentalBandwidthMeter';
import { FocusGarden } from './components/FocusGarden';
import { DailyTimeline } from './components/DailyTimeline';
import { AcademicHub } from './components/AcademicHub';
import { AttendanceTracker } from './components/AttendanceTracker';
import { AnalyticsView } from './components/AnalyticsView';
import { ZenModeModal } from './components/ZenModeModal';
import { AiCoachDrawer } from './components/AiCoachDrawer';
import { OnboardingModal } from './components/OnboardingModal';
import { ResourceModal } from './components/ResourceModal';
import { Sparkles, Calendar, Coffee, Heart } from 'lucide-react';

const ScholarSyncMain: React.FC = () => {
  const { activeView, profile } = useApp();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark class to html document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Today's formatted date
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  return (
    <div className="min-h-screen bg-stone-100/60 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans transition-colors selection:bg-teal-500/20">
      
      {/* Top Navigation */}
      <Navbar
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      {/* Main Content Viewport (Desktop 1440px baseline) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Daily Date & Mindful Anchor */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-stone-200/80 dark:border-stone-800/80 pb-3">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-teal-700 dark:text-teal-400">
              {todayFormatted}
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight">
              Calm Academic Companion
            </h1>
          </div>
          <div className="text-xs text-stone-500 dark:text-stone-400">
            {profile.branch.split('(')[0]} · Semester {profile.semester}
          </div>
        </div>

        {/* Cognitive Load Top Grid: Bandwidth Meter & Focus Garden */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <MentalBandwidthMeter />
          <FocusGarden />
        </div>

        {/* Dynamic Main View Switcher */}
        <div className="pt-2">
          {activeView === 'timeline' && <DailyTimeline />}
          {activeView === 'academic' && <AcademicHub />}
          {activeView === 'attendance' && <AttendanceTracker />}
          {activeView === 'analytics' && <AnalyticsView />}
        </div>

      </main>

      {/* Quiet Footer */}
      <footer className="mt-16 border-t border-stone-200 dark:border-stone-800/80 py-8 bg-white/40 dark:bg-stone-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800 dark:text-stone-200">ScholarSync</span>
            <span>·</span>
            <span>Intelligent B.Tech Academic Planning & Dynamic Auto-Correction</span>
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Designed for cognitive calm & guilt-free consistency</span>
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
