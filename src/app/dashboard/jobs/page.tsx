"use client";

import * as React from "react";
import { Plus, ExternalLink, Trash2, CheckCircle, Clock, XCircle, Archive } from "lucide-react";

type JobStatus = "saved" | "applied" | "interview" | "offer" | "rejected" | "archived";

interface Job {
  id: string;
  company: string;
  position: string;
  platform: string;
  location: string;
  salary: string;
  status: JobStatus;
  jobUrl: string;
  appliedDate: string;
  notes: string;
}

const statusColors: Record<JobStatus, string> = {
  saved: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  applied: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  interview: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  offer: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  archived: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400",
};

const statusLabels: Record<JobStatus, string> = {
  saved: "Saved",
  applied: "Applied",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
  archived: "Archived",
};

export default function JobsPage() {
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState({
    company: "",
    position: "",
    platform: "",
    location: "",
    salary: "",
    status: "saved" as JobStatus,
    jobUrl: "",
    notes: "",
  });

  React.useEffect(() => {
    const stored = localStorage.getItem("dashboard-jobs");
    if (!stored) return;
    const t = setTimeout(() => setJobs(JSON.parse(stored) as Job[]), 0);
    return () => clearTimeout(t);
  }, []);

  React.useEffect(() => {
    localStorage.setItem("dashboard-jobs", JSON.stringify(jobs));
  }, [jobs]);

  function addJob() {
    const job: Job = {
      id: Date.now().toString(),
      ...form,
      appliedDate: new Date().toISOString().split("T")[0],
    };
    setJobs([job, ...jobs]);
    setForm({ company: "", position: "", platform: "", location: "", salary: "", status: "saved", jobUrl: "", notes: "" });
    setShowForm(false);
  }

  function deleteJob(id: string) {
    setJobs(jobs.filter((j) => j.id !== id));
  }

  const stats = {
    total: jobs.length,
    applied: jobs.filter((j) => j.status === "applied").length,
    interview: jobs.filter((j) => j.status === "interview").length,
    offer: jobs.filter((j) => j.status === "offer").length,
    rejected: jobs.filter((j) => j.status === "rejected").length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Job Tracker</h1>
          <p className="text-sm text-zinc-500 mt-1">Track your job applications and opportunities.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          Add Job
        </button>
      </div>

      <div className="grid grid-cols-5 gap-3 mb-6">
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-700/50 text-center">
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{stats.total}</p>
          <p className="text-xs text-zinc-500">Total</p>
        </div>
        <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200/50 dark:border-yellow-700/30 text-center">
          <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">{stats.applied}</p>
          <p className="text-xs text-yellow-600 dark:text-yellow-500">Applied</p>
        </div>
        <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-200/50 dark:border-purple-700/30 text-center">
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">{stats.interview}</p>
          <p className="text-xs text-purple-600 dark:text-purple-500">Interview</p>
        </div>
        <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200/50 dark:border-green-700/30 text-center">
          <p className="text-2xl font-bold text-green-700 dark:text-green-400">{stats.offer}</p>
          <p className="text-xs text-green-600 dark:text-green-500">Offer</p>
        </div>
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200/50 dark:border-red-700/30 text-center">
          <p className="text-2xl font-bold text-red-700 dark:text-red-400">{stats.rejected}</p>
          <p className="text-xs text-red-600 dark:text-red-500">Rejected</p>
        </div>
      </div>

      {showForm && (
        <div className="p-5 mb-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 bg-white dark:bg-zinc-900">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Add New Job</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <input placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm" />
            <input placeholder="Position" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm" />
            <input placeholder="Platform (LinkedIn, Indeed...)" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm" />
            <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm" />
            <input placeholder="Salary" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm" />
            <input placeholder="Job URL" value={form.jobUrl} onChange={(e) => setForm({ ...form, jobUrl: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm" />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as JobStatus })}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm">
              <option value="saved">Saved</option>
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
              <option value="archived">Archived</option>
            </select>
            <textarea placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm col-span-full" rows={2} />
          </div>
          <button onClick={addJob}
            className="px-6 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-90 transition-opacity">
            Save Job
          </button>
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="text-center py-16 text-zinc-400">
          <p>No jobs tracked yet. Click &quot;Add Job&quot; to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className="p-4 rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 bg-white dark:bg-zinc-900 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-sm text-zinc-900 dark:text-zinc-100">{job.position}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[job.status]}`}>
                    {statusLabels[job.status]}
                  </span>
                </div>
                <p className="text-xs text-zinc-500">{job.company} · {job.location} · {job.platform}</p>
                {job.salary && <p className="text-xs text-zinc-400 mt-0.5">{job.salary}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {job.jobUrl && (
                  <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    <ExternalLink className="h-4 w-4 text-zinc-400" />
                  </a>
                )}
                <button onClick={() => deleteJob(job.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                  <Trash2 className="h-4 w-4 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
