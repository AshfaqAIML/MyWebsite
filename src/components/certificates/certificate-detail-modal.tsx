"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  X,
  FileText,
  ExternalLink,
  BadgeCheck,
  Calendar,
  Award,
  Copy,
  Check,
  Download,
} from "lucide-react";
import type { Certificate } from "@/lib/types";

interface CertificateDetailModalProps {
  certificate: Certificate | null;
  onClose: () => void;
}

export function CertificateDetailModal({ certificate, onClose }: CertificateDetailModalProps) {
  const [copied, setCopied] = React.useState(false);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (!certificate) return;
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
  }, [certificate, onClose]);

  const copyLink = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <AnimatePresence>
      {certificate && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={certificate.title}
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
            className="relative w-full max-w-4xl max-h-[90dvh] overflow-y-auto rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl premium-scrollbar"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                {certificate.status === "verified" ? (
                  <BadgeCheck className="h-5 w-5 text-emerald-500" />
                ) : (
                  <Award className="h-5 w-5 text-blue-500" />
                )}
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  {certificate.status === "verified" ? "Verified Credential" : "Credential"}
                </span>
              </div>
              <button
                ref={closeButtonRef}
                onClick={onClose}
                aria-label="Close"
                className="p-2.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-0">
              {/* Preview */}
              <div className="relative aspect-[4/3] md:aspect-square md:aspect-auto bg-zinc-100 dark:bg-zinc-800">
                {certificate.certificateImage ? (
                  <Image
                    src={certificate.certificateImage}
                    alt={certificate.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain p-6"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    {certificate.certificatePdf ? (
                      <embed
                        src={certificate.certificatePdf}
                        type="application/pdf"
                        className="w-full h-full min-h-[280px] sm:min-h-[420px]"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Award className="h-16 w-16 text-zinc-300 dark:text-zinc-600" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-6 sm:p-7 space-y-6">
                {certificate.featured && (
                  <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white inline-block">
                    Featured
                  </span>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
                    {certificate.title}
                  </h2>
                  {certificate.issuer && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{certificate.issuer}</p>
                  )}
                </div>

                {certificate.description && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 dark:text-zinc-300 leading-relaxed">
                    {certificate.description}
                  </p>
                )}

                {/* Meta grid */}
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  {certificate.issueDate && (
                    <div>
                      <dt className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Issued
                      </dt>
                      <dd className="mt-0.5 font-medium text-zinc-800 dark:text-zinc-100">
                        {new Date(certificate.issueDate + "T00:00:00").toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </dd>
                    </div>
                  )}
                  {certificate.credentialId && (
                    <div>
                      <dt className="text-xs text-zinc-500 dark:text-zinc-400">Credential ID</dt>
                      <dd className="mt-0.5 font-medium text-zinc-800 dark:text-zinc-100 break-all">
                        {certificate.credentialId}
                      </dd>
                    </div>
                  )}
                </dl>

                {/* Categories */}
                {certificate.categories.length > 0 && (
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">Categories</p>
                    <div className="flex flex-wrap gap-1.5">
                      {certificate.categories.map((cat) => (
                        <span
                          key={cat}
                          className="px-2 py-0.5 text-[11px] rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills */}
                {certificate.skills.length > 0 && (
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {certificate.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 text-[11px] rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  {certificate.certificatePdf && (
                    <a
                      href={certificate.certificatePdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 transition-opacity"
                    >
                      <FileText className="h-4 w-4" /> View PDF
                    </a>
                  )}
                  {certificate.certificatePdf && (
                    <a
                      href={certificate.certificatePdf}
                      download
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <Download className="h-4 w-4" /> Download
                    </a>
                  )}
                  {certificate.verificationUrl && (
                    <a
                      href={certificate.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" /> Verify
                    </a>
                  )}
                  {certificate.credentialUrl && (
                    <button
                      onClick={() => copyLink(certificate.credentialUrl!)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                      {copied ? "Copied" : "Copy Link"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}