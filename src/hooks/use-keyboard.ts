"use client";

import { useEffect } from "react";

type Shortcut = {
  key: string;
  meta?: boolean;
  ctrl?: boolean;
  handler: () => void;
};

export function useKeyboard(shortcuts: Shortcut[]) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      for (const s of shortcuts) {
        const meta = s.meta ? e.metaKey || e.ctrlKey : true;
        const ctrl = s.ctrl ? e.ctrlKey : true;
        if (meta && ctrl && e.key.toLowerCase() === s.key.toLowerCase()) {
          e.preventDefault();
          s.handler();
          return;
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [shortcuts]);
}
