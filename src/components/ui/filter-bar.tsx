"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  search: string;
  onSearch: (query: string) => void;
  searchPlaceholder?: string;
  options: string[];
  activeOption: string;
  onOptionChange: (option: string) => void;
  allLabel?: string;
  resultCount?: number;
  totalCount?: number;
  className?: string;
}

export function FilterBar({
  search,
  onSearch,
  searchPlaceholder = "Search…",
  options,
  activeOption,
  onOptionChange,
  allLabel = "All",
  resultCount,
  totalCount,
  className,
}: FilterBarProps) {
  const [showSearch, setShowSearch] = React.useState(search.length > 0);

  return (
    <div className={cn("space-y-4 mb-10", className)}>
      <div className="relative max-w-lg mx-auto">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            onSearch(e.target.value);
            setShowSearch(e.target.value.length > 0);
          }}
          onFocus={() => setShowSearch(true)}
          onBlur={() => setShowSearch(search.length > 0)}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          className="w-full pl-10 pr-9 py-2.5 rounded-xl text-sm bg-white/70 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 backdrop-blur-xl text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />
        {showSearch && (
          <button
            onClick={() => {
              onSearch("");
              setShowSearch(false);
            }}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div
        className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 snap-x"
        style={{ scrollbarWidth: "thin", WebkitOverflowScrolling: "touch" }}
      >
        {[allLabel, ...options].map((opt) => {
          const active = activeOption === opt;
          return (
            <button
              key={opt}
              onClick={() => onOptionChange(opt)}
              className={cn(
                "shrink-0 snap-start px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border whitespace-nowrap",
                active
                  ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-transparent shadow-sm"
                  : "bg-white/60 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {typeof resultCount === "number" && typeof totalCount === "number" && (
        <div className="text-center text-xs text-zinc-400 dark:text-zinc-500">
          Showing <span className="font-semibold text-zinc-600 dark:text-zinc-300">{resultCount}</span> of {totalCount}
        </div>
      )}
    </div>
  );
}