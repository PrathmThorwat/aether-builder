import { motion } from 'framer-motion';
import {
  Atom,
  Box,
  Container,
  CreditCard,
  Database,
  Triangle,
  Wind,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface TechItem {
  name: string;
  meta: string;
  icon: LucideIcon;
}

const STACK: TechItem[] = [
  { name: 'React 19', meta: 'concurrent UI', icon: Atom },
  { name: 'Three.js', meta: 'WebGL core', icon: Box },
  { name: 'Vite', meta: 'instant HMR', icon: Zap },
  { name: 'PostgreSQL', meta: 'relational', icon: Database },
  { name: 'Prisma', meta: 'typed ORM', icon: Triangle },
  { name: 'Tailwind CSS', meta: 'design system', icon: Wind },
  { name: 'Stripe', meta: 'billing', icon: CreditCard },
  { name: 'WebContainers', meta: 'browser runtime', icon: Container },
];

function MarqueeTrack({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={hidden}>
      {STACK.map((tech) => {
        const Icon = tech.icon;
        return (
          <div
            key={`${hidden ? 'dup-' : ''}${tech.name}`}
            className="group mr-3 flex shrink-0 items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2.5 transition-colors duration-300 hover:border-blue-200"
          >
            <span className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 transition-colors group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600">
              <Icon className="h-3.5 w-3.5" />
            </span>
            <span className="flex items-baseline gap-2">
              <span className="text-[12px] font-semibold tracking-wide text-slate-700">
                {tech.name}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400">
                {tech.meta}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function TechMarquee() {
  return (
    <section className="relative overflow-hidden border-y border-slate-200 bg-slate-50 py-9">
      <p className="relative mb-6 text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">
        Powering the modern spatial stack
      </p>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-slate-50 to-transparent sm:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-slate-50 to-transparent sm:w-40" />

        <motion.div
          className="flex w-max will-change-transform"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 36, ease: 'linear', repeat: Infinity }}
        >
          <MarqueeTrack />
          <MarqueeTrack hidden />
        </motion.div>
      </div>
    </section>
  );
}
