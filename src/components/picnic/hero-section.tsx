'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronDown, Play, Sparkles, Camera, TreePine, Mountain } from 'lucide-react';

const heroImages = [
  '/picnic-images/hero/kashmir-valley.png',
  '/picnic-images/hero/gulmarg-meadows.png',
];

export default function HeroSection() {
  const [currentBg, setCurrentBg] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setIsLoaded(true));
    const interval = setInterval(() => {
      setCurrentBg(prev => (prev + 1) % heroImages.length);
    }, 8000);
    return () => {
      cancelAnimationFrame(id);
      clearInterval(interval);
    };
  }, []);

  const scrollToTimeline = () => {
    const el = document.getElementById('timeline');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const scrollToGallery = () => {
    const el = document.getElementById('gallery');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section id="home" ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBg}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
        >
          <Image
            src={heroImages[currentBg]}
            alt="Kashmir landscape"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 hero-overlay" />

      {/* Animated particles - leaves */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full bg-[#7CB342]/20"
            style={{
              left: `${10 + i * 12}%`,
              top: '-20px',
            }}
            animate={{
              y: [0, typeof window !== 'undefined' ? window.innerHeight + 50 : 1000],
              x: [0, Math.sin(i * 2) * 80, Math.cos(i * 3) * 40],
              rotate: [0, 360],
              opacity: [0, 0.6, 0.6, 0],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
              ease: 'linear',
            }}
          />
        ))}

        {/* Floating light orbs */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute w-2 h-2 rounded-full bg-yellow-300/30"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              delay: i * 0.8,
            }}
          />
        ))}

        {/* Mountain silhouettes at bottom */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full"
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          style={{ height: '15vh' }}
        >
          <path
            d="M0,200 L0,120 Q120,40 240,100 Q360,160 480,80 Q600,0 720,60 Q840,120 960,40 Q1080,0 1200,80 Q1320,140 1440,60 L1440,200 Z"
            fill="oklch(0.13 0.015 145 / 30%)"
            className="dark:fill-black/40"
          />
          <path
            d="M0,200 L0,150 Q180,100 360,140 Q540,180 720,120 Q900,60 1080,110 Q1260,160 1440,100 L1440,200 Z"
            fill="oklch(0.13 0.015 145 / 50%)"
            className="dark:fill-black/60"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
          >
            <Sparkles className="w-4 h-4 text-[#C49A2A]" />
            <span className="text-sm font-medium text-white/90">
              Kashmir • Since 2013 • Ishfaq, Rouf & Shoib
            </span>
            <Sparkles className="w-4 h-4 text-[#C49A2A]" />
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.7 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight"
          >
            More Than{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7CB342] via-[#87CEEB] to-[#F4A261]">
              12 Years
            </span>
            <br />
            of Friendship
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-6 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
          >
            Every year, one picnic. Thousands of memories. A lifetime of friendship.
            <br className="hidden sm:block" />
            This is our story, preserved forever.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 1.1 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              onClick={scrollToTimeline}
              className="bg-white text-foreground hover:bg-white/90 rounded-2xl px-8 h-12 text-base font-semibold shadow-xl shadow-black/20 transition-all hover:shadow-2xl hover:scale-105"
            >
              <Camera className="w-5 h-5 mr-2" />
              Explore Memories
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={scrollToGallery}
              className="border-white/30 text-white hover:bg-white/10 rounded-2xl px-8 h-12 text-base font-semibold backdrop-blur-sm transition-all hover:scale-105"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Our Journey
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats teaser */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.4 }}
          className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto"
        >
          {[
            { value: '12', label: 'Years' },
            { value: '12', label: 'Picnics' },
            { value: '8,742', label: 'Photos' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-xs sm:text-sm text-white/60 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : {}}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.button
          onClick={scrollToTimeline}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-white/60 hover:text-white/80 transition-colors"
        >
          <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </section>
  );
}
