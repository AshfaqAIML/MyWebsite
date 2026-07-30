'use client';

export default function ReadingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-8">
      <div className="max-w-lg w-full">
        <div className="p-6 rounded-2xl bg-red-950/30 border border-red-500/20">
          <h2 className="text-lg font-semibold text-red-400 mb-2">Reading Error</h2>
          <p className="text-sm text-red-300/70 mb-4 font-mono break-all">
            {error.message || 'Something went wrong loading this book'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={reset}
              className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20 transition-colors"
            >
              Try Again
            </button>
            <a
              href="/study-corner"
              className="px-4 py-2 rounded-xl bg-white/[0.04] text-white/60 text-sm hover:bg-white/[0.08] transition-colors"
            >
              Back to Library
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
