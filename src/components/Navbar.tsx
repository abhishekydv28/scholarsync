import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sun,
  Moon,
  CalendarPlus,
  Sliders,
  Pencil,
  LogIn,
  UserCheck,
  User,
  Clock,
  ShieldCheck,
  BarChart3,
  BookOpen,
  Menu,
  X,
  Camera,
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
    { id: 'home', label: 'Overview', icon: BarChart3 },
    { id: 'timeline', label: 'Timetable', icon: Clock },
    { id: 'academic', label: 'Courses & Syllabus', icon: BookOpen },
    { id: 'attendance', label: 'Attendance', icon: ShieldCheck },
  ] as const;

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-stone-200/90 dark:border-stone-800 bg-white/95 dark:bg-[#0c1017]/95 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            
            {/* Zone 1: Brand & Student Profile Context (Avatar, Name, Semester, Edit Button) */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Brand Logo & Wordmark */}
              <button
                onClick={() => {
                  setActiveView('home');
                  setIsMobileNavOpen(false);
                }}
                className="flex items-center gap-2 cursor-pointer shrink-0 group text-left"
                title="Go to Overview"
              >
                <div className="w-8 h-8 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
                  P
                </div>
                <div className="hidden sm:block">
                  <span className="font-bold text-base text-stone-900 dark:text-stone-100 tracking-tight">
                    PlanZo
                  </span>
                </div>
              </button>

              {/* Vertical Hairline Divider */}
              <div className="hidden sm:block w-px h-6 bg-stone-200 dark:border-stone-800 shrink-0" />

              {/* Student Profile Bar: Avatar + Name + Pencil + Semester */}
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                {/* Avatar Photo Button (Opens ProfileAvatarModal) */}
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(true)}
                  className="relative group w-9 h-9 rounded-xl overflow-hidden border border-stone-300 dark:border-stone-700 hover:border-stone-900 dark:hover:border-stone-100 transition-all active:scale-95 shrink-0 shadow-xs cursor-pointer bg-stone-100 dark:bg-stone-800"
                  title="Click to change profile picture or student avatar"
                >
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name || 'Scholar'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900 flex items-center justify-center font-bold text-sm font-mono">
                      {profile.name ? profile.name.trim()[0].toUpperCase() : 'S'}
                    </div>
                  )}

                  {/* Camera icon hover overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                    <Camera className="w-3.5 h-3.5" />
                  </div>

                  <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-white dark:border-[#0c1017]" />
                </button>

                {/* Student Info: Name, Pencil Edit Icon, Semester Badge */}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsProfileModalOpen(true)}
                      className="font-bold text-stone-900 dark:text-stone-100 text-xs sm:text-sm tracking-tight hover:underline flex items-center gap-1 text-left truncate cursor-pointer"
                      title="Click to edit student profile"
                    >
                      <span className="truncate max-w-[100px] xs:max-w-[140px] sm:max-w-[180px]">
                        {profile.name || 'Scholar'}
                      </span>
                      <Pencil className="w-3 h-3 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 shrink-0" />
                    </button>

                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200/80 dark:border-stone-750 shrink-0">
                      Sem {profile.semester}
                    </span>
                  </div>

                  {/* University & Branch Subtitle */}
                  <button
                    type="button"
                    onClick={onOpenOnboarding}
                    className="text-[11px] text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 transition-colors flex items-center gap-1 text-left truncate max-w-[120px] xs:max-w-[160px] sm:max-w-xs cursor-pointer"
                    title="Click to change university, branch, or routine hours"
                  >
                    <span className="font-semibold text-stone-700 dark:text-stone-300 truncate">
                      {profile.college === 'OTHERS' && profile.customCollege ? profile.customCollege : 'SATI Vidisha'}
                    </span>
                    <span>·</span>
                    <span className="truncate">CSE</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Zone 2: Primary Navigation Tabs (Center) */}
            <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
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

            {/* Zone 3: Right Actions (Customize Plan, + Add Task, Login / Account Button, Theme) */}
            <div className="flex items-center gap-2 shrink-0">
              
              {/* Customize Plan Button */}
              <button
                type="button"
                onClick={() => setIsPersonalizationWizardOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 bg-white dark:bg-stone-850 text-stone-700 dark:text-stone-300 text-xs font-medium transition-colors cursor-pointer"
                title="Change Semester, Electives, or Routine Hours"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Customize Plan</span>
              </button>

              {/* + Schedule Task */}
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-950 text-xs font-semibold transition-colors shadow-xs cursor-pointer"
                title="Add task or study block"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add Task</span>
              </button>

              {/* LOGIN / ACCOUNT BUTTON (PROMINENT & DIRECT) */}
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                  currentUser?.isAuthenticated
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-500/20'
                    : 'border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
                title={currentUser?.isAuthenticated ? `Logged in as ${currentUser.name} (${currentUser.email})` : 'Sign In or Create Account'}
              >
                {currentUser?.isAuthenticated ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="max-w-[90px] truncate">
                      {currentUser.name ? currentUser.name.split(' ')[0] : 'Account'}
                    </span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-3.5 h-3.5 shrink-0" />
                    <span>Sign In</span>
                  </>
                )}
              </button>

              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Mobile Menu Hamburger */}
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                className="lg:hidden p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                aria-label="Toggle Navigation"
              >
                {isMobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>

            </div>

          </div>

          {/* Mobile Navigation Drawer */}
          {isMobileNavOpen && (
            <div className="lg:hidden py-3 border-t border-stone-200 dark:border-stone-800 space-y-1 animate-fadeIn">
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
                    setIsProfileModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-850 cursor-pointer"
                >
                  <Pencil className="w-4 h-4" />
                  <span>Edit Profile & Avatar</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileNavOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-850 cursor-pointer"
                >
                  {currentUser?.isAuthenticated ? (
                    <>
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      <span>Account ({currentUser.name})</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Sign In / Login</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileNavOpen(false);
                    setIsPersonalizationWizardOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-850 cursor-pointer"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Customize Plan & Electives</span>
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
