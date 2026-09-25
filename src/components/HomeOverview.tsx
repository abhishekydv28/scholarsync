import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  ArrowRight,
  CheckCircle2,
  Circle,
  Play,
  Zap,
  Percent,
} from 'lucide-react';
import { MonthlyAcademicCalendar } from './MonthlyAcademicCalendar';

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

  const isAttendanceSafe = overallAttendancePercentage >= 75;

  // Find next or active class
  const activeOrUpcomingItem = timetable.find((item) => !item.completed) || timetable[0];
  const completedCount = timetable.filter((item) => item.completed).length;

  return (
    <div className="space-y-6 animate-fadeIn max-w-full overflow-x-hidden">
      
      {/* 1. Calm Academic Hub: Greeting & Next Up (Top) + Motion Cards (Left) + Monthly Academic Calendar (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch max-w-full">
        
        {/* Left Section: Greeting + Rectangular Immediate Next Up (Top Right) + Motion Cards (xl:col-span-7) */}
        <div className="xl:col-span-7 flex flex-col justify-between gap-5 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-4 sm:p-6 rounded-3xl shadow-xs max-w-full overflow-hidden">
          
          {/* Top Row: Greeting Context (Left) & Immediate Current/Next Up Rectangular Block (Right) */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 max-w-full min-w-0">
            <div className="space-y-1.5 max-w-sm min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-teal-700 dark:text-teal-400 font-bold">
                  Calm Academic Hub
                </span>
                <span className="text-stone-300 dark:text-stone-700">•</span>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  {new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date())}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight truncate">
                Welcome back, {profile.name || 'Scholar'}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Guilt-free consistency & dynamic auto-calibrated schedule.
              </p>
            </div>

            {/* Immediate Upcoming / Current Task Rectangular Box */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/70 shadow-xs flex flex-col justify-between w-full md:w-72 md:shrink-0 transition-all hover:border-teal-400/80 min-w-0">
              <div className="flex items-center justify-between text-xs pb-1.5">
                <span className="font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5 text-[11px] uppercase font-mono tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>Current / Next Up</span>
                </span>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white dark:bg-stone-900 text-teal-800 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/80 shadow-2xs shrink-0">
                  {activeOrUpcomingItem?.startTime || 'Day Free'}
                </span>
              </div>
              
              <div className="font-bold text-stone-900 dark:text-stone-100 text-sm truncate py-1" title={activeOrUpcomingItem?.title}>
                {activeOrUpcomingItem?.title || 'All scheduled blocks completed'}
              </div>
              
              <div className="pt-1.5 flex items-center justify-between text-xs border-t border-teal-200/60 dark:border-teal-900/60 mt-1">
                <span className="text-stone-500 dark:text-stone-400 text-[11px] capitalize font-medium">
                  {activeOrUpcomingItem?.category || 'Rest'} block
                </span>
                {activeOrUpcomingItem ? (
                  <button
                    onClick={() => startZenMode(activeOrUpcomingItem)}
                    className="text-teal-800 dark:text-teal-300 hover:text-teal-950 dark:hover:text-teal-100 font-semibold inline-flex items-center gap-1 hover:underline text-[11px]"
                  >
                    <Play className="w-2.5 h-2.5 fill-current" />
                    <span>Launch Focus</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-teal-700 font-medium">All clear 🎉</span>
                )}
              </div>
            </div>
          </div>

          {/* Dual Cards: Attendance & Today's Rhythm (Parrot Green Motion Hover Effect) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 max-w-full">
            
            {/* Attendance Card - Enlarge & Vibrant Parrot Green Motion on Hover */}
            <button
              type="button"
              onClick={() => setIsAttendanceModalOpen(true)}
              className="group relative p-4 sm:p-5 rounded-3xl bg-white dark:bg-stone-900/90 border border-stone-200/90 dark:border-stone-800 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-105 active:scale-95 hover:bg-[#4ade80] dark:hover:bg-[#4ade80] hover:border-[#22c55e] hover:shadow-xl hover:shadow-green-500/25 text-left flex flex-col justify-between w-full min-w-0 cursor-pointer focus:outline-hidden"
              title="Click to open Subject-Wise Attendance Folder"
            >
              {/* Top row: Icon + Label */}
              <div className="flex items-center justify-between gap-2 w-full">
                <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/80 group-hover:bg-white/90 text-teal-800 dark:text-teal-300 group-hover:text-stone-900 flex items-center justify-center transition-colors shadow-xs">
                  <Percent className="w-4 h-4" />
                </div>
                <span className={`w-2 h-2 rounded-full ${isAttendanceSafe ? 'bg-teal-500 group-hover:bg-stone-900' : 'bg-rose-500 group-hover:bg-stone-900'} animate-pulse`} />
              </div>

              {/* Middle: Big Percentage */}
              <div className="py-2">
                <div className="text-[11px] uppercase font-mono tracking-wider text-stone-500 dark:text-stone-400 group-hover:text-stone-900/80 font-bold transition-colors">
                  Attendance
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-stone-900 dark:text-stone-100 group-hover:text-stone-950 transition-colors">
                  {overallAttendancePercentage}%
                </div>
              </div>

              {/* Bottom: Action Line */}
              <div className="text-[11px] font-semibold text-teal-700 dark:text-teal-400 group-hover:text-stone-950 transition-colors flex items-center gap-1">
                <span>{isAttendanceSafe ? 'Safe (≥75%)' : 'Attention (<75%)'}</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
              </div>
            </button>

            {/* Today's Rhythm Card - Enlarge & Vibrant Parrot Green Motion on Hover */}
            <button
              type="button"
              onClick={() => setActiveView('timeline')}
              className="group relative p-4 sm:p-5 rounded-3xl bg-white dark:bg-stone-900/90 border border-stone-200/90 dark:border-stone-800 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-105 active:scale-95 hover:bg-[#4ade80] dark:hover:bg-[#4ade80] hover:border-[#22c55e] hover:shadow-xl hover:shadow-green-500/25 text-left flex flex-col justify-between w-full min-w-0 cursor-pointer focus:outline-hidden"
              title="Click to view full Daily Routine schedule"
            >
              {/* Top row: Icon */}
              <div className="flex items-center justify-between gap-2 w-full">
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/80 group-hover:bg-white/90 text-amber-800 dark:text-amber-300 group-hover:text-stone-900 flex items-center justify-center transition-colors shadow-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 group-hover:bg-white/80 text-stone-600 dark:text-stone-300 group-hover:text-stone-900 font-semibold transition-colors">
                  Today
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
              <div className="text-[11px] font-semibold text-teal-700 dark:text-teal-400 group-hover:text-stone-950 transition-colors flex items-center gap-1">
                <span>{completedCount === timetable.length ? 'All blocks done 🎉' : `${timetable.length - completedCount} tasks left`}</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
              </div>
            </button>

          </div>
        </div>

        {/* Right Section: Monthly Academic Calendar with Year Switcher & Follow-up Heatmap (xl:col-span-5) */}
        <div className="xl:col-span-5 max-w-full min-w-0 overflow-hidden">
          <MonthlyAcademicCalendar />
        </div>

      </div>

      {/* 3. Today's Key Schedule Blocks (Scannable, low cognitive noise, direct checkoff) */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-4 sm:p-6 shadow-xs space-y-4 max-w-full overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800 gap-2">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 truncate">
              Today's Key Blocks
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
              Real-time daily schedule flow · Click circle to mark completed
            </p>
          </div>
          <button
            onClick={() => setActiveView('timeline')}
            className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Full Routine ({timetable.length})</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2.5 max-w-full">
          {timetable.map((item) => (
            <div
              key={item.id}
              className={`p-3 sm:p-3.5 rounded-2xl border flex items-center justify-between text-xs transition-colors gap-2 min-w-0 max-w-full ${
                item.completed
                  ? 'border-stone-200/60 dark:border-stone-800/60 bg-stone-50/50 dark:bg-stone-950/40 text-stone-400'
                  : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-teal-500/50'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3 truncate min-w-0 flex-1">
                <button
                  onClick={() => toggleItemComplete(item.id)}
                  className="text-stone-400 hover:text-teal-600 shrink-0 transition-colors"
                  title={item.completed ? 'Mark incomplete' : 'Mark complete'}
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                </button>
                <span className="font-mono text-stone-500 dark:text-stone-400 shrink-0 font-medium text-[11px] sm:text-xs">
                  {item.startTime} - {item.endTime}
                </span>
                <span className={`font-semibold truncate min-w-0 ${item.completed ? 'line-through text-stone-400' : 'text-stone-900 dark:text-stone-100'}`}>
                  {item.title}
                </span>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <span className="text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 capitalize font-medium">
                  {item.category}
                </span>
                {!item.completed && (
                  <button
                    onClick={() => startZenMode(item)}
                    className="p-1 rounded-md text-stone-400 hover:text-teal-600 transition-colors"
                    title="Start Zen Focus"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
