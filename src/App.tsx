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
import { StudentAiChatbotModal } from './components/StudentAiChatbotModal';
import { ArrowLeft, Bot, Sparkles } from 'lucide-react';

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
  const [isAiChatbotOpen, setIsAiChatbotOpen] = useState(false);
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

  // GATEWAY AUTHENTICATION CHECK:
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

      {/* Main Content Viewport */}
      <main className="max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 overflow-x-hidden">
        
        {/* If user navigated inside a specific feature, show back link */}
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
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800 dark:text-stone-200">PlanZo</span>
            <span>·</span>
            <span className="text-teal-700 dark:text-teal-400 font-medium">
              For the student, by the student, to the student
            </span>
          </div>
          <div className="text-[11px] font-mono">
            {profile.customCollege || profile.college || 'Engineering College'} · B.Tech Academic Command Center
          </div>
        </div>
      </footer>

      {/* Floating Sarthi AI Assistant Trigger (Bottom Right) */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setIsAiChatbotOpen(true)}
          className="pop-hover-btn group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-lime-600 via-emerald-600 to-teal-700 hover:from-lime-500 hover:via-emerald-500 hover:to-teal-600 text-white shadow-xl shadow-lime-500/30 border border-lime-400/50 glow-parrot hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Open Sarthi AI Copilot"
        >
          <div className="relative">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-lime-300 border-2 border-teal-900 animate-pulse" />
          </div>
          <span className="text-xs font-bold tracking-tight">Sarthi AI</span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-md text-[10px] bg-black/25 text-lime-200 border border-lime-300/40 font-bold uppercase tracking-wider">
            Copilot
          </span>
        </button>
      </div>

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
      <StudentAiChatbotModal
        isOpen={isAiChatbotOpen}
        onClose={() => setIsAiChatbotOpen(false)}
      />
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
