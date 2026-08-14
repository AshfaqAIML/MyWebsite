'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { picnics } from '@/lib/picnic-seed-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin, Thermometer, Car, DollarSign, Sun, Cloud, CloudRain, CloudSnow,
  Star, ChevronRight, Calendar, Route, Clock, UtensilsCrossed, Gamepad2, Laugh, BookOpen, Sparkles
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const weatherIcons: Record<string, React.ReactNode> = {
  'Sunny': <Sun className="w-4 h-4 text-[#E8751A]" />,
  'Clear Sky': <Sun className="w-4 h-4 text-[#E8751A]" />,
  'Partly Cloudy': <Cloud className="w-4 h-4 text-[#5BA4CF]" />,
  'Light Rain': <CloudRain className="w-4 h-4 text-[#5BA4CF]" />,
  'Heavy Snow': <CloudSnow className="w-4 h-4 text-[#87CEEB]" />,
  'Cool & Crisp': <Sun className="w-4 h-4 text-[#F4A261]" />,
  'Warm & Sunny': <Sun className="w-4 h-4 text-[#E8751A]" />,
  'Perfect Sunshine': <Sun className="w-4 h-4 text-[#E8751A]" />,
  'Cloudy with Sun Breaks': <Cloud className="w-4 h-4 text-[#5BA4CF]" />,
  'Mild & Pleasant': <Sun className="w-4 h-4 text-[#F4A261]" />,
};

const seasonColors: Record<string, string> = {
  'Summer': 'bg-[#7CB342]/10 text-[#2D5A27] dark:text-[#AED581] border-[#7CB342]/20',
  'Winter': 'bg-[#87CEEB]/10 text-[#5BA4CF] border-[#87CEEB]/20',
  'Spring': 'bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300 border-pink-200 dark:border-pink-800',
  'Autumn': 'bg-[#F4A261]/10 text-[#8B6914] dark:text-[#F4A261] border-[#F4A261]/20',
  'Monsoon': 'bg-[#26C6DA]/10 text-[#5BA4CF] dark:text-[#26C6DA] border-[#26C6DA]/20',
};

