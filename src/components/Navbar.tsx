import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sun,
  Moon,
  CalendarPlus,
  Sparkles,
  Clock,
  ShieldCheck,
  BarChart3,
  BookOpen,
  Menu,
  X,
  User,
  Sliders,
  LogIn,
  LogOut,
} from 'lucide-react';
import { ProfileAvatarModal } from './ProfileAvatarModal';
import { AuthModal } from './AuthModal';
import { ScheduleTaskModal } from './ScheduleTaskModal';

interface NavbarProps {
  onOpenOnboarding: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenOnboarding, isDarkMode, setIsDarkMode }) => {
  const {
    activeView,
    setActiveView,
    profile,
    currentUser,
    setIsPersonalizationWizardOpen,
    setIsAiDrawerOpen,
  } = useApp();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const toggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  };

  const navLinks = [
    { id: 'home', label: 'Today', icon: BarChart3 },
    { id: 'timeline', label: 'Calendar & Schedule', icon: Clock },
    { id: 'academic', label: 'Academic Vault', icon: BookOpen },
    { id: 'attendance', label: 'Attendance', icon: ShieldCheck },
    { id: 'analytics', label: 'Insights & Energy', icon: BarChart3 },
  ] as const;

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-stone-200/80 dark:border-stone-800 bg-white/95 dark:bg-[#0c1017]/95 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-15 gap-4">
            
            {/* Zone 1: Single Brand Element Wordmark with subtle academic context */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setActiveView('home');
                  setIsMobileNavOpen(false);
                }}
                className="flex items-center gap-2 cursor-pointer group text-left"
                title="Go to Today's Planner"
              >
                <div className="w-7 h-7 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 flex items-center justify-center font-bold text-xs tracking-tight shadow-2xs">
                  P
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-bold text-base text-stone-900 dark:text-stone-100 tracking-tight">
                    PlanZo
                  </span>
                  <span className="hidden sm:inline text-[11px] text-stone-400 font-mono">
                    · Sem {profile.semester}
                  </span>
                </div>
              </button>
            </div>

            {/* Zone 2: Primary Navigation Tabs (Center) - Clean text with active states */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              {navLinks.map((item) => {
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveView(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-850/60'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Zone 3: Right Actions (AI Senior, + Add Task, Profile / Account, Theme Toggle) */}
            <div className="flex items-center gap-2 shrink-0">
              
              {/* Campus Senior AI Assistant Trigger */}
              <button
                type="button"
                onClick={() => setIsAiDrawerOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-teal-500/30 bg-teal-50/70 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/50 text-xs font-semibold transition-colors cursor-pointer"
                title="Ask Campus Senior & AI Academic Guide"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span className="hidden lg:inline">Campus Senior</span>
              </button>

              {/* Primary Action: + Add Task */}
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-950 text-xs font-semibold transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
                title="Add new task or study block"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add Task</span>
              </button>

              {/* Profile & Account Button (Clean, Uncluttered Avatar & Name) */}
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-lg border border-stone-200/90 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-850 transition-colors cursor-pointer text-xs text-stone-700 dark:text-stone-300"
                title={`Logged in as ${profile.name || 'Scholar'} - Click to edit profile, college, or avatar`}
              >
                <div className="w-6 h-6 rounded-md overflow-hidden bg-stone-200 dark:bg-stone-800 shrink-0 border border-stone-300/60 dark:border-stone-700 flex items-center justify-center font-bold text-[11px]">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name || 'Student'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{profile.name ? profile.name.trim()[0].toUpperCase() : 'S'}</span>
                  )}
                </div>
                <span className="hidden lg:inline max-w-[100px] truncate font-medium">
                  {profile.name || 'Profile'}
                </span>
              </button>

              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-1.5 rounded-lg border border-stone-200/90 dark:border-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-850 transition-colors cursor-pointer"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>

              {/* Mobile Menu Hamburger */}
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                className="md:hidden p-1.5 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-850 transition-colors cursor-pointer"
                aria-label="Toggle Navigation"
              >
                {isMobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>

            </div>

          </div>

          {/* Mobile Navigation Drawer */}
          {isMobileNavOpen && (
            <div className="md:hidden py-3 border-t border-stone-200 dark:border-stone-800 space-y-1 animate-fadeIn">
              {navLinks.map((item) => {
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveView(item.id);
                      setIsMobileNavOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-850'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileNavOpen(false);
                    setIsAiDrawerOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-teal-800 dark:text-teal-300 bg-teal-50/60 dark:bg-teal-950/40 hover:bg-teal-100 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>Ask Campus Senior & AI Mentor</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileNavOpen(false);
                    setIsProfileModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-850 cursor-pointer"
                >
                  <User className="w-4 h-4 text-stone-500" />
                  <span>Edit Profile & College Affiliation</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileNavOpen(false);
                    setIsPersonalizationWizardOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-850 cursor-pointer"
                >
                  <Sliders className="w-4 h-4 text-stone-500" />
                  <span>Customize Routine & Electives</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileNavOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-850 cursor-pointer"
                >
                  {currentUser?.isAuthenticated ? (
                    <>
                      <LogOut className="w-4 h-4 text-stone-500" />
                      <span>Account ({currentUser.name})</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 text-stone-500" />
                      <span>Sign In / Create Account</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      </header>

      {/* Profile, Auth and Scheduling Modals */}
      <ProfileAvatarModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      <ScheduleTaskModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />
    </>
  );
};
