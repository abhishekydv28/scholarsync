import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Folder,
  FolderOpen,
  FileText,
  FileCode,
  HelpCircle,
  CheckCircle2,
  Circle,
  ExternalLink,
  Play,
  Sparkles,
  BookOpen,
  Clock,
  Plus,
  Calendar,
  CalendarPlus,
  X,
  Layers,
  Download,
  AlertCircle,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';
import { FolderItem } from '../types';
import { playTaskCompleteSound } from '../utils/audioSynth';
import { fireConfetti } from '../utils/audioVibes';
import { getCurriculumForSatiSemester } from '../data/satiVidishaData';

export const AcademicHub: React.FC = () => {
  const {
    profile,
    subjects,
    subjectFolders,
    toggleAssignmentStatus,
    addCustomNoteToFolder,
    setSelectedResourceForModal,
    scheduleStudyBlock,
  } = useApp();

  const [browsingSemester, setBrowsingSemester] = useState<number | null>(null);

  const activeSemesterSubjects = browsingSemester !== null
    ? getCurriculumForSatiSemester(browsingSemester)
    : subjects;

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || 'cs101');
  const [activeFolderTab, setActiveFolderTab] = useState<'notes' | 'pyq' | 'viva' | 'assignments' | 'syllabus' | 'guidelines'>('notes');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [selectedVivaQuestion, setSelectedVivaQuestion] = useState<any | null>(null);
  const [selectedNotePreview, setSelectedNotePreview] = useState<FolderItem | null>(null);

  // AI Accelerated Study Roadmap Generator State
  const [isRoadmapModalOpen, setIsRoadmapModalOpen] = useState(false);
  const [roadmapDays, setRoadmapDays] = useState(7);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [roadmapData, setRoadmapData] = useState<any | null>(null);
  const [scheduledPhaseIndex, setScheduledPhaseIndex] = useState<number | null>(null);

  // New Note Form State
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNotePages, setNewNotePages] = useState('5 Pages · Handwritten');
  const [newNoteSummary, setNewNoteSummary] = useState('');
  const [newNoteTags, setNewNoteTags] = useState('Unit 3, Formulae');

  const currentSubId = activeSemesterSubjects.some((s) => s.id === selectedSubjectId)
    ? selectedSubjectId
    : activeSemesterSubjects[0]?.id || 'cs101';
  const activeSubject = activeSemesterSubjects.find((s) => s.id === currentSubId) || activeSemesterSubjects[0] || {
    id: 'cs101',
    code: 'CS-101',
    name: 'Applied Physics & Programming',
    credits: 4,
    color: 'emerald',
    modules: [],
    standardTextbook: 'SATI Vidisha CSE Official Curriculum',
    pyqPaperAvailable: true,
  };

  const activeFolder = subjectFolders[currentSubId] || {
    subjectId: currentSubId,
    topperNotes: [
      {
        id: `${currentSubId}-note1`,
        title: `${activeSubject.name} Units I-V Comprehensive Notes`,
        type: 'notes',
        dateAdded: 'SATI Vidisha CSE',
        fileSizeOrPages: '28 Pages · PDF',
        summary: `Complete handwritten lecture and unit notes covering all 5 syllabus modules for ${activeSubject.name}.`,
        tags: ['Units 1-5', 'SATI Vidisha', 'Exam Notes'],
      },
    ],
    previousYearQuestions: [
      {
        id: `${currentSubId}-pyq1`,
        title: `SATI Vidisha 2024 End-Sem: ${activeSubject.code} Paper (Solved)`,
        type: 'pyq',
        dateAdded: 'Dec 2024 Exam',
        fileSizeOrPages: 'Full Paper · With Solutions',
        summary: `Official end-semester question paper with model answers and marks distribution for ${activeSubject.code}.`,
        tags: ['End-Sem 2024', 'SATI Autonomous'],
        solved: true,
      },
    ],
    labVivaQuestions: [
      {
        id: `${currentSubId}-viva1`,
        question: `What are the core fundamentals and industrial applications of ${activeSubject.name}?`,
        answer: `As per the SATI Vidisha B.Tech CSE syllabus, it covers foundational theory, computational complexity, design patterns, and deployment in production systems.`,
        importance: 'Guaranteed Viva Question',
      },
    ],
    assignments: [
      {
        id: `${currentSubId}-asg1`,
        title: `Assignment 1: Unit Problem Set & Implementation`,
        dueDate: 'Next Monday, 4:30 PM',
        completed: false,
        maxMarks: 10,
      },
    ],
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;

    const newNote: FolderItem = {
      id: `custom-note-${Date.now()}`,
      title: newNoteTitle.trim(),
      type: 'notes',
      dateAdded: 'Just now',
      fileSizeOrPages: newNotePages,
      summary: newNoteSummary || 'Student handwritten notes & derivations.',
      tags: newNoteTags.split(',').map((t) => t.trim()),
    };

    addCustomNoteToFolder(selectedSubjectId, newNote);
    setNewNoteTitle('');
    setNewNoteSummary('');
    setIsAddingNote(false);
  };

  const handleGenerateRoadmap = async (days = 7) => {
    setIsGeneratingRoadmap(true);
    setIsRoadmapModalOpen(true);
    setScheduledPhaseIndex(null);
    setRoadmapDays(days);

    try {
      const res = await fetch('/api/syllabus-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: activeSubject.name,
          daysRemaining: days,
          currentLevel: 'Intermediate',
        }),
      });

      if (!res.ok) throw new Error('Planner API error');
      const data = await res.json();
      setRoadmapData(data);
    } catch (e) {
      console.error('Roadmap error', e);
      setRoadmapData({
        studyPlan: [
          {
            phase: 'Phase 1: High-Yield Units & Definitions',
            focusTopics: ['Module 1 & 2 Core Proofs', 'Standard Architecture Diagrams'],
            recommendedVideo: 'Neso Academy & Gate Smashers Comprehensive Playlist',
            estimatedHours: 2,
          },
          {
            phase: 'Phase 2: Recurring 10-Mark University PYQs',
            focusTopics: ['Previous 3 Years Exam Papers', 'Model Solved Numericals'],
            recommendedVideo: 'Abdul Bari / High-Yield Problem Solving Series',
            estimatedHours: 2.5,
          },
          {
            phase: 'Phase 3: Formula Sheet & Mock Simulation',
            focusTopics: ['Summary Cheat Sheet', '1 Timed Exam Paper Simulation'],
            recommendedVideo: '1-Shot Quick Revision Marathon',
            estimatedHours: 1.5,
          },
        ],
        highYieldTip: 'Focus on the repeating questions in Unit 1 and Unit 3 for guaranteed passing marks.',
      });
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  const handleSchedulePhase = (phase: any, index: number) => {
    const todayStr = new Date().toISOString().split('T')[0];
    scheduleStudyBlock({
      title: `${activeSubject.code}: ${phase.phase.split(':')[0]} (${phase.focusTopics[0] || 'Revision'})`,
      category: 'study',
      startTime: '19:00',
      endTime: '21:00',
      date: todayStr,
      subjectId: activeSubject.id,
      cognitiveWeight: 3,
      notes: `Focus topics: ${phase.focusTopics.join(', ')}. Resource: ${phase.recommendedVideo}`,
    });
    setScheduledPhaseIndex(index);
    playTaskCompleteSound();
    fireConfetti(25);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/80 dark:border-stone-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Courses, Syllabi & Study Vault
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            SATI Vidisha B.Tech CSE Curriculum: Unit modules, lecture notes, solved PYQs, and lab manuals.
          </p>
        </div>

        <button
          onClick={() => setIsAddingNote(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-950 text-xs font-semibold transition-colors shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add Note</span>
        </button>
      </div>

      {/* 2. Semester Switcher: Semesters 1 to 8 (Ascending Order) */}
      <div className="p-3 rounded-xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-[#0c1017] space-y-2.5 shadow-xs">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-stone-700 dark:text-stone-300">
            Select Semester Curriculum:
          </span>
          {browsingSemester !== null && (
            <button
              onClick={() => {
                setBrowsingSemester(null);
                if (subjects[0]) setSelectedSubjectId(subjects[0].id);
              }}
              className="text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 font-medium underline cursor-pointer"
            >
              Back to My Enrolled Courses (Sem {profile.semester})
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => {
              setBrowsingSemester(null);
              if (subjects[0]) setSelectedSubjectId(subjects[0].id);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors cursor-pointer ${
              browsingSemester === null
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 font-semibold shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            My Semester ({profile.semester})
          </button>

          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => {
            const isSelected = browsingSemester === s;
            return (
              <button
                key={s}
                onClick={() => {
                  setBrowsingSemester(s);
                  const semSubs = getCurriculumForSatiSemester(s);
                  if (semSubs[0]) setSelectedSubjectId(semSubs[0].id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 font-semibold shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                Semester {s}
              </button>
            );
          })}
        </div>

        {/* Course Filter Tabs for Active Semester */}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {activeSemesterSubjects.map((sub) => {
            const isSelected = sub.id === selectedSubjectId;
            const folderCount = subjectFolders[sub.id]?.topperNotes?.length || 3;

            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubjectId(sub.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium shrink-0 transition-colors border cursor-pointer ${
                  isSelected
                    ? 'border-stone-900 bg-stone-900 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-stone-950 shadow-xs'
                    : 'border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                <span className="font-mono font-bold">{sub.code}</span>
                <span className="truncate max-w-[140px]">{sub.name.split(':')[0]}</span>
                <span className={`text-[10px] font-mono px-1 rounded ${isSelected ? 'bg-white/20 dark:bg-black/20' : 'bg-stone-100 dark:bg-stone-800 text-stone-500'}`}>
                  {sub.credits}c
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inside the Subject Folder: Sub-Tabs Navigation */}
      <div className="space-y-4">
        
        {/* Folder Header & Sub-Tab Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-2">
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-teal-700 dark:text-teal-400">
              📁 {activeSubject.name} ({activeSubject.code})
            </span>
            <button
              type="button"
              onClick={() => handleGenerateRoadmap(7)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-800 dark:text-teal-300 hover:bg-teal-500/20 text-[11px] font-semibold transition-colors cursor-pointer"
              title="Generate tailored study roadmap and timetable blocks"
            >
              <Sparkles className="w-3 h-3 text-teal-600 dark:text-teal-400" />
              <span>Generate Study Roadmap</span>
            </button>
          </div>

          {/* Sub-Folders Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800/80 rounded-xl overflow-x-auto scrollbar-none text-xs">
            <button
              onClick={() => setActiveFolderTab('notes')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                activeFolderTab === 'notes'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-teal-600" />
              <span>Notes ({activeFolder.topperNotes.length})</span>
            </button>

            <button
              onClick={() => setActiveFolderTab('pyq')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                activeFolderTab === 'pyq'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>PYQs & Papers ({activeFolder.previousYearQuestions.length})</span>
            </button>

            <button
              onClick={() => setActiveFolderTab('viva')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                activeFolderTab === 'viva'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
              <span>Lab Viva Q&A ({activeFolder.labVivaQuestions.length})</span>
            </button>

            <button
              onClick={() => setActiveFolderTab('assignments')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                activeFolderTab === 'assignments'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-rose-600" />
              <span>Assignments ({activeFolder.assignments.length})</span>
            </button>

            <button
              onClick={() => setActiveFolderTab('syllabus')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                activeFolderTab === 'syllabus'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-stone-500" />
              <span>Syllabus Modules</span>
            </button>

            <button
              onClick={() => setActiveFolderTab('guidelines')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                activeFolderTab === 'guidelines'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
              <span>Exam Scheme & Regulations</span>
            </button>
          </div>

        </div>

        {/* 1. Topper Notes Sub-Folder */}
        {activeFolderTab === 'notes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeFolder.topperNotes.map((note) => (
              <div
                key={note.id}
                className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs hover:border-stone-300 dark:hover:border-stone-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-1">
                      <FileText className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                      <span>{note.fileSizeOrPages}</span>
                      <span aria-hidden="true">·</span>
                      <span>Added {note.dateAdded}</span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-1">
                    {note.title}
                  </h3>

                  <p className="mt-2 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    {note.summary}
                  </p>

                  {/* Tags */}
                  {note.tags && (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      {note.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-[11px] text-stone-600 dark:text-stone-400 font-mono"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                    Verified Xerox Quality
                  </span>
                  <button
                    onClick={() => setSelectedNotePreview(note)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 transition-colors flex items-center gap-1.5"
                  >
                    <span>Read Notes</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. PYQs & Solved Papers Sub-Folder */}
        {activeFolderTab === 'pyq' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">B.Tech University Exam Reality: </span>
                <span>60-70% of semester exam questions directly repeat from the last 4 years of university question papers. Master these papers first!</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeFolder.previousYearQuestions.map((pyq) => (
                <div
                  key={pyq.id}
                  className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-stone-500 font-semibold">{pyq.dateAdded}</span>
                    <span className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-mono text-[11px]">
                      {pyq.fileSizeOrPages}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    {pyq.title}
                  </h3>

                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    {pyq.summary}
                  </p>

                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-stone-500">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                      <span>{pyq.solved ? 'Model Answers Available' : 'Unsolved Simulation'}</span>
                    </span>
                    <button
                      onClick={() => setSelectedNotePreview(pyq)}
                      className="text-teal-700 dark:text-teal-400 hover:underline font-medium flex items-center gap-1"
                    >
                      <span>View Paper</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Lab External Viva Cheat-Sheet */}
        {activeFolderTab === 'viva' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Lab External Examiner Cheat-Sheet: </span>
                <span>These are the exact theoretical traps and conceptual questions professors and external evaluators fire during practical examinations.</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {activeFolder.labVivaQuestions.map((viva) => (
                <div
                  key={viva.id}
                  className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 text-[11px] font-semibold">
                        {viva.importance}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    Q: {viva.question}
                  </h4>

                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/60 text-xs text-stone-700 dark:text-stone-200 leading-relaxed font-sans">
                    <span className="font-semibold text-stone-900 dark:text-stone-100">Answer: </span>
                    {viva.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Assignments & Lab Record Deadlines */}
        {activeFolderTab === 'assignments' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
              {activeFolder.assignments.map((asg) => (
                <div
                  key={asg.id}
                  onClick={() => {
                    toggleAssignmentStatus(selectedSubjectId, asg.id);
                    if (!asg.completed) {
                      playTaskCompleteSound();
                      fireConfetti(40);
                    }
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    asg.completed
                      ? 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-950 dark:bg-emerald-950/20 opacity-70'
                      : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button className="text-teal-600 dark:text-teal-400">
                      {asg.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-stone-400" />
                      )}
                    </button>
                    <div>
                      <h4 className={`text-sm font-semibold ${asg.completed ? 'line-through text-stone-400' : 'text-stone-900 dark:text-stone-100'}`}>
                        {asg.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>Due: {asg.dueDate}</span>
                        <span aria-hidden="true">·</span>
                        <span>Max Marks: {asg.maxMarks}</span>
                      </div>
                    </div>
                  </div>

                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                    asg.completed
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {asg.completed ? 'Submitted' : 'Pending Submission'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Syllabus Modules & Curated Videos */}
        {activeFolderTab === 'syllabus' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeSubject.modules.map((mod, idx) => (
                <div
                  key={mod.id}
                  className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-stone-400 font-bold">Unit 0{idx + 1}</span>
                    <span className="text-teal-700 dark:text-teal-400 font-medium">{mod.weightagePercentage}% Exam Weight</span>
                  </div>

                  <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    {mod.title}
                  </h4>

                  <ul className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
                    {mod.topics.map((t) => (
                      <li key={t.id} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0" />
                        <span className={t.completed ? 'line-through text-stone-400' : ''}>{t.name}</span>
                      </li>
                    ))}
                  </ul>

                  {mod.recommendedResource && (
                    <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                      <div className="text-xs truncate max-w-[200px] text-stone-500">
                        {mod.recommendedResource.creatorOrAuthor} · {mod.recommendedResource.durationOrPages}
                      </div>
                      <a
                        href={mod.recommendedResource.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg text-xs bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-300 transition-colors flex items-center gap-1 font-medium"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Watch Playlist</span>
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Academic Regulations & Exam Scheme */}
        {activeFolderTab === 'guidelines' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100 dark:border-stone-800">
                <GraduationCap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    B.Tech Academic Regulations & Examination Guidelines
                  </h3>
                  <p className="text-xs text-stone-500">
                    Official evaluation framework, attendance thresholds, and grading rules
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-850/50 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-900 dark:text-stone-100">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>75% Minimum Attendance</span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    Mandatory 75% attendance in theory lectures & practical laboratory sessions is required to remain eligible for end-semester university exams.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-850/50 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-900 dark:text-stone-100">
                    <BookOpen className="w-4 h-4 text-sky-600" />
                    <span>70/30 Examination Scheme</span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    70 Marks End-Semester University Theory + 30 Marks Continuous Sessional / Mid-Semester Evaluation (MSTs, Quizzes & Assignments).
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-850/50 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-900 dark:text-stone-100">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Laboratory Viva & Practicals</span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    External viva voce, lab records, and code demonstration account for separate practical credits with independent passing criteria.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 text-xs text-teal-900 dark:text-teal-200 space-y-1">
                <span className="font-semibold">Preparation Strategy: </span>
                <span>
                  Consistent daily time-blocking of 1.5–2 hours for problem-solving and unit revision prevents eleventh-hour cramming and guarantees higher SGPA/CGPA.
                </span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Add Custom Note Modal */}
      {isAddingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/50 backdrop-blur-xs p-4">
          <div className="max-w-md w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-700" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Add Notes to {activeSubject.code} Folder
                </h3>
              </div>
              <button
                onClick={() => setIsAddingNote(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNote} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Note Title
                </label>
                <input
                  type="text"
                  required
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder="e.g. Unit 3 Handwritten Derivations & PYQ Hints"
                  className="w-full rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-2.5 text-xs text-stone-900 dark:text-stone-100 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Format / Page Count
                </label>
                <input
                  type="text"
                  value={newNotePages}
                  onChange={(e) => setNewNotePages(e.target.value)}
                  placeholder="e.g. 8 Pages · Handwritten PDF"
                  className="w-full rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-2.5 text-xs text-stone-900 dark:text-stone-100 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Short Summary / Topics Included
                </label>
                <textarea
                  rows={2}
                  value={newNoteSummary}
                  onChange={(e) => setNewNoteSummary(e.target.value)}
                  placeholder="e.g. Covered Dijkstra trace tables, Bellman-Ford comparisons, and recurrence trees."
                  className="w-full rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-2.5 text-xs text-stone-900 dark:text-stone-100 focus:outline-hidden focus:border-teal-500 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newNoteTags}
                  onChange={(e) => setNewNoteTags(e.target.value)}
                  placeholder="Unit 3, Formulas, PYQ"
                  className="w-full rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-2.5 text-xs text-stone-900 dark:text-stone-100 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNote(false)}
                  className="px-3.5 py-2 rounded-xl text-xs text-stone-600 dark:text-stone-400 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-800 text-stone-100 hover:bg-teal-700"
                >
                  Save to Subject Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Note / PYQ Preview Modal */}
      {selectedNotePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-xs p-4">
          <div className="max-w-lg w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div>
                <span className="text-xs uppercase font-mono font-bold text-teal-700">
                  Document Preview ({activeSubject.code})
                </span>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  {selectedNotePreview.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNotePreview(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200/70 dark:border-stone-700/60 text-xs text-stone-700 dark:text-stone-200 space-y-2 leading-relaxed font-mono">
              <div className="text-stone-500 text-[11px] pb-1 border-b border-stone-200 dark:border-stone-700">
                📄 {selectedNotePreview.fileSizeOrPages} · Added {selectedNotePreview.dateAdded}
              </div>
              <p className="font-sans text-xs pt-1">
                {selectedNotePreview.summary}
              </p>
              <div className="p-3 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200/60 dark:border-teal-900 text-teal-900 dark:text-teal-200 font-sans text-xs">
                💡 <strong>Senior Advice:</strong> Make sure to memorize the recurrence tree diagrams and step-by-step trace tables. University evaluators award 7 out of 10 marks just for drawing the initial matrix state correctly!
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedNotePreview(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Study Roadmap & Timetable Generator Modal */}
      {isRoadmapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="max-w-2xl w-full bg-white dark:bg-[#0c1017] border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    Accelerated Study Roadmap: {activeSubject.code}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Syllabus chunking & exam-targeted study blocks for {activeSubject.name}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsRoadmapModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Days Sprint Selector */}
            <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-stone-50 dark:bg-stone-850/60 border border-stone-200/70 dark:border-stone-800">
              <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                Exam Timeline Sprint:
              </span>
              <div className="flex items-center gap-1.5 text-xs">
                {[3, 7, 14].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => handleGenerateRoadmap(d)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                      roadmapDays === d
                        ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 font-semibold shadow-2xs'
                        : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100'
                    }`}
                  >
                    {d === 3 ? '3 Days (Emergency)' : d === 7 ? '7 Days (Balanced)' : '14 Days (Full Unit)'}
                  </button>
                ))}
              </div>
            </div>

            {isGeneratingRoadmap ? (
              <div className="py-12 text-center text-xs text-stone-500 space-y-2">
                <Sparkles className="w-6 h-6 text-teal-600 animate-spin mx-auto" />
                <p>Generating tailored study roadmap and curating high-yield video lectures...</p>
              </div>
            ) : roadmapData ? (
              <div className="space-y-4">
                
                {/* High Yield Advice Banner */}
                {roadmapData.highYieldTip && (
                  <div className="p-3.5 rounded-xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 text-xs text-teal-900 dark:text-teal-200 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                    <div className="leading-relaxed">
                      <strong>Senior Exam Strategy:</strong> {roadmapData.highYieldTip}
                    </div>
                  </div>
                )}

                {/* Phases List */}
                <div className="space-y-3">
                  {roadmapData.studyPlan?.map((phase: any, idx: number) => {
                    const isScheduled = scheduledPhaseIndex === idx;
                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-[#0c1017] space-y-3 hover:border-teal-500/40 transition-colors shadow-2xs"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-teal-700 dark:text-teal-400 font-bold">
                              Milestone 0{idx + 1}
                            </span>
                            <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                              {phase.phase}
                            </h4>
                          </div>

                          <span className="text-xs font-mono text-stone-500 shrink-0">
                            ~{phase.estimatedHours}h study
                          </span>
                        </div>

                        {/* Focus Topics */}
                        <div className="space-y-1">
                          <span className="text-[11px] text-stone-400 font-mono">Core Focus:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {phase.focusTopics?.map((t: string, tidx: number) => (
                              <span
                                key={tidx}
                                className="text-xs px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Recommended Resource & 1-Click Schedule CTA */}
                        <div className="pt-2 border-t border-stone-100 dark:border-stone-850 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <div className="text-stone-500 truncate max-w-sm">
                            🎥 {phase.recommendedVideo}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSchedulePhase(phase, idx)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                              isScheduled
                                ? 'bg-emerald-600 text-white'
                                : 'bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-950'
                            }`}
                          >
                            <CalendarPlus className="w-3.5 h-3.5" />
                            <span>{isScheduled ? 'Scheduled to Routine ✓' : '+ Schedule Block'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            ) : null}

            {/* Modal Footer */}
            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
              <span className="text-stone-400 italic">
                Blocks are directly added to today's timetable.
              </span>
              <button
                type="button"
                onClick={() => setIsRoadmapModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
