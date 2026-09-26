import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sun,
  Moon,
  Pencil,
  Menu,
  Flame,
  Headphones,
  Sparkles,
  Camera,
} from 'lucide-react';
import { getAmbientStatus } from '../utils/audioSynth';
import { FocusAudioModal } from './FocusAudioModal';
import { StreakModal } from './StreakModal';
import { ProfileAvatarModal } from './ProfileAvatarModal';

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

  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const ambientStatus = getAmbientStatus();
  const isAudioPlaying = ambientStatus.isPlaying;

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

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-white/90 dark:border-stone-800/80 dark:bg-[#0b0f17]/90 backdrop-blur-xl transition-all">
        {/* Top subtle futuristic gradient glow line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-teal-600 opacity-80" />

        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2">
            
            {/* Left: Brand & Student Avatar Context */}
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="relative group w-9 h-9 sm:w-10 sm:h-10 rounded-2xl overflow-hidden border-2 border-emerald-500/40 hover:border-emerald-500 transition-all active:scale-95 shrink-0 shadow-xs cursor-pointer bg-stone-100 dark:bg-stone-800"
                title="Click to change profile picture or upload from device"
              >
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name || 'Scholar'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-bold text-base font-mono">
                    {profile.name ? profile.name.trim()[0].toUpperCase() : 'S'}
                  </div>
                )}
                
                {/* Camera icon hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                  <Camera className="w-3.5 h-3.5" />
                </div>

                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white dark:border-[#0b0f17] animate-pulse" />
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={() => setIsProfileModalOpen(true)}
                    className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base tracking-tight hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-left truncate cursor-pointer"
                    title="Click to customize profile & photo"
                  >
                    <span className="truncate max-w-[110px] xs:max-w-[150px] sm:max-w-[200px]">
                      {profile.name || 'Scholar'}
                    </span>
                    <Pencil className="w-3 h-3 text-stone-400 hover:text-emerald-500 shrink-0" />
                  </button>

                  <span className="text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-800/90 text-stone-700 dark:text-stone-300 font-mono font-semibold border border-stone-200/60 dark:border-stone-700/60 shrink-0">
                    Sem {profile.semester}
                  </span>
                </div>

                <button
                  onClick={onOpenOnboarding}
                  className="text-[11px] sm:text-xs text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 transition-colors flex items-center gap-1 text-left truncate max-w-[120px] xs:max-w-[180px] sm:max-w-md"
                  title="Change university, branch, or routine hours"
                >
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400 truncate">
                    {profile.college === 'OTHERS' && profile.customCollege ? profile.customCollege : profile.college}
                  </span>
                  <span>·</span>
                  <span className="truncate">{profile.branch}</span>
                </button>
              </div>
            </div>

            {/* Right: Gen-Z Vibe Hub (Streak Counter, Lo-Fi Audio, Workspaces & Theme) */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              
              {/* Live Academic Streak Badge (CLICKABLE NOW!) */}
              <button
                onClick={() => setIsStreakModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-mono font-bold cursor-pointer select-none shadow-2xs hover:scale-105 active:scale-95 transition-all"
                title="Click to view 14-Day Academic Streak History & Shields"
              >
                <Flame className="w-3.5 h-3.5 fill-current animate-pulse text-orange-500" />
                <span>14d</span>
              </button>

              {/* Quick Lo-Fi Focus Audio Synthesizer (CLICKABLE MODAL NOW!) */}
              <button
                onClick={() => setIsAudioModalOpen(true)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                  isAudioPlaying
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 shadow-xs'
                    : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800/80'
                }`}
                title="Open Focus Audio Hub: Indian Flute, Melodies & Hindu Rituals, Lo-Fi, or Device Audio"
              >
                {isAudioPlaying ? (
                  <div className="flex items-center gap-0.5">
                    <span className="w-0.5 h-3 bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-0.5 h-2 bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-0.5 h-3 bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                ) : (
                  <Headphones className="w-3.5 h-3.5 text-stone-500" />
                )}
                <span className="hidden sm:inline text-[11px]">
                  {isAudioPlaying
                    ? ambientStatus.currentSoundType === 'flute'
                      ? 'Flute'
                      : ambientStatus.currentSoundType === 'rituals'
                      ? 'Rituals'
                      : ambientStatus.currentSoundType === 'instrumental'
                      ? 'Calm Tune'
                      : ambientStatus.currentSoundType === 'custom'
                      ? 'My Audio'
                      : 'Lo-Fi'
                    : 'Lo-Fi Audio'}
                </span>
              </button>

              {/* Workspaces Drawer Trigger */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/80 transition-colors cursor-pointer"
                title="Open 5 Academic Folders & Tools (⌘K)"
              >
                <Menu className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden xs:inline">Workspaces</span>
                <kbd className="hidden md:inline-flex text-[9px] px-1 py-0.5 rounded bg-stone-200/80 dark:bg-stone-800 text-stone-500 dark:text-stone-400 font-mono">
                  ⌘K
                </kbd>
              </button>

              {/* Theme Toggle (Working flawlessly) */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/80 transition-colors cursor-pointer"
                aria-label="Toggle theme"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Focus Audio Hub Modal */}
      <FocusAudioModal
        isOpen={isAudioModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
      />

      {/* 14-Day Streak Intelligence Modal */}
      <StreakModal
        isOpen={isStreakModalOpen}
        onClose={() => setIsStreakModalOpen(false)}
      />

      {/* Profile & Avatar Customizer Modal */}
      <ProfileAvatarModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
};
