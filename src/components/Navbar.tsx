import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sun,
  Moon,
  Pencil,
  Menu,
} from 'lucide-react';

interface NavbarProps {
  onOpenOnboarding: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenOnboarding, isDarkMode, setIsDarkMode }) => {
  const {
    profile,
    setIsSidebarOpen,
  } = useApp();

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-stone-50/95 backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/95 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Brand & Student Context (Clean, minimal, click to edit) */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenOnboarding}
              className="w-9 h-9 rounded-xl bg-teal-800 hover:bg-teal-700 text-stone-100 flex items-center justify-center font-serif text-base font-bold shadow-xs transition-transform active:scale-95"
              title="Click to edit profile"
            >
              {profile.name ? profile.name.trim()[0].toUpperCase() : 'P'}
            </button>
            <div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenOnboarding}
                  className="font-bold text-stone-900 dark:text-stone-100 text-base tracking-tight hover:text-teal-700 dark:hover:text-teal-400 transition-colors flex items-center gap-1.5 text-left"
                  title="Click to edit profile"
                >
                  <span className="truncate max-w-[130px] sm:max-w-[200px]">
                    {profile.name ? `${profile.name}` : 'PlanZo'}
                  </span>
                  <Pencil className="w-3 h-3 text-stone-400 hover:text-teal-600 shrink-0" />
                </button>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-stone-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-mono shrink-0">
                  Sem {profile.semester}
                </span>
              </div>
              <button
                onClick={onOpenOnboarding}
                className="text-xs text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 transition-colors flex items-center gap-1 text-left truncate max-w-[130px] sm:max-w-md"
                title="Change university, branch, or sleep hours"
              >
                <span className="font-semibold text-teal-800 dark:text-teal-300 truncate">
                  {profile.college === 'OTHERS' && profile.customCollege ? profile.customCollege : profile.college}
                </span>
                <span>·</span>
                <span className="truncate">{profile.branch}</span>
              </button>
            </div>
          </div>

          {/* Right: Workspaces Drawer Trigger & Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Quick Open Workspaces / Folders Menu trigger */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/80 transition-colors"
              title="Open 5 Academic Folders & Tools"
            >
              <Menu className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
              <span>Workspaces</span>
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
      </div>
    </header>
  );
};
