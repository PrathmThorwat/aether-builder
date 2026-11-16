import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  LayoutDashboard,
  LineChart,
  ShoppingBag,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type VisualVariant = 'commerce' | 'fintech' | 'enterprise';

interface UseCase {
  id: string;
  tag: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  prompt: string;
  visual: VisualVariant;
  floatBadge: string;
  tags: string[];
}

const USE_CASES: UseCase[] = [
  {
    id: 'commerce',
    tag: 'Commerce',
    icon: ShoppingBag,
    title: 'Luxury 3D E-Commerce',
    desc: 'Spatial product stages with material presets, AR-ready models, and a Stripe checkout that never breaks the spell.',
    prompt:
      'Build a luxury 3D e-commerce storefront with material presets, AR-ready product stages and Stripe checkout',
    visual: 'commerce',
    floatBadge: '+18% conversion',
    tags: ['WebGL viewer', 'Stripe', 'Physics'],
  },
  {
    id: 'fintech',
    tag: 'Fintech',
    icon: LineChart,
    title: 'Fintech & Crypto Terminals',
    desc: 'Sub-second market feeds, portfolio ledgers, and compliance-ready audit trails rendered in a high-density interface.',
    prompt:
      'Build a fintech crypto trading terminal with realtime market feeds, portfolio ledger and compliance audit trails',
    visual: 'fintech',
    floatBadge: 'Realtime WS',
    tags: ['Live feeds', 'PostgreSQL', 'RBAC'],
  },
  {
    id: 'enterprise',
    tag: 'Enterprise',
    icon: LayoutDashboard,
    title: 'Enterprise SaaS Dashboards',
    desc: 'Operational command centers with SSO, granular permissions, and analytics that stay responsive at scale.',
    prompt:
      'Build an enterprise SaaS operations dashboard with SSO, granular permissions and responsive analytics at scale',
    visual: 'enterprise',
    floatBadge: 'SOC 2 ready',
    tags: ['SSO', 'Analytics', 'Audit logs'],
  },
];

