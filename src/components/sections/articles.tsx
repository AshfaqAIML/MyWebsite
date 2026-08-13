"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Clock, ArrowRight, FileText, ExternalLink, Star } from "lucide-react";
import { Section, SectionGrid } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FilterBar } from "@/components/ui/filter-bar";
import { getArticles } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import type { ArticleStatus } from "@/lib/types";

const statusConfig: Record<ArticleStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive" | "glass"; className: string }> = {
  published: {
    label: "Published",
    variant: "secondary",
    className: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  },
  "in-progress": {
    label: "In Progress",
    variant: "secondary",
    className: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  },
  "coming-soon": {
    label: "Coming Soon",
    variant: "secondary",
    className: "bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800",
  },
};

export function Articles() {
  const articles = getArticles();
  const categories = React.useMemo(
    () => [...new Set(articles.map((a) => a.category))].sort(),
    [articles]
  );
  const featured = articles.filter((a) => a.featured);
  const nonFeatured = articles.filter((a) => !a.featured);

  const [category, setCategory] = React.useState("All");
  const [search, setSearch] = React.useState("");

  const filterArticles = (list: typeof articles) =>
    list.filter((article) => {
      const matchesCategory = category === "All" || article.category === category;
      if (!matchesCategory) return false;
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return `${article.title} ${article.description} ${article.tags.join(" ")} ${article.category}`
        .toLowerCase()
        .includes(q);
    });

  const featuredFiltered = filterArticles(featured);
  const gridFiltered = filterArticles(nonFeatured);
  const hasAny = featuredFiltered.length > 0 || gridFiltered.length > 0;

  const renderCard = (article: (typeof articles)[number], index: number) => (
    <motion.div
      key={article.slug}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.05 }}
    >
      <Card
        className={`h-full flex flex-col group card-premium ${
          article.featured
            ? "hover:border-amber-200 dark:hover:border-amber-700"
            : "hover:border-blue-200 dark:hover:border-blue-700"
        }`}
      >
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-3">
            <Badge variant="secondary">{article.category}</Badge>
            <div className="flex items-center gap-2">
              {article.featured && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  <Star className="h-3 w-3" /> Featured
                </span>
              )}
              {article.status && article.status !== "published" && (
                <Badge
                  variant={statusConfig[article.status].variant}
                  className={statusConfig[article.status].className}
                >
                  {statusConfig[article.status].label}
                </Badge>
              )}
              {article.readingTime ? (
                <div className="flex items-center gap-1 text-xs text-zinc-400">
                  <Clock className="h-3 w-3" />
                  {article.readingTime} min read
                </div>
              ) : null}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white mb-3">
            <FileText className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-base text-zinc-900 dark:text-zinc-100 mb-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {article.title}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 flex-1 mb-3 leading-relaxed line-clamp-2">
            {article.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {article.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px]">
                #{tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-zinc-100 dark:border-zinc-800">
            {article.status === "coming-soon" ? (
              <span className="text-xs text-zinc-400">Coming soon</span>
            ) : article.publishedAt ? (
              <span className="text-xs text-zinc-400">
                {formatDate(article.publishedAt)}
              </span>
            ) : (
              <span className="text-xs text-zinc-400" />
            )}
            {article.status !== "coming-soon" && article.status !== "in-progress" ? (
              <a
                href={article.externalUrl || `/articles/${article.slug}`}
                target={article.externalUrl ? "_blank" : undefined}
                rel={article.externalUrl ? "noopener noreferrer" : undefined}
              >
                <Button variant="ghost" size="sm">
                  Read Article
                  {article.externalUrl ? (
                    <ExternalLink className="ml-1 h-3 w-3" />
                  ) : (
                    <ArrowRight className="ml-1 h-3 w-3" />
                  )}
                </Button>
              </a>
            ) : (
              <span />
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Section
      id="articles"
      title={
        <span>
          Latest <span className="gradient-text">Articles</span>
        </span>
      }
      subtitle="Thoughts, tutorials, and deep dives on technology and data."
      className="bg-zinc-50/50 dark:bg-zinc-900/50"
    >
      <FilterBar
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search articles, tags, topics…"
        options={categories}
        activeOption={category}
        onOptionChange={setCategory}
        resultCount={featuredFiltered.length + gridFiltered.length}
        totalCount={articles.length}
      />

      {!hasAny && (
        <div className="text-center py-16 text-zinc-400 dark:text-zinc-500">
          <p className="text-sm">No articles match your search.</p>
        </div>
      )}

      {featuredFiltered.length > 0 && (
        <>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 rounded-full bg-amber-500" />
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Featured Articles
              </h3>
              <p className="text-xs text-zinc-500">
                Handpicked deep dives worth your time.
              </p>
            </div>
          </div>
          <SectionGrid>
            {featuredFiltered.map((article, i) => renderCard(article, i))}
          </SectionGrid>
        </>
      )}

      {gridFiltered.length > 0 && (
        <>
          <div className="flex items-center gap-3 mb-6 mt-12">
            <div className="h-8 w-1 rounded-full bg-blue-500" />
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                All Articles
              </h3>
              <p className="text-xs text-zinc-500">
                The complete library of writing.
              </p>
            </div>
          </div>
          <SectionGrid>
            {gridFiltered.map((article, i) => renderCard(article, i))}
          </SectionGrid>
        </>
      )}
    </Section>
  );
}