import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MentalBandwidthMeter } from './MentalBandwidthMeter';
import {
  BarChart2,
  TrendingUp,
  Smile,
  Zap,
  Shield,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Clock,
  Heart,
  Sparkles,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const {
    reflections,
    addReflection,
    todayReflection,
    shiftItemToEvening,
    timetable,
  } = useApp();

  // 10-second reflection slider state
  const [energyLevel, setEnergyLevel] = useState(todayReflection?.energyLevel || 4);
  const [focusLevel, setFocusLevel] = useState(todayReflection?.focusLevel || 4);
  const [stressLevel, setStressLevel] = useState(todayReflection?.stressLevel || 2);
  const [noteText, setNoteText] = useState(todayReflection?.note || '');
  const [submitted, setSubmitted] = useState(!!todayReflection);

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    addReflection(energyLevel, focusLevel, stressLevel, noteText);
    setSubmitted(true);
  };

  // Behavioral nudge examples based on B.Tech realities
  const gentleNudges = [
    {
      title: 'Post-Lab Energy Slump Detected',
      insight: 'Your attention tends to dip sharply between 3:00 PM and 4:30 PM on days with 3-hour labs.',
      actionText: 'Auto-schedule a 25-minute Chill Block after lab instead of heavy theory',
      applied: true,
    },
    {
      title: 'Thursday Habit Realignment',
      insight: 'You usually skip your gym session on Thursdays due to Operating Systems lab assignments.',
      actionText: 'Moved Thursday fitness habit to Saturday morning (a lighter day)',
      applied: true,
    },
    {
      title: 'Golden Focus Window',
      insight: 'Your highest uninterrupted focus occurs between 8:00 AM – 9:00 AM (pre-lecture hours).',
      actionText: 'Keep reserving this slot for daily LeetCode/DSA problem solving',
      applied: true,
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Real-Time Mental Energy & Cognitive Load Engine */}
      <MentalBandwidthMeter />

      {/* 10-Second End-of-Day Reflection Card */}
      <div className="rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
              10-Second Daily Cognitive Reflection
            </h3>
          </div>
          {submitted && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Calibrated for tomorrow</span>
            </span>
          )}
        </div>

        <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
          A quick slider check-in feeds into your Mental Bandwidth Engine so tomorrow's schedule auto-adjusts to your fatigue levels without guilt.
        </p>

        <form onSubmit={handleSaveReflection} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Energy Slider */}
            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-stone-700 dark:text-stone-300">Physical Energy</span>
                <span className="font-mono text-teal-700 dark:text-teal-400 font-bold">{energyLevel}/5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={energyLevel}
                onChange={(e) => {
                  setEnergyLevel(Number(e.target.value));
                  setSubmitted(false);
                }}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>Drained</span>
                <span>Vibrant</span>
              </div>
            </div>

            {/* Mental Focus Slider */}
            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-stone-700 dark:text-stone-300">Mental Focus</span>
                <span className="font-mono text-teal-700 dark:text-teal-400 font-bold">{focusLevel}/5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={focusLevel}
                onChange={(e) => {
                  setFocusLevel(Number(e.target.value));
                  setSubmitted(false);
                }}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>Scattered</span>
                <span>Deep Flow</span>
              </div>
            </div>

            {/* Cognitive Stress Slider */}
            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-stone-700 dark:text-stone-300">Academic Pressure</span>
                <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">{stressLevel}/5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={stressLevel}
                onChange={(e) => {
                  setStressLevel(Number(e.target.value));
                  setSubmitted(false);
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>Calm</span>
                <span>Exam Overload</span>
              </div>
            </div>

          </div>

          {/* Quick optional note */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              value={noteText}
              onChange={(e) => {
                setNoteText(e.target.value);
                setSubmitted(false);
              }}
              placeholder="Optional: How did your coursework and habits feel today?"
              className="w-full sm:flex-1 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 px-3.5 py-2 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:border-teal-500"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 text-xs font-semibold shrink-0 transition-colors shadow-xs"
            >
              {submitted ? 'Update Reflection' : 'Save & Balance Tomorrow'}
            </button>
          </div>
        </form>
      </div>

      {/* Gentle Nudges Section (Actionable, Non-Judgmental Insights) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900 dark:text-stone-100">
            Gentle Behavioral Nudges
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gentleNudges.map((nudge, index) => (
            <div
              key={index}
              className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 shadow-xs space-y-2.5 flex flex-col justify-between"
            >
              <div>
                <h4 className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                  {nudge.title}
                </h4>
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  {nudge.insight}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px] text-teal-800 dark:text-teal-300 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                <span className="leading-tight">{nudge.actionText}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Energy & Focus Trend */}
      <div className="rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-teal-700 dark:text-teal-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900 dark:text-stone-100">
              Cognitive Rhythm Over Time
            </h3>
          </div>
          <span className="text-xs text-stone-400 font-mono">Past 7 Days Consistency</span>
        </div>

        {/* Minimal visual graph bar representation */}
        <div className="grid grid-cols-7 gap-2 pt-2">
          {['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Today'].map((day, idx) => {
            const heights = [70, 85, 90, 60, 80, 75, 88];
            const loadHeight = heights[idx];
            return (
              <div key={day} className="flex flex-col items-center gap-2">
                <div className="w-full bg-stone-100 dark:bg-stone-800 h-28 rounded-xl flex items-end p-1 overflow-hidden">
                  <div
                    className={`w-full rounded-lg transition-all duration-500 ${
                      idx === 6
                        ? 'bg-linear-to-t from-teal-600 to-emerald-500'
                        : 'bg-stone-300 dark:bg-stone-700'
                    }`}
                    style={{ height: `${loadHeight}%` }}
                  />
                </div>
                <span className={`text-[11px] ${idx === 6 ? 'font-bold text-teal-700 dark:text-teal-400' : 'text-stone-400'}`}>
                  {day}
                </span>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
          <span>Weekly Focus Score: <strong className="text-stone-800 dark:text-stone-200 font-mono">82%</strong></span>
          <span>Zero guilt adjustments logged: <strong className="text-teal-700 dark:text-teal-400 font-mono">4</strong></span>
        </div>
      </div>

    </div>
  );
};
