import React, { useState, useEffect } from 'react';
import {
  Quote,
  Flame,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface MotivationalQuote {
  quote: string;
  author: string;
  role: string;
  avatarSeed: string;
  badge: string;
}

const MOTIVATIONAL_THOUGHTS: MotivationalQuote[] = [
  {
    quote: "Dream is not that which you see while sleeping, it is something that does not let you sleep.",
    author: "Dr. A.P.J. Abdul Kalam",
    role: "Aerospace Scientist & 11th President of India",
    avatarSeed: "Kalam",
    badge: "Vision & Tenacity",
  },
  {
    quote: "Wear your failure as a badge of honor. It is always good to work with people who make you feel insecure about yourself.",
    author: "Sundar Pichai",
    role: "CEO of Google & Alphabet",
    avatarSeed: "Sundar",
    badge: "Humility & Growth",
  },
  {
    quote: "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.",
    author: "Steve Jobs",
    role: "Co-founder, Apple Inc.",
    avatarSeed: "SteveJobs",
    badge: "Obsession with Excellence",
  },
  {
    quote: "The present is theirs; the future, for which I really worked, is mine.",
    author: "Nikola Tesla",
    role: "Legendary Electrical Engineer & Inventor",
    avatarSeed: "Tesla",
    badge: "Pioneering Spirit",
  },
  {
    quote: "Don't be a know-it-all, be a learn-it-all. The future belongs to those who continuously rebuild themselves.",
    author: "Satya Nadella",
    role: "Chairman & CEO, Microsoft",
    avatarSeed: "Satya",
    badge: "Continuous Learning",
  },
  {
    quote: "Talk is cheap. Show me the code. Execution is the only metric that matters in engineering.",
    author: "Linus Torvalds",
    role: "Creator of Linux Kernel & Git",
    avatarSeed: "Linus",
    badge: "Raw Execution",
  },
  {
    quote: "Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.",
    author: "Marie Curie",
    role: "Two-Time Nobel Laureate in Physics & Chemistry",
    avatarSeed: "MarieCurie",
    badge: "Courage in Science",
  },
  {
    quote: "Arise, awake, and stop not until the goal is reached. Infinite patience produces immediate results.",
    author: "Swami Vivekananda",
    role: "Global Philosopher & Youth Icon",
    avatarSeed: "Vivekananda",
    badge: "Inner Willpower",
  },
  {
    quote: "Run, don't walk. Either you're running for food, or you are running from being food. Speed and resilience define the modern engineer.",
    author: "Jensen Huang",
    role: "Founder & CEO, NVIDIA",
    avatarSeed: "Jensen",
    badge: "Extreme Urgency",
  },
  {
    quote: "Remember, your work is only as good as the discipline you put into it each day. Remember your purpose.",
    author: "Sir M. Visvesvaraya",
    role: "Bharat Ratna & Father of Modern Indian Engineering",
    avatarSeed: "Visvesvaraya",
    badge: "Engineering Ethics",
  },
  {
    quote: "If you want to master something, teach it. The ultimate test of knowledge is your ability to break it down simply.",
    author: "Richard Feynman",
    role: "Nobel Laureate Physicist & Quantum Pioneer",
    avatarSeed: "Feynman",
    badge: "Deep First Principles",
  },
];

export const MotivationalQuoteBanner: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  // Auto-rotate quotes every 22 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      handleNextQuote();
    }, 22000);
    return () => clearInterval(timer);
  }, [index]);

  const current = MOTIVATIONAL_THOUGHTS[index];

  const handleNextQuote = () => {
    setIsRotating(true);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % MOTIVATIONAL_THOUGHTS.length);
      setIsRotating(false);
    }, 150);
  };

  const handleCopyQuote = () => {
    navigator.clipboard.writeText(`"${current.quote}" — ${current.author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-[#101726] to-[#0c1e28] dark:from-[#0d1424] dark:via-[#11192e] dark:to-[#0a1c22] border border-emerald-500/25 dark:border-teal-500/30 p-4 sm:p-5 text-white shadow-xl shadow-black/15 group">
      {/* Dynamic ambient background glows */}
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Quote Body */}
        <div className="space-y-2.5 max-w-3xl flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full shadow-2xs">
              <Flame className="w-3.5 h-3.5 text-orange-400 fill-current animate-pulse" />
              <span>Daily High-Energy Mindset</span>
            </span>

            <span className="text-[10px] font-mono text-cyan-300 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              {current.badge}
            </span>
          </div>

          {/* Quote Text */}
          <div className="flex items-start gap-2.5 pt-0.5">
            <Quote className="w-6 h-6 text-emerald-400/70 shrink-0 rotate-180 hidden sm:block mt-1" />
            <blockquote className={`text-sm sm:text-base md:text-lg font-medium tracking-tight text-stone-100 leading-snug transition-all duration-300 ${
              isRotating ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
            }`}>
              "{current.quote}"
            </blockquote>
          </div>

          {/* Author info & credential */}
          <div className="flex items-center gap-2 pt-1 pl-0 sm:pl-8">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <div className="text-xs">
              <strong className="text-emerald-300 font-bold text-sm tracking-tight mr-1.5">
                {current.author}
              </strong>
              <span className="text-stone-400 font-mono text-[11px] sm:text-xs">
                · {current.role}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
          <button
            type="button"
            onClick={handleNextQuote}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/25 border border-white/15 text-xs font-bold text-white flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
            title="Load next energetic thought"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isRotating ? 'animate-spin' : ''}`} />
            <span>Next Fire Thought ⚡</span>
          </button>

          <button
            type="button"
            onClick={handleCopyQuote}
            className="px-3 py-1.5 rounded-xl bg-stone-800/80 hover:bg-stone-700/80 border border-stone-700/80 text-[11px] font-mono text-stone-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Copy quote to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-stone-400" />
                <span>Copy Quote</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
