"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useStudyStore } from "@/lib/study-store";
import { GlassCard } from "@/components/study/shared/glass-card";
import { EmptyState } from "@/components/study/shared/empty-state";
import { BookCardSkeleton } from "@/components/study/shared/loading-skeleton";
import { ProgressRing } from "@/components/study/shared/progress-ring";
import { BookOpen, Search, Grid3X3, List, ArrowUpRight, Upload, ChevronRight, Clock, FileText } from "lucide-react";

const categories = ["All", "Technical", "Psychology", "Self-Development", "Reference"];

export default function LibraryPage() {
  const { books, fetchBooks, loading } = useStudyStore();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  const filtered = useMemo(() => {
    return books.filter((b) => {
      const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.author?.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || b.category === category;
      return matchSearch && matchCat;
    });
  }, [books, search, category]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium tracking-[0.2em] text-blue-600 dark:text-blue-400 uppercase">Library</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Your Books</h1>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl border border-black/[0.06] dark:border-white/[0.1] px-4 py-2.5 text-sm font-medium transition-all hover:bg-black/[0.03] dark:hover:bg-white/[0.04]">
          <Upload className="h-4 w-4" />
          Upload
        </button>
      </div>

      {/* Search & Filters */}
      <GlassCard className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/55 dark:text-white/50" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or author..."
              className="w-full rounded-xl border border-black/[0.06] dark:border-white/[0.1] bg-transparent py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1 rounded-lg border border-black/[0.06] dark:border-white/[0.1] p-0.5">
              <button onClick={() => setView("grid")} className={`rounded-lg p-1.5 transition-colors ${view === "grid" ? "bg-black/[0.06] dark:bg-white/[0.1]" : "hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"}`}>
                <Grid3X3 className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => setView("list")} className={`rounded-lg p-1.5 transition-colors ${view === "list" ? "bg-black/[0.06] dark:bg-white/[0.1]" : "hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"}`}>
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                category === cat
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "text-black/50 hover:text-black/80 hover:bg-black/[0.04] dark:text-white/60 dark:hover:text-white/70 dark:hover:bg-white/[0.06]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Book Grid/List */}
      {loading ? (
        <div className={view === "grid" ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" : "space-y-3"}>
          {Array.from({ length: 8 }).map((_, i) => <BookCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <GlassCard>
          <EmptyState
            icon={BookOpen}
            title={search || category !== "All" ? "No books found" : "Your library is empty"}
            description={search || category !== "All" ? "Try a different search or filter." : "Upload PDFs to start building your library."}
            action={{ label: "Browse All Books", onClick: () => { setSearch(""); setCategory("All"); } }}
          />
        </GlassCard>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((book) => (
            <Link
              key={book.id}
              href={`/study/reader/${book.id}`}
              className="book-card-hover group rounded-2xl border border-black/[0.04] dark:border-white/[0.06] bg-white/70 dark:bg-white/[0.03] overflow-hidden backdrop-blur-xl"
            >
              <div className="relative h-40 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-black/10 dark:text-white/10 group-hover:scale-110 group-hover:text-blue-500/30 transition-all duration-500" />
                {book.readingProgress && book.readingProgress.percentage > 0 && (
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="progress-bar-premium">
                      <div className="fill" style={{ width: `${book.readingProgress.percentage}%` }} />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="text-sm font-medium truncate">{book.title}</p>
                <p className="mt-0.5 text-xs text-black/60 dark:text-white/60 truncate">{book.author || "Unknown"}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-black/55 dark:text-white/50">{book.fileSize ? `${(book.fileSize / 1024 / 1024).toFixed(1)} MB` : ""}</span>
                  <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">Open →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((book) => (
            <Link
              key={book.id}
              href={`/study/reader/${book.id}`}
              className="group flex items-center gap-4 rounded-2xl border border-black/[0.04] dark:border-white/[0.06] bg-white/70 dark:bg-white/[0.03] p-4 backdrop-blur-xl transition-all hover:bg-white/90 dark:hover:bg-white/[0.06]"
            >
              <div className="flex h-12 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                <BookOpen className="h-5 w-5 text-blue-500/60" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{book.title}</p>
                <p className="text-xs text-black/60 dark:text-white/60">{book.author || "Unknown"}</p>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-xs text-black/55 dark:text-white/50">
                {book.category && <span>{book.category}</span>}
                {book.fileSize && <span>{(book.fileSize / 1024 / 1024).toFixed(1)} MB</span>}
              </div>
              {book.readingProgress && (
                <div className="flex items-center gap-2">
                  <ProgressRing value={book.readingProgress.percentage || 0} size={32} strokeWidth={2.5} />
                </div>
              )}
              <ChevronRight className="h-4 w-4 text-black/20 dark:text-white/20 group-hover:text-black/50 dark:group-hover:text-white/50 transition-colors" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
