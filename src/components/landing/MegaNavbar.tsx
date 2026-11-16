import { useEffect, useRef, useState } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpRight,
  BookOpen,
  Box,
  CalendarClock,
  ChevronDown,
  Code2,
  Container,
  Database,
  Gauge,
  GitBranch,
  Headphones,
  Layers,
  LayoutDashboard,
  LineChart,
  Menu,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Terminal,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Logo from './Logo';

interface MenuLink {
  title: string;
  desc: string;
  icon: LucideIcon;
  href?: string;
  prompt?: string;
}

interface NavMenu {
  label: string;
  align: string;
  items: MenuLink[];
}

const MENUS: NavMenu[] = [
  {
    label: 'Capabilities',
    align: 'left-0',
    items: [
      {
        title: 'Spatial 3D WebGL',
        desc: 'R3F scenes, shaders & physics',
        icon: Box,
        prompt: 'Build an immersive 3D spatial product experience with Three.js and React Three Fiber',
      },
      {
        title: 'Full-Stack SaaS',
        desc: 'Auth, billing & live dashboards',
        icon: Layers,
        prompt: 'Build a production-grade full-stack SaaS dashboard with authentication and Stripe billing',
      },
      {
        title: 'Database & Auth',
        desc: 'PostgreSQL, Prisma & RBAC',
        icon: Database,
        prompt: 'Build a multi-tenant application with PostgreSQL, Prisma schemas and role-based auth',
      },
      {
        title: 'Instant WebContainers',
        desc: 'Sub-second browser sandboxes',
        icon: Container,
        prompt: 'Build a full-stack app and preview it instantly in a browser WebContainer sandbox',
      },
    ],
  },
  {
    label: 'Developers',
    align: 'left-1/2 -translate-x-1/2',
    items: [
      {
        title: 'Documentation',
        desc: 'Guides for the dual-mode engine',
        icon: BookOpen,
        href: '#developers',
      },
      {
        title: 'CLI Reference',
        desc: 'npx aether-cli, typed and fast',
        icon: Terminal,
        href: '#developers',
      },
      {
        title: 'SDK & API',
        desc: 'Typed clients for every runtime',
        icon: Code2,
        href: '#capabilities',
      },
      {
        title: 'Changelog',
        desc: 'What shipped this week',
        icon: GitBranch,
        href: '#showcase',
      },
    ],
  },
  {
    label: 'Showcase',
    align: 'left-1/2 -translate-x-1/2',
    items: [
      {
        title: 'Luxury 3D Commerce',
        desc: 'Spatial storefronts that convert',
        icon: ShoppingBag,
        prompt: 'Build a luxury 3D e-commerce storefront with an interactive WebGL product viewer and Stripe checkout',
      },
      {
        title: 'Fintech Terminals',
        desc: 'Real-time market interfaces',
        icon: LineChart,
        prompt: 'Build a fintech crypto trading terminal with real-time charts, orderbook and PostgreSQL ledger',
      },
      {
        title: 'Enterprise Dashboards',
        desc: 'Operational command centers',
        icon: LayoutDashboard,
        prompt: 'Build an enterprise SaaS analytics dashboard with role-based access and live data tables',
      },
      {
        title: 'All Showcases',
        desc: 'Browse the full build gallery',
        icon: Sparkles,
        href: '#showcase',
      },
    ],
  },
  {
    label: 'Enterprise',
    align: 'right-0',
    items: [
      {
        title: 'Security & Compliance',
        desc: 'SOC 2, SSO & isolated tenancy',
        icon: ShieldCheck,
        href: '#enterprise',
      },
      {
        title: 'Scale & SLAs',
        desc: '99.99% uptime, global edge',
        icon: Gauge,
        href: '#enterprise',
      },
      {
        title: 'Dedicated Support',
        desc: 'Solutions architects on call',
        icon: Headphones,
        href: '#enterprise',
      },
      {
        title: 'Book a Demo',
        desc: 'See the studio in action',
        icon: CalendarClock,
        href: '#enterprise',
      },
    ],
  },
];

interface MegaNavbarProps {
  onLaunchStudio: (initialPrompt: string, engine: string) => void;
}

