import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
  SandpackCodeEditor,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  useSandpack,
} from '@codesandbox/sandpack-react';
import * as JSZipModule from 'jszip';

const JSZip = (JSZipModule as any).default || JSZipModule;
import { generateProjectFiles, type AiStatus } from '../services/aiGenerator';
import type { LucideIcon } from 'lucide-react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Code2,
  Columns2,
  Copy,
  Database,
  ExternalLink,
  Eye,
  FileCode2,
  FileJson,
  FolderTree,
  Globe,
  Loader2,
  Sparkles,
  Terminal as TerminalIcon,
  X,
} from 'lucide-react';

interface CodeWorkspaceProps {
  activeFile: string;
  onSelectFile: (file: string) => void;
  isBuilt: boolean;
  promptTitle: string;
  onAiStatusChange: (status: AiStatus, reason?: string) => void;
}

export interface CodeWorkspaceHandle {
  exportZip: () => Promise<void>;
  openDeployModal: () => void;
}

const PREVIEW_DEPENDENCIES = {
  name: 'aetherforge-live-preview',
  private: true,
  version: '1.0.0',
  main: '/index.tsx',
  dependencies: {
    'framer-motion': 'latest',
    'lucide-react': 'latest',
    react: '^19.0.0',
    'react-dom': '^19.0.0',
    'react-scripts': '^4.0.0',
  },
  devDependencies: {
    '@types/react': '^19.0.0',
    '@types/react-dom': '^19.0.0',
    typescript: '^5.6.3',
  },
};

const EXPORT_MAIN_SOURCE = `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
`;

const EXPORT_INDEX_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AetherForge Project</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

const EXPORT_INDEX_CSS = `@import "tailwindcss";
`;

const EXPORT_VITE_CONFIG = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
`;

const EXPORT_PACKAGE_JSON = {
  name: 'aetherforge-project',
  private: true,
  version: '0.1.0',
  type: 'module',
  scripts: {
    dev: 'vite',
    build: 'vite build',
    preview: 'vite preview',
  },
  dependencies: {
    'framer-motion': 'latest',
    'lucide-react': 'latest',
    react: '^19.0.0',
    'react-dom': '^19.0.0',
  },
  devDependencies: {
    '@tailwindcss/vite': 'latest',
    '@types/react': '^19.0.0',
    '@types/react-dom': '^19.0.0',
    '@vitejs/plugin-react': 'latest',
    tailwindcss: 'latest',
    typescript: '^5.6.3',
    vite: 'latest',
  },
};

function createExportReadme(promptTitle: string, templateLabel: string): string {
  const title = promptTitle.trim() || 'AetherForge starter';

  return `# AetherForge Project

Generated from: ${title}
Template: ${templateLabel}

## Run locally

1. Install dependencies:
   npm install
2. Start the development server:
   npm run dev
3. Build for production:
   npm run build

## Project structure

- src/App.tsx - generated application UI
- src/components/HeroSection.tsx - generated stage component
- src/main.tsx - React entry point
- prisma/schema.prisma - generated database schema
- package.json - Vite, React, Tailwind, and app dependencies

Open the local Vite URL after running npm run dev.
`;
}

function getExportPath(path: string): string {
  const clean = path.replace(/^\/+/, '');
  if (clean === 'App.tsx') return 'src/App.tsx';
  if (clean === 'index.tsx' || clean === 'main.tsx') return 'src/' + clean;
  if (clean.startsWith('components/')) return 'src/' + clean;
  return clean;
}

function createDeployUrl(prompt: string): string {
  let hash = 0;
  for (let index = 0; index < prompt.length; index += 1) {
    hash = (hash * 31 + prompt.charCodeAt(index)) >>> 0;
  }
  const deploymentId = 1000 + (hash % 9000);
  return `https://aether-app-${deploymentId}.aetherforge.app`;
}

const HERO_SECTION_SOURCE = `import { motion } from 'framer-motion';
import { ArrowUpRight, Box, Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,#eff6ff,transparent_65%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(circle_at_50%_50%,#000,transparent_78%)]" />

      <motion.div
        className="relative flex h-64 w-64 items-center justify-center"
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div
          className="absolute h-60 w-60 rounded-full border border-dashed border-slate-200"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute h-44 w-44 rounded-full border border-blue-100" />

        <motion.div
          className="relative grid h-32 w-32 place-items-center rounded-[28px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-200 shadow-[0_24px_50px_-24px_rgba(15,23,42,0.35)]"
          animate={{ rotate: [0, 7, 0, -7, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="absolute inset-3 rounded-[22px] border border-white" />
          <Box className="h-10 w-10 text-slate-800" strokeWidth={1.4} />
          <span className="absolute -right-2 -top-2 flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-blue-600">
            <Sparkles className="h-2.5 w-2.5" />
            live
          </span>
        </motion.div>

        <motion.div
          className="absolute -right-2 top-4 rounded-xl border border-slate-200 bg-white px-2.5 py-2 shadow-lg"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        >
          <p className="text-[8px] uppercase tracking-[0.16em] text-slate-400">Render</p>
          <p className="mt-0.5 flex items-center gap-1 text-[10px] font-semibold text-slate-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            60 fps
          </p>
        </motion.div>

        <motion.div
          className="absolute -left-2 bottom-5 rounded-xl border border-slate-200 bg-white px-2.5 py-2 shadow-lg"
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        >
          <p className="text-[8px] uppercase tracking-[0.16em] text-slate-400">Sandbox</p>
          <p className="mt-0.5 flex items-center gap-1 text-[10px] font-semibold text-slate-800">
            Compiled
            <ArrowUpRight className="h-2.5 w-2.5 text-blue-600" />
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}`;

const PRISMA_SCHEMA_SOURCE = `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model WorkspaceSession {
  id        String   @id @default(cuid())
  mode      String   @default("DUAL_MODE")
  prompt    String
  createdAt DateTime @default(now())
}`;

const HERO_CRYPTO_SOURCE = `import { motion } from 'framer-motion';
import { ArrowUpRight, TrendingUp, Wallet } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#070b16] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(37,99,235,0.32),transparent_65%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(circle_at_50%_50%,#000,transparent_75%)]" />

      <motion.div
        className="relative flex h-64 w-64 items-center justify-center"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div
          className="absolute h-60 w-60 rounded-full border border-blue-400/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute h-44 w-44 rounded-full border border-dashed border-blue-400/25" />

        <div className="relative grid h-32 w-32 place-items-center rounded-full border border-blue-400/30 bg-gradient-to-br from-blue-500/25 via-blue-500/10 to-transparent shadow-[0_0_80px_rgba(37,99,235,0.35)]">
          <Wallet className="h-11 w-11 text-blue-300" strokeWidth={1.4} />
          <span className="absolute -right-3 -top-2 flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-emerald-300">
            <TrendingUp className="h-2.5 w-2.5" />
            +12.4%
          </span>
        </div>

        <motion.div
          className="absolute -right-4 top-6 rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        >
          <p className="text-[8px] uppercase tracking-[0.16em] text-slate-400">BTC / USD</p>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-white">
            $68,420
            <ArrowUpRight className="h-2.5 w-2.5 text-emerald-400" />
          </p>
        </motion.div>

        <motion.div
          className="absolute -left-4 bottom-6 rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur"
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        >
          <p className="text-[8px] uppercase tracking-[0.16em] text-slate-400">Gas</p>
          <p className="mt-0.5 text-[11px] font-semibold text-white">14 gwei</p>
        </motion.div>
      </motion.div>
    </div>
  );
}`;

const HERO_COMMERCE_SOURCE = `import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#faf8f5]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,#ffffff,transparent_70%)]" />
      <motion.div
        className="relative w-60 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.3)]"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="relative flex h-32 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 via-white to-amber-50">
          <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-white/80 text-slate-400 shadow-sm">
            <Heart className="h-3 w-3" />
          </span>
          <ShoppingBag className="h-12 w-12 text-slate-800" strokeWidth={1.3} />
          <span className="absolute bottom-2 left-2 rounded-full bg-white px-2 py-0.5 text-[8px] font-semibold text-slate-600 shadow-sm">
            New drop
          </span>
        </div>
        <div className="mt-3 flex items-start justify-between gap-2">
          <div>
            <p className="text-[11px] font-semibold text-slate-900">Aero Runner</p>
            <p className="mt-0.5 flex items-center gap-1 text-[9px] text-slate-400">
              <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
              4.9 · 2.1k reviews
            </p>
          </div>
          <p className="text-[11px] font-semibold text-slate-900">$148</p>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full border border-slate-200 bg-slate-900" />
            <span className="h-3 w-3 rounded-full border border-slate-200 bg-amber-100" />
            <span className="h-3 w-3 rounded-full border border-slate-200 bg-emerald-100" />
          </div>
          <span className="rounded-lg bg-slate-900 px-2.5 py-1 text-[9px] font-semibold text-white">Add to bag</span>
        </div>
      </motion.div>

      <motion.div
        className="absolute -right-2 top-5 rounded-xl border border-slate-200 bg-white px-2.5 py-2 shadow-lg"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        <p className="text-[8px] uppercase tracking-[0.16em] text-slate-400">Shipping</p>
        <p className="mt-0.5 text-[10px] font-semibold text-slate-800">Free over $100</p>
      </motion.div>
    </div>
  );
}`;

