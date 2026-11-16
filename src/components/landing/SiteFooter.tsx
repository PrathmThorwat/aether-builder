import { ArrowUpRight, Globe } from 'lucide-react';
import Logo from './Logo';

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.55v-2.1c-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.19a11.1 11.1 0 0 1 5.8 0c2.2-1.5 3.17-1.19 3.17-1.19.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.27 5.69.41.36.78 1.07.78 2.16v3.2c0 .3.21.66.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.119 20.452H3.555V9h3.564v11.452Z" />
    </svg>
  );
}

interface FooterColumn {
  title: string;
  links: { label: string; href: string; badge?: string }[];
}

const COLUMNS: FooterColumn[] = [
  {
    title: 'Product',
    links: [
      { label: 'Spatial 3D Studio', href: '#capabilities' },
      { label: 'Full-Stack SaaS', href: '#capabilities' },
      { label: 'Database & Auth', href: '#capabilities' },
      { label: 'WebContainers', href: '#capabilities' },
      { label: 'Pricing', href: '#enterprise' },
    ],
  },
  {
    title: 'Developers',
    links: [
      { label: 'Documentation', href: '#developers' },
      { label: 'CLI Reference', href: '#developers' },
      { label: 'SDK & API', href: '#developers' },
      { label: 'Changelog', href: '#developers', badge: 'New' },
      { label: 'System Status', href: '#enterprise' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Showcase', href: '#showcase' },
      { label: 'Templates', href: '#showcase' },
      { label: 'Launch Guides', href: '#developers' },
      { label: 'Studio Blog', href: '#showcase' },
      { label: 'Community', href: '#enterprise' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#top' },
      { label: 'Enterprise', href: '#enterprise' },
      { label: 'Security', href: '#enterprise' },
      { label: 'Careers', href: '#enterprise' },
      { label: 'Contact', href: '#enterprise' },
    ],
  },
];

interface SiteFooterProps {
  onLaunchStudio: (initialPrompt: string, engine: string) => void;
}

export default function SiteFooter({ onLaunchStudio }: SiteFooterProps) {
  return (
    <footer
      id="enterprise"
      className="relative scroll-mt-24 overflow-hidden border-t border-slate-200 bg-white px-5 pb-8 pt-16 sm:px-6 sm:pt-20"
    >
      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_2.85fr] lg:gap-16">
          <div>
            <Logo subtitle />
            <p className="mt-5 max-w-xs text-[12px] leading-relaxed text-slate-500">
              Enterprise-grade infrastructure for the next generation of spatial and full-stack
              software. Designed in the studio, shipped to the edge.
            </p>

            <button
              onClick={() => onLaunchStudio('', 'WebContainer (Client)')}
              className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0B192C] px-4 py-2.5 text-[12px] font-semibold text-white shadow-[0_6px_18px_-8px_rgba(15,23,42,0.5)] transition-all duration-300 hover:bg-[#0F172A] active:scale-[0.98]"
            >
              Launch Studio
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            <div className="mt-7 flex items-center gap-2.5">
              {[
                { label: 'GitHub', Icon: GithubIcon },
                { label: 'X', Icon: XIcon },
                { label: 'LinkedIn', Icon: LinkedinIcon },
              ].map(({ label, Icon }) => (
                <a
                  key={label}
                  href="#top"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all hover:border-blue-300 hover:text-blue-600"
                  aria-label={`AetherForge on ${label}`}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLUMNS.map((column) => (
              <div key={column.title}>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  {column.title}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="group flex items-center gap-2 text-[12px] text-slate-600 transition-colors hover:text-[#0B192C]"
                      >
                        <span>{link.label}</span>
                        {link.badge && (
                          <span className="rounded-full border border-blue-100 bg-blue-50 px-1.5 py-px text-[8px] font-bold uppercase tracking-wider text-blue-600">
                            {link.badge}
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <span className="text-[11px] text-slate-500">
              © 2026 AetherForge Systems Inc. All rights reserved.
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-semibold text-emerald-600">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              All systems operational
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-slate-500">
            <a href="#enterprise" className="transition-colors hover:text-slate-900">
              Privacy
            </a>
            <a href="#enterprise" className="transition-colors hover:text-slate-900">
              Terms
            </a>
            <a href="#enterprise" className="transition-colors hover:text-slate-900">
              Security
            </a>
            <a href="#enterprise" className="transition-colors hover:text-slate-900">
              DPA
            </a>
            <span className="flex items-center gap-1.5 rounded-full border border-slate-200 px-2.5 py-1 text-slate-500">
              <Globe className="h-3 w-3" />
              Global / EN
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
