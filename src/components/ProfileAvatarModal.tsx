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
  Code2,
  Cpu,
  Terminal,
  Shield,
  Rocket,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { COLLEGES_LIST, BRANCHES_LIST } from '../data/btechData';

interface ProfileAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 8 Distinct, High-Energy Tech & Engineering Archetype Avatars
export const TECH_PRESET_AVATARS = [
  {
    id: 'cyber-hacker',
    name: 'Cyber Architect',
    role: 'Full-Stack & Systems',
    category: 'Engineering',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=CyberArchitect&colors=emerald,cyan,teal',
    color: 'from-emerald-500 to-cyan-500',
  },
  {
    id: 'ai-scholar',
    name: 'AI Researcher',
    role: 'Neural Nets & LLMs',
    category: 'AI & Data',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=AIScholar&colors=indigo,purple,blue',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    id: 'leetcode-ninja',
    name: 'LeetCode Ninja',
    role: 'DSA & Graph Theory',
    category: 'Competitive',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=LeetCodeNinja&colors=amber,orange,red',
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 'terminal-wizard',
    name: 'Terminal Wizard',
    role: 'Linux Kernel & Bash',
    category: 'Systems',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=TerminalWizard&colors=teal,lime,green',
    color: 'from-teal-500 to-emerald-600',
  },
  {
    id: 'quantum-explorer',
    name: 'Quantum Coder',
    role: 'Quantum Gates & Math',
    category: 'Research',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=QuantumCoder&colors=violet,fuchsia,pink',
    color: 'from-violet-500 to-fuchsia-500',
  },
  {
    id: 'robotics-ace',
    name: 'Robotics Pioneer',
    role: 'Embedded & IoT',
    category: 'Hardware',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=RoboticsPioneer&colors=cyan,blue,sky',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'space-engineer',
    name: 'Space Techie',
    role: 'Avionics & Orbital Code',
    category: 'Aerospace',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=SpaceTechie&colors=orange,amber,yellow',
    color: 'from-orange-500 to-yellow-500',
  },
  {
    id: 'chill-student',
    name: 'Zen Developer',
    role: 'Clean Architecture',
    category: 'Focus',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=ZenDeveloper&colors=rose,pink,amber',
    color: 'from-rose-500 to-pink-500',
  },
];

