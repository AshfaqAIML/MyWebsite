'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Play, Zap, FileText, FileDown, Code2, ArrowRight, Loader2,
  CheckCircle2, Copy, Check, Video, Network, X,
} from 'lucide-react';
import Link from 'next/link';

function extractVideoId(input: string): string {
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  if (trimmed.includes('youtu.be/')) return trimmed.split('youtu.be/')[1].split('?')[0];
  if (trimmed.includes('watch?v=')) return trimmed.split('watch?v=')[1].split('&')[0];
  if (trimmed.includes('/shorts/')) return trimmed.split('/shorts/')[1].split('?')[0];
  if (trimmed.includes('/embed/')) return trimmed.split('/embed/')[1].split('?')[0];
  return trimmed;
}

const features = [
  { icon: Zap, title: 'Lightning Fast Parsing', desc: 'Direct instance mapping fetches target captions efficiently, bypassing legacy wrapper errors.', color: 'text-red-500', bg: 'bg-red-500/10' },
  { icon: FileDown, title: 'Dual Format Export', desc: 'Compile raw string outputs into clean .txt documents or styled Microsoft Word .docx reports.', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { icon: Network, title: 'Seamless API Integration', desc: 'Easily mountable JSON endpoints designed to plug straight into custom frontends and workflows.', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { icon: Code2, title: 'Developer-First Design', desc: 'Clean, documented responses with structured JSON payloads ready for any client framework.', color: 'text-violet-500', bg: 'bg-violet-500/10' },
  { icon: FileText, title: 'Rich Text Formatting', desc: 'Auto-generated Word documents with headings, proper paragraphs, and clean typography.', color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { icon: Video, title: 'Full Language Support', desc: 'Fetch transcripts in any available language with automatic fallback to video default captions.', color: 'text-rose-500', bg: 'bg-rose-500/10' },
];

const codeSnippets = [
  {
    label: 'Express.js',
    code: "fetch('/api/youtube/transcript', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ video_id: 'dQw4w9WgXcQ' })\n})",
  },
  {
    label: 'Python',
    code: "import requests\n\nresponse = requests.post(\n  'http://localhost:3000/api/youtube/transcript',\n  json={ 'video_id': 'dQw4w9WgXcQ' }\n)\nprint(response.json())",
  },
  {
    label: 'cURL',
    code: "curl -X POST http://localhost:3000/api/youtube/transcript \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"video_id\": \"dQw4w9WgXcQ\"}'",
  },
];

interface TranscriptResult {
  success: boolean;
  message?: string;
  error?: string;
  video_id?: string;
  total_segments?: number;
  languages?: string[];
}

function FeatureCard({ f, index, isInView }: { f: typeof features[0]; index: number; isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-zinc-900/50 border border-zinc-800/80 p-8 rounded-2xl hover:border-zinc-700 transition-colors group"
    >
      <div className={["w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-6 group-hover:scale-110 transition-transform", f.bg, f.color].join(' ')}>
        <f.icon className="h-5 w-5" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
      <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
    </motion.div>
  );
}

function SnippetTabs({ active, onChange, code, onCopy, copied }: {
  active: number; onChange: (i: number) => void; code: string; onCopy: () => void; copied: boolean;
}) {
  return (
    <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-800">
        <div className="flex gap-1">
          {codeSnippets.map((s, i) => (
            <button
              key={s.label}
              onClick={() => onChange(i)}
              className={["px-3 py-1.5 text-xs font-medium rounded-lg transition-colors", active === i ? 'bg-red-600 text-white' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800'].join(' ')}
            >
              {s.label}
            </button>
          ))}
        </div>
        <button onClick={onCopy} className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-300 transition-colors">
          {copied ? <><Check className="h-3 w-3" /> Copied</> : <><Copy className="h-3 w-3" /> Copy</>}
        </button>
      </div>
      <pre className="px-6 py-5 text-sm text-zinc-300 font-mono bg-zinc-950 overflow-x-auto whitespace-pre">{code}</pre>
    </div>
  );
}

export default function YouTubeDevPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TranscriptResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeSnippet, setActiveSnippet] = useState(0);
  const [codeCopied, setCodeCopied] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const docsRef = useRef<HTMLElement>(null);
  const heroInView = useInView(heroRef, { once: true });
  const featuresInView = useInView(featuresRef, { once: true, margin: '-100px' });
  const docsInView = useInView(docsRef, { once: true, margin: '-100px' });

  async function handleExtract() {
    const videoId = extractVideoId(input);
    if (!videoId || videoId.length < 5) {
      setResult({ success: false, error: 'Please enter a valid YouTube Video ID or URL.' });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/youtube/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_id: videoId }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ success: false, error: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  function handleCopyMessage() {
    if (result?.message) {
      navigator.clipboard.writeText(result.message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleCopyCode() {
    navigator.clipboard.writeText(codeSnippets[activeSnippet].code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-red-500 selection:text-white">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-zinc-950/80 border-b border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-xl">
              <Play className="h-5 w-5 text-white fill-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              YouTube Dev
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#playground" className="hover:text-white transition-colors">Playground</a>
            <a href="#docs" className="hover:text-white transition-colors">Docs</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="#playground" className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg shadow-red-600/20 transition-colors">
              Get Started
            </a>
            <Link href="/" className="text-zinc-500 dark:text-zinc-400 hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      <section ref={heroRef} className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-zinc-950/0 to-zinc-950/0 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center">
            <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5 mb-8 text-xs font-medium text-red-400">
              <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span>v2.0 Transcript Engine</span>
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
              {'Extract & Automate '}
              <br className="hidden sm:block" />
              {'YouTube Transcripts '}
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">At Scale</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              A high-performance processing module built for developers. Parse video subtitles, format data, and export directly to TXT and Word documents.
            </p>
          </motion.div>

          <motion.div id="playground" initial={{ opacity: 0, y: 40 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }} className="mt-12 max-w-2xl mx-auto">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl shadow-black/40">
              <label className="block text-sm font-semibold text-zinc-300 mb-3">
                <Video className="inline h-4 w-4 text-red-500 mr-2" />
                Enter YouTube Video ID or URL
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text" value={input} onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleExtract(); }}
                  placeholder="e.g., dQw4w9WgXcQ or https://youtube.com/watch?v=..."
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all text-sm"
                />
                <button onClick={handleExtract} disabled={loading || !input.trim()}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 shrink-0">
                  {loading ? (<><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>) : (<>Process <ArrowRight className="h-4 w-4" /></>)}
                </button>
              </div>
              <p className="mt-3 text-[11px] text-zinc-600 dark:text-zinc-400">Supports full URLs, shorts, embeds, and raw 11-character video IDs.</p>

              <AnimatePresence mode="wait">
                {result && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-4">
                    {result.success ? (
                      <div className="space-y-3">
                        <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-800/50 text-emerald-300 text-sm">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-emerald-400" />
                            <div>
                              <p className="font-semibold text-emerald-300">Transcript extracted!</p>
                              <p className="text-emerald-400/80 text-xs mt-1">
                                {result.total_segments} segments found
                                {result.languages && result.languages.length > 0 && (' in ' + result.languages.join(', '))}
                                {' '}&middot; Video: {result.video_id}
                              </p>
                            </div>
                          </div>
                        </div>
                        {result.message && (
                          <div className="rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800">
                              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Transcript Preview</span>
                              <div className="flex gap-2">
                                <button onClick={handleCopyMessage} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors">
                                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                  {copied ? 'Copied' : 'Copy'}
                                </button>
                                <button onClick={() => {
                                  const blob = new Blob([result.message!], { type: 'text/plain' });
                                  const url = URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.href = url;
                                  a.download = 'transcript_' + (result.video_id || 'video') + '.txt';
                                  a.click();
                                  URL.revokeObjectURL(url);
                                }} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors">
                                  <FileDown className="h-3 w-3" />
                                  .txt
                                </button>
                              </div>
                            </div>
                            <p className="px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-h-32 overflow-y-auto">{result.message}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-red-950/50 border border-red-800/50 text-red-300 text-sm flex items-start gap-2">
                        <div className="shrink-0 mt-0.5 w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-[10px] font-bold">!</div>
                        <div>
                          <p className="font-semibold text-red-300">Error</p>
                          <p className="text-red-400/80 text-xs mt-1">{result.error}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" ref={featuresRef} className="py-20 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={featuresInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white tracking-tight">Engineered for Reliability</h2>
            <p className="mt-4 text-zinc-500 dark:text-zinc-400">Everything you need to integrate robust transcript harvesting pipelines into your application stack.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <FeatureCard key={f.title} f={f} index={i} isInView={featuresInView} />
            ))}
          </div>
        </div>
      </section>

      <section id="docs" ref={docsRef} className="py-20 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={docsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white tracking-tight">API Reference</h2>
            <p className="mt-4 text-zinc-500 dark:text-zinc-400">A single POST endpoint on your Flask server. No authentication required.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={docsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="max-w-3xl mx-auto">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-3">
                <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-lg">POST</span>
                <code className="text-sm text-zinc-300 font-mono">{'{BACKEND_URL}/get-transcript'}</code>
              </div>
              <div className="px-6 py-4 border-b border-zinc-800">
                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Request Body</p>
                <pre className="text-sm text-zinc-300 font-mono bg-zinc-950 rounded-xl p-4 overflow-x-auto whitespace-pre">{`{\n  "video_id": "dQw4w9WgXcQ"\n}`}</pre>
              </div>
              <div className="px-6 py-4 border-b border-zinc-800">
                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Success Response</p>
                <pre className="text-sm text-emerald-300/80 font-mono bg-zinc-950 rounded-xl p-4 overflow-x-auto whitespace-pre">{`{\n  "success": true,\n  "message": "Transcript successfully generated and compiled.",\n  "txt_path": ".../transcript_dQw4w9WgXcQ.txt",\n  "docx_path": ".../transcript_dQw4w9WgXcQ.docx"\n}`}</pre>
              </div>
              <div className="px-6 py-4">
                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Error Response</p>
                <pre className="text-sm text-red-300/80 font-mono bg-zinc-950 rounded-xl p-4 overflow-x-auto whitespace-pre">{`{\n  "success": false,\n  "error": "No video_id provided"\n}`}</pre>
              </div>
            </div>

            <SnippetTabs
              active={activeSnippet}
              onChange={setActiveSnippet}
              code={codeSnippets[activeSnippet].code}
              onCopy={handleCopyCode}
              copied={codeCopied}
            />
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-zinc-900 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-sm">
            <Play className="h-4 w-4 fill-zinc-500" />
            <span>YouTube Dev Module</span>
            <span className="text-zinc-700 mx-1">|</span>
            <span>{'\u00A9'} {new Date().getFullYear()}</span>
          </div>
          <Link href="/" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-white transition-colors flex items-center gap-1">
            {'Back to Portfolio '}<ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
