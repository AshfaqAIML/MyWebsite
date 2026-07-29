"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  PanelLeftClose, PanelLeft, Bookmark, FileText, Highlighter, StickyNote,
  BrainCircuit, Search, ChevronLeft, ChevronRight, Sun, Moon, Monitor,
  List, Grid3X3, Plus, X, Trash2,
} from "lucide-react";
import type { BookHighlight, BookNote, BookBookmark, BookFlashcard } from "@/lib/study-types";

type Theme = "light" | "dark" | "sepia";
type SidebarTab = "contents" | "highlights" | "notes" | "bookmarks" | "flashcards" | "search";

const COLORS = ["yellow", "green", "blue", "pink", "purple", "orange"];

export default function StudyReaderPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.bookId as string;

  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.2);
  const [theme, setTheme] = useState<Theme>("light");
  const [sidebar, setSidebar] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("contents");
  const [highlights, setHighlights] = useState<BookHighlight[]>([]);
  const [notes, setNotes] = useState<BookNote[]>([]);
  const [bookmarks, setBookmarks] = useState<BookBookmark[]>([]);
  const [cards, setCards] = useState<BookFlashcard[]>([]);
  const [selColor, setSelColor] = useState("yellow");
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [notePage, setNotePage] = useState(0);
  const [noteHighlightId, setNoteHighlightId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const renderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/study/books?userId=default`);
        const books = await res.json();
        const b = books.find((x: any) => x.id === bookId);
        if (!b) { setError("Book not found"); setLoading(false); return; }
        setBook(b);

        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        const pdfRes = await fetch(`/api/books/pdf?file=${encodeURIComponent(b.fileName)}&mode=read`);
        if (!pdfRes.ok) { setError("Failed to load PDF"); setLoading(false); return; }
        const data = await pdfRes.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data }).promise;
        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);

        const [hlRes, ntRes, bmRes, fcRes] = await Promise.all([
          fetch(`/api/study/highlights?bookId=${bookId}&userId=default`),
          fetch(`/api/study/notes?bookId=${bookId}&userId=default`),
          fetch(`/api/study/bookmarks?bookId=${bookId}&userId=default`),
          fetch(`/api/study/flashcards?bookId=${bookId}&userId=default`),
        ]);
        setHighlights(await hlRes.json());
        setNotes(await ntRes.json());
        setBookmarks(await bmRes.json());
        setCards(await fcRes.json());

        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    };
    load();
  }, [bookId]);

  const renderPage = useCallback(async (num: number) => {
    if (!pdfDoc || !renderRef.current) return;
    const page = await pdfDoc.getPage(num);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    canvas.style.width = "100%";
    canvas.style.height = "auto";
    canvas.style.borderRadius = "8px";
    canvas.style.boxShadow = "0 2px 12px rgba(0,0,0,0.1)";
    renderRef.current.innerHTML = "";
    renderRef.current.appendChild(canvas);
    await page.render({ canvas, viewport, background: "white" }).promise;
    const saved = localStorage.getItem(`progress_${bookId}`);
    if (saved) {
      const p = JSON.parse(saved);
      if (p.currentPage) setPageNum(p.currentPage);
    }
  }, [pdfDoc, scale, bookId]);

  useEffect(() => { renderPage(pageNum); }, [pageNum, renderPage]);

  const saveProgress = useCallback((page: number) => {
    if (!totalPages) return;
    const pct = Math.round((page / totalPages) * 100);
    fetch(`/api/study/progress`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId, currentPage: page, totalPages, userId: "default" }),
    });
    localStorage.setItem(`progress_${bookId}`, JSON.stringify({ currentPage: page, totalPages: totalPages, percentage: pct }));
  }, [bookId, totalPages]);

  const goPage = (n: number) => {
    const p = Math.max(1, Math.min(n, totalPages));
    setPageNum(p);
    saveProgress(p);
  };

  const addBookmark = async () => {
    const label = prompt("Bookmark name (optional):");
    const res = await fetch("/api/study/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId, page: pageNum, label: label || undefined, userId: "default" }),
    });
    if (res.ok) {
      const bm = await res.json();
      setBookmarks((prev) => [...prev, bm]);
    }
  };

  const deleteBookmark = async (id: string) => {
    await fetch(`/api/study/bookmarks?id=${id}`, { method: "DELETE" });
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const addNote = async () => {
    if (!noteText.trim()) return;
    const res = await fetch("/api/study/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookId, content: noteText, page: notePage, title: `Note on page ${notePage}`,
        highlightId: noteHighlightId, userId: "default",
      }),
    });
    if (res.ok) {
      const n = await res.json();
      setNotes((prev) => [n, ...prev]);
      setShowNoteModal(false);
      setNoteText("");
      setNoteHighlightId(null);
    }
  };

  const deleteHighlight = async (id: string) => {
    await fetch(`/api/study/highlights?id=${id}`, { method: "DELETE" });
    setHighlights((prev) => prev.filter((h) => h.id !== id));
  };

  const deleteNote = async (id: string) => {
    await fetch(`/api/study/notes?id=${id}`, { method: "DELETE" });
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const createFlashcard = async (highlight: BookHighlight) => {
    const res = await fetch("/api/study/flashcards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookId, front: highlight.text, back: "", highlightId: highlight.id, userId: "default",
      }),
    });
    if (res.ok) {
      const c = await res.json();
      setCards((prev) => [c, ...prev]);
    }
  };

  const doSearch = async (q: string) => {
    setSearchQuery(q);
    if (q.length < 2) { setSearchResults([]); return; }
    const res = await fetch(`/api/study/search?q=${encodeURIComponent(q)}&userId=default`);
    setSearchResults(await res.json());
  };

  const themeClasses: Record<Theme, string> = {
    light: "bg-white text-zinc-900",
    dark: "bg-zinc-950 text-zinc-100",
    sepia: "bg-amber-50 text-amber-900",
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 pt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-zinc-500">Loading book...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 pt-16">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button onClick={() => router.back()} className="text-blue-600 hover:underline text-sm">Go back</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col ${themeClasses[theme]} pt-16`}>
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebar(!sidebar)} className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            {sidebar ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
          </button>
          <span className="text-sm font-medium truncate max-w-[200px]">{book?.title || "Reader"}</span>
          <span className="text-xs text-zinc-400 hidden sm:inline">{pageNum} / {totalPages}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={addBookmark} className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" title="Bookmark this page">
            <Bookmark className="h-4 w-4" />
          </button>
          {(["light", "sepia", "dark"] as Theme[]).map((t) => (
            <button key={t} onClick={() => setTheme(t)}
              className={`p-1.5 rounded-lg transition-colors ${theme === t ? "bg-zinc-200 dark:bg-zinc-700" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}
            >
              {t === "light" ? <Sun className="h-4 w-4" /> : t === "dark" ? <Moon className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
            </button>
          ))}
          <select value={Math.round(scale * 100)} onChange={(e) => setScale(parseInt(e.target.value) / 100)}
            className="ml-2 text-xs bg-transparent border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1"
          >
            {[75, 100, 125, 150, 200].map((z) => (<option key={z} value={z}>{z}%</option>))}
          </select>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebar && (
          <aside className="w-72 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col shrink-0 overflow-hidden">
            <div className="flex border-b border-zinc-200 dark:border-zinc-800">
              {[
                { id: "contents" as SidebarTab, icon: List },
                { id: "highlights" as SidebarTab, icon: Highlighter },
                { id: "notes" as SidebarTab, icon: StickyNote },
                { id: "bookmarks" as SidebarTab, icon: Bookmark },
                { id: "flashcards" as SidebarTab, icon: BrainCircuit },
                { id: "search" as SidebarTab, icon: Search },
              ].map(({ id, icon: Icon }) => (
                <button key={id} onClick={() => setSidebarTab(id)}
                  className={`flex-1 p-2.5 flex justify-center transition-colors ${sidebarTab === id ? "bg-white dark:bg-zinc-800 border-b-2 border-zinc-900 dark:border-white" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}
                  title={id.charAt(0).toUpperCase() + id.slice(1)}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {sidebarTab === "search" && (
                <div className="space-y-3">
                  <input value={searchQuery} onChange={(e) => doSearch(e.target.value)}
                    placeholder="Search notes, highlights..."
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                  {searchResults.map((r: any) => (
                    <div key={r.id} className="p-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 cursor-pointer hover:border-blue-300"
                      onClick={() => r.page && goPage(r.page)}
                    >
                      <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1 capitalize">{r.type}</p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">{r.text}</p>
                      {r.page && <p className="text-[10px] text-zinc-400 mt-1">Page {r.page}</p>}
                    </div>
                  ))}
                  {searchQuery.length >= 2 && searchResults.length === 0 && (
                    <p className="text-xs text-zinc-400 text-center py-4">No results found</p>
                  )}
                </div>
              )}

              {sidebarTab === "highlights" && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 mb-2">
                    {COLORS.map((c) => (
                      <button key={c} onClick={() => setSelColor(c)}
                        className={`w-5 h-5 rounded-full border-2 ${selColor === c ? "border-zinc-900 dark:border-white" : "border-transparent"} transition-colors`}
                        style={{ backgroundColor: c === "yellow" ? "#eab308" : c === "green" ? "#22c55e" : c === "blue" ? "#3b82f6" : c === "pink" ? "#ec4899" : c === "purple" ? "#a855f7" : "#f97316" }}
                      />
                    ))}
                  </div>
                  {highlights.length === 0 && <p className="text-xs text-zinc-400 text-center py-4">No highlights yet. Select text in the PDF to highlight.</p>}
                  {highlights.map((h) => (
                    <div key={h.id} className="p-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 group">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-zinc-400">Page {h.page}</span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setNotePage(h.page); setNoteHighlightId(h.id); setShowNoteModal(true); }}
                            className="p-0.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700">
                            <Plus className="h-3 w-3" />
                          </button>
                          <button onClick={() => createFlashcard(h)} className="p-0.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700">
                            <BrainCircuit className="h-3 w-3" />
                          </button>
                          <button onClick={() => deleteHighlight(h.id)} className="p-0.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700 text-red-400">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">{h.text}</p>
                      <span className="inline-block w-2 h-2 rounded-full mt-1.5" style={{ backgroundColor: h.color === "yellow" ? "#eab308" : h.color === "green" ? "#22c55e" : h.color === "blue" ? "#3b82f6" : h.color === "pink" ? "#ec4899" : h.color === "purple" ? "#a855f7" : "#f97316" }} />
                    </div>
                  ))}
                </div>
              )}

              {sidebarTab === "notes" && (
                <div className="space-y-2">
                  <button onClick={() => { setNotePage(pageNum); setNoteHighlightId(null); setShowNoteModal(true); }}
                    className="w-full py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black text-xs font-medium flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity mb-3">
                    <Plus className="h-3.5 w-3.5" /> New Note
                  </button>
                  {notes.length === 0 && <p className="text-xs text-zinc-400 text-center py-4">No notes yet.</p>}
                  {notes.map((n) => (
                    <div key={n.id} className="p-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 group">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-zinc-400">{n.page ? `Page ${n.page}` : "General"}</span>
                        <button onClick={() => deleteNote(n.id)} className="p-0.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700 text-red-400 opacity-0 group-hover:opacity-100">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap line-clamp-4">{n.content}</div>
                    </div>
                  ))}
                </div>
              )}

              {sidebarTab === "bookmarks" && (
                <div className="space-y-1">
                  {bookmarks.length === 0 && <p className="text-xs text-zinc-400 text-center py-4">No bookmarks yet.</p>}
                  {bookmarks.map((b) => (
                    <div key={b.id} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white dark:hover:bg-zinc-800 cursor-pointer border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 transition-all"
                      onClick={() => goPage(b.page)}
                    >
                      <div className="flex items-center gap-2">
                        <Bookmark className="h-3.5 w-3.5 text-blue-500" />
                        <div>
                          <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{b.label || `Page ${b.page}`}</p>
                          <p className="text-[10px] text-zinc-400">Page {b.page}</p>
                        </div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); deleteBookmark(b.id); }} className="p-0.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700 text-red-400">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {sidebarTab === "flashcards" && (
                <div className="space-y-2">
                  {cards.length === 0 && <p className="text-xs text-zinc-400 text-center py-4">No flashcards yet. Create them from highlights.</p>}
                  {cards.map((c) => (
                    <div key={c.id} className="p-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                      <p className="text-xs font-medium text-zinc-900 dark:text-white mb-1">{c.front}</p>
                      {c.back && <p className="text-xs text-zinc-500 mt-1 pt-1 border-t border-zinc-100 dark:border-zinc-700">{c.back}</p>}
                    </div>
                  ))}
                </div>
              )}

              {sidebarTab === "contents" && (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                    <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-2">Quick Stats</p>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                        <p className="text-lg font-bold text-zinc-900 dark:text-white">{highlights.length}</p>
                        <p className="text-[10px] text-zinc-400">Highlights</p>
                      </div>
                      <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                        <p className="text-lg font-bold text-zinc-900 dark:text-white">{notes.length}</p>
                        <p className="text-[10px] text-zinc-400">Notes</p>
                      </div>
                      <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                        <p className="text-lg font-bold text-zinc-900 dark:text-white">{bookmarks.length}</p>
                        <p className="text-[10px] text-zinc-400">Bookmarks</p>
                      </div>
                      <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                        <p className="text-lg font-bold text-zinc-900 dark:text-white">{cards.length}</p>
                        <p className="text-[10px] text-zinc-400">Cards</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 text-center pt-2">
                    Pages: {pageNum} / {totalPages} ({totalPages > 0 ? Math.round(pageNum / totalPages * 100) : 0}%)
                  </p>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Main reader area */}
        <main className="flex-1 flex flex-col overflow-hidden bg-zinc-100 dark:bg-zinc-900">
          <div ref={containerRef} className="flex-1 overflow-y-auto p-4">
            <div className="max-w-4xl mx-auto">
              <div ref={renderRef} className="min-h-[500px]" />
            </div>
          </div>

          {/* Bottom toolbar */}
          <div className="flex items-center justify-center gap-4 px-4 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
            <button onClick={() => goPage(pageNum - 1)} disabled={pageNum <= 1}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium min-w-[100px] text-center">
              Page <input type="number" value={pageNum} onChange={(e) => goPage(parseInt(e.target.value) || 1)}
                className="w-12 text-center bg-transparent border-b border-zinc-300 dark:border-zinc-600 focus:outline-none" min={1} max={totalPages}
              /> of {totalPages}
            </span>
            <button onClick={() => goPage(pageNum + 1)} disabled={pageNum >= totalPages}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </main>
      </div>

      {/* Note modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowNoteModal(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-700">
              <h3 className="font-semibold text-zinc-900 dark:text-white text-sm">New Note</h3>
              <button onClick={() => setShowNoteModal(false)} className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5">
              <p className="text-xs text-zinc-400 mb-3">Page {notePage}</p>
              <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)}
                placeholder="Write your note..."
                className="w-full h-32 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
              />
              <div className="flex justify-end gap-2 mt-3">
                <button onClick={() => setShowNoteModal(false)} className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">Cancel</button>
                <button onClick={addNote} disabled={!noteText.trim()}
                  className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black text-xs font-medium hover:opacity-90 disabled:opacity-40 transition-opacity"
                >Save Note</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
