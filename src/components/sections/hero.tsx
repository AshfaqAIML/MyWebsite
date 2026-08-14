"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowDown,
  Globe,
  User,
  BookOpen,
  Compass,
  Sparkles,
  Code2,
  Database,
  Brain,
  BarChart3,
  Search,
  PenTool,
  Cpu,
  Camera,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProfile, getRoles } from "@/lib/data";

const roleIcons: Record<string, React.ReactNode> = {
  "Full Stack Developer": <Code2 className="h-3.5 w-3.5" />,
  "Data Analyst": <BarChart3 className="h-3.5 w-3.5" />,
  "Data Scientist": <Brain className="h-3.5 w-3.5" />,
  "Backend Engineer": <Database className="h-3.5 w-3.5" />,
  "AI Enthusiast": <Sparkles className="h-3.5 w-3.5" />,
  Researcher: <Search className="h-3.5 w-3.5" />,
  "Technical Writer": <PenTool className="h-3.5 w-3.5" />,
  "Business Analyst": <BarChart3 className="h-3.5 w-3.5" />,
};

function useRotatingRoles(roles: string[], interval = 2500) {
  const [index, setIndex] = React.useState(0);
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % roles.length);
        setVisible(true);
      }, 200);
    }, interval);
    return () => clearInterval(timer);
  }, [roles.length, interval]);

  return { role: roles[index], visible };
}

