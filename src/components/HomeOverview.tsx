import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  ArrowRight,
  CheckCircle2,
  Circle,
  Calendar,
  CalendarPlus,
  BookOpen,
  Sliders,
  ShieldCheck,
  ShieldAlert,
  Flame,
  CheckSquare,
  Square,
  ChevronRight,
  GraduationCap,
  FileText,
} from 'lucide-react';
import { MonthlyAcademicCalendar } from './MonthlyAcademicCalendar';
import { ScheduleTaskModal } from './ScheduleTaskModal';
import { StreakModal } from './StreakModal';
import { XpModal } from './XpModal';

export const HomeOverview: React.FC = () => {
  const {
    profile,
    timetable,
    subjects,
    attendance,
    overallAttendancePercentage,
    setActiveView,
    toggleItemComplete,
    setIsPersonalizationWizardOpen,
    userStreak,
    userXp,
  } = useApp();

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [isXpModalOpen, setIsXpModalOpen] = useState(false);

  const completedCount = timetable.filter((item) => item.completed).length;
  const totalCount = timetable.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // College hours items (10:30 - 17:30)
  const collegeItems = timetable.filter((t) => t.category === 'lecture' || t.category === 'lab');

  const isAttendanceSafe = overallAttendancePercentage >= 75;

  const totalAttended = attendance.reduce((acc, a) => acc + a.attendedClasses, 0);
  const totalConducted = attendance.reduce((acc, a) => acc + a.totalClasses, 0);

  return (
    <>
      <div className="space-y-6">

        {/* 1. Page Header (Clean, Authentic Academic Dashboard) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/80 dark:border-stone-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              {profile.name ? `Welcome, ${profile.name}` : 'Student Academic Overview'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
              Semester {profile.semester} · B.Tech Computer Science & Engineering · SATI Vidisha (Autonomous)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPersonalizationWizardOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-850 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-medium transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Customize Plan</span>
            </button>
            <button
              onClick={() => setIsScheduleModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-950 text-xs font-semibold transition-colors shadow-xs cursor-pointer"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>+ Add Task</span>
            </button>
          </div>
        </div>

        {/* 2. Key Metrics Row (Clean, single elevation, tabular numbers) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Card 1: Attendance */}
          <div
            onClick={() => setActiveView('attendance')}
            className="p-4 rounded-xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-[#0e141f] transition-all hover:border-stone-300 dark:hover:border-stone-700 cursor-pointer shadow-xs"
          >
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
              <span>Attendance Rate</span>
              {isAttendanceSafe ? (
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              )}
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 font-mono tabular-nums">
                {overallAttendancePercentage}%
              </span>
              <span className="text-xs text-stone-400 font-mono">
                ({totalAttended}/{totalConducted} classes)
              </span>
            </div>
            <div className="mt-2 text-[11px] text-stone-500 dark:text-stone-400 flex items-center justify-between">
              <span>{isAttendanceSafe ? 'Eligible for End-Sem' : '75% Criteria Warning'}</span>
              <span className="text-stone-400 font-mono">≥75% Required</span>
            </div>
          </div>

          {/* Card 2: College Hours */}
          <div className="p-4 rounded-xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-[#0e141f] shadow-xs">
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
              <span>Institute Schedule</span>
              <Clock className="w-4 h-4 text-stone-400" />
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100 font-mono">
                10:30 – 17:30
              </span>
            </div>
            <div className="mt-2 text-[11px] text-stone-500 dark:text-stone-400 flex items-center justify-between">
              <span>SATI Vidisha Fixed Hours</span>
              <span className="text-stone-400 font-mono">{collegeItems.length} Sessions Today</span>
            </div>
          </div>

          {/* Card 3: Today's Tasks */}
          <div
            onClick={() => setActiveView('timeline')}
            className="p-4 rounded-xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-[#0e141f] transition-all hover:border-stone-300 dark:hover:border-stone-700 cursor-pointer shadow-xs"
          >
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
              <span>Today's Progress</span>
              <CheckCircle2 className="w-4 h-4 text-stone-400" />
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 font-mono tabular-nums">
                {completedCount}/{totalCount}
              </span>
              <span className="text-xs text-stone-400 font-mono">Completed</span>
            </div>
            <div className="mt-2.5">
              <div className="w-full h-1.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                <div
                  className="h-full bg-stone-900 dark:bg-stone-100 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Card 4: Academic Streak */}
          <div
            onClick={() => setIsStreakModalOpen(true)}
            className="p-4 rounded-xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-[#0e141f] transition-all hover:border-stone-300 dark:hover:border-stone-700 cursor-pointer shadow-xs"
          >
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
              <span>Day Streak</span>
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 font-mono tabular-nums">
                {userStreak} {userStreak === 1 ? 'Day' : 'Days'}
              </span>
            </div>
            <div className="mt-2 text-[11px] text-stone-500 dark:text-stone-400 flex items-center justify-between">
              <span>{userStreak > 0 ? 'Active consistent study' : 'Starts on account creation'}</span>
              <span className="text-stone-400 font-mono text-[10px]">Tracked daily</span>
            </div>
          </div>

        </div>

        {/* 3. Main Dashboard Layout (2 Columns: 7/12 left, 5/12 right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Today's Schedule & Enrolled Courses (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Section: Today's Routine Schedule */}
            <div className="rounded-xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-[#0c1017] p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-stone-500" />
                  <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    Today's Schedule & Routine
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-stone-400">
                    {completedCount} of {totalCount} completed
                  </span>
                  <button
                    onClick={() => setActiveView('timeline')}
                    className="text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-colors flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Full Day</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Timetable Items List */}
              <div className="divide-y divide-stone-100 dark:divide-stone-800/80 mt-2">
                {timetable.length === 0 ? (
                  <div className="py-8 text-center text-xs text-stone-500">
                    No scheduled routine items. Click "+ Add Task" to plan your day.
                  </div>
                ) : (
                  timetable.map((item) => {
                    const isCollegeTime = item.startTime >= '10:30' && item.endTime <= '17:30';
                    return (
                      <div
                        key={item.id}
                        className={`py-3 flex items-start justify-between gap-3 group transition-colors ${
                          item.completed ? 'opacity-50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <button
                            type="button"
                            onClick={() => toggleItemComplete(item.id)}
                            className="mt-0.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer shrink-0"
                            aria-label={item.completed ? 'Mark incomplete' : 'Mark complete'}
                          >
                            {item.completed ? (
                              <CheckSquare className="w-4 h-4 text-stone-900 dark:text-stone-100" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`text-xs font-medium truncate ${
                                  item.completed
                                    ? 'line-through text-stone-400'
                                    : 'text-stone-900 dark:text-stone-100'
                                }`}
                              >
                                {item.title}
                              </span>

                              {isCollegeTime && (
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                                  Campus
                                </span>
                              )}
                            </div>

                            <div className="text-[11px] text-stone-400 font-mono mt-0.5 flex items-center gap-2">
                              <span>
                                {item.startTime} – {item.endTime}
                              </span>
                              <span>·</span>
                              <span className="capitalize">{item.category}</span>
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <span className="text-[11px] font-mono text-stone-400">
                            {item.cognitiveWeight}h load
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                <span className="text-stone-400">
                  Fixed college schedule: 10:30 AM to 5:30 PM
                </span>
                <button
                  onClick={() => setIsScheduleModalOpen(true)}
                  className="font-semibold text-stone-800 dark:text-stone-200 hover:underline cursor-pointer"
                >
                  + Add Study Block
                </button>
              </div>
            </div>

            {/* Section: Enrolled Courses & Quick Subject Vault */}
            <div className="rounded-xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-[#0c1017] p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-stone-500" />
                  <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    Enrolled Courses (Semester {profile.semester})
                  </h2>
                </div>
                <button
                  onClick={() => setActiveView('academic')}
                  className="text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-colors flex items-center gap-0.5 cursor-pointer font-medium"
                >
                  <span>View All Syllabus & Notes</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {subjects.slice(0, 6).map((sub) => (
                  <div
                    key={sub.id}
                    onClick={() => setActiveView('academic')}
                    className="p-3.5 rounded-lg border border-stone-200/80 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 bg-stone-50/50 dark:bg-stone-900/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-mono text-xs font-bold text-stone-800 dark:text-stone-200">
                        {sub.code}
                      </div>
                      <span className="text-[10px] font-mono text-stone-400">
                        {sub.credits} Credits
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-stone-900 dark:text-stone-100 mt-1 line-clamp-1 group-hover:text-stone-700 dark:group-hover:text-stone-200">
                      {sub.name}
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1.5 flex items-center gap-2">
                      <span>5 Units Syllabus</span>
                      <span>·</span>
                      <span>Notes & PYQs</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Academic Calendar & Institute Notice (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Embedded Clean Calendar Component */}
            <div className="rounded-xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-[#0c1017] p-5 shadow-xs">
              <MonthlyAcademicCalendar />
            </div>

            {/* SATI Academic Rules & Exam Format Card */}
            <div className="rounded-xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-[#0c1017] p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-100 dark:border-stone-800">
                <GraduationCap className="w-4 h-4 text-stone-500" />
                <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider font-mono">
                  SATI Academic Guidelines
                </h3>
              </div>

              <div className="space-y-2 text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-stone-900 dark:text-stone-200 font-mono">1.</span>
                  <span><strong>75% Mandatory Attendance:</strong> Autonomous regulations require a minimum of 75% attendance in theory & practical classes to be eligible for end-semester exams.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-stone-900 dark:text-stone-200 font-mono">2.</span>
                  <span><strong>Marking Scheme:</strong> 70 Marks End-Sem University Theory + 30 Marks Continuous Sessional / Mid-Semester Evaluation.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-stone-900 dark:text-stone-200 font-mono">3.</span>
                  <span><strong>College Timing:</strong> Official lectures and laboratory practicals run from 10:30 AM to 5:30 PM.</span>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                <button
                  onClick={() => setActiveView('attendance')}
                  className="text-stone-800 dark:text-stone-200 hover:underline font-semibold cursor-pointer"
                >
                  Check Bunk Limits →
                </button>
                <button
                  onClick={() => setActiveView('academic')}
                  className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-300 cursor-pointer"
                >
                  Download Syllabus PDF
                </button>
              </div>
            </div>

          </div>

        </div>

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
