'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, BookOpen, Layers, PenSquare,
  Highlighter, Bookmark as BookmarkIcon, Sparkles, Maximize2, Minimize2,
  Sun, Moon, FileText, Clock, CheckCircle2, ArrowLeft,
  PanelLeftClose, PanelLeft, PanelRightClose, PanelRight,
  Plus, Trash2, Search, Circle, List,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import studyBooks from '../../../../../data/study-books.json';
import type { StudyBook, ReadingProgress, Chapter, ReadingMode, Note, Bookmark } from '@/lib/study/types';
import * as store from '@/lib/study/store';
import { getBookFileUrl, generateChapters, estimateTotalPages, generateId } from '@/lib/study/utils';
import type { PDFAnnotation, AnnotationTool } from '@/lib/study/pdf-annotations';
import { ANNOTATION_COLORS } from '@/lib/study/pdf-annotations';
import type { PDFViewerHandle } from '@/components/study/pdf-viewer';
import AnnotationToolbar from '@/components/study/annotation-toolbar';
import RichEditor from '@/components/study/rich-editor';
import AnnotationsSidebar from '@/components/study/annotations-sidebar';

const PDFViewer = dynamic(() => import('@/components/study/pdf-viewer'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-[#0f0f13]">
      <div className="text-center space-y-4">
        <div className="w-10 h-10 border-2 border-white/20 border-t-white/60 rounded-full animate-spin mx-auto" />
        <p className="text-sm text-white/60">Loading PDF viewer...</p>
      </div>
    </div>
  ),
});

const modes: { key: ReadingMode; label: string; icon: LucideIcon }[] = [
  { key: 'read', label: 'Read', icon: BookOpen },
  { key: 'study', label: 'Study', icon: PenSquare },
  { key: 'focus', label: 'Focus', icon: Maximize2 },
  { key: 'review', label: 'Review', icon: CheckCircle2 },
];

function ChapterTree({ chapters, progress, currentChapter, onSelect }: {
  chapters: Chapter[]; progress: ReadingProgress | null;
  currentChapter: string | null; onSelect: (ch: Chapter) => void;
}) {
  const ansi = (active: boolean, completed: boolean) =>
    active ? 'bg-white/[0.08] text-white' :
    completed ? 'text-white/60 hover:bg-white/[0.03] hover:text-white/80' :
    'text-white/60 hover:bg-white/[0.03] hover:text-white/60';

  return (
    <div className="space-y-0.5">
      {chapters.map(ch => {
        const completed = progress?.completedChapters.includes(ch.id);
        const active = currentChapter === ch.id;
        return (
          <button key={ch.id} onClick={() => onSelect(ch)}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center gap-2.5 ${ansi(active, !!completed)}`}>
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${completed ? 'bg-emerald-500' : active ? 'bg-white' : 'bg-white/20'}`} />
            <span className="truncate flex-1">{ch.title}</span>
            {completed && <CheckCircle2 className="h-3 w-3 text-emerald-500/70 shrink-0" />}
            <span className="text-[10px] text-white/50 shrink-0">p.{ch.pageStart}</span>
          </button>
        );
      })}
    </div>
  );
}