export default function TimelineSection() {
  const [selectedPicnic, setSelectedPicnic] = useState<typeof picnics[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const openDetail = (picnic: typeof picnics[0]) => {
    setSelectedPicnic(picnic);
    setDialogOpen(true);
  };

  return (
    <section id="timeline" ref={ref} className="py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#7CB342]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#5BA4CF]/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="max-w-6xl mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 px-4 py-1.5 text-xs font-medium tracking-wider uppercase border-primary/20 text-primary bg-primary/5">
            <Clock className="w-3 h-3 mr-1.5" />
            Our Journey
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            12 Years of{' '}
            <span className="text-gradient">Adventures</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-base sm:text-lg">
            From Pahalgam to Keran, every year brought a new destination, new laughs, and memories that last forever.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 timeline-line md:-translate-x-px" />

          {picnics.map((picnic, index) => (
            <TimelineCard
              key={picnic.year}
              picnic={picnic}
              index={index}
              isInView={isInView}
              onClick={() => openDetail(picnic)}
            />
          ))}
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden p-0">
          {selectedPicnic && (
            <PicnicDetail picnic={selectedPicnic} />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function TimelineCard({
  picnic, index, isInView, onClick
}: {
  picnic: typeof picnics[0];
  index: number;
  isInView: boolean;
  onClick: () => void;
}) {
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative flex items-center mb-8 md:mb-12 ${
        isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
      }`}
    >
      {/* Dot on timeline */}
      <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-primary border-4 border-background -translate-x-1.5 md:-translate-x-1.5 z-10 shadow-md shadow-primary/30" />

      {/* Card */}
      <div className={`ml-10 md:ml-0 md:w-[calc(50%-2rem)] ${
        isLeft ? 'md:pr-0 md:mr-auto' : 'md:pl-0 md:ml-auto'
      }`}>
        <motion.div
          whileHover={{ y: -4 }}
          onClick={onClick}
          className="cursor-pointer group bg-card rounded-2xl overflow-hidden shadow-lg shadow-black/5 border border-border/50 hover:shadow-xl hover:border-primary/20 transition-all duration-300"
        >
          {/* Image */}
          <div className="relative h-40 sm:h-48 overflow-hidden">
<Image
              src={picnic.heroImageUrl}
              alt={picnic.title}
              fill
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="img-overlay absolute inset-0" />
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
              <div>
                <span className="text-3xl sm:text-4xl font-bold text-white/90">{picnic.year}</span>
                <p className="text-xs text-white/70 mt-0.5">{picnic.date}</p>
              </div>
              <Badge className={seasonColors[picnic.season] || 'bg-muted'}>
                {picnic.season}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-semibold text-base">{picnic.title}</h3>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span>{picnic.location}</span>
              {weatherIcons[picnic.weather] && (
                <>
                  <span className="mx-1">•</span>
                  {weatherIcons[picnic.weather]}
                  <span>{picnic.temperature}</span>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
              {picnic.description}
            </p>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < Math.floor(picnic.rating) ? 'text-[#C49A2A] fill-[#C49A2A]' : 'text-muted-foreground/30'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                View Details <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function PicnicDetail({ picnic }: { picnic: typeof picnics[0] }) {
  return (
    <>
      {/* Hero image */}
      <div className="relative h-56 sm:h-72 overflow-hidden">
        <Image src={picnic.heroImageUrl} alt={picnic.title} fill loading="lazy" sizes="(max-width: 768px) 100vw, 640px" className="object-cover" />
        <div className="img-overlay absolute inset-0" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={seasonColors[picnic.season] || 'bg-muted'}>{picnic.season}</Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-0 backdrop-blur-sm">
              {weatherIcons[picnic.weather]} {picnic.weather}
            </Badge>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">{picnic.title}</h2>
          <p className="text-sm text-white/80 mt-1">{picnic.date}</p>
        </div>
      </div>

      <ScrollArea className="max-h-[60vh]">
        <div className="p-6 space-y-6">
          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: MapPin, label: 'Location', value: picnic.location },
              { icon: Thermometer, label: 'Temperature', value: picnic.temperature },
              { icon: DollarSign, label: 'Budget', value: `₹${picnic.budget?.toLocaleString()}` },
              { icon: Route, label: 'Distance', value: `${picnic.travelDistance} km` },
            ].map((stat) => (
              <div key={stat.label} className="flex items-start gap-2 p-3 rounded-xl bg-muted/50">
                <stat.icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <p className="text-sm font-medium mt-0.5">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* More details */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Car, label: 'Transport', value: picnic.transportation },
              { icon: Clock, label: 'Driving Time', value: picnic.drivingTime },
            ].map((stat) => (
              <div key={stat.label} className="flex items-start gap-2 p-3 rounded-xl bg-muted/50">
                <stat.icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <p className="text-sm font-medium mt-0.5">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-primary" /> The Story
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{picnic.description}</p>
          </div>

          {/* Food */}
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
              <UtensilsCrossed className="w-4 h-4 text-primary" /> Food
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{picnic.food}</p>
          </div>

          {/* Games */}
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
              <Gamepad2 className="w-4 h-4 text-primary" /> Games
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{picnic.games}</p>
          </div>

          {/* Funny moment */}
          <div className="p-4 rounded-xl bg-[#F4A261]/5 border border-[#F4A261]/20 dark:bg-[#F4A261]/5">
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-2 text-[#8B6914] dark:text-[#F4A261]">
              <Laugh className="w-4 h-4" /> Funny Moment
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{picnic.funnyMoments}</p>
          </div>

          {/* Travel Route */}
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
              <Route className="w-4 h-4 text-primary" /> Travel Route
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{picnic.route}</p>
            {picnic.travelNotes && (
              <p className="text-xs text-muted-foreground mt-2 italic">{picnic.travelNotes}</p>
            )}
          </div>

          {/* Lessons */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" /> Lessons Learned
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{picnic.lessonsLearned}</p>
          </div>

          {/* Nearby */}
          {picnic.nearbyAttractions && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Nearby Attractions</h3>
              <div className="flex flex-wrap gap-2">
                {picnic.nearbyAttractions.split(', ').map((attr) => (
                  <Badge key={attr} variant="secondary" className="text-xs">{attr}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Music */}
          {picnic.musicPlaylist && (
            <div>
              <h3 className="text-sm font-semibold mb-2">🎵 Music Playlist</h3>
              <p className="text-sm text-muted-foreground">{picnic.musicPlaylist}</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </>
  );
}
