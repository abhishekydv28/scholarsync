import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChatMessage } from '../types';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Coffee,
  Clock,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

export const AiCoachDrawer: React.FC = () => {
  const {
    isAiDrawerOpen,
    setIsAiDrawerOpen,
    profile,
    bandwidth,
    injectBufferZone,
    recalibrateSchedule,
  } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      content: `Hey ${profile.name || 'Engineer'}! Senior Campus Mentor here. 🎓
Engineering ki ground reality hum sab jaante hain:
• **75% Attendance:** Ek lecture bunk kiya toh debar list ka darr.
• **Lab Viva & Externals:** File check karne se pehle cross-questioning.
• **Exam Panic:** Semester exam se 3 din pehle syllabus dekh ke sochna *"Ye kab padhaaya tha?"*

How can I help you today?
• 🚨 **72-Hour Exam Survival Plan** (High-yield 80/20 topics & PYQ strategy)
• ☕ **Burnout / Lab Fatigue** (Recalibrate today into a calm rest day)
• 💻 **Balancing LeetCode & College Marks**
• 🔬 **Lab External Viva Prep**`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAiDrawerOpen) return null;

  const quickPrompts = [
    'I have my Data Structures mid-term in 3 days. What\'s my 72-hour survival plan?',
    'I\'m exhausted from back-to-back labs today. Balance my schedule for a rest day.',
    'What are the guaranteed lab viva questions external examiners ask in OS?',
    'How do I maintain daily LeetCode consistency without dropping college marks?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          context: {
            college: profile.college,
            branch: profile.branch,
            semester: profile.semester,
            bandwidth: `${bandwidth.densityScore}% (${bandwidth.status})`,
            habits: profile.selectedHabits,
          },
        }),
      });

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        content: data.reply || 'I am recalibrating your schedule. Remember to pace yourself with dedicated buffer zones.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          content: 'Here is a calm plan: Focus on the high-yield 80/20 topics first, and protect a 20-minute restorative buffer block before evening review.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsAiDrawerOpen(false)}
        className="absolute inset-0 bg-stone-950/40 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Container */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-stone-50 dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-white dark:bg-stone-900">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Senior Campus Mentor
                </h3>
                <div className="text-[11px] text-stone-500 dark:text-stone-400">
                  {profile.branch.split('(')[0]} · Exam & Campus Guide
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsAiDrawerOpen(false)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              aria-label="Close Coach"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action Pills in Header */}
          <div className="px-4 py-2 bg-stone-100/70 dark:bg-stone-800/50 border-b border-stone-200/80 dark:border-stone-800 flex items-center justify-between text-xs">
            <span className="text-stone-500 text-[11px]">Quick Recalibration:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  injectBufferZone();
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: `act-${Date.now()}`,
                      sender: 'assistant',
                      content: 'Added a 25-minute calm Buffer Zone to your timeline. Step away from your laptop, hydrate, and stretch.',
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    },
                  ]);
                }}
                className="text-teal-700 dark:text-teal-300 hover:underline flex items-center gap-1 font-medium"
              >
                <Coffee className="w-3 h-3" />
                <span>+ Chill Block</span>
              </button>
              <span>·</span>
              <button
                onClick={() => {
                  recalibrateSchedule();
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: `act-${Date.now()}`,
                      sender: 'assistant',
                      content: 'I have auto-recalibrated your day. Unfinished tasks are spaced into 45-min sprints without guilt.',
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    },
                  ]);
                }}
                className="text-teal-700 dark:text-teal-300 hover:underline flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Auto-Balance</span>
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs leading-relaxed ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-teal-800 text-stone-100 flex items-center justify-center shrink-0 text-xs font-serif font-bold">
                    P
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 ${
                    msg.sender === 'user'
                      ? 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900'
                      : 'bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700 text-stone-800 dark:text-stone-200 shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-line prose-xs">
                    {msg.content}
                  </div>
                  <div className="mt-1 text-[10px] text-stone-400 text-right">
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-stone-300 dark:bg-stone-700 text-stone-700 dark:text-stone-300 flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-stone-500 pl-10">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-teal-600" />
                <span>Formulating calm engineering strategy...</span>
              </div>
            )}
          </div>

          {/* Suggested Quick Prompts */}
          <div className="p-3 bg-stone-100/60 dark:bg-stone-800/40 border-t border-stone-200 dark:border-stone-800">
            <div className="text-[11px] text-stone-500 dark:text-stone-400 mb-1.5 font-medium">
              Common Student Scenarios:
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-[11px] text-stone-700 dark:text-stone-300 hover:border-teal-500 hover:text-teal-700 dark:hover:text-teal-300 transition-colors shrink-0 max-w-[240px] truncate text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about 72-hr plans, burnout, lab viva, DSA..."
                className="flex-1 rounded-xl bg-stone-100 dark:bg-stone-800 px-3.5 py-2 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
              />
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="p-2 rounded-xl bg-teal-800 hover:bg-teal-700 text-stone-100 disabled:opacity-40 transition-colors shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