const HERO_DASHBOARD_SOURCE = `import { motion } from 'framer-motion';
import { Activity, ArrowUpRight, Users } from 'lucide-react';

const BARS = [42, 64, 51, 78, 61, 88, 72];

export default function HeroSection() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-slate-50 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#ffffff,transparent_75%)]" />
      <motion.div
        className="relative w-full max-w-xs rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_20px_50px_-24px_rgba(15,23,42,0.25)]"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[8px] uppercase tracking-[0.16em] text-slate-400">Revenue overview</p>
            <p className="mt-1 text-lg font-semibold tracking-tight text-slate-900">$482,910</p>
          </div>
          <span className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[8px] font-semibold text-emerald-600">
            <ArrowUpRight className="h-2.5 w-2.5" />
            18.2%
          </span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            ['12.4k', 'Users'],
            ['4.8%', 'Conv.'],
            ['$96', 'ARPU'],
          ].map(([value, label]) => (
            <div key={label} className="rounded-lg border border-slate-100 bg-slate-50 px-2 py-1.5">
              <p className="text-[11px] font-semibold text-slate-900">{value}</p>
              <p className="text-[8px] uppercase tracking-wide text-slate-400">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex h-24 items-end gap-1.5">
          {BARS.map((height, index) => (
            <motion.div
              key={index}
              className={'flex-1 rounded-t-sm ' + (index === BARS.length - 2 ? 'bg-blue-600' : 'bg-blue-100')}
              initial={{ height: 0 }}
              animate={{ height: height + '%' }}
              transition={{ duration: 0.6, delay: 0.15 + index * 0.07, ease: 'easeOut' }}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[7px] uppercase tracking-wide text-slate-400">
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
          <span>Sun</span>
        </div>
      </motion.div>

      <motion.div
        className="absolute -left-2 top-6 rounded-xl border border-slate-200 bg-white px-2.5 py-2 shadow-lg"
        animate={{ y: [0, 4, 0] }}
        transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        <p className="flex items-center gap-1 text-[8px] uppercase tracking-[0.16em] text-slate-400">
          <Users className="h-2.5 w-2.5" />
          Active
        </p>
        <p className="mt-0.5 flex items-center gap-1 text-[10px] font-semibold text-slate-800">
          <Activity className="h-2.5 w-2.5 text-emerald-500" />
          12,480
        </p>
      </motion.div>
    </div>
  );
}`;

const HERO_SAAS_SOURCE = `import { motion } from 'framer-motion';
import { CheckCircle2, CircleDashed, Sparkles, Zap } from 'lucide-react';

const STEPS = ['Validate prompt schema', 'Generate React + Tailwind', 'Bundle API contracts', 'Deploy preview'];

export default function HeroSection() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-white p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,#eff6ff,transparent_70%)]" />
      <motion.div
        className="relative w-full max-w-xs rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_20px_50px_-24px_rgba(15,23,42,0.25)]"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-900">
            <Sparkles className="h-3 w-3 text-blue-600" />
            Build pipeline
          </span>
          <span className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[8px] font-semibold text-blue-600">
            Running
          </span>
        </div>
        <div className="mt-3 space-y-2">
          {STEPS.map((step, index) => (
            <motion.div
              key={step}
              className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/70 px-2 py-1.5"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.15 }}
            >
              {index < 3 ? (
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
              ) : (
                <CircleDashed className="h-3.5 w-3.5 shrink-0 animate-spin text-blue-600" />
              )}
              <span className="text-[9px] font-medium text-slate-600">{step}</span>
            </motion.div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-900 px-2.5 py-2">
          <span className="flex items-center gap-1 text-[9px] font-semibold text-white">
            <Zap className="h-3 w-3 text-blue-300" />
            Production preview
          </span>
          <span className="text-[8px] text-slate-400">~38s</span>
        </div>
      </motion.div>
    </div>
  );
}`;

const PRISMA_CRYPTO_SOURCE = `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  wallets   Wallet[]
  createdAt DateTime @default(now())
}

model Wallet {
  id           String        @id @default(cuid())
  address      String        @unique
  balance      Decimal       @db.Decimal(18, 8)
  userId       String
  user         User          @relation(fields: [userId], references: [id])
  transactions Transaction[]
}

model Transaction {
  id        String   @id @default(cuid())
  hash      String   @unique
  amount    Decimal  @db.Decimal(18, 8)
  status    String   @default("PENDING")
  walletId  String
  wallet    Wallet   @relation(fields: [walletId], references: [id])
  createdAt DateTime @default(now())
}`;

const PRISMA_COMMERCE_SOURCE = `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Product {
  id         String      @id @default(cuid())
  name       String
  price      Decimal     @db.Decimal(10, 2)
  inventory  Int         @default(0)
  orderItems OrderItem[]
}

model Order {
  id            String      @id @default(cuid())
  customerEmail String
  total         Decimal     @db.Decimal(10, 2)
  status        String      @default("PENDING")
  items         OrderItem[]
  createdAt     DateTime    @default(now())
}

model OrderItem {
  id        String  @id @default(cuid())
  quantity  Int
  productId String
  orderId   String
  product   Product @relation(fields: [productId], references: [id])
  order     Order   @relation(fields: [orderId], references: [id])
}`;

const PRISMA_DASHBOARD_SOURCE = `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Workspace {
  id      String           @id @default(cuid())
  name    String
  metrics MetricSnapshot[]
}

model MetricSnapshot {
  id          String    @id @default(cuid())
  key         String
  value       Float
  capturedAt  DateTime  @default(now())
  workspaceId String
  workspace   Workspace @relation(fields: [workspaceId], references: [id])
}

model Report {
  id        String   @id @default(cuid())
  title     String
  period    String
  createdAt DateTime @default(now())
}`;

const PRISMA_SPATIAL_SOURCE = `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Scene {
  id        String   @id @default(cuid())
  name      String
  mode      String   @default("WEBGL")
  assets    Asset[]
  createdAt DateTime @default(now())
}

model Asset {
  id      String @id @default(cuid())
  name    String
  kind    String
  url     String
  sceneId String
  scene   Scene  @relation(fields: [sceneId], references: [id])
}`;

type PromptScenario =
  | 'crypto'
  | 'commerce'
  | 'dashboard'
  | 'spatial'
  | 'saas'
  | 'transit'
  | 'realestate'
  | 'sneaker';

type ExperienceKind = 'dashboard' | 'spatial';

interface TableRow {
  cells: string[];
  status: string;
}

interface PricingPlan {
  name: string;
  price: string;
  detail: string;
  perks: string[];
}

interface Swatch {
  name: string;
  color: string;
  gradient: string;
}

interface ProfileDetails {
  kind: ExperienceKind;
  label: string;
  accent: string;
  accentSoft: string;
  tableTitle: string;
  tableHeaders: string[];
  tableRows: TableRow[];
  plans: PricingPlan[];
  swatches: Swatch[];
  objectLabel: string;
  objectMeta: string;
}

interface ScenarioFeature {
  icon: string;
  title: string;
  copy: string;
}

interface ScenarioContent {
  brand: string;
  eyebrow: string;
  titleFallback: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  stageLabel: string;
  metrics: string[][];
  features: ScenarioFeature[];
  hero: string;
  schema: string;
}

