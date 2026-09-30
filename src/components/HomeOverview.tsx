import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  ArrowRight,
  CheckCircle2,
  Calendar,
  CalendarPlus,
  Sliders,
  ShieldCheck,
  ShieldAlert,
  Flame,
  CheckSquare,
  Square,
  ChevronRight,
  GraduationCap,
  Play,
  RotateCcw,
  Sparkles,
  Coffee,
  Laptop,
  BookOpen,
  Zap,
  Plus,
  X,
  Target,
  BarChart2,
  Headphones,
  Bot,
  Globe,
  Sun,
  Award,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { ScheduleTaskModal } from './ScheduleTaskModal';
import { StreakModal } from './StreakModal';
import { XpModal } from './XpModal';
import { FocusGarden } from './FocusGarden';
import { MentalBandwidthMeter } from './MentalBandwidthMeter';
import { LofiAudioModal } from './LofiAudioModal';
import { StudentAiChatbotModal } from './StudentAiChatbotModal';
import { UniversityPortalScraperModal } from './UniversityPortalScraperModal';
import { playTaskCompleteSound } from '../utils/audioSynth';
import { fireConfetti } from '../utils/audioVibes';

export const HomeOverview: React.FC = () => {
  const {
    profile,
    timetable,
    attendance,
    overallAttendancePercentage,
    bandwidth,
    setActiveView,
    toggleItemComplete,
    snoozeItem,
    shiftItemToEvening,
    injectBufferZone,
    recalibrateSchedule,
    isRecalibrating,
    recalibrateNotice,
    clearRecalibrateNotice,
    startZenMode,
    setIsPersonalizationWizardOpen,
    userStreak,
    userXp,
    awardXp,
  } = useApp();

  // Modals state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [isXpModalOpen, setIsXpModalOpen] = useState(false);
  const [isLofiModalOpen, setIsLofiModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isScraperModalOpen, setIsScraperModalOpen] = useState(false);
  const [scheduleFilter, setScheduleFilter] = useState<'all' | 'study' | 'habit' | 'chill'>('all');

  const completedCount = timetable.filter((item) => item.completed).length;
  const totalCount = timetable.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const isAttendanceSafe = overallAttendancePercentage >= 75;
  const totalAttended = attendance.reduce((acc, a) => acc + a.attendedClasses, 0);
  const totalConducted = attendance.reduce((acc, a) => acc + a.totalClasses, 0);

  // Time calculations for live active/next task
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const parseMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const activeTask = timetable.find((item) => {
    const start = parseMinutes(item.startTime);
    const end = parseMinutes(item.endTime);
    return currentMinutes >= start && currentMinutes <= end;
  });

  const nextTask = !activeTask
    ? timetable.find((item) => parseMinutes(item.startTime) > currentMinutes && !item.completed) ||
      timetable.find((item) => !item.completed) ||
      timetable[0]
    : null;

  // Filtered timetable for interactive planner
  const filteredTimetable = timetable.filter((item) => {
    if (scheduleFilter === 'all') return true;
    if (scheduleFilter === 'study')
      return item.category === 'study' || item.category === 'lecture' || item.category === 'lab';
    if (scheduleFilter === 'habit') return item.category === 'habit';
    if (scheduleFilter === 'chill') return item.category === 'chill';
    return true;
  });

  // Category counts
  const studyCount = timetable.filter(
    (t) => t.category === 'study' || t.category === 'lecture' || t.category === 'lab'
  ).length;
  const habitCount = timetable.filter((t) => t.category === 'habit').length;
  const chillCount = timetable.filter((t) => t.category === 'chill').length;

  // Calculate planned hours breakdown
  const lectureHours = 4.0;
  const deepStudyHours = 2.5;
  const habitHours = 1.0;
  const chillHours = 2.0;
  const sleepHours = 7.5;
  const totalTrackedHours = lectureHours + deepStudyHours + habitHours + chillHours + sleepHours;

  const handleTaskCheck = (id: string, currentlyCompleted: boolean) => {
    if (!currentlyCompleted) {
      playTaskCompleteSound();
      fireConfetti();
      awardXp(20, 'Task Completed Mindfully');
    }
    toggleItemComplete(id);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. TOP STUDENT COMMAND HEADER & TAGLINE */}
      <div className="relative rounded-3xl border border-stone-200/90 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 p-5 sm:p-7 shadow-xs backdrop-blur-md overflow-hidden">
        
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-teal-500/10 dark:bg-teal-500/5 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          
          {/* Left Student Info & Calibrated Tagline */}
          <div className="space-y-2">
            
            {/* TAGLINE BADGE: Calibrated prominently as requested */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/70 border border-teal-200/70 dark:border-teal-800/60 text-[11px] font-semibold text-teal-800 dark:text-teal-300">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>For the student, by the student, to the student</span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                Welcome back, {profile.name || 'Student'}
              </h1>
              <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                Sem {profile.semester}
              </span>
            </div>

            <p className="text-xs text-stone-500 dark:text-stone-400 flex flex-wrap items-center gap-2">
              <span className="font-semibold text-stone-700 dark:text-stone-300">
                {profile.branch || 'B.Tech Computer Science & Engineering'}
              </span>
              <span>·</span>
              <span>{profile.customCollege || profile.college || 'Engineering College'}</span>
            </p>
          </div>

          {/* Right Action Toolbelt */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            
            {/* Add Task Button */}
            <button
              onClick={() => setIsScheduleModalOpen(true)}
              className="pop-hover-btn px-3.5 py-2 rounded-xl text-xs font-semibold bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Task</span>
            </button>

            {/* Quick Chill Buffer */}
            <button
              onClick={() => injectBufferZone()}
              className="pop-hover-btn px-3.5 py-2 rounded-xl text-xs font-semibold bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-200 hover:bg-teal-100/90 border border-teal-200/80 dark:border-teal-800/70 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Add a 25-minute calm buffer block into your schedule"
            >
              <Coffee className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>+ Chill Block</span>
            </button>

            {/* Auto Recalibrate */}
            <button
              onClick={() => recalibrateSchedule('Manual Trigger')}
              disabled={isRecalibrating}
              className="pop-hover-btn px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-teal-50 dark:hover:bg-teal-950/60 hover:text-teal-800 dark:hover:text-teal-200 border border-stone-200 dark:border-stone-700 hover:border-teal-400 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Intelligently rebalance remaining tasks without any guilt"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isRecalibrating ? 'animate-spin text-teal-600' : 'text-teal-600 dark:text-teal-400'}`} />
              <span>{isRecalibrating ? 'Balancing...' : 'Recalibrate'}</span>
            </button>

            {/* AI Sarthi Copilot Trigger */}
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="pop-hover-btn px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-teal-700 to-emerald-600 hover:from-teal-800 hover:to-emerald-700 text-white transition-all shadow-md shadow-teal-700/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Sarthi AI</span>
            </button>

            {/* Lo-Fi Music / Ambient Sounds Player */}
            <button
              onClick={() => setIsLofiModalOpen(true)}
              className="pop-hover-btn p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition-colors cursor-pointer"
              title="Focus Audio & Binaural Lo-Fi Beats"
            >
              <Headphones className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </button>

            {/* University Portal Sync Scraper */}
            <button
              onClick={() => setIsScraperModalOpen(true)}
              className="pop-hover-btn p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition-colors cursor-pointer"
              title="Sync University Portal & Syllabus"
            >
              <Globe className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            </button>

          </div>

        </div>

      </div>

      {/* 2. DYNAMIC AUTO-REASSURANCE BANNER (Guilt-Free Reassurance Engine) */}
      {recalibrateNotice && (
        <div className="rounded-2xl border border-teal-200/80 bg-teal-50/90 dark:border-teal-900/60 dark:bg-teal-950/40 p-4 flex items-center justify-between gap-3 shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2.5 text-xs text-teal-900 dark:text-teal-200">
            <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <span>
              <strong>Schedule Rebalanced: </strong>
              {recalibrateNotice}
            </span>
          </div>
          <button
            onClick={clearRecalibrateNotice}
            className="p-1 rounded-lg text-teal-700 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. FOUR RICH EXECUTIVE KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Live Focus / Next Task Card */}
        <div className="pop-hover-card rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-lime-500 p-5 shadow-xs flex flex-col justify-between cursor-pointer">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                {activeTask ? 'Current Active Block' : 'Next Priority Block'}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                activeTask
                  ? 'bg-lime-100 text-lime-900 border border-lime-400/80 dark:bg-lime-950/80 dark:text-lime-300 dark:border-lime-500/50 shadow-xs shadow-lime-500/20'
                  : 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300'
              }`}>
                {activeTask && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
                  </span>
                )}
                <span>{activeTask ? 'LIVE NOW' : nextTask?.startTime || 'Up Next'}</span>
              </span>
            </div>

            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 line-clamp-2">
              {activeTask?.title || nextTask?.title || 'All Scheduled Tasks Complete!'}
            </h3>

            {(activeTask || nextTask) && (
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>
                  {activeTask?.startTime || nextTask?.startTime} – {activeTask?.endTime || nextTask?.endTime}
                </span>
                <span>·</span>
                <span className="capitalize">{activeTask?.category || nextTask?.category}</span>
              </p>
            )}
          </div>

          <div className="pt-4 mt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
            <button
              onClick={() => startZenMode(activeTask || nextTask || undefined)}
              className="pop-hover-btn flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-lime-600 via-emerald-600 to-teal-700 hover:from-lime-500 hover:via-emerald-500 hover:to-teal-600 text-white shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>⚡ Zen Focus</span>
            </button>
            <button
              onClick={() => {
                const target = activeTask || nextTask;
                if (target) handleTaskCheck(target.id, target.completed);
              }}
              className="pop-hover-btn p-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-lime-50 dark:hover:bg-lime-950/60 hover:text-lime-600 hover:border-lime-400 transition-colors cursor-pointer"
              title="Mark Completed"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </button>
          </div>
        </div>

        {/* KPI 2: 75% Attendance Guard Card */}
        <div
          onClick={() => setActiveView('attendance')}
          className="pop-hover-card rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-gradient-to-b hover:from-emerald-50/70 hover:to-white dark:hover:from-emerald-950/50 dark:hover:to-stone-900 hover:border-emerald-400 dark:hover:border-emerald-500 p-5 shadow-xs flex flex-col justify-between cursor-pointer group"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                75% Attendance Guard
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  isAttendanceSafe
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                {isAttendanceSafe ? 'Safe' : 'Risk'}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-stone-900 dark:text-stone-100">
                {overallAttendancePercentage}%
              </span>
              <span className="text-xs text-stone-400">
                ({totalAttended}/{totalConducted} classes)
              </span>
            </div>

            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              {isAttendanceSafe
                ? 'Above AICTE minimum threshold. 2 safe bunks available.'
                : 'Attend next 3 consecutive lectures to regain safety.'}
            </p>
          </div>

          <div className="pt-4 mt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs font-semibold text-teal-700 dark:text-teal-400 group-hover:underline">
            <span>View Subject Breakdown</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* KPI 3: Daily Progress & Gamification (XP & Streak) */}
        <div className="pop-hover-card rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-gradient-to-b hover:from-amber-50/60 hover:to-white dark:hover:from-amber-950/40 dark:hover:to-stone-900 hover:border-amber-400 dark:hover:border-amber-500 p-5 shadow-xs flex flex-col justify-between cursor-pointer">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Today's Adherence
              </span>
              <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400">
                {progressPercent}%
              </span>
            </div>

            <div className="text-2xl font-bold text-stone-900 dark:text-stone-100">
              {completedCount} <span className="text-sm font-normal text-stone-400">of {totalCount} done</span>
            </div>

            {/* Progress bar */}
            <div className="mt-2.5 h-2 w-full rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
            <button
              onClick={() => setIsStreakModalOpen(true)}
              className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{userStreak} Day Streak</span>
            </button>
            <button
              onClick={() => setIsXpModalOpen(true)}
              className="flex items-center gap-1 font-semibold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{userXp} XP</span>
            </button>
          </div>
        </div>

        {/* KPI 4: Mental Bandwidth Density */}
        <div className="pop-hover-card rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-gradient-to-b hover:from-teal-50/70 hover:to-white dark:hover:from-teal-950/50 dark:hover:to-stone-900 hover:border-teal-400 dark:hover:border-teal-500 p-5 shadow-xs flex flex-col justify-between cursor-pointer">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Mental Load Meter
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                {bandwidth.status}
              </span>
            </div>

            <div className="text-2xl font-bold font-mono text-stone-900 dark:text-stone-100">
              {bandwidth.densityScore}%
            </div>

            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">
              {bandwidth.recommendation}
            </p>
          </div>

          <div className="pt-3 mt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
            <button
              onClick={() => injectBufferZone()}
              className="font-semibold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>+ Chill Buffer</span>
            </button>
            <button
              onClick={() => recalibrateSchedule()}
              className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 cursor-pointer"
            >
              Recalibrate
            </button>
          </div>
        </div>

      </div>

      {/* 4. VISUAL FOCUS GARDEN & MENTAL BANDWIDTH EXPANDED VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Blooming Focus Garden Canvas */}
        <div className="pop-hover-card rounded-2xl cursor-pointer">
          <FocusGarden />
        </div>

        {/* Real-time Mental Bandwidth Gauge & Burnout Protection */}
        <div className="pop-hover-card rounded-2xl cursor-pointer">
          <MentalBandwidthMeter />
        </div>

      </div>

      {/* 5. SMART SCHEDULE ENHANCER (Adaptive Behavioral AI) */}
      <div className="pop-hover-card rounded-2xl border border-teal-200/70 dark:border-teal-900/60 bg-gradient-to-r from-teal-50/80 via-white to-emerald-50/50 dark:from-teal-950/30 dark:via-stone-900 dark:to-emerald-950/20 p-5 shadow-xs cursor-pointer">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900 dark:text-teal-200">
                  Adaptive Schedule Enhancer
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Active
                </span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                Based on your past 7 days: You achieve <strong>92% completion</strong> on DSA coding blocks scheduled after 6:30 PM. Your timetable has been automatically tuned to avoid heavy theory right after 3-hour lab sessions.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveView('analytics')}
            className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline shrink-0 hidden sm:inline-flex items-center gap-1"
          >
            <span>View Behavioral Analysis</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 6. MAIN INTERACTIVE TIMETABLE & HABIT TRACKER */}
      <div className="rounded-3xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 sm:p-7 shadow-xs space-y-5">
        
        {/* Title & Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100 dark:border-stone-800">
          <div>
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-700 dark:text-teal-400" />
              <span>Today's Time-Blocked Schedule & Habits</span>
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Check off tasks as you go. Missing a task? Click auto-recalibrate or snooze without pressure.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            <button
              onClick={() => setScheduleFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                scheduleFilter === 'all'
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200/60'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setScheduleFilter('study')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                scheduleFilter === 'study'
                  ? 'bg-teal-700 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200/60'
              }`}
            >
              Study & Labs ({studyCount})
            </button>
            <button
              onClick={() => setScheduleFilter('habit')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                scheduleFilter === 'habit'
                  ? 'bg-teal-700 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200/60'
              }`}
            >
              Habits ({habitCount})
            </button>
            <button
              onClick={() => setScheduleFilter('chill')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                scheduleFilter === 'chill'
                  ? 'bg-teal-700 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200/60'
              }`}
            >
              Chill & Rest ({chillCount})
            </button>
          </div>
        </div>

        {/* Task List Items */}
        <div className="space-y-3">
          {filteredTimetable.map((item) => {
            const isCompleted = item.completed;
            const categoryBadge =
              item.category === 'lecture'
                ? 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800'
                : item.category === 'lab'
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800'
                : item.category === 'study'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                : item.category === 'habit'
                ? 'bg-teal-50 text-teal-800 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800'
                : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';

            return (
              <div
                key={item.id}
                className={`group pop-hover-item flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
                  isCompleted
                    ? 'border-stone-200/60 bg-stone-50/70 dark:border-stone-800/60 dark:bg-stone-900/40 opacity-70'
                    : 'border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-850 shadow-2xs'
                }`}
              >
                {/* Left: Checkbox + Title + Time */}
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <button
                    onClick={() => handleTaskCheck(item.id, isCompleted)}
                    className="p-1 rounded-lg text-stone-400 hover:text-lime-600 dark:hover:text-lime-400 transition-colors shrink-0 cursor-pointer"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-lime-600 dark:text-lime-400 fill-lime-100 dark:fill-lime-950" />
                    ) : (
                      <Square className="w-5 h-5 text-stone-400 group-hover:text-lime-600 dark:group-hover:text-lime-400 group-hover:scale-110 transition-all" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs sm:text-sm font-semibold truncate ${
                          isCompleted
                            ? 'line-through text-stone-400 dark:text-stone-500'
                            : 'text-stone-900 dark:text-stone-100'
                        }`}
                      >
                        {item.title}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${categoryBadge} uppercase tracking-wider`}
                      >
                        {item.category}
                      </span>
                      {item.cognitiveWeight >= 4 && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 font-mono">
                          Heavy Weight
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-stone-400 mt-1">
                      <span className="font-mono font-medium">
                        {item.startTime} – {item.endTime}
                      </span>
                      {item.topic && (
                        <>
                          <span>·</span>
                          <span className="truncate">{item.topic}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Quick Action Controls */}
                <div className="flex items-center gap-1.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startZenMode(item)}
                    className="pop-hover-btn hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-lime-50 dark:bg-lime-950/60 text-lime-800 dark:text-lime-300 border border-lime-300/60 hover:bg-lime-500 hover:text-white dark:hover:bg-lime-500 dark:hover:text-stone-950 transition-all cursor-pointer"
                    title="Launch Zen Focus Mode with Ambient Audio"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Focus</span>
                  </button>

                  <button
                    onClick={() => snoozeItem(item.id, 30)}
                    className="pop-hover-btn p-1.5 rounded-xl text-stone-400 hover:text-lime-700 dark:hover:text-lime-300 hover:bg-lime-100 dark:hover:bg-lime-950/60 transition-colors cursor-pointer"
                    title="Snooze 30 mins"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => shiftItemToEvening(item.id)}
                    className="pop-hover-btn p-1.5 rounded-xl text-stone-400 hover:text-lime-700 dark:hover:text-lime-300 hover:bg-lime-100 dark:hover:bg-lime-950/60 transition-colors cursor-pointer"
                    title="Shift to Evening Slot"
                  >
                    <Clock className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Schedule Tools Bar */}
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-2">
            <span>Showing {filteredTimetable.length} of {totalCount} items</span>
            <span>·</span>
            <button
              onClick={() => setActiveView('timeline')}
              className="font-semibold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <span>Full Daily Routine View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsScheduleModalOpen(true)}
              className="text-stone-700 dark:text-stone-300 hover:underline font-semibold"
            >
              + Add Custom Block
            </button>
            <span>·</span>
            <button
              onClick={() => injectBufferZone()}
              className="text-teal-700 dark:text-teal-400 hover:underline font-semibold"
            >
              + Quick 25m Buffer
            </button>
          </div>
        </div>

      </div>

      {/* 7. TIME ALLOCATION & COGNITIVE BALANCE STRIP */}
      <div className="rounded-3xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-teal-700 dark:text-teal-400" />
            <span>24-Hour Cognitive Time Allocation</span>
          </h3>
          <span className="text-xs font-mono text-stone-400">
            {totalTrackedHours} hrs accounted for
          </span>
        </div>

        {/* Visual Stacked Bar */}
        <div className="h-4 w-full rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden flex p-0.5 gap-0.5">
          <div
            className="h-full bg-sky-500 rounded-l-full"
            style={{ width: `${(lectureHours / 24) * 100}%` }}
            title="Lectures & Labs (4.0 hrs)"
          />
          <div
            className="h-full bg-emerald-500"
            style={{ width: `${(deepStudyHours / 24) * 100}%` }}
            title="Deep Study (2.5 hrs)"
          />
          <div
            className="h-full bg-teal-500"
            style={{ width: `${(habitHours / 24) * 100}%` }}
            title="Habits & DSA (1.0 hrs)"
          />
          <div
            className="h-full bg-amber-500"
            style={{ width: `${(chillHours / 24) * 100}%` }}
            title="Chill & Decompression (2.0 hrs)"
          />
          <div
            className="h-full bg-indigo-400 rounded-r-full"
            style={{ width: `${(sleepHours / 24) * 100}%` }}
            title="Sleep & Recovery (7.5 hrs)"
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span>College Lectures & Labs (4.0h)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Deep Coursework Study (2.5h)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
            <span>DSA & Habits (1.0h)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Buffer & Rest (2.0h)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
            <span>Sleep (7.5h)</span>
          </div>
        </div>
      </div>

      {/* 8. ACADEMIC COUNTDOWN & UPCOMING EXAM DEADLINES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div
          onClick={() => setActiveView('academic')}
          className="pop-hover-card p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-gradient-to-b hover:from-teal-50/70 hover:to-white dark:hover:from-teal-950/50 dark:hover:to-stone-900 shadow-xs cursor-pointer hover:border-teal-400 dark:hover:border-teal-500 transition-all flex items-center justify-between"
        >
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
              Mid-Semester Exam 1
            </span>
            <div className="text-base font-bold text-stone-900 dark:text-stone-100 mt-0.5">
              18 Days Remaining
            </div>
            <p className="text-[11px] text-teal-700 dark:text-teal-400 mt-0.5 font-medium">
              Units 1 & 2 target revision
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </div>

        <div
          onClick={() => setActiveView('academic')}
          className="pop-hover-card p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-gradient-to-b hover:from-teal-50/70 hover:to-white dark:hover:from-teal-950/50 dark:hover:to-stone-900 shadow-xs cursor-pointer hover:border-teal-400 dark:hover:border-teal-500 transition-all flex items-center justify-between"
        >
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
              Lab Practical & Viva
            </span>
            <div className="text-base font-bold text-stone-900 dark:text-stone-100 mt-0.5">
              34 Days Remaining
            </div>
            <p className="text-[11px] text-teal-700 dark:text-teal-400 mt-0.5 font-medium">
              Viva question bank indexed
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </div>

        <div
          onClick={() => setActiveView('academic')}
          className="pop-hover-card p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-gradient-to-b hover:from-teal-50/70 hover:to-white dark:hover:from-teal-950/50 dark:hover:to-stone-900 shadow-xs cursor-pointer hover:border-teal-400 dark:hover:border-teal-500 transition-all flex items-center justify-between"
        >
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
              End-Semester Theory
            </span>
            <div className="text-base font-bold text-stone-900 dark:text-stone-100 mt-0.5">
              56 Days Remaining
            </div>
            <p className="text-[11px] text-teal-700 dark:text-teal-400 mt-0.5 font-medium">
              5 Units / 70 Marks Scheme
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </div>

      </div>

      {/* MODALS */}
      <ScheduleTaskModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />
      <StreakModal
        isOpen={isStreakModalOpen}
        onClose={() => setIsStreakModalOpen(false)}
      />
      <XpModal
        isOpen={isXpModalOpen}
        onClose={() => setIsXpModalOpen(false)}
      />
      <LofiAudioModal
        isOpen={isLofiModalOpen}
        onClose={() => setIsLofiModalOpen(false)}
      />
      <StudentAiChatbotModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
      <UniversityPortalScraperModal
        isOpen={isScraperModalOpen}
        onClose={() => setIsScraperModalOpen(false)}
      />

    </div>
  );
};
