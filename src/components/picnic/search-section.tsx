'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { picnics, galleryPhotos, stories, friends as friendsData } from '@/lib/picnic-seed-data';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MapPin, Calendar, X, Image, BookOpen, Users } from 'lucide-react';
import NextImage from 'next/image';

interface SearchResult {
  type: 'picnic' | 'photo' | 'story' | 'friend';
  title: string;
  subtitle: string;
  year?: number;
  imageUrl?: string;
  id: string;
}

export default function SearchSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = (q: string) => {
    if (!q.trim()) { setResults([]); setHasSearched(false); return; }
    const lower = q.toLowerCase();
    const found: SearchResult[] = [];

    // Search picnics
    picnics.forEach(p => {
      if (
        p.title.toLowerCase().includes(lower) ||
        p.location.toLowerCase().includes(lower) ||
        p.weather?.toLowerCase().includes(lower) ||
        p.season?.toLowerCase().includes(lower) ||
        p.food?.toLowerCase().includes(lower) ||
        String(p.year).includes(lower)
      ) {
        found.push({
          type: 'picnic', title: p.title, subtitle: p.location,
          year: p.year, imageUrl: p.heroImageUrl, id: `p-${p.year}`
        });
      }
    });

    // Search photos
    galleryPhotos.forEach(p => {
      if (
        p.caption.toLowerCase().includes(lower) ||
        p.tags.some(t => t.includes(lower)) ||
        p.category.includes(lower) ||
        String(p.year).includes(lower)
      ) {
        found.push({
          type: 'photo', title: p.caption, subtitle: `${p.category} • ${p.year}`,
          year: p.year, imageUrl: p.url, id: p.id
        });
      }
    });

    // Search stories
    stories.forEach(s => {
      if (
        s.title.toLowerCase().includes(lower) ||
        s.content.toLowerCase().includes(lower) ||
        s.mood?.toLowerCase().includes(lower) ||
        String(s.year).includes(lower)
      ) {
        found.push({
          type: 'story', title: s.title,
          subtitle: s.content.substring(0, 80) + '...',
          year: s.year, id: s.id
        });
      }
    });

    // Search friends
    friendsData.forEach(f => {
      if (
        f.name.toLowerCase().includes(lower) ||
        f.nickname?.toLowerCase().includes(lower) ||
        f.bio.toLowerCase().includes(lower) ||
        f.favoriteLocation?.toLowerCase().includes(lower) ||
        f.favoriteFood?.toLowerCase().includes(lower)
      ) {
        found.push({
          type: 'friend', title: f.name, subtitle: f.role || '',
          imageUrl: f.avatarUrl, id: f.id
        });
      }
    });

    setResults(found);
    setHasSearched(true);
  };

  const typeIcons: Record<string, React.ReactNode> = {
    picnic: <Calendar className="w-3 h-3" />,
    photo: <Image className="w-3 h-3" />,
    story: <BookOpen className="w-3 h-3" />,
    friend: <Users className="w-3 h-3" />,
  };

  const typeColors: Record<string, string> = {
    picnic: 'bg-[#2D5A27]/10 text-[#2D5A27] dark:text-[#7CB342]',
    photo: 'bg-[#5BA4CF]/10 text-[#5BA4CF]',
    story: 'bg-[#E8751A]/10 text-[#8B6914] dark:text-[#F4A261]',
    friend: 'bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300',
  };

  const suggestions = [
    'sunset photos', 'rain', 'campfire', 'Gurez', 'Rouf', 'food', '2019', 'snow'
  ];

  return (
    <div ref={ref} className="py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {} }
          transition={{ duration: 0.6 }}
        >
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search memories... try 'sunset photos', 'rain', 'campfire'"
              value={query}
              onChange={(e) => { setQuery(e.target.value); performSearch(e.target.value); }}
              className="pl-12 pr-10 rounded-2xl h-13 text-base bg-card border-border/50 shadow-sm focus-within:shadow-md transition-shadow"
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setResults([]); setHasSearched(false); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/10 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Quick suggestions */}
          {!query && (
            <div className="flex flex-wrap items-center gap-2 mt-4 justify-center">
              <span className="text-xs text-muted-foreground">Try:</span>
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => { setQuery(s); performSearch(s); }}
                  className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Results */}
          {hasSearched && (
            <div className="mt-6 space-y-2 max-h-96 overflow-y-auto pr-1">
              <p className="text-xs text-muted-foreground mb-3">
                {results.length} result{results.length !== 1 ? 's' : ''} found
              </p>
              {results.map(r => (
                <Card key={r.id} className="border-border/50 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-3 flex items-center gap-3">
                    {r.imageUrl && (
                      <NextImage src={r.imageUrl} alt={r.title} width={48} height={48} className="w-12 h-12 rounded-lg object-cover shrink-0" />                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{r.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{r.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {r.year && <Badge variant="secondary" className="text-[10px]">{r.year}</Badge>}
                      <Badge className={`text-[10px] ${typeColors[r.type]}`} variant="secondary">
                        {typeIcons[r.type]} {r.type}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {results.length === 0 && (
                <div className="text-center py-12">
                  <Search className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No memories found for &ldquo;{query}&rdquo;</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
