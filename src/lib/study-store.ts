import { create } from "zustand";
import type { StudyBook, BookHighlight, BookNote, BookBookmark, BookFlashcard, StudyStats, StudySearchResult } from "@/lib/study-types";

interface StudyStore {
  sidebarOpen: boolean;
  sidebarView: "library" | "highlights" | "notes" | "bookmarks" | "flashcards" | "search";
  currentBook: StudyBook | null;
  currentPage: number;
  totalPages: number;
  books: StudyBook[];
  highlights: BookHighlight[];
  notes: BookNote[];
  bookmarks: BookBookmark[];
  flashcards: BookFlashcard[];
  stats: StudyStats | null;
  readerMode: "single" | "continuous";
  readerTheme: "light" | "dark" | "sepia";
  searchQuery: string;
  searchResults: StudySearchResult[];
  loading: boolean;

  setSidebarOpen: (open: boolean) => void;
  setSidebarView: (view: StudyStore["sidebarView"]) => void;
  setCurrentBook: (book: StudyBook | null) => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
  setBooks: (books: StudyBook[]) => void;
  setHighlights: (highlights: BookHighlight[]) => void;
  setNotes: (notes: BookNote[]) => void;
  setBookmarks: (bookmarks: BookBookmark[]) => void;
  setFlashcards: (flashcards: BookFlashcard[]) => void;
  setStats: (stats: StudyStats | null) => void;
  setReaderMode: (mode: "single" | "continuous") => void;
  setReaderTheme: (theme: "light" | "dark" | "sepia") => void;
  setSearchQuery: (q: string) => void;
  setSearchResults: (results: StudySearchResult[]) => void;
  setLoading: (loading: boolean) => void;
  toggleSidebar: () => void;

  fetchBooks: (userId?: string) => Promise<void>;
  fetchHighlights: (bookId: string, userId?: string) => Promise<void>;
  fetchNotes: (bookId: string, userId?: string) => Promise<void>;
  fetchBookmarks: (bookId: string, userId?: string) => Promise<void>;
  fetchFlashcards: (bookId?: string, userId?: string) => Promise<void>;
  fetchStats: (userId?: string) => Promise<void>;
}

export const useStudyStore = create<StudyStore>((set, get) => ({
  sidebarOpen: true,
  sidebarView: "library",
  currentBook: null,
  currentPage: 1,
  totalPages: 0,
  books: [],
  highlights: [],
  notes: [],
  bookmarks: [],
  flashcards: [],
  stats: null,
  readerMode: "single",
  readerTheme: "light",
  searchQuery: "",
  searchResults: [],
  loading: false,

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSidebarView: (view) => set({ sidebarView: view }),
  setCurrentBook: (book) => set({ currentBook: book }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setTotalPages: (pages) => set({ totalPages: pages }),
  setBooks: (books) => set({ books }),
  setHighlights: (highlights) => set({ highlights }),
  setNotes: (notes) => set({ notes }),
  setBookmarks: (bookmarks) => set({ bookmarks }),
  setFlashcards: (flashcards) => set({ flashcards }),
  setStats: (stats) => set({ stats }),
  setReaderMode: (mode) => set({ readerMode: mode }),
  setReaderTheme: (theme) => set({ readerTheme: theme }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSearchResults: (results) => set({ searchResults: results }),
  setLoading: (loading) => set({ loading }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  fetchBooks: async (userId = "default") => {
    const res = await fetch(`/api/study/books?userId=${userId}`);
    const books = await res.json();
    set({ books });
  },

  fetchHighlights: async (bookId, userId = "default") => {
    const res = await fetch(`/api/study/highlights?bookId=${bookId}&userId=${userId}`);
    const highlights = await res.json();
    set({ highlights });
  },

  fetchNotes: async (bookId, userId = "default") => {
    const res = await fetch(`/api/study/notes?bookId=${bookId}&userId=${userId}`);
    const notes = await res.json();
    set({ notes });
  },

  fetchBookmarks: async (bookId, userId = "default") => {
    const res = await fetch(`/api/study/bookmarks?bookId=${bookId}&userId=${userId}`);
    const bookmarks = await res.json();
    set({ bookmarks });
  },

  fetchFlashcards: async (bookId, userId = "default") => {
    const params = new URLSearchParams({ userId });
    if (bookId) params.set("bookId", bookId);
    const res = await fetch(`/api/study/flashcards?${params}`);
    const flashcards = await res.json();
    set({ flashcards });
  },

  fetchStats: async (userId = "default") => {
    const res = await fetch(`/api/study/stats?userId=${userId}`);
    const stats = await res.json();
    set({ stats });
  },
}));