const SCENARIOS: Record<PromptScenario, ScenarioContent> = {
  crypto: {
    brand: 'AetherPay',
    eyebrow: 'Generated crypto workspace',
    titleFallback: 'Crypto Portfolio & Wallet Console',
    description:
      'A live Web3 workspace with wallet balances, token performance, and on-chain activity generated from your prompt.',
    primaryCta: 'Connect wallet',
    secondaryCta: 'Live on-chain data · keys stay local',
    stageLabel: 'live · web3 stage',
    metrics: [
      ['$2.4B', 'volume tracked'],
      ['128k', 'active wallets'],
      ['99.99%', 'settlement uptime'],
    ],
    features: [
      {
        icon: 'Wallet',
        title: 'Multi-chain wallet',
        copy: 'One balance view across EVM chains with live token pricing.',
      },
      {
        icon: 'LineChart',
        title: 'Portfolio analytics',
        copy: 'Track allocation, PnL, and risk with animated charts.',
      },
      {
        icon: 'ShieldCheck',
        title: 'Secure custody',
        copy: 'Non-custodial flows, typed transactions, and audit-ready logs.',
      },
    ],
    hero: HERO_CRYPTO_SOURCE,
    schema: PRISMA_CRYPTO_SOURCE,
  },
  commerce: {
    brand: 'AetherSupply',
    eyebrow: 'Generated commerce storefront',
    titleFallback: 'Editorial Commerce Storefront',
    description:
      'A conversion-focused storefront with product storytelling, live inventory, and a frictionless checkout flow.',
    primaryCta: 'Shop the drop',
    secondaryCta: 'Free returns · live inventory',
    stageLabel: 'live · storefront stage',
    metrics: [
      ['$1.8M', 'GMV modeled'],
      ['4.9/5', 'customer rating'],
      ['48h', 'avg fulfillment'],
    ],
    features: [
      {
        icon: 'ShoppingBag',
        title: 'Product storytelling',
        copy: 'Editorial product cards with motion, reviews, and variant swatches.',
      },
      {
        icon: 'Layers',
        title: 'Inventory aware',
        copy: 'Typed products and orders keep stock and totals in sync.',
      },
      {
        icon: 'Zap',
        title: 'Fast checkout',
        copy: 'A streamlined cart and payment flow tuned for conversion.',
      },
    ],
    hero: HERO_COMMERCE_SOURCE,
    schema: PRISMA_COMMERCE_SOURCE,
  },
  dashboard: {
    brand: 'AetherMetrics',
    eyebrow: 'Generated analytics dashboard',
    titleFallback: 'Revenue & Growth Dashboard',
    description:
      'A realtime analytics workspace with KPI cards, animated charts, and a typed metric pipeline generated from your prompt.',
    primaryCta: 'View live dashboard',
    secondaryCta: 'Realtime metrics · 12.4k events/min',
    stageLabel: 'live · analytics stage',
    metrics: [
      ['$482k', 'monthly revenue'],
      ['18.2%', 'growth rate'],
      ['12.4k', 'active users'],
    ],
    features: [
      {
        icon: 'LineChart',
        title: 'Realtime charts',
        copy: 'Animated revenue and engagement series with clean legends.',
      },
      {
        icon: 'Database',
        title: 'Metric pipeline',
        copy: 'Snapshot models keep reporting fast and queryable.',
      },
      {
        icon: 'Cpu',
        title: 'Workspace controls',
        copy: 'Filter by team, period, and channel without leaving the page.',
      },
    ],
    hero: HERO_DASHBOARD_SOURCE,
    schema: PRISMA_DASHBOARD_SOURCE,
  },
  spatial: {
    brand: 'AetherForge',
    eyebrow: 'Generated spatial experience',
    titleFallback: 'Spatial 3D Product Stage',
    description:
      'An immersive, interactive stage built with CSS, SVG, and motion so the live preview stays fast and reliable.',
    primaryCta: 'Enter experience',
    secondaryCta: 'Interactive stage · 60fps UI',
    stageLabel: 'live · spatial stage',
    metrics: [
      ['60fps', 'render loop'],
      ['12', 'animated layers'],
      ['100%', 'responsive'],
    ],
    features: [
      {
        icon: 'Box',
        title: 'Interactive stage',
        copy: 'Layered CSS and SVG depth with pointer-friendly motion.',
      },
      {
        icon: 'Layers',
        title: 'Scene composition',
        copy: 'Composable scene assets with clear hierarchy and naming.',
      },
      {
        icon: 'Sparkles',
        title: 'Editorial polish',
        copy: 'Soft gradients, fine borders, and restrained animation.',
      },
    ],
    hero: HERO_SECTION_SOURCE,
    schema: PRISMA_SPATIAL_SOURCE,
  },
  saas: {
    brand: 'AetherForge',
    eyebrow: 'Generated SaaS workspace',
    titleFallback: 'Full-Stack SaaS Workspace',
    description:
      'A production-ready SaaS shell with typed UI, API routes, and a live build pipeline generated from your prompt.',
    primaryCta: 'Launch workspace',
    secondaryCta: 'Live preview · no build step',
    stageLabel: 'live · saas stage',
    metrics: [
      ['38s', 'avg build'],
      ['0', 'config files'],
      ['React', 'live runtime'],
    ],
    features: [
      {
        icon: 'Layers',
        title: 'One workspace',
        copy: 'Spatial scenes, SaaS screens, and schemas generated from the same prompt.',
      },
      {
        icon: 'Database',
        title: 'Typed data plane',
        copy: 'PostgreSQL models and Prisma migrations ship with every build.',
      },
      {
        icon: 'ShieldCheck',
        title: 'Production defaults',
        copy: 'Auth, billing, and observability are wired before the first deploy.',
      },
    ],
    hero: HERO_SAAS_SOURCE,
    schema: PRISMA_SCHEMA_SOURCE,
  },
  transit: {
    brand: 'AetherTransit',
    eyebrow: 'Generated transit optimization dashboard',
    titleFallback: 'Transit Network Optimization',
    description:
      'A live operations dashboard with route health, delay forecasting, ridership trends, and dispatch controls generated from your prompt.',
    primaryCta: 'Optimize routes',
    secondaryCta: 'Live fleet telemetry · 128 routes',
    stageLabel: 'live · transit ops',
    metrics: [
      ['94.6%', 'on-time rate'],
      ['2.4m', 'avg delay'],
      ['128', 'active routes'],
    ],
    features: [],
    hero: HERO_DASHBOARD_SOURCE,
    schema: PRISMA_DASHBOARD_SOURCE,
  },
  realestate: {
    brand: 'AetherEstates',
    eyebrow: 'Generated real-estate walkthrough',
    titleFallback: 'Skyline Residence Viewer',
    description:
      'An interactive spatial property viewer with 360° staging, finish swatches, floor pricing, and tour controls generated from your prompt.',
    primaryCta: 'Book private tour',
    secondaryCta: 'Live 3D walkthrough · 4 units left',
    stageLabel: 'live · property viewer',
    metrics: [
      ['4', 'available units'],
      ['360°', 'interactive tour'],
      ['$420k', 'starting price'],
    ],
    features: [],
    hero: HERO_SECTION_SOURCE,
    schema: PRISMA_SPATIAL_SOURCE,
  },
  sneaker: {
    brand: 'AetherKicks',
    eyebrow: 'Generated sneaker configurator',
    titleFallback: 'Aero Runner X Configurator',
    description:
      'A 3D product configurator with live colorways, rotation controls, pricing tiers, and a reserve flow generated from your prompt.',
    primaryCta: 'Reserve pair',
    secondaryCta: 'Interactive 3D · limited drop',
    stageLabel: 'live · configurator',
    metrics: [
      ['4', 'colorways'],
      ['360°', 'product view'],
      ['$168', 'starting price'],
    ],
    features: [],
    hero: HERO_COMMERCE_SOURCE,
    schema: PRISMA_COMMERCE_SOURCE,
  },
};

const SCENARIO_LABELS: Record<PromptScenario, string> = {
  crypto: 'Crypto trading dashboard',
  commerce: 'Commerce product stage',
  dashboard: 'Analytics dashboard',
  spatial: 'Spatial 3D viewer',
  saas: 'SaaS operations dashboard',
  transit: 'Transit optimization',
  realestate: 'Real-estate 3D viewer',
  sneaker: 'Sneaker configurator',
};

const SCENARIO_KEYWORDS: Record<Exclude<PromptScenario, 'saas'>, string[]> = {
  realestate: [
    'real estate',
    'realestate',
    'property',
    'properties',
    'apartment',
    'villa',
    'listing',
    'listings',
    'realtor',
    'estate',
    'architecture',
    'home tour',
  ],
  sneaker: [
    'sneaker',
    'sneakers',
    'shoe',
    'shoes',
    'footwear',
    'kick',
    'kicks',
    'trainer',
    'trainers',
    'configurator',
  ],
  spatial: [
    '3d',
    'spatial',
    'webgl',
    'immersive',
    'vr',
    'ar',
    'gallery',
    'three',
    'walkthrough',
    'viewer',
  ],
  commerce: [
    'e-commerce',
    'ecommerce',
    'commerce',
    'store',
    'storefront',
    'shop',
    'product',
    'cart',
    'checkout',
    'retail',
    'fashion',
  ],
  transit: [
    'transit',
    'transport',
    'route',
    'routes',
    'fleet',
    'logistics',
    'traffic',
    'dispatch',
    'mobility',
    'rail',
    'bus',
  ],
  crypto: [
    'crypto',
    'cryptocurrency',
    'web3',
    'nft',
    'token',
    'tokens',
    'wallet',
    'wallets',
    'defi',
    'bitcoin',
    'ethereum',
    'blockchain',
    'trading',
  ],
  dashboard: [
    'dashboard',
    'analytics',
    'admin',
    'metrics',
    'crm',
    'console',
    'reporting',
    'saas',
    'kpi',
    'revenue',
  ],
};

