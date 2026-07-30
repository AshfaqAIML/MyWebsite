'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, BookOpen, Layers, PenSquare,
  Highlighter, Bookmark, Sparkles, Maximize2, Minimize2,
  Sun, Moon, FileText, Clock, CheckCircle2, List,
  PanelLeftClose, PanelLeft, PanelRightClose, PanelRight,
  ArrowLeft, Search, Plus, Trash2, RotateCcw,
  GripHorizontal, X,
} from 'lucide-react';
import Link from 'next/link';
import studyBooks from '../../../../../data/study-books.json';
import type { StudyBook, StudyStore, ReadingProgress, Chapter, ReadingMode, Note, Highlight, Bookmark as BookmarkType } from '@/lib/study/types';
import * as store from '@/lib/study/store';
import { getBookFileUrl, generateChapters, estimateTotalPages, generateId } from '@/lib/study/utils';

const modes: { key: ReadingMode; label: string; icon: any }[] = [
  { key: 'read', label: 'Read', icon: BookOpen },
  { key: 'study', label: 'Study', icon: PenSquare },
  { key: 'focus', label: 'Focus', icon: Maximize2 },
  { key: 'review', label: 'Review', icon: CheckCircle2 },
];

function ChapterTree({ chapters, progress, currentChapter, onSelect }: {
  chapters: Chapter[]; progress: ReadingProgress | null;
  currentChapter: string | null; onSelect: (ch: Chapter) => void;
}) {
  return (
    <div className="space-y-0.5">
      {chapters.map(ch => {
        const completed = progress?.completedChapters.includes(ch.id);
        const active = currentChapter === ch.id;
        return (
          <button
            key={ch.id}
            onClick={() => onSelect(ch)}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center gap-2.5 ${
              active
                ? 'bg-white/[0.08] text-white'
                : completed
                  ? 'text-white/60 hover:bg-white/[0.03] hover:text-white/80'
                  : 'text-white/40 hover:bg-white/[0.03] hover:text-white/60'
            }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              completed ? 'bg-emerald-500' : active ? 'bg-white' : 'bg-white/20'
            }`} />
            <span className="truncate flex-1">{ch.title}</span>
            {completed && <CheckCircle2 className="h-3 w-3 text-emerald-500/70 shrink-0" />}
            <span className="text-[10px] text-white/30 shrink-0">p.{ch.pageStart}</span>
          </button>
        );
      })}
    </div>
  );
}

function NotesPanel({ bookId }: { bookId: string }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => { setNotes(store.getNotes(bookId)); }, [bookId]);

  function handleAdd() {
    if (!newNote.trim()) return;
    store.addNote(bookId, {
      id: generateId(), bookId, page: 0, chapterId: '',
      content: newNote.trim(), tags: [],
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    setNotes(store.getNotes(bookId));
    setNewNote('');
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type="text" value={newNote}
            onChange={e => setNewNote(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
            placeholder="Write a note..."
            className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-white/80 placeholder:text-white/25 focus:outline-none focus:border-white/[0.12] transition-all"
          />
        </div>
        <button onClick={handleAdd} className="p-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white/60 transition-colors">
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {notes.map(note => (
          <div key={note.id} className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.04] group">
            <p className="text-xs text-white/70 leading-relaxed">{note.content}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-white/30">
                {new Date(note.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
              </span>
              <button
                onClick={() => { store.removeNote(bookId, note.id); setNotes(store.getNotes(bookId)); }}
                className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-all"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
        {notes.length === 0 && (
          <p className="text-xs text-white/30 text-center py-6">No notes yet</p>
        )}
      </div>
    </div>
  );
}

function HighlightsPanel({ bookId }: { bookId: string }) {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  useEffect(() => { setHighlights(store.getHighlights(bookId)); }, [bookId]);

  return (
    <div className="space-y-2">
      {highlights.length === 0 ? (
        <p className="text-xs text-white/30 text-center py-6">No highlights yet</p>
      ) : (
        highlights.map(h => (
          <div key={h.id} className="p-3 rounded-lg border-l-2 space-y-1" style={{ borderLeftColor: h.color, backgroundColor: `${h.color}10` }}>
            <p className="text-xs text-white/70 leading-relaxed line-clamp-3">{h.text}</p>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/30">p.{h.page}</span>
              <button
                onClick={() => { store.removeHighlight(bookId, h.id); setHighlights(store.getHighlights(bookId)); }}
                className="text-white/20 hover:text-red-400 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function BookmarksPanel({ bookId }: { bookId: string }) {
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  useEffect(() => { setBookmarks(store.getBookmarks(bookId)); }, [bookId]);

  return (
    <div className="space-y-2">
      {bookmarks.length === 0 ? (
        <p className="text-xs text-white/30 text-center py-6">No bookmarks yet</p>
      ) : (
        bookmarks.map(b => (
          <div key={b.id} className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.04] group">
            <div className="flex items-start gap-2">
              <Bookmark className="h-3 w-3 mt-0.5 shrink-0" fill={b.color} color={b.color} />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-white/70 truncate">{b.label || 'Bookmark'}</p>
                <p className="text-[10px] text-white/30">Page {b.page}</p>
              </div>
              <button
                onClick={() => { store.removeBookmark(bookId, b.id); setBookmarks(store.getBookmarks(bookId)); }}
                className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-all"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function AIPanel() {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.06]">
        <Sparkles className="h-5 w-5 text-white/40 mb-3" />
        <h3 className="text-sm font-medium text-white/70 mb-1">AI Study Assistant</h3>
        <p className="text-xs text-white/40 leading-relaxed">
          AI-powered summaries, explanations, quiz generation, flashcard creation, and concept mapping coming soon.
        </p>
      </div>
      <div className="space-y-2">
        {['Summarize Chapter', 'Generate Quiz', 'Explain Concept', 'Create Flashcards'].map(feature => (
          <button
            key={feature}
            className="w-full text-left px-3 py-2 rounded-lg text-xs text-white/40 hover:text-white/60 hover:bg-white/[0.03] transition-all"
          >
            {feature}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ReadingPage() {
  const params = useParams();
  const bookId = params.id as string;
  const book = (studyBooks as StudyBook[]).find(b => b.id === bookId);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [readingMode, setReadingMode] = useState<ReadingMode>('read');
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(false);
  const [rightPanel, setRightPanel] = useState<'notes' | 'highlights' | 'bookmarks' | 'ai'>('notes');
  const [currentChapter, setCurrentChapter] = useState<string | null>(null);
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);

  const chapters = useMemo(() => book ? generateChapters(book) : [], [book]);

  useEffect(() => {
    if (book) {
      const existing = store.getBookProgress(book.id);
      if (existing) {
        setProgress(existing);
        setCurrentChapter(existing.currentChapter);
      } else {
        const p: ReadingProgress = {
          bookId: book.id, currentPage: 0, totalPages: estimateTotalPages(book.size),
          currentChapter: null, completedChapters: [], lastOpened: new Date().toISOString(),
          totalReadingTime: 0, completionPercentage: 0,
        };
        store.saveProgress(p);
        setProgress(p);
      }
      const sid = store.startSession(book.id);
      setSessionId(sid);
    }
    return () => {
      if (sessionId && book) store.endSession(book.id, sessionId, progress?.currentPage || 0);
    };
  }, [book?.id]);

  const handleChapterSelect = useCallback((ch: Chapter) => {
    setCurrentChapter(ch.id);
    if (progress) {
      store.saveProgress({
        ...progress,
        currentChapter: ch.id,
        lastOpened: new Date().toISOString(),
      });
    }
  }, [progress]);

  const handleAddBookmark = useCallback(() => {
    if (!book || !progress) return;
    const bm: BookmarkType = {
      id: generateId(), bookId: book.id, page: progress.currentPage || 1,
      chapterId: currentChapter || '', label: `Page ${progress.currentPage || 1}`,
      note: '', color: '#fef08a', createdAt: new Date().toISOString(),
    };
    store.addBookmark(book.id, bm);
  }, [book, progress, currentChapter]);

  const rightPanels = { notes: NotesPanel, highlights: HighlightsPanel, bookmarks: BookmarksPanel, ai: AIPanel };
  const RightContent = rightPanels[rightPanel];

  if (!book) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 mb-4">Book not found</p>
          <Link href="/study-corner" className="text-sm text-white/40 hover:text-white transition-colors">Back to Library</Link>
        </div>
      </div>
    );
  }

  const pdfUrl = getBookFileUrl(book);

  return (
    <div className="h-screen bg-zinc-950 text-white flex flex-col overflow-hidden selection:bg-white/20">
      {/* Top Bar */}
      <header className="shrink-0 h-12 border-b border-white/[0.04] flex items-center justify-between px-4 bg-zinc-950/80 backdrop-blur-xl z-20">
        <div className="flex items-center gap-2">
          <Link href="/study-corner" className="p-1.5 rounded-lg hover:bg-white/[0.04] text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="w-px h-4 bg-white/[0.06] mx-1" />
          <div className="flex items-center gap-2 text-sm">
            <span className="text-white/80 font-medium truncate max-w-[200px]">{book.title}</span>
            <span className="text-white/30 text-xs">—</span>
            <span className="text-white/40 text-xs">{book.author}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {modes.map(m => {
            const Icon = m.icon;
            return (
              <button
                key={m.key}
                onClick={() => setReadingMode(m.key)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  readingMode === m.key
                    ? 'bg-white/[0.08] text-white'
                    : 'text-white/40 hover:text-white/60 hover:bg-white/[0.03]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{m.label}</span>
              </button>
            );
          })}
          <div className="w-px h-4 bg-white/[0.06] mx-1" />
          <button onClick={handleAddBookmark} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.04] transition-colors" title="Add Bookmark">
            <Bookmark className="h-4 w-4" />
          </button>
          <button onClick={() => { setDarkMode(!darkMode); }} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.04] transition-colors">
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Chapters */}
        <AnimatePresence>
          {leftOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="shrink-0 border-r border-white/[0.04] bg-zinc-950/50 overflow-hidden"
            >
              <div className="w-[240px] h-full flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
                  <span className="text-xs font-medium text-white/50 flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5" />
                    Chapters
                  </span>
                  <button onClick={() => setLeftOpen(false)} className="text-white/30 hover:text-white transition-colors">
                    <PanelLeftClose className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-3">
                  <ChapterTree
                    chapters={chapters}
                    progress={progress}
                    currentChapter={currentChapter}
                    onSelect={handleChapterSelect}
                  />
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Toggle Left */}
        {!leftOpen && (
          <button onClick={() => setLeftOpen(true)} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-lg bg-zinc-900 border border-white/[0.06] text-white/40 hover:text-white transition-colors">
            <PanelLeft className="h-4 w-4" />
          </button>
        )}

        {/* Center - PDF/Reader */}
        <main className={`flex-1 flex flex-col min-w-0 ${readingMode === 'focus' ? 'bg-black' : readingMode === 'review' ? 'bg-zinc-900' : 'bg-zinc-950'}`}>
          <div className="flex-1 relative">
            {readingMode === 'focus' ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center max-w-lg">
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-6 w-6 text-white/30" />
                  </div>
                  <h3 className="text-lg font-medium text-white/70 mb-2">Focus Mode</h3>
                  <p className="text-sm text-white/40 leading-relaxed">
                    Minimize distractions and immerse yourself in deep reading. Scroll through the content with a clean, minimal interface.
                  </p>
                  <button onClick={() => setReadingMode('read')} className="mt-6 px-4 py-2 rounded-xl bg-white/[0.06] text-white/70 text-sm hover:bg-white/[0.1] transition-colors">
                    Exit Focus Mode
                  </button>
                </div>
              </div>
            ) : (
              <iframe
                ref={iframeRef}
                src={pdfUrl}
                className="w-full h-full border-none"
                title={book.title}
              />
            )}
          </div>

          {/* Bottom Progress Bar */}
          <div className="shrink-0 h-10 border-t border-white/[0.04] flex items-center justify-between px-4 bg-zinc-950/80 backdrop-blur-xl">
            <div className="flex items-center gap-3 text-[11px] text-white/40">
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {progress?.currentPage || 0} / {progress?.totalPages || 0}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {Math.round(progress?.completionPercentage || 0)}%
              </span>
            </div>
            <div className="flex-1 max-w-md mx-4">
              <div className="h-1 rounded-full bg-white/[0.04] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-white/40 to-white/20 transition-all duration-500"
                  style={{ width: `${progress?.completionPercentage || 0}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {readingMode === 'study' && (
                <button className="px-3 py-1 rounded-lg text-[11px] font-medium bg-white/[0.06] text-white/70 hover:bg-white/[0.1] transition-colors flex items-center gap-1.5">
                  <Search className="h-3 w-3" />
                  Search
                </button>
              )}
              <button
                onClick={() => { setRightOpen(true); setRightPanel('notes'); }}
                className="px-3 py-1 rounded-lg text-[11px] font-medium text-white/50 hover:text-white/70 hover:bg-white/[0.04] transition-colors"
              >
                Notes
              </button>
            </div>
          </div>
        </main>

        {/* Right Sidebar - Notes / Highlights / Bookmarks / AI */}
        <AnimatePresence>
          {rightOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="shrink-0 border-l border-white/[0.04] bg-zinc-950/50 overflow-hidden"
            >
              <div className="w-[300px] h-full flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
                  <div className="flex items-center gap-1">
                    {[
                      { key: 'notes' as const, icon: PenSquare },
                      { key: 'highlights' as const, icon: Highlighter },
                      { key: 'bookmarks' as const, icon: Bookmark },
                      { key: 'ai' as const, icon: Sparkles },
                    ].map(item => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.key}
                          onClick={() => setRightPanel(item.key)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            rightPanel === item.key
                              ? 'bg-white/[0.08] text-white'
                              : 'text-white/30 hover:text-white/60 hover:bg-white/[0.03]'
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </button>
                      );
                    })}
                  </div>
                  <button onClick={() => setRightOpen(false)} className="text-white/30 hover:text-white transition-colors">
                    <PanelRightClose className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <RightContent bookId={book.id} />
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Toggle Right */}
        {!rightOpen && (
          <button onClick={() => { setRightOpen(true); setRightPanel('notes'); }} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-lg bg-zinc-900 border border-white/[0.06] text-white/40 hover:text-white transition-colors">
            <PanelRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
