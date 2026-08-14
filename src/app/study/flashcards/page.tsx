"use client";

import { useEffect, useState } from "react";
import { useStudyStore } from "@/lib/study-store";
import { GlassCard } from "@/components/study/shared/glass-card";
import { EmptyState } from "@/components/study/shared/empty-state";
import { BrainCircuit, RotateCcw, Check, X as XIcon, ChevronLeft, ChevronRight, BarChart3 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export default function FlashcardsPage() {
  const { flashcards, fetchFlashcards, loading } = useStudyStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewed, setReviewed] = useState<Record<string, "again" | "good" | "easy">>({});
  const [sessionComplete, setSessionComplete] = useState(false);

  useEffect(() => { fetchFlashcards(); }, [fetchFlashcards]);

  const dueCards = flashcards.filter((c) => !c.nextReview || new Date(c.nextReview) <= new Date());
  const card = dueCards[currentIndex];

  const handleReview = async (quality: "again" | "good" | "easy") => {
    if (!card) return;
    setReviewed((prev) => ({ ...prev, [card.id]: quality }));
    setFlipped(false);

    const easeMap = { again: 1.3, good: 2.5, easy: 3.5 };
    const intervalMap = { again: 0, good: 1, easy: 4 };
    const now = new Date();
    const nextReview = new Date(now.getTime() + intervalMap[quality] * 24 * 60 * 60 * 1000);

    await fetch(`/api/study/flashcards?id=${card.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        difficulty: quality === "again" ? 0 : quality === "good" ? 1 : 2,
        easeFactor: easeMap[quality],
        interval: intervalMap[quality],
        repetitions: quality === "again" ? 0 : (card.repetitions || 0) + 1,
        nextReview: nextReview.toISOString(),
      }),
    });

    if (currentIndex < dueCards.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setSessionComplete(true);
    }
  };

  const resetSession = () => {
    setCurrentIndex(0);
    setFlipped(false);
    setReviewed({});
    setSessionComplete(false);
    fetchFlashcards();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-black/20 border-t-black/80 dark:border-white/20 dark:border-t-white/80" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium tracking-[0.2em] text-blue-600 dark:text-blue-400 uppercase">Flashcards</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Spaced Repetition</h1>
      </div>

      {dueCards.length === 0 && !sessionComplete ? (
        <GlassCard>
          <EmptyState
            icon={BrainCircuit}
            title={flashcards.length > 0 ? "All caught up!" : "No flashcards yet"}
            description={flashcards.length > 0 ? "No cards due for review. Come back later." : "Create flashcards from highlights while reading to start reviewing."}
          />
        </GlassCard>
      ) : sessionComplete ? (
        <GlassCard className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
            <Check className="h-8 w-8 text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">Session Complete</h2>
          <p className="text-sm text-black/50 dark:text-white/50 mb-6">
            You reviewed {Object.keys(reviewed).length} cards
          </p>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-500">{Object.values(reviewed).filter((v) => v === "easy").length}</p>
              <p className="text-xs text-black/40 dark:text-white/40">Easy</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-500">{Object.values(reviewed).filter((v) => v === "good").length}</p>
              <p className="text-xs text-black/40 dark:text-white/40">Good</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-rose-500">{Object.values(reviewed).filter((v) => v === "again").length}</p>
              <p className="text-xs text-black/40 dark:text-white/40">Again</p>
            </div>
          </div>
          <button onClick={resetSession} className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-black hover:opacity-90 transition-all">
            <RotateCcw className="h-4 w-4" /> Start New Session
          </button>
        </GlassCard>
      ) : (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-black/40 dark:text-white/40">{currentIndex + 1} of {dueCards.length}</span>
            <div className="flex gap-1">
              {dueCards.slice(0, dueCards.length).map((_, i) => (
                <div key={i} className={`h-1.5 w-6 rounded-full transition-colors ${i < currentIndex ? "bg-blue-500" : i === currentIndex ? "bg-blue-500/60" : "bg-black/[0.06] dark:bg-white/[0.06]"}`} />
              ))}
            </div>
          </div>

          <div
            onClick={() => setFlipped(!flipped)}
            className="cursor-pointer min-h-[300px] sm:min-h-[400px]"
          >
            <GlassCard className="p-8 sm:p-12 flex items-center justify-center min-h-[300px] sm:min-h-[400px] transition-all">
              <div className="text-center max-w-lg">
                <p className="text-xs font-medium tracking-wider text-blue-600 dark:text-blue-400 uppercase mb-4">
                  {flipped ? "Answer" : "Question"}
                </p>
                <p className="text-xl sm:text-2xl font-medium leading-relaxed">
                  {flipped ? card?.back || card?.front : card?.front}
                </p>
                {flipped && card?.hint && (
                  <p className="mt-4 text-sm text-black/40 dark:text-white/40 italic">{card.hint}</p>
                )}
                <p className="mt-8 text-xs text-black/30 dark:text-white/30">
                  {flipped ? "Click to flip back" : "Click to reveal answer"}
                </p>
              </div>
            </GlassCard>
          </div>

          {flipped && (
            <div className="flex justify-center gap-3">
              <ReviewButton icon={XIcon} label="Again" color="bg-rose-500 hover:bg-rose-600" onClick={() => handleReview("again")} />
              <ReviewButton icon={Check} label="Good" color="bg-blue-500 hover:bg-blue-600" onClick={() => handleReview("good")} />
              <ReviewButton icon={BarChart3} label="Easy" color="bg-emerald-500 hover:bg-emerald-600" onClick={() => handleReview("easy")} />
            </div>
          )}

          <div className="flex justify-between text-sm text-black/30 dark:text-white/30">
            <button onClick={() => { setCurrentIndex(Math.max(0, currentIndex - 1)); setFlipped(false); }} disabled={currentIndex === 0} className="disabled:opacity-20 hover:text-black/60 dark:hover:text-white/60 transition-colors">
              <ChevronLeft className="h-4 w-4 inline" /> Previous
            </button>
            <button onClick={() => setFlipped(false)} className="hover:text-black/60 dark:hover:text-white/60 transition-colors">
              Skip <ChevronRight className="h-4 w-4 inline" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewButton({ icon: Icon, label, color, onClick }: { icon: LucideIcon; label: string; color: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-white transition-all ${color} active:scale-95`}>
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}