function FloatingOrb({
  className,
  delay = 0,
  size = "w-64 h-64",
}: {
  className: string;
  delay?: number;
  size?: string;
}) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-30 dark:opacity-20 ${size} ${className}`}
      animate={{
        y: [0, -20, 10, 0],
        x: [0, 15, -10, 0],
        scale: [1, 1.05, 0.95, 1],
      }}
      transition={{
        duration: 8 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

function FloatingShape({
  className,
  delay = 0,
  children,
}: {
  className: string;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className={`absolute ${className}`}
      animate={{
        y: [0, -12, 6, 0],
        rotate: [0, 5, -3, 0],
      }}
      transition={{
        duration: 6 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      <div className="w-8 h-8 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10 flex items-center justify-center text-white/60 dark:text-white/60">
        {children}
      </div>
    </motion.div>
  );
}

export function Hero() {
  const profile = getProfile();
  const roles = getRoles();
  const { role, visible } = useRotatingRoles(roles);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950" />
      <div className="absolute inset-0 grid-overlay" />

      {/* Animated gradient orbs */}
      <FloatingOrb className="top-1/4 left-1/4 bg-blue-300 dark:bg-blue-600" delay={0} />
      <FloatingOrb className="bottom-1/3 right-1/4 bg-purple-300 dark:bg-purple-600" delay={1} />
      <FloatingOrb className="top-1/3 right-1/3 bg-pink-300 dark:bg-pink-600" delay={2} size="w-48 h-48" />
      <FloatingOrb className="bottom-1/4 left-1/3 bg-cyan-300 dark:bg-cyan-600" delay={0.5} size="w-56 h-56" />

      {/* Floating decorative shapes */}
      <FloatingShape className="top-24 left-[10%] hidden lg:block" delay={0}>
        <Code2 className="h-4 w-4" />
      </FloatingShape>
      <FloatingShape className="top-32 right-[12%] hidden lg:block" delay={1.5}>
        <Database className="h-4 w-4" />
      </FloatingShape>
      <FloatingShape className="bottom-36 left-[15%] hidden lg:block" delay={0.8}>
        <Brain className="h-4 w-4" />
      </FloatingShape>
      <FloatingShape className="bottom-40 right-[10%] hidden lg:block" delay={2.2}>
        <BarChart3 className="h-4 w-4" />
      </FloatingShape>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Photo column - desktop only */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden md:block"
          >
            <div className="relative mx-auto max-w-[20rem]">
              <div className="absolute inset-0 rounded-[2rem] bg-blue-500/20 dark:bg-blue-500/10 blur-3xl" />
              <div className="absolute inset-0 rounded-[2rem] bg-cyan-400/10 blur-2xl" style={{ animationDelay: "2s" }} />
              <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] border border-zinc-200/70 dark:border-white/10 ring-2 ring-blue-500/20 shadow-2xl shadow-blue-500/10 bg-zinc-100 dark:bg-zinc-800">
                <Image
                  src={profile.photo}
                  alt={profile.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 0vw, 320px"
                  className="object-scale-down"
                />
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/90 dark:bg-zinc-900/90 border border-zinc-200/60 dark:border-zinc-700/50 px-5 py-2 shadow-lg shadow-blue-500/5 backdrop-blur-sm whitespace-nowrap">
                <span className="text-xs font-semibold gradient-text">{roles[0]}</span>
              </div>
            </div>
          </motion.div>

          {/* Text column */}
          <div className="text-center md:text-left">
            {/* Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                {profile.name}
              </h1>
            </motion.div>

            {/* Photo - mobile only (between name and roles) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="md:hidden flex justify-center my-6"
            >
              <div className="relative w-60 h-72">
                <div className="absolute inset-0 rounded-[2rem] bg-blue-500/20 dark:bg-blue-500/10 blur-3xl" />
                <div className="relative w-full h-full overflow-hidden rounded-[2rem] border border-zinc-200/70 dark:border-white/10 ring-2 ring-blue-500/20 shadow-2xl shadow-blue-500/10 bg-zinc-100 dark:bg-zinc-800">
                  <Image
                    src={profile.photo}
                    alt={profile.name}
                    fill
                    sizes="240px"
                    className="object-scale-down"
                  />
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/90 dark:bg-zinc-900/90 border border-zinc-200/60 dark:border-zinc-700/50 px-4 py-1.5 shadow-lg shadow-blue-500/5 backdrop-blur-sm whitespace-nowrap">
                  <span className="text-[11px] font-semibold gradient-text">{roles[0]}</span>
                </div>
              </div>
            </motion.div>

            {/* Rotating roles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-3"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-zinc-800/60 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-700/50">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">I&apos;m a</span>
                <motion.span
                  key={role}
                  initial={{ opacity: 0, y: 5 }}
                  animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: -5 }}
                  className="text-sm font-semibold gradient-text flex items-center gap-1.5"
                >
                  {roleIcons[role]}
                  {role}
                </motion.span>
              </div>
            </motion.div>

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mb-8 leading-relaxed md:mx-0 mx-auto">
                {profile.tagline}
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col w-full items-stretch gap-3 sm:flex-row sm:flex-wrap md:justify-start justify-center [&_a]:w-full sm:[&_a]:w-auto [&_a]:justify-center"
            >
              <a href="#about">
                <Button variant="default" size="lg">
                  <Compass className="mr-2 h-4 w-4" />
                  Explore My World
                </Button>
              </a>
              <a href="#websites">
                <Button variant="outline" size="lg">
                  <Globe className="mr-2 h-4 w-4" />
                  My Websites
                </Button>
              </a>
              <a href="#profiles">
                <Button variant="outline" size="lg">
                  <User className="mr-2 h-4 w-4" />
                  My Profiles
                </Button>
              </a>
              <a href="#publications">
                <Button variant="ghost" size="lg">
                  <BookOpen className="mr-2 h-4 w-4" />
                  My Publications
                </Button>
              </a>
              <a href="https://lifeos-aiproject.vercel.app" target="_blank" rel="noopener noreferrer">
                <Button variant="default" size="lg" className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white border-0">
                  <Sparkles className="mr-2 h-4 w-4" />
                  LifeOS AI
                </Button>
              </a>
              <a href="/study-corner">
                <Button variant="outline" size="lg">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Study Corner
                </Button>
              </a>
              <a href="/picnic">
                <Button variant="outline" size="lg">
                  <Camera className="mr-2 h-4 w-4" />
                  Picnic
                </Button>
              </a>
              <a href="/youtube-dev">
                <Button variant="default" size="lg" className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white border-0">
                  <Play className="mr-2 h-4 w-4 fill-white" />
                  YouTube Dev
                </Button>
              </a>
              <a href="https://code-verse-academy.vercel.app" target="_blank" rel="noopener noreferrer">
                <Button variant="default" size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white border-0">
                  <BookOpen className="mr-2 h-4 w-4" />
                  CodeVerse Academy
                </Button>
              </a>
              <a href="https://ai-and-ml-portfolio.vercel.app" target="_blank" rel="noopener noreferrer">
                <Button variant="default" size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white border-0">
                  <Cpu className="mr-2 h-4 w-4" />
                  AI/ML Portfolio
                </Button>
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <a
          href="#about"
          className="flex flex-col items-center gap-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          <span className="text-xs font-medium tracking-wider uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowDown className="h-4 w-4" />
          </motion.div>
        </a>
      </motion.div>
    </section>
  );
}
