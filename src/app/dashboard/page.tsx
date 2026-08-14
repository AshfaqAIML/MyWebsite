import { StatsCard } from "@/components/dashboard/stats-card";
import { Briefcase, Code, BookOpen, FileText, CheckSquare } from "lucide-react";

export default function DashboardHome() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Overview</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Your personal operating system at a glance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatsCard label="Job Applications" value={12} icon={<Briefcase className="h-4 w-4" />} trend="+3 this month" />
        <StatsCard label="Freelance Projects" value={8} icon={<Code className="h-4 w-4" />} />
        <StatsCard label="Books Read" value={6} icon={<BookOpen className="h-4 w-4" />} trend="+2 this year" />
        <StatsCard label="Articles Published" value={4} icon={<FileText className="h-4 w-4" />} />
        <StatsCard label="Tasks" value="—" icon={<CheckSquare className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 bg-white dark:bg-zinc-900">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[
              { text: "Applied to Frontend Developer at Company A", time: "2 days ago" },
              { text: "Completed React course on Coursera", time: "5 days ago" },
              { text: "Sent proposal on Upwork", time: "1 week ago" },
              { text: "Published new article on Medium", time: "2 weeks ago" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0 last:pb-0">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">{item.text}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 bg-white dark:bg-zinc-900">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Add Job", href: "/dashboard/jobs" },
              { label: "Add Task", href: "/dashboard/todo" },
              { label: "Track Proposal", href: "/dashboard/freelancing" },
              { label: "Log Learning", href: "/dashboard/learning" },
              { label: "New Note", href: "/dashboard/productivity" },
              { label: "Platforms", href: "/dashboard/platforms" },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-center"
              >
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {action.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
