"use client";

import * as React from "react";
import { Plus, Trash2, CheckCircle, Circle, Clock, AlertCircle, FileText, GitBranch, Beaker, LayoutList } from "lucide-react";

type TodoStatus = "pending" | "in-progress" | "done";

type TodoCategory = "modification" | "article" | "research" | "general";

interface Todo {
  id: string;
  title: string;
  description: string;
  category: TodoCategory;
  status: TodoStatus;
  dueDate: string;
  createdAt: string;
}

const categoryConfig: Record<TodoCategory, { label: string; icon: React.ReactNode; color: string }> = {
  modification: { label: "Modification", icon: <GitBranch className="h-3.5 w-3.5" />, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  article: { label: "Article", icon: <FileText className="h-3.5 w-3.5" />, color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  research: { label: "Research", icon: <Beaker className="h-3.5 w-3.5" />, color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  general: { label: "General", icon: <LayoutList className="h-3.5 w-3.5" />, color: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400" },
};

const statusIcons: Record<TodoStatus, React.ReactNode> = {
  pending: <Circle className="h-5 w-5 text-zinc-300 dark:text-zinc-600" />,
  "in-progress": <Clock className="h-5 w-5 text-amber-500" />,
  done: <CheckCircle className="h-5 w-5 text-green-500" />,
};

export default function TodoPage() {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [filter, setFilter] = React.useState<TodoStatus | "all">("all");
  const [form, setForm] = React.useState({
    title: "",
    description: "",
    category: "general" as TodoCategory,
    dueDate: "",
  });

  React.useEffect(() => {
    const stored = localStorage.getItem("dashboard-todos");
    if (!stored) return;
    const t = setTimeout(() => setTodos(JSON.parse(stored) as Todo[]), 0);
    return () => clearTimeout(t);
  }, []);

  React.useEffect(() => {
    localStorage.setItem("dashboard-todos", JSON.stringify(todos));
  }, [todos]);

  function addTodo() {
    if (!form.title.trim()) return;
    const todo: Todo = {
      id: Date.now().toString(),
      ...form,
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setTodos([todo, ...todos]);
    setForm({ title: "", description: "", category: "general", dueDate: "" });
    setShowForm(false);
  }

  function toggleStatus(id: string) {
    setTodos(todos.map((t) => {
      if (t.id !== id) return t;
      const next: Record<TodoStatus, TodoStatus> = { pending: "in-progress", "in-progress": "done", done: "pending" };
      return { ...t, status: next[t.status] };
    }));
  }

  function deleteTodo(id: string) {
    setTodos(todos.filter((t) => t.id !== id));
  }

  const filtered = filter === "all" ? todos : todos.filter((t) => t.status === filter);
  const stats = {
    total: todos.length,
    pending: todos.filter((t) => t.status === "pending").length,
    inProgress: todos.filter((t) => t.status === "in-progress").length,
    done: todos.filter((t) => t.status === "done").length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">To-Do List</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Track future work — project modifications, articles, research, and more.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-700/50 text-center">
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{stats.total}</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Total</p>
        </div>
        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/50 text-center">
          <p className="text-2xl font-bold text-zinc-600 dark:text-zinc-400 dark:text-zinc-300">{stats.pending}</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Pending</p>
        </div>
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-700/30 text-center">
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{stats.inProgress}</p>
          <p className="text-xs text-amber-600 dark:text-amber-500">In Progress</p>
        </div>
        <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200/50 dark:border-green-700/30 text-center">
          <p className="text-2xl font-bold text-green-700 dark:text-green-400">{stats.done}</p>
          <p className="text-xs text-green-600 dark:text-green-500">Done</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {(["all", "pending", "in-progress", "done"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === f
                ? "bg-zinc-900 dark:bg-white text-white dark:text-black"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            {f === "all" ? "All" : f === "in-progress" ? "In Progress" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="p-5 mb-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 bg-white dark:bg-zinc-900">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">New Task</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input
              placeholder="Task title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm col-span-full"
            />
            <textarea
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm col-span-full"
              rows={2}
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as TodoCategory })}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm"
            >
              <option value="modification">Modification</option>
              <option value="article">Article</option>
              <option value="research">Research</option>
              <option value="general">General</option>
            </select>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm"
            />
          </div>
          <button
            onClick={addTodo}
            className="px-6 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Add Task
          </button>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-500 dark:text-zinc-400">
          <p>{todos.length === 0 ? "No tasks yet. Click \"Add Task\" to get started." : "No tasks match this filter."}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((todo) => (
            <div
              key={todo.id}
              className={`p-4 rounded-xl border bg-white dark:bg-zinc-900 flex items-start gap-3 transition-all ${
                todo.status === "done"
                  ? "border-green-200/50 dark:border-green-700/30 opacity-75"
                  : "border-zinc-200/50 dark:border-zinc-700/50"
              }`}
            >
              <button onClick={() => toggleStatus(todo.id)} className="mt-0.5 shrink-0">
                {statusIcons[todo.status]}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-medium text-sm ${todo.status === "done" ? "line-through text-zinc-500 dark:text-zinc-400" : "text-zinc-900 dark:text-zinc-100"}`}>
                    {todo.title}
                  </h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${categoryConfig[todo.category].color}`}>
                    {categoryConfig[todo.category].icon}
                    <span className="ml-1">{categoryConfig[todo.category].label}</span>
                  </span>
                </div>
                {todo.description && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">{todo.description}</p>
                )}
                <div className="flex items-center gap-3 text-[11px] text-zinc-500 dark:text-zinc-400">
                  <span>Created: {todo.createdAt}</span>
                  {todo.dueDate && <span>Due: {todo.dueDate}</span>}
                </div>
              </div>
              <button onClick={() => deleteTodo(todo.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0">
                <Trash2 className="h-3.5 w-3.5 text-red-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
