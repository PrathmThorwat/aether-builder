import { useState } from 'react';
import type { ComponentType } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Box,
  Check,
  Database,
  Layers,
  Rocket,
  Terminal,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  DatabaseMockup,
  DeployMockup,
  FullStackMockup,
  SandboxMockup,
  SpatialMockup,
} from './ProductMockups';

interface SuiteTab {
  id: string;
  label: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  accent: string;
  desc: string;
  features: string[];
  prompt: string;
  mockup: ComponentType;
}

const TABS: SuiteTab[] = [
  {
    id: 'spatial',
    label: 'Spatial 3D',
    icon: Box,
    eyebrow: 'Spatial runtime',
    title: 'Storefronts that ',
    accent: 'feel alive.',
    desc: 'Generate immersive Three.js scenes with shaders, lighting rigs, and tactile 3D product viewers. Every scene ships with graceful fallbacks and buttery pointer physics.',
    features: [
      'React Three Fiber scenes with post-processing',
      'Pointer, orbit and scroll-driven interactions',
      'Material, finish and lighting presets',
    ],
    prompt:
      'Build a luxury 3D e-commerce storefront with an interactive WebGL product viewer, material presets and Stripe checkout',
    mockup: SpatialMockup,
  },
  {
    id: 'saas',
    label: 'Full-Stack SaaS',
    icon: Layers,
    eyebrow: 'Full-stack layer',
    title: 'Dashboards built to ',
    accent: 'run the business.',
    desc: 'Multi-tenant authentication, Stripe billing, team roles, and real-time analytics land in the first pass. No wiring weekend required.',
    features: [
      'Auth, orgs, seats and role-based access',
      'Stripe subscriptions, invoices and webhooks',
      'Live charts, tables and audit trails',
    ],
    prompt:
      'Build a production-grade full-stack SaaS analytics dashboard with multi-tenant auth, team roles, Stripe billing and realtime revenue charts',
    mockup: FullStackMockup,
  },
  {
    id: 'database',
    label: 'Database & APIs',
    icon: Database,
    eyebrow: 'Data plane',
    title: 'Schemas that evolve ',
    accent: 'with the product.',
    desc: 'AetherForge models your domain in Prisma, applies PostgreSQL migrations, and exposes typed API routes the moment a screen needs them.',
    features: [
      'Relational PostgreSQL schemas and relations',
      'Prisma migrations with rollback safety',
      'Typed endpoints, seed data and fixtures',
    ],
    prompt:
      'Build an application with a complete PostgreSQL and Prisma schema, typed API routes, seed data and row-level access controls',
    mockup: DatabaseMockup,
  },
  {
    id: 'sandbox',
    label: 'Live Sandbox',
    icon: Terminal,
    eyebrow: 'Execution layer',
    title: 'A full dev loop ',
    accent: 'inside the browser.',
    desc: 'Every workspace boots a WebContainer with Vite, dependencies, and a live preview. Edit files, run commands, and watch the app respond in milliseconds.',
    features: [
      'Sub-second browser sandbox boot',
      'Terminal, package manager and HMR included',
      'Shareable previews with instant rollback',
    ],
    prompt:
      'Build a full-stack app and run it inside an instant browser WebContainer sandbox with a live preview and terminal',
    mockup: SandboxMockup,
  },
  {
    id: 'deploy',
    label: 'One-Click Deploy',
    icon: Rocket,
    eyebrow: 'Edge layer',
    title: 'From prompt to production ',
    accent: 'in one click.',
    desc: 'Containerize, run the checks, and ship to a global edge network with observability attached. Rollbacks are one click away, always.',
    features: [
      'Managed containers with global edge routing',
      'Preview URLs, custom domains and TLS',
      'Zero-downtime rollbacks and health checks',
    ],
    prompt:
      'Build and deploy a production SaaS application to a global edge network with custom domains, health checks and zero-downtime rollbacks',
    mockup: DeployMockup,
  },
];

const panelVariants: Variants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction * 48,
  }),
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction * -48,
    transition: { duration: 0.26, ease: 'easeIn' },
  }),
};

interface ProductSuiteProps {
  onLaunchStudio: (initialPrompt: string, engine: string) => void;
}

