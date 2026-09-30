import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  CheckCircle2,
  CalendarPlus,
  ShieldCheck,
  ShieldAlert,
  Flame,
  CheckSquare,
  Square,
  Play,
  RotateCcw,
  Sparkles,
  Coffee,
  Plus,
  X,
  Target,
  BarChart2,
  ChevronDown,
  ChevronUp,
  Calendar as CalendarIcon,
  Check,
} from 'lucide-react';
import { MonthlyAcademicCalendar } from './MonthlyAcademicCalendar';
import { ScheduleTaskModal } from './ScheduleTaskModal';
import { StreakModal } from './StreakModal';
import { XpModal } from './XpModal';
import { playTaskCompleteSound } from '../utils/audioSynth';
import { fireConfetti } from '../utils/audioVibes';

export const HomeOverview: React.FC = () => {
  const {
    profile,
    timetable,
    attendance,
    overallAttendancePercentage,
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
    setIsAiDrawerOpen,
    userStreak,
    userXp,
  } = useApp();

  // Core view mode: 'today' (laser-focused, zero clutter) or 'calendar' (monthly planning folder)
  const [viewMode, setViewMode] = useState<'today' | 'calendar'>('today');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [isXpModalOpen, setIsXpModalOpen] = useState(false);
  const [isTimeInsightsOpen, setIsTimeInsightsOpen] = useState(false);
  const [scheduleFilter, setScheduleFilter] = useState<'all' | 'study' | 'habit' | 'chill'>('all');

  const completedCount = timetable.filter((item) => item.completed).length;
  const totalCount = timetable.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const isAttendanceSafe = overallAttendancePercentage >= 75;
  const totalAttended = attendance.reduce((acc, a) => acc + a.attendedClasses, 0);
  const totalConducted = attendance.reduce((acc, a) => acc + a.totalClasses, 0);

  // Time calculations for live active / next task
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

  // Filtered timetable for today's interactive planner
  const filteredTimetable = timetable.filter((item) => {
    if (scheduleFilter === 'all') return true;
    if (scheduleFilter === 'study') return item.category === 'study' || item.category === 'lecture' || item.category === 'lab';
    if (scheduleFilter === 'habit') return item.category === 'habit';
    if (scheduleFilter === 'chill') return item.category === 'chill';
    return true;
  });

  // Calculate planned hours breakdown (Smart Time Management)
  const studyMinutes = timetable
    .filter((t) => t.category === 'study' || t.category === 'lecture' || t.category === 'lab')
    .reduce((acc, t) => acc + Math.max(0, parseMinutes(t.endTime) - parseMinutes(t.startTime)), 0);

  const habitMinutes = timetable
    .filter((t) => t.category === 'habit')
    .reduce((acc, t) => acc + Math.max(0, parseMinutes(t.endTime) - parseMinutes(t.startTime)), 0);

  const chillMinutes = timetable
    .filter((t) => t.category === 'chill')
    .reduce((acc, t) => acc + Math.max(0, parseMinutes(t.endTime) - parseMinutes(t.startTime)), 0);

  const totalPlannedMinutes = studyMinutes + habitMinutes + chillMinutes || 1;
  const studyHours = (studyMinutes / 60).toFixed(1);
  const habitHours = (habitMinutes / 60).toFixed(1);
  const chillHours = (chillMinutes / 60).toFixed(1);

  const handleToggle = (item: any) => {
    toggleItemComplete(item.id);
    if (!item.completed) {
      playTaskCompleteSound();
      fireConfetti(30);
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'study':
        return 'Deep Study';
      case 'lecture':
        return 'Lecture';
      case 'lab':
        return 'Lab Practical';
      case 'habit':
        return 'Daily Habit';
      case 'chill':
        return 'Buffer Break';
      default:
        return 'Task';
    }
  };

  return (
    <>
      <div className="space-y-6 max-w-4xl mx-auto">

        {/* Dynamic Recalibrate Banner (Guilt-Free Reassurance) */}
        {recalibrateNotice && (
          <div className="rounded-xl border border-teal-200/90 dark:border-teal-900/70 bg-teal-50/90 dark:bg-teal-950/60 p-3.5 flex items-start justify-between gap-3 text-xs text-teal-900 dark:text-teal-100 transition-all animate-fadeIn">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-teal-700 dark:text-teal-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold">Schedule Recalibrated: </span>
                <span>{recalibrateNotice}</span>
              </div>
            </div>
            <button
              onClick={clearRecalibrateNotice}
              className="text-teal-700 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-200 p-0.5 cursor-pointer"
              aria-label="Dismiss notice"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 1. Clean Top Header: Directional Context + Segmented View Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80 dark:border-stone-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              {profile.name ? `Welcome, ${profile.name}` : 'Smart Daily Planner'}
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
              <span>Semester {profile.semester}</span>
              <span>·</span>
              <span>{profile.branch || 'B.Tech CSE'}</span>
              <span>·</span>
              <span className="font-medium text-stone-700 dark:text-stone-300">
                {profile.customCollege || profile.college || 'Engineering College'}
              </span>
              <span className="hidden md:inline text-stone-300 dark:text-stone-700">·</span>
              <span className="hidden md:inline text-[11px] italic text-stone-400 dark:text-stone-500">
                "For the student, by the student, to the student"
              </span>
            </p>
          </div>

          {/* Clean Segmented Switcher & Primary Action */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 bg-stone-100 dark:bg-stone-800/90 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setViewMode('today')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  viewMode === 'today'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-2xs font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                Today's Focus
              </button>
              <button
                type="button"
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'calendar'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-2xs font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Monthly Calendar</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsScheduleModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-950 text-xs font-semibold transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>+ Add Task</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: TODAY'S FOCUS (Ultra-Clean, Directional, Minimal Cognitive Load)  */}
        {/* ========================================================================= */}
        {viewMode === 'today' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Zone A: The Single Dominant Focal Anchor ("Right Now / Up Next") */}
            <div className="rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-[#0c1017] p-5 sm:p-6 shadow-xs">
              {activeTask ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-semibold">
                        Current Focus · {activeTask.startTime} – {activeTask.endTime}
                      </span>
                    </div>

                    <h2 className="text-lg sm:text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100 truncate">
                      {activeTask.title}
                    </h2>

                    <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-2">
                      <span>{getCategoryLabel(activeTask.category)}</span>
                      <span>·</span>
                      <span>{activeTask.cognitiveWeight}h cognitive weight</span>
                      {activeTask.snoozed && (
                        <>
                          <span>·</span>
                          <span className="text-amber-600 dark:text-amber-400 font-mono">Snoozed +30m</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Primary Focal Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggle(activeTask)}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                        activeTask.completed
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{activeTask.completed ? 'Completed' : 'Mark Done'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => startZenMode(activeTask)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-950 text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-98"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start Focus Mode</span>
                    </button>
                  </div>
                </div>
              ) : nextTask ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-stone-400 font-medium">
                      Up Next · Starts {nextTask.startTime}
                    </div>
                    <h2 className="text-base sm:text-lg font-bold tracking-tight text-stone-900 dark:text-stone-100 truncate">
                      {nextTask.title}
                    </h2>
                    <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-2">
                      <span>{getCategoryLabel(nextTask.category)}</span>
                      <span>·</span>
                      <span>{nextTask.startTime} – {nextTask.endTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => startZenMode(nextTask)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Play className="w-3 h-3" />
                      <span>Start Early</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsScheduleModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-950 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Task</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-2 text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      All caught up for today!
                    </div>
                    <div className="text-xs text-stone-500 mt-0.5">
                      You've completed all scheduled blocks. Enjoy your rest or plan ahead for tomorrow.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsScheduleModalOpen(true)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 text-xs font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Plan Next Task</span>
                  </button>
                </div>
              )}
            </div>

            {/* Zone B: Quiet Day Status Strip (Zero-Pill, Typographic Discipline) */}
            <div className="rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/70 dark:bg-[#0c1017]/70 px-4 py-3 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-600 dark:text-stone-400">
                
                {/* Metric 1: Today's Routine Completion */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 font-medium text-stone-800 dark:text-stone-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Today's Routine:</span>
                    <span className="font-mono tabular-nums font-semibold">{completedCount}/{totalCount} done</span>
                    <span className="text-stone-400 font-mono">({progressPercent}%)</span>
                  </div>

                  {/* Slim Hairline Progress Bar */}
                  <div className="w-20 sm:w-28 h-1.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                    <div
                      className="h-full bg-stone-900 dark:bg-stone-100 transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Metric 2: Streak & Attendance */}
                <div className="flex items-center gap-3 text-stone-500 dark:text-stone-400">
                  <button
                    type="button"
                    onClick={() => setIsStreakModalOpen(true)}
                    className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    <span className="font-medium text-stone-700 dark:text-stone-300 font-mono tabular-nums">{userStreak}d Streak</span>
                  </button>

                  <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>

                  <button
                    type="button"
                    onClick={() => setActiveView('attendance')}
                    className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {isAttendanceSafe ? (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    )}
                    <span className="font-medium text-stone-700 dark:text-stone-300 font-mono tabular-nums">{overallAttendancePercentage}% Attendance</span>
                    <span className="text-[11px] text-stone-400">({isAttendanceSafe ? 'Safe' : 'Alert'})</span>
                  </button>
                </div>

              </div>
            </div>

            {/* Zone C: Today's Time-Blocked Schedule (Interactive & Clean) */}
            <div className="rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-[#0c1017] p-5 sm:p-6 shadow-xs space-y-4">
              
              {/* List Header with Clean Filtering & Recalibrate */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-stone-400" />
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    Today's Agenda
                  </h3>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Category Segmented Tabs */}
                  <div className="flex items-center p-0.5 bg-stone-100 dark:bg-stone-850 rounded-lg text-xs">
                    <button
                      type="button"
                      onClick={() => setScheduleFilter('all')}
                      className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                        scheduleFilter === 'all'
                          ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-semibold shadow-2xs'
                          : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
                      }`}
                    >
                      All ({totalCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setScheduleFilter('study')}
                      className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                        scheduleFilter === 'study'
                          ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-semibold shadow-2xs'
                          : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
                      }`}
                    >
                      Study & Class
                    </button>
                    <button
                      type="button"
                      onClick={() => setScheduleFilter('habit')}
                      className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                        scheduleFilter === 'habit'
                          ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-semibold shadow-2xs'
                          : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
                      }`}
                    >
                      Habits
                    </button>
                  </div>

                  {/* Recalibrate Button */}
                  <button
                    type="button"
                    onClick={() => recalibrateSchedule()}
                    disabled={isRecalibrating}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-750 hover:bg-stone-50 dark:hover:bg-stone-800 text-xs font-medium text-stone-600 dark:text-stone-400 transition-colors cursor-pointer"
                    title="Fell behind? Automatically adjust remaining routine smoothly"
                  >
                    <RotateCcw className={`w-3 h-3 ${isRecalibrating ? 'animate-spin' : ''}`} />
                    <span>Recalibrate</span>
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-stone-100 dark:divide-stone-850">
                {filteredTimetable.length === 0 ? (
                  <div className="py-8 text-center text-xs text-stone-500">
                    No time blocks in this category. Click "+ Add Task" to schedule one.
                  </div>
                ) : (
                  filteredTimetable.map((item) => {
                    const isNow = activeTask?.id === item.id;
                    return (
                      <div
                        key={item.id}
                        className={`py-3.5 px-2.5 -mx-2.5 rounded-xl flex items-center justify-between gap-3 group transition-colors ${
                          isNow
                            ? 'bg-stone-50 dark:bg-stone-850/60 ring-1 ring-stone-200 dark:ring-stone-800'
                            : 'hover:bg-stone-50/70 dark:hover:bg-stone-850/30'
                        } ${item.completed ? 'opacity-55' : ''}`}
                      >
                        {/* Checkbox + Title + Time */}
                        <div className="flex items-center gap-3 min-w-0">
                          <button
                            type="button"
                            onClick={() => handleToggle(item)}
                            className="text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer shrink-0"
                            aria-label={item.completed ? 'Mark incomplete' : 'Mark complete'}
                          >
                            {item.completed ? (
                              <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs font-semibold truncate ${
                                  item.completed
                                    ? 'line-through text-stone-400'
                                    : 'text-stone-900 dark:text-stone-100'
                                }`}
                              >
                                {item.title}
                              </span>

                              {isNow && (
                                <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400">
                                  · Active Now
                                </span>
                              )}
                            </div>

                            {/* Clean Unboxed Metadata */}
                            <div className="text-[11px] text-stone-400 font-mono flex items-center gap-1.5 mt-0.5">
                              <span className="tabular-nums">
                                {item.startTime} – {item.endTime}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>{getCategoryLabel(item.category)}</span>
                              {item.snoozed && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="text-amber-600 dark:text-amber-400">Rescheduled</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Inline Actions (Focus, Snooze, Shift) */}
                        <div className="shrink-0 flex items-center gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          {!item.completed && (
                            <>
                              <button
                                type="button"
                                onClick={() => startZenMode(item)}
                                className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                                title="Launch Focus Mode for this block"
                              >
                                <Play className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => snoozeItem(item.id, 30)}
                                className="px-1.5 py-0.5 rounded text-[11px] font-mono text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                                title="Snooze 30 mins"
                              >
                                +30m
                              </button>
                              <button
                                type="button"
                                onClick={() => shiftItemToEvening(item.id)}
                                className="px-1.5 py-0.5 rounded text-[11px] font-mono text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                                title="Shift to Evening Study Slot"
                              >
                                Night
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Bottom Quick Action Strip */}
              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => injectBufferZone()}
                  className="text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <Coffee className="w-3.5 h-3.5" />
                  <span>Insert 25m Buffer Break</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(true)}
                  className="font-semibold text-stone-900 dark:text-stone-100 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Scheduled Block</span>
                </button>
              </div>

            </div>

            {/* Zone D: Secondary Collapsible Folders (Hidden by default to prevent cognitive clutter) */}
            <div className="space-y-3">
              
              {/* Folder: Time Allocation & Daily Distribution (Collapsible) */}
              <div className="rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-[#0c1017] shadow-2xs overflow-hidden">
                <button
                  type="button"
                  onClick={() => setIsTimeInsightsOpen(!isTimeInsightsOpen)}
                  className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-stone-50/60 dark:hover:bg-stone-850/40 transition-colors"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-stone-800 dark:text-stone-200">
                    <BarChart2 className="w-4 h-4 text-stone-500" />
                    <span>Time Allocation & Distribution Insights</span>
                    <span className="text-stone-400 font-mono text-[11px] font-normal">
                      · {((studyMinutes + habitMinutes) / 60).toFixed(1)}h planned
                    </span>
                  </div>
                  {isTimeInsightsOpen ? (
                    <ChevronUp className="w-4 h-4 text-stone-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400" />
                  )}
                </button>

                {isTimeInsightsOpen && (
                  <div className="p-4 pt-1 border-t border-stone-100 dark:border-stone-800 space-y-3 animate-fadeIn">
                    {/* Visual Multi-Segment Bar */}
                    <div className="space-y-2">
                      <div className="w-full h-2.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden flex">
                        <div
                          style={{ width: `${(studyMinutes / totalPlannedMinutes) * 100}%` }}
                          className="bg-emerald-500 transition-all duration-300"
                          title={`Study & Lectures: ${studyHours}h`}
                        />
                        <div
                          style={{ width: `${(habitMinutes / totalPlannedMinutes) * 100}%` }}
                          className="bg-teal-400 transition-all duration-300"
                          title={`Habits: ${habitHours}h`}
                        />
                        <div
                          style={{ width: `${(chillMinutes / totalPlannedMinutes) * 100}%` }}
                          className="bg-amber-400 transition-all duration-300"
                          title={`Buffer & Rest: ${chillHours}h`}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs pt-1 font-mono text-stone-500 dark:text-stone-400">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                          <span>Study: {studyHours}h</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0" />
                          <span>Habits: {habitHours}h</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                          <span>Buffer: {chillHours}h</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-850/60 border border-stone-200/70 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400 flex items-start gap-2.5">
                      <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                      <div className="leading-relaxed">
                        Never let a missed slot derail your day. Use <strong>Recalibrate</strong> or <strong>Shift to Night</strong> to maintain consistency without stress or academic guilt.
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setActiveView('analytics')}
                        className="text-stone-700 dark:text-stone-300 hover:underline font-semibold cursor-pointer flex items-center gap-1"
                      >
                        <span>View Mental Bandwidth & Daily Reflections →</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsAiDrawerOpen(true)}
                        className="inline-flex items-center gap-1 text-teal-700 dark:text-teal-400 hover:underline font-semibold cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Ask Campus Senior Mentor</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Navigation Footnote */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-400 pt-2 px-1">
                <div className="flex items-center gap-1.5 text-[11px] text-stone-400 dark:text-stone-500 italic">
                  <span className="font-semibold not-italic text-stone-600 dark:text-stone-400">PlanZo</span>
                  <span>·</span>
                  <span>For the student, by the student, to the student</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveView('academic')}
                  className="text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 font-medium underline underline-offset-2 cursor-pointer"
                >
                  Open Academic Vault →
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: MONTHLY CALENDAR (Dedicated Folder View - Full Width & Clean)      */}
        {/* ========================================================================= */}
        {viewMode === 'calendar' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-[#0c1017] p-5 sm:p-6 shadow-xs">
              <MonthlyAcademicCalendar />
            </div>
          </div>
        )}

      </div>

      {/* Auxiliary Modals */}
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
    </>
  );
};
