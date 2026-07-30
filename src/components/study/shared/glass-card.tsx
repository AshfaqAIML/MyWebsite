"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  as?: "div" | "button";
  onClick?: () => void;
};

export function GlassCard({ children, className, hover, as: Tag = "div", onClick }: GlassCardProps) {
  return (
    <Tag
      onClick={onClick}
      className={cn(
        "rounded-2xl border border-black/[0.04] dark:border-white/[0.06] bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl shadow-sm",
        hover && "transition-all duration-300 hover:shadow-md hover:bg-white/85 dark:hover:bg-white/[0.06]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
