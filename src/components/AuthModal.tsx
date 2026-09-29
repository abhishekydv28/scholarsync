import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Eye,
  EyeOff,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { COLLEGES_LIST, BRANCHES_LIST } from '../data/btechData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signup' | 'signin';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultMode = 'signup' }) => {
  const { signUp, signIn, currentUser, signOut } = useApp();
  const [mode, setMode] = useState<'signup' | 'signin'>(defaultMode);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [college, setCollege] = useState('SATI VIDISHA');
  const [branch, setBranch] = useState(BRANCHES_LIST[0]);
  const [semester, setSemester] = useState(1);
  const [rollNo, setRollNo] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid student email address.');
      return;
    }

    if (!password || password.length < 4) {
      setErrorMsg('Password should be at least 4 characters.');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }

      signUp({
        name,
        email,
        password,
        college,
        branch,
        semester,
        rollNo,
      });

      setSuccessMsg('Account created successfully! Welcome to PlanZo.');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 700);
    } else {
      signIn(email, password);
      setSuccessMsg('Welcome back! Logging into your workspace...');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 700);
    }
  };

  const handleQuickDemoLogin = () => {
    signIn('abhishek.cse@uitrgpv.ac.in', 'demo1234');
    setSuccessMsg('Logged in with Verified Student Demo Account!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-[#0d131f] border border-stone-200/90 dark:border-stone-800 rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <span>{mode === 'signup' ? 'Create Student Account' : 'Student Sign In'}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  {mode === 'signup' ? 'Join Portal' : 'Workspace'}
                </span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {mode === 'signup'
                  ? 'Sync your 14-day streaks, attendance & exam syllabus across devices.'
                  : 'Access your saved timetable, subject folders & habit records.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher: Sign Up vs Sign In */}
        <div className="grid grid-cols-2 p-1 bg-stone-100 dark:bg-stone-900 rounded-2xl gap-1 border border-stone-200/80 dark:border-stone-800">
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg('');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg('');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            Sign In
          </button>
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

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          {mode === 'signup' && (
            <div className="space-y-1.5">
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
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-900/60 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 font-medium transition-all"
                />
              </div>
            </div>
          )}

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="font-semibold text-stone-700 dark:text-stone-300 flex items-center justify-between">
              <span>College or Personal Email</span>
              <span className="text-[10px] font-mono text-stone-400">Syncs records</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@college.edu or gmail.com"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-900/60 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 font-medium transition-all"
              />
            </div>
          </div>

          {/* Password */}
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

          {mode === 'signup' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Roll Number */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">
                    Roll No / Enrollment USN
                  </label>
                  <input
                    type="text"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    placeholder="e.g. 0801CS221045"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-900/60 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 font-mono transition-all"
                  />
                </div>

                {/* Semester */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">
                    Semester
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-900/60 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 font-medium transition-all cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Semester {s} ({s <= 2 ? '1st Year' : s <= 4 ? '2nd Year' : s <= 6 ? '3rd Year' : 'Final Year'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Branch */}
              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700 dark:text-stone-300">
                  Engineering Branch
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-900/60 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 font-medium transition-all truncate cursor-pointer"
                >
                  {BRANCHES_LIST.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold flex items-center justify-center gap-2 transition-all active:scale-98 shadow-sm cursor-pointer mt-4"
          >
            <span>{mode === 'signup' ? 'Complete Student Registration' : 'Sign In to Workspace'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Demo Login Banner */}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>Fast test credentials:</span>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>1-Click Verified Student Login</span>
            </button>
          </div>

          {currentUser?.isAuthenticated && (
            <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
              <div className="truncate">
                <span className="text-stone-400">Current active user: </span>
                <strong className="text-stone-900 dark:text-stone-100">{currentUser.name}</strong>
              </div>
              <button
                type="button"
                onClick={signOut}
                className="text-rose-600 dark:text-rose-400 hover:underline font-semibold cursor-pointer shrink-0 ml-2"
              >
                Log Out
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
