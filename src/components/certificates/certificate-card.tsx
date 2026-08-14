"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { BadgeCheck, ExternalLink, Award } from "lucide-react";
import type { Certificate } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CertificateCardProps {
  certificate: Certificate;
  onOpen: (certificate: Certificate) => void;
  index?: number;
}

export function CertificateCard({ certificate, onOpen, index = 0 }: CertificateCardProps) {
  const {
    title,
    issuer,
    description,
    categories,
    skills,
    issueDate,
    certificateImage,
    featured,
    status,
  } = certificate;

  const date = issueDate
    ? new Date(issueDate + "T00:00:00").toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
      })
    : null;

  const verified = status === "verified";
  const showSkills = (skills || []).slice(0, 4);

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 4) * 0.05 }}
      onClick={() => onOpen(certificate)}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative w-full text-left rounded-2xl overflow-hidden border transition-shadow duration-300",
        "bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl",
        "border-zinc-200/70 dark:border-zinc-800/70 hover:shadow-2xl hover:shadow-zinc-900/10 dark:hover:shadow-black/40"
      )}
    >
      {/* Preview */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 overflow-hidden">
        {certificateImage ? (
          <img
            src={certificateImage}
            alt={title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Award className="h-12 w-12 text-zinc-400/60" />
          </div>
        )}

        {/* Status + featured badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {featured && (
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              Featured
            </span>
          )}
          {verified ? (
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-500/90 text-white flex items-center gap-1">
              <BadgeCheck className="h-3 w-3" /> Verified
            </span>
          ) : (
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-zinc-500/80 text-white">
              Credential
            </span>
          )}
        </div>

        {issuer && (
          <span className="absolute bottom-3 left-3 px-2 py-0.5 text-[10px] font-medium rounded-md bg-black/40 text-white backdrop-blur-sm">
            {issuer}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 leading-snug line-clamp-2 mb-1">
          {title}
        </h3>

        {description && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-2">
            {description}
          </p>
        )}

        {showSkills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {showSkills.map((skill) => (
              <span
                key={skill}
                className="px-1.5 py-0.5 text-[10px] rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
            {categories?.[0] || "General"}
            {date ? ` · ${date}` : ""}
          </span>
          <span className="flex items-center gap-1 text-[11px] font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
            View <ExternalLink className="h-3 w-3" />
          </span>
        </div>
      </div>
    </motion.button>
  );
}