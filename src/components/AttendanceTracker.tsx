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
  Sliders,
  Sparkles,
} from 'lucide-react';
import { playTaskCompleteSound } from '../utils/audioSynth';

export const AttendanceTracker: React.FC = () => {
  const {
    attendance,
    markAttendance,
    adjustAttendanceCount,
    calculateBunkStatus,
    overallAttendancePercentage,
  } = useApp();

  const [medicalBuffer, setMedicalBuffer] = useState(false);
  const [simulatedBunks, setSimulatedBunks] = useState(0);

  const targetThreshold = medicalBuffer ? 65 : 75;

  // Calculate simulated overall attendance
  const totalAttended = attendance.reduce((sum, a) => sum + a.attendedClasses, 0);
  const totalConducted = attendance.reduce((sum, a) => sum + a.totalClasses, 0);
  const simulatedConducted = totalConducted + simulatedBunks;
  const simulatedPercentage = simulatedConducted > 0 
    ? Math.round((totalAttended / simulatedConducted) * 100) 
    : overallAttendancePercentage;

  const isOverallSafe = (simulatedBunks > 0 ? simulatedPercentage : overallAttendancePercentage) >= targetThreshold;

  const handleMarkPresent = (subjectId: string) => {
    markAttendance(subjectId, 'present');
    playTaskCompleteSound();
  };

  const handleMarkAbsent = (subjectId: string) => {
    markAttendance(subjectId, 'absent');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner: 75% Attendance War Room with College Banter */}
      <div className="rounded-3xl border border-stone-200/90 dark:border-stone-800 bg-white/90 dark:bg-[#0c1017] p-5 sm:p-6 shadow-sm backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                <Flame className="w-3.5 h-3.5 fill-current animate-pulse text-orange-500" />
                <span>75% Attendance War Room</span>
              </span>
              <span className="text-stone-300 dark:text-stone-700">•</span>
              <span className="text-xs font-mono text-stone-500 dark:text-stone-400">Survival Calculator</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
              Canteen vs. Classroom Radar
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              "Engineering me aaye aur 75% attendance ke peeche na bhaage toh kya engineering ki!"
              Know exactly which lectures you can safely skip for coding sprints or canteen chai without getting debarred by the HOD.
            </p>
          </div>

          {/* Aggregate Attendance Ring & Tagline */}
          <div className="flex items-center gap-4 shrink-0 bg-stone-50 dark:bg-[#0e141f] p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800">
            <div className="text-right">
              <div className="text-[11px] uppercase font-mono tracking-wider text-stone-500 dark:text-stone-400 font-semibold">
                {simulatedBunks > 0 ? 'Simulated Score' : 'Aggregate Score'}
              </div>
              <div className="text-3xl font-extrabold font-mono tracking-tight flex items-baseline justify-end gap-1">
                <span className={isOverallSafe ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                  {simulatedBunks > 0 ? simulatedPercentage : overallAttendancePercentage}%
                </span>
                <span className="text-xs text-stone-400 font-normal">/ {targetThreshold}%</span>
              </div>
            </div>

            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shadow-xs ${
              isOverallSafe
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/40'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300/40'
            }`}>
              {isOverallSafe ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
            </div>
          </div>

        </div>

        {/* Interactive What-If Bunk Simulator Bar */}
        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-stone-50 via-emerald-50/30 to-stone-50 dark:from-[#0f1522] dark:via-[#0c1822] dark:to-[#0f1522] border border-stone-200/80 dark:border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <span>"What If I Bunk?" Simulator</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">Live</span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Simulate missing upcoming lectures to test if your score stays safely above 75%.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-semibold text-stone-600 dark:text-stone-300 shrink-0">
              Skip {simulatedBunks} classes:
            </span>
            <input
              type="range"
              min="0"
              max="8"
              value={simulatedBunks}
              onChange={(e) => setSimulatedBunks(Number(e.target.value))}
              className="w-28 sm:w-36 accent-emerald-600 cursor-pointer"
            />
            {simulatedBunks > 0 && (
              <button
                onClick={() => setSimulatedBunks(0)}
                className="text-[10px] font-mono text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 underline cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Options Row: Medical Buffer Toggle & Quick Relatable Tips */}
        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMedicalBuffer(!medicalBuffer)}
              className={`px-3 py-1.5 rounded-xl border font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
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
              ? '✨ Chill zone safe! Canteen samosa khane jaa sakte ho, par labs mat chhodna.'
              : '🚨 Debar danger! HOD ki red list se bachne ke liye agle 3-4 lectures attend karo.'}
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
              className={`rounded-3xl border p-5 transition-all shadow-xs flex flex-col justify-between ${
                isDanger
                  ? 'border-rose-300/80 bg-rose-50/40 dark:border-rose-900/60 dark:bg-rose-950/20'
                  : isBorderline
                  ? 'border-amber-300/80 bg-amber-50/30 dark:border-amber-900/50 dark:bg-amber-950/20'
                  : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-[#0c1017] hover:border-emerald-500/40'
              }`}
            >
              
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-1">
                      <span className="font-mono font-bold text-stone-800 dark:text-stone-200">
                        {sub.subjectCode}
                      </span>
                      {sub.isLab && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-cyan-600 dark:text-cyan-400 font-medium">Lab Viva Eligible</span>
                        </>
                      )}
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100">
                      {sub.subjectName}
                    </h3>
                    {sub.professorName && (
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 font-mono">
                        Faculty: {sub.professorName}
                      </p>
                    )}
                  </div>

                  {/* Percentage badge */}
                  <div className="text-right shrink-0">
                    <div className={`text-2xl font-extrabold font-mono tracking-tight ${
                      isDanger
                        ? 'text-rose-600 dark:text-rose-400'
                        : isBorderline
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {calc.percentage}%
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 font-mono font-medium">
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
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, calc.percentage)}%` }}
                  />
                </div>

                {/* Bunk Status Message */}
                <div className="mt-3 flex items-center gap-1.5 text-xs">
                  {isDanger ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                  ) : isBorderline ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  ) : (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  )}
                  <span className={`font-semibold ${
                    isDanger ? 'text-rose-700 dark:text-rose-300' : isBorderline ? 'text-amber-700 dark:text-amber-300' : 'text-emerald-700 dark:text-emerald-300'
                  }`}>
                    {calc.statusLabel}
                  </span>
                </div>
              </div>

              {/* Bottom Quick Controls: Attended (+) vs Bunked (-) */}
              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between gap-2">
                
                {/* Manual Adjust Buttons */}
                <div className="flex items-center gap-1 text-xs text-stone-500">
                  <span className="font-mono text-[11px]">Adjust:</span>
                  <button
                    onClick={() => adjustAttendanceCount(sub.subjectId, sub.attendedClasses - 1, sub.totalClasses - 1)}
                    disabled={sub.attendedClasses <= 0}
                    className="w-6 h-6 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 flex items-center justify-center font-bold text-stone-700 dark:text-stone-300 disabled:opacity-40 cursor-pointer"
                    title="Undo 1 class"
                  >
                    -
                  </button>
                  <button
                    onClick={() => adjustAttendanceCount(sub.subjectId, sub.attendedClasses + 1, sub.totalClasses + 1)}
                    className="w-6 h-6 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 flex items-center justify-center font-bold text-stone-700 dark:text-stone-300 cursor-pointer"
                    title="Add 1 class"
                  >
                    +
                  </button>
                </div>

                {/* Main Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleMarkAbsent(sub.subjectId)}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950/60 transition-colors border border-rose-200 dark:border-rose-900/60 flex items-center gap-1 cursor-pointer"
                    title="Missed / Bunked this class"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Bunked</span>
                  </button>

                  <button
                    onClick={() => handleMarkPresent(sub.subjectId)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-all shadow-xs flex items-center gap-1 active:scale-95 cursor-pointer"
                    title="Attended lecture / Proxy marked"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-200" />
                    <span>Attended (+1)</span>
                  </button>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* Engineering Attendance Golden Rules */}
      <div className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-[#0c1017] p-5 space-y-3">
        <div className="flex items-center gap-2 text-stone-800 dark:text-stone-200 font-bold text-xs uppercase font-mono tracking-wider">
          <Coffee className="w-4 h-4 text-emerald-600" />
          <span>B.Tech Campus Wisdom: The 75% Formula Hacks</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-600 dark:text-stone-300">
          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0e141f] border border-stone-200/60 dark:border-stone-800 space-y-1">
            <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1">
              <span>1. Lab Sessions are Sacred</span>
            </span>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Lab credits carry heavy internal marks and external viva weightage. Never bunk practicals.
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0e141f] border border-stone-200/60 dark:border-stone-800 space-y-1">
            <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1">
              <span>2. Keep a 3-Lecture Cushion</span>
            </span>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Don't sit exactly at 75.0%. Keep 78-80% so unexpected illness or placement drives don't debar you.
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0e141f] border border-stone-200/60 dark:border-stone-800 space-y-1">
            <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1">
              <span>3. College Fest Buffer</span>
            </span>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Check if your university allows 65% with official medical or cultural committee certificates.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
