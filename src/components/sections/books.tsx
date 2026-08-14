"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Download, BookOpen, BookMarked, Star, ShoppingCart, Clock, X, Search, Bookmark, Share2, Check } from "lucide-react";
import { Section, SectionGrid } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getBooks } from "@/lib/data";
import type { Book } from "@/lib/types";
import { PaymentModal } from "@/components/ui/payment-modal";
import { useSession } from "next-auth/react";
import studyBooksData from "../../../data/study-books.json";
import { cn } from "@/lib/utils";

const comingSoonTitles = new Set([
  "Python for Data Analytics",
  "SQL Mastery",
  "Power BI: From Data to Dashboard",
  "Machine Learning Engineering",
  "Generative AI & LLMs",
  "Full Stack Development with Next.js",
]);

const categoryColors: Record<string, { gradient: string; border: string }> = {
  Python: { gradient: "from-blue-500/10 to-blue-600/5 dark:from-blue-500/20", border: "border-blue-200/50 dark:border-blue-700/30" },
  SQL: { gradient: "from-green-500/10 to-green-600/5 dark:from-green-500/20", border: "border-green-200/50 dark:border-green-700/30" },
  "Power BI": { gradient: "from-yellow-500/10 to-yellow-600/5 dark:from-yellow-500/20", border: "border-yellow-200/50 dark:border-yellow-700/30" },
  "Machine Learning": { gradient: "from-purple-500/10 to-purple-600/5 dark:from-purple-500/20", border: "border-purple-200/50 dark:border-purple-700/30" },
  "Generative AI": { gradient: "from-pink-500/10 to-pink-600/5 dark:from-pink-500/20", border: "border-pink-200/50 dark:border-pink-700/30" },
  "Full Stack Development": { gradient: "from-orange-500/10 to-orange-600/5 dark:from-orange-500/20", border: "border-orange-200/50 dark:border-orange-700/30" },
  Islamic: { gradient: "from-emerald-600/10 to-teal-600/5 dark:from-emerald-500/20", border: "border-emerald-200/50 dark:border-emerald-700/30" },
  Technical: { gradient: "from-blue-500/10 to-blue-600/5 dark:from-blue-500/20", border: "border-blue-200/50 dark:border-blue-700/30" },
  "Self-Development": { gradient: "from-rose-500/10 to-rose-600/5 dark:from-rose-500/20", border: "border-rose-200/50 dark:border-rose-700/30" },
  Reference: { gradient: "from-amber-500/10 to-amber-600/5 dark:from-amber-500/20", border: "border-amber-200/50 dark:border-amber-700/30" },
  Psychology: { gradient: "from-violet-500/10 to-violet-600/5 dark:from-violet-500/20", border: "border-violet-200/50 dark:border-violet-700/30" },
};

const defaultColors = { gradient: "from-zinc-500/10 to-zinc-600/5 dark:from-zinc-500/20", border: "border-zinc-200/50 dark:border-zinc-700/30" };

interface StudyBook {
  id: string;
  title: string;
  author: string;
  category: string;
  tags: string[];
  description: string;
  size: string;
  source: string;
}

function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  if (!open) return null;

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
          <X className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        </button>
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Welcome back</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Sign in to continue your journey</p>
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
              className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Forgot password?</button>
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
            <span className="bg-white dark:bg-zinc-900 px-2 text-zinc-500 dark:text-zinc-400">Or</span>
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
        <p className="text-center mt-4 text-xs text-zinc-500 dark:text-zinc-400">
          Don&apos;t have an account?{" "}
          <button type="button" onClick={() => { onClose(); window.location.href = "/dashboard/login"; }}
            className="text-blue-500 hover:text-blue-600 transition-colors font-medium">Sign up</button>
        </p>
      </div>
    </div>
  );
}

