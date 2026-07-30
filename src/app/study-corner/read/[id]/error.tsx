'use client';

import { useEffect } from 'react';

export default function ReadingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    try {
      localStorage.setItem('study_corner_last_error', JSON.stringify({
        message: error?.message || 'Unknown',
        stack: error?.stack || '',
        digest: error?.digest || '',
        time: new Date().toISOString(),
      }));
    } catch {}
  }, [error]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-8">
      <div className="max-w-lg w-full">
        <div className="p-6 rounded-2xl bg-red-950/30 border border-red-500/20">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h2 className="text-lg font-semibold text-red-400">Reading Error</h2>
          </div>
          <p className="text-sm text-red-300/70 mb-2">Something went wrong loading this book</p>
          <div className="p-3 rounded-xl bg-black/30 mb-4 overflow-auto max-h-[200px]">
            <p className="text-xs text-red-300/50 font-mono break-all leading-relaxed">
              {error?.message || 'Unknown error (no error message)'}
            </p>
            {error?.digest && (
              <p className="text-[10px] text-red-300/30 font-mono mt-2 break-all">
                Digest: {error.digest}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={reset}
              className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors"
            >
              Try Again
            </button>
            <a
              href="/study-corner"
              className="px-4 py-2 rounded-xl bg-white/[0.04] text-white/60 text-sm font-medium hover:bg-white/[0.08] transition-colors"
            >
              Back to Library
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
