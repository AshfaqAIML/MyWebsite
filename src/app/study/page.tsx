"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useStudyStore } from "@/lib/study-store";
import { GlassCard } from "@/components/study/shared/glass-card";
import { EmptyState } from "@/components/study/shared/empty-state";
import { StatsCardSkeleton, ActivitySkeleton } from "@/components/study/shared/loading-skeleton";
import { ProgressRing } from "@/components/study/shared/progress-ring";
import {
  BookOpen, BrainCircuit, Bookmark, FileText, Clock, TrendingUp, Award,
  ArrowUpRight, ChevronRight, Sparkles, Timer, Library, RotateCcw,
  ArrowRight, StickyNote, Highlighter,
} from "lucide-react";

export default function StudyDashboard() {
  const { stats, fetchStats, books, fetchBooks, flashcards, fetchFlashcards, loading } = useStudyStore();
  const [activity, setActivity] = useState<any[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted) {
      fetchStats();
      fetchBooks();
      fetchFlashcards();
      fetch("/api/study/sessions?limit=10")
        .then((r) => r.json())
        .then(setActivity)
        .catch(() => {})
        .finally(() => setActivityLoading(false));
    }
  }, [mounted, fetchStats, fetchBooks, fetchFlashcards]);

  const dueCards = flashcards.filter((c: any) => !c.nextReview || new Date(c.nextReview) <= new Date());
  const continueBooks = books.filter((b: any) => b.readingProgress && b.readingProgress.percentage > 0 && b.readingProgress.percentage < 100);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium tracking-[0.2em] text-blue-600 dark:text-blue-400 uppercase">Study Dashboard</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Welcome back</h1>
        </div>
        <Link
          href="/study/library"
          className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/90"
        >
          <Library className="h-4 w-4" />
          Browse Library
        </Link>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => <StatsCardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard icon={BookOpen} label="Books" value={stats?.totalBooks ?? 0} color="text-blue-500" />
          <StatCard icon={Highlighter} label="Highlights" value={stats?.totalHighlights ?? 0} color="text-amber-500" />
          <StatCard icon={StickyNote} label="Notes" value={stats?.totalNotes ?? 0} color="text-emerald-500" />
          <StatCard icon={Bookmark} label="Bookmarks" value={stats?.totalBookmarks ?? 0} color="text-purple-500" />
          <StatCard icon={Timer} label="Hours" value={stats?.totalStudyMinutes ? Math.round(stats.totalStudyMinutes / 60) : 0} color="text-rose-500" />
          <StatCard icon={Award} label="Streak" value={`${stats?.currentStreak ?? 0}d`} color="text-orange-500" />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left column */}
        <div className="space-y-6">
          {/* Continue Reading */}
          {continueBooks.length > 0 && (
            <GlassCard className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-blue-500" />
                  <h2 className="text-sm font-semibold">Continue Reading</h2>
                </div>
                <Link href="/study/library" className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                {continueBooks.slice(0, 3).map((book: any) => (
                  <Link
                    key={book.id}
                    href={`/study/reader/${book.id}`}
                    className="group flex items-center gap-4 rounded-xl p-3 -mx-1 transition-all hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
                  >
                    <div className="flex h-12 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
                      <BookOpen className="h-5 w-5 text-blue-500/60" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{book.title}</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="progress-bar-premium flex-1">
                          <div className="fill" style={{ width: `${book.readingProgress.percentage || 0}%` }} />
                        </div>
                        <span className="text-[11px] text-black/40 dark:text-white/40 tabular-nums">{Math.round(book.readingProgress.percentage || 0)}%</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-black/20 dark:text-white/20 group-hover:text-black/50 dark:group-hover:text-white/50 transition-colors" />
                  </Link>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Recent Activity */}
          <GlassCard className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <h2 className="text-sm font-semibold">Recent Activity</h2>
            </div>
            {activityLoading ? (
              <ActivitySkeleton />
            ) : activity.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-black/40 dark:text-white/40">No activity yet. Start reading to see your activity here.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {activity.map((a: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    </div>
                    <span className="flex-1 text-black/60 dark:text-white/60">
                      {a.action === "read" && `Read page ${a.detail || ""}`}
                      {a.action === "note" && "Added a note"}
                      {a.action === "highlight" && "Highlighted text"}
                      {a.action === "bookmark" && "Bookmarked a page"}
                      {a.action === "flashcard" && "Created a flashcard"}
                      {!["read","note","highlight","bookmark","flashcard"].includes(a.action) && a.description}
                    </span>
                    <span className="text-xs text-black/30 dark:text-white/30">
                      {a.createdAt ? new Date(a.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : ""}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <GlassCard className="p-5">
            <h2 className="text-sm font-semibold mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-2">
              <ActionButton icon={BookOpen} label="Open Book" onClick={() => window.location.href = "/study/library"} />
              <ActionButton icon={BrainCircuit} label="Review Cards" onClick={() => {}} />
              <ActionButton icon={StickyNote} label="New Note" onClick={() => {}} />
              <ActionButton icon={Sparkles} label="Study Stats" onClick={() => {}} />
            </div>
          </GlassCard>

          {/* Flashcards Due */}
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 text-purple-500" />
                <h2 className="text-sm font-semibold">Flashcards</h2>
              </div>
              <span className="text-xs text-black/40 dark:text-white/40">{dueCards.length} due</span>
            </div>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] animate-pulse" />
                ))}
              </div>
            ) : dueCards.length > 0 ? (
              <div className="space-y-2">
                {dueCards.slice(0, 3).map((card: any) => (
                  <div key={card.id} className="rounded-xl bg-black/[0.02] dark:bg-white/[0.03] p-3 border border-black/[0.04] dark:border-white/[0.06]">
                    <p className="text-sm text-black/80 dark:text-white/80 line-clamp-2">{card.front}</p>
                  </div>
                ))}
                <Link
                  href="/study/flashcards"
                  className="mt-2 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-500/5 transition-colors"
                >
                  Review all <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-sm text-black/40 dark:text-white/40">No cards due for review</p>
              </div>
            )}
          </GlassCard>

          {/* Reading Goal */}
          <GlassCard className="p-5">
            <div className="flex items-center gap-3">
              <ProgressRing value={(stats?.totalBooks ?? 0) > 0 ? Math.min(((stats?.booksCompleted ?? 0) / (stats?.totalBooks ?? 1)) * 100, 100) : 0} size={48} />
              <div>
                <p className="text-sm font-medium">Reading Goal</p>
                <p className="text-xs text-black/40 dark:text-white/40">
                  {stats?.booksCompleted ?? 0} of {stats?.totalBooks ?? 0} books completed
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Empty state for new users */}
      {!loading && stats && stats.totalBooks === 0 && (
        <GlassCard className="mt-4">
          <EmptyState
            icon={BookOpen}
            title="Start Your Study Journey"
            description="Upload a PDF, open it in the reader, and start highlighting, taking notes, and building flashcards."
            action={{ label: "Browse Library", onClick: () => window.location.href = "/study/library" }}
          />
        </GlassCard>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  return (
    <GlassCard className="stat-card p-4">
      <Icon className={`h-4 w-4 ${color} mb-2`} />
      <p className="text-xl font-bold tabular-nums">{value}</p>
      <p className="text-xs text-black/40 dark:text-white/40 mt-0.5">{label}</p>
    </GlassCard>
  );
}

function ActionButton({ icon: Icon, label, onClick }: { icon: any; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 rounded-xl p-3 transition-all hover:bg-black/[0.03] dark:hover:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06]"
    >
      <Icon className="h-4 w-4 text-black/50 dark:text-white/50" />
      <span className="text-xs font-medium text-black/60 dark:text-white/60">{label}</span>
    </button>
  );
}
