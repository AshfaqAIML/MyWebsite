"use client";

import { useEffect } from "react";
import { useStudyStore } from "@/lib/study-store";
import { GlassCard } from "@/components/study/shared/glass-card";
import { StatsCardSkeleton } from "@/components/study/shared/loading-skeleton";
import { ProgressRing } from "@/components/study/shared/progress-ring";
import { BarChart3, Clock, BookOpen, TrendingUp, Calendar, Award, Timer } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export default function AnalyticsPage() {
  const { stats, fetchStats, loading } = useStudyStore();

  useEffect(() => { fetchStats(); }, [fetchStats]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium tracking-[0.2em] text-blue-600 dark:text-blue-400 uppercase">Analytics</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Reading Insights</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => <StatsCardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <AnalyticCard icon={BookOpen} label="Total Books" value={stats?.totalBooks ?? 0} />
          <AnalyticCard icon={Clock} label="Study Hours" value={stats?.totalStudyMinutes ? Math.round(stats.totalStudyMinutes / 60) : 0} />
          <AnalyticCard icon={TrendingUp} label="Completed" value={stats?.booksCompleted ?? 0} />
          <AnalyticCard icon={Award} label="Streak" value={`${stats?.currentStreak ?? 0} days`} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Timer className="h-4 w-4 text-blue-500" />
            <h2 className="text-sm font-semibold">Study Breakdown</h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-black/60 dark:text-white/60">Highlights</span>
                <span className="font-medium tabular-nums">{stats?.totalHighlights ?? 0}</span>
              </div>
              <div className="progress-bar-premium">
                <div className="fill" style={{ width: `${(stats?.totalHighlights ?? 0) > 0 ? Math.min(((stats?.totalHighlights ?? 0) / 50) * 100, 100) : 0}%`, background: "linear-gradient(90deg, #f59e0b, #f97316)" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-black/60 dark:text-white/60">Notes</span>
                <span className="font-medium tabular-nums">{stats?.totalNotes ?? 0}</span>
              </div>
              <div className="progress-bar-premium">
                <div className="fill" style={{ width: `${(stats?.totalNotes ?? 0) > 0 ? Math.min(((stats?.totalNotes ?? 0) / 30) * 100, 100) : 0}%`, background: "linear-gradient(90deg, #10b981, #059669)" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-black/60 dark:text-white/60">Flashcards</span>
                <span className="font-medium tabular-nums">{stats?.totalFlashcards ?? 0}</span>
              </div>
              <div className="progress-bar-premium">
                <div className="fill" style={{ width: `${(stats?.totalFlashcards ?? 0) > 0 ? Math.min(((stats?.totalFlashcards ?? 0) / 50) * 100, 100) : 0}%`, background: "linear-gradient(90deg, #8b5cf6, #7c3aed)" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-black/60 dark:text-white/60">Bookmarks</span>
                <span className="font-medium tabular-nums">{stats?.totalBookmarks ?? 0}</span>
              </div>
              <div className="progress-bar-premium">
                <div className="fill" style={{ width: `${(stats?.totalBookmarks ?? 0) > 0 ? Math.min(((stats?.totalBookmarks ?? 0) / 20) * 100, 100) : 0}%`, background: "linear-gradient(90deg, #3b82f6, #2563eb)" }} />
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-4 w-4 text-purple-500" />
            <h2 className="text-sm font-semibold">Reading Goals</h2>
          </div>
          <div className="flex flex-col items-center justify-center py-4">
            <ProgressRing value={(stats?.totalBooks ?? 0) > 0 ? Math.min(((stats?.booksCompleted ?? 0) / (stats?.totalBooks ?? 1)) * 100, 100) : 0} size={80} strokeWidth={4} />
            <p className="mt-4 text-lg font-bold">{stats?.booksCompleted ?? 0} / {stats?.totalBooks ?? 0}</p>
            <p className="text-sm text-black/40 dark:text-white/40">books completed</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function AnalyticCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string | number }) {
  return (
    <GlassCard className="p-4">
      <Icon className="h-4 w-4 text-blue-500 mb-2" />
      <p className="text-xl font-bold tabular-nums">{value}</p>
      <p className="text-xs text-black/40 dark:text-white/40 mt-0.5">{label}</p>
    </GlassCard>
  );
}
