import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy, Layers, ShieldCheck, Terminal, Zap } from 'lucide-react';

const CLI_COMMAND = 'npx aether-cli init --dual-mode';

const OUTPUT_LINES = [
  { prefix: '◆', text: 'Scaffolding AetherForge dual-mode workspace...', tone: 'text-slate-600' },
  { prefix: '◇', text: 'Spatial runtime · Three.js + React Three Fiber', tone: 'text-slate-500' },
  { prefix: '◇', text: 'Full-stack layer · PostgreSQL + Prisma + Auth', tone: 'text-slate-500' },
  { prefix: '◇', text: 'Sandbox · WebContainer booted in 412ms', tone: 'text-slate-500' },
  { prefix: '✓', text: 'Workspace ready · 31 files · 0 errors', tone: 'text-emerald-600' },
];

export default function CliCallout() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CLI_COMMAND);
    } catch {
      return;
    }
    setCopied(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section id="developers" className="relative scroll-mt-28 bg-white px-5 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)]">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.55 }}
              className="relative flex flex-col justify-center p-8 sm:p-10 lg:p-12"
            >
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.26em] text-blue-600">
                Developer first
              </p>
              <h2 className="font-display text-3xl font-bold leading-[1.1] tracking-[-0.03em] text-[#0B192C] sm:text-4xl">
                Ship from the terminal.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-600">
                Every studio workspace is a real repository. Pull it locally, run the same engine,
                and keep the full-stack toolchain you already know.
              </p>

              <ul className="mt-7 space-y-4">
                {[
                  {
                    icon: Layers,
                    title: 'Dual-mode runtime',
                    desc: 'Spatial WebGL and regular SaaS in a single project.',
                  },
                  {
                    icon: Zap,
                    title: 'Instant local boot',
                    desc: 'Typed SDK, Vite pipeline, and reproducible installs.',
                  },
                  {
                    icon: ShieldCheck,
                    title: 'Production defaults',
                    desc: 'Auth, migrations, observability, and edge deploys.',
                  },
                ].map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <li key={feature.title} className="flex items-start gap-3">
                      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white text-blue-600 shadow-sm">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span>
                        <span className="block text-[12px] font-semibold text-slate-800">
                          {feature.title}
                        </span>
                        <span className="mt-0.5 block text-[11px] leading-relaxed text-slate-500">
                          {feature.desc}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-7 flex flex-wrap gap-1.5">
                {['npm', 'pnpm', 'bun', 'yarn'].map((manager) => (
                  <span
                    key={manager}
                    className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-[10px] text-slate-500"
                  >
                    {manager}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="relative border-t border-slate-200 bg-slate-50 p-5 sm:p-7 lg:border-l lg:border-t-0 lg:p-8"
            >
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_-16px_rgba(15,23,42,0.18)]">
                <div className="flex h-10 items-center gap-2 border-b border-slate-200 bg-slate-50 px-3.5">
                  <span className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  </span>
                  <span className="ml-2 flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
                    <Terminal className="h-3 w-3 text-slate-400" />
                    aether-cli — zsh
                  </span>
                  <button
                    onClick={handleCopy}
                    className="ml-auto flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-600 transition-all hover:border-blue-300 hover:text-blue-700"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {copied ? (
                        <motion.span
                          key="copied"
                          initial={{ opacity: 0, y: 3 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -3 }}
                          transition={{ duration: 0.16 }}
                          className="flex items-center gap-1.5 text-emerald-600"
                        >
                          <Check className="h-3 w-3" />
                          Copied
                        </motion.span>
                      ) : (
                        <motion.span
                          key="copy"
                          initial={{ opacity: 0, y: 3 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -3 }}
                          transition={{ duration: 0.16 }}
                          className="flex items-center gap-1.5"
                        >
                          <Copy className="h-3 w-3" />
                          Copy
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </div>

                <div className="space-y-2 p-4 font-mono text-[11px] leading-relaxed sm:p-5 sm:text-[12px]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-blue-600">➜</span>
                    <span className="font-semibold text-[#0B192C]">aether</span>
                    <span className="text-slate-300">~</span>
                    <span className="text-slate-400">$</span>
                    <span className="break-all text-slate-700">{CLI_COMMAND}</span>
                  </div>

                  {OUTPUT_LINES.map((line, index) => (
                    <motion.div
                      key={line.text}
                      initial={{ opacity: 0, x: -6 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.28, delay: 0.2 + index * 0.13 }}
                      className="flex items-start gap-2 text-[10px] sm:text-[11px]"
                    >
                      <span
                        className={
                          line.prefix === '✓'
                            ? 'text-emerald-500'
                            : line.prefix === '◆'
                            ? 'text-slate-400'
                            : 'text-slate-300'
                        }
                      >
                        {line.prefix}
                      </span>
                      <span className={line.tone}>{line.text}</span>
                    </motion.div>
                  ))}

                  <div className="pt-2 text-slate-500">
                    <span className="text-slate-400">$</span> npx aether-cli dev
                  </div>
                  <div className="flex items-center gap-2 text-[10px] sm:text-[11px]">
                    <span className="text-blue-600">➜</span>
                    <span className="text-slate-500">Local:</span>
                    <span className="text-blue-600">http://localhost:5173</span>
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
                      className="ml-1 inline-block h-3.5 w-2 bg-slate-700"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between px-1">
                <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  CLI v2.4.1 · dual-mode supported
                </span>
                <a
                  href="#capabilities"
                  className="text-[10px] font-semibold text-blue-600 transition-colors hover:text-blue-700"
                >
                  View engine docs →
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
