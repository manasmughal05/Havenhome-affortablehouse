import React, { useState } from 'react';
import { Bot, Send, User, Sparkles, HelpCircle, ShieldCheck, FileText, Calculator, PhoneCall } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/i18n';

interface AiHousingAdvisorProps {
  language: Language;
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
}

export const AiHousingAdvisor: React.FC<AiHousingAdvisorProps> = ({ language }) => {
  const t = translations[language];

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: "Hello! I am your HavenHome AI Housing Counselor. I'm here to help low-income families navigate HUD guidelines, calculate AMI income tiers, gather required paperwork, and understand Section 8 vouchers. What question can I answer for you today?",
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    "What documents do I need to prepare for my application?",
    "How does Section 8 Voucher rent calculation work?",
    "What does 30% AMI vs 50% AMI mean for my rent?",
    "What are my rights under HUD Fair Housing Act?",
  ];

  const handleSend = async (textToSend?: string) => {
    const prompt = textToSend || inputPrompt;
    if (!prompt.trim() || isLoading) return;

    const userMsg: Message = { sender: 'user', text: prompt };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/advisor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          history: messages,
          userProfile: {
            householdSize: 3,
            annualIncome: 36000,
            amiCategory: '50% AMI',
            location: 'SF Bay Area / Metro',
          },
        }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: data.reply || "I am available to assist with your housing questions. You can also call 211 for local community services.",
        },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: "Area Median Income (AMI) measures HUD income tiers. 30% AMI is Extremely Low Income, 50% AMI is Very Low Income, and 80% AMI is Low Income. For emergency assistance call 211.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-stone-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Powered by Gemini AI</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{t.navAdvisor}</h1>
            <p className="text-stone-300 text-xs sm:text-sm mt-1">
              Ask any question about low-income housing rules, required paperwork, Section 8, or tenant rights.
            </p>
          </div>
          <div className="p-3 bg-emerald-800/50 rounded-2xl border border-emerald-500/30 text-emerald-300 flex items-center gap-2 text-xs font-semibold shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>24/7 Confidential Assistance</span>
          </div>
        </div>
      </div>

      {/* Quick Questions Chips */}
      <div className="flex flex-wrap gap-2 text-xs font-medium">
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-stone-800 border border-stone-200 hover:border-emerald-400 shadow-xs transition-all text-left flex items-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{q}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Box */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-4 min-h-[400px] max-h-[550px] overflow-y-auto flex flex-col justify-between">
        <div className="space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 max-w-2xl ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                m.sender === 'user' ? 'bg-stone-800' : 'bg-emerald-600'
              }`}>
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                m.sender === 'user'
                  ? 'bg-stone-900 text-white font-medium rounded-tr-xs'
                  : 'bg-stone-50 text-stone-900 border border-stone-200 rounded-tl-xs'
              }`}>
                {m.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 text-stone-500 text-xs font-semibold">
              <Bot className="w-5 h-5 text-emerald-600 animate-spin" />
              <span>Analyzing HUD regulations and guidelines...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-4 border-t border-stone-200 flex gap-2">
          <input
            id="advisor-input-field"
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your housing or application question..."
            className="flex-1 p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            id="advisor-send-btn"
            onClick={() => handleSend()}
            disabled={isLoading || !inputPrompt.trim()}
            className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-300 text-white font-bold rounded-2xl text-xs sm:text-sm transition-all flex items-center gap-2 shrink-0 shadow-md"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask Advisor</span>
          </button>
        </div>
      </div>
    </div>
  );
};
