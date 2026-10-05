import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Clock,
  Check,
  ArrowRight,
  ArrowLeft,
  Flame,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  Compass,
  Trophy,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  SATI_SEMESTER_CURRICULA,
  SATI_SUBJECT_FOLDERS_DATA,
  getCurriculumForSatiSemester,
} from '../data/satiVidishaData';
import { SubjectCourse, SubjectAttendance, TimetableItem } from '../types';
import { playTaskCompleteSound } from '../utils/audioSynth';
import { fireConfetti } from '../utils/audioVibes';

interface PersonalizationSetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanGenerated?: () => void;
}

export const PersonalizationSetupWizard: React.FC<PersonalizationSetupWizardProps> = ({
  isOpen,
  onClose,
  onPlanGenerated,
}) => {
  const {
    profile,
    currentUser,
    updateProfile,
    timetable,
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // All 8 Semesters in strictly ascending order (1 to 8) - Clean, no subjects
  const ALL_8_SEMESTERS = [
    { sem: 1, name: 'Semester 1', year: '1st Year', badge: 'Sem 1' },
    { sem: 2, name: 'Semester 2', year: '1st Year', badge: 'Sem 2' },
    { sem: 3, name: 'Semester 3', year: '2nd Year', badge: 'Sem 3' },
    { sem: 4, name: 'Semester 4', year: '2nd Year', badge: 'Sem 4' },
    { sem: 5, name: 'Semester 5', year: '3rd Year', badge: 'Sem 5' },
    { sem: 6, name: 'Semester 6', year: '3rd Year', badge: 'Sem 6' },
    { sem: 7, name: 'Semester 7', year: 'Final Year', badge: 'Sem 7' },
    { sem: 8, name: 'Semester 8', year: 'Final Year', badge: 'Sem 8' },
  ];

  const ENGINEERING_BRANCH_OPTIONS = [
    'Computer Science & Engineering (CSE)',
    'Information Technology (IT)',
    'Artificial Intelligence & Machine Learning (AIML)',
    'Artificial Intelligence & Data Science (AI & DS)',
    'Electronics & Communication Engineering (ECE)',
    'Electrical Engineering (EE)',
    'Mechanical Engineering (ME)',
    'Civil Engineering (CE)',
    'Electronics & Instrumentation Engineering (EI)',
    'Robotics & Automation',
    'Chemical Engineering',
    'Biotechnology Engineering',
    'Other Engineering Branch (Custom)',
  ];

  // Step 1: Academic Identity
  const [name, setName] = useState(currentUser?.name || profile.name || '');
  const [college, setCollege] = useState(profile.customCollege || profile.college || 'Samrat Ashok Technological Institute (SATI), Vidisha M.P.');
  const [customCollege, setCustomCollege] = useState(profile.customCollege || '');
  const [branch, setBranch] = useState(profile.branch || 'Computer Science & Engineering (CSE)');
  const [customBranch, setCustomBranch] = useState(
    ENGINEERING_BRANCH_OPTIONS.includes(profile.branch || '') ? '' : (profile.branch || '')
  );
  const [semester, setSemester] = useState<number>(profile.semester || 1);
  const [rollNo, setRollNo] = useState(profile.rollNo || '0108CS211045');

  // Step 2: Elective selections for that semester
  const semCurriculum = SATI_SEMESTER_CURRICULA[semester] || SATI_SEMESTER_CURRICULA[1];
  
  const getInitialElectivesForSem = (sem: number): Record<string, string> => {
    const cur = SATI_SEMESTER_CURRICULA[sem];
    const initial: Record<string, string> = {};
    if (cur?.electiveGroups) {
      cur.electiveGroups.forEach((group, index) => {
        const key = group.groupName.split(' ')[0] || `group-${index}`;
        initial[key] = group.defaultSelectedId || group.subjects[0]?.id;
      });
    }
    return initial;
  };

  const [selectedElectives, setSelectedElectives] = useState<Record<string, string>>(() =>
    getInitialElectivesForSem(profile.semester || 1)
  );

  const handleSemesterChange = (newSem: number) => {
    setSemester(newSem);
    setSelectedElectives(getInitialElectivesForSem(newSem));
  };

  // Step 3: Timing & Goals (SATI Vidisha college time is permanently fixed: 10:30 to 17:30)
  const collegeStart = '10:30';
  const collegeEnd = '17:30';
  const [wakeTime, setWakeTime] = useState(profile.wakeTime || '07:00');
  const [sleepTime, setSleepTime] = useState(profile.sleepTime || '23:30');
  const [primaryGoal, setPrimaryGoal] = useState<'placement' | 'cgpa' | 'bunk' | 'gate'>('placement');
  const [selectedHabits, setSelectedHabits] = useState<string[]>([
    'Daily LeetCode Problem',
    'Hydration (3L)',
    'Gym / Physical Reset',
  ]);

  // Step 4: Attendance Input (Starts at 0 attended, 0 conducted for clean start)
  const [attendanceValues, setAttendanceValues] = useState<Record<string, { attended: number; total: number }>>({});

  // Step 5: Generating state
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  // Compute final subject list based on core + selected electives
  const getCompiledSubjects = (): SubjectCourse[] => {
    const list = [...semCurriculum.coreSubjects];
    if (semCurriculum.electiveGroups) {
      semCurriculum.electiveGroups.forEach((group, index) => {
        const key = group.groupName.split(' ')[0] || `group-${index}`;
        const selectedId = selectedElectives[key] || group.defaultSelectedId;
        const sub = group.subjects.find((s) => s.id === selectedId) || group.subjects[0];
        if (sub && !list.some((s) => s.id === sub.id)) {
          list.push(sub);
        }
      });
    }
    return list;
  };

  const handleElectiveChange = (groupKey: string, subjectId: string) => {
    setSelectedElectives((prev) => ({ ...prev, [groupKey]: subjectId }));
  };

  const handleHabitToggle = (habit: string) => {
    if (selectedHabits.includes(habit)) {
      setSelectedHabits(selectedHabits.filter((h) => h !== habit));
    } else {
      setSelectedHabits([...selectedHabits, habit]);
    }
  };

  const handleFinalizePlan = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const compiledSubjects = getCompiledSubjects();

      // 1. Build Personalized Timetable based on SATI Vidisha 10:30 - 17:30 college hours
      const personalizedTimetable: TimetableItem[] = [
        {
          id: 'routine-1',
          title: `Morning Kickoff & ${selectedHabits[0] || 'Focus Study'}`,
          category: 'habit',
          startTime: wakeTime || '07:00',
          endTime: '08:30',
          completed: false, // Starts fresh!
          cognitiveWeight: 2,
        },
        {
          id: 'routine-2',
          title: 'Breakfast & Commute to SATI Vidisha Campus',
          category: 'chill',
          startTime: '08:45',
          endTime: '10:15',
          completed: false, // Starts fresh!
          cognitiveWeight: 1,
        },
        {
          id: 'routine-3',
          title: `${compiledSubjects[0]?.code || 'CS-701'}: ${compiledSubjects[0]?.name || 'Department Lecture 1'}`,
          category: 'lecture',
          startTime: '10:30',
          endTime: '12:00',
          completed: false,
          cognitiveWeight: 4,
          subjectId: compiledSubjects[0]?.id,
        },
        {
          id: 'routine-4',
          title: `${compiledSubjects[1]?.code || 'CS-702'}: ${compiledSubjects[1]?.name || 'Department Lecture 2'}`,
          category: 'lecture',
          startTime: '12:00',
          endTime: '13:30',
          completed: false,
          cognitiveWeight: 3,
          subjectId: compiledSubjects[1]?.id,
        },
        {
          id: 'routine-5',
          title: 'SATI Canteen Lunch Break & Peer Discussion',
          category: 'chill',
          startTime: '13:30',
          endTime: '14:15',
          completed: false,
          cognitiveWeight: 1,
        },
        {
          id: 'routine-6',
          title: `${compiledSubjects.find((s) => s.id.includes('lab') || s.id.includes('706') || s.id.includes('406') || s.id.includes('606') || s.id.includes('26101p'))?.name || 'Department Laboratory Practicals'}`,
          category: 'lab',
          startTime: '14:15',
          endTime: '17:30',
          completed: false,
          cognitiveWeight: 4,
        },
        {
          id: 'routine-7',
          title: 'Campus Departure & Evening Chai Break',
          category: 'chill',
          startTime: '17:30',
          endTime: '18:30',
          completed: false,
          cognitiveWeight: 1,
        },
        {
          id: 'routine-8',
          title: primaryGoal === 'placement'
            ? 'Evening Sprint: DSA LeetCode & Mini-Project Coding'
            : primaryGoal === 'gate'
            ? 'Evening Core CS Revision (Algorithms & Discrete Maths)'
            : 'Evening Study: Topper Notes & Lab Assignment Submission',
          category: 'study',
          startTime: '19:00',
          endTime: '21:00',
          completed: false,
          cognitiveWeight: 4,
        },
        {
          id: 'routine-9',
          title: 'Dinner, Family & Mental Decompression',
          category: 'chill',
          startTime: '21:00',
          endTime: '22:00',
          completed: false,
          cognitiveWeight: 1,
        },
        {
          id: 'routine-10',
          title: 'Night Review: Tomorrow\'s Schedule Sync & Sleep',
          category: 'habit',
          startTime: '22:30',
          endTime: sleepTime || '23:30',
          completed: false,
          cognitiveWeight: 1,
        },
      ];

      // 2. Build Attendance Array (Starts at 0/0 unless user explicitly entered)
      const newAttendanceList: SubjectAttendance[] = compiledSubjects.map((sub) => {
        const recorded = attendanceValues[sub.id] || { attended: 0, total: 0 };
        return {
          subjectId: sub.id,
          subjectCode: sub.code,
          subjectName: sub.name,
          attendedClasses: recorded.attended,
          totalClasses: recorded.total,
          isLab: sub.name.toLowerCase().includes('lab'),
          professorName: 'SATI Vidisha Faculty',
        };
      });

      // 3. Save to localStorage & update profile
      localStorage.setItem('planzo_subjects_v1', JSON.stringify(compiledSubjects));
      localStorage.setItem('planzo_timetable_v1', JSON.stringify(personalizedTimetable));
      localStorage.setItem('planzo_attendance_v1', JSON.stringify(newAttendanceList));
      localStorage.setItem('planzo_folders_v1', JSON.stringify(SATI_SUBJECT_FOLDERS_DATA));

      // Reset starting state for newly created account: 0 XP, 0 Streak, clean calendar!
      localStorage.setItem('planzo_user_xp_v5', '0');
      localStorage.setItem('planzo_user_streak_v5', '0');
      const todayStr = new Date().toISOString().split('T')[0];
      const initialTasks = {}; // Starts with 0 tasks as requested
      localStorage.setItem('planzo_scheduled_tasks_v5', JSON.stringify(initialTasks));
      localStorage.setItem('planzo_tasks_v3', JSON.stringify(initialTasks));

      const resolvedCollege = college === 'OTHERS' ? (customCollege.trim() || 'Engineering Institute') : college;
      const resolvedBranch = (branch === 'Other Engineering Branch (Custom)' || branch === 'OTHERS')
        ? (customBranch.trim() || 'Engineering')
        : (customBranch.trim() || branch || 'Computer Science & Engineering (CSE)');

      updateProfile({
        name: name.trim() || currentUser?.name || profile.name || 'Student',
        college: resolvedCollege,
        customCollege: resolvedCollege,
        branch: resolvedBranch,
        semester: semester,
        rollNo: rollNo.trim(),
        collegeStart: '10:30', // internal timetable reference only
        collegeEnd: '17:30',   // internal timetable reference only
        wakeTime: wakeTime,
        sleepTime: sleepTime,
        selectedHabits: selectedHabits,
        onboarded: true,
        accountCreatedAt: todayStr,
      });

      // Reload window softly to let all contexts hydrate with the new personalized SATI data
      playTaskCompleteSound();
      fireConfetti(80);
      setIsGenerating(false);

      if (onPlanGenerated) {
        onPlanGenerated();
      }

      onClose();
      // Fast refresh to sync storage across all components
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-[#0c1017] border border-stone-200 dark:border-stone-800 rounded-2xl p-5 sm:p-6 w-full max-w-2xl shadow-xl space-y-5 max-h-[92vh] overflow-y-auto">
        
        {/* Wizard Top Step Indicator */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold text-xs">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <span>
                  {step === 1 && '01 Profile & Identity'}
                  {step === 2 && '02 Academic Electives'}
                  {step === 3 && '03 College Routine'}
                  {step === 4 && '04 Study Preferences'}
                  {step === 5 && '05 Confirm Workspace'}
                </span>
                <span className="text-[11px] font-mono text-stone-400">
                  Step {step} of 5
                </span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                B.Tech Student Operating System Setup
              </p>
            </div>
          </div>

          <div className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400">
            {Math.round((step / 5) * 100)}%
          </div>
        </div>

        {/* Step Progress Line */}
        <div className="w-full h-1 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
          <div
            className="h-full bg-teal-600 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* ---------------------------------------------------- */}
        {/* STEP 1: Academic Identity (SATI Vidisha Verified)   */}
        {/* ---------------------------------------------------- */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn text-xs">
            <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-900/40 text-stone-600 dark:text-stone-400">
              <span className="font-semibold text-stone-900 dark:text-stone-100">
                Autonomous Syllabus Engine Loaded:
              </span>{' '}
              Official courses, 5 syllabus units, and marking schemes for all 8 semesters are mapped for your B.Tech engineering curriculum.
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700 dark:text-stone-300">
                Student Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-900/60 text-stone-900 dark:text-stone-100 font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700 dark:text-stone-300 flex items-center justify-between">
                <span>Engineering Institute / College</span>
                <span className="text-[10px] font-mono text-stone-400">Updates Everywhere</span>
              </label>
              <select
                value={college}
                onChange={(e) => {
                  setCollege(e.target.value);
                  if (e.target.value !== 'OTHERS') {
                    setCustomCollege(e.target.value);
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-900/60 text-stone-900 dark:text-stone-100 font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
              >
                <option value="Samrat Ashok Technological Institute (SATI), Vidisha M.P.">
                  ⭐ Samrat Ashok Technological Institute (SATI), Vidisha M.P. (Autonomous)
                </option>
                <option value="University Institute of Technology, RGPV Bhopal">
                  University Institute of Technology, RGPV Bhopal
                </option>
                <option value="Shri Govindram Seksaria Institute of Technology and Science (SGSITS), Indore">
                  Shri Govindram Seksaria Institute of Technology and Science (SGSITS), Indore
                </option>
                <option value="Institute of Engineering & Technology (IET DAVV), Indore">
                  Institute of Engineering & Technology (IET DAVV), Indore
                </option>
                <option value="Madhav Institute of Technology & Science (MITS), Gwalior">
                  Madhav Institute of Technology & Science (MITS), Gwalior
                </option>
                <option value="Jabalpur Engineering College (JEC), Jabalpur">
                  Jabalpur Engineering College (JEC), Jabalpur
                </option>
                <option value="Medi-Caps University, Indore">
                  Medi-Caps University, Indore
                </option>
                <option value="OTHERS">
                  Other Engineering College / University (Custom)
                </option>
              </select>

              {(college === 'OTHERS' || !['Samrat Ashok Technological Institute (SATI), Vidisha M.P.', 'University Institute of Technology, RGPV Bhopal', 'Shri Govindram Seksaria Institute of Technology and Science (SGSITS), Indore', 'Institute of Engineering & Technology (IET DAVV), Indore', 'Madhav Institute of Technology & Science (MITS), Gwalior', 'Jabalpur Engineering College (JEC), Jabalpur', 'Medi-Caps University, Indore'].includes(college)) && (
                <input
                  type="text"
                  value={customCollege}
                  onChange={(e) => setCustomCollege(e.target.value)}
                  placeholder="Enter your college or university name..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-900/60 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 mt-1 font-medium"
                />
              )}
            </div>

            {/* Semester Selection: Clean Dropdown Menu */}
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700 dark:text-stone-300 flex items-center justify-between">
                <span>Select Semester</span>
                <span className="text-[10px] font-mono text-teal-700 dark:text-teal-400 font-semibold">Semesters 1 to 8 Available</span>
              </label>
              <select
                value={semester}
                onChange={(e) => handleSemesterChange(parseInt(e.target.value) || 1)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-900/60 text-stone-900 dark:text-stone-100 font-semibold focus:outline-hidden focus:ring-2 focus:ring-teal-500/50 cursor-pointer"
              >
                {ALL_8_SEMESTERS.map((s) => (
                  <option key={s.sem} value={s.sem}>
                    {s.name} ({s.year} · {s.badge})
                  </option>
                ))}
              </select>
            </div>

            {/* Engineering Branch Selection with Options */}
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700 dark:text-stone-300 flex items-center justify-between">
                <span>Engineering Branch</span>
                <span className="text-[10px] font-mono text-stone-400">Select Specialization</span>
              </label>
              <select
                value={ENGINEERING_BRANCH_OPTIONS.includes(branch) ? branch : 'Other Engineering Branch (Custom)'}
                onChange={(e) => {
                  const val = e.target.value;
                  setBranch(val);
                  if (val !== 'Other Engineering Branch (Custom)') {
                    setCustomBranch('');
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-900/60 text-stone-900 dark:text-stone-100 font-semibold focus:outline-hidden focus:ring-2 focus:ring-teal-500/50 cursor-pointer"
              >
                {ENGINEERING_BRANCH_OPTIONS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>

              {(branch === 'Other Engineering Branch (Custom)' || (!ENGINEERING_BRANCH_OPTIONS.slice(0, -1).includes(branch) && branch)) && (
                <input
                  type="text"
                  value={customBranch}
                  onChange={(e) => {
                    setCustomBranch(e.target.value);
                  }}
                  placeholder="Enter your Engineering Branch (e.g. Aeronautical Engineering)..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-900/60 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/50 mt-1 font-medium"
                />
              )}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* STEP 2: Elective & Subject Selection for Semester   */}
        {/* ---------------------------------------------------- */}
        {step === 2 && (
          <div className="space-y-4 animate-fadeIn text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                  Semester {semester} Courses & Electives
                </h3>
                <p className="text-stone-500 dark:text-stone-400 text-xs">
                  Pick your registered departmental & open electives below.
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                Official Syllabus
              </span>
            </div>

            {/* Core Compulsory Courses */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono uppercase font-bold text-stone-400">
                Core Compulsory Subjects:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {semCurriculum.coreSubjects.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-900/40 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-stone-900 dark:text-stone-100">
                        {sub.code}: {sub.name}
                      </div>
                      <div className="text-[10px] text-stone-500 font-mono">
                        {sub.credits} Credits · Units 1 to 5
                      </div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Elective Groups Selection */}
            {semCurriculum.electiveGroups && semCurriculum.electiveGroups.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-stone-100 dark:border-stone-800">
                <div className="text-[11px] font-mono uppercase font-bold text-stone-400">
                  Choose Your Electives:
                </div>
                {semCurriculum.electiveGroups.map((group, gIdx) => {
                  const groupKey = group.groupName.split(' ')[0] || `group-${gIdx}`;
                  const currentChoice = selectedElectives[groupKey] || group.defaultSelectedId;

                  return (
                    <div
                      key={gIdx}
                      className="p-3.5 rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-900/30 space-y-2"
                    >
                      <div className="font-bold text-stone-800 dark:text-stone-200 text-xs flex items-center justify-between">
                        <span>{group.groupName}</span>
                        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                          Choose 1
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400">
                        {group.description}
                      </p>

                      <div className="space-y-1.5 pt-1">
                        {group.subjects.map((sub) => {
                          const isSelected = currentChoice === sub.id;
                          return (
                            <label
                              key={sub.id}
                              onClick={() => handleElectiveChange(groupKey, sub.id)}
                              className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                isSelected
                                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 font-semibold'
                                  : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 text-stone-700 dark:text-stone-300'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`group-${gIdx}`}
                                  checked={isSelected}
                                  onChange={() => handleElectiveChange(groupKey, sub.id)}
                                  className="accent-emerald-500"
                                />
                                <span className="text-xs">
                                  <strong>{sub.code}:</strong> {sub.name}
                                </span>
                              </div>
                              <span className="text-[10px] font-mono text-stone-400">
                                {sub.credits} Credits
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* STEP 3: Daily Timing & Personal Focus Goals         */}
        {/* ---------------------------------------------------- */}
        {step === 3 && (
          <div className="space-y-4 animate-fadeIn text-xs">
            <div>
              <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                Your Daily Rhythm & Routine Hours
              </h3>
              <p className="text-stone-500 dark:text-stone-400 text-xs">
                PlanZo will schedule your study sessions around your real college hours.
              </p>
            </div>

            {/* College Timing */}
            <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-stone-900 dark:text-stone-100">
                    College Routine Schedule: 10:30 AM – 05:30 PM
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">
                    Institute fixed working hours automatically applied to your routine.
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/30">
                Fixed (Auto-Synced)
              </span>
            </div>

            {/* Sleep & Wake Times */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700 dark:text-stone-300">
                  Wake-Up Time
                </label>
                <input
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-900/60 font-mono text-xs focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700 dark:text-stone-300">
                  Target Bedtime
                </label>
                <input
                  type="time"
                  value={sleepTime}
                  onChange={(e) => setSleepTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-900/60 font-mono text-xs focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            {/* Primary Goal Selector */}
            <div className="space-y-2">
              <label className="font-semibold text-stone-700 dark:text-stone-300">
                What is your primary semester focus?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'placement', label: 'Placement & DSA Grinder', desc: 'Focus on LeetCode & Projects', icon: '🎯' },
                  { id: 'cgpa', label: '9+ CGPA Semester Topper', desc: 'Prioritize Units I-V & Theory', icon: '🏆' },
                  { id: 'bunk', label: '75% Bunk Safe & Balanced', desc: 'Canteen freedom + minimum attendance', icon: '🛡️' },
                  { id: 'gate', label: 'GATE & Core CS Research', desc: 'Algorithms & Theoretical CS', icon: '🧠' },
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setPrimaryGoal(g.id as any)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      primaryGoal === g.id
                        ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/40 text-stone-900 dark:text-stone-100'
                        : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    <div className="text-base">{g.icon}</div>
                    <div className="font-bold text-xs mt-1">{g.label}</div>
                    <div className="text-[10px] text-stone-500 dark:text-stone-400">{g.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Habits to Track */}
            <div className="space-y-1.5 pt-1">
              <label className="font-semibold text-stone-700 dark:text-stone-300">
                Key Habits to Anchor Into Your Day:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Daily LeetCode Problem',
                  'Gym / Physical Reset',
                  'Hydration (3L)',
                  'Technical Paper Reading',
                  'Mindful Breathing (10m)',
                  'No Phone Study Block',
                ].map((habit) => {
                  const isChecked = selectedHabits.includes(habit);
                  return (
                    <button
                      key={habit}
                      type="button"
                      onClick={() => handleHabitToggle(habit)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                        isChecked
                          ? 'border-emerald-500 bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-bold'
                          : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}
                      {habit}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* STEP 4: Real Attendance Input (Starts at 0/0 Clean) */}
        {/* ---------------------------------------------------- */}
        {step === 4 && (
          <div className="space-y-4 animate-fadeIn text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                  Current Attendance Reality Check
                </h3>
                <p className="text-stone-500 dark:text-stone-400 text-xs">
                  New accounts start clean at 0/0. You can enter existing attendance if your semester has already begun.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const resetObj: Record<string, { attended: number; total: number }> = {};
                  getCompiledSubjects().forEach((s) => {
                    resetObj[s.id] = { attended: 0, total: 0 };
                  });
                  setAttendanceValues(resetObj);
                }}
                className="px-2.5 py-1 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-medium text-[11px] transition-colors cursor-pointer shrink-0"
              >
                Reset to 0/0 Clean
              </button>
            </div>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {getCompiledSubjects().map((sub) => {
                const current = attendanceValues[sub.id] || { attended: 0, total: 0 };
                const hasClasses = current.total > 0;
                const pct = hasClasses ? Math.round((current.attended / current.total) * 100) : 100;
                const isSafe = pct >= 75;

                return (
                  <div
                    key={sub.id}
                    className="p-3 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-900/40 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-stone-900 dark:text-stone-100 truncate">
                        {sub.code}: {sub.name}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-mono mt-0.5">
                        {hasClasses ? (
                          <>
                            <span className={`font-bold ${isSafe ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                              {pct}% Attendance
                            </span>
                            <span className="text-stone-400">·</span>
                            <span className="text-stone-500">
                              {isSafe ? 'Safe to bunk' : 'Debar risk! Attend now'}
                            </span>
                          </>
                        ) : (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                            0/0 Classes Conducted (Clean Start · No Debar Risk)
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 font-mono">
                      <div className="space-y-0.5 text-center">
                        <span className="text-[9px] text-stone-400">Attended</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={current.attended}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setAttendanceValues((prev) => ({
                              ...prev,
                              [sub.id]: { attended: val, total: Math.max(val, current.total) },
                            }));
                          }}
                          className="w-12 px-1.5 py-1 text-center rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 font-bold"
                        />
                      </div>
                      <span className="text-stone-400 pt-3">/</span>
                      <div className="space-y-0.5 text-center">
                        <span className="text-[9px] text-stone-400">Total</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={current.total}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setAttendanceValues((prev) => ({
                              ...prev,
                              [sub.id]: { attended: current.attended, total: val },
                            }));
                          }}
                          className="w-12 px-1.5 py-1 text-center rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 font-bold"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* STEP 5: Confirmation & Dynamic Generation           */}
        {/* ---------------------------------------------------- */}
        {step === 5 && (
          <div className="space-y-5 animate-fadeIn text-xs text-center py-3">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-stone-950 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/25">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                Your PlanZo workspace is ready.
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto">
                Review your academic details below before activating your personalized dashboard.
              </p>
            </div>

            {/* Summary Highlights */}
            <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 text-left space-y-2 font-mono text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Institute:</span>
                <span className="font-bold text-stone-800 dark:text-stone-200">{customCollege || college || 'B.Tech Engineering'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Academic Year & Semester:</span>
                <span className="font-bold text-teal-600 dark:text-teal-400">
                  Semester {semester} · {branch === 'Other Engineering Branch (Custom)' ? (customBranch || 'Engineering') : branch}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Courses Mapped:</span>
                <span className="font-bold text-stone-800 dark:text-stone-200">{getCompiledSubjects().length} Courses</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500">College Schedule:</span>
                <span className="font-bold text-stone-800 dark:text-stone-200">{collegeStart} to {collegeEnd}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Primary Focus:</span>
                <span className="font-bold capitalize text-cyan-600 dark:text-cyan-400">{primaryGoal}</span>
              </div>
            </div>

            <p className="text-[11px] text-stone-400">
              Clicking below will build your daily timetable, inject subject folders with official notes, and activate the 75% Bunk Simulator.
            </p>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* WIZARD ACTION FOOTER                                */}
        {/* ---------------------------------------------------- */}
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => (prev - 1) as any)}
              className="px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold cursor-pointer"
            >
              Skip
            </button>
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => (prev + 1) as any)}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-xs"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalizePlan}
              disabled={isGenerating}
              className="px-5 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-950 font-semibold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Configuring Timetable...</span>
                </>
              ) : (
                <span>Save & Activate Plan</span>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
