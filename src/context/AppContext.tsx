import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  StudentProfile,
  TimetableItem,
  SubjectCourse,
  MentalBandwidthState,
  ReflectionEntry,
  SubjectAttendance,
  SubjectFolderData,
  FolderItem,
  DailyScheduledTask,
} from '../types';
import {
  CURRICULUM_DATA,
  INITIAL_TIMETABLE,
  COLLEGES_LIST,
  BRANCHES_LIST,
  DEFAULT_HABITS,
  INITIAL_ATTENDANCE_DATA,
  SUBJECT_FOLDERS_DATA,
} from '../data/btechData';

export interface BunkCalculation {
  percentage: number;
  safeToBunk: number;
  needToAttend: number;
  isSafe: boolean;
  statusLabel: string;
}

interface AppContextType {
  profile: StudentProfile;
  updateProfile: (updates: Partial<StudentProfile>) => void;
  timetable: TimetableItem[];
  toggleItemComplete: (id: string) => void;
  snoozeItem: (id: string, minutes?: number) => void;
  shiftItemToEvening: (id: string) => void;
  injectBufferZone: (afterItemId?: string, durationMinutes?: number) => void;
  recalibrateSchedule: (missedItemTitle?: string) => Promise<void>;
  isRecalibrating: boolean;
  recalibrateNotice: string | null;
  clearRecalibrateNotice: () => void;
  subjects: SubjectCourse[];
  toggleTopicComplete: (subjectId: string, moduleId: string, topicId: string) => void;
  bandwidth: MentalBandwidthState;
  reflections: ReflectionEntry[];
  addReflection: (energy: number, focus: number, stress: number, note?: string) => void;
  todayReflection: ReflectionEntry | undefined;
  zenModeOpen: boolean;
  setZenModeOpen: (open: boolean) => void;
  activeZenTask: TimetableItem | null;
  startZenMode: (item?: TimetableItem) => void;
  activeView: 'home' | 'timeline' | 'academic' | 'attendance' | 'analytics';
  setActiveView: (view: 'home' | 'timeline' | 'academic' | 'attendance' | 'analytics') => void;
  isAiDrawerOpen: boolean;
  setIsAiDrawerOpen: (open: boolean) => void;
  isAttendanceModalOpen: boolean;
  setIsAttendanceModalOpen: (open: boolean) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  selectedResourceForModal: any | null;
  setSelectedResourceForModal: (resource: any | null) => void;
  // 75% Attendance Feature
  attendance: SubjectAttendance[];
  markAttendance: (subjectId: string, status: 'present' | 'absent') => void;
  adjustAttendanceCount: (subjectId: string, attended: number, total: number) => void;
  calculateBunkStatus: (attended: number, total: number, target?: number) => BunkCalculation;
  overallAttendancePercentage: number;
  // Subject Folders Feature
  subjectFolders: Record<string, SubjectFolderData>;
  toggleAssignmentStatus: (subjectId: string, assignmentId: string) => void;
  addCustomNoteToFolder: (subjectId: string, note: FolderItem) => void;
  // Monthly Calendar & Task Scheduling Feature
  scheduledTasks: Record<string, DailyScheduledTask[]>;
  addTaskForDate: (task: Omit<DailyScheduledTask, 'id'>) => void;
  toggleTaskForDate: (date: string, taskId: string) => void;
  deleteTaskForDate: (date: string, taskId: string) => void;
  getDateTaskStats: (dateStr: string) => { total: number; completed: number; percentage: number };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'planzo_profile_v1',
  TIMETABLE: 'planzo_timetable_v1',
  SUBJECTS: 'planzo_subjects_v1',
  REFLECTIONS: 'planzo_reflections_v1',
  ATTENDANCE: 'planzo_attendance_v1',
  FOLDERS: 'planzo_folders_v1',
  SCHEDULED_TASKS: 'planzo_scheduled_tasks_v3',
};

