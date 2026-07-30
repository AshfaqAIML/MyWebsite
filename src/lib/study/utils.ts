import { StudyBook, Chapter, Section } from './types';

export function getBookFileUrl(book: StudyBook, mode: 'read' | 'download' = 'read'): string {
  const fileName = book.source.split('/').pop() || book.source;
  if (mode === 'read') {
    return `/study/books/${encodeURIComponent(fileName)}`;
  }
  return `/api/books/pdf?file=${encodeURIComponent(fileName)}&mode=${mode}`;
}

export function generateChapters(book: StudyBook): Chapter[] {
  const totalPages = estimateTotalPages(book);

  if (book.chapters && book.chapters.length > 0) {
    return book.chapters.map((ch, i) => {
      const pageEnd = i < book.chapters!.length - 1
        ? book.chapters![i + 1].pageStart - 1
        : totalPages;
      return {
        id: `ch_${book.id}_${i + 1}`,
        bookId: book.id,
        title: ch.title,
        number: i + 1,
        pageStart: ch.pageStart,
        pageEnd: Math.max(ch.pageStart, pageEnd),
        sections: [{
          id: `sec_${book.id}_${i + 1}_1`,
          chapterId: `ch_${book.id}_${i + 1}`,
          title: ch.title,
          number: 1,
          page: ch.pageStart,
        }],
      };
    });
  }

  const chapterCount = Math.min(12, Math.max(1, Math.floor(totalPages / 30)));
  const pagesPerChapter = Math.floor(totalPages / chapterCount);

  return Array.from({ length: chapterCount }, (_, i) => ({
    id: `ch_${book.id}_${i + 1}`,
    bookId: book.id,
    title: `Chapter ${i + 1}`,
    number: i + 1,
    pageStart: i * pagesPerChapter + 1,
    pageEnd: Math.min((i + 1) * pagesPerChapter, totalPages),
    sections: [
      {
        id: `sec_${book.id}_${i + 1}_1`,
        chapterId: `ch_${book.id}_${i + 1}`,
        title: `Section ${i + 1}.1`,
        number: 1,
        page: i * pagesPerChapter + 1,
      },
    ],
  }));
}

export function estimateTotalPages(book: { size: string; pages?: number }): number {
  if (book.pages && book.pages > 0) return book.pages;
  const kb = parseInt(book.size.replace(/[, KB]/g, ''));
  if (isNaN(kb)) return 100;
  return Math.max(20, Math.round(kb / 40));
}

export function formatReadingTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem > 0 ? `${hours}h ${rem}m` : `${hours}h`;
}

export function estimateReadTime(totalPages: number, readPages: number, elapsedSeconds: number): string {
  if (readPages === 0 || elapsedSeconds === 0) return '--';
  const secPerPage = elapsedSeconds / readPages;
  const remaining = (totalPages - readPages) * secPerPage;
  return formatReadingTime(Math.round(remaining));
}

export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function groupBy<T>(items: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

export const BOOKMARK_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#3b82f6', '#8b5cf6', '#ec4899', '#6366f1',
];

export const HIGHLIGHT_COLORS = [
  { name: 'Yellow', value: '#fef08a' },
  { name: 'Green', value: '#bbf7d0' },
  { name: 'Blue', value: '#bfdbfe' },
  { name: 'Pink', value: '#fbcfe8' },
  { name: 'Orange', value: '#fed7aa' },
  { name: 'Purple', value: '#e9d5ff' },
];

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Technical: 'from-blue-500/20 to-cyan-500/20 border-blue-500/20 text-blue-400',
    'Self-Development': 'from-emerald-500/20 to-teal-500/20 border-emerald-500/20 text-emerald-400',
    Reference: 'from-violet-500/20 to-purple-500/20 border-violet-500/20 text-violet-400',
    Psychology: 'from-pink-500/20 to-rose-500/20 border-pink-500/20 text-pink-400',
  };
  return colors[category] || 'from-zinc-500/20 to-zinc-500/20 border-zinc-500/20 text-zinc-400';
}

export function getCategoryBadgeColor(category: string): string {
  const colors: Record<string, string> = {
    Technical: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Self-Development': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Reference: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    Psychology: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  };
  return colors[category] || 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
}
