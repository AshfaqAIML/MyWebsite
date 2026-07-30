"use client";

import { useEffect } from "react";
import { useStudyStore } from "@/lib/study-store";

export function useStudyData() {
  const { stats, fetchStats, books, fetchBooks, flashcards, fetchFlashcards, loading } = useStudyStore();

  useEffect(() => {
    fetchStats();
    fetchBooks();
    fetchFlashcards();
  }, [fetchStats, fetchBooks, fetchFlashcards]);

  return { stats, books, flashcards, loading };
}