function generateDefaultScheduledTasks(): Record<string, DailyScheduledTask[]> {
  const tasksByDate: Record<string, DailyScheduledTask[]> = {};

  const sampleTasksPool = [
    { title: 'DSA: Binary Search Trees & AVL Traversals', category: 'study' as const, startTime: '09:30', endTime: '10:30' },
    { title: 'Operating Systems: Process Sync & Semaphores', category: 'lecture' as const, startTime: '10:45', endTime: '11:45' },
    { title: 'Database Systems: SQL Normalization & Joins', category: 'study' as const, startTime: '12:00', endTime: '13:00' },
    { title: 'Web Development Lab: React Component Architecture', category: 'lab' as const, startTime: '14:30', endTime: '16:00' },
    { title: 'Computer Networks Assignment: TCP Handshake Analysis', category: 'assignment' as const, startTime: '17:00', endTime: '18:00' },
    { title: 'LeetCode Daily Problem: Two Pointer & Sliding Window', category: 'study' as const, startTime: '20:30', endTime: '21:30' },
  ];

  // Rhythm of completion for past days of Sept 2026 up to today (2026-09-25)
  // Demonstrates full spectrum from 100% light green down to 0% red
  const completionRhythm = [
    { total: 4, completed: 4 }, // Day 1: 100% (Light Green)
    { total: 3, completed: 3 }, // Day 2: 100% (Light Green)
    { total: 4, completed: 3 }, // Day 3: 75%  (Light Green)
    { total: 5, completed: 4 }, // Day 4: 80%  (Light Green)
    { total: 3, completed: 2 }, // Day 5: 66%  (Lime Green)
    { total: 2, completed: 2 }, // Day 6: 100% (Light Green)
    { total: 4, completed: 2 }, // Day 7: 50%  (Yellow)
    { total: 4, completed: 3 }, // Day 8: 75%  (Light Green)
    { total: 4, completed: 1 }, // Day 9: 25%  (Orange)
    { total: 4, completed: 4 }, // Day 10: 100% (Light Green)
    { total: 3, completed: 0 }, // Day 11: 0%   (Red - missed/lazy day)
    { total: 4, completed: 2 }, // Day 12: 50%  (Yellow)
    { total: 0, completed: 0 }, // Day 13: Free day (Sunday)
    { total: 4, completed: 3 }, // Day 14: 75%  (Light Green)
    { total: 5, completed: 1 }, // Day 15: 20%  (Light Red / Rose)
    { total: 4, completed: 4 }, // Day 16: 100% (Light Green)
    { total: 3, completed: 2 }, // Day 17: 66%  (Lime Green)
    { total: 4, completed: 3 }, // Day 18: 75%  (Light Green)
    { total: 3, completed: 1 }, // Day 19: 33%  (Orange)
    { total: 0, completed: 0 }, // Day 20: Free day (Sunday)
    { total: 4, completed: 4 }, // Day 21: 100% (Light Green)
    { total: 4, completed: 3 }, // Day 22: 75%  (Light Green)
    { total: 4, completed: 2 }, // Day 23: 50%  (Yellow)
    { total: 4, completed: 4 }, // Day 24: 100% (Light Green)
  ];

  completionRhythm.forEach((rhythm, idx) => {
    const day = idx + 1;
    const dateStr = `2026-09-${day.toString().padStart(2, '0')}`;
    const dayTasks: DailyScheduledTask[] = [];
    for (let i = 0; i < rhythm.total; i++) {
      const template = sampleTasksPool[i % sampleTasksPool.length];
      dayTasks.push({
        id: `task-${dateStr}-${i}`,
        title: template.title,
        category: template.category,
        startTime: template.startTime,
        endTime: template.endTime,
        completed: i < rhythm.completed,
        date: dateStr,
      });
    }
    tasksByDate[dateStr] = dayTasks;
  });

  return tasksByDate;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Profile State
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE) || localStorage.getItem('scholarsync_profile_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          name: parsed.name || 'Abhishek',
          college: parsed.college && COLLEGES_LIST.includes(parsed.college) ? parsed.college : COLLEGES_LIST[0],
          customCollege: parsed.customCollege || '',
          branch: parsed.branch && BRANCHES_LIST.includes(parsed.branch) ? parsed.branch : BRANCHES_LIST[1],
          semester: parsed.semester || 4,
          wakeTime: parsed.wakeTime || '07:00',
          sleepTime: parsed.sleepTime || '23:30',
          collegeStart: parsed.collegeStart || '09:00',
          collegeEnd: parsed.collegeEnd || '16:30',
          selectedHabits: parsed.selectedHabits || [DEFAULT_HABITS[0], DEFAULT_HABITS[1], DEFAULT_HABITS[2]],
          onboarded: parsed.onboarded !== undefined ? parsed.onboarded : true,
        };
      } catch (e) {}
    }
    return {
      name: 'Abhishek',
      college: COLLEGES_LIST[0], // RGPV Bhopal default
      customCollege: '',
      branch: BRANCHES_LIST[1],  // B.Tech. Computer Science & Engineering
      semester: 4,
      wakeTime: '07:00',
      sleepTime: '23:30',
      collegeStart: '09:00',
      collegeEnd: '16:30',
      selectedHabits: [DEFAULT_HABITS[0], DEFAULT_HABITS[1], DEFAULT_HABITS[2]],
      onboarded: true,
    };
  });

  // 2. Timetable State
  const [timetable, setTimetable] = useState<TimetableItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TIMETABLE) || localStorage.getItem('scholarsync_timetable_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_TIMETABLE;
  });

  // 3. Subjects & Curriculum State
  const [subjects, setSubjects] = useState<SubjectCourse[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUBJECTS) || localStorage.getItem('scholarsync_subjects_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return CURRICULUM_DATA['B.Tech. Computer Science & Engineering'] || Object.values(CURRICULUM_DATA)[0];
  });

  // 4. Daily Reflections State
  const [reflections, setReflections] = useState<ReflectionEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REFLECTIONS) || localStorage.getItem('scholarsync_reflections_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'ref-yesterday',
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        energyLevel: 4,
        focusLevel: 4,
        stressLevel: 2,
        note: 'Algorithms lab went well; proxy successfully marked in morning lecture!',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
  });

  // 5. 75% Attendance State
  const [attendance, setAttendance] = useState<SubjectAttendance[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE) || localStorage.getItem('scholarsync_attendance_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_ATTENDANCE_DATA;
  });

  // 6. Subject-Wise Folders State
  const [subjectFolders, setSubjectFolders] = useState<Record<string, SubjectFolderData>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FOLDERS) || localStorage.getItem('scholarsync_folders_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return SUBJECT_FOLDERS_DATA;
  });

  // 7. Monthly Calendar Scheduled Tasks State
  const [scheduledTasks, setScheduledTasks] = useState<Record<string, DailyScheduledTask[]>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SCHEDULED_TASKS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return generateDefaultScheduledTasks();
  });

  // UI States
  const [activeView, setActiveView] = useState<'home' | 'timeline' | 'academic' | 'attendance' | 'analytics'>('home');
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [zenModeOpen, setZenModeOpen] = useState(false);
  const [activeZenTask, setActiveZenTask] = useState<TimetableItem | null>(null);
  const [selectedResourceForModal, setSelectedResourceForModal] = useState<any | null>(null);
  const [isRecalibrating, setIsRecalibrating] = useState(false);
  const [recalibrateNotice, setRecalibrateNotice] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TIMETABLE, JSON.stringify(timetable));
  }, [timetable]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REFLECTIONS, JSON.stringify(reflections));
  }, [reflections]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(subjectFolders));
  }, [subjectFolders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCHEDULED_TASKS, JSON.stringify(scheduledTasks));
  }, [scheduledTasks]);

  const updateProfile = (updates: Partial<StudentProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
    if (updates.branch) {
      if (CURRICULUM_DATA[updates.branch]) {
        setSubjects(CURRICULUM_DATA[updates.branch]);
      } else {
        setSubjects(CURRICULUM_DATA['B.Tech. Computer Science & Engineering'] || Object.values(CURRICULUM_DATA)[0]);
      }
    }
  };

  const toggleItemComplete = (id: string) => {
    setTimetable((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const snoozeItem = (id: string, minutes: number = 30) => {
    setTimetable((prev) => {
      const target = prev.find((t) => t.id === id);
      if (!target) return prev;

      const [h, m] = target.startTime.split(':').map(Number);
      const newMinutes = (h * 60 + m + minutes) % 1440;
      const newH = Math.floor(newMinutes / 60).toString().padStart(2, '0');
      const newM = (newMinutes % 60).toString().padStart(2, '0');

      return prev.map((item) =>
        item.id === id ? { ...item, startTime: `${newH}:${newM}`, snoozed: true } : item
      );
    });
  };

  const shiftItemToEvening = (id: string) => {
    setTimetable((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              startTime: '21:00',
              endTime: '21:45',
              snoozed: true,
              notes: (item.notes ? item.notes + ' · ' : '') + 'Moved to night hostel study slot.',
            }
          : item
      )
    );
  };

  const injectBufferZone = (afterItemId?: string, durationMinutes: number = 25) => {
    const newBuffer: TimetableItem = {
      id: `buffer-${Date.now()}`,
      title: 'Canteen Chai & Buffer Break',
      category: 'chill',
      startTime: '15:45',
      endTime: '16:10',
      completed: false,
      cognitiveWeight: 1,
      notes: 'Unplug from monitors, grab cutting chai/samosa, and refresh your mind.',
    };

    setTimetable((prev) => {
      if (!afterItemId) return [...prev, newBuffer];
      const index = prev.findIndex((item) => item.id === afterItemId);
      if (index === -1) return [...prev, newBuffer];
      const clone = [...prev];
      clone.splice(index + 1, 0, newBuffer);
      return clone;
    });

    setRecalibrateNotice(`Chai & Buffer Zone added. No engineering burnout today!`);
  };

  const recalibrateSchedule = async (missedItemTitle?: string) => {
    setIsRecalibrating(true);
    try {
      const response = await fetch('/api/recalibrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: timetable.filter((t) => !t.completed),
          missedItemTitle: missedItemTitle || 'Missed Study Slot',
          reason: 'Auto-adjustment triggered to balance student cognitive load',
        }),
      });
      const data = await response.json();

      setTimetable((prev) => {
        let hasBuffer = prev.some((i) => i.category === 'chill' && i.title.includes('Chai'));
        const updated = prev.map((item) => {
          if (!item.completed && item.category === 'study' && item.cognitiveWeight > 3) {
            return {
              ...item,
              cognitiveWeight: 3,
              notes: (item.notes ? item.notes + ' · ' : '') + 'Paced into 45-min sprint',
            };
          }
          return item;
        });

        if (!hasBuffer) {
          updated.push({
            id: `chill-recal-${Date.now()}`,
            title: 'Decompression & Chai Break',
            category: 'chill',
            startTime: '16:00',
            endTime: '16:30',
            completed: false,
            cognitiveWeight: 1,
            notes: 'Restorative buffer added to prevent burnout.',
          });
        }
        return updated;
      });

      setRecalibrateNotice(
        data.summary || 'Schedule quietly balanced. Unfinished topics shifted into manageable sprints.'
      );
    } catch (err) {
      console.error(err);
      setRecalibrateNotice('Schedule quietly adjusted. Added a calm buffer block.');
    } finally {
      setIsRecalibrating(false);
    }
  };

  const clearRecalibrateNotice = () => setRecalibrateNotice(null);

  const toggleTopicComplete = (subjectId: string, moduleId: string, topicId: string) => {
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id !== subjectId) return sub;
        return {
          ...sub,
          modules: sub.modules.map((mod) => {
            if (mod.id !== moduleId) return mod;
            return {
              ...mod,
              topics: mod.topics.map((top) =>
                top.id === topicId ? { ...top, completed: !top.completed } : top
              ),
            };
          }),
        };
      })
    );
  };

  // 75% Attendance Functions
  const markAttendance = (subjectId: string, status: 'present' | 'absent') => {
    setAttendance((prev) =>
      prev.map((sub) => {
        if (sub.subjectId !== subjectId) return sub;
        const newAttended = status === 'present' ? sub.attendedClasses + 1 : sub.attendedClasses;
        const newTotal = sub.totalClasses + 1;
        return {
          ...sub,
          attendedClasses: newAttended,
          totalClasses: newTotal,
        };
      })
    );

    const targetSub = attendance.find((s) => s.subjectId === subjectId);
    if (status === 'present') {
      setRecalibrateNotice(`Marked Present in ${targetSub?.subjectCode || 'lecture'}! 75% attendance boosted.`);
    } else {
      setRecalibrateNotice(`Marked Bunk / Absent in ${targetSub?.subjectCode || 'lecture'}. Attendance formula recalculated.`);
    }
  };

  const adjustAttendanceCount = (subjectId: string, attended: number, total: number) => {
    setAttendance((prev) =>
      prev.map((sub) =>
        sub.subjectId === subjectId
          ? { ...sub, attendedClasses: Math.max(0, attended), totalClasses: Math.max(1, total) }
          : sub
      )
    );
  };

  // Formula for B.Tech 75% Attendance & Bunk Calculator
  const calculateBunkStatus = (attended: number, total: number, target: number = 75): BunkCalculation => {
    if (total === 0) {
      return { percentage: 100, safeToBunk: 0, needToAttend: 0, isSafe: true, statusLabel: 'No classes yet' };
    }
    const targetFraction = target / 100;
    const currentFraction = attended / total;
    const percentage = Math.round(currentFraction * 1000) / 10;

    if (currentFraction >= targetFraction) {
      // Safe to bunk: how many more classes can we miss without dropping below target?
      // (attended) / (total + x) >= targetFraction  =>  total + x <= attended / targetFraction => x = floor(attended / targetFraction - total)
      const safeToBunk = Math.max(0, Math.floor(attended / targetFraction - total));
      return {
        percentage,
        safeToBunk,
        needToAttend: 0,
        isSafe: true,
        statusLabel: safeToBunk > 0 ? `Can safely bunk ${safeToBunk} more classes` : 'On the 75% edge (Do not bunk!)',
      };
    } else {
      // Below target: how many consecutive classes must we attend to reach target?
      // (attended + y) / (total + y) >= targetFraction => attended + y >= targetFraction * total + targetFraction * y
      // y * (1 - targetFraction) >= targetFraction * total - attended => y = ceil((targetFraction * total - attended) / (1 - targetFraction))
      const needToAttend = Math.max(1, Math.ceil((targetFraction * total - attended) / (1 - targetFraction)));
      return {
        percentage,
        safeToBunk: 0,
        needToAttend,
        isSafe: false,
        statusLabel: `Need to attend next ${needToAttend} classes to escape debar risk!`,
      };
    }
  };

  // Overall aggregate attendance
  const totalAttended = attendance.reduce((sum, s) => sum + s.attendedClasses, 0);
  const totalConducted = attendance.reduce((sum, s) => sum + s.totalClasses, 0);
  const overallAttendancePercentage = totalConducted > 0 ? Math.round((totalAttended / totalConducted) * 1000) / 10 : 100;

  // Subject Folders Functions
  const toggleAssignmentStatus = (subjectId: string, assignmentId: string) => {
    setSubjectFolders((prev) => {
      const folder = prev[subjectId];
      if (!folder) return prev;
      return {
        ...prev,
        [subjectId]: {
          ...folder,
          assignments: folder.assignments.map((asg) =>
            asg.id === assignmentId ? { ...asg, completed: !asg.completed } : asg
          ),
        },
      };
    });
  };

  const addCustomNoteToFolder = (subjectId: string, note: FolderItem) => {
    setSubjectFolders((prev) => {
      const folder = prev[subjectId] || {
        subjectId,
        topperNotes: [],
        previousYearQuestions: [],
        labVivaQuestions: [],
        assignments: [],
      };
      return {
        ...prev,
        [subjectId]: {
          ...folder,
          topperNotes: [note, ...folder.topperNotes],
        },
      };
    });
    setRecalibrateNotice(`Added "${note.title}" to ${subjectId.toUpperCase()} folder.`);
  };

  // Monthly Calendar & Task Scheduling Methods
  const addTaskForDate = (task: Omit<DailyScheduledTask, 'id'>) => {
    const id = `task-${task.date}-${Date.now()}`;
    const newTask: DailyScheduledTask = { ...task, id };

    setScheduledTasks((prev) => {
      const existing = prev[task.date] || [];
      return { ...prev, [task.date]: [...existing, newTask] };
    });

    const todayStr = new Date().toISOString().split('T')[0];
    if (task.date === todayStr) {
      const newTimetableItem: TimetableItem = {
        id,
        title: task.title,
        category: task.category,
        startTime: task.startTime,
        endTime: task.endTime,
        completed: task.completed,
        cognitiveWeight: task.cognitiveWeight || 3,
        date: task.date,
      };
      setTimetable((prev) => [...prev, newTimetableItem]);
    }

    setRecalibrateNotice(`Scheduled "${task.title}" for ${task.date}.`);
  };

  const toggleTaskForDate = (date: string, taskId: string) => {
    setScheduledTasks((prev) => {
      const existing = prev[date] || [];
      const updated = existing.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
      return { ...prev, [date]: updated };
    });

    const todayStr = new Date().toISOString().split('T')[0];
    if (date === todayStr) {
      setTimetable((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
      );
    }
  };

  const deleteTaskForDate = (date: string, taskId: string) => {
    setScheduledTasks((prev) => {
      const existing = prev[date] || [];
      return { ...prev, [date]: existing.filter((t) => t.id !== taskId) };
    });

    const todayStr = new Date().toISOString().split('T')[0];
    if (date === todayStr) {
      setTimetable((prev) => prev.filter((t) => t.id !== taskId));
    }
  };

  const getDateTaskStats = (dateStr: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const tasks = scheduledTasks[dateStr];

    if (dateStr === todayStr && timetable.length > 0) {
      const total = timetable.length;
      const completed = timetable.filter((t) => t.completed).length;
      const percentage = total === 0 ? 100 : Math.round((completed / total) * 100);
      return { total, completed, percentage };
    }

    if (!tasks || tasks.length === 0) {
      return { total: 0, completed: 0, percentage: 0 };
    }

    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const percentage = Math.round((completed / total) * 100);
    return { total, completed, percentage };
  };

  // Mental Bandwidth Computation
  const todayReflections = reflections.filter(
    (r) => r.date === new Date().toISOString().split('T')[0]
  );
  const todayReflection = todayReflections[0];

  const totalLoad = timetable.reduce((acc, item) => acc + (item.completed ? item.cognitiveWeight * 0.5 : item.cognitiveWeight), 0);
  const bufferCount = timetable.filter((i) => i.category === 'chill').length;
  const labMinutes = timetable.filter((i) => i.category === 'lab').length * 150;
  const studyMinutes = timetable.filter((i) => i.category === 'study').length * 60;
  const bufferMinutes = bufferCount * 30;

  let densityScore = Math.min(100, Math.round((totalLoad / 32) * 100));
  if (bufferCount >= 2) densityScore = Math.max(20, densityScore - 15);
  if (todayReflection && todayReflection.stressLevel >= 4) densityScore = Math.min(95, densityScore + 10);

  let status: MentalBandwidthState['status'] = 'balanced';
  let recommendation = 'Schedule has healthy focus intervals and breathing room.';

  if (densityScore < 40) {
    status = 'calm';
    recommendation = 'Light day. Perfect for DSA consistency or canteen chill.';
  } else if (densityScore > 75) {
    status = 'overload';
    recommendation = 'Heavy load (lab + theory). Take a chai break to protect your sanity.';
  } else if (densityScore > 60) {
    status = 'dense';
    recommendation = 'Moderate load. Take a brief screen detox after afternoon lab.';
  }

  const bandwidth: MentalBandwidthState = {
    densityScore,
    status,
    totalStudyMinutes: studyMinutes,
    totalLabMinutes: labMinutes,
    bufferMinutes,
    recommendation,
  };

  const addReflection = (energyLevel: number, focusLevel: number, stressLevel: number, note?: string) => {
    const today = new Date().toISOString().split('T')[0];
    const newEntry: ReflectionEntry = {
      id: `ref-${Date.now()}`,
      date: today,
      energyLevel,
      focusLevel,
      stressLevel,
      note,
      timestamp: new Date().toISOString(),
    };
    setReflections((prev) => [newEntry, ...prev.filter((r) => r.date !== today)]);
    setRecalibrateNotice('Daily reflection logged. Tomorrow\'s schedule calibrated.');
  };

  const startZenMode = (item?: TimetableItem) => {
    const target = item || timetable.find((t) => !t.completed && (t.category === 'study' || t.category === 'habit')) || timetable[0];
    setActiveZenTask(target || null);
    setZenModeOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        updateProfile,
        timetable,
        toggleItemComplete,
        snoozeItem,
        shiftItemToEvening,
        injectBufferZone,
        recalibrateSchedule,
        isRecalibrating,
        recalibrateNotice,
        clearRecalibrateNotice,
        subjects,
        toggleTopicComplete,
        bandwidth,
        reflections,
        addReflection,
        todayReflection,
        zenModeOpen,
        setZenModeOpen,
        activeZenTask,
        startZenMode,
        activeView,
        setActiveView,
        isAiDrawerOpen,
        setIsAiDrawerOpen,
        isAttendanceModalOpen,
        setIsAttendanceModalOpen,
        isSidebarOpen,
        setIsSidebarOpen,
        selectedResourceForModal,
        setSelectedResourceForModal,
        // Attendance
        attendance,
        markAttendance,
        adjustAttendanceCount,
        calculateBunkStatus,
        overallAttendancePercentage,
        // Subject Folders
        subjectFolders,
        toggleAssignmentStatus,
        addCustomNoteToFolder,
        // Monthly Calendar & Scheduling
        scheduledTasks,
        addTaskForDate,
        toggleTaskForDate,
        deleteTaskForDate,
        getDateTaskStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