function BookCard({ book, index, variant, onPay, onRead, isBookmarked, onToggleBookmark, onShare, copiedTitle }: {
  book: Book & { comingSoon?: boolean; author?: string; fileParam?: string };
  index: number;
  variant: "islamic" | "coming-soon" | "study";
  onPay?: (book: Book) => void;
  onRead?: (book: Book & { author?: string; fileParam?: string }) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
  onShare?: (book: Book & { author?: string; fileParam?: string }) => void;
  copiedTitle?: string | null;
}) {
  const colors = categoryColors[book.category] || defaultColors;
  const { data: session } = useSession();
  const [showAuth, setShowAuth] = React.useState(false);

  const requireAuth = (action: () => void) => {
    if (!session) setShowAuth(true);
    else action();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Card className={`h-full flex flex-col group card-premium bg-gradient-to-br ${colors.gradient} ${colors.border}`}>
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex items-start justify-between gap-2 mb-4">
            <div className="flex items-start gap-4 min-w-0">
              <div className={`w-14 h-18 rounded-xl bg-gradient-to-br ${variant === "islamic" ? "from-emerald-500 to-teal-600" : variant === "coming-soon" ? "from-zinc-400 to-zinc-500" : "from-blue-500 to-indigo-600"} flex items-center justify-center text-white shadow-lg shrink-0`}>
                {variant === "islamic" ? <Star className="h-6 w-6" /> : variant === "coming-soon" ? <Clock className="h-6 w-6" /> : <BookMarked className="h-6 w-6" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-base text-zinc-900 dark:text-zinc-100 leading-tight">
                    {book.title}
                  </h3>
                  {book.version && (
                    <Badge variant="secondary" className="text-[10px] shrink-0">
                      v{book.version}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <Badge variant="secondary" className="text-[10px]">
                    {book.category}
                  </Badge>
                  {book.pages && (
                    <Badge variant="outline" className="text-[10px]">
                      {book.pages} pages
                    </Badge>
                  )}
                  {book.author && (
                    <Badge variant="outline" className="text-[10px]">
                      {book.author}
                    </Badge>
                  )}
                  {variant === "coming-soon" && (
                    <Badge variant="secondary" className="text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-700">
                      Coming Soon
                    </Badge>
                  )}
                  {variant === "study" && (
                    <Badge variant="secondary" className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-700">
                      Available
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              {onToggleBookmark && (
                <button
                  onClick={onToggleBookmark}
                  aria-label={isBookmarked ? "Remove bookmark" : "Bookmark book"}
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    isBookmarked
                      ? "text-amber-500"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-amber-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  )}
                >
                  <Bookmark className="h-4 w-4" fill={isBookmarked ? "currentColor" : "none"} />
                </button>
              )}
              {onShare && (
                <button
                  onClick={() => onShare(book)}
                  aria-label="Copy book link"
                  className="p-1.5 rounded-md text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  {copiedTitle === book.title ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Share2 className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 flex-1 mb-4 leading-relaxed line-clamp-2">
            {book.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {book.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px]">
                #{tag}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-auto">
            {variant === "coming-soon" ? (
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-sm font-medium cursor-default">
                <Clock className="h-4 w-4" />
                Coming Soon
              </span>
            ) : variant === "study" ? (
              <>
                <button onClick={() => onRead?.(book)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all active:scale-[0.98]">
                  <BookOpen className="h-4 w-4" />
                  Read
                </button>
                <button onClick={() => requireAuth(() => onPay?.(book as Book))}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-90 transition-all active:scale-[0.98]">
                  <ShoppingCart className="h-4 w-4" />
                  Pay &amp; Download
                </button>
              </>
            ) : (
              <>
                <button onClick={() => onRead?.(book)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all active:scale-[0.98]">
                  <BookOpen className="h-4 w-4" />
                  Read
                </button>
                <button onClick={() => window.open(book.pdfUrl, "_blank")}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-90 transition-all active:scale-[0.98]">
                  <Download className="h-4 w-4" />
                  Download PDF
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </motion.div>
  );
}

const apiFileUrl = (filePath: string, mode: string) => {
  const fileName = filePath.split("/").pop() || filePath.replace(/^\//, "");
  return `/api/books/pdf?file=${encodeURIComponent(fileName)}&mode=${mode}`;
};

const bookFileName = (filePath: string) =>
  (filePath.split("/").pop() || filePath.replace(/^\//, ""));

const BOOKMARK_KEY = "mywebfolio:bookmarks";

const bookmarksListeners = new Set<() => void>();

function emitBookmarksChange() {
  bookmarksListeners.forEach((listener) => listener());
}

function readBookmarks(): string[] {
  try {
    if (typeof window === "undefined") return [];
    const stored = window.localStorage.getItem(BOOKMARK_KEY);
    return stored ? (JSON.parse(stored) as string[]) : [];
  } catch {
    return [];
  }
}

function useBookmarks() {
  const bookmarks = React.useSyncExternalStore(
    (callback) => {
      bookmarksListeners.add(callback);
      window.addEventListener("storage", callback);
      return () => {
        bookmarksListeners.delete(callback);
        window.removeEventListener("storage", callback);
      };
    },
    readBookmarks,
    () => []
  );

  const toggle = React.useCallback((title: string) => {
    const current = readBookmarks();
    const next = current.includes(title)
      ? current.filter((t) => t !== title)
      : [...current, title];
    try {
      window.localStorage.setItem(BOOKMARK_KEY, JSON.stringify(next));
    } catch {}
    emitBookmarksChange();
  }, []);

  return { bookmarks, toggle, ready: true } as const;
}

type FilterableBook = Book & { comingSoon?: boolean; author?: string; fileParam?: string };

function BookFilterBar({
  filter,
  onFilterChange,
  search,
  onSearchChange,
  library,
}: {
  filter: string;
  onFilterChange: (f: string) => void;
  search: string;
  onSearchChange: (s: string) => void;
  library: string;
}) {
  const options =
    library === "all"
      ? ["All", "Islamic Books", "Technical Books", "Study Corner"]
      : ["All", "Islamic Books", "Technical Books", "Study Corner"];

  return (
    <div className="space-y-4 mb-10">
      <div className="relative max-w-lg mx-auto">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title, tag, or description…"
          aria-label="Search books"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white/70 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 backdrop-blur-xl text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />
      </div>
      <div
        className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 snap-x"
        style={{ scrollbarWidth: "thin", WebkitOverflowScrolling: "touch" }}
      >
        {options.map((opt) => {
          const active = filter === opt;
          return (
            <button
              key={opt}
              onClick={() => onFilterChange(opt)}
              aria-pressed={active}
              aria-label={active ? `${opt} (active)` : opt}
              className={cn(
                "shrink-0 snap-start px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border whitespace-nowrap",
                active
                  ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-transparent shadow-sm"
                  : "bg-white/60 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Books() {
  const books = getBooks();
  const islamicBooks = books.filter((b) => b.group === "islamic").map((b) => ({
    ...b,
    pdfUrl: apiFileUrl(b.pdfUrl || "", "download"),
    readUrl: apiFileUrl(b.pdfUrl || "", "read"),
    fileParam: bookFileName(b.pdfUrl || ""),
  }));
  const comingSoonBooks = books.filter((b) => b.group === "tech" && comingSoonTitles.has(b.title));
  const studyLibraryBooks = (studyBooksData as StudyBook[]).map((sb) => ({
    title: sb.title,
    description: sb.description,
    category: sb.category,
    tags: sb.tags,
    pdfUrl: apiFileUrl(sb.source, "download"),
    readUrl: apiFileUrl(sb.source, "read"),
    fileParam: bookFileName(sb.source),
    author: sb.author,
    pages: undefined,
    version: undefined,
  }));
  const [payBook, setPayBook] = React.useState<Book | null>(null);
  const [filter, setFilter] = React.useState("All");
  const [search, setSearch] = React.useState("");
  const [copiedTitle, setCopiedTitle] = React.useState<string | null>(null);
  const { bookmarks, toggle, ready } = useBookmarks();

  const matches = (title: string, text: string) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return `${title} ${text}`.toLowerCase().includes(q);
  };

  const showsIslamic =
    filter === "All" || filter === "Islamic Books";
  const showsTech = filter === "All" || filter === "Technical Books";
  const showsStudy = filter === "All" || filter === "Study Corner";

  const filtered = (list: FilterableBook[]) =>
    list.filter((b) =>
      matches(b.title, `${b.description || ""} ${(b.tags || []).join(" ")}`)
    );

  const shareBook = async (book: FilterableBook, readPath: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${readPath}`);
      setCopiedTitle(book.title);
      setTimeout(() => setCopiedTitle(null), 1500);
    } catch {}
  };

  const islamicList = filtered(islamicBooks);
  const techList = filtered(comingSoonBooks);
  const studyList = filtered(studyLibraryBooks);

  return (
    <Section
      id="books"
      title={
        <span>
          <span className="gradient-text">Library</span>
        </span>
      }
      subtitle="My published books, guides, and technical references."
      className="bg-zinc-50/50 dark:bg-zinc-900/50"
    >
      <BookFilterBar
        filter={filter}
        onFilterChange={setFilter}
        search={search}
        onSearchChange={setSearch}
        library="all"
      />
      {showsIslamic && (
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 rounded-full bg-emerald-500" />
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Islamic Library</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Books on Islamic creed, spirituality, and jurisprudence.</p>
            </div>
          </div>
          {islamicList.length > 0 ? (
            <SectionGrid>
              {islamicList.map((book, i) => (
                <BookCard
                  key={book.title}
                  book={book}
                  index={i}
                  variant="islamic"
                  isBookmarked={(ready && bookmarks.includes(book.title)) || false}
                  onToggleBookmark={() => toggle(book.title)}
                  onShare={(b) => shareBook(b, `/books/read?file=${encodeURIComponent(b.fileParam || "")}`)}
                  copiedTitle={copiedTitle}
                  onRead={(b) =>
                    window.open(
                      `/books/read?file=${encodeURIComponent(b.fileParam || "")}`,
                      "_blank"
                    )
                  }
                />
              ))}
            </SectionGrid>
          ) : (
            <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 py-10">
              No Islamic books match your search.
            </p>
          )}
        </div>
      )}

      {showsTech && (
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 rounded-full bg-amber-500" />
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Technical Library — Coming Soon</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Premium publications in development. Stay tuned.</p>
            </div>
          </div>
          {techList.length > 0 ? (
            <SectionGrid>
              {techList.map((book, i) => (
                <BookCard
                  key={book.title}
                  book={book}
                  index={i}
                  variant="coming-soon"
                  isBookmarked={(ready && bookmarks.includes(book.title)) || false}
                  onToggleBookmark={() => toggle(book.title)}
                  onShare={(b) => shareBook(b, b.pdfUrl || "")}
                  copiedTitle={copiedTitle}
                />
              ))}
            </SectionGrid>
          ) : (
            <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 py-10">
              No technical books match your search.
            </p>
          )}
        </div>
      )}

      {showsStudy && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 rounded-full bg-blue-500" />
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Study Corner Library</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Curated learning resources available for reading and download.</p>
            </div>
          </div>
          {studyList.length > 0 ? (
            <SectionGrid>
              {studyList.map((book, i) => (
                <BookCard
                  key={book.title}
                  book={book}
                  index={i}
                  variant="study"
                  isBookmarked={(ready && bookmarks.includes(book.title)) || false}
                  onToggleBookmark={() => toggle(book.title)}
                  onShare={(b) => shareBook(b, `/books/read?file=${encodeURIComponent(b.fileParam || "")}&paid=true&title=${encodeURIComponent(b.title)}`)}
                  copiedTitle={copiedTitle}
                  onPay={(b) => setPayBook(b)}
                  onRead={(b) =>
                    window.open(
                      `/books/read?file=${encodeURIComponent(b.fileParam || "")}&paid=true&title=${encodeURIComponent(b.title)}`,
                      "_blank"
                    )
                  }
                />
              ))}
            </SectionGrid>
          ) : (
            <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 py-10">
              No study resources match your search.
            </p>
          )}
        </div>
      )}

      {payBook && (
        <PaymentModal
          open={!!payBook}
          onClose={() => setPayBook(null)}
          bookTitle={payBook?.title || ""}
          pdfUrl={payBook?.pdfUrl || ""}
          pages={payBook?.pages}
        />
      )}
    </Section>
  );
}
