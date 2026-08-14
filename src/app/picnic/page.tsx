'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/picnic/navigation';
import HeroSection from '@/components/picnic/hero-section';
import TimelineSection from '@/components/picnic/timeline-section';
import GallerySection from '@/components/picnic/gallery-section';
import FriendsSection from '@/components/picnic/friends-section';
import StatisticsSection from '@/components/picnic/statistics-section';
import JournalSection from '@/components/picnic/journal-section';
import GuestbookSection from '@/components/picnic/guestbook-section';
import FriendshipWall from '@/components/picnic/friendship-wall';
import ThenVsNow from '@/components/picnic/then-vs-now';
import RandomMemoryButton from '@/components/picnic/random-memory';
import SearchSection from '@/components/picnic/search-section';
import Footer from '@/components/picnic/footer';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Compass, Sparkles } from 'lucide-react';
import { picnics as allPicnics } from '@/lib/picnic-seed-data';

function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex items-center gap-3">
        <div className="w-16 h-px bg-gradient-to-r from-transparent to-border" />
        <Sparkles className="w-4 h-4 text-primary/40" />
        <div className="w-16 h-px bg-gradient-to-l from-transparent to-border" />
      </div>
    </div>
  );
}

function OnThisDay() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [todaysMemory, setTodaysMemory] = useState<typeof allPicnics[0] | null>(null);
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  useEffect(() => {
    import('@/lib/picnic-seed-data').then(({ picnics }) => {
      const match = picnics.find(p => {
        const d = p.date ? new Date(p.date) : null;
        return d && d.getMonth() + 1 === month && d.getDate() === day;
      });
      if (match) setTodaysMemory(match);
    });
  }, [month, day]);

  if (!todaysMemory || !isInView) return null;

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {} }
        className="max-w-2xl mx-auto px-4 sm:px-6"
      >
        <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/5 via-[#5BA4CF]/5 to-[#E8751A]/5 border border-primary/10 flex items-center gap-4">
          <div className="text-4xl">📅</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-primary font-semibold uppercase tracking-wider">
              On This Day — {month} {day}
            </p>
            <p className="text-sm font-medium mt-1">
              {todaysMemory.year} years ago, we were at{' '}
              <span className="text-primary">{todaysMemory.location}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{todaysMemory.title}</p>
          </div>
          <Image src={todaysMemory.heroImageUrl} alt="" width={64} height={64} className="w-16 h-16 rounded-xl object-cover shrink-0" />
        </div>
      </motion.div>
    </div>
  );
}

function CountdownSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const nextPicnic = new Date(2025, 6, 1);
  const now = new Date();
  const diff = nextPicnic.getTime() - now.getTime();

  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  const hours = Math.max(0, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  const minutes = Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));

  return (
    <div ref={ref} className="py-12 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {} }
        transition={{ duration: 0.6 }}
        className="max-w-md mx-auto text-center"
      >
        <Badge variant="outline" className="mb-4 px-4 py-1.5 text-xs font-medium tracking-wider uppercase border-primary/20 text-primary bg-primary/5">
          <Compass className="w-3 h-3 mr-1.5" />
          Next Adventure
        </Badge>
        <h3 className="text-2xl font-bold mb-6">Countdown to Picnic #13</h3>
        <div className="flex items-center justify-center gap-4">
          {[
            { value: days, label: 'Days' },
            { value: hours, label: 'Hours' },
            { value: minutes, label: 'Minutes' },
          ].map(item => (
            <div key={item.label} className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-card border border-border/50 shadow-sm flex items-center justify-center mb-2">
                <span className="text-3xl font-bold tabular-nums text-primary">{item.value}</span>
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function TravelMapPlaceholder() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <section id="map" ref={ref} className="py-24 px-4 sm:px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {} }
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 px-4 py-1.5 text-xs font-medium tracking-wider uppercase border-primary/20 text-primary bg-primary/5">
            <Compass className="w-3 h-3 mr-1.5" />
            Travel Map
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Where We&apos;ve <span className="text-gradient">Been</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Every location that has hosted our annual adventure, mapped across the beautiful valleys of Kashmir.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {} }
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {allPicnics.map((picnic, index) => (
            <motion.div
              key={picnic.year}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {} }
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all hover:border-primary/20 group cursor-pointer"
            >
              <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                <Image src={picnic.heroImageUrl} alt="" fill loading="lazy" sizes="56px" className="object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-primary">{picnic.year}</span>
                  <span className="text-[10px] text-muted-foreground uppercase">{picnic.season}</span>
                </div>
                <p className="text-sm font-medium truncate">{picnic.location}</p>
                <p className="text-[10px] text-muted-foreground truncate">{picnic.title}</p>
              </div>
              <div className="text-right shrink-0">
                {picnic.locationLat && (
                  <p className="text-[9px] text-muted-foreground tabular-nums">
                    {picnic.locationLat.toFixed(2)}°N
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <HeroSection />
        <SectionDivider />
        <SearchSection />
        <SectionDivider />
        <OnThisDay />
        <TimelineSection />
        <SectionDivider />
        <GallerySection />
        <SectionDivider />
        <FriendsSection />
        <SectionDivider />
        <TravelMapPlaceholder />
        <SectionDivider />
        <StatisticsSection />
        <SectionDivider />
        <CountdownSection />
        <SectionDivider />
        <JournalSection />
        <SectionDivider />
        <FriendshipWall />
        <SectionDivider />
        <ThenVsNow />
        <SectionDivider />
        <GuestbookSection />
        <div className="h-24" />
      </main>
      <Footer />
      <RandomMemoryButton />
    </div>
  );
}
