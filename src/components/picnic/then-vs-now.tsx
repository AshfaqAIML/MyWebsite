'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { picnics } from '@/lib/picnic-seed-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import {
  ArrowLeftRight, ChevronLeft, ChevronRight, Calendar, Sparkles
} from 'lucide-react';

export default function ThenVsNow() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [sliderValue, setSliderValue] = useState([50]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const pairs = [
    {
      then: { url: picnics[0].heroImageUrl, year: 2013, label: picnics[0].title },
      now: { url: picnics[11].heroImageUrl, year: 2024, label: picnics[11].title },
    },
    {
      then: { url: picnics[3].heroImageUrl, year: 2016, label: picnics[3].title },
      now: { url: picnics[8].heroImageUrl, year: 2021, label: picnics[8].title },
    },
    {
      then: { url: picnics[1].heroImageUrl, year: 2014, label: picnics[1].title },
      now: { url: picnics[10].heroImageUrl, year: 2023, label: picnics[10].title },
    },
  ];

  const current = pairs[currentIndex];

  return (
    <section id="then-vs-now" ref={ref} className="py-24 px-4 sm:px-6 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {} }
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 px-4 py-1.5 text-xs font-medium tracking-wider uppercase border-primary/20 text-primary bg-primary/5">
            <ArrowLeftRight className="w-3 h-3 mr-1.5" />
            Then vs Now
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            How We&apos;ve <span className="text-gradient">Changed</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Slide to compare our first picnics with our latest adventures.
          </p>
        </motion.div>

        {/* Comparison pairs navigation */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <Button
            variant="outline" size="icon"
            onClick={() => setCurrentIndex(prev => (prev - 1 + pairs.length) % pairs.length)}
            className="rounded-full h-9 w-9"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex gap-2">
            {pairs.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
          <Button
            variant="outline" size="icon"
            onClick={() => setCurrentIndex(prev => (prev + 1) % pairs.length)}
            className="rounded-full h-9 w-9"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Image Comparison */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-border/50 shadow-lg overflow-hidden">
            <CardContent className="p-0 relative">
              <div className="relative h-[400px] sm:h-[500px] overflow-hidden">
                {/* "Now" image (full width behind) */}
                <Image
                  src={current.now.url}
                  alt={current.now.label}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                
                {/* "Then" image (clipped by slider) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderValue[0]}%` }}
                >
<Image
                    src={current.then.url}
                    alt={current.then.label}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>

                {/* Slider line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white z-10"
                  style={{ left: `${sliderValue[0]}%` }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center">
                    <ArrowLeftRight className="w-4 h-4 text-foreground" />
                  </div>
                </div>

                {/* Labels */}
                <div className="absolute top-4 left-4 z-20">
                  <Badge className="bg-black/50 text-white border-0 backdrop-blur-sm">
                    {current.then.year} — {current.then.label}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 z-20">
                  <Badge className="bg-black/50 text-white border-0 backdrop-blur-sm">
                    {current.now.year} — {current.now.label}
                  </Badge>
                </div>

                {/* Bottom gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent z-10" />
              </div>

              {/* Slider control */}
              <div className="p-4 bg-card">
                <Slider
                  value={sliderValue}
                  onValueChange={setSliderValue}
                  max={100}
                  min={5}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>{current.then.year} (Then)</span>
                  <span>{current.now.year} (Now)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
