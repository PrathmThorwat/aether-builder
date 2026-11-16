import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { motion } from 'framer-motion';
import {
  Check,
  CheckCircle2,
  CreditCard,
  Database,
  Globe,
  LayoutDashboard,
  Play,
  Rocket,
  Server,
  Settings,
  Sparkles,
  Terminal,
  Users,
  Zap,
} from 'lucide-react';
import * as THREE from 'three';

function MockupShell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_32px_-14px_rgba(15,23,42,0.14)]">
      <div className="flex h-9 items-center gap-2 border-b border-slate-200 bg-slate-50 px-3.5">
        <span className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-slate-300" />
          <span className="h-2 w-2 rounded-full bg-slate-300" />
          <span className="h-2 w-2 rounded-full bg-slate-300" />
        </span>
        <span className="mx-auto truncate font-mono text-[10px] text-slate-400">{label}</span>
        <span className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-emerald-600">
          <span className="h-1 w-1 rounded-full bg-emerald-500" />
          live
        </span>
      </div>
      {children}
    </div>
  );
}

function MiniDodecahedron({ tone }: { tone: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.28;
      meshRef.current.rotation.x = t * 0.1;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y = -t * 0.16;
      wireRef.current.rotation.x = -t * 0.08;
    }
  });

  return (
    <group>
      <Float speed={1.6} rotationIntensity={0.45} floatIntensity={0.8}>
        <mesh ref={meshRef}>
          <dodecahedronGeometry args={[1.02, 0]} />
          <meshPhysicalMaterial
            color={tone}
            metalness={0.3}
            roughness={0.32}
            clearcoat={1}
            clearcoatRoughness={0.2}
            envMapIntensity={0.9}
          />
        </mesh>
      </Float>
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[1.55, 0]} />
        <meshBasicMaterial color="#2563eb" wireframe transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

const TONES = [
  { name: 'Silver', value: '#cbd5e1' },
  { name: 'Graphite', value: '#64748b' },
  { name: 'Cobalt', value: '#2563eb' },
];

export function SpatialMockup() {
  const [tone, setTone] = useState(TONES[0].value);

  return (
    <MockupShell label="aether.studio / spatial-viewer">
      <div className="relative h-[300px] overflow-hidden bg-gradient-to-b from-slate-50 to-white sm:h-[340px]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(circle_at_50%_45%,#000,transparent_78%)]" />
        <div className="absolute inset-0">
          <Canvas camera={{ position: [0, 0, 4.8], fov: 42 }} gl={{ alpha: true, antialias: true }} dpr={[1, 1.6]}>
            <ambientLight intensity={1.2} />
            <hemisphereLight args={['#ffffff', '#e2e8f0', 0.9]} />
            <directionalLight position={[5, 6, 4]} intensity={2.4} color="#ffffff" />
            <directionalLight position={[-4, -2, 3]} intensity={0.7} color="#dbeafe" />
            <MiniDodecahedron tone={tone} />
          </Canvas>
        </div>

        <div className="pointer-events-none absolute left-3.5 top-3.5 flex items-center gap-1.5 rounded-full border border-blue-100 bg-white/95 px-2.5 py-1 shadow-sm backdrop-blur">
          <Sparkles className="h-3 w-3 text-blue-600" />
          <span className="text-[9px] font-bold uppercase tracking-wider text-blue-600">
            3D preview
          </span>
        </div>
        <div className="pointer-events-none absolute right-3.5 top-3.5 rounded-full border border-slate-200 bg-white/95 px-2.5 py-1 font-mono text-[9px] text-slate-500 shadow-sm backdrop-blur">
          60 fps
        </div>

        <div className="absolute right-3.5 top-1/2 flex -translate-y-1/2 flex-col gap-2">
          {TONES.map((option) => (
            <button
              key={option.name}
              onClick={() => setTone(option.value)}
              aria-label={`Set ${option.name} finish`}
              className={`h-5 w-5 rounded-full border transition-all duration-300 hover:scale-110 ${
                tone === option.value
                  ? 'border-white ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-50'
                  : 'border-slate-200'
              }`}
              style={{ backgroundColor: option.value }}
            />
          ))}
        </div>

        <div className="absolute inset-x-3.5 bottom-3.5 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/95 p-3 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.18)] backdrop-blur-xl">
          <div className="min-w-0">
            <p className="truncate text-[10px] font-bold uppercase tracking-[0.14em] text-slate-800">
              Aether Chrono One
            </p>
            <p className="mt-0.5 text-[10px] text-slate-500">
              {TONES.find((option) => option.value === tone)?.name} finish · 1 of 250
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="shrink-0 rounded-lg bg-[#0B192C] px-3 py-2 text-[10px] font-semibold text-white"
          >
            Add to bag · $1,240
          </motion.button>
        </div>
      </div>
    </MockupShell>
  );
}

const CHART_PATH =
  'M0 74 C 24 70, 30 52, 52 56 S 84 66, 104 44 S 138 38, 158 46 S 192 20, 214 26 S 250 8, 276 16';

