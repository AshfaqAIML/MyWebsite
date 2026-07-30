import { ReadingProgress, Bookmark, Highlight, Note, ReadingSession, StudyStats } from './types';

const STORAGE_KEYS = {
  progresses: 'study_progresses',
  bookmarks: 'study_bookmarks',
  highlights: 'study_highlights',
  notes: 'study_notes',
  sessions: 'study_sessions',
  stats: 'study_stats',
};

function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch { /* storage full */ }
}

export function getProgresses(): Record<string, ReadingProgress> {
  return load(STORAGE_KEYS.progresses, {});
}

export function getBookProgress(bookId: string): ReadingProgress | null {
  return getProgresses()[bookId] || null;
}

export function saveProgress(progress: ReadingProgress): void {
  const all = getProgresses();
  all[progress.bookId] = progress;
  save(STORAGE_KEYS.progresses, all);
}

export function getBookmarks(bookId: string): Bookmark[] {
  const all = load<Record<string, Bookmark[]>>(STORAGE_KEYS.bookmarks, {});
  return all[bookId] || [];
}

export function addBookmark(bookId: string, bookmark: Bookmark): void {
  const all = load<Record<string, Bookmark[]>>(STORAGE_KEYS.bookmarks, {});
  if (!all[bookId]) all[bookId] = [];
  all[bookId].unshift(bookmark);
  save(STORAGE_KEYS.bookmarks, all);
}

export function removeBookmark(bookId: string, bookmarkId: string): void {
  const all = load<Record<string, Bookmark[]>>(STORAGE_KEYS.bookmarks, {});
  if (all[bookId]) {
    all[bookId] = all[bookId].filter(b => b.id !== bookmarkId);
    save(STORAGE_KEYS.bookmarks, all);
  }
}

export function getHighlights(bookId: string): Highlight[] {
  const all = load<Record<string, Highlight[]>>(STORAGE_KEYS.highlights, {});
  return all[bookId] || [];
}

export function addHighlight(bookId: string, highlight: Highlight): void {
  const all = load<Record<string, Highlight[]>>(STORAGE_KEYS.highlights, {});
  if (!all[bookId]) all[bookId] = [];
  all[bookId].unshift(highlight);
  save(STORAGE_KEYS.highlights, all);
}

export function removeHighlight(bookId: string, highlightId: string): void {
  const all = load<Record<string, Highlight[]>>(STORAGE_KEYS.highlights, {});
  if (all[bookId]) {
    all[bookId] = all[bookId].filter(h => h.id !== highlightId);
    save(STORAGE_KEYS.highlights, all);
  }
}

export function getNotes(bookId: string): Note[] {
  const all = load<Record<string, Note[]>>(STORAGE_KEYS.notes, {});
  return all[bookId] || [];
}

export function addNote(bookId: string, note: Note): void {
  const all = load<Record<string, Note[]>>(STORAGE_KEYS.notes, {});
  if (!all[bookId]) all[bookId] = [];
  all[bookId].unshift(note);
  save(STORAGE_KEYS.notes, all);
}

export function updateNote(bookId: string, noteId: string, content: string): void {
  const all = load<Record<string, Note[]>>(STORAGE_KEYS.notes, {});
  if (all[bookId]) {
    const idx = all[bookId].findIndex(n => n.id === noteId);
    if (idx !== -1) {
      all[bookId][idx].content = content;
      all[bookId][idx].updatedAt = new Date().toISOString();
      save(STORAGE_KEYS.notes, all);
    }
  }
}

export function removeNote(bookId: string, noteId: string): void {
  const all = load<Record<string, Note[]>>(STORAGE_KEYS.notes, {});
  if (all[bookId]) {
    all[bookId] = all[bookId].filter(n => n.id !== noteId);
    save(STORAGE_KEYS.notes, all);
  }
}

export function getReadingSessions(bookId: string): ReadingSession[] {
  const all = load<Record<string, ReadingSession[]>>(STORAGE_KEYS.sessions, {});
  return all[bookId] || [];
}

export function startSession(bookId: string): string {
  const id = `ses_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const session: ReadingSession = {
    id, bookId, startTime: new Date().toISOString(),
    endTime: null, pagesRead: 0, chaptersCompleted: [],
  };
  const all = load<Record<string, ReadingSession[]>>(STORAGE_KEYS.sessions, {});
  if (!all[bookId]) all[bookId] = [];
  all[bookId].unshift(session);
  save(STORAGE_KEYS.sessions, all);
  return id;
}

export function endSession(bookId: string, sessionId: string, pages: number): void {
  const all = load<Record<string, ReadingSession[]>>(STORAGE_KEYS.sessions, {});
  if (all[bookId]) {
    const idx = all[bookId].findIndex(s => s.id === sessionId);
    if (idx !== -1) {
      all[bookId][idx].endTime = new Date().toISOString();
      all[bookId][idx].pagesRead = pages;
      save(STORAGE_KEYS.sessions, all);
    }
  }
}

export function getStats(): StudyStats {
  return load(STORAGE_KEYS.stats, {
    totalBooks: 0, totalPagesRead: 0, totalReadingTime: 0,
    totalNotes: 0, totalHighlights: 0, totalBookmarks: 0,
    completedBooks: 0, currentStreak: 0, lastActiveDate: '',
  });
}

export function updateStats(partial: Partial<StudyStats>): void {
  const current = getStats();
  save(STORAGE_KEYS.stats, { ...current, ...partial });
}
