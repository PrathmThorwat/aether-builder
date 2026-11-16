import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, Terminal, Play, Download, Cpu, Check, Loader2 } from 'lucide-react';
import BuilderChat from './BuilderChat';
import CodeWorkspace, { type CodeWorkspaceHandle } from './CodeWorkspace';
import type { AiStatus } from '../services/aiGenerator';

interface StudioWorkspaceProps {
  initialPrompt: string;
  selectedEngine: string;
  onBack: () => void;
}

const DEFAULT_PROMPT = '3D Luxury Chronometer Storefront with WebGL viewer';

export default function StudioWorkspace({ initialPrompt, selectedEngine, onBack }: StudioWorkspaceProps) {
  const [isBuilt, setIsBuilt] = useState(false);
  const [activeFile, setActiveFile] = useState('/App.tsx');
  const [activePrompt, setActivePrompt] = useState(initialPrompt || DEFAULT_PROMPT);
  const [aiStatus, setAiStatus] = useState<AiStatus>('fallback');
  const [aiFallbackReason, setAiFallbackReason] = useState('Waiting for Groq response...');
  const [exportStatus, setExportStatus] = useState<'idle' | 'exporting' | 'downloaded'>('idle');
  const codeWorkspaceRef = useRef<CodeWorkspaceHandle>(null);

  const handleAiStatusChange = useCallback((status: AiStatus, reason?: string) => {
    setAiStatus(status);
    setAiFallbackReason(status === 'fallback' ? reason ?? 'Unknown Groq error' : '');
  }, []);

  useEffect(() => {
    if (exportStatus !== 'downloaded') return;
    const timer = window.setTimeout(() => setExportStatus('idle'), 2200);
    return () => window.clearTimeout(timer);
  }, [exportStatus]);

  const handleExportZip = async () => {
    if (!codeWorkspaceRef.current || exportStatus === 'exporting') return;
    setExportStatus('exporting');
    try {
      await codeWorkspaceRef.current.exportZip();
      setExportStatus('downloaded');
    } catch {
      setExportStatus('idle');
    }
  };

  const handleDeployLive = () => {
    codeWorkspaceRef.current?.openDeployModal();
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 text-slate-900">
      {/* Top Studio Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-slate-400" />
            <span>Back</span>
          </button>

          <div className="h-4 w-px bg-slate-200" />

          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#0F172A] text-white">
              <Terminal className="h-3.5 w-3.5" />
            </span>
            <span className="text-sm font-semibold tracking-tight text-[#0F172A]">
              Aether<span className="text-blue-600">Studio</span>
            </span>
          </div>

          <span className="hidden items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-blue-600 sm:inline-flex">
            <Cpu className="h-3 w-3" />
            {selectedEngine}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportZip}
            disabled={exportStatus === 'exporting'}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900 disabled:cursor-wait disabled:opacity-70"
          >
            {exportStatus === 'exporting' ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />
            ) : exportStatus === 'downloaded' ? (
              <Check className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <Download className="h-3.5 w-3.5 text-slate-400" />
            )}
            <span>
              {exportStatus === 'exporting'
                ? 'Exporting...'
                : exportStatus === 'downloaded'
                ? 'Downloaded!'
                : 'Export ZIP'}
            </span>
          </button>
          <button
            type="button"
            onClick={handleDeployLive}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#0F172A] px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-slate-800"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Deploy Live</span>
          </button>
        </div>
      </header>

      {/* Main Split-Screen Container */}
      <div className="flex min-h-0 flex-1 overflow-hidden bg-slate-50">
        <BuilderChat
          initialPrompt={activePrompt}
          aiStatus={aiStatus}
          aiFallbackReason={aiFallbackReason}
          onBuildComplete={(prompt) => {
            setActivePrompt(prompt);
            setIsBuilt(true);
          }}
          onSelectFile={(file) => setActiveFile(file)}
        />

        <CodeWorkspace
          ref={codeWorkspaceRef}
          activeFile={activeFile}
          onSelectFile={(file) => setActiveFile(file)}
          isBuilt={isBuilt}
          promptTitle={activePrompt}
          onAiStatusChange={handleAiStatusChange}
        />
      </div>
    </div>
  );
}
