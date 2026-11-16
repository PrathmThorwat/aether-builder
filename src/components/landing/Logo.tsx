import { Terminal } from 'lucide-react';

interface LogoProps {
  subtitle?: boolean;
}

export default function Logo({ subtitle = false }: LogoProps) {
  return (
    <a href="#top" className="group flex items-center gap-2.5" aria-label="AetherForge home">
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-[#0B192C] shadow-[0_2px_8px_rgba(15,23,42,0.18)] ring-1 ring-[#0B192C] transition-transform duration-300 group-hover:scale-[1.03]">
        <Terminal className="h-4 w-4 text-white" strokeWidth={2.5} />
        <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-semibold tracking-[-0.01em] text-[#0B192C]">
          Aether<span className="text-blue-600">Forge</span>
        </span>
        {subtitle && (
          <span className="mt-1 text-[9px] font-medium uppercase tracking-[0.24em] text-slate-400">
            Venture Studio
          </span>
        )}
      </span>
    </a>
  );
}