export const ProfileAvatarModal: React.FC<ProfileAvatarModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile, currentUser } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(profile.name || 'Abhishek');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || TECH_PRESET_AVATARS[0].url);
  const [college, setCollege] = useState(profile.college || COLLEGES_LIST[0]);
  const [customCollege, setCustomCollege] = useState(profile.customCollege || profile.college || '');
  const [branch, setBranch] = useState(profile.branch || BRANCHES_LIST[0]);
  const [semester, setSemester] = useState(profile.semester || 1);
  const [rollNo, setRollNo] = useState(profile.rollNo || '0108CS211045');
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [activeTab, setActiveTab] = useState<'presets' | 'upload'>('presets');

  if (!isOpen) return null;

  const handleDeviceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const resultStr = event.target.result as string;
          setAvatarUrl(resultStr);
          setActiveTab('upload');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const resolvedCollege = college === 'OTHERS' ? (customCollege.trim() || 'Engineering Institute') : college;
    updateProfile({
      name: name.trim() || 'Abhishek',
      avatarUrl,
      college: resolvedCollege,
      customCollege: resolvedCollege,
      branch,
      semester,
      rollNo: rollNo.trim(),
    });
    setIsSavedNotice(true);
    setTimeout(() => {
      setIsSavedNotice(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-[#0d131f] border border-stone-200/90 dark:border-stone-800 rounded-3xl p-5 sm:p-6 w-full max-w-xl shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <span>Student Identity & Avatar</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Customizable
                </span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Choose an engineering archetype or upload a picture from your device.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Active Profile Preview Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/25">
          <div className="relative group shrink-0">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-emerald-600 font-mono">
                  {name ? name[0].toUpperCase() : 'S'}
                </div>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-emerald-500 text-stone-950 hover:bg-emerald-400 shadow-sm transition-transform active:scale-90 cursor-pointer"
              title="Upload photo from device"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
              <span className="font-bold text-base text-stone-900 dark:text-stone-100 truncate">
                {name || 'Scholar Abhishek'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold">
                Sem {semester}
              </span>
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400 truncate">
              {branch} · {college === 'OTHERS' ? 'Engineering College' : college}
            </div>
            <div className="text-[11px] font-mono text-stone-400">
              Roll No: {rollNo || 'Not set'}
            </div>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Device Pic</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleDeviceUpload}
          />
        </div>

        {/* 8 Tech Preset Archetype Avatars Grid */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono uppercase font-bold tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Choose Engineering Archetype Avatar</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              8 Available
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {TECH_PRESET_AVATARS.map((av) => {
              const isSelected = avatarUrl === av.url;
              return (
                <button
                  key={av.id}
                  onClick={() => setAvatarUrl(av.url)}
                  className={`group relative p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col items-center gap-2 ${
                    isSelected
                      ? 'border-emerald-500 ring-2 ring-emerald-500/50 bg-emerald-500/10 scale-[1.02] shadow-sm'
                      : 'border-stone-200/80 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/40 hover:border-emerald-500/50 hover:bg-stone-100/80 dark:hover:bg-stone-850'
                  }`}
                >
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 flex items-center justify-center p-1 shadow-2xs group-hover:scale-105 transition-transform">
                    <img src={av.url} alt={av.name} className="w-full h-full object-contain" />
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-stone-950 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="text-center w-full min-w-0">
                    <div className="font-bold text-xs text-stone-900 dark:text-stone-100 truncate">
                      {av.name}
                    </div>
                    <div className="text-[10px] text-stone-500 dark:text-stone-400 font-mono truncate">
                      {av.role}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Upgraded Tactile Student Input Fields */}
        <div className="space-y-3.5 pt-3 border-t border-stone-100 dark:border-stone-800 text-xs">
          <div className="text-xs font-mono uppercase font-bold tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-emerald-500" />
            <span>Academic Credentials & Info</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Student Name Input */}
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700 dark:text-stone-300 flex items-center justify-between">
                <span>Student Full Name</span>
                <span className="text-[10px] font-mono text-stone-400">Required</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Abhishek"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-900/60 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Roll Number Input */}
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700 dark:text-stone-300 flex items-center justify-between">
                <span>Roll No. / Enrollment USN</span>
                <span className="text-[10px] font-mono text-stone-400">College ID</span>
              </label>
              <input
                type="text"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                placeholder="e.g. 0801CS221045"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-900/60 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Semester Select */}
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700 dark:text-stone-300">
                Current Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(parseInt(e.target.value) || 4)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-900/60 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s} ({s <= 2 ? '1st Year' : s <= 4 ? '2nd Year' : s <= 6 ? '3rd Year' : 'Final Year'})
                  </option>
                ))}
              </select>
            </div>

            {/* Branch Select */}
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700 dark:text-stone-300">
                Engineering Discipline / Branch
              </label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-900/60 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all truncate font-medium cursor-pointer"
              >
                {BRANCHES_LIST.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* College / University Select */}
          <div className="space-y-1.5">
            <label className="font-semibold text-stone-700 dark:text-stone-300 flex items-center justify-between">
              <span>Engineering Institute / College</span>
              <span className="text-[10px] font-mono text-stone-400">Updates Everywhere</span>
            </label>
            <select
              value={college}
              onChange={(e) => {
                setCollege(e.target.value);
                if (e.target.value !== 'OTHERS') {
                  setCustomCollege(e.target.value);
                }
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-900/60 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium cursor-pointer"
            >
              {COLLEGES_LIST.map((c) => (
                <option key={c} value={c}>
                  {c === 'OTHERS' ? 'Other Engineering College / University (Custom)' : c}
                </option>
              ))}
            </select>

            {/* Custom College Input if OTHERS or custom */}
            {(college === 'OTHERS' || !COLLEGES_LIST.includes(college)) && (
              <input
                type="text"
                value={customCollege}
                onChange={(e) => setCustomCollege(e.target.value)}
                placeholder="Type your college or university name..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-900/60 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium mt-1.5"
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold transition-all active:scale-95 shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            {isSavedNotice ? (
              <>
                <Check className="w-4 h-4" />
                <span>Identity Saved!</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
