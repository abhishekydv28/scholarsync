import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Plus,
  Users,
  Coffee,
  HelpCircle,
  Flame,
  Percent,
} from 'lucide-react';

export const AttendanceTracker: React.FC = () => {
  const {
    attendance,
    markAttendance,
    adjustAttendanceCount,
    calculateBunkStatus,
    overallAttendancePercentage,
  } = useApp();

  const [medicalBuffer, setMedicalBuffer] = useState(false);
  const targetThreshold = medicalBuffer ? 65 : 75;

  const isOverallSafe = overallAttendancePercentage >= targetThreshold;

  return (
    <div className="space-y-6">
      
      {/* Top Banner: 75% Attendance War Room with College Banter */}
      <div className="rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 p-5 shadow-xs backdrop-blur-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse" />
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <span>75% Criteria & Bunk Calculator</span>
                <span className="text-xs font-normal text-stone-500 font-mono">
                  (Engineering Survival Mode)
                </span>
              </h2>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300">
              "Engineering me aaye aur 75% attendance ke peeche na bhaage toh kya engineering ki!"
              Live tracking so you know exactly when to attend and when it's safe to chill at the canteen.
            </p>
          </div>

          {/* Aggregate Attendance Ring & Tagline */}
          <div className="flex items-center gap-4 shrink-0 bg-stone-50 dark:bg-stone-800/80 p-3 rounded-2xl border border-stone-200/70 dark:border-stone-700/60">
            <div className="text-right">
              <div className="text-[11px] uppercase font-mono tracking-wider text-stone-500 dark:text-stone-400">
                Aggregate Score
              </div>
              <div className="text-2xl font-bold font-mono tracking-tight flex items-baseline justify-end gap-1">
                <span className={isOverallSafe ? 'text-teal-700 dark:text-teal-400' : 'text-rose-600 dark:text-rose-400'}>
                  {overallAttendancePercentage}%
                </span>
                <span className="text-xs text-stone-400">/ {targetThreshold}% target</span>
              </div>
            </div>

            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm ${
              isOverallSafe
                ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
            }`}>
              {isOverallSafe ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
            </div>
          </div>

        </div>

        {/* Options Row: Medical Buffer Toggle & Quick Relatable Tips */}
        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMedicalBuffer(!medicalBuffer)}
              className={`px-3 py-1.5 rounded-xl border font-medium transition-all flex items-center gap-1.5 ${
                medicalBuffer
                  ? 'border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200'
                  : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
              }`}
            >
              <span>Medical / Cultural Fest Buffer (65% Criterion)</span>
              {medicalBuffer && <span className="font-mono text-[10px] bg-amber-200/80 dark:bg-amber-900 px-1.5 py-0.5 rounded-sm">Active</span>}
            </button>
          </div>

          <div className="text-stone-500 dark:text-stone-400 text-xs italic">
            {isOverallSafe
              ? '✨ Chill zone safe! Par HOD ki class me risk mat lena.'
              : '🚨 Warning: HOD ki debar list aane se pehle attendance sudhaar lo!'}
          </div>

        </div>
      </div>

      {/* Subject-Wise Attendance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {attendance.map((sub) => {
          const calc = calculateBunkStatus(sub.attendedClasses, sub.totalClasses, targetThreshold);
          const isDanger = !calc.isSafe;
          const isBorderline = calc.isSafe && calc.safeToBunk === 0;

          return (
            <div
              key={sub.subjectId}
              className={`rounded-2xl border p-5 transition-all shadow-xs flex flex-col justify-between ${
                isDanger
                  ? 'border-rose-200 bg-rose-50/30 dark:border-rose-900/60 dark:bg-rose-950/20'
                  : isBorderline
                  ? 'border-amber-200 bg-amber-50/20 dark:border-amber-900/50 dark:bg-amber-950/20'
                  : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900'
              }`}
            >
              
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-1">
                      <span className="font-mono font-semibold text-stone-700 dark:text-stone-300">
                        {sub.subjectCode}
                      </span>
                      {sub.isLab && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-indigo-600 dark:text-indigo-400 font-medium">Lab Viva Eligible</span>
                        </>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      {sub.subjectName}
                    </h3>
                    {sub.professorName && (
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                        Faculty: {sub.professorName}
                      </p>
                    )}
                  </div>

                  {/* Percentage badge */}
                  <div className="text-right shrink-0">
                    <div className={`text-xl font-bold font-mono tracking-tight ${
                      isDanger
                        ? 'text-rose-600 dark:text-rose-400'
                        : isBorderline
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-teal-700 dark:text-teal-400'
                    }`}>
                      {calc.percentage}%
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                      {sub.attendedClasses}/{sub.totalClasses} Classes
                    </div>
                  </div>
                </div>

                {/* Progress Bar with 75% indicator line */}
                <div className="relative mt-3 h-2.5 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isDanger
                        ? 'bg-rose-500'
                        : isBorderline
                        ? 'bg-amber-500'
                        : 'bg-teal-600'
                    }`}
                    style={{ width: `${Math.min(100, calc.percentage)}%` }}
                  />
                  {/* Subtle 75% marker */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-stone-900 dark:bg-stone-100 z-10 opacity-40"
                    style={{ left: `${targetThreshold}%` }}
                    title={`Target: ${targetThreshold}%`}
                  />
                </div>

                {/* Relatable Bunk vs Attend Insight Banner */}
                <div className={`mt-3 p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                  isDanger
                    ? 'bg-rose-100/70 text-rose-900 dark:bg-rose-950/60 dark:text-rose-200 border border-rose-200 dark:border-rose-900'
                    : isBorderline
                    ? 'bg-amber-100/70 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200 border border-amber-200 dark:border-amber-900'
                    : 'bg-teal-50 text-teal-900 dark:bg-teal-950/50 dark:text-teal-200 border border-teal-200/60 dark:border-teal-900/60'
                }`}>
                  {isDanger ? (
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                  )}
                  <span className="font-medium">{calc.statusLabel}</span>
                </div>
              </div>

              {/* Bottom Quick Controls: Attended (+) vs Bunked (-) */}
              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
                
                {/* Manual Adjust Buttons */}
                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                  <span>Count:</span>
                  <button
                    onClick={() => adjustAttendanceCount(sub.subjectId, sub.attendedClasses - 1, sub.totalClasses - 1)}
                    disabled={sub.attendedClasses <= 0}
                    className="w-6 h-6 rounded-md bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 flex items-center justify-center font-bold text-stone-700 dark:text-stone-300 disabled:opacity-40"
                    title="Undo 1 class"
                  >
                    -
                  </button>
                  <button
                    onClick={() => adjustAttendanceCount(sub.subjectId, sub.attendedClasses + 1, sub.totalClasses + 1)}
                    className="w-6 h-6 rounded-md bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 flex items-center justify-center font-bold text-stone-700 dark:text-stone-300"
                    title="Add 1 class"
                  >
                    +
                  </button>
                </div>

                {/* Main Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => markAttendance(sub.subjectId, 'absent')}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950/60 transition-colors border border-rose-200 dark:border-rose-900/60 flex items-center gap-1"
                    title="Missed / Bunked this class"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Bunked</span>
                  </button>

                  <button
                    onClick={() => markAttendance(sub.subjectId, 'present')}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-teal-800 text-stone-100 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600 transition-colors shadow-xs flex items-center gap-1"
                    title="Attended lecture / Proxy marked"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-teal-300" />
                    <span>Attended (+1)</span>
                  </button>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* Engineering Attendance Golden Rules */}
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-900/50 p-5 space-y-3">
        <div className="flex items-center gap-2 text-stone-800 dark:text-stone-200 font-semibold text-xs">
          <Coffee className="w-4 h-4 text-teal-600" />
          <span>B.Tech Campus Wisdom: The 75% Formula Hacks</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-600 dark:text-stone-300">
          <div className="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700/60 space-y-1">
            <span className="font-semibold text-stone-900 dark:text-stone-100">1. Lab Sessions are Sacred</span>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Lab credits carry heavy internal marks and external viva weightage. Never bunk practicals.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700/60 space-y-1">
            <span className="font-semibold text-stone-900 dark:text-stone-100">2. Keep a 3-Lecture Cushion</span>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Don't sit exactly at 75.0%. Keep 78-80% so unexpected illness or placement drives don't debar you.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700/60 space-y-1">
            <span className="font-semibold text-stone-900 dark:text-stone-100">3. College Fest Buffer</span>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Check if your university allows 65% with official medical or cultural committee certificates.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
