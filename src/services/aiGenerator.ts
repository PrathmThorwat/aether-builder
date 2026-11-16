export type GenerationSource = 'groq' | 'local';
export type AiStatus = 'live' | 'fallback';

export interface GeneratedProject {
  files: Record<string, string>;
  source: GenerationSource;
  error?: string;
}

interface GroqMessagePart {
  text?: string;
}

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT =
  'You are an expert React + Tailwind CSS architect. Return ONLY a valid JSON object mapping root Sandpack file paths to complete React TypeScript code strings. Always put the main app in "/App.tsx" (NOT "/src/App.tsx"), with at most 1–2 optional helper components under "/components/". Do NOT include "/src/main.tsx" or "index.html". Use lucide-react icons and Tailwind CSS classes. Keep code concise, complete, and properly escaped so the JSON object closes cleanly.';

function getApiKey(): string | null {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY?.trim();
  return apiKey || null;
}

function readCompletionContent(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null;

  const choices = (payload as { choices?: unknown }).choices;
  if (!Array.isArray(choices) || choices.length === 0) return null;

  const firstChoice = choices[0];
  if (!firstChoice || typeof firstChoice !== 'object') return null;

  const message = (firstChoice as { message?: unknown }).message;
  if (!message || typeof message !== 'object') return null;

  const content = (message as { content?: unknown }).content;
  if (typeof content === 'string') return content;

  if (Array.isArray(content)) {
    const text = content
      .map((part) => {
        if (typeof part === 'string') return part;
        if (part && typeof part === 'object') {
          return (part as GroqMessagePart).text ?? '';
        }
        return '';
      })
      .join('');
    return text || null;
  }

  return null;
}

function stripMarkdownWrappers(value: string): string {
  let cleaned = value.replace(/```json/g, '').replace(/```/g, '').trim();

  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  return cleaned;
}

function normalizeFilePath(path: string): string {
  const normalized = path.trim().replace(/\\/g, '/');
  const withoutSrcPrefix = normalized.replace(/^\/?src\//, '/');
  const cleanPath = withoutSrcPrefix.replace(/^\.?\//, '').replace(/^\/+/, '');
  return cleanPath ? `/${cleanPath}` : '';
}

function readFileContent(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) return value;
  if (value && typeof value === 'object') {
    const code = (value as { code?: unknown }).code;
    if (typeof code === 'string' && code.trim()) return code;
  }
  return null;
}

function parseFileMap(content: string): Record<string, string> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(stripMarkdownWrappers(content));
  } catch (err) {
    console.error('Groq JSON Parse Error. Raw response:', content, err);
    const reason = err instanceof Error ? err.message : String(err);
    throw new Error(`JSON parse error: ${reason}`);
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Groq returned invalid JSON: expected a file map object');
  }

  const files: Record<string, string> = {};
  for (const [path, value] of Object.entries(parsed as Record<string, unknown>)) {
    const normalizedPath = normalizeFilePath(path);
    const fileContent = readFileContent(value);
    if (normalizedPath && fileContent) {
      files[normalizedPath] = fileContent;
    }
  }

  if (!files['/App.tsx']) {
    throw new Error('Groq response did not include /App.tsx');
  }

  return files;
}

const inflightGenerations = new Map<string, Promise<GeneratedProject>>();

export function generateProjectFiles(
  prompt: string,
  localFallback: () => Record<string, string>
): Promise<GeneratedProject> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return Promise.resolve({
      files: localFallback(),
      source: 'local',
      error: 'Missing VITE_GROQ_API_KEY in .env (restart dev server)',
    });
  }

  const existing = inflightGenerations.get(prompt);
  if (existing) return existing;

  const generation = generateWithGroq(prompt, apiKey, localFallback);
  inflightGenerations.set(prompt, generation);
  void generation.finally(() => {
    if (inflightGenerations.get(prompt) === generation) {
      inflightGenerations.delete(prompt);
    }
  });

  return generation;
}

async function generateWithGroq(
  prompt: string,
  apiKey: string,
  localFallback: () => Record<string, string>
): Promise<GeneratedProject> {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        max_completion_tokens: 8192,
        reasoning_effort: 'low',
        temperature: 0.4,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errText}`);
    }

    const payload: unknown = await response.json();
    const content = readCompletionContent(payload);
    if (!content) throw new Error('Groq returned an empty completion');

    const files = parseFileMap(content);

    return { files, source: 'groq' };
  } catch (err) {
    console.error('Groq API Error:', err);
    return {
      files: localFallback(),
      source: 'local',
      error: err instanceof Error ? err.message : String(err),
    };
  } finally {
    globalThis.clearTimeout(timeout);
  }
}
