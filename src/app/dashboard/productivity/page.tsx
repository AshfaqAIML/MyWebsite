"use client";

import * as React from "react";
import { Plus, CheckCircle, Circle, ExternalLink, Target } from "lucide-react";
import { getProjects } from "@/lib/data";

interface Task {
  id: string;
  text: string;
  done: boolean;
  date: string;
}

export default function ProductivityPage() {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [note, setNote] = React.useState("");
  const [newTask, setNewTask] = React.useState("");

  const lifeos = React.useMemo(() => getProjects().find((p) => p.title === "LifeOS AI"), []);

  React.useEffect(() => {
    const stored = localStorage.getItem("dashboard-tasks");
    if (stored) {
      const t = setTimeout(() => setTasks(JSON.parse(stored) as Task[]), 0);
      return () => clearTimeout(t);
    } else {
      const seed: Task[] = [
        { id: "lo-habit-1", text: "Review LifeOS AI daily habit streak", done: false, date: new Date().toISOString().split("T")[0] },
        { id: "lo-goal-1", text: "Update career goal progress in LifeOS AI", done: false, date: new Date().toISOString().split("T")[0] },
        { id: "lo-goal-2", text: "Complete AI coaching session on LifeOS AI", done: false, date: new Date().toISOString().split("T")[0] },
        { id: "lo-habit-2", text: "Log today's habits in LifeOS AI", done: false, date: new Date().toISOString().split("T")[0] },
      ];
      const t = setTimeout(() => {
        setTasks(seed);
        localStorage.setItem("dashboard-tasks", JSON.stringify(seed));
      }, 0);
      return () => clearTimeout(t);
    }
    const savedNote = localStorage.getItem("dashboard-note");
    if (savedNote !== null && savedNote !== "") {
      const t = setTimeout(() => setNote(savedNote ?? ""), 0);
      return () => clearTimeout(t);
    }
  }, []);

  React.useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("dashboard-tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  function addTask() {
    if (!newTask.trim()) return;
    setTasks([{ id: Date.now().toString(), text: newTask, done: false, date: new Date().toISOString().split("T")[0] }, ...tasks]);
    setNewTask("");
  }

  function toggleTask(id: string) {
    setTasks(tasks.map((t) => t.id === id ? { ...t, done: !t.done } : t));
  }

  const pendingTasks = tasks.filter((t) => !t.done).length;
  const completedTasks = tasks.filter((t) => t.done).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Productivity Center</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Tasks, notes, and goals.</p>
      </div>

      {lifeos && (
        <div className="p-5 mb-6 rounded-2xl border border-emerald-200/50 dark:border-emerald-700/30 bg-emerald-50/50 dark:bg-emerald-900/10">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Target className="h-4 w-4 text-emerald-600" />
                Connected: LifeOS AI
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-lg">{lifeos.description.slice(0, 200)}...</p>
            </div>
            <a href={lifeos.liveUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 transition-colors">
              Open App <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <div className="flex gap-3 mt-3">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
              AI-powered coaching
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
              Habit tracking
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
              Career planning
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Tasks</h2>
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="text-green-500">{completedTasks} done</span>
              <span>·</span>
              <span>{pendingTasks} pending</span>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <input value={newTask} onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm" />
            <button onClick={addTask}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-90">
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {tasks.map((task) => (
              <button key={task.id} onClick={() => toggleTask(task.id)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-left">
                {task.done ? (
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 text-zinc-300 dark:text-zinc-600 shrink-0" />
                )}
                <span className={`text-sm ${task.done ? "line-through text-zinc-500 dark:text-zinc-400" : "text-zinc-700 dark:text-zinc-300"}`}>
                  {task.text}
                </span>
              </button>
            ))}
            {tasks.length === 0 && (
              <p className="text-center py-8 text-zinc-500 dark:text-zinc-400 text-sm">No tasks yet. Add one above.</p>
            )}
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 bg-white dark:bg-zinc-900">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Quick Notes</h2>
          <textarea value={note} onChange={(e) => { setNote(e.target.value); localStorage.setItem("dashboard-note", e.target.value); }}
            placeholder="Write your notes here..."
            className="w-full h-64 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm resize-none" />
        </div>
      </div>
    </div>
  );
}
