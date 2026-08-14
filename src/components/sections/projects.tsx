"use client";

import { motion } from "framer-motion";
import { ExternalLink, GitBranch, Sparkles, BookOpen } from "lucide-react";
import { Section, SectionGrid } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getProjects } from "@/lib/data";

const projectGradients = [
  "from-purple-400 to-pink-500",
  "from-emerald-400 to-teal-500",
  "from-blue-400 to-cyan-500",
  "from-orange-400 to-rose-500",
  "from-violet-400 to-purple-500",
];

export function Projects() {
  const projects = getProjects();

  return (
    <Section
      id="projects"
      title={
        <span>
          Featured <span className="gradient-text">Projects</span>
        </span>
      }
      subtitle="Open-source work, side projects, and production platforms I've built."
      className="bg-zinc-50/50 dark:bg-zinc-900/50"
    >
      <SectionGrid>
        {projects.map((project, index) => (
          <motion.div
            key={project.title}
            layout
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <Card className="h-full flex flex-col group hover:border-purple-200 dark:hover:border-purple-700 card-premium overflow-hidden">
              <div className={`h-1.5 w-full bg-gradient-to-r ${projectGradients[index % projectGradients.length]}`} />
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${projectGradients[index % projectGradients.length]} flex items-center justify-center text-white font-bold text-lg shadow-lg shrink-0`}>
                    {project.title.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100 mb-1">
                      {project.title}
                    </h3>
                    {project.liveUrl && (
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">Live</span>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 flex-1 mb-4 leading-relaxed line-clamp-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.technologies.slice(0, 5).map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {project.technologies.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.technologies.length - 5}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="default" size="sm">
                        <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                        Live Demo
                      </Button>
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm">
                        <GitBranch className="mr-1.5 h-3.5 w-3.5" />
                        Source Code
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </SectionGrid>
    </Section>
  );
}
