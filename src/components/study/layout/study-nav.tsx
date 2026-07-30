"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Library, BarChart3, Settings } from "lucide-react";

const items = [
  { href: "/study", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/study/library", icon: Library, label: "Library" },
  { href: "/study/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/study/settings", icon: Settings, label: "Settings" },
];

export function StudyNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 px-3 py-4">
      {items.map(({ href, icon: Icon, label }) => {
        const active = pathname === href || (href !== "/study" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "nav-item flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
              active
                ? "nav-item active text-blue-600 dark:text-blue-400"
                : "text-black/50 hover:text-black/80 hover:bg-black/[0.03] dark:text-white/40 dark:hover:text-white/70 dark:hover:bg-white/[0.04]",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
