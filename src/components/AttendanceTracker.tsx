import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Plus,
  Sliders,
  Info,
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
    <div className="space-y-6">
      
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/80 dark:border-stone-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Attendance & Debarment Risk Tracker
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            SATI Autonomous regulations: Minimum 75% attendance required in theory & laboratory sessions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMedicalBuffer(!medicalBuffer)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              medicalBuffer
                ? 'border-amber-500/80 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200'
                : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-850 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
            }`}
          >
            <span>Medical / Fest Buffer (65%)</span>
            {medicalBuffer && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
          </button>
        </div>
      </div>

      {/* 2. Aggregate Metric Summary (Single Elevation) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Metric 1: Aggregate Percentage */}
        <div className="p-4 rounded-xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-[#0c1017] shadow-xs">
          <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center justify-between">
            <span>Overall Attendance</span>
            {isOverallSafe ? (
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            )}
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900 dark:text-stone-100 mt-1 tabular-nums">
            {simulatedBunks > 0 ? simulatedPercentage : overallAttendancePercentage}%
          </div>
          <div className="text-[11px] text-stone-400 mt-1 font-mono">
            Target: ≥{targetThreshold}% Threshold
          </div>
        </div>

        {/* Metric 2: Classes Attended */}
        <div className="p-4 rounded-xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-[#0c1017] shadow-xs">
          <div className="text-xs text-stone-500 dark:text-stone-400">Classes Attended</div>
          <div className="text-2xl font-bold font-mono text-stone-900 dark:text-stone-100 mt-1 tabular-nums">
            {totalAttended}
          </div>
          <div className="text-[11px] text-stone-400 mt-1 font-mono">
            Across {attendance.length} enrolled subjects
          </div>
        </div>

        {/* Metric 3: Total Conducted */}
        <div className="p-4 rounded-xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-[#0c1017] shadow-xs">
          <div className="text-xs text-stone-500 dark:text-stone-400">Total Conducted</div>
          <div className="text-2xl font-bold font-mono text-stone-900 dark:text-stone-100 mt-1 tabular-nums">
            {totalConducted}
          </div>
          <div className="text-[11px] text-stone-400 mt-1 font-mono">
            {totalConducted === 0 ? 'Fresh semester start' : `${totalConducted - totalAttended} missed`}
          </div>
        </div>

        {/* Metric 4: Debar Status */}
        <div className="p-4 rounded-xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-[#0c1017] shadow-xs">
          <div className="text-xs text-stone-500 dark:text-stone-400">Exam Eligibility</div>
          <div className={`text-base font-bold mt-1.5 ${isOverallSafe ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
            {isOverallSafe ? 'Eligible for End-Sem' : 'Debar Risk Warning'}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            {isOverallSafe ? 'Safe to sit for examinations' : 'Attend upcoming lectures immediately'}
          </div>
        </div>

      </div>

      {/* 3. Projection & Bunk Simulation Tool */}
      <div className="p-4 rounded-xl border border-stone-200/90 dark:border-stone-800 bg-stone-50/60 dark:bg-[#0e141f] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center shrink-0">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
              Absence Impact Simulator
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Test how missing upcoming lectures will affect your aggregate percentage.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-stone-600 dark:text-stone-300 whitespace-nowrap">
            Simulate skipping {simulatedBunks} classes:
          </span>
          <input
            type="range"
            min="0"
            max="12"
            value={simulatedBunks}
            onChange={(e) => setSimulatedBunks(Number(e.target.value))}
            className="w-32 sm:w-40 accent-stone-900 dark:accent-stone-100 cursor-pointer"
          />
          {simulatedBunks > 0 && (
            <button
              onClick={() => setSimulatedBunks(0)}
              className="text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 underline cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* 4. Subject-Wise Attendance Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {attendance.map((sub) => {
          const calc = calculateBunkStatus(sub.attendedClasses, sub.totalClasses, targetThreshold);
          const isDanger = !calc.isSafe;

          return (
            <div
              key={sub.subjectId}
              className={`rounded-xl border p-4 transition-all shadow-xs flex flex-col justify-between ${
                isDanger
                  ? 'border-rose-300/80 bg-rose-50/20 dark:border-rose-900/50 dark:bg-rose-950/10'
                  : 'border-stone-200/90 dark:border-stone-800 bg-white dark:bg-[#0c1017]'
              }`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs font-mono text-stone-500 mb-0.5">
                      <span className="font-bold text-stone-800 dark:text-stone-200">
                        {sub.subjectCode}
                      </span>
                      {sub.isLab && (
                        <>
                          <span>·</span>
                          <span className="text-stone-600 dark:text-stone-400">Practical Lab</span>
                        </>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">
                      {sub.subjectName}
                    </h3>
                    {sub.professorName && (
                      <p className="text-[11px] text-stone-400 font-mono mt-0.5">
                        Faculty: {sub.professorName}
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <div className={`text-xl font-bold font-mono tabular-nums ${
                      isDanger ? 'text-rose-600 dark:text-rose-400' : 'text-stone-900 dark:text-stone-100'
                    }`}>
                      {calc.percentage}%
                    </div>
                    <div className="text-[11px] text-stone-400 font-mono">
                      {sub.attendedClasses}/{sub.totalClasses} classes
                    </div>
                  </div>
                </div>

                {/* Minimal Progress Bar */}
                <div className="mt-3 h-1.5 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isDanger ? 'bg-rose-500' : 'bg-stone-900 dark:bg-stone-100'
                    }`}
                    style={{ width: `${Math.min(100, calc.percentage)}%` }}
                  />
                </div>

                {/* Status Message */}
                <div className="mt-2.5 flex items-center gap-1.5 text-xs">
                  {isDanger ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  )}
                  <span className={isDanger ? 'text-rose-700 dark:text-rose-300 font-medium' : 'text-stone-600 dark:text-stone-400'}>
                    {calc.statusLabel}
                  </span>
                </div>
              </div>

              {/* Bottom Quick Controls */}
              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between gap-2">
                
                {/* Manual Adjustments */}
                <div className="flex items-center gap-1 text-xs text-stone-500">
                  <span className="text-[11px]">Edit:</span>
                  <button
                    onClick={() => adjustAttendanceCount(sub.subjectId, sub.attendedClasses - 1, sub.totalClasses - 1)}
                    disabled={sub.attendedClasses <= 0}
                    className="w-6 h-6 rounded border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center font-mono font-bold text-xs disabled:opacity-30 cursor-pointer"
                    title="Subtract 1 attended"
                  >
                    -
                  </button>
                  <button
                    onClick={() => adjustAttendanceCount(sub.subjectId, sub.attendedClasses + 1, sub.totalClasses + 1)}
                    className="w-6 h-6 rounded border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center font-mono font-bold text-xs cursor-pointer"
                    title="Add 1 attended"
                  >
                    +
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleMarkAbsent(sub.subjectId)}
                    className="px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 text-stone-700 dark:text-stone-300 text-xs font-medium transition-colors cursor-pointer"
                  >
                    Missed (+0)
                  </button>
                  <button
                    onClick={() => handleMarkPresent(sub.subjectId)}
                    className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-950 text-xs font-semibold transition-colors shadow-xs cursor-pointer"
                  >
                    Attended (+1)
                  </button>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* 5. Institutional Attendance Policy Notes */}
      <div className="rounded-xl border border-stone-200/90 dark:border-stone-800 bg-stone-50/40 dark:bg-[#0c1017] p-4 text-xs text-stone-600 dark:text-stone-400 space-y-2">
        <div className="flex items-center gap-2 text-stone-800 dark:text-stone-200 font-semibold">
          <Info className="w-4 h-4 text-stone-500" />
          <span>SATI Vidisha Attendance Regulations</span>
        </div>
        <p className="leading-relaxed">
          Students falling below 75% in any course at the time of examination form submission are listed under the Debarment Notice. In genuine medical cases or authorized participation in institute cultural/sports events, the Academic Council may grant condonation up to 10% (reducing threshold to 65%), subject to submission of valid documents within 3 working days.
        </p>
      </div>

    </div>
  );
};
