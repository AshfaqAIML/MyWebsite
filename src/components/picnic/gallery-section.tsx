'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { galleryPhotos } from '@/lib/picnic-seed-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogTitle,
} from '@/components/ui/dialog';
import {
  Search, Heart, Download, ZoomIn, Grid3X3, X, ChevronLeft, ChevronRight, Maximize2, Info
} from 'lucide-react';

const categories = [
  'All', 'Nature', 'Campfire', 'Food', 'Travel', 'Sunrise', 'Sunset', 'Selfies', 'Rain'
];

export default function GallerySection() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const filteredPhotos = galleryPhotos.filter(photo => {
    const matchesCategory = activeCategory === 'All' || photo.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = !searchQuery ||
      photo.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      String(photo.year).includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (lightboxIndex === null) return;
    const newIndex = direction === 'next'
      ? (lightboxIndex + 1) % filteredPhotos.length
      : (lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    setLightboxIndex(newIndex);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft') navigateLightbox('prev');
      if (e.key === 'ArrowRight') navigateLightbox('next');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  return (
    <section id="gallery" ref={ref} className="py-24 px-4 sm:px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 px-4 py-1.5 text-xs font-medium tracking-wider uppercase border-primary/20 text-primary bg-primary/5">
            <Grid3X3 className="w-3 h-3 mr-1.5" />
            Photo Gallery
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Captured <span className="text-gradient">Moments</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Over 8,700 photographs from a decade of adventures. Every photo tells a story.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 space-y-4"
        >
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search memories... (e.g., sunset, campfire, 2019)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl bg-card border-border/50 h-11"
            />
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={activeCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full text-xs px-4 h-8 transition-all ${
                  activeCategory === cat
                    ? 'shadow-md shadow-primary/20'
                    : 'hover:bg-accent'
                }`}
              >
                {cat}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Masonry Grid */}
        <div className="masonry-grid">
          <AnimatePresence mode="popLayout">
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="masonry-item"
              >
                <div
                  className="group relative rounded-2xl overflow-hidden bg-card border border-border/50 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
                  onClick={() => setLightboxIndex(index)}
                >
<Image
                    src={photo.url}
                    alt={photo.caption}
                    width={photo.width}
                    height={photo.height}
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white text-sm font-medium line-clamp-2">{photo.caption}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-[10px] bg-white/20 text-white border-0">
                          {photo.year}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px] bg-white/20 text-white border-0 capitalize">
                          {photo.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(photo.id); }}
                        className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                      >
                        <Heart className={`w-4 h-4 ${favorites.has(photo.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                      </button>
                      <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                        <ZoomIn className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredPhotos.length === 0 && (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No memories found matching your search.</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxIndex !== null} onOpenChange={() => setLightboxIndex(null)}>
        <DialogContent className="max-w-5xl p-0 bg-black/95 border-none sm:rounded-2xl overflow-hidden">
          <DialogTitle className="sr-only">Photo Viewer</DialogTitle>
          {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
            <div className="relative">
              <Image
                src={filteredPhotos[lightboxIndex].url}
                alt={filteredPhotos[lightboxIndex].caption}
                width={filteredPhotos[lightboxIndex].width}
                height={filteredPhotos[lightboxIndex].height}
                className="w-full max-h-[80vh] object-contain"
              />
              {/* Controls */}
              <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
                <button
                  onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
                  className="pointer-events-auto w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
                  className="pointer-events-auto w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              {/* Caption bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <p className="text-white font-medium">{filteredPhotos[lightboxIndex].caption}</p>
                <p className="text-white/60 text-sm mt-1">
                  {filteredPhotos[lightboxIndex].year} • {lightboxIndex + 1} / {filteredPhotos.length}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