export function FullStackMockup() {
  return (
    <MockupShell label="aether.studio / revenue-ops">
      <div className="flex h-[300px] bg-white sm:h-[340px]">
        <aside className="flex w-12 flex-col items-center gap-2 border-r border-slate-200 bg-slate-50 py-4">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#0B192C] text-white">
            <LayoutDashboard className="h-3.5 w-3.5" />
          </span>
          {[CreditCard, Users, Settings].map((Icon, index) => (
            <span
              key={index}
              className="grid h-7 w-7 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-white hover:text-blue-600"
            >
              <Icon className="h-3.5 w-3.5" />
            </span>
          ))}
        </aside>

        <div className="min-w-0 flex-1 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Revenue overview
              </p>
              <p className="mt-1 font-display text-lg font-bold tracking-[-0.02em] text-slate-900">
                $128,420
              </p>
            </div>
            <span className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700">
              <Zap className="h-2.5 w-2.5" />
              +18.2%
            </span>
          </div>

          <div className="relative mt-3 h-24 rounded-xl border border-slate-200 bg-white p-2">
            <svg viewBox="0 0 276 84" className="h-full w-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.14" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={`${CHART_PATH} L 276 84 L 0 84 Z`} fill="url(#chartFill)" />
              <motion.path
                d={CHART_PATH}
                fill="none"
                stroke="#2563eb"
                strokeWidth="1.6"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.8, ease: 'easeInOut' }}
              />
            </svg>
            <div className="absolute left-2 top-2 flex items-center gap-1 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[8px] font-mono text-slate-500">
              <span className="h-1 w-1 rounded-full bg-blue-600" />
              realtime
            </div>
          </div>

          <div className="mt-3 space-y-1.5">
            {[
              { name: 'Enterprise plan · Northwind', amount: '+$4,200' },
              { name: 'Seat expansion · Lumen Labs', amount: '+$1,860' },
              { name: 'Usage overage · Helix', amount: '+$740' },
            ].map((row, index) => (
              <motion.div
                key={row.name}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between rounded-lg border border-slate-100 bg-white px-2.5 py-1.5"
              >
                <span className="truncate text-[10px] text-slate-500">{row.name}</span>
                <span className="shrink-0 font-mono text-[10px] font-semibold text-emerald-600">
                  {row.amount}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </MockupShell>
  );
}

function SchemaNode({
  name,
  fields,
  highlight = false,
}: {
  name: string;
  fields: [string, string][];
  highlight?: boolean;
}) {
  return (
    <div
      className={`w-full rounded-lg border p-2.5 ${
        highlight
          ? 'border-blue-200 bg-blue-50/70 shadow-[0_2px_12px_-6px_rgba(37,99,235,0.35)]'
          : 'border-slate-200 bg-white'
      }`}
    >
      <div className="mb-1.5 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
        <Database className={`h-3 w-3 ${highlight ? 'text-blue-600' : 'text-slate-400'}`} />
        <span className="truncate text-[9px] font-bold uppercase tracking-wider text-slate-700">
          {name}
        </span>
      </div>
      <div className="space-y-1">
        {fields.map(([field, type]) => (
          <div key={field} className="flex items-center justify-between gap-2 text-[8px]">
            <span className="truncate font-mono text-slate-500">{field}</span>
            <span className="shrink-0 font-mono text-slate-400">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Connector() {
  return (
    <div className="relative h-px w-6 shrink-0 bg-slate-200 sm:w-8">
      <motion.span
        className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-blue-600"
        animate={{ left: ['0%', '100%'] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

export function DatabaseMockup() {
  return (
    <MockupShell label="aether.studio / prisma-schema">
      <div className="flex h-[300px] flex-col bg-white sm:h-[340px]">
        <div className="flex flex-1 items-center justify-center gap-1 px-3 py-4">
          <SchemaNode
            name="User"
            fields={[
              ['id', 'cuid'],
              ['email', 'string'],
              ['role', 'enum'],
            ]}
          />
          <Connector />
          <SchemaNode
            name="WorkspaceSession"
            highlight
            fields={[
              ['id', 'cuid'],
              ['mode', 'DUAL'],
              ['prompt', 'text'],
              ['ownerId', '→ User'],
            ]}
          />
          <Connector />
          <SchemaNode
            name="Deployment"
            fields={[
              ['id', 'cuid'],
              ['region', 'string'],
              ['status', 'enum'],
            ]}
          />
        </div>

        <div className="border-t border-slate-200 bg-slate-50 px-3.5 py-2.5">
          <div className="flex items-center justify-between font-mono text-[9px]">
            <span className="text-slate-500">
              <span className="text-blue-600">$</span> prisma migrate dev
            </span>
            <span className="flex items-center gap-1 text-emerald-600">
              <CheckCircle2 className="h-3 w-3" />
              applied 4 migrations
            </span>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-200">
            <motion.div
              className="h-full rounded-full bg-blue-600"
              initial={{ width: '8%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.2, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </div>
    </MockupShell>
  );
}

const SANDBOX_LINES = [
  { text: '$ npx aether-cli dev', tone: 'text-slate-800' },
  { text: '◇ browser runtime · booting WebContainer', tone: 'text-slate-400' },
  { text: '✓ vite v6.0 ready in 412ms', tone: 'text-emerald-600' },
  { text: '✓ PostgreSQL schema connected', tone: 'text-emerald-600' },
  { text: '➜ Local: http://localhost:5173', tone: 'text-blue-600' },
];

export function SandboxMockup() {
  return (
    <MockupShell label="aether.studio / live-sandbox">
      <div className="flex h-[300px] bg-white sm:h-[340px]">
        <div className="flex min-w-0 flex-1 flex-col border-r border-slate-200">
          <div className="flex h-8 items-center gap-2 border-b border-slate-200 bg-slate-50 px-3">
            <Terminal className="h-3 w-3 text-slate-400" />
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
              Console
            </span>
            <span className="ml-auto flex items-center gap-1 font-mono text-[8px] text-emerald-600">
              <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-500" />
              webcontainer
            </span>
          </div>
          <div className="flex-1 space-y-2 overflow-hidden p-3 font-mono text-[9px] leading-relaxed">
            {SANDBOX_LINES.map((line, index) => (
              <motion.p
                key={line.text}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.2 + index * 0.16 }}
                className={line.tone}
              >
                {line.text}
              </motion.p>
            ))}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
              className="inline-block h-3 w-1.5 bg-slate-800"
            />
          </div>
          <div className="border-t border-slate-100 px-3 py-2">
            <div className="relative h-1 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className="absolute inset-y-0 w-1/3 rounded-full bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                animate={{ x: ['-120%', '420%'] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </div>
        </div>

        <div className="hidden w-[42%] flex-col bg-slate-50 p-3 sm:flex">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Preview
            </span>
            <Play className="h-3 w-3 text-blue-600" />
          </div>
          <div className="flex flex-1 flex-col gap-2 rounded-lg border border-slate-200 bg-white p-2.5">
            <div className="h-2 w-2/3 rounded bg-slate-200" />
            <div className="h-1.5 w-1/2 rounded bg-slate-100" />
            <div className="mt-auto grid grid-cols-2 gap-1.5">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.4, repeat: Infinity }}
                className="h-10 rounded-md border border-blue-100 bg-blue-50"
              />
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2.4, repeat: Infinity }}
                className="h-10 rounded-md border border-slate-200 bg-slate-50"
              />
            </div>
            <div className="h-1.5 w-3/4 rounded bg-slate-100" />
            <div className="flex items-center gap-1 text-[8px] font-mono text-emerald-600">
              <CheckCircle2 className="h-2.5 w-2.5" />
              rendered in 412ms
            </div>
          </div>
        </div>
      </div>
    </MockupShell>
  );
}

const DEPLOY_STEPS = [
  { label: 'Build', icon: Zap },
  { label: 'Containerize', icon: Server },
  { label: 'Edge deploy', icon: Rocket },
  { label: 'Live', icon: Globe },
];

export function DeployMockup() {
  return (
    <MockupShell label="aether.studio / deploy">
      <div className="flex h-[300px] flex-col bg-white p-4 sm:h-[340px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-600">
              Production live
            </span>
          </div>
          <span className="font-mono text-[9px] text-slate-400">42ms cold start</span>
        </div>

        <div className="mt-4 flex items-center">
          {DEPLOY_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === DEPLOY_STEPS.length - 1;
            return (
              <div key={step.label} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-full border ${
                      isLast
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                        : 'border-slate-200 bg-white text-blue-600'
                    }`}
                  >
                    {isLast ? <Check className="h-4 w-4" /> : <Icon className="h-3.5 w-3.5" />}
                  </span>
                  <span className="whitespace-nowrap text-[8px] font-medium text-slate-500">
                    {step.label}
                  </span>
                </div>
                {!isLast && (
                  <div className="relative mx-1 mb-4 h-px flex-1 overflow-hidden bg-slate-200">
                    <motion.div
                      className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                      animate={{ x: ['-100%', '250%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <Globe className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span className="truncate font-mono text-[10px] text-slate-700">
                aether-commerce.edge.app
              </span>
            </div>
            <span className="shrink-0 rounded-full border border-emerald-200 bg-white px-2 py-0.5 text-[8px] font-bold text-emerald-600">
              200 OK
            </span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { region: 'iad1', latency: '18ms' },
              { region: 'fra1', latency: '24ms' },
              { region: 'sin1', latency: '31ms' },
            ].map((edge) => (
              <div
                key={edge.region}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1.5"
              >
                <p className="font-mono text-[8px] uppercase tracking-wider text-slate-400">
                  {edge.region}
                </p>
                <p className="mt-0.5 font-mono text-[10px] text-slate-700">{edge.latency}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between text-[9px] text-slate-400">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            12 checks passed
          </span>
          <span className="font-mono">build #2,481 · 6.2s</span>
        </div>
      </div>
    </MockupShell>
  );
}