function CaseVisual({ variant }: { variant: VisualVariant }) {
  if (variant === 'commerce') {
    return (
      <div className="relative flex h-full items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(circle_at_50%_50%,#000,transparent_78%)]" />

        <div className="relative flex flex-col items-center">
          <div className="h-3 w-10 rounded-t-md bg-gradient-to-b from-slate-300 to-slate-200" />
          <div className="relative h-24 w-24 rounded-full border border-slate-300 bg-gradient-to-br from-white via-slate-100 to-slate-300 shadow-[0_18px_35px_-18px_rgba(15,23,42,0.45)]">
            <div className="absolute inset-1.5 rounded-full border border-slate-200" />
            <div className="absolute inset-3 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.95),transparent_65%)]" />
            <motion.span
              className="absolute left-1/2 top-1/2 h-px w-7 origin-left bg-slate-700"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            />
            <motion.span
              className="absolute left-1/2 top-1/2 h-px w-5 origin-left bg-blue-600"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
            />
            <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0B192C]" />
          </div>
          <div className="h-3 w-10 rounded-b-md bg-gradient-to-t from-slate-300 to-slate-200" />
        </div>

        <span className="absolute left-3 top-3 rounded-full border border-slate-200 bg-white px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-slate-500 shadow-sm">
          Aether One
        </span>
        <span className="absolute right-3 top-3 rounded-full border border-blue-100 bg-blue-50 px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-blue-600">
          Live 3D
        </span>
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 shadow-sm">
          <span className="font-mono text-[9px] text-slate-600">$1,240.00</span>
          <span className="rounded bg-[#0B192C] px-2 py-0.5 text-[8px] font-semibold text-white">
            Add to bag
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'fintech') {
    return (
      <div className="relative h-full p-4">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:32px_100%]" />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-wider text-slate-400">BTC / USD</p>
            <p className="mt-0.5 font-display text-base font-bold tracking-[-0.02em] text-slate-900">
              $94,820.40
            </p>
          </div>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[8px] font-bold text-emerald-600">
            +4.82%
          </span>
        </div>

        <svg
          viewBox="0 0 240 90"
          className="absolute inset-x-4 bottom-7 h-24 w-[calc(100%-2rem)] overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="fintechFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 76 L 24 70 L 48 74 L 72 52 L 96 58 L 120 36 L 144 44 L 168 22 L 192 30 L 216 12 L 240 18 L 240 90 L 0 90 Z"
            fill="url(#fintechFill)"
          />
          <motion.path
            d="M0 76 L 24 70 L 48 74 L 72 52 L 96 58 L 120 36 L 144 44 L 168 22 L 192 30 L 216 12 L 240 18"
            fill="none"
            stroke="#2563eb"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 2.4 }}
          />
          <motion.circle
            cx="240"
            cy="18"
            r="3"
            fill="#2563eb"
            animate={{ opacity: [1, 0.35, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
        </svg>

        <div className="absolute left-3 bottom-3 flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1 shadow-sm">
          {['1H', '4H', '1D', '1W'].map((frame, index) => (
            <span
              key={frame}
              className={`rounded px-1.5 py-0.5 text-[8px] font-semibold ${
                index === 2 ? 'bg-blue-50 text-blue-600' : 'text-slate-400'
              }`}
            >
              {frame}
            </span>
          ))}
        </div>
        <span className="absolute right-3 top-14 rounded-full border border-slate-200 bg-white px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-slate-500 shadow-sm">
          WS live
        </span>
      </div>
    );
  }

  return (
    <div className="relative h-full p-4">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white" />
      <div className="relative flex items-center justify-between">
        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
          Ops overview
        </p>
        <span className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[8px] font-bold text-emerald-600">
          <Check className="h-2.5 w-2.5" />
          99.99% SLA
        </span>
      </div>

      <div className="relative mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm">
          <p className="text-[8px] uppercase tracking-wider text-slate-400">Active seats</p>
          <p className="mt-1 font-display text-base font-bold tracking-[-0.02em] text-slate-900">
            24,861
          </p>
          <div className="mt-2 flex h-8 items-end gap-1">
            {[45, 62, 38, 74, 56, 88, 70].map((height, index) => (
              <motion.span
                key={index}
                className="flex-1 rounded-sm bg-blue-600/80"
                initial={{ scaleY: 0.2 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.07 }}
                style={{ height: `${height}%`, transformOrigin: 'bottom' }}
              />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm">
            <p className="text-[8px] uppercase tracking-wider text-slate-400">Approvals</p>
            <div className="mt-1.5 space-y-1">
              {[0, 1, 2].map((row) => (
                <div key={row} className="flex items-center gap-1.5">
                  <span className="grid h-3 w-3 place-items-center rounded-full bg-blue-50">
                    <Check className="h-2 w-2 text-blue-600" />
                  </span>
                  <span className="h-1 flex-1 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-2.5">
            <p className="text-[8px] uppercase tracking-wider text-blue-600">Regions</p>
            <p className="mt-1 font-mono text-[9px] text-slate-500">iad · fra · sin</p>
          </div>
        </div>
      </div>

      <span className="absolute right-3 bottom-3 rounded-full border border-slate-200 bg-white px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-slate-500 shadow-sm">
        RBAC active
      </span>
    </div>
  );
}

interface UseCaseCarouselProps {
  onLaunchStudio: (initialPrompt: string, engine: string) => void;
}

export default function UseCaseCarousel({ onLaunchStudio }: UseCaseCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(1);

  useLayoutEffect(() => {
    const measure = () => {
      const viewport = viewportRef.current;
      const card = cardRef.current;
      if (!viewport || !card) return;
      const gap = 24;
      const cardStep = card.offsetWidth + gap;
      setStep(cardStep);
      setVisible(Math.max(1, Math.round(viewport.offsetWidth / cardStep)));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const maxIndex = Math.max(0, USE_CASES.length - visible);

  useEffect(() => {
    setIndex((current) => Math.min(current, maxIndex));
  }, [maxIndex]);

  return (
    <section
      id="showcase"
      className="relative scroll-mt-28 overflow-hidden border-y border-slate-200 bg-slate-50 px-5 py-24 sm:px-6 sm:py-32"
    >
      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.55 }}
          >
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.26em] text-blue-600">
              Built with AetherForge
            </p>
            <h2 className="font-display text-3xl font-bold leading-[1.1] tracking-[-0.03em] text-[#0B192C] sm:text-4xl lg:text-[44px]">
              Ventures shipping in production.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600">
              Explore the archetypes our founders launch most. Each template is a complete
              full-stack build, ready to remix in the studio.
            </p>
          </motion.div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-slate-400">
              {String(index + 1).padStart(2, '0')} / {String(USE_CASES.length).padStart(2, '0')}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setIndex((current) => Math.max(0, current - 1))}
                disabled={index === 0}
                className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous use case"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIndex((current) => Math.min(maxIndex, current + 1))}
                disabled={index >= maxIndex}
                className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next use case"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div ref={viewportRef} className="mt-10 overflow-hidden pb-4">
          <motion.div
            className="flex gap-6"
            animate={{ x: -index * step }}
            transition={{ type: 'spring', stiffness: 260, damping: 32 }}
          >
            {USE_CASES.map((useCase, cardIndex) => {
              const Icon = useCase.icon;
              return (
                <motion.article
                  key={useCase.id}
                  ref={cardIndex === 0 ? cardRef : undefined}
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  className="group flex w-[86%] shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] transition-shadow duration-300 hover:shadow-[0_16px_40px_-16px_rgba(15,23,42,0.16)] sm:w-[calc(50%-12px)]"
                >
                  <div className="relative h-44 overflow-hidden border-b border-slate-200 sm:h-48">
                    <CaseVisual variant={useCase.visual} />
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2 py-1 shadow-sm">
                      <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-500" />
                      <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-slate-500">
                        {useCase.floatBadge}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-2">
                      <span className="grid h-7 w-7 place-items-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                        {useCase.tag}
                      </span>
                    </div>

                    <h3 className="mt-3 font-display text-lg font-bold leading-snug tracking-[-0.02em] text-[#0B192C]">
                      {useCase.title}
                    </h3>
                    <p className="mt-2 flex-1 text-[12px] leading-relaxed text-slate-600">
                      {useCase.desc}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {useCase.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[9px] font-medium text-slate-500"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => onLaunchStudio(useCase.prompt, 'WebContainer (Client)')}
                      className="mt-4 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[11px] font-semibold text-slate-700 transition-all duration-300 hover:border-blue-300 hover:text-blue-700"
                    >
                      Build this venture
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
