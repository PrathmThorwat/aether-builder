import { useState } from 'react';
import { Terminal, Sparkles, ArrowRight, ShieldCheck, Zap, Layers, Database, ChevronRight } from 'lucide-react';

interface HeroOverlayProps {
  onLaunchStudio: (initialPrompt: string, engine: string) => void;
}

export default function HeroOverlay({ onLaunchStudio }: HeroOverlayProps) {
  const [prompt, setPrompt] = useState('');
  const [selectedEngine, setSelectedEngine] = useState('WebContainer (Client)');

  const engines = ['WebContainer (Client)', 'E2B Micro-VM (Full-Stack)', 'Fly.io Production'];

  const features = [
    { title: 'Spatial 3D WebGL', desc: 'Instant Three.js & R3F canvas injection with smooth physics and shaders.', icon: Layers },
    { title: 'Full-Stack Schemas', desc: 'Automated Prisma/Supabase database tables, relations, and auth flows.', icon: Database },
    { title: 'Instant Execution', desc: 'Sub-second compilation and live browser preview via WebContainers.', icon: Zap },
    { title: 'Enterprise Security', desc: 'Role-based access control, environment isolation, and secure tokens.', icon: ShieldCheck },
  ];

  const handleGenerate = () => {
    const finalPrompt = prompt.trim() || 'Build a 3D Luxury Watch Storefront with interactive WebGL viewer and Stripe checkout';
    onLaunchStudio(finalPrompt, selectedEngine);
  };

  return (
    <div className="relative z-10 flex flex-col min-h-screen text-white select-none">
      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full pointer-events-auto border-b border-[#d4af37]/20 backdrop-blur-md sticky top-0 bg-[#050508]/80 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#d4af37] to-[#aa7c11] flex items-center justify-center shadow-lg shadow-[#d4af37]/20 ring-1 ring-[#d4af37]/40">
            <Terminal className="w-4 h-4 text-black font-bold" />
          </div>
          <span className="text-base font-extrabold tracking-wider uppercase text-white flex items-center gap-1.5">
            Aether<span className="text-[#d4af37]">Forge</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-300">
          <a href="#engine" className="hover:text-[#d4af37] transition-colors">Engine</a>
          <a href="#features" className="hover:text-[#d4af37] transition-colors">Architecture</a>
          <a href="#showcase" className="hover:text-[#d4af37] transition-colors">Showcase</a>
          <a href="#pricing" className="hover:text-[#d4af37] transition-colors">Enterprise</a>
        </nav>

        <div className="flex items-center gap-3 pointer-events-auto">
          <button className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white transition-colors">
            Sign In
          </button>
          <button
            onClick={() => onLaunchStudio('', selectedEngine)}
            className="px-4 py-2.5 rounded-lg bg-[#d4af37] hover:bg-[#e6be40] text-black font-bold text-xs transition-all shadow-lg shadow-[#d4af37]/30 hover:scale-105 active:scale-95 cursor-pointer"
          >
            Launch Studio
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center px-8 lg:px-16 max-w-7xl mx-auto w-full py-24 min-h-[90vh]">
        <div className="max-w-2xl text-left pointer-events-auto">
          
          {/* Gold Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/60 border border-[#d4af37]/40 text-xs font-medium mb-8 shadow-xl backdrop-blur-xl">
            <span className="w-2 h-2 rounded-full bg-[#00ffff] animate-ping" />
            <span className="text-slate-400">Core Engine:</span>
            <span className="text-[#d4af37] font-bold tracking-wide">ONLINE (v2.4 Gold)</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-[1.05]">
            Architect <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#00ffff]">3D Full-Stack</span> Apps Instantly.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 mb-10 leading-relaxed font-normal">
            The elite AI platform combining immersive spatial WebGL showcases with production-grade backend databases, auth, and automated code execution.
          </p>

          {/* Prompt Generator Box */}
          <div className="w-full p-3 rounded-2xl bg-black/80 border border-[#d4af37]/30 backdrop-blur-2xl shadow-2xl shadow-black/80">
            
            {/* Engine Tabs */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#d4af37]">Target Execution Stack</span>
              <div className="flex gap-1.5 overflow-x-auto">
                {engines.map((eng) => (
                  <button
                    key={eng}
                    onClick={() => setSelectedEngine(eng)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                      selectedEngine === eng
                        ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/30'
                        : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {eng}
                  </button>
                ))}
              </div>
            </div>

            {/* Input & Button */}
            <div className="flex items-center gap-3 px-2 pb-1">
              <Sparkles className="w-5 h-5 text-[#00ffff] shrink-0 ml-1" />
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="Describe your 3D platform (e.g., Luxury Watch E-Commerce with Stripe)..."
                className="flex-1 bg-transparent border-none outline-none text-white text-sm sm:text-base px-1 placeholder:text-slate-600"
              />
              <button
                onClick={handleGenerate}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa7c11] hover:from-[#e6be40] hover:to-[#d4af37] text-black font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-[#d4af37]/30 shrink-0 hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <span>Generate</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-8 mt-10 text-xs font-medium text-slate-400">
            <div><strong className="text-white">65-75%</strong> Gross Margins</div>
            <div className="w-1 h-1 rounded-full bg-[#d4af37]" />
            <div><strong className="text-white">Sub-sec</strong> Sandboxing</div>
            <div className="w-1 h-1 rounded-full bg-[#d4af37]" />
            <div><strong className="text-white">Full-Stack</strong> PostgreSQL</div>
          </div>

        </div>
      </main>

      {/* Scrollable Features Section */}
      <section id="features" className="py-24 px-8 lg:px-16 max-w-7xl mx-auto w-full border-t border-white/10 pointer-events-auto bg-[#050508]/90">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#d4af37] mb-3">Enterprise Capabilities</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Engineered for Maximum Scale & Visual Impact</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="p-6 rounded-2xl bg-black/60 border border-white/10 hover:border-[#d4af37]/60 transition-all group backdrop-blur-xl shadow-xl flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
                <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-[#00ffff] group-hover:translate-x-1 transition-transform cursor-pointer">
                  <span>Explore specs</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 max-w-7xl mx-auto w-full gap-4 pointer-events-auto bg-black">
        <span>© 2026 AetherForge Systems Inc. All rights reserved.</span>
        <div className="flex gap-6">
          <a href="#privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-slate-300 transition-colors">Terms of Service</a>
          <a href="#security" className="hover:text-slate-300 transition-colors">Security</a>
        </div>
      </footer>
    </div>
  );
}