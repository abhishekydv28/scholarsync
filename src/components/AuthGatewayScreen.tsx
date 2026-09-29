import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  Check,
  Eye,
  EyeOff,
  Flame,
  Clock,
  BookOpen,
  Headphones,
  Sun,
  Moon,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { COLLEGES_LIST, BRANCHES_LIST } from '../data/btechData';

interface AuthGatewayScreenProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

export const AuthGatewayScreen: React.FC<AuthGatewayScreenProps> = ({
  isDarkMode,
  setIsDarkMode,
}) => {
  const { signUp, signIn } = useApp();
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [college, setCollege] = useState(COLLEGES_LIST[0]);
  const [branch, setBranch] = useState(BRANCHES_LIST[1]);
  const [semester, setSemester] = useState(4);
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
    setSuccessMsg('Welcome back! Loading your workspace...');
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid student email.');
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

    setSuccessMsg('Account created successfully! Entering workspace...');
  };

  const handleQuickDemoLogin = () => {
    signIn('abhishek.cse@uitrgpv.ac.in', 'demo1234');
    setSuccessMsg('Entering as Verified Student: Abhishek (B.Tech CSE)...');
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-stone-100/80 dark:bg-[#070b12] text-stone-900 dark:text-stone-100 transition-colors selection:bg-emerald-500/20">
      
      {/* Top Navigation Bar */}
      <header className="w-full border-b border-stone-200/80 dark:border-stone-800/80 bg-white/80 dark:bg-[#0b0f17]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-stone-950 flex items-center justify-center font-bold font-mono shadow-sm shadow-emerald-500/20">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">
                PlanZo
              </span>
              <span className="text-[10px] font-mono text-stone-400 block -mt-1">
                B.Tech Academic & Habit Companion
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800/80 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content: Split Grid Hero + Login/Signup Card */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Side: Value Props & Student Motivation */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-current animate-pulse" />
            <span>Built Specifically for Indian Engineering Students</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-stone-900 dark:text-white leading-[1.15]">
            Master Your Semester.{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
              Zero Guilt. Max Consistency.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed max-w-xl">
            Never worry about the 75% attendance debar criteria, late syllabus scrambles, or broken study habits again. Your personalized engineering co-pilot keeps you on track.
          </p>

          {/* 4 Feature Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 max-w-xl">
            <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-stone-900/60 border border-stone-200/90 dark:border-stone-800 flex items-start gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                <Flame className="w-4 h-4 fill-current" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs text-stone-900 dark:text-stone-100">14-Day Streak Engine</div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400">Calendar synced, streak freeze shields & XP multipliers.</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-stone-900/60 border border-stone-200/90 dark:border-stone-800 flex items-start gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs text-stone-900 dark:text-stone-100">75% Attendance Guard</div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400">Live canteen bunk simulator & safety margins.</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-stone-900/60 border border-stone-200/90 dark:border-stone-800 flex items-start gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center shrink-0">
                <Headphones className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs text-stone-900 dark:text-stone-100">Focus Audio & Flute</div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400">Raag Yaman flute, Vedic Om chimes & device upload.</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-stone-900/60 border border-stone-200/90 dark:border-stone-800 flex items-start gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs text-stone-900 dark:text-stone-100">Dynamic Auto-Recalibration</div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400">Routine adjusts smoothly when lectures run overtime.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Gateway Authentication Card */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto">
          <div className="bg-white dark:bg-[#0e1422] border border-stone-200 dark:border-stone-800/90 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black/10 space-y-5">
            
            {/* Tab Switcher */}
            <div className="grid grid-cols-2 p-1 bg-stone-100 dark:bg-stone-900 rounded-2xl gap-1 border border-stone-200/80 dark:border-stone-800">
              <button
                type="button"
                onClick={() => {
                  setTab('signin');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  tab === 'signin'
                    ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
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
                className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  tab === 'signup'
                    ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                New Student? Sign Up
              </button>
            </div>

            {/* Title */}
            <div>
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                {tab === 'signin' ? 'Sign In to Your Workspace' : 'Create Your Student Account'}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                {tab === 'signin'
                  ? 'Access your timetable, enrolled syllabus & habit streaks.'
                  : 'Start your consistent semester journey with PlanZo.'}
              </p>
            </div>

            {/* Feedback Messages */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-medium animate-fadeIn">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-1.5 animate-fadeIn">
                <Check className="w-4 h-4" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form */}
            {tab === 'signin' ? (
              <form onSubmit={handleSignIn} className="space-y-3.5 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">
                    Student Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. abhishek@college.edu or gmail.com"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-900/60 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 font-medium transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-900/60 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 font-medium transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold flex items-center justify-center gap-2 transition-all active:scale-98 shadow-sm cursor-pointer mt-2"
                >
                  <span>Sign In to Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Abhishek Yadav"
                      required
                      className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-900/60 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 font-medium transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">
                    Student Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. abhishek@college.ac.in"
                      required
                      className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-900/60 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 font-medium transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700 dark:text-stone-300">
                      Roll No / USN
                    </label>
                    <input
                      type="text"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      placeholder="0801CS221045"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-900/60 text-stone-900 dark:text-stone-100 font-mono text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700 dark:text-stone-300">
                      Semester
                    </label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(parseInt(e.target.value) || 4)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-900/60 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <option key={s} value={s}>
                          Sem {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">
                    Branch
                  </label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-900/60 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 truncate cursor-pointer"
                  >
                    {BRANCHES_LIST.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">
                    Create Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-10 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-900/60 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 font-medium transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold flex items-center justify-center gap-2 transition-all active:scale-98 shadow-sm cursor-pointer mt-2"
                >
                  <span>Create Account & Enter</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Fast 1-Click Demo Login Divider */}
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 space-y-2">
              <div className="text-[11px] text-stone-400 text-center uppercase font-mono tracking-wider">
                Instant Access
              </div>

              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-cyan-500/15 hover:from-emerald-500/25 hover:to-cyan-500/25 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
              >
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>1-Click Verified Student Demo Login</span>
              </button>
            </div>

          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-stone-200/80 dark:border-stone-800/80 py-4 text-center text-xs text-stone-500">
        PlanZo · Calm & Intelligent B.Tech Academic Companion · Built for consistency
      </footer>

    </div>
  );
};
