"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen, BrainCircuit, Bookmark, FileText, Search, BarChart3,
  Clock, TrendingUp, Award, ChevronRight, ArrowUpRight,
} from "lucide-react";

export default function StudyPage() {
  const [tab, setTab] = useState<"overview" | "library" | "flashcards">("overview");

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-20 pb-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="mb-8">
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Personal Study Platform</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-50">Study Dashboard</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">Track your reading progress, review notes, and study smarter.</p>
        </div>

        <div className="flex gap-2 mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-2">
          {(["overview", "library", "flashcards"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors capitalize ${
                tab === t ? "text-zinc-900 dark:text-white border-b-2 border-zinc-900 dark:border-white" : "text-zinc-400 hover:text-zinc-600"
              }`}
            >{t}</button>
          ))}
        </div>

        {tab === "overview" && <OverviewTab />}
        {tab === "library" && <LibraryTab />}
        {tab === "flashcards" && <FlashcardsTab />}
      </div>
    </div>
  );
}

function OverviewTab() {
  const stats = [
    { icon: BookOpen, label: "Books", value: "0", color: "text-blue-500" },
    { icon: FileText, label: "Highlights", value: "0", color: "text-amber-500" },
    { icon: BrainCircuit, label: "Notes", value: "0", color: "text-emerald-500" },
    { icon: Bookmark, label: "Bookmarks", value: "0", color: "text-purple-500" },
    { icon: Clock, label: "Study Hours", value: "0", color: "text-rose-500" },
    { icon: Award, label: "Streak", value: "0 days", color: "text-orange-500" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
            <s.icon className={`h-5 w-5 ${s.color} mb-2`} />
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 text-center">
        <BookOpen className="h-12 w-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">Start Your Study Journey</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-6">
          Upload a PDF book, open it in the reader, and start highlighting, taking notes, and building flashcards.
        </p>
        <Link href="/study-corner"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Browse Library <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
        <h3 className="font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-blue-500" /> Recent Activity
        </h3>
        <div className="text-center py-8 text-sm text-zinc-400">No activity yet. Start reading to see your activity here.</div>
      </div>
    </div>
  );
}

function LibraryTab() {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-zinc-900 dark:text-white">Your Books</h3>
        <Link href="/study-corner"
          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >Browse all books</Link>
      </div>
      <div className="text-center py-12">
        <BookOpen className="h-10 w-10 text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">No books uploaded yet.</p>
        <p className="text-xs text-zinc-400 mt-1">Upload PDFs from the Study Corner to build your library.</p>
      </div>
    </div>
  );
}

function FlashcardsTab() {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-zinc-900 dark:text-white">Flashcard Review</h3>
        <span className="text-xs text-zinc-400">Spaced repetition</span>
      </div>
      <div className="text-center py-12">
        <BrainCircuit className="h-10 w-10 text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">No flashcards yet.</p>
        <p className="text-xs text-zinc-400 mt-1">Create flashcards from highlights or notes while reading.</p>
      </div>
    </div>
  );
}
