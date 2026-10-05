import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Copy,
  Check,
  X,
  Sparkles,
  BookOpen,
  Code2,
  Cpu,
  Layers,
  HelpCircle,
  ShieldCheck,
  ExternalLink,
  Flame,
  Zap,
} from 'lucide-react';

interface ProjectPitchDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectPitchDossierModal: React.FC<ProjectPitchDossierModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'languages' | 'apis' | 'algorithms' | 'cross-questions'>('overview');

  if (!isOpen) return null;

  const handleDownloadPdf = () => {
    const a = document.createElement('a');
    a.href = '/PlanZo_Technical_Architecture_and_Pitch_Dossier.pdf';
    a.download = 'PlanZo_Technical_Architecture_and_Pitch_Dossier.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleOpenPdf = () => {
    window.open('/PlanZo_Technical_Architecture_and_Pitch_Dossier.pdf', '_blank');
  };

  const handlePrint = () => {
    const printWindow = window.open('/planzo-pitch-dossier.html', '_blank');
    if (!printWindow) {
      window.print();
    }
  };

  const handleCopyMarkdown = () => {
    const markdownContent = `# PlanZo — B.Tech Student Operating System
## Technical Pitch Dossier, API Architecture & Algorithm Specifications

### 1. Executive Summary
Engineering colleges impose strict constraints: mandatory 75% attendance criteria, parallel theory and 3-hour lab sessions, 5-unit curricula, and external viva pressure. PlanZo is an intelligent Student Operating System that combines regulatory 75% attendance protection, mathematical load balancing, dynamic guilt-free schedule recalibration, and an AI campus copilot.

### 2. Full-Stack Languages & Tech Stack
- Frontend: TypeScript (v5/v7), React 19 (Component Hierarchy, Context API), Vite 8 (ESM Bundler), Tailwind CSS v4, Motion (Physics Animations), Web Audio API (Synthesized pentatonic audio chime)
- Backend: Node.js (v22), Express.js (v4.21 REST Server), TSX Engine, Dotenv
- AI Framework: Google Gemini 3.8 Flash via @google/genai TypeScript SDK
- Persistence: Browser LocalStorage API (Offline-first, 100% Student Privacy)

### 3. API Ecosystem & Request-Response Architecture
- POST /api/chat: Sarthi AI Senior Campus Mentor. Receives conversation context, student profile, attendance percentage, and study density. Injects Indian engineering campus grounding (75% criteria, PYQs, vivas, internal marks) to deliver actionable 80/20 study plans.
- POST /api/recalibrate: Guilt-Free Dynamic Schedular. Rearranges missed tasks into upcoming slack intervals, adds a 20-min buffer, and preserves 11:30 PM sleep window.
- POST /api/syllabus-planner: Generates high-yield study chunks based on days remaining before examinations.
- Security: Server-side proxy shields GEMINI_API_KEY from browser inspection console.

### 4. Mathematical Algorithms & Formulations
1. Regulatory 75% Attendance & Debarment Calculus:
   - Safe Bunk Buffer (When Current % >= 75%): Safe = floor((4*A - 3*T) / 3)
   - Recovery Lectures (When Current % < 75%): Needed = ceil(3*T - 4*A)
2. Daily Cognitive Strain Index (CSI):
   - CSI = Sum(Weight_i * DurationMinutes_i) / 60
   - Overloaded threshold: CSI > 6.0 triggers auto-chill buffer suggestion.
3. Guilt-Free Interval Recalibration:
   - Detects missed task, scans post-college evening window, inserts restorative buffer, shifts heavy tasks to next morning.
4. Non-Linear Level Progression Curve:
   - Level = floor(sqrt(Total_XP / 100)) + 1

### 5. Pitch Cross-Questions & Evaluator Defenses
- Q: "Why not use Google Calendar or Notion?"
  A: Generic tools are passive containers that trigger guilt when tasks are missed. PlanZo active-calculates 75% attendance debarment margins, balances cognitive load after heavy 3-hour labs, and provides curriculum-grounded 80/20 PYQ study plans.
- Q: "What if Gemini API fails or quota runs out?"
  A: Dual-tier resilience. All server routes contain deterministic heuristic fallbacks that deliver structured, reassuring guidance even when completely offline.
- Q: "What is your USP in one sentence?"
  A: "PlanZo is the only academic workspace engineered specifically for B.Tech students that combines mandatory 75% attendance protection, dynamic guilt-free schedule recalibration, and curriculum-focused AI mentoring."`;

    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-[#0c1018] border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-4xl max-h-[92vh] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3 bg-stone-50/70 dark:bg-stone-900/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  PlanZo Technical Pitch Dossier
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800">
                  5-Page PDF Ready
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Full-stack architecture, API lifecycle, mathematical algorithms & cross-examination defense
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              className="px-3.5 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              title="Download 5-Page Technical PDF Dossier"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 sm:px-6 pt-3 pb-2 border-b border-stone-100 dark:border-stone-800 bg-stone-50/30 dark:bg-stone-900/30 overflow-x-auto">
          {[
            { id: 'overview', label: 'Summary & PDF', icon: BookOpen },
            { id: 'languages', label: 'Languages & Stack', icon: Code2 },
            { id: 'apis', label: 'APIs & Architecture', icon: Layers },
            { id: 'algorithms', label: 'Algorithms & Math', icon: Cpu },
            { id: 'cross-questions', label: 'Pitch Defense Q&A', icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-sans flex-1">
          
          {/* Quick Action Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/60">
            <div className="flex items-center gap-2 text-teal-900 dark:text-teal-200">
              <FileText className="w-4 h-4 text-teal-700 dark:text-teal-400 shrink-0" />
              <span className="text-xs">
                <strong>Official PDF Generated:</strong> Complete 5-page formatted report ready for presentation.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenPdf}
                className="px-2.5 py-1 rounded-lg border border-teal-300 dark:border-teal-700 bg-white dark:bg-stone-900 text-teal-800 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-stone-800 text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Open PDF in Tab</span>
              </button>
              <button
                onClick={handlePrint}
                className="px-2.5 py-1 rounded-lg border border-teal-300 dark:border-teal-700 bg-white dark:bg-stone-900 text-teal-800 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-stone-800 text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Printer className="w-3 h-3" />
                <span>Print Document</span>
              </button>
              <button
                onClick={handleCopyMarkdown}
                className="px-2.5 py-1 rounded-lg border border-teal-300 dark:border-teal-700 bg-white dark:bg-stone-900 text-teal-800 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-stone-800 text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-400 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>1. Executive Summary & Problem-Solution Fit</span>
                </h4>
                <p className="text-stone-600 dark:text-stone-400">
                  Engineering students in India operate under rigid institutional boundaries: mandatory 75% attendance criteria (with debarment from university examinations), packed 10:30 AM to 5:30 PM schedules, heavy 3-hour laboratory viva submissions, and continuous internal assessments. Generic productivity tools (Notion, Google Calendar, Todoist) fail because they treat students as corporate knowledge workers, triggering guilt whenever a task is missed.
                </p>
                <p className="text-stone-600 dark:text-stone-400">
                  <strong>PlanZo</strong> is purpose-built as an intelligent Student Operating System. It combines deterministic attendance risk math, automated schedule recalibration with cognitive weight distribution, syllabus-mapped 80/20 exam recovery, and a contextual campus mentor (Sarthi AI).
                </p>
              </div>

              {/* PDF Preview Snapshot */}
              <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-teal-600" />
                    <span>Included in Official PDF Dossier (5 Pages):</span>
                  </span>
                  <span className="text-[11px] font-mono text-stone-500">PlanZo_Technical_Architecture_and_Pitch_Dossier.pdf</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-white dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800">
                    📄 <strong>Page 1:</strong> Title Banner, Scope, Navigation Index & Project Revision Record
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800">
                    📄 <strong>Page 2:</strong> System Architecture, TypeScript 5, React 19, Node.js & Tech Comparison Table
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800">
                    📄 <strong>Page 3:</strong> API Endpoints (/api/chat, /api/recalibrate), Express Proxy & Request Lifecycle
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800">
                    📄 <strong>Page 4:</strong> Attendance Math (Safe Bunk Calculus), Dynamic Recalibration & Cognitive Strain
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800 sm:col-span-2">
                    📄 <strong>Page 5:</strong> Pitch Defense Guide: Top 5 Evaluator Cross-Questions & High-Scoring Model Answers
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LANGUAGES & STACK */}
          {activeTab === 'languages' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-400 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4" />
                  <span>2. Programming Languages & Technical Stack</span>
                </h4>
                <p className="text-stone-600 dark:text-stone-400">
                  PlanZo is written in pure TypeScript from frontend to backend, providing compile-time type safety, eliminating null pointer exceptions, and standardizing data transfer contracts.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 space-y-2">
                  <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center justify-between">
                    <span>Frontend Languages & Frameworks</span>
                    <span className="text-[10px] font-mono text-teal-700 dark:text-teal-400">Client Tier</span>
                  </div>
                  <ul className="space-y-1.5 text-stone-600 dark:text-stone-400 text-[11px]">
                    <li>• <strong>TypeScript (v5.x / 7.x):</strong> Strict mode typing across all models (Attendance, Timetable, Tasks, Profile).</li>
                    <li>• <strong>React 19:</strong> Functional component architecture, concurrent rendering, and centralized Context API.</li>
                    <li>• <strong>Vite 8:</strong> ESM dev server with sub-millisecond HMR and Rollup tree-shaken production builds.</li>
                    <li>• <strong>Tailwind CSS v4:</strong> CSS variables theme engine, dynamic dark/light mode, and zero CSS bloat.</li>
                    <li>• <strong>Motion:</strong> Hardware-accelerated layout springs and smooth tab transitions.</li>
                    <li>• <strong>Web Audio API:</strong> Native pentatonic chime sound synthesis (zero external audio latency).</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 space-y-2">
                  <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center justify-between">
                    <span>Backend Languages & Engine</span>
                    <span className="text-[10px] font-mono text-teal-700 dark:text-teal-400">Server Tier</span>
                  </div>
                  <ul className="space-y-1.5 text-stone-600 dark:text-stone-400 text-[11px]">
                    <li>• <strong>Node.js & TypeScript:</strong> TSX runtime executing TypeScript server-side without manual build steps.</li>
                    <li>• <strong>Express.js (v4.21):</strong> Lightweight REST proxy isolating credentials and routing AI operations.</li>
                    <li>• <strong>Google GenAI TypeScript SDK:</strong> Direct integration with Google Gemini 3.8 Flash model.</li>
                    <li>• <strong>Dotenv:</strong> Server environment variable isolation ensuring zero client-side credential leaks.</li>
                    <li>• <strong>LocalStorage API:</strong> Native browser storage ensuring 100% offline availability and student data privacy.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: APIS & ARCHITECTURE */}
          {activeTab === 'apis' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-400 flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  <span>3. API Architecture & Request Lifecycle</span>
                </h4>
                <p className="text-stone-600 dark:text-stone-400">
                  PlanZo uses a secure Express reverse proxy architecture. The browser client never touches external AI APIs directly, preventing API key exposure and ensuring graceful fallback when offline.
                </p>
              </div>

              <div className="space-y-3 font-mono text-[11px]">
                <div className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 space-y-1">
                  <div className="font-bold text-teal-700 dark:text-teal-400">POST /api/chat — Sarthi AI Senior Mentor</div>
                  <p className="text-stone-600 dark:text-stone-400 font-sans text-xs">
                    Receives user queries along with real-time academic context (semester, college, routine density, attendance percentage). Evaluates via Gemini 3.8 Flash and returns structured, actionable 80/20 advice.
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 space-y-1">
                  <div className="font-bold text-teal-700 dark:text-teal-400">POST /api/recalibrate — Guilt-Free Schedule Rebalancer</div>
                  <p className="text-stone-600 dark:text-stone-400 font-sans text-xs">
                    Accepts the remaining scheduled tasks and the missed task. Analyzes cognitive density, inserts a 20-min restorative chill buffer, shifts intensive work to the next morning, and protects the 11:30 PM sleep window.
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 space-y-1">
                  <div className="font-bold text-teal-700 dark:text-teal-400">POST /api/syllabus-planner — 80/20 Exam Chunk Generator</div>
                  <p className="text-stone-600 dark:text-stone-400 font-sans text-xs">
                    Divides 5-unit syllabi into 3 targeted phases (Core Theory, Recurring PYQs, and Formula Sheet simulations) based on days left until the exam.
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-teal-300 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/30 space-y-1">
                  <div className="font-bold text-teal-800 dark:text-teal-300">GET /PlanZo_Technical_Architecture_and_Pitch_Dossier.pdf</div>
                  <p className="text-stone-600 dark:text-stone-400 font-sans text-xs">
                    Serves the 5-page formal PDF dossier generated by pdf-lib directly to the user for pitch evaluations.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ALGORITHMS & MATH */}
          {activeTab === 'algorithms' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-400 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" />
                  <span>4. Core Mathematical Algorithms</span>
                </h4>
                <p className="text-stone-600 dark:text-stone-400">
                  Deterministic mathematical models prevent debarment and cognitive burnout using exact integer bounds.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 space-y-1.5">
                  <div className="font-bold text-stone-900 dark:text-stone-100">
                    1. AICTE Mandatory 75% Attendance & Debarment Calculus
                  </div>
                  <p className="text-stone-600 dark:text-stone-400 text-xs">
                    Given attended lectures <span className="font-mono">A</span> and total lectures <span className="font-mono">T</span>:
                  </p>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-stone-850 font-mono text-[11px] text-teal-800 dark:text-teal-300 space-y-1">
                    <div>Safe Bunks Buffer (When Attendance ≥ 75%): <span className="font-bold">⌊(4A - 3T) / 3⌋</span></div>
                    <div>Required Recovery Lectures (When Attendance &lt; 75%): <span className="font-bold">⌈3T - 4A⌉</span></div>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Ensures strict integer safety margins without rounding errors that could lead to examination debarment.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 space-y-1.5">
                  <div className="font-bold text-stone-900 dark:text-stone-100">
                    2. Cognitive Bandwidth & Strain Scoring Index (CSI)
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-stone-850 font-mono text-[11px] text-teal-800 dark:text-teal-300">
                    CSI = ∑ (CognitiveWeight_i × DurationMinutes_i) / 60
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Weights range from 1 (Light Reading) to 5 (Intensive DSA/Operating Systems). When CSI &gt; 6.0, the system flags "Overloaded" status and auto-suggests a 25-minute Chill Buffer.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 space-y-1.5">
                  <div className="font-bold text-stone-900 dark:text-stone-100">
                    3. Non-Linear Gamification & Level Curve
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-stone-850 font-mono text-[11px] text-teal-800 dark:text-teal-300">
                    Level = ⌊√(Total_XP / 100)⌋ + 1
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Dampens rapid early advancement while ensuring long-term semester streaks maintain student engagement.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PITCH DEFENSE Q&A */}
          {activeTab === 'cross-questions' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-400 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" />
                  <span>5. Evaluator Pitch Cross-Questions & Winning Answers</span>
                </h4>
                <p className="text-stone-600 dark:text-stone-400">
                  Ready-to-use articulate responses to common questions from university professors, hackathon judges, and venture evaluators.
                </p>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 space-y-1">
                  <div className="font-bold text-teal-800 dark:text-teal-300">
                    Q: "Why not just use Google Calendar or Notion?"
                  </div>
                  <p className="text-stone-600 dark:text-stone-400">
                    <strong>Answer:</strong> "Generic apps are passive containers that require manual entry and trigger guilt when tasks slip. PlanZo is domain-specific for engineering students: it models mandatory 75% attendance rules, recalibrates schedules after exhausting 3-hour labs without anxiety, and provides curriculum-aligned 80/20 exam recovery."
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 space-y-1">
                  <div className="font-bold text-teal-800 dark:text-teal-300">
                    Q: "What happens if the Gemini API is down or rate-limited?"
                  </div>
                  <p className="text-stone-600 dark:text-stone-400">
                    <strong>Answer:</strong> "PlanZo employs a multi-tiered resilience strategy. Every server route is backed by deterministic local heuristic engines. If the external Gemini API is unreachable, the system immediately returns structured, human-like guidance without crashing or hanging the UI."
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 space-y-1">
                  <div className="font-bold text-teal-800 dark:text-teal-300">
                    Q: "How do you protect student privacy?"
                  </div>
                  <p className="text-stone-600 dark:text-stone-400">
                    <strong>Answer:</strong> "PlanZo operates offline-first. All routines, attendance records, and personal habit streaks stay safely stored in the student's browser LocalStorage. Only minimal context prompts are routed via our Express proxy, with zero persistent storage of student identity on third-party servers."
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 space-y-1">
                  <div className="font-bold text-teal-800 dark:text-teal-300">
                    Q: "What is your single most compelling USP?"
                  </div>
                  <p className="text-stone-600 dark:text-stone-400">
                    <strong>Answer:</strong> "PlanZo is the only academic workspace engineered specifically for B.Tech students that combines mandatory 75% attendance protection, dynamic guilt-free schedule recalibration, and curriculum-focused AI mentoring."
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/70 dark:bg-stone-900/70">
          <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>PlanZo OS v2.4 · Industrial B.Tech Engineering Specification</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              className="px-4 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
