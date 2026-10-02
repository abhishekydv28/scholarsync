import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bot,
  Send,
  Sparkles,
  Coffee,
  RotateCcw,
  CheckCircle2,
  Play,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Zap,
  GraduationCap,
} from 'lucide-react';
import { ChatMessage } from '../types';

export const SarthiAiView: React.FC = () => {
  const {
    profile,
    attendance,
    overallAttendancePercentage,
    bandwidth,
    recalibrateSchedule,
    injectBufferZone,
    startZenMode,
    awardXp,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      sender: 'assistant',
      content: `Hello ${profile.name || 'Engineer'}! 👋 I am **Sarthi**, your Senior B.Tech Mentor & Academic Copilot.\n\nI understand Indian engineering realities: the 75% attendance rule, surprise viva questions, lab records, mass bunks, and exam preparation using PYQs. How can I assist you right now?`,
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const promptSuggestions = [
    { label: 'Plan my day', prompt: 'Look at my classes and habits for today, and suggest the best high-yield study plan.' },
    { label: 'Fix my schedule', prompt: 'I missed my morning study slot and feel overwhelmed. Please quietly recalibrate my schedule.' },
    { label: 'Help with attendance', prompt: 'My attendance is near 75%. How many classes can I safely bunk or need to attend?' },
    { label: 'Prepare for exam', prompt: 'What is the 80/20 Pareto strategy for engineering mid-semester and end-semester exams?' },
    { label: 'Prioritize tasks', prompt: 'Help me prioritize between my programming lab manual, DSA practice, and theory revision.' },
    { label: 'Explain a topic', prompt: 'Give me an intuitive breakdown of a complex CS topic with practical real-world analogy.' },
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Call server AI endpoint with fallback
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          context: {
            college: profile.customCollege || profile.college,
            branch: profile.branch,
            semester: profile.semester,
            bandwidth: bandwidth.status,
            attendance: overallAttendancePercentage,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          setMessages((prev) => [
            ...prev,
            {
              id: `assistant-${Date.now()}`,
              sender: 'assistant',
              content: data.reply,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
          awardXp(15, 'Consulted Sarthi AI');
          setIsTyping(false);
          return;
        }
      }
    } catch (e) {
      // Fallback
    }

    // Heuristic deterministic fallback
    setTimeout(() => {
      let botReply = '';
      const lower = text.toLowerCase();

      if (lower.includes('recalibrate') || lower.includes('schedule') || lower.includes('overwhelmed') || lower.includes('missed')) {
        recalibrateSchedule('Recalibrated via Sarthi Copilot');
        awardXp(15, 'Schedule recalibrated');
        botReply = `Done! ⚡ I have auto-recalibrated your timetable without any guilt:\n\n• Shifted non-critical tasks to evening open slots.\n• Reserved your night sleep window (11:30 PM) strictly intact.\n• Preserved a 20-minute buffer zone.\n\nTake a deep breath — you do not need to catch up on everything at once. Focus on the single next task on your dashboard.`;
      } else if (lower.includes('attendance') || lower.includes('75%') || lower.includes('bunk')) {
        const attended = attendance.reduce((acc, a) => acc + a.attendedClasses, 0);
        const total = attendance.reduce((acc, a) => acc + a.totalClasses, 0);
        const safe = overallAttendancePercentage >= 75;
        botReply = `Here is your Attendance Diagnostic for **${profile.customCollege || profile.college || 'Engineering College'}**:\n\n` +
          `• Current Overall Attendance: **${overallAttendancePercentage}%** (${safe ? 'Safe Zone 🟢' : 'Risk Zone ⚠️'})\n` +
          `• Total Classes Attended: **${attended} / ${total}**\n\n` +
          `**Golden Rules to protect your eligibility:**\n` +
          `1. Prioritize **Lab Sessions**: Labs carry 2-4 hours credit and missing one hurts attendance twice as hard.\n` +
          `2. Check the **Attendance Guard** tab to see exactly how many consecutive lectures you must attend per subject to reach 75%.\n` +
          `3. Keep medical slips and fest participation duty-leave certificates ready before end-sem debar lists are published!`;
      } else if (lower.includes('exam') || lower.includes('syllabus') || lower.includes('pyq') || lower.includes('prepare')) {
        botReply = `Here is the **Proven 80/20 Engineering Exam Blueprint**:\n\n` +
          `1. **Study Past 5 Years PYQ (Previous Year Questions)**: Over 65% of numerical and theorem questions in university exams repeat directly or with minor parameter changes.\n` +
          `2. **Target High-Weightage Units First**: In our Academic Vault, check Module 1 & 2 for foundational theorems, and Module 4 & 5 for 14-mark design questions.\n` +
          `3. **Watch 1.5x Topic Playlists**: Abdul Bari for Algorithms, Gate Smashers for OS/DBMS, and Knowledge Gate for Theory of Computation.\n` +
          `4. **Diagrams & Flowcharts**: Engineering professors award high marks for neat architecture diagrams and flowcharts!`;
      } else {
        botReply = `Here is a calm, balanced plan for your **${profile.branch || 'engineering'}** coursework:\n\n` +
          `1. Keep daily deep study sessions in **45-minute focused sprints** with intentional 10-15 minute cognitive buffer zones.\n` +
          `2. Complete your highest-cognitive load task before afternoon college hours.\n` +
          `3. Use the **Focus Garden** or **Zen Mode** whenever distractions occur.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          content: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-125px)] bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl shadow-xs overflow-hidden">
      {/* Top Copilot Context Bar */}
      <div className="px-5 py-3.5 border-b border-stone-100 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-850/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Sarthi AI Copilot
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold">
                Online
              </span>
            </div>
            <p className="text-[11px] text-stone-500">
              Senior B.Tech Mentor & Pareto Study Assistant
            </p>
          </div>
        </div>

        {/* Real Context Chips */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-medium">
            Sem {profile.semester}
          </span>
          <span className={`px-2 py-0.5 rounded-md font-medium ${
            overallAttendancePercentage >= 75
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
              : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
          }`}>
            {overallAttendancePercentage}% Attendance
          </span>
          <span className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-medium">
            {bandwidth.status} load
          </span>
        </div>
      </div>

      {/* Suggested Action Chips */}
      <div className="px-5 py-2.5 bg-white dark:bg-stone-900 border-b border-stone-100 dark:border-stone-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[11px] text-stone-400 font-semibold uppercase tracking-wider shrink-0">
          Suggested:
        </span>
        {promptSuggestions.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(item.prompt)}
            className="shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-teal-50 hover:text-teal-800 dark:hover:bg-teal-950/60 dark:hover:text-teal-300 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                isUser
                  ? 'bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900'
                  : 'bg-teal-700 text-white'
              }`}>
                {isUser ? 'U' : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                isUser
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-medium'
                  : 'bg-stone-50 dark:bg-stone-850 border border-stone-200/70 dark:border-stone-800 text-stone-800 dark:text-stone-200'
              }`}>
                <div className="whitespace-pre-line">{msg.content}</div>
                <div className={`text-[10px] mt-2 font-mono ${isUser ? 'text-stone-300 dark:text-stone-500' : 'text-stone-400'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <Bot className="w-4 h-4 text-teal-600 animate-pulse" />
            <span>Sarthi is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about syllabus weightage, viva questions, 75% attendance, or schedule recalibration..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-850 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-medium"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="p-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white disabled:opacity-40 transition-opacity cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
