export interface StudyBook {
  id: string;
  title: string;
  author: string | null;
  category: string | null;
  description: string | null;
  fileName: string;
  fileSize: number | null;
  totalPages: number | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  readingProgress?: {
    currentPage: number;
    totalPages: number;
    percentage: number;
    completed: boolean;
  } | null;
}

export interface BookHighlight {
  id: string;
  color: string;
  type: string;
  text: string;
  page: number;
  x: number | null;
  y: number | null;
  w: number | null;
  h: number | null;
  note: string | null;
  tags: string[];
  bookId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookNote {
  id: string;
  title: string;
  content: string;
  page: number | null;
  color: string;
  tags: string[];
  pinned: boolean;
  bookId: string;
  highlightId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookBookmark {
  id: string;
  page: number;
  label: string | null;
  color: string;
  bookId: string;
  createdAt: Date;
}

export interface BookFlashcard {
  id: string;
  front: string;
  back: string;
  hint: string | null;
  tags: string[];
  difficulty: number;
  nextReview: Date;
  interval: number;
  repetitions: number;
  easeFactor: number;
  bookId: string | null;
  highlightId: string | null;
  createdAt: Date;
}

export interface StudyStats {
  totalBooks: number;
  booksCompleted: number;
  totalHighlights: number;
  totalNotes: number;
  totalBookmarks: number;
  totalFlashcards: number;
  totalStudySessions: number;
  totalStudyMinutes: number;
  currentStreak: number;
  recentActivity: StudyActivity[];
}

export interface StudyActivity {
  id: string;
  type: "read" | "note" | "highlight" | "bookmark" | "flashcard";
  description: string;
  bookName: string;
  date: Date;
}

export interface StudySearchResult {
  type: "highlight" | "note" | "bookmark" | "flashcard";
  id: string;
  text: string;
  page: number | null;
  bookId: string;
  bookName: string;
  createdAt: string | Date;
}

export interface SearchResult {
  type: "highlight" | "note" | "bookmark" | "flashcard";
  id: string;
  text: string;
  page: number | null;
  bookId: string;
  bookName: string;
  createdAt: Date;
}
