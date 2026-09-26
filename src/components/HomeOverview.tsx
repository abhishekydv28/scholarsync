import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  ArrowRight,
  CheckCircle2,
  Circle,
  Play,
  Zap,
  Percent,
  Flame,
  Sparkles,
  Trophy,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  BookOpen,
  Laptop,
} from 'lucide-react';
import { MonthlyAcademicCalendar } from './MonthlyAcademicCalendar';
import { playTaskCompleteSound } from '../utils/audioSynth';
import { fireConfetti } from '../utils/audioVibes';
import { StreakModal } from './StreakModal';
import { XpModal } from './XpModal';

export const HomeOverview: React.FC = () => {
  const {
    profile,
    timetable,
    overallAttendancePercentage,
    setActiveView,
    setIsAttendanceModalOpen,
    startZenMode,
    toggleItemComplete,
  } = useApp();

  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [isXpModalOpen, setIsXpModalOpen] = useState(false);

  const isAttendanceSafe = overallAttendancePercentage >= 75;

  // Find next or active class
  const activeOrUpcomingItem = timetable.find((item) => !item.completed) || timetable[0];
  const completedCount = timetable.filter((item) => item.completed).length;
  const progressPercent = timetable.length > 0 ? Math.round((completedCount / timetable.length) * 100) : 0;

  const handleTaskCheck = (id: string, currentlyCompleted: boolean) => {
    toggleItemComplete(id);
    if (!currentlyCompleted) {
      playTaskCompleteSound();
      if (completedCount + 1 >= timetable.length) {
        fireConfetti(90);
      } else {
        fireConfetti(35);
      }
    }
  };

  return (
    <>
      <div className="space-y-6 animate-fadeIn max-w-full overflow-x-hidden">

        {/* 0. Top Gen-Z Academic Momentum & XP Ribbon */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-stone-900 to-teal-950 dark:from-[#0c121d] dark:via-[#0e1626] dark:to-[#091b22] text-white p-4 sm:p-5 border border-stone-800 dark:border-teal-500/20 shadow-lg shadow-black/10">
          {/* Subtle decorative background ambient glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {/* Clickable Semester Grind / Streak trigger */}
                <button
                  onClick={() => setIsStreakModalOpen(true)}
                  className="flex items-center gap-1 text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full hover:bg-emerald-500/20 transition-all cursor-pointer active:scale-95"
                  title="Click to view 14-Day Streak Details"
                >
                  <Flame className="w-3.5 h-3.5 text-orange-400 fill-current animate-pulse" />
                  <span>Semester Grind Mode</span>
                </button>
                <span className="text-stone-500">·</span>
                {/* Clickable Rank / XP trigger */}
                <button
                  onClick={() => setIsXpModalOpen(true)}
                  className="text-xs font-mono text-cyan-300 hover:text-cyan-200 transition-colors cursor-pointer hover:underline"
                  title="Click to view Level & XP Matrix"
                >
                  Level 4 Code & Theory Scholar
                </button>
              </div>

              {/* User greeting - Redundant B.Tech CSE removed as requested! */}
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>{profile.name ? `Hey, ${profile.name}` : 'Welcome back, Scholar'}</span>
              </h1>
            </div>

            {/* Quick Stat Badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              {/* Clickable XP Pill */}
              <button
                onClick={() => setIsXpModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white/10 dark:bg-stone-800/80 backdrop-blur-md border border-white/10 hover:border-amber-400/50 flex items-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95"
                title="Click to view XP Breakdown & Activity Log"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-stone-300">XP:</span>
                <span className="font-bold text-amber-300">1,450 pts</span>
              </button>

              <button
                onClick={() => setIsAttendanceModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white/10 dark:bg-stone-800/80 backdrop-blur-md border border-white/10 hover:border-emerald-500/50 flex items-center gap-2 transition-colors cursor-pointer"
              >
                {isAttendanceSafe ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                )}
                <span className="text-stone-300">Bunk Safety:</span>
                <span className={`font-bold ${isAttendanceSafe ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {overallAttendancePercentage}%
                </span>
              </button>

              <button
                onClick={() => setActiveView('timeline')}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-xs"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>{completedCount}/{timetable.length} Done</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full bg-white/10 dark:bg-stone-800 overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[11px] font-mono font-semibold text-stone-300 shrink-0">
              {progressPercent}% Today Completed
            </span>
          </div>
        </div>
        
        {/* 1. Calm Academic Hub: Greeting & Next Up (Top) + Motion Cards (Left) + Monthly Academic Calendar (Right) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch max-w-full">
          
          {/* Left Section: Greeting + Rectangular Immediate Next Up (Top Right) + Motion Cards (xl:col-span-7) */}
          <div className="xl:col-span-7 flex flex-col justify-between gap-5 bg-white dark:bg-[#0c1017] border border-stone-200/90 dark:border-stone-800/80 p-4 sm:p-6 rounded-3xl shadow-xs max-w-full overflow-hidden">
            
            {/* Top Row: Greeting Context (Left) & Immediate Current/Next Up Rectangular Block (Right) */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 max-w-full min-w-0">
              <div className="space-y-1.5 max-w-sm min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold">
                    Calm Academic Hub
                  </span>
                  <span className="text-stone-300 dark:text-stone-700">•</span>
                  <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                    {new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date())}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 truncate">
                  Engineering Routine
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed line-clamp-2">
                  No guilt-tripping or notification overload. Dynamic auto-correction protects your sleep rhythm.
                </p>
              </div>

              {/* Immediate Upcoming / Current Class */}
              {activeOrUpcomingItem && (
                <div className="w-full md:w-64 p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border border-emerald-500/25 space-y-2 shrink-0">
                  <div className="flex items-center justify-between text-[11px] font-mono font-semibold text-emerald-700 dark:text-emerald-300">
                    <span className="uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-500" />
                      Next Up
                    </span>
                    <span>{activeOrUpcomingItem.startTime}</span>
                  </div>
                  <div className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                    {activeOrUpcomingItem.title}
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/80 dark:bg-stone-800 font-mono text-stone-600 dark:text-stone-300 capitalize font-medium">
                      {activeOrUpcomingItem.category}
                    </span>
                    <button
                      onClick={() => startZenMode(activeOrUpcomingItem)}
                      className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Focus Now</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Row: 2 Big Motion Cards (75% Attendance & Today's Rhythm) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-1">
              
              {/* 75% Attendance Safe Card */}
              <button
                type="button"
                onClick={() => setIsAttendanceModalOpen(true)}
                className="group relative p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#0e141f] border border-stone-200/90 dark:border-stone-800 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.03] active:scale-95 hover:bg-[#4ade80] dark:hover:bg-[#22c55e] hover:border-[#22c55e] hover:shadow-xl hover:shadow-green-500/25 text-left flex flex-col justify-between w-full min-w-0 cursor-pointer focus:outline-hidden"
                title="Click to view full 75% Attendance Bunk Simulator & details"
              >
                {/* Top row: Icon & Status Dot */}
                <div className="flex items-center justify-between gap-2 w-full">
                  <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 group-hover:bg-white text-emerald-800 dark:text-emerald-300 group-hover:text-stone-900 flex items-center justify-center transition-colors shadow-xs">
                    <Percent className="w-4 h-4" />
                  </div>
                  <span className={`w-2.5 h-2.5 rounded-full ${isAttendanceSafe ? 'bg-emerald-500 group-hover:bg-stone-900' : 'bg-rose-500 group-hover:bg-stone-900'} animate-pulse`} />
                </div>

                {/* Middle: Big Percentage */}
                <div className="py-2">
                  <div className="text-[11px] uppercase font-mono tracking-wider text-stone-500 dark:text-stone-400 group-hover:text-stone-900/80 font-bold transition-colors">
                    75% Attendance Safe
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-stone-900 dark:text-stone-100 group-hover:text-stone-950 transition-colors">
                    {overallAttendancePercentage}%
                  </div>
                </div>

                {/* Bottom: Action Line */}
                <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 group-hover:text-stone-950 transition-colors flex items-center gap-1">
                  <span>{isAttendanceSafe ? 'Safe to chill at canteen' : 'Debar danger! Attend classes'}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </button>

              {/* Today's Rhythm Card */}
              <button
                type="button"
                onClick={() => setActiveView('timeline')}
                className="group relative p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#0e141f] border border-stone-200/90 dark:border-stone-800 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.03] active:scale-95 hover:bg-[#4ade80] dark:hover:bg-[#22c55e] hover:border-[#22c55e] hover:shadow-xl hover:shadow-green-500/25 text-left flex flex-col justify-between w-full min-w-0 cursor-pointer focus:outline-hidden"
                title="Click to view full Daily Routine schedule"
              >
                {/* Top row: Icon */}
                <div className="flex items-center justify-between gap-2 w-full">
                  <div className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950/80 group-hover:bg-white text-amber-800 dark:text-amber-300 group-hover:text-stone-900 flex items-center justify-center transition-colors shadow-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 group-hover:bg-white/80 text-stone-600 dark:text-stone-300 group-hover:text-stone-900 font-bold transition-colors">
                    Daily Habit
                  </span>
                </div>

                {/* Middle: Big Rhythm Count */}
                <div className="py-2">
                  <div className="text-[11px] uppercase font-mono tracking-wider text-stone-500 dark:text-stone-400 group-hover:text-stone-900/80 font-bold transition-colors">
                    Today's Rhythm
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-stone-900 dark:text-stone-100 group-hover:text-stone-950 transition-colors">
                    {completedCount}
                    <span className="text-xl text-stone-400 group-hover:text-stone-800 font-normal">/{timetable.length}</span>
                  </div>
                </div>

                {/* Bottom: Action Line */}
                <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 group-hover:text-stone-950 transition-colors flex items-center gap-1">
                  <span>{completedCount === timetable.length ? 'All blocks conquered 🎉' : `${timetable.length - completedCount} tasks remaining`}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </button>

            </div>
          </div>

          {/* Right Section: Monthly Academic Calendar (xl:col-span-5) */}
          <div className="xl:col-span-5 max-w-full min-w-0 overflow-hidden">
            <MonthlyAcademicCalendar />
          </div>

        </div>

        {/* 3. Today's Key Schedule Blocks (Redesigned high-contrast, crystal clear on scroll, zero white banner bug) */}
        <div className="bg-stone-50/90 dark:bg-[#0c1017] border border-stone-200 dark:border-stone-800 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4 max-w-full overflow-hidden">
          
          {/* Header Banner with high contrast and clear title */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-stone-200/50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-stone-900/60 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Today's Daily Schedule & Quests</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                  {completedCount}/{timetable.length} Conquered
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 truncate mt-0.5">
                Dynamic Schedule Blocks
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                Tap any circle to check off. Guilt-free auto-correction recalibrates if your lecture runs late.
              </p>
            </div>

            <button
              onClick={() => setActiveView('timeline')}
              className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-emerald-500 text-stone-800 dark:text-stone-200 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs cursor-pointer self-start sm:self-auto"
            >
              <span>Full Routine View</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            </button>
          </div>

          {/* Schedule Item Cards with clear borders & category strip */}
          <div className="space-y-2.5 max-w-full">
            {timetable.map((item) => {
              const categoryColor =
                item.category === 'study'
                  ? 'border-l-emerald-500 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60'
                  : item.category === 'lab'
                  ? 'border-l-indigo-500 text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60'
                  : item.category === 'lecture'
                  ? 'border-l-sky-500 text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60'
                  : 'border-l-amber-500 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60';

              return (
                <div
                  key={item.id}
                  className={`group p-3 sm:p-3.5 rounded-2xl border border-l-4 flex items-center justify-between text-xs transition-all gap-2 min-w-0 max-w-full ${
                    item.completed
                      ? 'border-stone-200/60 dark:border-stone-800/60 bg-stone-100/50 dark:bg-stone-900/30 text-stone-400 opacity-75'
                      : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-[#111722] hover:border-emerald-500/50 shadow-xs hover:shadow-md'
                  } ${categoryColor.split(' ')[0]}`}
                >
                  <div className="flex items-center gap-2 sm:gap-3 truncate min-w-0 flex-1">
                    <button
                      onClick={() => handleTaskCheck(item.id, !!item.completed)}
                      className="text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:scale-110 active:scale-95 shrink-0 transition-transform cursor-pointer p-0.5"
                      title={item.completed ? 'Mark incomplete' : 'Mark complete'}
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5 hover:stroke-emerald-500 stroke-stone-400 dark:stroke-stone-600" />
                      )}
                    </button>

                    <div className="font-mono text-stone-700 dark:text-stone-300 shrink-0 font-bold text-[11px] sm:text-xs px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800">
                      {item.startTime} - {item.endTime}
                    </div>

                    <span className={`font-semibold truncate min-w-0 text-xs sm:text-sm ${
                      item.completed ? 'line-through text-stone-400 dark:text-stone-500' : 'text-stone-900 dark:text-stone-100'
                    }`}>
                      {item.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <span className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded-lg capitalize font-mono font-medium ${categoryColor.split(' ').slice(1).join(' ')}`}>
                      {item.category}
                    </span>
                    {!item.completed && (
                      <button
                        onClick={() => startZenMode(item)}
                        className="p-1 sm:p-1.5 rounded-lg text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-colors cursor-pointer"
                        title="Launch Zen Focus for this task"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Streak Details Modal */}
      <StreakModal
        isOpen={isStreakModalOpen}
        onClose={() => setIsStreakModalOpen(false)}
      />

      {/* XP Matrix & Badges Modal */}
      <XpModal
        isOpen={isXpModalOpen}
        onClose={() => setIsXpModalOpen(false)}
      />
    </>
  );
};
