'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NextImage from 'next/image';
import { picnics, stories, galleryPhotos } from '@/lib/picnic-seed-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Shuffle, MapPin, Calendar, Thermometer, X, Image, BookOpen, Camera } from 'lucide-react';
import { toast } from 'sonner';

type MemoryType = 'photo' | 'story' | 'picnic';

interface RandomMemory {
  type: MemoryType;
  data: typeof galleryPhotos[0] | typeof stories[0] | typeof picnics[0];
}

export default function RandomMemoryButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [memory, setMemory] = useState<RandomMemory | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const getRandomMemory = useCallback(() => {
    const rand = Math.random();
    if (rand < 0.5) {
      const photo = galleryPhotos[Math.floor(Math.random() * galleryPhotos.length)];
      return { type: 'photo' as MemoryType, data: photo };
    } else if (rand < 0.8) {
      const story = stories[Math.floor(Math.random() * stories.length)];
      return { type: 'story' as MemoryType, data: story };
    } else {
      const picnic = picnics[Math.floor(Math.random() * picnics.length)];
      return { type: 'picnic' as MemoryType, data: picnic };
    }
  }, []);

  const handleSpin = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setMemory(getRandomMemory());
      setIsSpinning(false);
      setIsOpen(true);
    }, 1000);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 3, type: 'spring' }}
        className="fixed bottom-6 right-6 z-40"
      >
        <Button
          onClick={handleSpin}
          disabled={isSpinning}
          className={`rounded-full h-14 w-14 shadow-xl shadow-primary/20 hover:shadow-2xl hover:scale-110 transition-all ${
            isSpinning ? 'animate-spin' : ''
          }`}
          size="icon"
        >
          <Shuffle className="w-6 h-6" />
        </Button>
        <p className="text-[10px] text-center text-muted-foreground mt-1 font-medium">Take Me Back</p>
      </motion.div>

      {/* Memory Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          {memory && (
            <>
              {memory.type === 'photo' && (
                <PhotoMemory photo={memory.data as typeof galleryPhotos[0]} />
              )}
              {memory.type === 'story' && (
                <StoryMemory story={memory.data as typeof stories[0]} />
              )}
              {memory.type === 'picnic' && (
                <PicnicMemory picnic={memory.data as typeof picnics[0]} />
              )}
              <div className="p-4 flex justify-center">
                <Button variant="outline" onClick={handleSpin} className="rounded-xl">
                  <Shuffle className="w-4 h-4 mr-2" />
                  Another Memory
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function PhotoMemory({ photo }: { photo: typeof galleryPhotos[0] }) {
  return (
    <div>
      <div className="relative h-64 overflow-hidden">
        <NextImage src={photo.url} alt={photo.caption} fill loading="lazy" sizes="(max-width: 768px) 100vw, 640px" className="object-cover" />
        <div className="img-overlay absolute inset-0" />
        <Badge className="absolute top-4 left-4 bg-white/20 text-white border-0 backdrop-blur-sm">
          <Camera className="w-3 h-3 mr-1" /> Photo
        </Badge>
      </div>
      <div className="p-5">
        <p className="font-medium">{photo.caption}</p>
        <div className="flex gap-2 mt-2">
          <Badge variant="secondary">{photo.year}</Badge>
          <Badge variant="secondary" className="capitalize">{photo.category}</Badge>
        </div>
      </div>
    </div>
  );
}

function StoryMemory({ story }: { story: typeof stories[0] }) {
  const friendName = story.friendId === 'ishfaq' ? 'Ishfaq' : story.friendId === 'rouf' ? 'Rouf' : 'Shoib';
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="outline"><BookOpen className="w-3 h-3 mr-1" /> Story</Badge>
        <Badge variant="secondary">{story.year}</Badge>
        <Badge variant="secondary">{story.mood}</Badge>
      </div>
      <h3 className="text-xl font-bold mb-3">{story.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{story.content}</p>
      <p className="text-xs text-muted-foreground mt-4">— {friendName}</p>
    </div>
  );
}

function PicnicMemory({ picnic }: { picnic: typeof picnics[0] }) {
  return (
    <div>
      <div className="relative h-48 overflow-hidden">
        <NextImage src={picnic.heroImageUrl} alt={picnic.title} fill loading="lazy" sizes="(max-width: 768px) 100vw, 640px" className="object-cover" />
        <div className="img-overlay absolute inset-0" />
        <div className="absolute bottom-3 left-4">
          <span className="text-2xl font-bold text-white">{picnic.year}</span>
        </div>
      </div>
      <div className="p-5 space-y-3">
        <h3 className="font-bold text-lg">{picnic.title}</h3>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{picnic.location}</span>
          <span className="flex items-center gap-1"><Thermometer className="w-3 h-3" />{picnic.temperature}</span>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-3">{picnic.funnyMoments}</p>
      </div>
    </div>
  );
}
