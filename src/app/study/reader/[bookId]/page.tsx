"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import type { PDFDocumentProxy } from "pdfjs-dist";
import type { StudyBook, BookHighlight, BookNote, BookBookmark, BookFlashcard, StudySearchResult } from "@/lib/study-types";
import {
  PanelLeftClose, PanelLeft, PanelRightClose, PanelRight, Bookmark, FileText, Highlighter, StickyNote,
  BrainCircuit, Search, ChevronLeft, ChevronRight, Sun, Moon, Monitor,
  List, Plus, X, Trash2, Maximize, Minimize, Focus, ZoomIn, ZoomOut,
  Clock, BookOpen, ChevronDown, AlertCircle,
} from "lucide-react";
import { GlassCard } from "@/components/study/shared/glass-card";

type Theme = "light" | "dark" | "sepia";
type SidebarTab = "highlights" | "notes" | "bookmarks" | "flashcards" | "search";

const COLORS = ["yellow", "green", "blue", "pink", "purple", "orange"];
const COLOR_MAP: Record<string, string> = {
  yellow: "#eab308", green: "#22c55e", blue: "#3b82f6",
  pink: "#ec4899", purple: "#a855f7", orange: "#f97316",
};

function multMatrix(m1: number[], m2: number[]): number[] {
  return [
    m1[0] * m2[0] + m1[2] * m2[1],
    m1[1] * m2[0] + m1[3] * m2[1],
    m1[0] * m2[2] + m1[2] * m2[3],
    m1[1] * m2[2] + m1[3] * m2[3],
    m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
    m1[1] * m2[4] + m1[3] * m2[5] + m1[5],
  ];
}

