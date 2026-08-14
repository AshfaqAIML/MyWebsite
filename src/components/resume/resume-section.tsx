"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Download,
  ExternalLink,
  Eye,
  File as FileIcon,
  Calendar,
  Copy,
  Check,
  User,
  Briefcase,
  Mail,
  LayoutTemplate,
} from "lucide-react";
import {
  getResumeDocuments,
  getResumeDocumentTypes,
  formatFileSize,
} from "@/lib/data";
import { SectionHeader } from "../certificates/section-header";
import { cn } from "@/lib/utils";
import type { ResumeDocument, ResumeDocumentType } from "@/lib/types";

const TYPE_META: Record<
  ResumeDocumentType,
  { label: string; icon: React.ElementType; color: string }
> = {
  resume: { label: "Resume", icon: User, color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10" },
  cv: { label: "CV", icon: Briefcase, color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10" },
  "cover-letter": { label: "Cover Letter", icon: Mail, color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10" },
  portfolio: { label: "Portfolio", icon: LayoutTemplate, color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10" },
};

const TYPE_LABELS: Record<string, string> = {
  resume: "Resume",
  cv: "CV",
  "cover-letter": "Cover Letter",
  portfolio: "Portfolio",
};

export function ResumeSection() {
  const documents = React.useMemo(() => getResumeDocuments(), []);
  const types = React.useMemo(() => getResumeDocumentTypes(), []);
  const featured = documents.find((d) => d.featured);

  const [activeType, setActiveType] = React.useState<string>("All");
  const [preview, setPreview] = React.useState<ResumeDocument | null>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    if (activeType === "All") return documents;
    return documents.filter((d) => d.type === activeType);
  }, [documents, activeType]);

  const copyLink = async (doc: ResumeDocument) => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}${doc.filePath}`
      );
      setCopiedId(doc.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {}
  };

  return (
    <section id="resume" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Documents"
          title="Resume & CV Center"
          description="Professional documents for recruiters, clients, and collaborators — preview, download, or share in one click."
        />

        {/* Type filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {["All", ...types].map((type) => {
            const active = activeType === type;
            return (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                  active
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-transparent shadow-sm"
                    : "bg-white/60 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                )}
              >
                {type === "All" ? "All" : TYPE_LABELS[type] ?? type}
              </button>
            );
          })}
        </div>

        {/* Featured document */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-900/50 p-6 sm:p-8 flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    Featured
                  </span>
                  <span
                    className={cn(
                      "px-2 py-0.5 text-[10px] font-semibold rounded-full flex items-center gap-1",
                      TYPE_META[featured.type].color
                    )}
                  >
                    {(() => {
                      const Icon = TYPE_META[featured.type].icon;
                      return <Icon className="h-3 w-3" />;
                    })()}
                    {TYPE_META[featured.type].label}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                  {featured.title}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mb-4">
                  {featured.description}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500 mb-5">
                  <span className="flex items-center gap-1">
                    <FileIcon className="h-3.5 w-3.5" /> PDF ·{" "}
                    {formatFileSize(featured.fileSize)}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> Updated{" "}
                    {new Date(featured.updatedAt + "T00:00:00").toLocaleDateString(
                      "en-GB",
                      { day: "numeric", month: "short", year: "numeric" }
                    )}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setPreview(featured)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 transition-opacity"
                  >
                    <Eye className="h-4 w-4" /> Preview
                  </button>
                  <a
                    href={featured.filePath}
                    download={featured.fileName}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Download className="h-4 w-4" /> Download
                  </a>
                  <button
                    onClick={() => copyLink(featured)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    {copiedId === featured.id ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    {copiedId === featured.id ? "Copied" : "Copy Link"}
                  </button>
                </div>
              </div>
              <div className="hidden md:flex items-center justify-center">
                <div className="relative w-40 h-52 rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 border border-zinc-200 dark:border-zinc-700 overflow-hidden shadow-lg flex items-center justify-center">
                  <FileText className="h-14 w-14 text-zinc-400 dark:text-zinc-600" />
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-medium text-zinc-400 dark:text-zinc-500">
                    PDF
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Document grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((doc, index) => {
              const meta = TYPE_META[doc.type];
              const Icon = meta.icon;
              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (index % 3) * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="group relative rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl p-5 hover:shadow-2xl hover:shadow-zinc-900/10 dark:hover:shadow-black/40 transition-shadow duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "h-11 w-11 rounded-xl flex items-center justify-center shrink-0",
                        meta.color
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                          {meta.label}
                        </span>
                        {doc.featured && (
                          <span className="px-1.5 py-0.5 text-[9px] font-semibold rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                            Featured
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 leading-snug line-clamp-1">
                        {doc.title}
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-1">
                        {doc.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-zinc-400 dark:text-zinc-500 mt-3">
                    <FileIcon className="h-3 w-3" /> PDF ·{" "}
                    {formatFileSize(doc.fileSize)}
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="flex flex-wrap gap-1.5">
                      {doc.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 text-[10px] rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setPreview(doc)}
                        aria-label={`Preview ${doc.title}`}
                        className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <a
                        href={doc.filePath}
                        download={doc.fileName}
                        aria-label={`Download ${doc.title}`}
                        className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                      <a
                        href={doc.filePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${doc.title}`}
                        className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-zinc-400 dark:text-zinc-500">
            <p className="text-sm">No documents in this category yet.</p>
          </div>
        )}
      </div>

      {/* Preview modal */}
      <AnimatePresence>
        {preview && <PreviewDialog doc={preview} onClose={() => setPreview(null)} />}
      </AnimatePresence>
    </section>
  );
}

function PreviewDialog({
  doc,
  onClose,
}: {
  doc: ResumeDocument;
  onClose: () => void;
}) {
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement;
    closeButtonRef.current?.focus();

    const trapFocus = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    window.addEventListener("keydown", trapFocus);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("keydown", trapFocus);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [doc, onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={doc.title}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        ref={dialogRef}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-4xl max-h-[90dvh] overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 truncate">
              {doc.title}
            </h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              {TYPE_META[doc.type].label} · PDF ·{" "}
              {formatFileSize(doc.fileSize)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={doc.filePath}
              download={doc.fileName}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 transition-opacity"
            >
              <Download className="h-3.5 w-3.5" /> Download
            </a>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              aria-label="Close"
              className="p-2.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <FileText className="h-5 w-5 rotate-0" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <embed
            src={doc.filePath}
            type="application/pdf"
            className="w-full h-full min-h-[60dvh]"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
