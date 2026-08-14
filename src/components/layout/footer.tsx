"use client";

import { Heart, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProfile, getSiteConfig } from "@/lib/data";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/study-corner/read")) return null;
  const profile = getProfile();
  const config = getSiteConfig();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-zinc-200/50 dark:border-zinc-700/50 bg-zinc-50/50 dark:bg-zinc-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-2">
              <span className="gradient-text">{profile.name}</span>
              <span className="text-zinc-500 dark:text-zinc-400">.</span>
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
              {profile.tagline}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3 uppercase tracking-wider">
              Connect
            </h4>
            <div className="space-y-2">
              {config.links.linkedin && (
                <a
                  href={config.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  LinkedIn
                </a>
              )}
              {config.links.github && (
                <a
                  href={config.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  GitHub
                </a>
              )}
              {config.links.twitter && (
                <a
                  href={config.links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  X (Twitter)
                </a>
              )}
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollToTop}
              className="mb-4"
            >
              Back to top
              <ArrowUp className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-zinc-200/50 dark:border-zinc-700/50 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            &copy; {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-3">
            <span className="flex items-center gap-1">Built with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> using Next.js</span>
            <span className="text-zinc-300 dark:text-zinc-600">|</span>
            <a href="/dashboard/login" className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Dashboard</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
