"use client";

import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-xl", className)} />;
}

export function StatsCardSkeleton() {
  return (
    <div className="rounded-2xl border border-black/[0.04] dark:border-white/[0.06] bg-white/70 dark:bg-white/[0.03] p-5">
      <Skeleton className="mb-3 h-4 w-4" />
      <Skeleton className="mb-1 h-7 w-16" />
      <Skeleton className="h-3 w-12" />
    </div>
  );
}

export function BookCardSkeleton() {
  return (
    <div className="rounded-2xl border border-black/[0.04] dark:border-white/[0.06] bg-white/70 dark:bg-white/[0.03] overflow-hidden">
      <Skeleton className="h-40 w-full rounded-none" />
      <div className="p-4">
        <Skeleton className="mb-2 h-4 w-3/4" />
        <Skeleton className="mb-3 h-3 w-1/2" />
        <Skeleton className="h-2 w-full" />
      </div>
    </div>
  );
}

export function ActivitySkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}
