import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Clock,
  BookOpen,
  CalendarPlus,
  RefreshCw,
  Flame,
  ShieldAlert,
  GraduationCap,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const AiCampusMentorDrawer: React.FC = () => {
  const {
    isAiDrawerOpen,
    setIsAiDrawerOpen,
    profile,
    bandwidth,
    scheduleStudyBlock,
  } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      content: `Hey ${profile.name || 'Scholar'}! I'm your Senior Campus Mentor on PlanZo. Whether you're stressed about mid-sems, falling behind on your timetable, or trying to manage 75% attendance without burning out—ask me anything. How can I help with your routine today?`,
      timestamp: 'Just now',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAiDrawerOpen) {
      scrollToBottom();
    }
  }, [messages, isAiDrawerOpen]);

  if (!isAiDrawerOpen) return null;

  const quickPrompts = [
    'I missed my morning study block, how do I recalibrate?',
    '72-hour exam recovery plan for unit tests',
    'How do I balance lab practicals with DSA problem solving?',
    'What is the smartest way to manage the 75% attendance rule?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.content,
          })),
          context: {
            college: profile.customCollege || profile.college,
            branch: profile.branch,
            semester: profile.semester,
            bandwidth: `${bandwidth.densityScore}% density (${bandwidth.status})`,
            name: profile.name,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        content: data.reply || 'Here is your guidance for today. Remember to pace yourself with proper buffer breaks.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        content: `Here is a practical senior's advice: When you fall behind, do not try to double your hours. Use the 80/20 Pareto rule: focus on the repeating 10-mark questions from previous years' papers, insert a 25-minute buffer break, and shift heavy problem-solving to your peak focus morning slot.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-950/40 backdrop-blur-xs animate-fadeIn">
      {/* Drawer Container */}
      <div className="w-full max-w-lg bg-white dark:bg-[#0c1017] border-l border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col h-full animate-slideInRight">
        
        {/* Header */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Campus Senior & Mentor
                </h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-700 dark:text-teal-300 font-semibold border border-teal-500/20">
                  AI Guide
                </span>
              </div>
              <p className="text-[11px] text-stone-500 italic">
                For the student, by the student, to the student
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAiDrawerOpen(false)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="Close Assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs leading-relaxed">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-teal-600/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 shadow-2xs whitespace-pre-line ${
                  m.sender === 'user'
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 font-medium'
                    : 'bg-stone-100/80 dark:bg-stone-850/80 text-stone-800 dark:text-stone-200 border border-stone-200/60 dark:border-stone-800'
                }`}
              >
                {m.content}
                <div
                  className={`text-[9px] mt-1.5 ${
                    m.sender === 'user' ? 'text-stone-300 dark:text-stone-600' : 'text-stone-400'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2.5 items-center text-xs text-stone-400 pl-8">
              <RefreshCw className="w-3 h-3 animate-spin text-teal-600" />
              <span>Campus Senior is typing advice...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 border-t border-stone-100 dark:border-stone-850 bg-stone-50/30 dark:bg-stone-900/20 space-y-1.5">
          <div className="text-[10px] uppercase font-mono text-stone-400 font-semibold tracking-wider">
            Quick Topics
          </div>
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                className="px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 text-[11px] text-stone-600 dark:text-stone-300 hover:border-teal-500/50 hover:text-teal-700 dark:hover:text-teal-300 whitespace-nowrap transition-colors cursor-pointer shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-[#0c1017]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask senior: exam recovery, timetable balance, attendance..."
              className="flex-1 px-3 py-2 rounded-xl text-xs bg-stone-100 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-950 transition-colors disabled:opacity-40 cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
