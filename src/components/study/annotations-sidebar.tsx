'use client';

import { useState } from 'react';
import {
  Highlighter, Bookmark, Pen, Square, Circle as CircleIcon,
  StickyNote, MessageSquare, Type, Trash2, Filter,
  Search, Quote, Hash, Minus as MinusIcon,
} from 'lucide-react';
import type { PDFAnnotation } from '@/lib/study/pdf-annotations';

interface AnnotationsSidebarProps {
  annotations: PDFAnnotation[];
  bookmarks: { id: string; page: number; label: string; color: string }[];
  currentPage: number;
  onJumpToPage: (page: number) => void;
  onDeleteAnnotation: (id: string) => void;
  darkMode: boolean;
}

function AnnotationIcon({ type }: { type: string }) {
  const props = 'h-3 w-3';
  switch (type) {
    case 'highlight': return <Highlighter className={props} />;
    case 'underline': return <Quote className={props} />;
    case 'strikethrough': return <Hash className={props} />;
    case 'squiggly': return <MinusIcon className={props} />;
    case 'drawing': return <Pen className={props} />;
    case 'rectangle': return <Square className={props} />;
    case 'circle': return <CircleIcon className={props} />;
    case 'sticky': return <StickyNote className={props} />;
    case 'comment': return <MessageSquare className={props} />;
    case 'textbox': return <Type className={props} />;
    default: return <Highlighter className={props} />;
  }
}

type Tab = 'annotations' | 'bookmarks';

