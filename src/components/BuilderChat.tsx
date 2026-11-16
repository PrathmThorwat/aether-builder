import { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, CheckCircle2, Loader2, Bot, User, FileCode2 } from 'lucide-react';
import type { AiStatus } from '../services/aiGenerator';

export interface BuildStep {
  id: string;
  label: string;
  file?: string;
  status: 'pending' | 'running' | 'done';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  steps?: BuildStep[];
}

interface BuilderChatProps {
  initialPrompt: string;
  aiStatus: AiStatus;
  aiFallbackReason: string;
  onBuildComplete: (prompt: string) => void;
  onSelectFile: (fileName: string) => void;
}

export default function BuilderChat({
  initialPrompt,
  aiStatus,
  aiFallbackReason,
  onBuildComplete,
  onSelectFile,
}: BuilderChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!justCompleted) return;
    const timer = window.setTimeout(() => setJustCompleted(false), 1800);
    return () => window.clearTimeout(timer);
  }, [justCompleted]);

  const runBuildSequence = (promptText: string) => {
    setIsGenerating(true);
    setJustCompleted(false);

    const promptPreview =
      promptText.length > 48 ? promptText.slice(0, 48).trimEnd() + '…' : promptText;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: promptText,
    };

    const assistantId = (Date.now() + 1).toString();
    const initialSteps: BuildStep[] = [
      {
        id: '1',
        label: `Analyzing requirements for: ${promptPreview}`,
        status: 'running',
      },
      {
        id: '2',
        label: 'Generating React components & Tailwind styles',
        file: '/App.tsx',
        status: 'pending',
      },
      {
        id: '3',
        label: 'Bundling database schema',
        file: '/prisma/schema.prisma',
        status: 'pending',
      },
      {
        id: '4',
        label: 'Compiling live Sandpack preview',
        status: 'pending',
      },
    ];

    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: `Architecting a live workspace for "${promptPreview}". Wiring the scenario-specific hero, typed data layer, and Sandpack preview:`,
      steps: initialSteps,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);

    const timers = [350, 750, 1100, 1500];
    timers.forEach((delay, index) => {
      window.setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id !== assistantId || !msg.steps) return msg;
            const updatedSteps = msg.steps.map((step, sIdx) => {
              if (sIdx <= index) return { ...step, status: 'done' as const };
              if (sIdx === index + 1) return { ...step, status: 'running' as const };
              return step;
            });
            return { ...msg, steps: updatedSteps };
          })
        );

        if (index === timers.length - 1) {
          setIsGenerating(false);
          setJustCompleted(true);
          onBuildComplete(promptText);
        }
      }, delay);
    });
  };

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      const startPrompt = initialPrompt || '3D Luxury Chronometer Storefront with WebGL viewer';
      runBuildSequence(startPrompt);
    }
  }, [initialPrompt]);

  const handleSend = () => {
    if (!input.trim() || isGenerating) return;
    const text = input.trim();
    setInput('');
    runBuildSequence(text);
  };

  return (
    <aside className="flex h-full w-[340px] shrink-0 flex-col overflow-hidden overflow-x-hidden border-r border-slate-200 bg-white">
      {/* Sidebar Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-md border border-blue-100 bg-blue-50 text-blue-600">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">AI Architect</span>
        </div>
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-colors ${
            isGenerating
              ? 'border-blue-200 bg-blue-50 text-blue-600'
              : justCompleted
              ? 'border-emerald-300 bg-emerald-100 text-emerald-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-600'
          }`}
        >
          {isGenerating ? 'Building...' : 'Ready'}
        </span>
      </div>

      <div className="shrink-0 border-b border-slate-200 bg-slate-50/60 p-2">
        {aiStatus === 'live' ? (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
            <span className="min-w-0 truncate">Live AI: openai/gpt-oss-120b</span>
          </div>
        ) : (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[10px] text-amber-800">
            <div className="flex items-center gap-1.5 font-semibold">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              Fallback Reason:
            </div>
            <p className="mt-0.5 max-h-20 overflow-y-auto break-words font-mono text-[9px] leading-relaxed text-amber-700">
              {aiFallbackReason}
            </p>
          </div>
        )}
      </div>

      {/* Chat Stream */}
      <div className="min-h-0 min-w-0 flex-1 space-y-4 overflow-x-hidden overflow-y-auto bg-slate-50/40 p-4">
        {messages.map((msg) => (
          <div key={msg.id} className="min-w-0 space-y-2.5">
            <div className="flex min-w-0 items-start gap-2.5">
              <div
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                  msg.role === 'user'
                    ? 'border border-slate-200 bg-white text-slate-500'
                    : 'bg-[#0F172A] text-white'
                }`}
              >
                {msg.role === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
              </div>
              <div className="min-w-0 flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white p-3 text-xs leading-relaxed text-slate-600 shadow-sm">
                <p className="break-words">{msg.content}</p>

                {/* Live Build Steps */}
                {msg.steps && (
                  <div className="mt-3 space-y-2 border-t border-slate-200 pt-3">
                    {msg.steps.map((step) => (
                      <div
                        key={step.id}
                        onClick={() => step.file && onSelectFile(step.file)}
                        className={`flex w-full min-w-0 items-center justify-between gap-2 rounded-lg border p-2 text-[11px] transition-all ${
                          step.file ? 'cursor-pointer hover:border-blue-300' : ''
                        } ${
                          step.status === 'done'
                            ? 'border-slate-200 bg-slate-50 text-slate-600'
                            : step.status === 'running'
                            ? 'border-blue-200 bg-blue-50 text-slate-900'
                            : 'border-slate-100 bg-white text-slate-400'
                        }`}
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                          {step.status === 'done' ? (
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                          ) : step.status === 'running' ? (
                            <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-blue-600" />
                          ) : (
                            <div className="h-3.5 w-3.5 shrink-0 rounded-full border border-slate-300" />
                          )}
                          <span className="min-w-0 flex-1 truncate text-xs">{step.label}</span>
                        </div>
                        {step.file && (
                          <span className="inline-flex max-w-[115px] shrink-0 items-center gap-1 overflow-hidden font-mono text-[11px] text-blue-600">
                            <FileCode2 className="h-3 w-3 shrink-0" />
                            <span className="min-w-0 truncate">{step.file.split('/').pop()}</span>
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Follow-up Prompt Input */}
      <div className="shrink-0 border-t border-slate-200 bg-white p-3">
        <div className="flex min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 transition-colors focus-within:border-blue-400 focus-within:bg-white">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isGenerating}
            placeholder="Ask AI to refine colors, layout, or API..."
            className="min-w-0 flex-1 border-none bg-transparent text-xs text-slate-900 outline-none placeholder:text-slate-400 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isGenerating || !input.trim()}
            className="shrink-0 cursor-pointer rounded-lg bg-[#0F172A] p-2 text-white transition-all hover:bg-slate-800 disabled:opacity-40"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
