import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HomeOverview } from './components/HomeOverview';
import { DailyTimeline } from './components/DailyTimeline';
import { AcademicHub } from './components/AcademicHub';
import { AttendanceTracker } from './components/AttendanceTracker';
import { AnalyticsView } from './components/AnalyticsView';
import { ZenModeModal } from './components/ZenModeModal';
import { OnboardingModal } from './components/OnboardingModal';
import { ResourceModal } from './components/ResourceModal';
import { SubjectAttendanceFolderModal } from './components/SubjectAttendanceFolderModal';
import { AuthGatewayScreen } from './components/AuthGatewayScreen';
import { PersonalizationSetupWizard } from './components/PersonalizationSetupWizard';
import { AiCampusMentorDrawer } from './components/AiCampusMentorDrawer';
import { ArrowLeft } from 'lucide-react';

const PlanZoMain: React.FC = () => {
  const {
    activeView,
    setActiveView,
    profile,
    currentUser,
    isPersonalizationWizardOpen,
    setIsPersonalizationWizardOpen,
  } = useApp();
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

  // GATEWAY AUTHENTICATION CHECK:
  // For new users who haven't logged in, display the Login / Sign Up gateway by default!
  // For existing users with an active session, opens directly to their dashboard.
  if (!currentUser || !currentUser.isAuthenticated) {
    return (
      <div className={`${isDarkMode ? 'dark' : ''} min-h-screen w-full max-w-full overflow-x-hidden bg-stone-100/70 dark:bg-[#070b12] text-stone-900 dark:text-stone-100 font-sans transition-colors`}>
        <AuthGatewayScreen isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      </div>
    );
  }

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

      {/* Clean Academic Footer with Tagline */}
      <footer className="mt-16 border-t border-stone-200/80 dark:border-stone-800 py-6 bg-white/40 dark:bg-stone-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500 dark:text-stone-400">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <span className="font-semibold text-stone-800 dark:text-stone-200">PlanZo</span>
            <span className="hidden sm:inline">·</span>
            <span className="font-medium text-stone-700 dark:text-stone-300 italic">
              "For the student, by the student, to the student"
            </span>
          </div>
          <div className="text-[11px] font-mono text-center sm:text-right text-stone-400">
            {profile.customCollege || profile.college || 'Engineering College'} Academic Workspace
          </div>
        </div>
      </footer>

      {/* Functional Modals */}
      <ZenModeModal />
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
      <ResourceModal />
      <SubjectAttendanceFolderModal />
      <PersonalizationSetupWizard
        isOpen={isPersonalizationWizardOpen}
        onClose={() => setIsPersonalizationWizardOpen(false)}
      />
      <AiCampusMentorDrawer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <PlanZoMain />
    </AppProvider>
  );
}