function NotesPanel({ bookId }: { bookId: string }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editNoteId, setEditNoteId] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState('');

  useEffect(() => { const t = setTimeout(() => setNotes(store.getNotes(bookId)), 0); return () => clearTimeout(t); }, [bookId]);

  function handleSave(content: string) {
    if (!content.trim()) return;
    if (editNoteId) {
      store.updateNote(bookId, editNoteId, content);
      setEditNoteId(null);
    } else {
      store.addNote(bookId, {
        id: generateId(), bookId, page: 0, chapterId: '',
        content, tags: [],
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      });
    }
    setEditorContent('');
    setShowEditor(false);
    setNotes(store.getNotes(bookId));
  }

  return (
    <div className="space-y-3">
      {showEditor ? (
        <div className="space-y-2">
          <RichEditor
            content={editorContent}
            onChange={setEditorContent}
            placeholder="Write your note..."
            minHeight="150px"
          />
          <div className="flex items-center gap-2">
            <button onClick={() => handleSave(editorContent)}
              className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.08] text-white/80 hover:bg-white/[0.12] transition-colors">
              {editNoteId ? 'Update' : 'Save'}
            </button>
            <button onClick={() => { setShowEditor(false); setEditorContent(''); setEditNoteId(null); }}
              className="px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-white/60 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowEditor(true)}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-white/[0.08] text-white/60 hover:text-white/60 hover:border-white/[0.15] transition-all text-xs">
          <Plus className="h-3.5 w-3.5" />
          New Note
        </button>
      )}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {notes.map(note => (
          <div key={note.id} className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.04] group">
            <div className="prose prose-invert prose-sm max-w-none text-xs text-white/70 leading-relaxed line-clamp-4"
              dangerouslySetInnerHTML={{ __html: note.content }} />
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-white/50">
                {new Date(note.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
              </span>
              <div className="flex items-center gap-1">
                <button onClick={() => { setEditNoteId(note.id); setEditorContent(note.content); setShowEditor(true); }}
                  className="opacity-0 group-hover:opacity-100 text-white/50 hover:text-white/60 transition-all text-[10px] px-1.5 py-0.5 rounded">
                  Edit
                </button>
                <button onClick={() => { store.removeNote(bookId, note.id); setNotes(store.getNotes(bookId)); }}
                  className="opacity-0 group-hover:opacity-100 text-white/50 hover:text-red-400 transition-all">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {notes.length === 0 && !showEditor && (
          <p className="text-xs text-white/50 text-center py-6">No notes yet</p>
        )}
      </div>
    </div>
  );
}

function AIPanel() {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.06]">
        <Sparkles className="h-5 w-5 text-white/60 mb-3" />
        <h3 className="text-sm font-medium text-white/70 mb-1">AI Study Assistant</h3>
        <p className="text-xs text-white/60 leading-relaxed">
          AI-powered summaries, explanations, quiz generation, flashcard creation, and concept mapping coming soon.
        </p>
      </div>
      <div className="space-y-2">
        {['Summarize Chapter', 'Generate Quiz', 'Explain Concept', 'Create Flashcards'].map(feature => (
          <button key={feature}
            className="w-full text-left px-3 py-2 rounded-lg text-xs text-white/60 hover:text-white/60 hover:bg-white/[0.03] transition-all">
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
  const viewerRef = useRef<PDFViewerHandle>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [readingMode, setReadingMode] = useState<ReadingMode>('read');
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(false);
  const [rightPanel, setRightPanel] = useState<'notes' | 'highlights' | 'bookmarks' | 'ai'>('notes');
  const [currentChapter, setCurrentChapter] = useState<string | null>(null);
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [activeTool, setActiveTool] = useState<AnnotationTool>('select');
  const [activeColor, setActiveColor] = useState(ANNOTATION_COLORS[0].value);
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [continuousScroll, setContinuousScroll] = useState(false);

  const [annotations, setAnnotations] = useState<PDFAnnotation[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const bookTotal = useMemo(() => book ? estimateTotalPages(book) : 0, [book]);
  const chapters = useMemo(() => book ? generateChapters(book) : [], [book]);

  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setFullscreen(false)).catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (book) {
      const existing = store.getBookProgress(book.id);
      const t = setTimeout(() => {
        if (existing) {
          setProgress(existing);
          setCurrentChapter(existing.currentChapter);
          setCurrentPage(existing.currentPage || 1);
        } else {
          const p: ReadingProgress = {
            bookId: book.id, currentPage: 1, totalPages: bookTotal,
            currentChapter: null, completedChapters: [], lastOpened: new Date().toISOString(),
            totalReadingTime: 0, completionPercentage: 0,
          };
          store.saveProgress(p);
          setProgress(p);
        }
        setBookmarks(store.getBookmarks(book.id));
        setSessionId(store.startSession(book.id));
      }, 0);
      return () => { clearTimeout(t); if (sessionId && book) store.endSession(book.id, sessionId, currentPage); };
    }
  }, [book?.id]);

  useEffect(() => {
    if (!progress || !totalPages) return;
    const pct = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;
    const updated: ReadingProgress = {
      ...progress, currentPage, lastOpened: new Date().toISOString(), completionPercentage: pct,
    };
    store.saveProgress(updated);
    const t = setTimeout(() => setProgress(updated), 0);
    return () => clearTimeout(t);
  }, [currentPage, totalPages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || (e.target as HTMLElement)?.isContentEditable) return;
      switch (e.key.toLowerCase()) {
        case 'arrowright': case ' ': setCurrentPage(p => Math.min(totalPages || bookTotal, p + 1)); break;
        case 'arrowleft': setCurrentPage(p => Math.max(1, p - 1)); break;
        case 'v': setActiveTool('select'); break;
        case 'h': setActiveTool('highlight'); break;
        case 'u': setActiveTool('underline'); break;
        case 'p': setActiveTool('pen'); break;
        case 'e': setActiveTool('eraser'); break;
        case 'r': setActiveTool('rectangle'); break;
        case 'l': setActiveTool('line'); break;
        case 'f': e.ctrlKey && handleFullscreen(); break;
        case 'escape': setFullscreen(false); break;
        case 'b': e.ctrlKey && setRightOpen(o => !o); break;
        case 'j': e.ctrlKey && setLeftOpen(o => !o); break;
      }
      if (e.key === '+' || e.key === '=') { viewerRef.current?.zoomIn(); }
      if (e.key === '-') { viewerRef.current?.zoomOut(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalPages, bookTotal]);

  const handleChapterSelect = useCallback((ch: Chapter) => {
    setCurrentChapter(ch.id);
    setCurrentPage(ch.pageStart);
    if (progress) {
      store.saveProgress({ ...progress, currentChapter: ch.id, lastOpened: new Date().toISOString() });
    }
  }, [progress]);

  const handleAddBookmark = useCallback(() => {
    if (!book) return;
    const bm = {
      id: generateId(), bookId: book.id, page: currentPage,
      chapterId: currentChapter || '', label: `Page ${currentPage}`,
      note: '', color: '#fef08a', createdAt: new Date().toISOString(),
    };
    store.addBookmark(book.id, bm);
    setBookmarks(store.getBookmarks(book.id));
  }, [book, currentPage, currentChapter]);

  const handleAnnotationCreate = useCallback((annotation: PDFAnnotation) => {
    setAnnotations(prev => [annotation, ...prev]);
    if (annotation.type === 'highlight') {
      store.addHighlight(bookId, {
        id: annotation.id, bookId, page: annotation.page,
        chapterId: currentChapter || '', text: annotation.text || '',
        color: annotation.color, note: '',
        createdAt: annotation.createdAt,
      });
    }
  }, [bookId, currentChapter]);

  const handleDeleteAnnotation = useCallback((id: string) => {
    setAnnotations(prev => prev.filter(a => a.id !== id));
    store.removeHighlight(bookId, id);
  }, [bookId]);

  const rightPanels = {
    notes: NotesPanel,
    highlights: () => (
      <AnnotationsSidebar
        annotations={annotations}
        bookmarks={bookmarks}
        currentPage={currentPage}
        onJumpToPage={setCurrentPage}
        onDeleteAnnotation={handleDeleteAnnotation}
        darkMode={darkMode}
      />
    ),
    bookmarks: () => (
      <div className="space-y-2">
        <button onClick={handleAddBookmark}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-white/[0.08] text-white/60 hover:text-white/60 hover:border-white/[0.15] transition-all text-xs">
          <Plus className="h-3.5 w-3.5" />
          Add Bookmark
        </button>
        <AnnotationsSidebar
          annotations={[]}
          bookmarks={bookmarks}
          currentPage={currentPage}
          onJumpToPage={setCurrentPage}
          onDeleteAnnotation={() => {}}
          darkMode={darkMode}
        />
      </div>
    ),
    ai: AIPanel,
  };
  const RightContent = rightPanels[rightPanel];

  if (!book) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 mb-4">Book not found</p>
          <Link href="/study-corner" className="text-sm text-white/60 hover:text-white transition-colors">Back to Library</Link>
        </div>
      </div>
    );
  }

  const pdfUrl = getBookFileUrl(book);

  return (
    <div className={`h-screen text-white flex flex-col overflow-hidden selection:bg-white/20 ${fullscreen ? 'bg-black' : 'bg-zinc-950'}`}>
      <header className={`shrink-0 h-12 border-b border-white/[0.04] flex items-center justify-between px-4 z-20 ${
        readingMode === 'focus' ? 'opacity-0 hover:opacity-100 transition-opacity' : 'bg-zinc-950/80 backdrop-blur-xl'
      }`}>
        <div className="flex items-center gap-2">
          <Link href="/study-corner" className="p-1.5 rounded-lg hover:bg-white/[0.04] text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="w-px h-4 bg-white/[0.06] mx-1" />
          <div className="flex items-center gap-2 text-sm">
            <span className="text-white/80 font-medium truncate max-w-[200px]">{book.title}</span>
            <span className="text-white/50 text-xs">—</span>
            <span className="text-white/60 text-xs">{book.author}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {modes.map(m => {
            const Icon = m.icon;
            return (
              <button key={m.key} onClick={() => setReadingMode(m.key)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  readingMode === m.key ? 'bg-white/[0.08] text-white' : 'text-white/60 hover:text-white/60 hover:bg-white/[0.03]'
                }`}>
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{m.label}</span>
              </button>
            );
          })}
          <div className="w-px h-4 bg-white/[0.06] mx-1" />
          <button onClick={handleAddBookmark} className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors" title="Add Bookmark (Ctrl+B)">
            <BookmarkIcon className="h-4 w-4" />
          </button>
          <button onClick={() => setContinuousScroll(s => !s)}
            className={`p-1.5 rounded-lg transition-colors ${continuousScroll ? 'text-white bg-white/[0.06]' : 'text-white/60 hover:text-white hover:bg-white/[0.04]'}`}
            title="Toggle Continuous Scroll">
            <List className="h-4 w-4" />
          </button>
          <button onClick={() => setDarkMode(!darkMode)} className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors">
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button onClick={handleFullscreen} className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors" title="Full Screen (Ctrl+F)">
            {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden" ref={containerRef}>
        <AnimatePresence>
          {leftOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="shrink-0 border-r border-white/[0.04] bg-zinc-950/50 overflow-hidden">
              <div className="w-[240px] h-full flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
                  <span className="text-xs font-medium text-white/50 flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5" />
                    Chapters
                  </span>
                  <button onClick={() => setLeftOpen(false)} className="text-white/50 hover:text-white transition-colors">
                    <PanelLeftClose className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto reader-scrollbar p-3">
                  <ChapterTree chapters={chapters} progress={progress} currentChapter={currentChapter} onSelect={handleChapterSelect} />
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {!leftOpen && (
          <button onClick={() => setLeftOpen(true)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-lg bg-zinc-900 border border-white/[0.06] text-white/60 hover:text-white transition-colors">
            <PanelLeft className="h-4 w-4" />
          </button>
        )}

        <main className={`flex-1 flex flex-col min-w-0 relative ${
          readingMode === 'focus' ? 'bg-black' : readingMode === 'review' ? 'bg-zinc-900' : 'bg-zinc-950'
        }`}>
          <div className="flex-1 relative flex flex-col">
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
              <AnnotationToolbar
                activeTool={activeTool}
                onToolChange={setActiveTool}
                activeColor={activeColor}
                onColorChange={setActiveColor}
                strokeWidth={strokeWidth}
                onStrokeWidthChange={setStrokeWidth}
                zoom={zoom}
                onZoomChange={setZoom}
                currentPage={currentPage}
                totalPages={totalPages || bookTotal}
                onPageChange={setCurrentPage}
                onFitToWidth={() => viewerRef.current?.fitToWidth()}
                onFitToPage={() => viewerRef.current?.fitToPage()}
                onFullscreen={handleFullscreen}
                darkMode={darkMode}
              />
            </div>

            <div className="flex-1 pt-16">
              <PDFViewer
                ref={viewerRef}
                pdfUrl={pdfUrl}
                page={currentPage}
                totalPages={totalPages || bookTotal}
                zoom={zoom}
                onPageChange={setCurrentPage}
                onTotalPages={setTotalPages}
                onZoomChange={setZoom}
                activeTool={activeTool}
                activeColor={activeColor}
                strokeWidth={strokeWidth}
                annotations={annotations}
                onAnnotationCreate={handleAnnotationCreate}
                continuousScroll={continuousScroll}
                darkMode={darkMode}
              />
            </div>
          </div>

          <div className={`shrink-0 h-10 border-t border-white/[0.04] flex items-center justify-between px-4 ${
            readingMode === 'focus' ? 'opacity-0 hover:opacity-100 transition-opacity' : 'bg-zinc-950/80 backdrop-blur-xl'
          }`}>
            <div className="flex items-center gap-3 text-[11px] text-white/60">
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {currentPage} / {totalPages || bookTotal}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {progress ? Math.round(progress.completionPercentage) : 0}%
              </span>
            </div>
            <div className="flex-1 max-w-md mx-4">
              <div className="h-1 rounded-full bg-white/[0.04] overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-white/40 to-white/20 transition-all duration-500"
                  style={{ width: `${progress ? progress.completionPercentage : 0}%` }} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setRightOpen(true); setRightPanel('notes'); }}
                className="px-3 py-1 rounded-lg text-[11px] font-medium text-white/50 hover:text-white/70 hover:bg-white/[0.04] transition-colors">
                Notes
              </button>
            </div>
          </div>
        </main>

        <AnimatePresence>
          {rightOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="shrink-0 border-l border-white/[0.04] bg-zinc-950/50 overflow-hidden">
              <div className="w-[320px] h-full flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
                  <div className="flex items-center gap-1">
                    {[
                      { key: 'notes' as const, icon: PenSquare },
                      { key: 'highlights' as const, icon: Highlighter },
                      { key: 'bookmarks' as const, icon: BookmarkIcon },
                      { key: 'ai' as const, icon: Sparkles },
                    ].map(item => {
                      const Icon = item.icon;
                      return (
                        <button key={item.key} onClick={() => setRightPanel(item.key)}
                          className={`p-1.5 rounded-lg transition-colors ${rightPanel === item.key ? 'bg-white/[0.08] text-white' : 'text-white/50 hover:text-white/60 hover:bg-white/[0.03]'}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </button>
                      );
                    })}
                  </div>
                  <button onClick={() => setRightOpen(false)} className="text-white/50 hover:text-white transition-colors">
                    <PanelRightClose className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto reader-scrollbar p-4">
                  <RightContent bookId={book.id} />
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {!rightOpen && (
          <button onClick={() => { setRightOpen(true); setRightPanel('notes'); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-lg bg-zinc-900 border border-white/[0.06] text-white/60 hover:text-white transition-colors">
            <PanelRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