function matchesKeyword(text: string, keyword: string): boolean {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`).test(text);
}

function detectScenario(prompt: string): PromptScenario {
  const text = prompt.toLowerCase();
  const priority = [
    'realestate',
    'sneaker',
    'spatial',
    'commerce',
    'transit',
    'crypto',
    'dashboard',
  ] as const;
  for (const scenario of priority) {
    if (SCENARIO_KEYWORDS[scenario].some((keyword) => matchesKeyword(text, keyword))) {
      return scenario;
    }
  }
  return 'saas';
}

const PROFILE_DETAILS: Record<PromptScenario, ProfileDetails> = {
  dashboard: {
    kind: 'dashboard',
    label: 'Analytics dashboard',
    accent: '#2563eb',
    accentSoft: 'rgba(37, 99, 235, 0.12)',
    tableTitle: 'Channel performance',
    tableHeaders: ['Channel', 'Owner', 'Revenue', 'Growth', 'Status'],
    tableRows: [
      { cells: ['Organic search', 'Mina Park', '$184,200', '+24.8%'], status: 'Scaling' },
      { cells: ['Paid social', 'Andre Silva', '$126,400', '+12.1%'], status: 'Healthy' },
      { cells: ['Lifecycle email', 'Priya Shah', '$84,900', '+8.6%'], status: 'Healthy' },
      { cells: ['Partner referrals', 'Noah Kim', '$52,300', '-3.2%'], status: 'Review' },
    ],
    plans: [],
    swatches: [],
    objectLabel: '',
    objectMeta: '',
  },
  crypto: {
    kind: 'dashboard',
    label: 'Crypto trading dashboard',
    accent: '#4f46e5',
    accentSoft: 'rgba(79, 70, 229, 0.12)',
    tableTitle: 'Trading pairs',
    tableHeaders: ['Pair', 'Strategy', '24h volume', 'PnL', 'Status'],
    tableRows: [
      { cells: ['BTC / USDT', 'Momentum', '$842M', '+4.2%'], status: 'Live' },
      { cells: ['ETH / USDT', 'Mean reversion', '$418M', '+2.1%'], status: 'Live' },
      { cells: ['SOL / USDT', 'Breakout', '$196M', '-1.4%'], status: 'Watch' },
      { cells: ['ARB / USDT', 'Market making', '$84M', '+0.8%'], status: 'Live' },
    ],
    plans: [],
    swatches: [],
    objectLabel: '',
    objectMeta: '',
  },
  transit: {
    kind: 'dashboard',
    label: 'Transit optimization',
    accent: '#059669',
    accentSoft: 'rgba(5, 150, 105, 0.12)',
    tableTitle: 'Route health',
    tableHeaders: ['Route', 'Dispatcher', 'Ridership', 'On-time', 'Status'],
    tableRows: [
      { cells: ['Blue Line', 'Maya Chen', '12,480', '94.6%'], status: 'On time' },
      { cells: ['Harbor Express', 'Luis Ortega', '8,920', '91.2%'], status: 'On time' },
      { cells: ['North Loop', 'Ava Brooks', '6,310', '78.4%'], status: 'Delayed' },
      { cells: ['Airport Shuttle', 'Theo Grant', '4,180', '88.9%'], status: 'On time' },
    ],
    plans: [],
    swatches: [],
    objectLabel: '',
    objectMeta: '',
  },
  saas: {
    kind: 'dashboard',
    label: 'SaaS operations dashboard',
    accent: '#0f766e',
    accentSoft: 'rgba(15, 118, 110, 0.12)',
    tableTitle: 'Account expansion',
    tableHeaders: ['Account', 'Plan', 'MRR', 'Seats', 'Status'],
    tableRows: [
      { cells: ['Northstar Labs', 'Scale', '$18,400', '248'], status: 'Healthy' },
      { cells: ['Helio Bank', 'Enterprise', '$32,800', '620'], status: 'Healthy' },
      { cells: ['Orbit Health', 'Growth', '$9,200', '118'], status: 'Review' },
      { cells: ['Lumen Studio', 'Starter', '$2,400', '32'], status: 'Onboarding' },
    ],
    plans: [],
    swatches: [],
    objectLabel: '',
    objectMeta: '',
  },
  commerce: {
    kind: 'spatial',
    label: 'Commerce product stage',
    accent: '#d97706',
    accentSoft: 'rgba(217, 119, 6, 0.12)',
    tableTitle: '',
    tableHeaders: [],
    tableRows: [],
    plans: [
      {
        name: 'Core',
        price: '$148',
        detail: 'Everyday pair',
        perks: ['Recycled knit upper', 'Standard cushioning', '2-year wear warranty'],
      },
      {
        name: 'Studio',
        price: '$196',
        detail: 'Limited colorway',
        perks: ['Hand-finished panels', 'Carbon propulsion plate', 'Priority delivery'],
      },
      {
        name: 'Atelier',
        price: '$268',
        detail: 'Made to order',
        perks: ['Custom monogram', 'Numbered edition', 'Lifetime resole'],
      },
    ],
    swatches: [
      {
        name: 'Ivory',
        color: '#e7e5e4',
        gradient: 'linear-gradient(145deg, #ffffff, #d6d3d1 55%, #a8a29e)',
      },
      {
        name: 'Ember',
        color: '#f97316',
        gradient: 'linear-gradient(145deg, #fdba74, #f97316 55%, #c2410c)',
      },
      {
        name: 'Forest',
        color: '#10b981',
        gradient: 'linear-gradient(145deg, #6ee7b7, #10b981 55%, #047857)',
      },
      {
        name: 'Ink',
        color: '#334155',
        gradient: 'linear-gradient(145deg, #64748b, #334155 55%, #0f172a)',
      },
    ],
    objectLabel: 'Signature product',
    objectMeta: 'Aero Runner · 360° stage',
  },
  spatial: {
    kind: 'spatial',
    label: 'Spatial 3D viewer',
    accent: '#2563eb',
    accentSoft: 'rgba(37, 99, 235, 0.12)',
    tableTitle: '',
    tableHeaders: [],
    tableRows: [],
    plans: [
      {
        name: 'Concept',
        price: '$12k',
        detail: 'Single scene',
        perks: ['Interactive 3D stage', 'Motion presets', 'Responsive layout'],
      },
      {
        name: 'Signature',
        price: '$28k',
        detail: 'Full experience',
        perks: ['Multi-scene routing', 'Custom controls', 'Performance tuning'],
      },
      {
        name: 'Bespoke',
        price: '$54k',
        detail: 'Production build',
        perks: ['Art direction', 'CMS integration', 'Launch support'],
      },
    ],
    swatches: [
      {
        name: 'Glacier',
        color: '#60a5fa',
        gradient: 'linear-gradient(145deg, #e0f2fe, #60a5fa 55%, #1d4ed8)',
      },
      {
        name: 'Copper',
        color: '#f97316',
        gradient: 'linear-gradient(145deg, #fed7aa, #f97316 55%, #9a3412)',
      },
      {
        name: 'Obsidian',
        color: '#334155',
        gradient: 'linear-gradient(145deg, #94a3b8, #334155 55%, #020617)',
      },
      {
        name: 'Sand',
        color: '#d6d3d1',
        gradient: 'linear-gradient(145deg, #fafaf9, #d6d3d1 55%, #a8a29e)',
      },
    ],
    objectLabel: 'Spatial object',
    objectMeta: '360° stage · 12 layers',
  },
  realestate: {
    kind: 'spatial',
    label: 'Real-estate 3D viewer',
    accent: '#b45309',
    accentSoft: 'rgba(180, 83, 9, 0.12)',
    tableTitle: '',
    tableHeaders: [],
    tableRows: [],
    plans: [
      {
        name: 'Studio',
        price: '$420k',
        detail: '48 m² · city view',
        perks: ['Floor-to-ceiling glass', 'Smart climate', 'Concierge access'],
      },
      {
        name: 'Two-bedroom',
        price: '$680k',
        detail: '84 m² · skyline view',
        perks: ['Corner terrace', 'Private lift lobby', 'Two parking bays'],
      },
      {
        name: 'Penthouse',
        price: '$1.4M',
        detail: '164 m² · 360° terrace',
        perks: ['Private roof garden', 'Chef kitchen', '24/7 residence team'],
      },
    ],
    swatches: [
      {
        name: 'Oak',
        color: '#b45309',
        gradient: 'linear-gradient(145deg, #fcd34d, #b45309 55%, #78350f)',
      },
      {
        name: 'Walnut',
        color: '#78350f',
        gradient: 'linear-gradient(145deg, #d6a06a, #78350f 55%, #3f1d0b)',
      },
      {
        name: 'Ivory',
        color: '#e7e5e4',
        gradient: 'linear-gradient(145deg, #ffffff, #e7e5e4 55%, #a8a29e)',
      },
      {
        name: 'Graphite',
        color: '#334155',
        gradient: 'linear-gradient(145deg, #94a3b8, #334155 55%, #0f172a)',
      },
    ],
    objectLabel: 'Skyline Residence',
    objectMeta: '3D walkthrough · Level 28',
  },
  sneaker: {
    kind: 'spatial',
    label: 'Sneaker configurator',
    accent: '#ea580c',
    accentSoft: 'rgba(234, 88, 12, 0.12)',
    tableTitle: '',
    tableHeaders: [],
    tableRows: [],
    plans: [
      {
        name: 'Core',
        price: '$168',
        detail: 'Standard colorway',
        perks: ['Engineered mesh', 'Aero foam midsole', '30-day trial'],
      },
      {
        name: 'Pro',
        price: '$208',
        detail: 'Performance build',
        perks: ['Carbon propulsion plate', 'Knit collar', 'Priority shipping'],
      },
      {
        name: 'Limited',
        price: '$248',
        detail: 'Numbered release',
        perks: ['Hand-finished details', 'Custom lace set', 'Collector box'],
      },
    ],
    swatches: [
      {
        name: 'Solar',
        color: '#f97316',
        gradient: 'linear-gradient(145deg, #fed7aa, #f97316 55%, #c2410c)',
      },
      {
        name: 'Volt',
        color: '#84cc16',
        gradient: 'linear-gradient(145deg, #ecfccb, #84cc16 55%, #3f6212)',
      },
      {
        name: 'Cloud',
        color: '#e2e8f0',
        gradient: 'linear-gradient(145deg, #ffffff, #e2e8f0 55%, #94a3b8)',
      },
      {
        name: 'Onyx',
        color: '#1e293b',
        gradient: 'linear-gradient(145deg, #64748b, #1e293b 55%, #020617)',
      },
    ],
    objectLabel: 'Aero Runner X',
    objectMeta: '3D configurator · 4 colorways',
  },
};

function resolvePromptTitle(promptTitle: string, scenario: ScenarioContent): string {
  const rawTitle = promptTitle.trim();
  if (!rawTitle) return scenario.titleFallback;
  return rawTitle.length > 90 ? rawTitle.slice(0, 90).trimEnd() + '…' : rawTitle;
}

function buildDashboardApp(
  promptTitle: string,
  scenario: ScenarioContent,
  details: ProfileDetails
): string {
  const title = resolvePromptTitle(promptTitle, scenario);

  return `import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowUpRight,
  Bell,
  CalendarDays,
  Download,
  LayoutDashboard,
  RefreshCw,
  Search,
  Settings,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

const TITLE = ${JSON.stringify(title)};
const BRAND = ${JSON.stringify(scenario.brand)};
const EYEBROW = ${JSON.stringify(scenario.eyebrow)};
const DESCRIPTION = ${JSON.stringify(scenario.description)};
const STAGE_LABEL = ${JSON.stringify(scenario.stageLabel)};
const PRIMARY_CTA = ${JSON.stringify(scenario.primaryCta)};
const SECONDARY_CTA = ${JSON.stringify(scenario.secondaryCta)};
const ACCENT = ${JSON.stringify(details.accent)};
const ACCENT_SOFT = ${JSON.stringify(details.accentSoft)};
const METRICS = ${JSON.stringify(scenario.metrics)};
const TABLE_TITLE = ${JSON.stringify(details.tableTitle)};
const TABLE_HEADERS = ${JSON.stringify(details.tableHeaders)};
const TABLE_ROWS = ${JSON.stringify(details.tableRows)};
const SERIES = [38, 52, 46, 64, 58, 72, 68, 84, 78, 92, 86, 98];
const ACTIVITY = [
  { time: '09:42', title: 'Forecast model retrained', copy: 'Accuracy improved by 3.8%' },
  { time: '09:18', title: 'New segment synced', copy: '12,480 records normalized' },
  { time: '08:55', title: 'Anomaly resolved', copy: 'Checkout latency back to baseline' },
];

export default function App() {
  const [range, setRange] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);
  const [lastSync, setLastSync] = useState('2 min ago');
  const [exported, setExported] = useState(false);

  const visibleSeries =
    range === '7d' ? SERIES.slice(-7) : range === '90d' ? SERIES : SERIES.slice(0, 9);
  const rows = range === '7d' ? TABLE_ROWS.slice(0, 3) : TABLE_ROWS;

  const handleRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    window.setTimeout(() => {
      setRefreshing(false);
      setLastSync('just now');
    }, 900);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-slate-200 bg-white px-3 py-4 lg:flex">
        <div className="flex items-center gap-2 px-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-slate-900 text-white">
            <TrendingUp className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold tracking-tight">{BRAND}</span>
        </div>
        <nav className="mt-8 space-y-1 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-slate-900">
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </div>
          <div className="flex items-center gap-2 rounded-lg px-3 py-2">
            <Activity className="h-4 w-4" />
            Live metrics
          </div>
          <div className="flex items-center gap-2 rounded-lg px-3 py-2">
            <CalendarDays className="h-4 w-4" />
            Reports
          </div>
          <div className="flex items-center gap-2 rounded-lg px-3 py-2">
            <Settings className="h-4 w-4" />
            Settings
          </div>
        </nav>
        <div className="mt-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {STAGE_LABEL}
          </p>
          <p className="mt-2 text-xs font-medium text-slate-700">{SECONDARY_CTA}</p>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-400">
              <Search className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Search metrics, accounts, routes...</span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="hidden items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-600 sm:flex">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                Synced {lastSync}
              </span>
              <button className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500">
                <Bell className="h-3.5 w-3.5" />
              </button>
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-900 text-[10px] font-semibold text-white">
                MP
              </span>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em]"
                style={{ background: ACCENT_SOFT, color: ACCENT }}
              >
                <Sparkles className="h-3 w-3" />
                {EYEBROW}
              </span>
              <h1 className="mt-3 max-w-3xl break-words text-2xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-3xl">
                {TITLE}
              </h1>
              <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-500 sm:text-sm">
                {DESCRIPTION}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <button
                onClick={handleRefresh}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-600 transition hover:border-slate-300"
              >
                <RefreshCw className={'h-3.5 w-3.5 ' + (refreshing ? 'animate-spin' : '')} />
                {refreshing ? 'Syncing' : 'Refresh'}
              </button>
              <button
                onClick={() => setExported(true)}
                className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[11px] font-semibold text-white transition hover:opacity-90"
                style={{ background: ACCENT }}
              >
                <Download className="h-3.5 w-3.5" />
                {exported ? 'Export queued' : PRIMARY_CTA}
              </button>
            </div>
          </div>

          <div className="flex w-fit items-center gap-1 rounded-xl border border-slate-200 bg-white p-1">
            {['7d', '30d', '90d'].map((option) => (
              <button
                key={option}
                onClick={() => setRange(option)}
                className={
                  'rounded-lg px-3 py-1.5 text-[10px] font-semibold transition ' +
                  (range === option ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800')
                }
              >
                {option}
              </button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {METRICS.map(([value, label], index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">{label}</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
                <p className="mt-2 flex items-center gap-1 text-[10px] font-semibold" style={{ color: ACCENT }}>
                  <ArrowUpRight className="h-3 w-3" />
                  {index === 1 ? 'within target' : index === 2 ? 'vs previous period' : '+12.4% vs last period'}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.45fr_0.55fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-semibold text-slate-900">Performance trend</h2>
                  <p className="mt-0.5 text-[10px] text-slate-400">Live series · {range} window</p>
                </div>
                <span
                  className="rounded-full px-2 py-0.5 text-[9px] font-semibold"
                  style={{ background: ACCENT_SOFT, color: ACCENT }}
                >
                  +18.2%
                </span>
              </div>
              <div className="mt-6 flex h-52 items-end gap-2">
                {visibleSeries.map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ height: 0 }}
                    animate={{ height: value + '%' }}
                    transition={{ delay: index * 0.03, duration: 0.35 }}
                    className="flex-1 rounded-t-md"
                    style={{
                      background: index === visibleSeries.length - 1 ? ACCENT : ACCENT_SOFT,
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold text-slate-900">Activity</h2>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </div>
              <div className="mt-4 space-y-3">
                {ACTIVITY.map((item) => (
                  <div key={item.time} className="rounded-xl border border-slate-100 bg-slate-50/70 p-2.5">
                    <div className="flex items-center justify-between text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                      <span>{item.title}</span>
                      <span>{item.time}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-600">{item.copy}</p>
                  </div>
                ))}
              </div>
              <button className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-[10px] font-semibold text-slate-600">
                Open audit log
                <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div>
                <h2 className="text-xs font-semibold text-slate-900">{TABLE_TITLE}</h2>
                <p className="mt-0.5 text-[10px] text-slate-400">Updated {lastSync}</p>
              </div>
              <span className="rounded-full border border-slate-200 px-2 py-0.5 text-[9px] font-semibold text-slate-500">
                {rows.length} records
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-xs">
                <thead className="bg-slate-50 text-[9px] uppercase tracking-[0.14em] text-slate-400">
                  <tr>
                    {TABLE_HEADERS.map((header) => (
                      <th key={header} className="px-4 py-2.5 font-semibold">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((row) => (
                    <tr key={row.cells[0]} className="transition hover:bg-slate-50/70">
                      {row.cells.map((cell, index) => (
                        <td
                          key={cell + index}
                          className={
                            'px-4 py-3 ' +
                            (index === 0 ? 'font-semibold text-slate-900' : 'text-slate-500')
                          }
                        >
                          {cell}
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        <span
                          className={
                            'rounded-full px-2 py-0.5 text-[9px] font-semibold ' +
                            (/review|delay|watch|risk/i.test(row.status)
                              ? 'bg-amber-50 text-amber-600'
                              : 'bg-emerald-50 text-emerald-600')
                          }
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}`;
}

function buildSpatialApp(
  promptTitle: string,
  scenario: ScenarioContent,
  details: ProfileDetails
): string {
  const title = resolvePromptTitle(promptTitle, scenario);

  return `import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Box,
  Check,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

const TITLE = ${JSON.stringify(title)};
const BRAND = ${JSON.stringify(scenario.brand)};
const EYEBROW = ${JSON.stringify(scenario.eyebrow)};
const DESCRIPTION = ${JSON.stringify(scenario.description)};
const STAGE_LABEL = ${JSON.stringify(scenario.stageLabel)};
const PRIMARY_CTA = ${JSON.stringify(scenario.primaryCta)};
const SECONDARY_CTA = ${JSON.stringify(scenario.secondaryCta)};
const ACCENT = ${JSON.stringify(details.accent)};
const ACCENT_SOFT = ${JSON.stringify(details.accentSoft)};
const METRICS = ${JSON.stringify(scenario.metrics)};
const OBJECT_LABEL = ${JSON.stringify(details.objectLabel)};
const OBJECT_META = ${JSON.stringify(details.objectMeta)};
const SWATCHES = ${JSON.stringify(details.swatches)};
const PLANS = ${JSON.stringify(details.plans)};

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    let frame = 0;
    const dots = Array.from({ length: 52 }, (_, index) => ({
      x: ((index * 37) % 100) / 100,
      y: ((index * 61) % 100) / 100,
      radius: 1 + (index % 3),
      speed: 0.0004 + (index % 5) * 0.00016,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width));
      canvas.height = Math.max(1, Math.floor(rect.height));
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach((dot) => {
        dot.y -= dot.speed;
        if (dot.y < 0) dot.y = 1;
        context.beginPath();
        context.globalAlpha = 0.22 + dot.radius * 0.08;
        context.fillStyle = ACCENT;
        context.arc(dot.x * canvas.width, dot.y * canvas.height, dot.radius, 0, Math.PI * 2);
        context.fill();
      });
      frame = window.requestAnimationFrame(draw);
    };

    frame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />;
}

export default function App() {
  const [rotation, setRotation] = useState(-18);
  const [autoRotate, setAutoRotate] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [selectedSwatch, setSelectedSwatch] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(1);

  useEffect(() => {
    if (!autoRotate) return;
    const timer = window.setInterval(() => setRotation((value) => (value + 2) % 360), 60);
    return () => window.clearInterval(timer);
  }, [autoRotate]);

  const swatch = SWATCHES[selectedSwatch];
  const plan = PLANS[selectedPlan];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-slate-900 text-white">
              <Box className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold tracking-tight">{BRAND}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold sm:flex" style={{ background: ACCENT_SOFT, color: ACCENT }}>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: ACCENT }} />
              {STAGE_LABEL}
            </span>
            <span className="rounded-lg bg-slate-900 px-3 py-1.5 text-[10px] font-semibold text-white">
              {PRIMARY_CTA}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-start lg:py-10">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 shadow-2xl shadow-slate-900/20">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-white">
            <div className="min-w-0">
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">{STAGE_LABEL}</p>
              <p className="mt-0.5 truncate text-xs font-medium">{OBJECT_META}</p>
            </div>
            <button
              onClick={() => setZoom((value) => (value > 1.05 ? 1 : 1.35))}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="relative flex h-[430px] items-center justify-center overflow-hidden">
            <ParticleField />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.14),transparent_65%)]" />
            <div className="absolute inset-8 rounded-full border border-white/10" />
            <div className="absolute inset-16 rounded-full border border-dashed border-white/10" />

            <div style={{ perspective: '1400px' }}>
              <motion.div
                animate={autoRotate ? { y: [0, -8, 0] } : { y: 0 }}
                transition={{ duration: 4.5, repeat: autoRotate ? Infinity : 0, ease: 'easeInOut' }}
              >
                <div
                  className="relative h-52 w-52"
                  style={{
                    transform:
                      'rotateX(-14deg) rotateY(' +
                      rotation +
                      'deg) scale(' +
                      zoom +
                      ')',
                    transformStyle: 'preserve-3d',
                    transition: autoRotate ? 'none' : 'transform 180ms ease-out',
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-[38px] border border-white/30 shadow-2xl"
                    style={{ background: swatch.gradient, transform: 'translateZ(32px)' }}
                  />
                  <div
                    className="absolute inset-6 rounded-[28px] border border-white/20"
                    style={{
                      background: swatch.gradient,
                      opacity: 0.85,
                      transform: 'translateZ(58px)',
                    }}
                  />
                  <div
                    className="absolute inset-x-10 bottom-0 h-6 rounded-full bg-black/40 blur-xl"
                    style={{ transform: 'translateZ(-18px)' }}
                  />
                  <span
                    className="absolute inset-0 grid place-items-center text-white/80"
                    style={{ transform: 'translateZ(72px)' }}
                  >
                    <Box className="h-14 w-14" strokeWidth={1.1} />
                  </span>
                </div>
              </motion.div>
            </div>

            <div className="absolute left-4 top-4 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white backdrop-blur">
              <p className="text-[8px] uppercase tracking-[0.16em] text-slate-400">Stage</p>
              <p className="mt-0.5 text-[11px] font-semibold">{OBJECT_LABEL}</p>
            </div>

            <div className="absolute inset-x-4 bottom-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 p-2 text-white backdrop-blur">
              <button
                onClick={() => setRotation((value) => (value - 15 + 360) % 360)}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <input
                type="range"
                min="0"
                max="360"
                value={rotation}
                onChange={(event) => setRotation(Number(event.target.value))}
                className="min-w-0 flex-1"
                style={{ accentColor: ACCENT }}
              />
              <button
                onClick={() => setRotation((value) => (value + 15) % 360)}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setRotation(-18)}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setAutoRotate((value) => !value)}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5"
              >
                {autoRotate ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={() => setZoom((value) => Math.max(0.75, Number((value - 0.1).toFixed(2))))}
                className="hidden h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 sm:grid"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setZoom((value) => Math.min(1.45, Number((value + 0.1).toFixed(2))))}
                className="hidden h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 sm:grid"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 border-t border-white/10 text-white">
            {METRICS.map(([value, label]) => (
              <div key={label} className="border-r border-white/10 px-4 py-3 last:border-r-0">
                <p className="text-sm font-semibold">{value}</p>
                <p className="mt-0.5 text-[9px] uppercase tracking-wide text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <div>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em]"
              style={{ background: ACCENT_SOFT, color: ACCENT }}
            >
              <Sparkles className="h-3 w-3" />
              {EYEBROW}
            </span>
            <h1 className="mt-4 break-words text-3xl font-semibold leading-[1.05] tracking-[-0.04em] text-slate-900 sm:text-4xl">
              {TITLE}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">{DESCRIPTION}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Configure finish</p>
                <p className="mt-0.5 text-xs font-medium text-slate-700">{swatch.name}</p>
              </div>
              <span className="h-7 w-7 rounded-full border border-slate-200" style={{ background: swatch.gradient }} />
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {SWATCHES.map((option, index) => (
                <button
                  key={option.name}
                  onClick={() => setSelectedSwatch(index)}
                  className={
                    'rounded-xl border p-2 text-left transition ' +
                    (selectedSwatch === index ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300')
                  }
                >
                  <span className="block h-8 w-full rounded-lg border border-white shadow-inner" style={{ background: option.gradient }} />
                  <span className="mt-1.5 block truncate text-[9px] font-semibold text-slate-600">{option.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-2.5">
            {PLANS.map((option, index) => (
              <button
                key={option.name}
                onClick={() => setSelectedPlan(index)}
                className={
                  'rounded-2xl border p-3.5 text-left transition ' +
                  (selectedPlan === index ? 'bg-slate-50' : 'bg-white hover:border-slate-300')
                }
                style={selectedPlan === index ? { borderColor: ACCENT, background: ACCENT_SOFT } : undefined}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-900">{option.name}</p>
                    <p className="mt-0.5 text-[10px] text-slate-500">{option.detail}</p>
                  </div>
                  <p className="text-sm font-semibold tracking-tight text-slate-900">{option.price}</p>
                </div>
                <ul className="mt-3 grid gap-1.5 sm:grid-cols-3">
                  {option.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-1.5 text-[10px] text-slate-600">
                      <Check className="h-3 w-3 shrink-0" style={{ color: ACCENT }} />
                      <span className="truncate">{perk}</span>
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-white transition hover:opacity-90"
              style={{ background: ACCENT }}
            >
              {PRIMARY_CTA} · {plan.name}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <span className="text-[11px] font-medium text-slate-500">{SECONDARY_CTA}</span>
          </div>
        </section>
      </main>
    </div>
  );
}`;
}

function generateAppFiles(prompt: string): Record<string, string> {
  const scenarioKey = detectScenario(prompt);
  const scenario = SCENARIOS[scenarioKey];
  const details = PROFILE_DETAILS[scenarioKey];
  const appSource =
    details.kind === 'dashboard'
      ? buildDashboardApp(prompt, scenario, details)
      : buildSpatialApp(prompt, scenario, details);

  return {
    '/App.tsx': appSource,
    '/components/HeroSection.tsx': scenario.hero,
    '/prisma/schema.prisma': scenario.schema,
    '/package.json': JSON.stringify(PREVIEW_DEPENDENCIES, null, 2),
  };
}

function createFileGroups(filePaths: string[]): Record<string, string[]> {
  return filePaths.reduce<Record<string, string[]>>((acc, path) => {
    const parts = path.split('/').filter(Boolean);
    const dir = parts.length > 1 ? '/' + parts.slice(0, -1).join('/') : '/';
    if (!acc[dir]) acc[dir] = [];
    acc[dir].push(path);
    return acc;
  }, {});
}

const FILE_ICONS: Record<string, LucideIcon> = {
  tsx: FileCode2,
  json: FileJson,
  prisma: Database,
};

interface WorkspaceShellProps extends Omit<CodeWorkspaceProps, 'onAiStatusChange'> {
  files: Record<string, string>;
  scenario: PromptScenario;
}

function WorkspaceShell({
  activeFile,
  onSelectFile,
  isBuilt,
  promptTitle,
  files,
  scenario,
}: WorkspaceShellProps) {
  const { sandpack } = useSandpack();
  const [tab, setTab] = useState<'preview' | 'code' | 'split'>('preview');
  const [copied, setCopied] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(true);
  const copyTimer = useRef<number | null>(null);
  const previousPrompt = useRef(promptTitle);
  const scenarioLabel = SCENARIO_LABELS[scenario];

  const fileList = Object.keys(files);
  const groups = createFileGroups(fileList);
  const orderedDirs = Object.keys(groups).sort((a, b) => {
    if (a === '/') return -1;
    if (b === '/') return 1;
    return a.localeCompare(b);
  });

  const sandpackFile = sandpack.activeFile;
  const currentCode = sandpack.files[sandpackFile]?.code ?? '';
  const currentStatus = sandpack.status;
  const isLive = currentStatus === 'running' || currentStatus === 'done';
  const isTimedOut = currentStatus === 'timeout';

  useEffect(() => {
    if (activeFile !== sandpack.activeFile && sandpack.files[activeFile]) {
      sandpack.openFile(activeFile);
    }
  }, [activeFile, sandpack]);

  useEffect(() => {
    if (previousPrompt.current !== promptTitle) {
      previousPrompt.current = promptTitle;
      setTab('preview');
    }
  }, [promptTitle]);

  useEffect(() => {
    return () => {
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
    };
  }, []);

  const handleCopy = () => {
    if (!currentCode) return;
    navigator.clipboard
      .writeText(currentCode)
      .then(() => {
        setCopied(true);
        if (copyTimer.current) window.clearTimeout(copyTimer.current);
        copyTimer.current = window.setTimeout(() => setCopied(false), 1800);
      })
      .catch(() => undefined);
  };

  const handleSelectFile = (file: string) => {
    onSelectFile(file);
    sandpack.openFile(file);
  };

  const statusLabel = isTimedOut
    ? 'runtime timeout'
    : isLive
    ? 'sandpack · compiled'
    : 'sandpack · compiling';

  const fileExplorer = (
    <div className="flex w-56 shrink-0 flex-col gap-1 overflow-y-auto border-r border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center gap-2 px-2 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
        <FolderTree className="h-3.5 w-3.5" />
        <span>Project Files</span>
      </div>
      {orderedDirs.map((dir) => (
        <div key={dir} className="space-y-1">
          <p className="truncate px-2 pt-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            {dir === '/' ? 'workspace' : dir.slice(1)}
          </p>
          {groups[dir].map((file) => {
            const extension = file.split('.').pop() ?? '';
            const Icon = FILE_ICONS[extension] ?? FileCode2;
            const isActive = sandpack.activeFile === file;
            return (
              <button
                key={file}
                onClick={() => handleSelectFile(file)}
                className={`flex w-full items-center gap-2.5 rounded-lg border px-2.5 py-1.5 text-left font-mono text-[11px] transition-all ${
                  isActive
                    ? 'border-blue-200 bg-blue-50 text-blue-700'
                    : 'border-transparent text-slate-600 hover:bg-white hover:text-slate-900'
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 shrink-0 ${
                    isActive ? 'text-blue-600' : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{file.split('/').pop()}</span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );

  const editorSurface = (
    <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white">
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
        <span className="truncate font-mono text-[11px] font-medium text-slate-700">
          {sandpack.activeFile}
        </span>
        <button
          onClick={handleCopy}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-slate-600 transition-all hover:border-blue-300 hover:text-blue-700"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-600" />
          ) : (
            <Copy className="h-3.5 w-3.5 text-slate-400" />
          )}
          <span>{copied ? 'Copied' : 'Copy Code'}</span>
        </button>
      </div>
      <div
        className="relative flex min-h-0 flex-1 flex-col"
        style={{ height: '100%', minHeight: '100%' }}
      >
        <SandpackLayout
          style={{
            height: '100%',
            width: '100%',
            minHeight: 0,
            border: 'none',
            borderRadius: 0,
            background: '#ffffff',
          }}
        >
          <SandpackCodeEditor
            showTabs
            showLineNumbers
            wrapContent
            style={{ height: '100%', width: '100%' }}
          />
        </SandpackLayout>
      </div>
    </div>
  );

  const previewSurface = (
    <div
      className={`flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white ${
        tab === 'split' ? 'border-l border-slate-200' : ''
      }`}
    >
      <div className="flex h-10 shrink-0 items-center gap-3 border-b border-slate-200 px-3.5">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
        </span>
        <span className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] text-slate-500">
          <Globe className="h-3 w-3 shrink-0 text-slate-400" />
          <span className="truncate font-mono">aetherforge.preview/{scenario}</span>
        </span>
        <span
          className={`hidden items-center gap-1.5 rounded-full border px-2 py-0.5 text-[9px] font-semibold sm:flex ${
            isTimedOut
              ? 'border-red-200 bg-red-50 text-red-600'
              : 'border-emerald-200 bg-emerald-50 text-emerald-600'
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isTimedOut ? 'bg-red-500' : 'animate-pulse bg-emerald-500'
            }`}
          />
          {isTimedOut ? 'Timeout' : 'Live'}
        </span>
      </div>
      <div className="relative min-h-0 w-full flex-1 overflow-hidden bg-white">
        <SandpackLayout
          style={{
            height: '100%',
            width: '100%',
            minHeight: 0,
            border: 'none',
            borderRadius: 0,
            background: '#ffffff',
          }}
        >
          <SandpackPreview
            showNavigator={false}
            showOpenInCodeSandbox={false}
            showRefreshButton={true}
            style={{ height: '100%', width: '100%', minHeight: 0 }}
          />
        </SandpackLayout>
      </div>
    </div>
  );

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-slate-50 text-slate-900">
      <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4">
        <div className="flex min-w-0 items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
          <button
            onClick={() => setTab('preview')}
            aria-pressed={tab === 'preview'}
            className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all ${
              tab === 'preview'
                ? 'bg-white text-[#0F172A] shadow-[0_1px_3px_rgba(15,23,42,0.12)]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">Live Interactive Preview</span>
            <span className="xl:hidden">Preview</span>
          </button>
          <button
            onClick={() => setTab('code')}
            aria-pressed={tab === 'code'}
            className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all ${
              tab === 'code'
                ? 'bg-white text-[#0F172A] shadow-[0_1px_3px_rgba(15,23,42,0.12)]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>Source Code</span>
          </button>
          <button
            onClick={() => setTab('split')}
            aria-pressed={tab === 'split'}
            className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all ${
              tab === 'split'
                ? 'bg-white text-[#0F172A] shadow-[0_1px_3px_rgba(15,23,42,0.12)]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Columns2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Split View</span>
            <span className="sm:hidden">Split</span>
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-600 lg:inline-flex">
            <Sparkles className="h-3 w-3" />
            {scenarioLabel}
          </span>
          <span
            className={`hidden font-mono text-[10px] xl:inline ${
              isTimedOut ? 'text-red-500' : 'text-slate-400'
            }`}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div
          className="flex shrink-0"
          style={{ display: tab === 'code' ? 'flex' : 'none' }}
        >
          {fileExplorer}
        </div>

        <div
          className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
          style={{ display: tab === 'preview' ? 'none' : 'flex' }}
        >
          {editorSurface}
        </div>

        <div
          className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
          style={{ display: tab === 'code' ? 'none' : 'flex' }}
        >
          {previewSurface}
        </div>
      </div>

      <div className="shrink-0 border-t border-slate-200 bg-white">
        <button
          onClick={() => setTerminalOpen(!terminalOpen)}
          className="flex h-9 w-full items-center justify-between px-4 font-mono text-[10px] text-slate-500 transition-colors hover:bg-slate-50"
        >
          <div className="flex items-center gap-2.5">
            <TerminalIcon className="h-3.5 w-3.5 text-blue-600" />
            <span className="font-semibold text-slate-700">Sandbox Console & CLI</span>
            <span
              className={`flex items-center gap-1.5 ${
                isTimedOut
                  ? 'text-red-500'
                  : isLive
                  ? 'text-emerald-600'
                  : 'text-slate-400'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isTimedOut
                    ? 'bg-red-500'
                    : isLive
                    ? 'bg-emerald-500'
                    : 'animate-pulse bg-slate-300'
                }`}
              />
              {isTimedOut
                ? 'sandpack runtime timed out'
                : isLive
                ? 'sandpack ready (live compile)'
                : 'bundling modules...'}
            </span>
          </div>
          {terminalOpen ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronUp className="h-3.5 w-3.5" />
          )}
        </button>

        {terminalOpen && (
          <div className="h-28 space-y-1 overflow-y-auto border-t border-slate-100 bg-slate-50 px-4 py-3 font-mono text-[10px] text-slate-500">
            <div>
              <span className="text-blue-600">$</span> aether-cli build --mode {scenario}
            </div>
            <div>
              <span className="text-emerald-600">✓</span> Sandpack attached Tailwind CDN + React TS
              template
            </div>
            <div>
              <span className="text-emerald-600">✓</span> Bundled {fileList.length} files ·{' '}
              /App.tsx · /components/HeroSection.tsx · /package.json
            </div>
            {isLive ? (
              <>
                <div>
                  <span className="text-emerald-600">✓</span> Live preview streaming · edits hot
                  reload instantly
                </div>
                <div className="text-emerald-600">
                  ➜ Preview: aetherforge.preview/{scenario} (Sandpack runtime active)
                </div>
              </>
            ) : isTimedOut ? (
              <div className="text-red-500">
                ▸ Runtime timeout. Check network access to the Sandpack bundler and press refresh.
              </div>
            ) : isBuilt ? (
              <div className="animate-pulse text-slate-400">
                ▸ Mounting the sandbox container and resolving dependencies...
              </div>
            ) : (
              <div className="animate-pulse text-slate-400">
                ▸ Assembling project bundle and connecting database schemas...
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

const DEPLOY_STEPS = [
  {
    label: 'Bundling production assets',
    detail: 'Compressing React, CSS, and Prisma artifacts',
  },
  {
    label: 'Provisioning edge SSL',
    detail: 'Issuing certificates across the AetherEdge network',
  },
  {
    label: 'Live on AetherEdge',
    detail: 'Routing traffic to the nearest edge region',
  },
];

interface DeployModalProps {
  open: boolean;
  step: number;
  url: string;
  copied: boolean;
  promptTitle: string;
  onCopy: () => void;
  onClose: () => void;
}

function DeployModal({
  open,
  step,
  url,
  copied,
  promptTitle,
  onCopy,
  onClose,
}: DeployModalProps) {
  if (!open) return null;

  const complete = step >= DEPLOY_STEPS.length;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-xs"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="deploy-modal-title"
        className="w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="h-1 w-full bg-slate-100">
          <div
            className="h-full bg-blue-600 transition-all duration-500"
            style={{ width: Math.min(step / DEPLOY_STEPS.length, 1) * 100 + '%' }}
          />
        </div>

        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-blue-600">
              <Globe className="h-3 w-3" />
              AetherEdge deployment
            </p>
            <h2 id="deploy-modal-title" className="mt-1 text-sm font-semibold text-slate-900">
              Deploy live
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close deployment dialog"
            className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="p-5">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Project
            </p>
            <p className="mt-0.5 truncate text-xs font-semibold text-slate-800">
              {promptTitle || 'AetherForge workspace'}
            </p>
          </div>

          <ol className="mt-5 space-y-3">
            {DEPLOY_STEPS.map((item, index) => {
              const isDone = complete || step > index;
              const isRunning = !complete && step === index;
              return (
                <li key={item.label} className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
                      isDone
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                        : isRunning
                        ? 'border-blue-200 bg-blue-50 text-blue-600'
                        : 'border-slate-200 bg-white text-slate-300'
                    }`}
                  >
                    {isDone ? (
                      <Check className="h-3 w-3" />
                    ) : isRunning ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p
                      className={`text-xs font-semibold ${
                        isDone ? 'text-slate-800' : isRunning ? 'text-blue-700' : 'text-slate-400'
                      }`}
                    >
                      {item.label}
                    </p>
                    <p className="mt-0.5 text-[10px] leading-relaxed text-slate-400">
                      {item.detail}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          {complete ? (
            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                  <Globe className="h-3 w-3" />
                  Live URL
                </p>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-semibold text-emerald-700">
                  Edge online
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-emerald-200 bg-white p-1.5 pl-3">
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="min-w-0 flex-1 truncate font-mono text-[10px] text-slate-700 transition hover:text-blue-700"
                >
                  {url.replace('https://', '')}
                </a>
                <button
                  type="button"
                  onClick={onCopy}
                  className="flex shrink-0 items-center gap-1 rounded-md bg-slate-900 px-2.5 py-1.5 text-[10px] font-semibold text-white transition hover:bg-slate-800"
                >
                  {copied ? (
                    <Check className="h-3 w-3 text-emerald-300" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  {copied ? 'Copied' : 'Copy URL'}
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-[11px] text-blue-700">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Deploying to the edge network...
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Close
          </button>
          {complete && (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-slate-800"
            >
              Open site
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

const CodeWorkspace = forwardRef<CodeWorkspaceHandle, CodeWorkspaceProps>(function CodeWorkspace(
  { activeFile, onSelectFile, isBuilt, promptTitle, onAiStatusChange },
  ref
) {
  const [files, setFiles] = useState<Record<string, string>>(() => generateAppFiles(promptTitle));
  const [deployOpen, setDeployOpen] = useState(false);
  const [deployStep, setDeployStep] = useState(0);
  const [deployCopied, setDeployCopied] = useState(false);

  useEffect(() => {
    const localFiles = generateAppFiles(promptTitle);
    setFiles(localFiles);
    onAiStatusChange('fallback', 'Local preview shown while Groq generates...');

    let cancelled = false;

    const generate = async () => {
      const result = await generateProjectFiles(promptTitle, () => localFiles);
      if (cancelled) return;
      setFiles(result.files);
      onAiStatusChange(result.source === 'groq' ? 'live' : 'fallback', result.error);
    };

    void generate();

    return () => {
      cancelled = true;
    };
  }, [promptTitle, onAiStatusChange]);

  useEffect(() => {
    if (!deployOpen) return;
    setDeployStep(0);
    setDeployCopied(false);
    const timers = [
      window.setTimeout(() => setDeployStep(1), 600),
      window.setTimeout(() => setDeployStep(2), 1200),
      window.setTimeout(() => setDeployStep(3), 1800),
    ];
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [deployOpen]);

  useEffect(() => {
    if (!deployCopied) return;
    const timer = window.setTimeout(() => setDeployCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [deployCopied]);

  const scenario = detectScenario(promptTitle);
  const deployUrl = createDeployUrl(promptTitle);

  const handleExportZip = async () => {
    try {
      const zip = new JSZip();
      const fileEntries = files as Record<string, string | { code?: string }>;

      Object.entries(fileEntries).forEach(([filePath, fileData]) => {
        if (filePath === '/package.json') return;
        const content = typeof fileData === 'string' ? fileData : fileData?.code ?? '';
        const cleanPath = getExportPath(filePath.replace(/^\/+/, ''));
        zip.file(cleanPath, content);
      });

      zip.file('package.json', JSON.stringify(EXPORT_PACKAGE_JSON, null, 2));
      zip.file('README.md', createExportReadme(promptTitle, SCENARIO_LABELS[scenario]));
      zip.file('index.html', EXPORT_INDEX_HTML);
      zip.file('vite.config.ts', EXPORT_VITE_CONFIG);
      zip.file('src/main.tsx', EXPORT_MAIN_SOURCE);
      zip.file('src/index.css', EXPORT_INDEX_CSS);

      const blob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.download = 'aetherforge-project.zip';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
    } catch (err) {
      console.error('Export failed:', err);
      throw err;
    }
  };

  const handleCopyDeployUrl = () => {
    navigator.clipboard
      .writeText(deployUrl)
      .then(() => setDeployCopied(true))
      .catch(() => undefined);
  };

  useImperativeHandle(ref, () => ({
    exportZip: handleExportZip,
    openDeployModal: () => setDeployOpen(true),
  }));

  return (
    <>
      <SandpackProvider
        template="react-ts"
        files={files}
        theme="light"
        customSetup={{
          dependencies: {
            'lucide-react': 'latest',
            'framer-motion': 'latest',
          },
        }}
        options={{
          activeFile: '/App.tsx',
          externalResources: ['https://cdn.tailwindcss.com'],
          recompileMode: 'immediate',
        }}
        className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-slate-50 text-slate-900"
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: '1 1 0%',
          height: '100%',
          minHeight: 0,
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        <WorkspaceShell
          activeFile={activeFile}
          onSelectFile={onSelectFile}
          isBuilt={isBuilt}
          promptTitle={promptTitle}
          files={files}
          scenario={scenario}
        />
      </SandpackProvider>

      <DeployModal
        open={deployOpen}
        step={deployStep}
        url={deployUrl}
        copied={deployCopied}
        promptTitle={promptTitle}
        onCopy={handleCopyDeployUrl}
        onClose={() => setDeployOpen(false)}
      />
    </>
  );
});

export default CodeWorkspace;
