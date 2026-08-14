"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
  className?: string;
};

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-6", className)}>
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
        <Icon className="h-7 w-7 text-black/55 dark:text-white/50" />
      </div>
      <h3 className="text-lg font-semibold text-black/80 dark:text-white/80">{title}</h3>
      <p className="mt-1.5 max-w-sm text-center text-sm text-black/60 dark:text-white/60">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/90"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
