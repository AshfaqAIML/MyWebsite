import type { Metadata } from "next";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 bg-zinc-50 dark:bg-zinc-950 overflow-auto min-w-0">
        <div className="p-4 sm:p-6 lg:p-8 pt-16 sm:pt-6 lg:pt-8 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}
