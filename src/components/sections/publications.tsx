"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ExternalLink, BookOpen, Star, FileText } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FilterBar } from "@/components/ui/filter-bar";
import { getPublications } from "@/lib/data";
import type { ArticleStatus } from "@/lib/types";

const typeLabels: Record<string, string> = {
  "research-paper": "Research Paper",
  journal: "Journal Article",
  conference: "Conference Paper",
  thesis: "Thesis",
  report: "Technical Report",
  "case-study": "Case Study",
  "survey-paper": "Survey Paper",
};

const typeStyles: Record<string, { bg: string; text: string; dot: string }> = {
  "research-paper": { bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-700 dark:text-blue-400", dot: "bg-blue-500" },
  journal: { bg: "bg-green-50 dark:bg-green-900/20", text: "text-green-700 dark:text-green-400", dot: "bg-green-500" },
  conference: { bg: "bg-purple-50 dark:bg-purple-900/20", text: "text-purple-700 dark:text-purple-400", dot: "bg-purple-500" },
  thesis: { bg: "bg-orange-50 dark:bg-orange-900/20", text: "text-orange-700 dark:text-orange-400", dot: "bg-orange-500" },
  report: { bg: "bg-zinc-50 dark:bg-zinc-800/50", text: "text-zinc-700 dark:text-zinc-300", dot: "bg-zinc-500" },
  "case-study": { bg: "bg-pink-50 dark:bg-pink-900/20", text: "text-pink-700 dark:text-pink-400", dot: "bg-pink-500" },
  "survey-paper": { bg: "bg-cyan-50 dark:bg-cyan-900/20", text: "text-cyan-700 dark:text-cyan-400", dot: "bg-cyan-500" },
};

const statusConfig: Record<ArticleStatus, { label: string; className: string }> = {
  published: {
    label: "Published",
    className: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  },
  "coming-soon": {
    label: "Coming Soon",
    className: "bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800",
  },
};

export function PublicationsSection() {
  const publications = getPublications();
  const typeOptions = React.useMemo(
    () => [...new Set(publications.map((p) => p.type))],
    [publications]
  );

  const [typeFilter, setTypeFilter] = React.useState("All");
  const [search, setSearch] = React.useState("");

  const filtered = publications.filter((pub) => {
    const matchesType = typeFilter === "All" || pub.type === typeFilter;
    if (!matchesType) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return `${pub.title} ${pub.authors.join(" ")} ${pub.journal || ""} ${pub.conference || ""} ${pub.description}`
      .toLowerCase()
      .includes(q);
  });

  const featuredList = filtered.filter((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);

  return (
    <Section
      id="publications"
      title={
        <span>
          Research & <span className="gradient-text">Publications</span>
        </span>
      }
      subtitle="Academic papers, conference proceedings, and technical reports."
      className="bg-zinc-50/50 dark:bg-zinc-900/50"
    >
      <FilterBar
        id="publications"
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search publications, authors, venues…"
        options={typeOptions.map((t) => typeLabels[t] || t)}
        activeOption={
          typeFilter === "All" ? "All" : typeLabels[typeFilter] || typeFilter
        }
        onOptionChange={(opt) =>
          setTypeFilter(opt === "All" ? "All" : opt)
        }
        resultCount={filtered.length}
        totalCount={publications.length}
      />

      {filtered.length === 0 && (
        <div className="text-center py-16 text-zinc-500 dark:text-zinc-400">
          <p className="text-sm">No publications match your search.</p>
        </div>
      )}

      {featuredList.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 rounded-full bg-amber-500" />
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Featured Research
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Key contributions at a glance.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {featuredList.map((pub, index) => {
              const style = typeStyles[pub.type] || typeStyles["research-paper"];
              const pubStatus = pub.status || "published";
              return (
                <motion.div
                  key={`${pub.title}-featured`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className={`relative p-6 rounded-2xl bg-white/80 dark:bg-zinc-900/80 border border-amber-200/60 dark:border-amber-800/40 backdrop-blur-sm hover:shadow-lg transition-all duration-300 card-premium ${
                    pubStatus === "coming-soon" ? "opacity-70" : ""
                  }`}
                >
                  <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                    <Star className="h-3 w-3" /> Featured
                  </span>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${style.bg} shrink-0 hidden sm:block`}>
                      <BookOpen className={`h-5 w-5 ${style.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap pr-16">
                        <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                        <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                          {pub.title}
                        </h3>
                        <Badge
                          variant="secondary"
                          className={`text-[10px] ${style.bg} ${style.text}`}
                        >
                          {typeLabels[pub.type] || pub.type}
                        </Badge>
                        {pubStatus !== "published" && (
                          <Badge
                            variant="secondary"
                            className={`text-[10px] ${statusConfig[pubStatus].className}`}
                          >
                            {statusConfig[pubStatus].label}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                        {pub.authors.join(", ")} · {pub.year}
                      </p>
                      {pub.journal && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 italic mb-1">
                          {pub.journal}
                        </p>
                      )}
                      {pub.conference && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 italic mb-1">
                          Presented at {pub.conference}
                        </p>
                      )}
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3 leading-relaxed line-clamp-2">
                        {pub.description}
                      </p>
                      <div className="flex items-center gap-3">
                        {pub.doi && (
                          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                            DOI: {pub.doi}
                          </span>
                        )}
                        {pub.url ? (
                          <a
                            href={pub.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="ghost" size="sm">
                              View Publication
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </Button>
                          </a>
                        ) : (
                          pubStatus === "coming-soon" && (
                            <span className="text-xs text-zinc-500 dark:text-zinc-400 italic">
                              Publishing soon
                            </span>
                          )
                        )}
                        {pub.pdfUrl && (
                          <a
                            href={pub.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                          >
                            <FileText className="h-3.5 w-3.5" /> PDF
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {rest.length > 0 && (
        <div className="space-y-5">
          {rest.map((pub, index) => {
            const style = typeStyles[pub.type] || typeStyles["research-paper"];
            const pubStatus = pub.status || "published";

            return (
              <motion.div
                key={pub.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={`p-6 rounded-2xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/50 dark:border-zinc-700/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 card-premium ${
                  pubStatus === "coming-soon" ? "opacity-70" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${style.bg} shrink-0 hidden sm:block`}>
                    <BookOpen className={`h-5 w-5 ${style.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                      <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                        {pub.title}
                      </h3>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] ${style.bg} ${style.text}`}
                      >
                        {typeLabels[pub.type] || pub.type}
                      </Badge>
                      {pubStatus !== "published" && (
                        <Badge
                          variant="secondary"
                          className={`text-[10px] ${statusConfig[pubStatus].className}`}
                        >
                          {statusConfig[pubStatus].label}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                      {pub.authors.join(", ")} · {pub.year}
                    </p>
                    {pub.journal && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 italic mb-1 flex items-center gap-1">
                        {pub.journal}
                      </p>
                    )}
                    {pub.conference && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 italic mb-1">
                        Presented at {pub.conference}
                      </p>
                    )}
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3 leading-relaxed line-clamp-2">
                      {pub.description}
                    </p>
                    <div className="flex items-center gap-3">
                      {pub.doi && (
                        <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                          DOI: {pub.doi}
                        </span>
                      )}
                      {pub.url ? (
                        <a
                          href={pub.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="ghost" size="sm">
                            View Publication
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </Button>
                        </a>
                      ) : (
                        pubStatus === "coming-soon" && (
                          <span className="text-xs text-zinc-500 dark:text-zinc-400 italic">
                            Publishing soon
                          </span>
                        )
                      )}
                      {pub.pdfUrl && (
                        <a
                          href={pub.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                        >
                          <FileText className="h-3.5 w-3.5" /> PDF
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </Section>
  );
}