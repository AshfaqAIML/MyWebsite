"use client";

import type { ReactNode } from "react";
import { StudyNav } from "./study-nav";

type StudyShellProps = {
  children: ReactNode;
};

export function StudyShell({ children }: StudyShellProps) {
  return (
    <div className="flex min-h-screen bg-[#fafafa] dark:bg-[#0a0a0f]">
      <aside className="study-sidebar fixed left-0 top-0 z-30 hidden h-full w-56 lg:block">
        <div className="flex h-14 items-center px-5 border-b border-black/[0.04] dark:border-white/[0.06]">
          <span className="text-sm font-semibold tracking-tight">Study</span>
        </div>
        <StudyNav />
      </aside>
      <main className="flex-1 lg:pl-56">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
