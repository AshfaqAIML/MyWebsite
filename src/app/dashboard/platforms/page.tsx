"use client";

import { ExternalLink, Database, Triangle, Server, Globe } from "lucide-react";

const platforms = [
  {
    name: "Vercel",
    url: "https://vercel.com/dar-ishfaq-backends-projects",
    description: "Deployments, env vars, domains for all projects",
    icon: Triangle,
    color: "text-black dark:text-white",
    bg: "bg-zinc-100 dark:bg-zinc-800",
  },
  {
    name: "Supabase",
    url: "https://supabase.com/dashboard/projects",
    description: "Database, auth, storage, edge functions",
    icon: Database,
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    name: "Render",
    url: "https://dashboard.render.com",
    description: "Web services, cron jobs, PostgreSQL",
    icon: Server,
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    name: "Netlify",
    url: "https://app.netlify.com/teams/moeedkamraan1123/projects",
    description: "Static sites, serverless functions, forms",
    icon: Globe,
    color: "text-teal-500",
    bg: "bg-teal-50 dark:bg-teal-950/30",
  },
];

export default function PlatformsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Platforms</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Quick access to your infrastructure dashboards.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {platforms.map((platform) => (
          <a
            key={platform.name}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${platform.bg}`}>
                <platform.icon className={`h-5 w-5 ${platform.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {platform.name}
                  </h2>
                  <ExternalLink className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" />
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{platform.description}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
