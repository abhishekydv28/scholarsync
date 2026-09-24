import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TimetableItem } from '../types';
import {
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Coffee,
  BookOpen,
  Laptop,
  Flame,
  Plus,
  X,
  Play,
  RotateCcw,
} from 'lucide-react';

export const DailyTimeline: React.FC = () => {
  const {
    timetable,
    toggleItemComplete,
    snoozeItem,
    shiftItemToEvening,
    recalibrateSchedule,
    isRecalibrating,
    recalibrateNotice,
    clearRecalibrateNotice,
    startZenMode,
    setSelectedResourceForModal,
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'study' | 'habit' | 'chill'>('all');
  const [activeShiftMenuId, setActiveShiftMenuId] = useState<string | null>(null);

  const filteredItems = timetable.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'study') return item.category === 'study' || item.category === 'lecture' || item.category === 'lab';
    if (filter === 'habit') return item.category === 'habit';
    if (filter === 'chill') return item.category === 'chill';
    return true;
  });

  const getCategoryMeta = (category: TimetableItem['category']) => {
    switch (category) {
      case 'lecture':
        return { label: 'Lecture', icon: BookOpen, color: 'text-sky-600 dark:text-sky-400' };
      case 'lab':
        return { label: 'College Lab', icon: Laptop, color: 'text-indigo-600 dark:text-indigo-400' };
      case 'study':
        return { label: 'Deep Study', icon: Flame, color: 'text-emerald-600 dark:text-emerald-400' };
      case 'habit':
        return { label: 'Daily Habit', icon: Sparkles, color: 'text-teal-600 dark:text-teal-400' };
      case 'chill':
        return { label: 'Buffer Zone', icon: Coffee, color: 'text-amber-600 dark:text-amber-400' };
      default:
        return { label: 'Task', icon: Clock, color: 'text-stone-600' };
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Dynamic Auto-Correction Notice (Guilt-Free Reassurance) */}
      {recalibrateNotice && (
        <div className="rounded-xl border border-teal-200/80 bg-teal-50/90 dark:border-teal-900/60 dark:bg-teal-950/60 p-3.5 flex items-start justify-between gap-3 text-xs text-teal-900 dark:text-teal-100 transition-all">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-teal-700 dark:text-teal-400 mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold">Gentle Adjustment: </span>
              <span>{recalibrateNotice}</span>
            </div>
          </div>
          <button
            onClick={clearRecalibrateNotice}
            className="text-teal-700 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-200 p-0.5"
            aria-label="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Control Bar: Interactive Tabs & Auto-Recalibration */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        
        {/* Interactive Segmented Controls for Filtering */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800/80 rounded-xl w-fit">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            Full Day ({timetable.length})
          </button>
          <button
            onClick={() => setFilter('study')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filter === 'study'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            Academics
          </button>
          <button
            onClick={() => setFilter('habit')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filter === 'habit'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            Habits
          </button>
          <button
            onClick={() => setFilter('chill')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filter === 'chill'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            Buffer Zones
          </button>
        </div>

        {/* Global Recalibrate Button */}
        <button
          onClick={() => recalibrateSchedule()}
          disabled={isRecalibrating}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isRecalibrating ? 'animate-spin text-teal-600' : ''}`} />
          <span>{isRecalibrating ? 'Recalculating Flow...' : 'Smooth Unfinished Tasks'}</span>
        </button>

      </div>

      {/* Timeline Stream */}
      <div className="relative border-l-2 border-stone-200 dark:border-stone-800 ml-4 sm:ml-6 pl-4 sm:pl-6 space-y-4 pt-2">
        {filteredItems.map((item) => {
          const meta = getCategoryMeta(item.category);
          const Icon = meta.icon;
          const isChill = item.category === 'chill';

          return (
            <div
              key={item.id}
              className={`group relative rounded-xl border transition-all duration-300 ${
                item.completed
                  ? 'border-stone-200/60 bg-stone-50/50 dark:border-stone-800/50 dark:bg-stone-900/30 opacity-60'
                  : isChill
                  ? 'border-amber-200/70 bg-amber-50/40 dark:border-amber-900/40 dark:bg-amber-950/20 shadow-xs'
                  : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xs hover:border-stone-300 dark:hover:border-stone-700'
              } p-4`}
            >
              {/* Timeline Marker Dot on Left Bar */}
              <div
                className={`absolute -left-[25px] sm:-left-[33px] top-5 w-4 h-4 rounded-full border-2 transition-all ${
                  item.completed
                    ? 'bg-emerald-600 border-emerald-600'
                    : isChill
                    ? 'bg-amber-500 border-amber-500'
                    : 'bg-white dark:bg-stone-900 border-stone-400 dark:border-stone-600 group-hover:border-teal-600'
                }`}
              />

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                
                {/* Main Task Content */}
                <div className="flex-1">
                  
                  {/* Clean unboxed metadata with typographic separators */}
                  <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-1">
                    <span className="font-mono font-medium text-stone-700 dark:text-stone-300">
                      {item.startTime} – {item.endTime}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className={`flex items-center gap-1 font-medium ${meta.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                      <span>{meta.label}</span>
                    </span>
                    {item.snoozed && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-amber-600 dark:text-amber-400 font-mono text-[11px]">Snoozed</span>
                      </>
                    )}
                  </div>

                  {/* Title & Strike-through on Complete */}
                  <h3
                    className={`text-sm sm:text-base font-semibold tracking-tight ${
                      item.completed
                        ? 'line-through text-stone-400 dark:text-stone-500'
                        : 'text-stone-900 dark:text-stone-100'
                    }`}
                  >
                    {item.title}
                  </h3>

                  {/* Specific Topic / Viva / Lab Details */}
                  {item.topic && (
                    <p className="mt-1 text-xs text-stone-600 dark:text-stone-300">
                      <span className="font-medium text-stone-700 dark:text-stone-200">Syllabus Topic: </span>
                      {item.topic}
                    </p>
                  )}

                  {/* Notes / Calm Tips */}
                  {item.notes && (
                    <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400 italic">
                      {item.notes}
                    </p>
                  )}

                  {/* Curated YouTube Video / Notes Link Preview */}
                  {item.resource && !item.completed && (
                    <div className="mt-2.5 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedResourceForModal(item.resource)}
                        className="text-xs text-teal-700 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200 flex items-center gap-1.5 transition-colors font-medium text-left truncate"
                      >
                        <Play className="w-3 h-3 text-red-500 shrink-0 fill-current" />
                        <span className="truncate">{item.resource.title}</span>
                        <span className="text-stone-400 text-[11px]">({item.resource.durationOrPages || item.resource.creatorOrAuthor})</span>
                      </button>
                      <a
                        href={item.resource.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                        title="Open resource in new tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}

                </div>

                {/* Right Actions: Complete Check, Zen Focus, Fluid Snooze/Shift */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                  
                  {/* Zen Mode Launcher (for deep work) */}
                  {!item.completed && !isChill && (
                    <button
                      onClick={() => startZenMode(item)}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center gap-1"
                      title="Focus in Zen Mode"
                    >
                      <Play className="w-3 h-3 text-teal-600 fill-current" />
                      <span className="hidden sm:inline">Focus</span>
                    </button>
                  )}

                  {/* Fluid Snooze / Shift Menu */}
                  {!item.completed && (
                    <div className="relative">
                      <button
                        onClick={() =>
                          setActiveShiftMenuId(activeShiftMenuId === item.id ? null : item.id)
                        }
                        className="px-2 py-1 rounded-lg text-xs text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center gap-1"
                        title="Shift or delay task without guilt"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Shift</span>
                      </button>

                      {/* Dropdown Options */}
                      {activeShiftMenuId === item.id && (
                        <div className="absolute right-0 mt-1 w-48 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-lg py-1.5 z-20 text-xs">
                          <button
                            onClick={() => {
                              snoozeItem(item.id, 30);
                              setActiveShiftMenuId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 flex items-center justify-between"
                          >
                            <span>Snooze +30 mins</span>
                            <ArrowRight className="w-3 h-3 text-stone-400" />
                          </button>
                          <button
                            onClick={() => {
                              shiftItemToEvening(item.id);
                              setActiveShiftMenuId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 flex items-center justify-between"
                          >
                            <span>Move to Evening Review</span>
                            <ArrowRight className="w-3 h-3 text-stone-400" />
                          </button>
                          <button
                            onClick={() => {
                              recalibrateSchedule(item.title);
                              setActiveShiftMenuId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/40 flex items-center justify-between font-medium"
                          >
                            <span>Auto-Recalibrate Day</span>
                            <Sparkles className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Primary Complete Button */}
                  <button
                    onClick={() => toggleItemComplete(item.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      item.completed
                        ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                        : 'text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                    title={item.completed ? 'Mark incomplete' : 'Complete task'}
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                </div>

              </div>

            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 border border-dashed border-stone-300 dark:border-stone-800 rounded-2xl">
          <p className="text-xs text-stone-500">No items match this filter.</p>
        </div>
      )}

    </div>
  );
};
