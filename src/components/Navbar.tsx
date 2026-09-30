import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sun,
  Moon,
  CalendarPlus,
  Sliders,
  LogOut,
  User,
  GraduationCap,
  BookOpen,
  Calendar,
  Clock,
  ShieldCheck,
  BarChart3,
  Menu,
  X,
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
    signOut,
    setIsPersonalizationWizardOpen,
    userStreak,
    overallAttendancePercentage,
  } = useApp();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
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
    { id: 'home', label: 'Overview', icon: BarChart3 },
    { id: 'timeline', label: 'Timetable', icon: Clock },
    { id: 'academic', label: 'Courses & Syllabus', icon: BookOpen },
    { id: 'attendance', label: 'Attendance', icon: ShieldCheck },
  ] as const;

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-stone-200/90 dark:border-stone-800 bg-white/95 dark:bg-[#0c1017]/95 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-15 gap-4">
            
            {/* Zone 1: Clean Wordmark Brand */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  setActiveView('home');
                  setIsMobileNavOpen(false);
                }}
                className="flex items-center gap-2 text-left cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
                  P
                </div>
                <div>
                  <div className="text-base font-bold tracking-tight text-stone-900 dark:text-stone-100 leading-none">
                    PlanZo
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 leading-tight mt-0.5">
                    SATI Vidisha · CSE
                  </div>
                </div>
              </button>
            </div>

            {/* Zone 2: Clean Navigation Links (Center) */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              {navLinks.map((item) => {
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Zone 3: Primary Actions (Right) */}
            <div className="flex items-center gap-2 shrink-0">
              
              {/* Personalize SATI Routine */}
              <button
                onClick={() => setIsPersonalizationWizardOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 bg-white dark:bg-stone-850 text-stone-700 dark:text-stone-300 text-xs font-medium transition-colors cursor-pointer"
                title="Change Semester, Electives, or Routine Hours"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Customize Plan</span>
              </button>

              {/* + Schedule Task */}
              <button
                onClick={() => setIsScheduleModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-950 text-xs font-semibold transition-colors shadow-xs cursor-pointer"
                title="Add task or study block"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Add Task</span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* User Profile Pill / Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-lg border border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 bg-stone-50 dark:bg-stone-850 transition-colors cursor-pointer text-left"
                >
                  <div className="w-6 h-6 rounded-md bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900 flex items-center justify-center font-bold text-xs">
                    {profile.name ? profile.name.trim()[0].toUpperCase() : 'S'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-semibold text-stone-900 dark:text-stone-100 leading-none truncate max-w-[100px]">
                      {profile.name || 'Scholar'}
                    </div>
                    <div className="text-[10px] text-stone-500 dark:text-stone-400 leading-tight">
                      Sem {profile.semester}
                    </div>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-1.5 shadow-lg space-y-1 text-xs z-50 animate-fadeIn"
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-stone-100 dark:border-stone-800">
                      <div className="font-semibold text-stone-900 dark:text-stone-100">
                        {profile.name || 'Student'}
                      </div>
                      <div className="text-[11px] text-stone-500 font-mono truncate">
                        {profile.rollNo || currentUser?.email || '0108CS211045'}
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        Semester {profile.semester} · B.Tech CSE
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsProfileModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-left transition-colors cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Edit Student Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsPersonalizationWizardOpen(true);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-left transition-colors cursor-pointer"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Configure Electives & Hours</span>
                    </button>

                    <div className="border-t border-stone-100 dark:border-stone-800 my-1" />

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left transition-colors cursor-pointer font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                className="md:hidden p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                aria-label="Toggle Navigation"
              >
                {isMobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>

            </div>

          </div>

          {/* Mobile Navigation Drawer */}
          {isMobileNavOpen && (
            <div className="md:hidden py-3 border-t border-stone-200 dark:border-stone-800 space-y-1">
              {navLinks.map((item) => {
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
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
              <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
                <button
                  onClick={() => {
                    setIsMobileNavOpen(false);
                    setIsPersonalizationWizardOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-850"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Customize Plan & Electives</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </header>

      {/* Profile and Scheduling Modals */}
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
