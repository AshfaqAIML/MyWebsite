"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Section, SectionGrid } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import { getSkillCategories, getSkillsByCategory } from "@/lib/data";
import {
  Code2,
  Server,
  Palette,
  Cloud,
  GitBranch,
  Brain,
  BarChart3,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

const categoryMeta: Record<string, { icon: LucideIcon; gradient: string; border: string; color: string }> = {
  "Frontend Development": {
    icon: Code2,
    gradient: "from-blue-500/10 to-blue-600/5 dark:from-blue-500/20",
    border: "border-blue-200/50 dark:border-blue-700/30",
    color: "#3B82F6",
  },
  "Backend Development": {
    icon: Server,
    gradient: "from-green-500/10 to-green-600/5 dark:from-green-500/20",
    border: "border-green-200/50 dark:border-green-700/30",
    color: "#22C55E",
  },
  Design: {
    icon: Palette,
    gradient: "from-purple-500/10 to-purple-600/5 dark:from-purple-500/20",
    border: "border-purple-200/50 dark:border-purple-700/30",
    color: "#A855F7",
  },
  DevOps: {
    icon: GitBranch,
    gradient: "from-orange-500/10 to-orange-600/5 dark:from-orange-500/20",
    border: "border-orange-200/50 dark:border-orange-700/30",
    color: "#F97316",
  },
  "Data Analytics": {
    icon: BarChart3,
    gradient: "from-cyan-500/10 to-cyan-600/5 dark:from-cyan-500/20",
    border: "border-cyan-200/50 dark:border-cyan-700/30",
    color: "#06B6D4",
  },
  AI: {
    icon: Brain,
    gradient: "from-pink-500/10 to-pink-600/5 dark:from-pink-500/20",
    border: "border-pink-200/50 dark:border-pink-700/30",
    color: "#EC4899",
  },
  "Cloud Computing": {
    icon: Cloud,
    gradient: "from-sky-500/10 to-sky-600/5 dark:from-sky-500/20",
    border: "border-sky-200/50 dark:border-sky-700/30",
    color: "#0EA5E9",
  },
  Research: {
    icon: BookOpen,
    gradient: "from-rose-500/10 to-rose-600/5 dark:from-rose-500/20",
    border: "border-rose-200/50 dark:border-rose-700/30",
    color: "#F43F5E",
  },
};

function SkillBar({ name, level, delay, color }: { name: string; level?: number; delay: number; color?: string }) {
  const [width, setWidth] = React.useState(0);
  const barRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setWidth(level || 0), delay * 100);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (barRef.current) observer.observe(barRef.current);
    return () => observer.disconnect();
  }, [level, delay]);

  return (
    <div ref={barRef} className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{name}</span>
        {level && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">{level}%</span>
        )}
      </div>
      <div
        ref={barRef}
        className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden"
        role="progressbar"
        aria-label={`${name} proficiency`}
        aria-valuenow={level || 0}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color || '#3B82F6'}, ${color ? color + '80' : '#8B5CF6'})` }}
        />
      </div>
    </div>
  );
}

export function Skills() {
  const categories = getSkillCategories();

  return (
    <Section
      id="skills"
      title={
        <span>
          Skills & <span className="gradient-text">Expertise</span>
        </span>
      }
      subtitle="Technologies, tools, and methodologies I work with across the full stack."
    >
      <SectionGrid>
        {categories.map((category, index) => {
          const meta = categoryMeta[category] || categoryMeta["Frontend Development"];
          const Icon = meta.icon;
          const skills = getSkillsByCategory(category);

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className={cn(
                "p-6 rounded-2xl bg-gradient-to-br border backdrop-blur-sm card-premium",
                meta.gradient,
                meta.border
              )}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${meta.color}15` }}
                >
                  <Icon className="h-5 w-5" style={{ color: meta.color }} />
                </div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {category}
                </h3>
              </div>
              <div className="space-y-3">
                {skills.map((skill) => (
                  <SkillBar
                    key={skill.name}
                    name={skill.name}
                    level={skill.level}
                    delay={skills.indexOf(skill)}
                    color={meta.color}
                  />
                ))}
              </div>
            </motion.div>
          );
        })}
      </SectionGrid>
    </Section>
  );
}