export default function MegaNavbar({ onLaunchStudio }: MegaNavbarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 14);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const cancelClose = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 150);
  };

  const handleItem = (item: MenuLink) => (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (item.prompt) {
      event.preventDefault();
      onLaunchStudio(item.prompt, 'WebContainer (Client)');
    }
    setOpenMenu(null);
    setMobileOpen(false);
  };

  const launchStudio = () => {
    setOpenMenu(null);
    setMobileOpen(false);
    onLaunchStudio('', 'WebContainer (Client)');
  };

  return (
    <div className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <div
        onMouseLeave={scheduleClose}
        className={`relative mx-auto max-w-6xl rounded-2xl border transition-all duration-500 ${
          scrolled
            ? 'border-slate-200 bg-white/85 shadow-[0_12px_40px_-16px_rgba(15,23,42,0.14)] backdrop-blur-xl'
            : 'border-slate-200/80 bg-white/70 shadow-[0_4px_24px_-16px_rgba(15,23,42,0.12)] backdrop-blur-lg'
        }`}
      >
        <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-5">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex">
            {MENUS.map((menu) => {
              const isOpen = openMenu === menu.label;
              return (
                <div
                  key={menu.label}
                  className="relative"
                  onMouseEnter={() => {
                    cancelClose();
                    setOpenMenu(menu.label);
                  }}
                >
                  <button
                    onClick={() => setOpenMenu(isOpen ? null : menu.label)}
                    className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors ${
                      isOpen ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {menu.label}
                    {menu.label === 'Capabilities' && (
                      <span className="ml-0.5 rounded-full border border-blue-200 bg-blue-50 px-1.5 py-px text-[9px] font-bold uppercase tracking-wider text-blue-600">
                        New
                      </span>
                    )}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'
                      }`}
                    />
                  </button>

                  <div className={`absolute top-full pt-3 ${menu.align}`}>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.98 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          className="relative w-[368px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)]"
                        >
                          <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
                          {menu.items.map((item) => {
                            const Icon = item.icon;
                            return (
                              <a
                                key={item.title}
                                href={item.href ?? '#top'}
                                onClick={handleItem(item)}
                                className="group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-50"
                              >
                                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition-all duration-300 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600">
                                  <Icon className="h-4 w-4" />
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="flex items-center justify-between gap-2">
                                    <span className="text-[13px] font-semibold text-slate-800">
                                      {item.title}
                                    </span>
                                    <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 text-slate-300 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-blue-600 group-hover:opacity-100" />
                                  </span>
                                  <span className="mt-0.5 block text-[11px] leading-relaxed text-slate-500">
                                    {item.desc}
                                  </span>
                                </span>
                              </a>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <button className="px-3.5 py-2 text-[13px] font-semibold text-slate-600 transition-colors hover:text-slate-900">
              Sign In
            </button>
            <button
              onClick={launchStudio}
              className="group inline-flex items-center gap-1.5 rounded-full bg-[#0B192C] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_4px_14px_-4px_rgba(15,23,42,0.35)] transition-all duration-300 hover:bg-[#0F172A] active:scale-95"
            >
              <span>Launch Studio</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>

          <button
            onClick={() => setMobileOpen((value) => !value)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 lg:hidden"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="overflow-hidden lg:hidden"
            >
              <div className="max-h-[70vh] overflow-y-auto border-t border-slate-200 px-4 pb-4 pt-2">
                {MENUS.map((menu) => (
                  <div key={menu.label} className="border-b border-slate-100 py-3 last:border-0">
                    <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.24em] text-blue-600">
                      {menu.label}
                    </p>
                    <div className="grid gap-1 sm:grid-cols-2">
                      {menu.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <a
                            key={item.title}
                            href={item.href ?? '#top'}
                            onClick={handleItem(item)}
                            className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-[13px] text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                          >
                            <Icon className="h-4 w-4 text-slate-400" />
                            <span>{item.title}</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <div className="flex flex-col gap-2 pt-3">
                  <button className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">
                    Sign In
                  </button>
                  <button
                    onClick={launchStudio}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#0B192C] px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    Launch Studio
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
