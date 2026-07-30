'use client';

import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, BookOpen, Clock, Bookmark, BarChart3, TrendingUp,
  Sparkles, Library, GraduationCap, ChevronRight, ArrowUpRight,
  Layers, Filter, LayoutGrid, List, FileText, CheckCircle2,
  BookMarked, Timer, Star, BrainCircuit,
} from 'lucide-react';
import Link from 'next/link';
import studyBooks from '../../../data/study-books.json';
import type { StudyBook } from '@/lib/study/types';
import { getBookProgress, getProgresses, getStats } from '@/lib/study/store';
import { getCategoryBadgeColor, estimateTotalPages, formatReadingTime } from '@/lib/study/utils';

const categories = ['All', ...Array.from(new Set((studyBooks as StudyBook[]).map(b => b.category)))];

const categoryGradients: Record<string, string> = {
  Technical: 'from-blue-600/30 via-cyan-600/20 to-transparent',
  'Self-Development': 'from-emerald-600/30 via-teal-600/20 to-transparent',
  Reference: 'from-violet-600/30 via-purple-600/20 to-transparent',
  Psychology: 'from-pink-600/30 via-rose-600/20 to-transparent',
};

const categoryIcons: Record<string, any> = {
  Technical: BrainCircuit,
  'Self-Development': TrendingUp,
  Reference: Library,
  Psychology: Star,
};

function StatCard({ icon: Icon, value, label }: { icon: any; value: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center">
            <Icon className="h-4 w-4 text-white/60" />
          </div>
          <div>
            <p className="text-lg font-semibold text-white tracking-tight">{value}</p>
            <p className="text-[11px] text-white/40 font-medium">{label}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function BookCard({ book, index }: { book: StudyBook; index: number }) {
  const progress = getBookProgress(book.id);
  const progPct = progress?.completionPercentage || 0;
  const totalPages = estimateTotalPages(book.size);

  return (
    <Link href={`/study-corner/read/${book.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.03 }}
        className="group relative"
      >
        <div className="absolute -inset-[1px] bg-gradient-to-b from-white/[0.08] to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative h-full rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden backdrop-blur-xl">
          <div className="aspect-[2/1] bg-gradient-to-br from-white/[0.03] to-white/[0.01] relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${categoryGradients[book.category] || 'from-white/5 to-transparent'}`} />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.03),transparent_70%)]" />
            <div className="absolute bottom-3 left-4 right-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center backdrop-blur-sm">
                  <FileText className="h-3.5 w-3.5 text-white/50" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white/80 truncate leading-tight">{book.title}</p>
                  <p className="text-[10px] text-white/40 mt-0.5 truncate">{book.author}</p>
                </div>
              </div>
            </div>
            {progPct > 0 && (
              <div className="absolute top-3 right-3">
                <div className="px-2 py-1 rounded-full bg-white/[0.08] border border-white/[0.1] backdrop-blur-sm">
                  <p className="text-[10px] font-medium text-white/70">{Math.round(progPct)}%</p>
                </div>
              </div>
            )}
            <div className="absolute top-3 left-3">
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getCategoryBadgeColor(book.category)} backdrop-blur-sm`}>
                {book.category}
              </span>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="h-1 rounded-full bg-white/[0.04] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progPct}%` }}
                className="h-full rounded-full bg-gradient-to-r from-white/30 to-white/10"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-white/40">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {totalPages} pages
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {book.size}
                </span>
              </div>
              <div className="flex items-center gap-1 text-white/30 group-hover:text-white/60 transition-colors">
                <span className="text-[10px]">Open</span>
                <ArrowUpRight className="h-3 w-3" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default function StudyCornerPage() {
  const books = studyBooks as StudyBook[];
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const stats = getStats();

  const filtered = useMemo(() => {
    return books.filter(b => {
      const q = search.toLowerCase();
      return (!q || [b.title, b.author, b.category, b.description, ...b.tags].join(' ').toLowerCase().includes(q))
        && (category === 'All' || b.category === category);
    });
  }, [books, search, category]);

  const totalRead = Object.values(getProgresses()).reduce((sum, p) => sum + p.currentPage, 0);

  const statsCards = [
    { icon: BookOpen, value: String(books.length), label: 'Total Books' },
    { icon: BarChart3, value: `${totalRead}`, label: 'Pages Read' },
    { icon: BookMarked, value: String(Object.values(getProgresses()).filter(p => p.completionPercentage >= 100).length), label: 'Completed' },
    { icon: Timer, value: books.length > 5 ? 'Active' : 'Getting Started', label: 'Status' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white antialiased selection:bg-white/20 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-zinc-950/70 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/[0.08] flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-white/70" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white">Study Corner</h1>
              <p className="text-[10px] text-white/40 font-medium">Digital Learning Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-xs text-white/40 hover:text-white/80 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/[0.04]"
            >
              Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] mb-4">
            <Sparkles className="h-3 w-3 text-white/50" />
            <span className="text-[11px] font-medium text-white/50">Premium Learning Platform</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Your{' '}
            <span className="bg-gradient-to-r from-white via-white/80 to-white/60 bg-clip-text text-transparent">
              Digital Study
            </span>{' '}
            Ecosystem
          </h2>
          <p className="mt-3 text-sm text-white/40 max-w-xl leading-relaxed">
            A curated collection of learning resources with progress tracking, notes, bookmarking, and an AI-ready architecture for serious learners.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {statsCards.map((s, i) => (
            <StatCard key={s.label} icon={s.icon} value={s.value} label={s.label} />
          ))}
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <input
              type="search" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search books, authors, topics..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white/80 placeholder:text-white/25 focus:outline-none focus:border-white/[0.12] focus:bg-white/[0.05] transition-all"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {categories.map(cat => (
                <button
                  key={cat} onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    category === cat
                      ? 'bg-white text-zinc-950'
                      : 'bg-white/[0.04] text-white/50 hover:text-white/70 hover:bg-white/[0.06]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white/[0.06] text-white' : 'text-white/30 hover:text-white/50'}`}>
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white/[0.06] text-white' : 'text-white/30 hover:text-white/50'}`}>
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Book Grid */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-white/30" />
              </div>
              <p className="text-sm text-white/40">No books match your search.</p>
            </motion.div>
          ) : viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {filtered.map((book, i) => (
                <BookCard key={book.id} book={book} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              {filtered.map(book => (
                <Link key={book.id} href={`/study-corner/read/${book.id}`}>
                  <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/[0.02] border border-transparent hover:border-white/[0.06] transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center shrink-0">
                      <FileText className="h-4 w-4 text-white/40" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white/80 truncate">{book.title}</p>
                      <p className="text-xs text-white/40 truncate">{book.author}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getCategoryBadgeColor(book.category)}`}>
                      {book.category}
                    </span>
                    <span className="text-xs text-white/30">{book.size}</span>
                    <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-white/50 transition-colors" />
                  </div>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
