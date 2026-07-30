export interface StudyBook {
  id: string;
  title: string;
  author: string;
  category: string;
  tags: string[];
  description: string;
  size: string;
  source: string;
  chapters?: { title: string; pageStart: number }[];
}

export interface Chapter {
  id: string;
  bookId: string;
  title: string;
  number: number;
  pageStart: number;
  pageEnd: number;
  sections: Section[];
}

export interface Section {
  id: string;
  chapterId: string;
  title: string;
  number: number;
  page: number;
}

export interface ReadingProgress {
  bookId: string;
  currentPage: number;
  totalPages: number;
  currentChapter: string | null;
  completedChapters: string[];
  lastOpened: string;
  totalReadingTime: number;
  completionPercentage: number;
}

export interface Bookmark {
  id: string;
  bookId: string;
  page: number;
  chapterId: string;
  label: string;
  note: string;
  color: string;
  createdAt: string;
}

export interface Highlight {
  id: string;
  bookId: string;
  page: number;
  chapterId: string;
  text: string;
  color: string;
  note: string;
  createdAt: string;
}

export interface Note {
  id: string;
  bookId: string;
  page: number;
  chapterId: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StudyStats {
  totalBooks: number;
  totalPagesRead: number;
  totalReadingTime: number;
  totalNotes: number;
  totalHighlights: number;
  totalBookmarks: number;
  completedBooks: number;
  currentStreak: number;
  lastActiveDate: string;
}

export interface ReadingSession {
  id: string;
  bookId: string;
  startTime: string;
  endTime: string | null;
  pagesRead: number;
  chaptersCompleted: string[];
}

export type ReadingMode = 'read' | 'study' | 'focus' | 'review';

export type SidebarPanel = 'none' | 'chapters' | 'notes' | 'highlights' | 'bookmarks' | 'ai';

export interface StudyStore {
  books: StudyBook[];
  progresses: Record<string, ReadingProgress>;
  bookmarks: Record<string, Bookmark[]>;
  highlights: Record<string, Highlight[]>;
  notes: Record<string, Note[]>;
  sessions: ReadingSession[];
  stats: StudyStats;
}
