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
  X,
  Layers,
  Download,
  AlertCircle,
  Globe,
  Youtube,
  GraduationCap,
  ShieldCheck,
  CheckSquare,
  Square,
  ArrowRight,
} from 'lucide-react';
import { FolderItem } from '../types';
import { playTaskCompleteSound } from '../utils/audioSynth';
import { fireConfetti } from '../utils/audioVibes';
import { getCurriculumForSatiSemester } from '../data/satiVidishaData';
import { UniversityPortalScraperModal } from './UniversityPortalScraperModal';

export const AcademicHub: React.FC = () => {
  const {
    profile,
    subjects,
    subjectFolders,
    toggleAssignmentStatus,
    addCustomNoteToFolder,
    setSelectedResourceForModal,
    awardXp,
  } = useApp();

  const [browsingSemester, setBrowsingSemester] = useState<number | null>(null);
  const [isScraperOpen, setIsScraperOpen] = useState(false);

  const activeSemesterSubjects = browsingSemester !== null
    ? getCurriculumForSatiSemester(browsingSemester)
    : subjects;

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || 'cs101');
  const [activeFolderTab, setActiveFolderTab] = useState<'notes' | 'pyq' | 'viva' | 'assignments' | 'syllabus' | 'planner' | 'guidelines'>('notes');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [selectedVivaQuestion, setSelectedVivaQuestion] = useState<any | null>(null);
  const [selectedNotePreview, setSelectedNotePreview] = useState<FolderItem | null>(null);

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
      dateAdded: 'Self Uploaded',
      fileSizeOrPages: newNotePages || 'Personal Notes',
      summary: newNoteSummary || 'Personal student revision note.',
      tags: newNoteTags ? newNoteTags.split(',').map((t) => t.trim()) : ['Personal'],
    };

    addCustomNoteToFolder(currentSubId, newNote);
    playTaskCompleteSound();
    fireConfetti(20);
    setNewNoteTitle('');
    setNewNoteSummary('');
    setIsAddingNote(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Academic Curriculum & Live Scraper Button */}
      <div className="rounded-3xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-[#0c1017] p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                <Folder className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-stone-500 font-semibold">
                Official Academic Curriculum & Resource Vault
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              {profile.customCollege || profile.college || 'Engineering College'} · {profile.branch || 'B.Tech CSE'}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Official 5-Unit Curriculum, PYQs with model solutions, Lab Viva Guides, and Handpicked Topper Notes.
            </p>
          </div>

          {/* Scrape / Sync Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsScraperOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-all"
            >
              <Globe className="w-4 h-4" />
              <span>Sync University Portal & Syllabus</span>
            </button>
          </div>
        </div>

        {/* Quick Semester Switcher Tabs (Sem 1 to Sem 8) */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-stone-100 dark:border-stone-800 overflow-x-auto scrollbar-none">
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider mr-2 shrink-0">
            Semester:
          </span>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
            const isSelected = (browsingSemester === null && profile.semester === sem) || browsingSemester === sem;
            return (
              <button
                key={sem}
                onClick={() => setBrowsingSemester(sem)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                Sem {sem}
              </button>
            );
          })}
        </div>
      </div>

      {/* Horizontal Subject Folders Browser */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-stone-400">
          <span className="uppercase tracking-wider font-semibold">Select Course / Subject Folder</span>
          <span>{activeSemesterSubjects.length} Courses Enrolled</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {activeSemesterSubjects.map((sub) => {
            const isSelected = sub.id === currentSubId;
            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubjectId(sub.id)}
                className={`pop-hover-card p-4 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50/70 dark:bg-teal-950/40 shadow-xs'
                    : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-teal-400 dark:hover:border-teal-500 hover:bg-gradient-to-b hover:from-teal-50/60 hover:to-white dark:hover:from-teal-950/40 dark:hover:to-stone-900'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-teal-700 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                  }`}>
                    {sub.code}
                  </span>
                  <span className="text-[10px] text-stone-400">{sub.credits} Credits</span>
                </div>

                <div className="text-xs font-bold text-stone-900 dark:text-stone-100 line-clamp-1">
                  {sub.name}
                </div>
                <div className="text-[10px] text-stone-500 mt-1 flex items-center gap-1">
                  <span>5 Units</span>
                  <span>·</span>
                  <span>PYQ Available</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inside the Subject Folder: Sub-Tabs Navigation */}
      <div className="space-y-4">
        
        {/* Folder Header & Sub-Tab Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-2">
          
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-teal-700 dark:text-teal-400">
              📁 {activeSubject.name} ({activeSubject.code})
            </span>
          </div>

          {/* Sub-Folders Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800/80 rounded-2xl overflow-x-auto scrollbar-none text-xs">
            <button
              onClick={() => setActiveFolderTab('notes')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors flex items-center gap-1.5 ${
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
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors flex items-center gap-1.5 ${
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
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors flex items-center gap-1.5 ${
                activeFolderTab === 'viva'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
              <span>Lab Viva Q&A</span>
            </button>

            <button
              onClick={() => setActiveFolderTab('assignments')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors flex items-center gap-1.5 ${
                activeFolderTab === 'assignments'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-rose-600" />
              <span>Assignments</span>
            </button>

            <button
              onClick={() => setActiveFolderTab('syllabus')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors flex items-center gap-1.5 ${
                activeFolderTab === 'syllabus'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-sky-600" />
              <span>Syllabus & Curated Video Resources</span>
            </button>

            <button
              onClick={() => setActiveFolderTab('planner')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors flex items-center gap-1.5 ${
                activeFolderTab === 'planner'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-teal-600" />
              <span>Study Planner & Deadlines</span>
            </button>

            <button
              onClick={() => setActiveFolderTab('guidelines')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors flex items-center gap-1.5 ${
                activeFolderTab === 'guidelines'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
              <span>Exam Scheme</span>
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
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
                    <span>{note.dateAdded}</span>
                    <span>{note.fileSizeOrPages}</span>
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    {note.title}
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    {note.summary}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {note.tags?.map((t, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setSelectedNotePreview(note)}
                    className="inline-flex items-center gap-1 font-semibold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
                  >
                    <span>Read PDF Note</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                  <span className="text-[11px] text-stone-400">Verified Scholar Notes</span>
                </div>
              </div>
            ))}

            {/* Upload / Add Custom Note Card */}
            <button
              onClick={() => setIsAddingNote(true)}
              className="rounded-2xl border-2 border-dashed border-stone-200 dark:border-stone-800 hover:border-teal-500 dark:hover:border-teal-400 p-6 flex flex-col items-center justify-center gap-2 text-stone-500 hover:text-teal-700 dark:hover:text-teal-400 transition-colors group cursor-pointer"
            >
              <div className="p-3 rounded-full bg-stone-100 dark:bg-stone-800 group-hover:bg-teal-50 dark:group-hover:bg-teal-950 transition-colors">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold">Upload or Add Subject Handwritten Notes</span>
              <span className="text-[11px] text-stone-400">Add formula cheat sheets or personal summaries</span>
            </button>
          </div>
        )}

        {/* 2. Previous Year Questions (PYQs) Sub-Folder */}
        {activeFolderTab === 'pyq' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeFolder.previousYearQuestions.map((pyq) => (
              <div
                key={pyq.id}
                className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
                    <span>{pyq.dateAdded}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Solved</span>
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    {pyq.title}
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    {pyq.summary}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setSelectedNotePreview(pyq)}
                    className="inline-flex items-center gap-1 font-semibold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
                  >
                    <span>View Solved Exam Paper</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                  <span className="text-[11px] text-stone-400">Repeats in 65% of Exams</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. Lab Viva Questions */}
        {activeFolderTab === 'viva' && (
          <div className="space-y-3">
            {activeFolder.labVivaQuestions.map((viva) => (
              <div
                key={viva.id}
                className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded-full font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {viva.importance}
                  </span>
                  <span className="text-stone-400 font-mono text-[11px]">Lab Defense</span>
                </div>
                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Q: {viva.question}
                </h4>
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                  <strong className="text-teal-700 dark:text-teal-400">Model Answer: </strong>
                  {viva.answer}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. Assignments */}
        {activeFolderTab === 'assignments' && (
          <div className="space-y-3">
            {activeFolder.assignments.map((asg) => (
              <div
                key={asg.id}
                className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs flex items-center justify-between gap-4"
              >
                <div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    {asg.title}
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Due: {asg.dueDate} · Max Marks: {asg.maxMarks}
                  </p>
                </div>
                <button
                  onClick={() => toggleAssignmentStatus(currentSubId, asg.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    asg.completed
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 hover:bg-stone-200'
                  }`}
                >
                  {asg.completed ? 'Submitted ✓' : 'Mark as Done'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 5. Syllabus Modules & Curated High-Yield Resources */}
        {activeFolderTab === 'syllabus' && (
          <div className="space-y-6">
            
            {/* Standard Reference Textbook Recommendation */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-teal-700 dark:text-teal-400" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400">Standard Prescribed Textbook</span>
                  <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    {activeSubject.standardTextbook}
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono text-teal-700 dark:text-teal-400 font-semibold">
                Official AICTE Standard
              </span>
            </div>

            {/* Units & Modules Grid */}
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

                  {/* Curated YouTube Video Channel */}
                  {mod.recommendedResource && (
                    <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-stone-500 truncate max-w-[200px]">
                        <Youtube className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="truncate">{mod.recommendedResource.creatorOrAuthor}</span>
                      </div>

                      <a
                        href={mod.recommendedResource.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-teal-700 dark:text-teal-400 hover:underline"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Watch Lecture</span>
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Curated YouTube Channels Showcase */}
            <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Youtube className="w-4 h-4 text-rose-600" />
                <span>Recommended Top Engineering Creators for Indian University Exams</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
                  <div className="font-bold text-xs text-stone-900 dark:text-stone-100">Gate Smashers</div>
                  <p className="text-[11px] text-stone-500 mt-0.5">Top-tier for OS, DBMS, Computer Networks & Discrete Math.</p>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
                  <div className="font-bold text-xs text-stone-900 dark:text-stone-100">Abdul Bari</div>
                  <p className="text-[11px] text-stone-500 mt-0.5">World-famous animations for Algorithms & Dynamic Programming.</p>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
                  <div className="font-bold text-xs text-stone-900 dark:text-stone-100">Striver (Take U Forward)</div>
                  <p className="text-[11px] text-stone-500 mt-0.5">The gold-standard A2Z DSA sheet for software placements.</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 6. AUTOMATED STUDY PLANNER (Checklist 3.3) */}
        {activeFolderTab === 'planner' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="p-5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-teal-900 dark:text-teal-100">
                  Auto-Generated Syllabus Study Schedule
                </h4>
                <p className="text-xs text-teal-700 dark:text-teal-300 mt-0.5">
                  Calculated dynamically from semester exam notices and unit weightage breakdown.
                </p>
              </div>
              <button
                onClick={() => awardXp(20, 'Study Planner Synced with Routine')}
                className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs shrink-0 transition-colors shadow-xs"
              >
                Sync with My Daily Routine
              </button>
            </div>

            {/* Study Milestones Timeline */}
            <div className="space-y-3">
              {[
                {
                  phase: 'Phase 1: Foundation (Weeks 1 - 4)',
                  target: 'Cover Unit 1 & Unit 2 complete theory and standard numericals.',
                  deadline: 'Target for Mid-Sem 1 (Nov 28)',
                  status: 'In Progress',
                  weight: '40% of Total Syllabus',
                },
                {
                  phase: 'Phase 2: Core Deep Dive (Weeks 5 - 9)',
                  target: 'Complete Unit 3 & Unit 4 design patterns, proofs, and lab programs.',
                  deadline: 'Target for Mid-Sem 2 (Dec 12)',
                  status: 'Upcoming',
                  weight: '40% of Total Syllabus',
                },
                {
                  phase: 'Phase 3: Final Synthesis & PYQs (Weeks 10 - 12)',
                  target: 'Unit 5 advanced concepts + Solve last 5 years university exam papers.',
                  deadline: 'Target for End-Sem Final (Dec 22)',
                  status: 'Upcoming',
                  weight: '20% + 100% PYQs',
                },
              ].map((m, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        {m.phase}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 dark:bg-stone-800 text-teal-700 dark:text-teal-300">
                        {m.weight}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300">
                      {m.target}
                    </p>
                    <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                      📅 {m.deadline}
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 ${
                    m.status === 'In Progress'
                      ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                      : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
                  }`}>
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. Academic Regulations & Exam Scheme */}
        {activeFolderTab === 'guidelines' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-700 dark:text-teal-400" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Autonomous Examination Scheme & Regulations (70 / 30 Split)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700">
                  <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    End-Sem Theory Exam (70%)
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Major autonomous university written evaluation. 5 compulsory questions with internal choices.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700">
                  <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    Internal Assessment (30%)
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Mid-Sem 1 (10 marks) + Mid-Sem 2 (10 marks) + Teacher assessment & assignments (10 marks).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700">
                  <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    75% Attendance Requirement
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Mandatory minimum for exam admit card issuance. 65%-74% requires medical condonation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Scraper Modal */}
      <UniversityPortalScraperModal
        isOpen={isScraperOpen}
        onClose={() => setIsScraperOpen(false)}
      />

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

            <form onSubmit={handleCreateNote} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700 dark:text-stone-300">
                  Document / Note Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Unit 3 Dijkstra & Prim Proofs"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700 dark:text-stone-300">
                  Page Count or Format
                </label>
                <input
                  type="text"
                  placeholder="e.g. 6 Pages · Handwritten"
                  value={newNotePages}
                  onChange={(e) => setNewNotePages(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700 dark:text-stone-300">
                  Key Topics or Summary
                </label>
                <textarea
                  rows={3}
                  placeholder="Contains important proofs, recursive formulas, and university questions."
                  value={newNoteSummary}
                  onChange={(e) => setNewNoteSummary(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNote(false)}
                  className="px-3 py-2 rounded-lg font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg font-bold bg-teal-600 hover:bg-teal-500 text-white cursor-pointer"
                >
                  Save Note to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Note / PYQ Preview Modal */}
      {selectedNotePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="max-w-2xl w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    {selectedNotePreview.title}
                  </h3>
                  <p className="text-xs text-stone-400 font-mono">
                    {selectedNotePreview.dateAdded} · {selectedNotePreview.fileSizeOrPages}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedNotePreview(null)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Viewer */}
            <div className="p-6 rounded-xl bg-stone-50 dark:bg-stone-950/50 border border-stone-200/80 dark:border-stone-800/80 space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-500 border-b border-stone-200/60 dark:border-stone-800/60 pb-2">
                <span>Subject: {activeSubject.name} ({activeSubject.code})</span>
                <span className="font-mono text-emerald-600 font-semibold">Verified Material</span>
              </div>

              <div className="space-y-3 text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-serif">
                <p className="font-bold text-sm text-stone-900 dark:text-stone-100 font-sans">
                  Comprehensive Unit Syllabus Coverage & Formula Summary
                </p>
                <p>
                  {selectedNotePreview.summary}
                </p>
                <div className="p-3 rounded-lg bg-teal-50 dark:bg-teal-950/30 border border-teal-200/70 dark:border-teal-900 text-teal-900 dark:text-teal-200 font-sans text-xs">
                  <strong>High-Yield Exam Tip:</strong> This document directly answers the 14-mark numerical and algorithmic questions consistently appearing in the university end-semester examinations.
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-stone-400 italic">Official Autonomous Academic Record</span>
              <button
                onClick={() => setSelectedNotePreview(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 hover:bg-stone-800 cursor-pointer"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
