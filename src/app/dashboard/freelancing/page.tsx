"use client";

import * as React from "react";
import { Plus, DollarSign, Users, Send, Star, TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";

interface Project {
  id: string;
  platform: string;
  title: string;
  client: string;
  value: string;
  status: "active" | "completed" | "proposal";
  date: string;
}

export default function FreelancingPage() {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState({ platform: "", title: "", client: "", value: "", status: "proposal" as Project["status"] });

  React.useEffect(() => {
    const stored = localStorage.getItem("dashboard-freelance");
    if (!stored) return;
    const t = setTimeout(() => setProjects(JSON.parse(stored) as Project[]), 0);
    return () => clearTimeout(t);
  }, []);

  React.useEffect(() => {
    localStorage.setItem("dashboard-freelance", JSON.stringify(projects));
  }, [projects]);

  function addProject() {
    setProjects([{ id: Date.now().toString(), ...form, date: new Date().toISOString().split("T")[0] }, ...projects]);
    setForm({ platform: "", title: "", client: "", value: "", status: "proposal" });
    setShowForm(false);
  }

  const activeCount = projects.filter((p) => p.status === "active").length;
  const completedCount = projects.filter((p) => p.status === "completed").length;
  const totalValue = projects.reduce((sum, p) => sum + (parseFloat(p.value) || 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Freelancing</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Track freelance projects, proposals, and income.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" /> Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <StatsCard label="Active Projects" value={activeCount} icon={<Users className="h-4 w-4" />} />
        <StatsCard label="Completed" value={completedCount} icon={<Star className="h-4 w-4" />} />
        <StatsCard label="Proposals Sent" value={projects.filter((p) => p.status === "proposal").length} icon={<Send className="h-4 w-4" />} />
        <StatsCard label="Total Revenue" value={`$${totalValue}`} icon={<DollarSign className="h-4 w-4" />} />
      </div>

      {showForm && (
        <div className="p-5 mb-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 bg-white dark:bg-zinc-900">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Add Project</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <input placeholder="Platform (Fiverr, Upwork...)" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm" />
            <input placeholder="Project Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm" />
            <input placeholder="Client Name" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm" />
            <input placeholder="Value ($)" type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm" />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Project["status"] })}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm">
              <option value="proposal">Proposal</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <button onClick={addProject}
            className="px-6 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-90">
            Save Project
          </button>
        </div>
      )}

      <div className="space-y-3">
        {projects.map((project) => (
          <div key={project.id} className="p-4 rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 bg-white dark:bg-zinc-900">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium text-sm text-zinc-900 dark:text-zinc-100">{project.title}</h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                project.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                project.status === "completed" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
              }`}>{project.status}</span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{project.platform} · {project.client} · ${project.value}</p>
          </div>
        ))}
        {projects.length === 0 && !showForm && (
          <p className="text-center py-16 text-zinc-500 dark:text-zinc-400">No projects yet. Click &quot;Add Project&quot; to start tracking.</p>
        )}
      </div>
    </div>
  );
}
