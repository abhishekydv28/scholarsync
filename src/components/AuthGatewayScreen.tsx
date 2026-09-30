import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  Check,
  Eye,
  EyeOff,
  Sun,
  Moon,
  BookOpen,
  Clock,
  GraduationCap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BRANCHES_LIST } from '../data/btechData';

interface AuthGatewayScreenProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

export const AuthGatewayScreen: React.FC<AuthGatewayScreenProps> = ({
  isDarkMode,
  setIsDarkMode,
}) => {
  const { signUp, signIn, setIsPersonalizationWizardOpen } = useApp();
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [college] = useState('Samrat Ashok Technological Institute (SATI), Vidisha M.P.');
  const [branch, setBranch] = useState(BRANCHES_LIST[0]);
  const [semester, setSemester] = useState(1);
  const [rollNo, setRollNo] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    if (next) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('planzo_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('planzo_theme', 'light');
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 4) {
      setErrorMsg('Password must be at least 4 characters.');
      return;
    }

    signIn(email, password);
    setSuccessMsg('Signing in to your student workspace...');
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 4) {
      setErrorMsg('Password must be at least 4 characters.');
      return;
    }

    signUp({
      name: name.trim(),
      email: email.trim(),
      password,
      college,
      branch,
      semester,
      rollNo: rollNo.trim(),
    });

    setSuccessMsg('Account created successfully. Initializing your workspace...');
    setTimeout(() => {
      setIsPersonalizationWizardOpen(true);
    }, 200);
  };

  const handleQuickDemoLogin = () => {
    signIn('student.cse@satiengg.in', 'sati2026');
    setSuccessMsg('Signed in as Abhishek Yadav (B.Tech CSE)...');
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-stone-50 dark:bg-[#070b12] text-stone-900 dark:text-stone-100 transition-colors">
      
      {/* Top Header */}
      <header className="w-full border-b border-stone-200/80 dark:border-stone-800 bg-white/90 dark:bg-[#0b0f17]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 flex items-center justify-center font-bold text-xs">
              P
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-stone-900 dark:text-stone-100">
                PlanZo
              </span>
              <span className="text-[11px] text-stone-500 dark:text-stone-400 ml-2">
                SATI Vidisha Engineering Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Split Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column: Purpose & Institutional Grounding */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-stone-600 dark:text-stone-400">
            <span>Samrat Ashok Technological Institute (Autonomous)</span>
            <span>·</span>
            <span>Est. 1960</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100 leading-tight">
            Academic Schedule & Syllabus Workspace for B.Tech CSE
          </h1>

          <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed max-w-lg">
            Manage your daily routine around the official 10:30 AM – 5:30 PM college timetable, track the 75% autonomous attendance threshold, and access full syllabi and notes for all 8 semesters.
          </p>

          {/* Key Feature Rows */}
          <div className="space-y-3 pt-2 max-w-lg">
            <div className="flex items-start gap-3 p-3 rounded-lg border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-[#0c1017]">
              <Clock className="w-4 h-4 text-stone-500 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                  Fixed 10:30 AM – 5:30 PM College Timetable
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  Synchronized around SATI theory lectures and department practical laboratories.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-[#0c1017]">
              <ShieldCheck className="w-4 h-4 text-stone-500 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                  75% Attendance & Debarment Monitor
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  Calculates exact classes needed to maintain eligibility and avoid exam debarment.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-[#0c1017]">
              <BookOpen className="w-4 h-4 text-stone-500 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                  All 8 Semesters Curricula & PYQs
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  Official course modules, handwritten topper notes, lab viva manuals, and exam papers.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Authentication Card */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <div className="bg-white dark:bg-[#0c1017] border border-stone-200 dark:border-stone-800 rounded-xl p-6 sm:p-7 shadow-xs space-y-5">
            
            {/* Tab Switcher */}
            <div className="grid grid-cols-2 p-1 bg-stone-100 dark:bg-stone-850 rounded-lg gap-1 border border-stone-200/60 dark:border-stone-750">
              <button
                type="button"
                onClick={() => {
                  setTab('signin');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  tab === 'signin'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-2xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('signup');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  tab === 'signup'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-2xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                Create Account
              </button>
            </div>

            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                {tab === 'signin' ? 'Sign in to PlanZo' : 'Register New Student Account'}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                {tab === 'signin'
                  ? 'Enter your credentials to access your academic dashboard.'
                  : 'Start with a clean calendar, zero baseline, and customized timetable.'}
              </p>
            </div>

            {/* Status Messages */}
            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-700 dark:text-emerald-300">
                {successMsg}
              </div>
            )}

            {/* Sign In Form */}
            {tab === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-700 dark:text-stone-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@satiengg.in"
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-xs focus:outline-hidden focus:ring-1 focus:ring-stone-900 dark:focus:ring-stone-100"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-medium text-stone-700 dark:text-stone-300">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-9 pr-9 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-xs focus:outline-hidden focus:ring-1 focus:ring-stone-900 dark:focus:ring-stone-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-950 font-semibold text-xs transition-colors shadow-xs cursor-pointer mt-1"
                >
                  Sign In to Workspace
                </button>

                <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
                  <button
                    type="button"
                    onClick={handleQuickDemoLogin}
                    className="w-full py-2 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-850 text-stone-700 dark:text-stone-300 text-xs font-medium transition-colors cursor-pointer"
                  >
                    Quick Student Demo (Abhishek · CSE)
                  </button>
                </div>
              </form>
            )}

            {/* Sign Up Form */}
            {tab === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-700 dark:text-stone-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Abhishek Yadav"
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-xs focus:outline-hidden focus:ring-1 focus:ring-stone-900 dark:focus:ring-stone-100"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-700 dark:text-stone-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@satiengg.in"
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-xs focus:outline-hidden focus:ring-1 focus:ring-stone-900 dark:focus:ring-stone-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-stone-700 dark:text-stone-300">
                      Semester (1 to 8)
                    </label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(parseInt(e.target.value) || 1)}
                      className="w-full px-2.5 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-xs focus:outline-hidden focus:ring-1 focus:ring-stone-900 cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <option key={s} value={s}>
                          Semester {s} ({s <= 2 ? '1st Yr' : s <= 4 ? '2nd Yr' : s <= 6 ? '3rd Yr' : 'Final'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-stone-700 dark:text-stone-300">
                      Roll No. / USN
                    </label>
                    <input
                      type="text"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      placeholder="0108CS211045"
                      className="w-full px-2.5 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-xs font-mono focus:outline-hidden focus:ring-1 focus:ring-stone-900"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-700 dark:text-stone-300">
                    Create Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-9 pr-9 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-xs focus:outline-hidden focus:ring-1 focus:ring-stone-900 dark:focus:ring-stone-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-950 font-semibold text-xs transition-colors shadow-xs cursor-pointer mt-2"
                >
                  Create Account & Initialize
                </button>
              </form>
            )}

          </div>
        </div>

      </main>

      {/* Clean Footer */}
      <footer className="w-full border-t border-stone-200/80 dark:border-stone-800 py-4 bg-white/50 dark:bg-[#070b12]/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between text-xs text-stone-400">
          <div>PlanZo · Autonomous Engineering Academic Planner</div>
          <div>Samrat Ashok Technological Institute, Vidisha (M.P.)</div>
        </div>
      </footer>

    </div>
  );
};
