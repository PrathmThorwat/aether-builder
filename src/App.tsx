import { useState } from 'react';
import MegaNavbar from './components/landing/MegaNavbar';
import KineticHero from './components/landing/KineticHero';
import TechMarquee from './components/landing/TechMarquee';
import ProductSuite from './components/landing/ProductSuite';
import UseCaseCarousel from './components/landing/UseCaseCarousel';
import CliCallout from './components/landing/CliCallout';
import SiteFooter from './components/landing/SiteFooter';
import StudioWorkspace from './components/StudioWorkspace';

export default function App() {
  const [view, setView] = useState<'landing' | 'studio'>('landing');
  const [activePrompt, setActivePrompt] = useState('');
  const [activeEngine, setActiveEngine] = useState('WebContainer (Client)');

  const handleLaunchStudio = (prompt: string, engine: string) => {
    setActivePrompt(prompt);
    setActiveEngine(engine);
    setView('studio');
    window.requestAnimationFrame(() => window.scrollTo(0, 0));
  };

  const handleBackToLanding = () => {
    setView('landing');
    window.requestAnimationFrame(() => window.scrollTo(0, 0));
  };

  if (view === 'studio') {
    return (
      <StudioWorkspace
        initialPrompt={activePrompt}
        selectedEngine={activeEngine}
        onBack={handleBackToLanding}
      />
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-clip bg-white text-slate-900">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_45%_at_50%_-10%,rgba(37,99,235,0.055),transparent_65%)]" />
        <div className="absolute inset-x-0 top-0 h-[560px] bg-[linear-gradient(to_right,rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_40%,transparent_100%)]" />
      </div>

      <MegaNavbar onLaunchStudio={handleLaunchStudio} />

      <main className="relative z-10">
        <KineticHero onLaunchStudio={handleLaunchStudio} />
        <TechMarquee />
        <ProductSuite onLaunchStudio={handleLaunchStudio} />
        <UseCaseCarousel onLaunchStudio={handleLaunchStudio} />
        <CliCallout />
      </main>

      <SiteFooter onLaunchStudio={handleLaunchStudio} />
    </div>
  );
}