export default function ProductSuite({ onLaunchStudio }: ProductSuiteProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const activeTab = TABS[activeIndex];
  const ActiveMockup = activeTab.mockup;
  const ActiveIcon = activeTab.icon;

  const selectTab = (index: number) => {
    if (index === activeIndex) return;
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  return (
    <section id="capabilities" className="relative scroll-mt-28 bg-white px-5 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.26em] text-blue-600">
            The product suite
          </p>
          <h2 className="font-display text-3xl font-bold leading-[1.1] tracking-[-0.03em] text-[#0B192C] sm:text-4xl lg:text-[44px]">
            One studio. Every layer of the stack.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
            Move between runtimes without leaving the workspace. Each suite adapts the generation
            engine, live mockup, and production defaults.
          </p>
        </motion.div>

        <div className="mt-10 flex justify-center">
          <div className="flex max-w-full gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)]">
            {TABS.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = index === activeIndex;
              return (
                <button
                  key={tab.id}
                  onClick={() => selectTab(index)}
                  className={`relative flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-[11px] font-semibold transition-colors duration-300 sm:text-[12px] ${
                    isActive ? 'text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="product-suite-pill"
                      className="absolute inset-0 rounded-xl bg-blue-600 shadow-[0_4px_14px_-4px_rgba(37,99,235,0.5)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <Icon className="relative z-10 h-3.5 w-3.5" />
                  <span className="relative z-10 whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative mt-8">
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)]">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={activeTab.id}
                custom={direction}
                variants={panelVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="relative grid min-h-[540px] gap-0 lg:grid-cols-[0.92fr_1.08fr]"
              >
                <div className="flex flex-col justify-center p-7 sm:p-9 lg:p-11">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600">
                      <ActiveIcon className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-600">
                      {activeTab.eyebrow}
                    </span>
                    <span className="ml-auto font-mono text-[10px] text-slate-400">
                      0{activeIndex + 1} / 0{TABS.length}
                    </span>
                  </div>

                  <h3 className="mt-5 font-display text-2xl font-bold leading-tight tracking-[-0.03em] text-[#0B192C] sm:text-3xl lg:text-[34px]">
                    {activeTab.title}
                    {activeTab.accent}
                  </h3>
                  <p className="mt-4 max-w-md text-[13px] leading-relaxed text-slate-600 sm:text-sm">
                    {activeTab.desc}
                  </p>

                  <ul className="mt-6 space-y-3">
                    {activeTab.features.map((feature, index) => (
                      <motion.li
                        key={feature}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + index * 0.07, duration: 0.32 }}
                        className="flex items-start gap-2.5 text-[12px] text-slate-600 sm:text-[13px]"
                      >
                        <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border border-blue-100 bg-blue-50">
                          <Check className="h-2.5 w-2.5 text-blue-600" />
                        </span>
                        {feature}
                      </motion.li>
                    ))}
                  </ul>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => onLaunchStudio(activeTab.prompt, 'WebContainer (Client)')}
                      className="group inline-flex items-center gap-2 rounded-xl bg-[#0B192C] px-4 py-2.5 text-[12px] font-semibold text-white shadow-[0_6px_18px_-8px_rgba(15,23,42,0.5)] transition-all duration-300 hover:bg-[#0F172A] active:scale-[0.98]"
                    >
                      Try in Studio
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </button>
                    <a
                      href="#developers"
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
                    >
                      <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                      Read the spec
                    </a>
                  </div>
                </div>

                <div className="relative flex items-center justify-center border-t border-slate-200 bg-slate-50 p-4 sm:p-6 lg:border-l lg:border-t-0 lg:p-7">
                  <div className="relative w-full">
                    <div className="absolute -top-3 right-1 z-10 hidden items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 shadow-sm sm:flex">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                      <span className="font-mono text-[9px] text-slate-500">generated in 38s</span>
                    </div>
                    <ActiveMockup />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-5 flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              {TABS.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => selectTab(index)}
                  aria-label={`Show ${tab.label}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? 'w-7 bg-blue-600'
                      : 'w-1.5 bg-slate-200 hover:bg-slate-300'
                  }`}
                />
              ))}
            </div>
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400 sm:block">
              Switch tabs to morph the live mockup
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
