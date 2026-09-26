import React, { useState, useRef } from 'react';
import {
  X,
  Camera,
  Upload,
  User,
  Sparkles,
  Check,
  RotateCcw,
  GraduationCap,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { COLLEGES_LIST, BRANCHES_LIST } from '../data/btechData';

interface ProfileAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AVATARS = [
  {
    id: 'avatar-1',
    name: 'Tech Scholar',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
  },
  {
    id: 'avatar-2',
    name: 'Smart Engineer',
    url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=256&q=80',
  },
  {
    id: 'avatar-3',
    name: 'Cyber Coder',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  },
  {
    id: 'avatar-4',
    name: 'Focus Warrior',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
  },
  {
    id: 'avatar-5',
    name: 'Code Alchemist',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
  },
];

export const ProfileAvatarModal: React.FC<ProfileAvatarModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(profile.name || 'Abhishek');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || PRESET_AVATARS[0].url);
  const [college, setCollege] = useState(profile.college || COLLEGES_LIST[0]);
  const [branch, setBranch] = useState(profile.branch || BRANCHES_LIST[1]);
  const [semester, setSemester] = useState(profile.semester || 4);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleDeviceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Read image as base64 Data URL to save inside localStorage
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const resultStr = event.target.result as string;
          setAvatarUrl(resultStr);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateProfile({
      name,
      avatarUrl,
      college,
      branch,
      semester,
    });
    setIsSavedNotice(true);
    setTimeout(() => {
      setIsSavedNotice(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-[#0d131f] border border-stone-200/90 dark:border-stone-800 rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                Custom Profile & Avatar
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Upload your picture from your device or pick a tech scholar avatar.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Picture Hero & Upload Button */}
        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/25">
          <div className="relative group shrink-0">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-emerald-500/50 shadow-md bg-stone-100 dark:bg-stone-800">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-emerald-600">
                  {name ? name[0].toUpperCase() : 'S'}
                </div>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-emerald-500 text-stone-950 hover:bg-emerald-400 shadow-sm transition-transform active:scale-90 cursor-pointer"
              title="Upload photo from device"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
            <div>
              <div className="font-bold text-sm text-stone-900 dark:text-stone-100">
                {name || 'Scholar Abhishek'}
              </div>
              <div className="text-xs text-stone-500 dark:text-stone-400">
                Semester {semester} · {branch}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload From Device</span>
              </button>

              <button
                type="button"
                onClick={() => setAvatarUrl(PRESET_AVATARS[0].url)}
                className="px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-medium transition-colors"
                title="Reset to default avatar"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleDeviceUpload}
            />
          </div>
        </div>

        {/* Curated Presets */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono uppercase font-bold tracking-wider text-stone-400 flex items-center justify-between">
            <span>Or Choose Preset Avatar</span>
            <span className="text-[10px] text-stone-400">Tap to select</span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {PRESET_AVATARS.map((av) => {
              const isSelected = avatarUrl === av.url;
              return (
                <button
                  key={av.id}
                  onClick={() => setAvatarUrl(av.url)}
                  className={`group relative p-1 rounded-2xl border transition-all ${
                    isSelected
                      ? 'border-emerald-500 ring-2 ring-emerald-500/40 bg-emerald-500/10 scale-105'
                      : 'border-stone-200 dark:border-stone-800 hover:border-emerald-500/50'
                  }`}
                  title={av.name}
                >
                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800">
                    <img src={av.url} alt={av.name} className="w-full h-full object-cover" />
                  </div>
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-stone-950 rounded-full flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Student Details Fields */}
        <div className="space-y-3 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-stone-700 dark:text-stone-300">
              Student Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Abhishek"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/50 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-stone-700 dark:text-stone-300">
                Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(parseInt(e.target.value) || 4)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/50 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-stone-700 dark:text-stone-300">
                Branch
              </label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/50 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40 truncate"
              >
                {BRANCHES_LIST.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold transition-all active:scale-95 shadow-xs flex items-center gap-1.5"
          >
            {isSavedNotice ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save Profile</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