export default function AnnotationsSidebar({
  annotations, bookmarks, currentPage,
  onJumpToPage, onDeleteAnnotation, darkMode,
}: AnnotationsSidebarProps) {
  const [tab, setTab] = useState<Tab>('annotations');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filteredAnnotations = annotations.filter(a => {
    if (filterType && a.type !== filterType) return false;
    if (search && 'text' in a) {
      if (!a.text?.toLowerCase().includes(search.toLowerCase())) return false;
    }
    return true;
  });

  const sortedAnnotations = [...filteredAnnotations].sort((a, b) => a.page - b.page);

  const annotationTypes = Array.from(new Set(annotations.map(a => a.type)));

  const ansiBg = darkMode ? 'bg-[#0f0f13]' : 'bg-white';
  const ansiBorder = darkMode ? 'border-white/[0.06]' : 'border-black/10';
  const ansiText = darkMode ? 'text-white' : 'text-black';
  const ansiMuted = darkMode ? 'text-white/40' : 'text-black/40';

  return (
    <div className={`h-full flex flex-col ${ansiBg}`}>
      <div className={`flex border-b ${ansiBorder}`}>
        {(['annotations', 'bookmarks'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 text-xs font-medium transition-colors relative ${
              tab === t
                ? `${ansiText}`
                : `${ansiMuted} hover:text-white/60`
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
            {tab === t && (
              <div className={`absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full ${
                darkMode ? 'bg-white/30' : 'bg-black/30'
              }`} />
            )}
          </button>
        ))}
      </div>

      {tab === 'annotations' && (
        <>
          <div className={`px-3 py-2 border-b ${ansiBorder}`}>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className={`absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 ${ansiMuted}`} />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search annotations..."
                  className={`w-full pl-7 pr-2 py-1.5 text-xs rounded-lg border bg-transparent focus:outline-none ${
                    darkMode
                      ? 'border-white/[0.06] text-white/70 placeholder:text-white/25 focus:border-white/[0.12]'
                      : 'border-black/10 text-black/70 placeholder:text-black/25 focus:border-black/20'
                  }`}
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setFilterType(filterType ? null : 'highlight')}
                  title="Filter by type"
                  className={`p-1.5 rounded-lg ${filterType ? (darkMode ? 'bg-white/[0.08] text-white' : 'bg-black/10 text-black') : ansiMuted} hover:text-white/60`}
                >
                  <Filter className="h-3 w-3" />
                </button>
                {filterType && (
                  <div className={`absolute top-full right-0 mt-1 p-1.5 rounded-xl border grid grid-cols-2 gap-1 z-50 min-w-[140px] ${
                    darkMode ? 'bg-[#1a1a2e] border-white/[0.08]' : 'bg-white border-black/10 shadow-lg'
                  }`}>
                    {annotationTypes.map(type => (
                      <button
                        key={type}
                        onClick={() => setFilterType(type === filterType ? null : type)}
                        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] transition-colors ${
                          filterType === type
                            ? darkMode ? 'bg-white/[0.08] text-white' : 'bg-black/10 text-black'
                            : darkMode ? 'text-white/40 hover:text-white/60' : 'text-black/40 hover:text-black/60'
                        }`}
                      >
                        <AnnotationIcon type={type} />
                        {type}
                      </button>
                    ))}
                    <button
                      onClick={() => setFilterType(null)}
                      className={`col-span-2 text-[10px] px-2 py-1 rounded-lg ${
                        darkMode ? 'text-white/30 hover:text-white/50' : 'text-black/30 hover:text-black/50'
                      }`}
                    >
                      Clear filter
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {sortedAnnotations.length === 0 ? (
              <div className={`text-center py-12 ${ansiMuted}`}>
                <Highlighter className="h-6 w-6 mx-auto mb-2 opacity-30" />
                <p className="text-xs">No annotations yet</p>
                <p className={`text-[10px] mt-1 ${ansiMuted}`}>
                  {search ? 'No matches found' : 'Select a tool from the toolbar to annotate'}
                </p>
              </div>
            ) : (
              <div className="py-2 space-y-0.5">
                {sortedAnnotations.map(ann => {
                  const text = 'text' in ann ? (ann.text || '') : 'content' in ann ? (ann.content || '') : '';
                  return (
                    <button
                      key={ann.id}
                      onClick={() => onJumpToPage(ann.page)}
                      className={`w-full text-left px-3 py-2.5 transition-colors group flex items-start gap-2.5 ${
                        ann.page === currentPage
                          ? darkMode ? 'bg-white/[0.04]' : 'bg-black/[0.03]'
                          : 'hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className={`mt-0.5 p-1 rounded shrink-0 ${
                        darkMode ? 'bg-white/[0.04]' : 'bg-black/[0.03]'
                      }`}>
                        <AnnotationIcon type={ann.type} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className={`text-[10px] font-medium capitalize ${ansiMuted}`}>
                            {ann.type}
                          </span>
                          {'color' in ann && (
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ann.color as string }} />
                          )}
                          <span className={`text-[10px] ml-auto ${ansiMuted}`}>p.{ann.page}</span>
                        </div>
                        {text && (
                          <p className={`text-[11px] leading-relaxed line-clamp-2 ${darkMode ? 'text-white/70' : 'text-black/70'}`}>
                            {text}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); onDeleteAnnotation(ann.id); }}
                        className={`opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/10 ${ansiMuted} hover:text-red-400 transition-all shrink-0`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className={`px-3 py-2 border-t ${ansiBorder}`}>
            <p className={`text-[10px] ${ansiMuted}`}>
              {annotations.length} annotation{annotations.length !== 1 ? 's' : ''}
              {filterType && ` (${sortedAnnotations.length} filtered)`}
            </p>
          </div>
        </>
      )}

      {tab === 'bookmarks' && (
        <div className="flex-1 overflow-y-auto">
          {bookmarks.length === 0 ? (
            <div className={`text-center py-12 ${ansiMuted}`}>
              <Bookmark className="h-6 w-6 mx-auto mb-2 opacity-30" />
              <p className="text-xs">No bookmarks yet</p>
              <p className={`text-[10px] mt-1 ${ansiMuted}`}>
                Add bookmarks while reading to save your place
              </p>
            </div>
          ) : (
            <div className="py-2 space-y-0.5">
              {bookmarks.map(bm => (
                <button
                  key={bm.id}
                  onClick={() => onJumpToPage(bm.page)}
                  className={`w-full text-left px-3 py-2.5 transition-colors group flex items-center gap-2.5 ${
                    bm.page === currentPage
                      ? darkMode ? 'bg-white/[0.04]' : 'bg-black/[0.03]'
                      : 'hover:bg-white/[0.02]'
                  }`}
                >
                  <Bookmark className="h-3.5 w-3.5 shrink-0" fill={bm.color} color={bm.color} />
                  <div className="min-w-0 flex-1">
                    <p className={`text-[11px] leading-relaxed truncate ${darkMode ? 'text-white/70' : 'text-black/70'}`}>
                      {bm.label || `Page ${bm.page}`}
                    </p>
                    <p className={`text-[10px] ${ansiMuted}`}>Page {bm.page}</p>
                  </div>
                  <span className={`text-[10px] ${ansiMuted}`}>p.{bm.page}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
