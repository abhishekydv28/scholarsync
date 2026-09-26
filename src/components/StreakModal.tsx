import React from 'react';
import {
  X,
  Flame,
  Shield,
  Trophy,
  Calendar,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StreakModal: React.FC<StreakModalProps> = ({ isOpen, onClose }) => {
  const { scheduledTasks, getDateTaskStats } = useApp();

  if (!isOpen) return null;

  // Active 14-Day Unbroken Streak Log (Sept 12 to Sept 25, 2026)
  const streakHistory = [
    { day: 25, dateStr: '2026-09-25', label: 'Today (Day 14)', hours: '3.5h', tasks: '4/4', status: 'Conquered 🔥', multiplier: '1.5x' },
    { day: 24, dateStr: '2026-09-24', label: 'Day 13', hours: '4.0h', tasks: '4/4', status: 'Followed', multiplier: '1.5x' },
    { day: 23, dateStr: '2026-09-23', label: 'Day 12', hours: '4.5h', tasks: '4/4', status: 'Followed', multiplier: '1.5x' },
    { day: 22, dateStr: '2026-09-22', label: 'Day 11', hours: '3.0h', tasks: '3/4', status: 'Followed', multiplier: '1.5x' },
    { day: 21, dateStr: '2026-09-21', label: 'Day 10', hours: '5.0h', tasks: '4/4', status: 'Followed', multiplier: '1.4x' },
    { day: 20, dateStr: '2026-09-20', label: 'Day 9', hours: '4.0h', tasks: '4/4', status: 'Followed', multiplier: '1.4x' },
    { day: 19, dateStr: '2026-09-19', label: 'Day 8', hours: '3.5h', tasks: '4/5', status: 'Followed', multiplier: '1.3x' },
    { day: 18, dateStr: '2026-09-18', label: 'Day 7', hours: '4.5h', tasks: '4/4', status: 'Followed', multiplier: '1.3x' },
    { day: 17, dateStr: '2026-09-17', label: 'Day 6', hours: '3.0h', tasks: '3/4', status: 'Followed', multiplier: '1.2x' },
    { day: 16, dateStr: '2026-09-16', label: 'Day 5', hours: '4.0h', tasks: '4/4', status: 'Followed', multiplier: '1.2x' },
    { day: 15, dateStr: '2026-09-15', label: 'Day 4', hours: '4.5h', tasks: '4/4', status: 'Followed', multiplier: '1.1x' },
    { day: 14, dateStr: '2026-09-14', label: 'Day 3', hours: '3.0h', tasks: '3/4', status: 'Followed', multiplier: '1.1x' },
    { day: 13, dateStr: '2026-09-13', label: 'Day 2', hours: '3.5h', tasks: '3/3', status: 'Followed', multiplier: '1.0x' },
    { day: 12, dateStr: '2026-09-12', label: 'Day 1', hours: '4.0h', tasks: '4/4', status: 'Started Streak', multiplier: '1.0x' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-[#0d131f] border border-stone-200/90 dark:border-stone-800 rounded-3xl p-5 sm:p-6 w-full max-w-xl shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center border border-orange-500/20">
              <Flame className="w-5 h-5 fill-current animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <span>Academic Streak Intelligence</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30">
                  14 Days Active
                </span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Synchronized with your monthly academic calendar. Every day followed is a day won.
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

        {/* Hero Streak Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-orange-500/15 via-amber-500/10 to-teal-500/10 border border-orange-500/30 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="text-[11px] font-mono uppercase tracking-wider text-orange-600 dark:text-orange-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Current Winning Streak</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-stone-900 dark:text-white flex items-baseline gap-2">
                <span>14</span>
                <span className="text-base sm:text-lg text-stone-500 dark:text-stone-400 font-normal">consecutive days</span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                You've followed all study and lecture blocks from <strong className="text-emerald-600 dark:text-emerald-400">Sept 12 to Sept 25</strong> without skipping!
              </p>
            </div>

            {/* Streak Freeze & Multiplier Badges */}
            <div className="flex sm:flex-col gap-2 shrink-0">
              <div className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-700 text-xs flex items-center gap-2 shadow-xs">
                <Shield className="w-4 h-4 text-cyan-500" />
                <div>
                  <div className="text-[10px] text-stone-400 uppercase font-mono">Streak Freezes</div>
                  <div className="font-bold text-stone-800 dark:text-stone-200">2 Available</div>
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-700 text-xs flex items-center gap-2 shadow-xs">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <div>
                  <div className="text-[10px] text-stone-400 uppercase font-mono">XP Multiplier</div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">1.5x Active</div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Milestone Progress */}
          <div className="pt-2 border-t border-orange-500/20 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-stone-600 dark:text-stone-400">Next Tier: 21 Days (Habit Master)</span>
              <span className="font-bold text-orange-600 dark:text-orange-400">7 Days to go (66%)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 w-2/3 transition-all" />
            </div>
          </div>
        </div>

        {/* 14-Day Calendar Verification Breakdown */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              14-Day Consecutive Activity Feed
            </span>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              All 14 Days = Green (Followed)
            </span>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
            {streakHistory.map((item) => (
              <div
                key={item.dateStr}
                className="p-2.5 sm:p-3 rounded-xl border border-stone-200/70 dark:border-stone-800/80 bg-stone-50/70 dark:bg-stone-900/40 flex items-center justify-between text-xs gap-2 transition-all hover:border-emerald-500/50"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-[#22c55e] text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-2xs">
                    ✓
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                      <span>{item.label}</span>
                      <span className="text-[10px] text-stone-400 font-mono">({item.dateStr})</span>
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400">
                      {item.hours} logged · {item.tasks} tasks completed
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 font-mono text-right">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                    {item.multiplier} XP
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hidden xs:inline">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engineering Consistency Wisdom */}
        <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 text-stone-600 dark:text-stone-300 text-xs space-y-1">
          <div className="font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Consistency Beats Genius</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            "Semester exams and campus placements aren't cracked in one night. Studying 3 hours every day for 14 days is 10x more effective than an 18-hour cramming all-nighter."
          </p>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-bold transition-colors"
          >
            Keep Grinding 🔥
          </button>
        </div>

      </div>
    </div>
  );
};
