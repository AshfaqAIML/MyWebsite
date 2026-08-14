"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { PaymentModal } from "@/components/ui/payment-modal";
import { X, LogIn } from "lucide-react";

function AuthPrompt({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = () => {
    window.location.href = `/api/auth/signin/google?callbackUrl=${encodeURIComponent(window.location.href)}`;
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { signIn } = await import("next-auth/react");
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.ok) {
        onClose();
      } else {
        setError("Invalid email or password");
      }
    } catch {
      setError("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden p-6">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          <X className="h-4 w-4 text-zinc-500" />
        </button>
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Welcome back</h2>
          <p className="text-sm text-zinc-500 mt-1">Sign in to continue your journey</p>
        </div>
        <form onSubmit={handleEmailSignIn} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password"
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={() => { onClose(); window.location.href = "/dashboard/login/forgot-password"; }}
              className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Forgot password?</button>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button type="submit" disabled={loading || !email || !password}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-opacity">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200 dark:border-zinc-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-zinc-900 px-2 text-zinc-400">Or</span>
          </div>
        </div>
        <button onClick={handleGoogleSignIn} type="button"
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
          <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>
        <p className="text-center mt-4 text-xs text-zinc-400">
          Don&apos;t have an account?{" "}
          <button type="button" onClick={() => { onClose(); window.location.href = "/dashboard/login"; }}
            className="text-blue-500 hover:text-blue-600 transition-colors font-medium">Sign up</button>
        </p>
      </div>
    </div>
  );
}

function PDFReader() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const fileParam = searchParams.get("file");
  const paid = searchParams.get("paid") === "true";
  const bookTitle = searchParams.get("title") || "Study Corner Book";
  const { data: session } = useSession();
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPay, setShowPay] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const handlePayClick = () => {
    if (!session) setShowAuth(true);
    else setShowPay(true);
  };

  useEffect(() => {
    if (!fileParam) {
      const t = setTimeout(() => {
        setError("No file specified");
        setLoading(false);
      }, 0);
      return () => clearTimeout(t);
    }

    let cancelled = false;

    const loadPDF = async () => {
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        const response = await fetch(
          `/api/books/pdf?file=${encodeURIComponent(fileParam)}&mode=read`
        );
        if (!response.ok) {
          if (response.status === 401) {
            router.push("/dashboard/login");
            return;
          }
          throw new Error("Failed to load PDF");
        }

        const arrayBuffer = await response.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        if (cancelled) return;

        const container = containerRef.current;
        if (!container) return;

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });

          const canvas = document.createElement("canvas");
          canvas.style.margin = "0 auto 16px";
          canvas.style.display = "block";
          canvas.style.maxWidth = "100%";
          canvas.style.boxShadow = "0 2px 8px rgba(0,0,0,0.12)";
          canvas.style.borderRadius = "4px";
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({ canvas, viewport, background: "white" }).promise;
          container.appendChild(canvas);
        }

        setLoading(false);
      } catch {
        if (!cancelled) {
          setError("Failed to load PDF");
          setLoading(false);
        }
      }
    };

    loadPDF();

    return () => {
      cancelled = true;
    };
  }, [fileParam, router]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (e.target instanceof HTMLCanvasElement) {
        e.preventDefault();
      }
    };
    document.addEventListener("contextmenu", handler);
    return () => document.removeEventListener("contextmenu", handler);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const downloadUrl = `/api/books/pdf?file=${encodeURIComponent(fileParam || "")}&mode=download`;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8 px-4">
      {paid && (
        <div className="max-w-4xl mx-auto mb-6 p-4 rounded-2xl border-2 border-amber-200 dark:border-amber-700/50 bg-amber-50 dark:bg-amber-900/10 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-medium text-sm text-amber-800 dark:text-amber-300">Study Corner Book</p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">Pay &amp; download this book to support the creator.</p>
          </div>
          <button
            onClick={handlePayClick}
            className="shrink-0 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-medium hover:bg-amber-700 transition-colors"
          >
            Pay &amp; Download
          </button>
        </div>
      )}
      {loading && (
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-zinc-500 dark:text-zinc-400">Loading PDF...</p>
          </div>
        </div>
      )}
      <div ref={containerRef} className="max-w-4xl mx-auto" />

      {showAuth && <AuthPrompt onClose={() => setShowAuth(false)} />}
      <PaymentModal
        open={showPay}
        onClose={() => setShowPay(false)}
        bookTitle={bookTitle}
        pdfUrl={downloadUrl}
      />
    </div>
  );
}

export default function PDFReaderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      }
    >
      <PDFReader />
    </Suspense>
  );
}
