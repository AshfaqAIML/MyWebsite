"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CertificateFilterBarProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  search: string;
  onSearchChange: (query: string) => void;
  resultCount: number;
  totalCount: number;
}

export function CertificateFilterBar({
  categories,
  activeCategory,
  onCategoryChange,
  search,
  onSearchChange,
  resultCount,
  totalCount,
}: CertificateFilterBarProps) {
  return (
    <div className="space-y-4 mb-10">
      {/* Search */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search certificates, skills, issuers…"
          aria-label="Search certificates"
          className="w-full pl-10 pr-9 py-2.5 rounded-xl text-sm bg-white/70 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 backdrop-blur-xl text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category pills */}
      <div
        className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 snap-x scrollbar-thin"
        style={{
          scrollbarWidth: "thin",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {["All", ...categories].map((cat) => {
          const active = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={cn(
                "shrink-0 snap-start px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border whitespace-nowrap",
                active
                  ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-transparent shadow-sm"
                  : "bg-white/60 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="text-center text-xs text-zinc-400 dark:text-zinc-500">
        Showing <span className="font-semibold text-zinc-600 dark:text-zinc-300">{resultCount}</span> of {totalCount} certificates
      </div>
    </div>
  );
}