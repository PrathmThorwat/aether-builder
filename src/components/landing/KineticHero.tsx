import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { ArrowRight, Command, Sparkles, Zap } from 'lucide-react';
import HeroCanvas from './HeroCanvas';

interface KineticHeroProps {
  onLaunchStudio: (initialPrompt: string, engine: string) => void;
}

const ENGINES = ['WebContainer (Client)', 'E2B Micro-VM', 'Fly.io Edge'];

const SUGGESTIONS = [
  'Luxury 3D sneaker configurator',
  'Fintech crypto terminal',
  'Enterprise SaaS dashboard',
];

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: 'easeOut' },
  },
};

const DEFAULT_PROMPT =
  'Build a 3D Luxury Watch Storefront with an interactive WebGL viewer and Stripe checkout';

export default function KineticHero({ onLaunchStudio }: KineticHeroProps) {
  const [prompt, setPrompt] = useState('');
  const [engine, setEngine] = useState(ENGINES[0]);

  const handleGenerate = () => {
    onLaunchStudio(prompt.trim() || DEFAULT_PROMPT, engine);
  };

  return (
    <section id="top" className="relative overflow-hidden pb-16 pt-32 sm:pb-20 sm:pt-36 lg:pt-40">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 top-24 h-[420px] w-[420px] rounded-full bg-blue-600/[0.05] blur-[120px]" />
        <div className="absolute -left-32 top-52 h-[380px] w-[380px] rounded-full bg-slate-200/50 blur-[120px]" />
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-[1.04fr_0.96fr] lg:gap-4">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="relative z-10">
          <motion.div variants={itemVariants} className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-white py-1.5 pl-2 pr-3.5 shadow-[0_2px_10px_-4px_rgba(15,23,42,0.1)]">
            <span className="relative flex h-5 w-5 items-center justify-center">
              <span className="absolute h-2 w-2 animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[11px] font-medium tracking-wide text-slate-500">
              AI Architect <span className="font-semibold text-slate-800">2.4</span>
            </span>
            <span className="h-3 w-px bg-slate-200" />
            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-600">
              <Zap className="h-3 w-3" />
              Engine online
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-display text-[40px] font-bold leading-[1.05] tracking-[-0.03em] text-[#0B192C] sm:text-6xl lg:text-[64px]"
          >
            The easiest way to build 3D spatial &amp; full-stack apps.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-xl text-[15px] leading-relaxed text-slate-600 sm:text-base"
          >
            A venture studio for the next generation of software. Describe a product and
            AetherForge architects the WebGL front end, PostgreSQL schema, authentication, and live
            sandbox in one pass.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-9">
            <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] transition-all duration-300 focus-within:border-blue-300 focus-within:shadow-[0_8px_30px_-8px_rgba(37,99,235,0.18)]">
              <div className="flex flex-col gap-2 p-1.5 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-3 px-2">
                  <Sparkles className="h-5 w-5 shrink-0 text-blue-600" />
                  <input
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') handleGenerate();
                    }}
                    placeholder="Describe the app you want to ship..."
                    className="min-w-0 flex-1 bg-transparent py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    aria-label="Describe your app"
                  />
                </div>
                <button
                  onClick={handleGenerate}
                  className="group/cta inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0B192C] px-5 py-3 text-[13px] font-semibold text-white shadow-[0_6px_18px_-8px_rgba(15,23,42,0.5)] transition-all duration-300 hover:bg-[#0F172A] active:scale-[0.98]"
                >
                  <span>Generate App</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-0.5" />
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-3 py-2.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Runtime
                  </span>
                  {ENGINES.map((option) => (
                    <button
                      key={option}
                      onClick={() => setEngine(option)}
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold transition-all ${
                        engine === option
                          ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <span className="hidden items-center gap-1 text-[10px] text-slate-400 sm:flex">
                  <Command className="h-3 w-3" />
                  <span>Enter to build</span>
                </span>
              </div>
            </div>

            <div className="mt-3.5 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Try
              </span>
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setPrompt(suggestion)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-600 transition-all hover:border-blue-300 hover:text-blue-700"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 text-[11px] font-medium text-slate-500"
          >
            <span>
              <strong className="font-semibold text-slate-900">12,400+</strong> apps shipped
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>
              <strong className="font-semibold text-slate-900">Sub-second</strong> sandbox boot
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>
              <strong className="font-semibold text-slate-900">Dual-mode</strong> spatial + SaaS
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
          className="relative"
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.08),transparent_65%)] blur-2xl sm:h-[460px] sm:w-[460px]" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200 sm:h-[380px] sm:w-[380px]" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-slate-200/80 sm:h-[500px] sm:w-[500px]" />

          <HeroCanvas />

          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.85, duration: 0.55 }}
            className="pointer-events-none absolute left-0 top-6 hidden rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.12)] backdrop-blur sm:block"
          >
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Render pipeline
            </p>
            <p className="mt-0.5 font-mono text-[11px] text-slate-700">WebGL · 60fps</p>
          </motion.div>

          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute right-0 top-16 hidden rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.12)] backdrop-blur sm:block"
          >
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Material
            </p>
            <p className="mt-0.5 font-mono text-[11px] text-slate-700">Brushed silver</p>
          </motion.div>

          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
            className="pointer-events-none absolute bottom-10 left-2 hidden rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.12)] backdrop-blur sm:block"
          >
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              <p className="font-mono text-[11px] text-slate-700">Prisma schema synced</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut', delay: 1.3 }}
            className="pointer-events-none absolute bottom-24 right-0 hidden rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.12)] backdrop-blur sm:block"
          >
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <p className="font-mono text-[11px] text-slate-700">container ready</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
