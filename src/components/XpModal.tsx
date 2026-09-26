import React from 'react';
import {
  X,
  Trophy,
  Zap,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Code,
  Flame,
  Award,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface XpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const XpModal: React.FC<XpModalProps> = ({ isOpen, onClose }) => {
  const { profile } = useApp();

  if (!isOpen) return null;

  const currentXp = 1450;
  const nextLevelXp = 2000;
  const xpPercentage = Math.round((currentXp / nextLevelXp) * 100);

  const xpActivities = [
    {
      id: 'xp-1',
      title: '14-Day Active Streak Consistency Bonus',
      time: 'Today · 09:30 AM',
      points: '+200 XP',
      category: 'Streak',
      icon: Flame,
      color: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    },
    {
      id: 'xp-2',
      title: 'Computer Networks Lab: TCP Handshake Analysis submitted early',
      time: 'Yesterday · 05:45 PM',
      points: '+120 XP',
      category: 'Assignment',
      icon: Code,
      color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      id: 'xp-3',
      title: 'Attendance Gatekeeper: Maintained 85%+ across all core subjects',
      time: 'Sept 23 · 04:15 PM',
      points: '+100 XP',
      category: 'Attendance',
      icon: ShieldCheck,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      id: 'xp-4',
      title: 'Operating Systems: Process Sync 45m Zen Focus Session completed',
      time: 'Sept 22 · 11:30 AM',
      points: '+80 XP',
      category: 'Zen Focus',
      icon: Zap,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    },
    {
      id: 'xp-5',
      title: 'DSA: Binary Search Tree Traversals & LeetCode medium conquered',
      time: 'Sept 21 · 08:30 PM',
      points: '+50 XP',
      category: 'Study',
      icon: BookOpen,
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    },
  ];

  const badges = [
    { name: '75% Gatekeeper', desc: 'No debar risk all semester', icon: '🛡️', unlocked: true },
    { name: 'Terminal Speed', desc: '4 college labs completed ahead of schedule', icon: '⚡', unlocked: true },
    { name: 'Zen Master', desc: '10 deep focus sessions clocked', icon: '🧘', unlocked: true },
    { name: '14d Firebug', desc: 'Unbroken fortnight grind', icon: '🔥', unlocked: true },
    { name: 'Semester Demon', desc: 'Reach 2,000 XP Level 5', icon: '👑', unlocked: false },
    { name: 'All-Nighter Slayer', desc: '30-day consistent bedtime rhythm', icon: '🌙', unlocked: false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-[#0d131f] border border-stone-200/90 dark:border-stone-800 rounded-3xl p-5 sm:p-6 w-full max-w-xl shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
              <Trophy className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <span>Academic XP & Rank Matrix</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  Level 4
                </span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Earn XP for every lecture attended, assignment cleared, and focus block conquered.
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

        {/* Hero Level Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-teal-500/10 border border-amber-500/30 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
                Current Rank
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white">
                Level 4 · Code & Theory Scholar
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                Next Rank: <strong className="text-amber-600 dark:text-amber-400">Level 5 · Semester Demon ⚡</strong>
              </p>
            </div>

            <div className="text-right shrink-0">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-500">
                {currentXp}
              </div>
              <div className="text-[11px] font-mono text-stone-400">
                / {nextLevelXp} XP
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-stone-500 dark:text-stone-400">Level Progress</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">{xpPercentage}% ({nextLevelXp - currentXp} XP to Level 5)</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Badges Carousel / Grid */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono uppercase font-bold tracking-wider text-stone-400">
            Achievements & Badges
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {badges.map((b) => (
              <div
                key={b.name}
                className={`p-2.5 rounded-xl border flex flex-col justify-between text-xs gap-1 transition-all ${
                  b.unlocked
                    ? 'bg-stone-50/80 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800 hover:border-amber-500/40'
                    : 'bg-stone-100/40 dark:bg-stone-900/20 border-stone-200/50 dark:border-stone-800/40 opacity-55'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{b.icon}</span>
                  <span className={`text-[9px] font-mono px-1 rounded font-bold ${
                    b.unlocked ? 'bg-emerald-500/10 text-emerald-600' : 'bg-stone-200 text-stone-500'
                  }`}>
                    {b.unlocked ? 'UNLOCKED' : 'LOCKED'}
                  </span>
                </div>
                <div>
                  <div className="font-bold text-stone-900 dark:text-stone-100 text-[11px] truncate">
                    {b.name}
                  </div>
                  <div className="text-[10px] text-stone-500 dark:text-stone-400 line-clamp-1">
                    {b.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live XP Activity Ledger */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono uppercase font-bold tracking-wider text-stone-400">
            Recent XP Activity Log
          </div>
          <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
            {xpActivities.map((act) => {
              const IconComp = act.icon;
              return (
                <div
                  key={act.id}
                  className="p-2.5 rounded-xl border border-stone-200/70 dark:border-stone-800/80 bg-stone-50/60 dark:bg-stone-900/40 flex items-center justify-between text-xs gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center border shrink-0 ${act.color}`}>
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-stone-900 dark:text-stone-100 truncate">
                        {act.title}
                      </div>
                      <div className="text-[10px] text-stone-500 dark:text-stone-400 font-mono">
                        {act.time}
                      </div>
                    </div>
                  </div>

                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400 shrink-0 text-xs">
                    {act.points}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-bold transition-colors"
          >
            Conquer Next Milestone
          </button>
        </div>

      </div>
    </div>
  );
};