export default function StudyReaderPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.bookId as string;

  const [book, setBook] = useState<StudyBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.2);
  const [theme, setTheme] = useState<Theme>("light");
  const [leftSidebar, setLeftSidebar] = useState(true);
  const [rightSidebar, setRightSidebar] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("highlights");
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
  const [searchResults, setSearchResults] = useState<StudySearchResult[]>([]);
  const [fullscreen, setFullscreen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [floatToolbar, setFloatToolbar] = useState<{ x: number; y: number; text: string } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const renderRef = useRef<HTMLDivElement>(null);

  const themeClasses: Record<Theme, string> = {
    light: "reader-light bg-[var(--reader-bg)] text-[var(--reader-text)]",
    dark: "reader-dark bg-[var(--reader-bg)] text-[var(--reader-text)]",
    sepia: "reader-sepia bg-[var(--reader-bg)] text-[var(--reader-text)]",
  };

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) { document.documentElement.requestFullscreen(); setFullscreen(true); }
    else { document.exitFullscreen(); setFullscreen(false); }
  }, []);

  useEffect(() => {
    const handler = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const goPage = useCallback((n: number) => {
    const p = Math.max(1, Math.min(n, totalPages));
    setPageNum(p);
    if (totalPages) {
      const pct = Math.round((p / totalPages) * 100);
      fetch("/api/study/progress", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, currentPage: p, totalPages, userId: "default" }),
      }).catch(() => {});
      localStorage.setItem(`progress_${bookId}`, JSON.stringify({ currentPage: p, totalPages, percentage: pct }));
    }
  }, [bookId, totalPages]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key) {
        case "ArrowRight": goPage(pageNum + 1); break;
        case "ArrowLeft": goPage(pageNum - 1); break;
        case "f": case "F": toggleFullscreen(); break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [pageNum, totalPages]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/study/books?userId=default");
        const books = await res.json();
        const b = books.find((x: StudyBook) => x.id === bookId);
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
      } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed to load book"); setLoading(false); }
    };
    load();
  }, [bookId]);

  const renderPage = useCallback(async (num: number) => {
    if (!pdfDoc || !renderRef.current) return;
    const page = await pdfDoc.getPage(num);
    const viewport = page.getViewport({ scale });

    const wrapper = document.createElement("div");
    wrapper.className = "pdf-page-wrapper";
    wrapper.style.cssText = `position:relative;width:${viewport.width}px;max-width:100%;margin:0 auto;background:white;border-radius:4px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08),0 4px 16px rgba(0,0,0,0.04);`;
    renderRef.current.innerHTML = "";
    renderRef.current.appendChild(wrapper);

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    canvas.style.cssText = "display:block;width:100%;height:auto;pointer-events:none;";
    wrapper.appendChild(canvas);
    await page.render({ canvas, viewport, background: "white" }).promise;

    const textLayer = document.createElement("div");
    textLayer.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:auto;color:transparent;user-select:text;";
    wrapper.appendChild(textLayer);

    const syncScale = () => {
      const s = canvas.clientWidth / canvas.width;
      textLayer.style.transform = `scale(${s})`;
      textLayer.style.transformOrigin = "top left";
      textLayer.style.width = canvas.width + "px";
      textLayer.style.height = canvas.height + "px";
    };
    syncScale();
    const ro = new ResizeObserver(syncScale);
    ro.observe(canvas);

    const textContent = await page.getTextContent();
    const vt = viewport.transform;

    const handleMouseUp = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !textLayer.contains(sel.anchorNode)) {
        setTimeout(() => setFloatToolbar(null), 300);
        return;
      }
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();
      const text = sel.toString().trim();
      if (!text) { setFloatToolbar(null); return; }
      setFloatToolbar({
        x: rect.left - wrapperRect.left + rect.width / 2,
        y: rect.top - wrapperRect.top - 8,
        text,
      });
    };
    document.addEventListener("mouseup", handleMouseUp);

    for (const item of textContent.items) {
      if (!("transform" in item)) continue;
      const tx = item.transform;
      const m = multMatrix(vt, [tx[0], tx[1], tx[2], tx[3], tx[4], tx[5]]);
      if (m[4] + m[0] < 0 || m[5] + m[3] < 0) continue;
      const span = document.createElement("span");
      span.textContent = item.str;
      span.style.cssText = `position:absolute;white-space:pre;transform:matrix(${m[0]},${m[1]},${m[2]},${m[3]},${m[4]},${m[5]});transform-origin:0 0;`;
      textLayer.appendChild(span);
    }

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      ro.disconnect();
    };
  }, [pdfDoc, scale]);

  useEffect(() => { renderPage(pageNum); }, [pageNum, renderPage]);

  const addBookmark = async () => {
    const label = prompt("Bookmark name:");
    const res = await fetch("/api/study/bookmarks", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId, page: pageNum, label: label || undefined, userId: "default" }),
    });
    if (res.ok) { const data = await res.json(); setBookmarks((prev) => [...prev, data]); }
  };

  const deleteBookmark = async (id: string) => {
    await fetch(`/api/study/bookmarks?id=${id}`, { method: "DELETE" });
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const addHighlight = async (text: string, color: string) => {
    const res = await fetch("/api/study/highlights", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId, page: pageNum, text, color, type: "highlight", userId: "default" }),
    });
    if (res.ok) { const data = await res.json(); setHighlights((prev) => [data, ...prev]); setFloatToolbar(null); }
  };

  const deleteHighlight = async (id: string) => {
    await fetch(`/api/study/highlights?id=${id}`, { method: "DELETE" });
    setHighlights((prev) => prev.filter((h) => h.id !== id));
  };

  const addNote = async () => {
    if (!noteText.trim()) return;
    const res = await fetch("/api/study/notes", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId, content: noteText, page: notePage, title: `Note on page ${notePage}`, highlightId: noteHighlightId, userId: "default" }),
    });
    if (res.ok) { const data = await res.json(); setNotes((prev) => [data, ...prev]); setShowNoteModal(false); setNoteText(""); setNoteHighlightId(null); }
  };

  const deleteNote = async (id: string) => {
    await fetch(`/api/study/notes?id=${id}`, { method: "DELETE" });
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const createFlashcard = async (highlight: BookHighlight) => {
    const res = await fetch("/api/study/flashcards", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId, front: highlight.text, back: "", highlightId: highlight.id, userId: "default" }),
    });
    if (res.ok) { const data = await res.json(); setCards((prev) => [data, ...prev]); }
  };

  const doSearch = async (q: string) => {
    setSearchQuery(q);
    if (q.length < 2) { setSearchResults([]); return; }
    const res = await fetch(`/api/study/search?q=${encodeURIComponent(q)}&userId=default`);
    setSearchResults(await res.json());
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key) {
        case "b": case "B": addBookmark(); break;
        case "s": case "S": setRightSidebar(true); setSidebarTab("search"); break;
        case "Escape": setFloatToolbar(null); break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [pageNum, addBookmark, setRightSidebar, setSidebarTab]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fafafa] dark:bg-[#0a0a0f]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-black/20 border-t-black/80 dark:border-white/20 dark:border-t-white/80" />
          <p className="text-sm text-black/60 dark:text-white/60">Loading your book...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fafafa] dark:bg-[#0a0a0f]">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-8 w-8 text-red-500" />
          <p className="text-sm text-red-500 mb-4">{error}</p>
          <button onClick={() => router.back()} className="text-sm font-medium text-blue-600 hover:underline">Go back</button>
        </div>
      </div>
    );
  }

  const progressPct = totalPages > 0 ? Math.round((pageNum / totalPages) * 100) : 0;

  return (
    <div className={`h-screen flex flex-col ${themeClasses[theme]} ${focusMode ? "focus-mode" : ""}`}>
      {/* Top bar */}
      <header className={`reader-header-glass flex items-center justify-between px-4 h-12 ${fullscreen ? "hidden" : ""} ${focusMode ? "opacity-0" : ""}`}>
        <div className="flex items-center gap-2">
          <button onClick={() => setLeftSidebar(!leftSidebar)} className="p-1.5 rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-colors" title="Toggle chapters">
            {leftSidebar ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
          </button>
          <span className="text-sm font-medium truncate max-w-[180px]">{book?.title || "Reader"}</span>
          <span className="hidden sm:inline text-xs text-black/55 dark:text-white/50">·</span>
          <span className="hidden sm:inline text-xs text-black/60 dark:text-white/60 tabular-nums">{pageNum} / {totalPages}</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setFocusMode(!focusMode)} className={`p-1.5 rounded-lg transition-colors ${focusMode ? "bg-blue-500/10 text-blue-600" : "hover:bg-black/[0.04] dark:hover:bg-white/[0.08]"} `} title="Focus mode">
            <Focus className="h-4 w-4" />
          </button>
          <button onClick={addBookmark} className="p-1.5 rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-colors" title="Bookmark (B)">
            <Bookmark className="h-4 w-4" />
          </button>
          <div className="flex gap-0.5 ml-1">
            {(["light", "sepia", "dark"] as Theme[]).map((t) => (
              <button key={t} onClick={() => setTheme(t)} className={`p-1.5 rounded-lg transition-colors ${theme === t ? "bg-black/[0.06] dark:bg-white/[0.1]" : "hover:bg-black/[0.04] dark:hover:bg-white/[0.08]"}`} title={t}>
                {t === "light" ? <Sun className="h-3.5 w-3.5" /> : t === "dark" ? <Moon className="h-3.5 w-3.5" /> : <Monitor className="h-3.5 w-3.5" />}
              </button>
            ))}
          </div>
          <button onClick={toggleFullscreen} className="p-1.5 rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-colors" title="Fullscreen (F)">
            {fullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Reading progress bar */}
      <div className={`progress-bar-premium mx-0 rounded-none h-[2px] ${fullscreen ? "hidden" : ""}`}>
        <div className="fill" style={{ width: `${progressPct}%` }} />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - Chapters/TOC */}
        {leftSidebar && (
          <aside className={`w-56 border-r border-black/[0.04] dark:border-white/[0.06] bg-white/50 dark:bg-black/30 flex flex-col shrink-0 overflow-hidden ${fullscreen ? "hidden" : ""}`}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-black/[0.04] dark:border-white/[0.06]">
              <div className="flex items-center gap-2">
                <List className="h-4 w-4 text-black/60 dark:text-white/60" />
                <span className="text-xs font-medium">Chapters</span>
              </div>
              <button onClick={() => setLeftSidebar(false)} className="p-0.5 rounded hover:bg-black/[0.04] dark:hover:bg-white/[0.08]">
                <X className="h-3.5 w-3.5 text-black/55 dark:text-white/50" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1 premium-scrollbar">
              <GlassCard className="p-3">
                <p className="text-xs font-medium text-black/60 dark:text-white/60 mb-2">Quick Stats</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    ["HL", highlights.length, "text-amber-500"],
                    ["NT", notes.length, "text-emerald-500"],
                    ["BM", bookmarks.length, "text-purple-500"],
                    ["FC", cards.length, "text-blue-500"],
                  ].map(([l, v, c]) => (
                    <div key={l as string} className="rounded-lg bg-black/[0.03] dark:bg-white/[0.04] p-2 text-center">
                      <p className={`text-sm font-bold ${c}`}>{v}</p>
                      <p className="text-[10px] text-black/55 dark:text-white/50">{l}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
              <div className="text-center pt-2">
                <p className="text-xs text-black/55 dark:text-white/50">
                  Page {pageNum} · {progressPct}% complete
                </p>
              </div>
            </div>
          </aside>
        )}

        {/* Main reader area */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[var(--reader-bg)]">
          {floatToolbar && (
            <div className="floating-glass fixed z-50 flex items-center gap-1.5 px-2.5 py-2 rounded-xl"
              style={{
                left: `min(${floatToolbar.x}px, calc(100vw - 240px))`,
                top: `max(${floatToolbar.y - 48}px, 80px)`,
                transform: "translateX(-50%)",
              }}
            >
              {COLORS.map((c) => (
                <button key={c} onClick={() => addHighlight(floatToolbar.text, c)} className="w-5 h-5 rounded-full hover:scale-125 transition-transform" style={{ backgroundColor: COLOR_MAP[c] }} title={c} />
              ))}
              <div className="w-px h-4 bg-white/20 mx-1" />
              <button onClick={() => { setFloatToolbar(null); window.getSelection()?.removeAllRanges(); }} className="p-0.5 rounded hover:bg-white/10 transition-colors">
                <X className="h-3 w-3 text-white/60" />
              </button>
            </div>
          )}

          <div ref={containerRef} className="flex-1 overflow-y-auto premium-scrollbar">
            <div className="mx-auto max-w-4xl py-8 px-4">
              <div ref={renderRef} className="min-h-[500px]" />
            </div>
          </div>

          {/* Bottom toolbar */}
          <div className={`reader-header-glass flex items-center justify-between px-4 py-2.5 ${fullscreen ? "hidden" : ""} ${focusMode ? "opacity-0" : ""}`}>
            <div className="flex items-center gap-2">
              <button onClick={() => setRightSidebar(!rightSidebar)} className="p-1.5 rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-colors" title="Toggle sidebar">
                {rightSidebar ? <PanelRightClose className="h-4 w-4" /> : <PanelRight className="h-4 w-4" />}
              </button>
              <div className="flex items-center gap-1 ml-2">
                <button onClick={() => setScale(Math.max(0.5, scale - 0.2))} className="p-1.5 rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-colors">
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>
                <span className="text-xs tabular-nums min-w-[36px] text-center text-black/50 dark:text-white/50">{Math.round(scale * 100)}%</span>
                <button onClick={() => setScale(Math.min(3, scale + 0.2))} className="p-1.5 rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-colors">
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => goPage(pageNum - 1)} disabled={pageNum <= 1} className="p-1.5 rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.08] disabled:opacity-20 transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-1.5">
                <input type="number" value={pageNum} onChange={(e) => goPage(parseInt(e.target.value) || 1)} className="w-10 text-center text-sm bg-transparent border-b border-black/[0.1] dark:border-white/[0.1] focus:outline-none tabular-nums" min={1} max={totalPages} />
                <span className="text-xs text-black/55 dark:text-white/50">/ {totalPages}</span>
              </div>
              <button onClick={() => goPage(pageNum + 1)} disabled={pageNum >= totalPages} className="p-1.5 rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.08] disabled:opacity-20 transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button onClick={() => setRightSidebar(true)} className="p-1.5 rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-colors" title="Open sidebar">
                <PanelRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </main>

        {/* Right sidebar - Highlights/Notes/Bookmarks/Flashcards/Search */}
        {rightSidebar && (
          <aside className={`w-72 border-l border-black/[0.04] dark:border-white/[0.06] bg-white/50 dark:bg-black/30 flex flex-col shrink-0 overflow-hidden ${fullscreen ? "hidden" : ""}`}>
            <div className="flex border-b border-black/[0.04] dark:border-white/[0.06]">
              {[
                { id: "highlights" as SidebarTab, icon: Highlighter },
                { id: "notes" as SidebarTab, icon: StickyNote },
                { id: "bookmarks" as SidebarTab, icon: Bookmark },
                { id: "flashcards" as SidebarTab, icon: BrainCircuit },
                { id: "search" as SidebarTab, icon: Search },
              ].map(({ id, icon: Icon }) => (
                <button key={id} onClick={() => setSidebarTab(id)}
                  className={`flex-1 py-3 flex justify-center transition-all ${sidebarTab === id ? "bg-white dark:bg-black/40 border-b-2 border-blue-500 text-blue-600" : "hover:bg-black/[0.02] dark:hover:bg-white/[0.04] text-black/60 dark:text-white/60"}`}
                  title={id.charAt(0).toUpperCase() + id.slice(1)}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
              <button onClick={() => setRightSidebar(false)} className="px-2.5 py-3 hover:bg-black/[0.02] dark:hover:bg-white/[0.04] transition-colors">
                <X className="h-3.5 w-3.5 text-black/55 dark:text-white/50" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto premium-scrollbar">
              {sidebarTab === "search" && (
                <div className="p-3 space-y-2">
                  <input value={searchQuery} onChange={(e) => doSearch(e.target.value)} placeholder="Search highlights, notes..." className="w-full rounded-xl border border-black/[0.06] dark:border-white/[0.1] bg-transparent px-3 py-2.5 text-sm outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10" />
                  {searchResults.map((r: StudySearchResult) => (
                    <div key={r.id} onClick={() => r.page && goPage(r.page)} className="cursor-pointer rounded-xl p-3 border border-black/[0.04] dark:border-white/[0.06] hover:bg-white/60 dark:hover:bg-white/[0.04] transition-colors">
                      <p className="text-[11px] font-medium text-blue-600 dark:text-blue-400 mb-0.5 capitalize">{r.type}</p>
                      <p className="text-xs text-black/60 dark:text-white/60 line-clamp-2">{r.text}</p>
                      {r.page && <p className="text-[10px] text-black/55 dark:text-white/50 mt-1">Page {r.page}</p>}
                    </div>
                  ))}
                  {searchQuery.length >= 2 && searchResults.length === 0 && <p className="text-xs text-black/55 dark:text-white/50 text-center py-8">No results</p>}
                </div>
              )}

              {sidebarTab === "highlights" && (
                <div className="p-3 space-y-2">
                  <div className="flex items-center gap-1.5 mb-3">
                    {COLORS.map((c) => (
                      <button key={c} onClick={() => setSelColor(c)} className={`w-4 h-4 rounded-full border-2 transition-all ${selColor === c ? "border-blue-500 scale-110" : "border-transparent"}`} style={{ backgroundColor: COLOR_MAP[c] }} />
                    ))}
                  </div>
                  {highlights.length === 0 ? (
                    <p className="text-xs text-black/55 dark:text-white/50 text-center py-8">Select text to highlight</p>
                  ) : (
                    highlights.map((h) => (
                      <div key={h.id} className="group rounded-xl p-3 border border-black/[0.04] dark:border-white/[0.06] hover:bg-white/60 dark:hover:bg-white/[0.04] transition-all">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-black/55 dark:text-white/50">p.{h.page}</span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setNotePage(h.page); setNoteHighlightId(h.id); setShowNoteModal(true); }} className="p-0.5 rounded hover:bg-black/[0.06] dark:hover:bg-white/[0.08]"><Plus className="h-3 w-3" /></button>
                            <button onClick={() => createFlashcard(h)} className="p-0.5 rounded hover:bg-black/[0.06] dark:hover:bg-white/[0.08]"><BrainCircuit className="h-3 w-3" /></button>
                            <button onClick={() => deleteHighlight(h.id)} className="p-0.5 rounded hover:bg-black/[0.06] dark:hover:bg-white/[0.08] text-red-400"><Trash2 className="h-3 w-3" /></button>
                          </div>
                        </div>
                        <p className="text-xs text-black/70 dark:text-white/70 leading-relaxed line-clamp-3">{h.text}</p>
                        <span className="inline-block w-2 h-2 rounded-full mt-1.5" style={{ backgroundColor: COLOR_MAP[h.color] || "#eab308" }} />
                      </div>
                    ))
                  )}
                </div>
              )}

              {sidebarTab === "notes" && (
                <div className="p-3 space-y-2">
                  <button onClick={() => { setNotePage(pageNum); setNoteHighlightId(null); setShowNoteModal(true); }}
                    className="w-full py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-medium flex items-center justify-center gap-1.5 hover:opacity-90 transition-all mb-2">
                    <Plus className="h-3.5 w-3.5" /> New Note
                  </button>
                  {notes.length === 0 ? (
                    <p className="text-xs text-black/55 dark:text-white/50 text-center py-8">No notes yet</p>
                  ) : (
                    notes.map((n) => (
                      <div key={n.id} className="group rounded-xl p-3 border border-black/[0.04] dark:border-white/[0.06] hover:bg-white/60 dark:hover:bg-white/[0.04] transition-all">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-black/55 dark:text-white/50">{n.page ? `p.${n.page}` : "General"}</span>
                          <button onClick={() => deleteNote(n.id)} className="p-0.5 rounded hover:bg-black/[0.06] dark:hover:bg-white/[0.08] text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="h-3 w-3" /></button>
                        </div>
                        <div className="text-xs text-black/70 dark:text-white/70 leading-relaxed line-clamp-4 whitespace-pre-wrap">{n.content}</div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {sidebarTab === "bookmarks" && (
                <div className="p-3 space-y-1">
                  {bookmarks.length === 0 ? (
                    <p className="text-xs text-black/55 dark:text-white/50 text-center py-8">No bookmarks. Press B to add one.</p>
                  ) : (
                    bookmarks.map((b) => (
                      <div key={b.id} onClick={() => goPage(b.page)} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/60 dark:hover:bg-white/[0.04] cursor-pointer border border-transparent hover:border-black/[0.06] dark:hover:border-white/[0.08] transition-all">
                        <div className="flex items-center gap-2.5">
                          <Bookmark className="h-3.5 w-3.5 text-blue-500" />
                          <div>
                            <p className="text-xs font-medium text-black/70 dark:text-white/70">{b.label || `Page ${b.page}`}</p>
                            <p className="text-[10px] text-black/55 dark:text-white/50">p.{b.page}</p>
                          </div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); deleteBookmark(b.id); }} className="p-0.5 rounded hover:bg-black/[0.06] dark:hover:bg-white/[0.08] text-red-400"><X className="h-3 w-3" /></button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {sidebarTab === "flashcards" && (
                <div className="p-3 space-y-2">
                  {cards.length === 0 ? (
                    <p className="text-xs text-black/55 dark:text-white/50 text-center py-8">Create flashcards from highlights</p>
                  ) : (
                    cards.map((c) => (
                      <div key={c.id} className="rounded-xl p-3 border border-black/[0.04] dark:border-white/[0.06]">
                        <p className="text-xs font-medium text-black/80 dark:text-white/80 mb-1">{c.front}</p>
                        {c.back && <p className="text-xs text-black/60 dark:text-white/60 mt-1.5 pt-1.5 border-t border-black/[0.04] dark:border-white/[0.06]">{c.back}</p>}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setShowNoteModal(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#12121a] border border-black/[0.06] dark:border-white/[0.08] shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-black/[0.04] dark:border-white/[0.06]">
              <h3 className="text-sm font-semibold">New Note</h3>
              <button onClick={() => setShowNoteModal(false)} className="p-1 rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.08]"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-5">
              <p className="text-xs text-black/60 dark:text-white/60 mb-3">Page {notePage}</p>
              <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Write your note..." className="w-full h-32 rounded-xl border border-black/[0.06] dark:border-white/[0.1] bg-transparent p-3 text-sm outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 resize-none" />
              <div className="flex justify-end gap-2 mt-3">
                <button onClick={() => setShowNoteModal(false)} className="px-4 py-2 rounded-xl text-xs font-medium text-black/50 hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-colors">Cancel</button>
                <button onClick={addNote} disabled={!noteText.trim()} className="px-4 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-medium hover:opacity-90 disabled:opacity-40 transition-all">Save Note</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
