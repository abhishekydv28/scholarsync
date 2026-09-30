import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Coffee,
  RotateCcw,
  BookOpen,
  ShieldAlert,
  Zap,
  CheckCircle2,
  Clock,
  ChevronRight,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { ChatMessage } from '../types';

interface StudentAiChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudentAiChatbotModal: React.FC<StudentAiChatbotModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    profile,
    timetable,
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
      content: `Namaste ${profile.name || 'Friend'}! 🙏 I am **Sarthi**, your 24/7 B.Tech & Student-Life AI Copilot.\n\n*For the student, by the student, to the student.* I know the pressure of 75% attendance, surprise lab viva, mid-sems, and balancing DSA with college lectures. How can I assist you right now?`,
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  // Quick suggestion chips based on real engineering dilemmas
  const promptSuggestions = [
    {
      label: '⚡ Fix Today\'s Schedule',
      prompt: 'I missed my morning study slot and feeling overwhelmed. Please recalibrate my remaining tasks for today.',
    },
    {
      label: '🛡️ 75% Attendance Hack',
      prompt: 'My current attendance is below 75%. How should I plan my classes this month to reach the safe zone?',
    },
    {
      label: '☕ I Need a Chill Block',
      prompt: 'My brain feels completely saturated from labs. Help me add a restorative chill block without feeling guilty.',
    },
    {
      label: '📚 End-Sem Exam Strategy',
      prompt: 'How should I break down my 5-unit syllabus if exams are only 2 weeks away?',
    },
    {
      label: '💻 DSA & Coding Routine',
      prompt: 'How to consistently solve 2 LeetCode problems daily along with heavy college hours?',
    },
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

    // Contextual responses tailored specifically for college engineering realities
    setTimeout(async () => {
      let botReply = '';
      let actionablePlan: ChatMessage['actionablePlan'] | undefined = undefined;

      const lower = text.toLowerCase();

      if (lower.includes('recalibrate') || lower.includes('overwhelmed') || lower.includes('missed') || lower.includes('schedule')) {
        await recalibrateSchedule('Recalibrated via Sarthi AI Assistant');
        awardXp(15, 'Schedule balanced with AI Sarthi');
        botReply = `Done! ⚡ I have auto-recalibrated your timetable without any guilt:\n\n• Shifted non-critical tasks to evening open slots.\n• Reserved your night sleep window (11:30 PM) strictly intact.\n• Preserved a 20-minute buffer zone.\n\nTake a deep breath — you do not need to catch up on everything at once. Focus on the single next task on your dashboard.`;
        actionablePlan = { type: 'recalibrate', payload: {} };
      } else if (lower.includes('attendance') || lower.includes('75%') || lower.includes('bunk')) {
        const attended = attendance.reduce((acc, a) => acc + a.attendedClasses, 0);
        const total = attendance.reduce((acc, a) => acc + a.totalClasses, 0);
        const safe = overallAttendancePercentage >= 75;

        botReply = `Here is your Attendance Diagnostic for **${profile.college || 'College'}**:\n\n` +
          `• Current Overall Attendance: **${overallAttendancePercentage}%** (${safe ? 'Safe Zone 🟢' : 'Medical Condonation / Risk Zone ⚠️'})\n` +
          `• Total Classes Attended: **${attended} / ${total}**\n\n` +
          `**Golden Engineering Rules to stay safe:**\n` +
          `1. Prioritize **Lab Sessions**: Labs carry 2-4 hours credit and missing one hurts attendance twice as hard.\n` +
          `2. Check the **Attendance Tracker** tab to see exactly how many consecutive lectures you must attend per subject to hit 75%.\n` +
          `3. Keep medical slips and fest participation duty-leave certificates ready before end-sem debar lists are published!`;
      } else if (lower.includes('chill') || lower.includes('buffer') || lower.includes('tired') || lower.includes('exhausted') || lower.includes('burnout')) {
        injectBufferZone();
        awardXp(10, 'Mindful chill block taken');
        botReply = `I hear you. College burnout is real, especially with long lectures and lab records.\n\n☕ **I just injected a 25-minute Calm Chill Block into your schedule!**\n\nDuring this break:\n• Step away from IDEs and laptop screens.\n• Drink a glass of water or grab chai.\n• Listen to the calming Lo-Fi Flute in PlanZo (top bar 🎧 icon).\n\nYour next study block will feel 2x easier after this reset.`;
        actionablePlan = { type: 'add_buffer', payload: {} };
      } else if (lower.includes('exam') || lower.includes('syllabus') || lower.includes('pyq') || lower.includes('end-sem') || lower.includes('mid-sem')) {
        botReply = `Here is the **Proven 80/20 Engineering Exam Blueprint**:\n\n` +
          `1. **Download Past 5 Years PYQ (Previous Year Questions)**: Over 65% of numerical and theorem questions in university exams (RGPV, AKTU, VTU) repeat directly or with minor parameter changes.\n` +
          `2. **Target High-Weightage Units First**: In our Academic Vault, check Module 1 & 2 for foundational theorems, and Module 4 & 5 for 14-mark design questions.\n` +
          `3. **Watch 1.5x Topic Playlists**: Abdul Bari for Algorithms, Gate Smashers for OS/DBMS, and Knowledge Gate for Theory of Computation.\n` +
          `4. **Diagrams & Flowcharts**: Indian university examiners award 40% of marks for neat circuit diagrams, architecture blocks, and algorithm flowcharts!`;
      } else if (lower.includes('dsa') || lower.includes('leetcode') || lower.includes('coding') || lower.includes('placement')) {
        botReply = `Consistency beats cramming in DSA! Here is how to maintain it without dropping your GPA:\n\n` +
          `• **Morning Golden Window (45 mins)**: Solve 1 medium problem before morning college lectures when your mind is fresh.\n` +
          `• **Stick to a Curated Sheet**: Don't solve random problems. Use **Striver's A2Z DSA Sheet** or **NeetCode 150**.\n` +
          `• **Weekend Mock Contests**: Reserve Saturday night (8:00 PM) for LeetCode Biweekly contest.\n` +
          `• PlanZo has a daily DSA block in your timeline — check it off daily to build your 30-day streak! 🔥`;
      } else {
        botReply = `I understand! As an engineering student, managing coursework, semester labs, coding, and personal life is intense.\n\nHere is what you can do right now:\n1. Open your **Today's Hub** to focus on just 1 task at a time.\n2. If you are stuck on a specific subject, explore the **Academic Vault** for topper notes, PYQs, and guaranteed viva questions.\n3. Click **Auto-Recalibrate** anytime you fall behind — PlanZo never scolds or induces guilt.\n\nWhat topic or issue would you like us to solve next?`;
      }

      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          content: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionablePlan,
        },
      ]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 dark:bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl h-[85vh] max-h-[700px] flex flex-col rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden transition-all">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-900/80 backdrop-blur-xs">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 via-emerald-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <Sparkles className="w-5 h-5" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-stone-900 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  PlanZo Sarthi
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-300">
                  AI Student Copilot
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                For the student, by the student, to the student
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Real-time Context Strip */}
        <div className="px-5 py-2 bg-stone-100/70 dark:bg-stone-800/40 border-b border-stone-200/70 dark:border-stone-800/70 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-2">
            <span>Branch: <strong className="text-stone-700 dark:text-stone-200">{profile.branch || 'B.Tech CSE'}</strong></span>
            <span>·</span>
            <span>Sem {profile.semester}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Attendance: <strong className={overallAttendancePercentage >= 75 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}>{overallAttendancePercentage}%</strong></span>
            <span>·</span>
            <span>Load: <strong className="text-teal-600 dark:text-teal-400">{bandwidth.densityScore}%</strong></span>
          </div>
        </div>

        {/* Chat Messages Scroll Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 text-xs sm:text-[13px] leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-teal-700 text-white rounded-tr-xs'
                      : 'bg-stone-100 dark:bg-stone-800/90 text-stone-800 dark:text-stone-200 border border-stone-200/80 dark:border-stone-700/80 rounded-tl-xs'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.content}</div>

                  {msg.actionablePlan && (
                    <div className="mt-3 pt-2.5 border-t border-stone-200/60 dark:border-stone-700/60 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Action Executed Live</span>
                      </span>
                    </div>
                  )}

                  <div
                    className={`mt-1.5 text-[10px] text-right ${
                      isUser ? 'text-teal-200' : 'text-stone-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 text-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="rounded-2xl px-4 py-3 bg-stone-100 dark:bg-stone-800 text-stone-500 rounded-tl-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="px-4 py-2 border-t border-stone-100 dark:border-stone-800 overflow-x-auto flex items-center gap-2 shrink-0 scrollbar-none bg-stone-50/50 dark:bg-stone-900/50">
          {promptSuggestions.map((item, i) => (
            <button
              key={i}
              onClick={() => handleSend(item.prompt)}
              className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-teal-500 dark:hover:border-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors shadow-2xs"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
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
              placeholder="Ask anything: syllabus help, exam plan, attendance recovery..."
              className="flex-1 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 px-4 py-3 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:border-teal-600 dark:focus:border-teal-400 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="p-3 rounded-2xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-medium shadow-md shadow-teal-700/20 transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
