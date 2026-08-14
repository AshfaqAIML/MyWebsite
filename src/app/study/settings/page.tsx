"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Monitor, BookOpen, Sun, Moon, Trash2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const THEME_KEY = "study-reader-theme";
const STORAGE_KEYS = [
  "study_progresses",
  "study_bookmarks",
  "study_highlights",
  "study_notes",
  "study_sessions",
  "study_stats",
];

const themes = [
  { key: "light", label: "Light", icon: Sun },
  { key: "dark", label: "Dark", icon: Moon },
  { key: "sepia", label: "Sepia", icon: BookOpen },
] as const;

type ReaderTheme = (typeof themes)[number]["key"];

function readPreference(): ReaderTheme {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(THEME_KEY);
  return stored === "dark" || stored === "sepia" ? stored : "light";
}

export default function StudySettingsPage() {
  const [theme, setTheme] = useState<ReaderTheme>("light");
  const [mounted, setMounted] = useState(false);
  const [cleared, setCleared] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      setTheme(readPreference());
      setMounted(true);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const selectTheme = (key: ReaderTheme) => {
    setTheme(key);
    localStorage.setItem(THEME_KEY, key);
  };

  const clearData = () => {
    STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    setCleared(true);
    setTimeout(() => {
      setCleared(false);
      router.push("/study");
    }, 1200);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-black/80 dark:text-white/80">Settings</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Reader preferences and study data management.</p>
      </div>

      <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#101014] p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <Monitor className="h-4 w-4 text-black/50 dark:text-white/50" />
          <h2 className="text-sm font-semibold text-black/70 dark:text-white/70">Default Reader Theme</h2>
        </div>
        <div className="grid grid-cols-3 gap-3 max-w-md">
          {themes.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => selectTheme(key)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border p-4 text-xs font-medium transition-all",
                theme === key
                  ? "border-blue-500/60 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  : "border-black/[0.08] dark:border-white/[0.1] text-black/50 dark:text-white/50 hover:border-black/20 dark:hover:border-white/20",
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          ))}
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3">
          {mounted ? "Applied automatically when you open a book." : "Loading preference..."}
        </p>
      </div>

      <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#101014] p-5">
        <div className="flex items-center gap-2.5 mb-2">
          <Trash2 className="h-4 w-4 text-red-500/70" />
          <h2 className="text-sm font-semibold text-black/70 dark:text-white/70">Study Data</h2>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 max-w-lg">
          Clears locally stored reading progress, bookmarks, highlights, notes, sessions, and stats for the study module.
        </p>
        <button
          onClick={clearData}
          className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition-all",
            cleared
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
              : "bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20",
          )}
        >
          {cleared ? <Check className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
          {cleared ? "Cleared" : "Clear all study data"}
        </button>
        {cleared && (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">Study data cleared. Redirecting to dashboard...</p>
        )}
      </div>
    </div>
  );
}
