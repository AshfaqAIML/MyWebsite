"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Section } from "@/components/ui/section";
import { FilterBar } from "@/components/ui/filter-bar";
import { getFreelancingPlatforms } from "@/lib/data";
import type { FreelancingCategory } from "@/lib/types";

const categoryLabels: Record<FreelancingCategory, string> = {
  marketplace: "Marketplaces",
  network: "Elite Networks",
  platform: "Direct Platforms",
  remote: "Remote Jobs",
};

const categoryColors: Record<FreelancingCategory, string> = {
  marketplace: "from-indigo-400 to-purple-600",
  network: "from-amber-400 to-orange-600",
  platform: "from-emerald-400 to-teal-600",
  remote: "from-sky-400 to-blue-600",
};

export function Platforms() {
  const platforms = getFreelancingPlatforms();
  const categories = React.useMemo(
    () => [...new Set(platforms.map((p) => p.category).filter(Boolean))] as FreelancingCategory[],
    [platforms]
  );
  const featured = platforms.filter((p) => p.featured);

  const [category, setCategory] = React.useState("All");
  const [search, setSearch] = React.useState("");

  const filtered = platforms.filter((p) => {
    const matchesCategory = category === "All" || p.category === category;
    if (!matchesCategory) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return `${p.name} ${p.description}`.toLowerCase().includes(q);
  });

  return (
    <Section
      id="platforms"
      title="Platforms I Use"
      subtitle="Professional services and freelancing platforms where I&apos;m active."
      className="bg-zinc-50/50 dark:bg-zinc-900/50"
    >
      <FilterBar
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search freelancing platforms…"
        options={categories.map((c) => categoryLabels[c])}
        activeOption={category === "All" ? "All" : categoryLabels[category as FreelancingCategory]}
        onOptionChange={(opt) =>
          setCategory(opt === "All" ? "All" : opt)
        }
        resultCount={filtered.length}
        totalCount={platforms.length}
      />

      {featured.length > 0 && category === "All" && !search && (
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 rounded-full bg-amber-500" />
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Featured Platforms
              </h3>
              <p className="text-xs text-zinc-500">
                Where I&apos;m most active.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {featured.map((platform, index) => (
              <motion.a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${platform.name}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.03 }}
                className="relative p-4 rounded-2xl bg-white/60 dark:bg-zinc-900/60 border border-amber-200/60 dark:border-amber-800/40 backdrop-blur-sm hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-300 card-premium group flex flex-col items-center text-center gap-2"
              >
                <span className="absolute top-2.5 right-2.5 text-amber-500">
                  <Star className="h-3.5 w-3.5" fill="currentColor" />
                </span>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${categoryColors[platform.category || "marketplace"]} flex items-center justify-center text-white font-bold text-sm`}>
                  {platform.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-xs text-zinc-700 dark:text-zinc-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {platform.name}
                  </p>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5 line-clamp-2">
                    {platform.description}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16 text-zinc-400 dark:text-zinc-500">
          <p className="text-sm">No platforms match your search.</p>
        </div>
      )}

      {category !== "All" &&
        categories
          .filter((c) => categoryLabels[c] === category)
          .map((cat) => {
            const catPlatforms = filtered.filter((p) => p.category === cat);
            return (
              <div key={cat} className="mb-8 last:mb-0">
                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2"
                >
                  <span className={`w-1 h-4 rounded-full bg-gradient-to-b ${categoryColors[cat]}`} />
                  {categoryLabels[cat]}
                  <span className="text-xs font-normal text-zinc-400 dark:text-zinc-500">
                    ({catPlatforms.length})
                  </span>
                </motion.h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {catPlatforms.map((platform, index) => (
                    <motion.a
                      key={platform.name}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit ${platform.name}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.4, delay: index * 0.03 }}
                      className="p-4 rounded-2xl bg-white/60 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-700/50 backdrop-blur-sm hover:border-indigo-200 dark:hover:border-indigo-700 transition-all duration-300 card-premium group flex flex-col items-center text-center gap-2"
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${categoryColors[platform.category || "marketplace"]} flex items-center justify-center text-white font-bold text-sm`}>
                        {platform.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-xs text-zinc-700 dark:text-zinc-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {platform.name}
                        </p>
                        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5 line-clamp-2">
                          {platform.description}
                        </p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            );
          })}

      {category === "All" && search && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filtered.map((platform, index) => (
            <motion.a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${platform.name}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.03 }}
              className="p-4 rounded-2xl bg-white/60 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-700/50 backdrop-blur-sm hover:border-indigo-200 dark:hover:border-indigo-700 transition-all duration-300 card-premium group flex flex-col items-center text-center gap-2"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${categoryColors[platform.category || "marketplace"]} flex items-center justify-center text-white font-bold text-sm`}>
                {platform.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-xs text-zinc-700 dark:text-zinc-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {platform.name}
                </p>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5 line-clamp-2">
                  {platform.description}
                </p>
              </div>
            </motion.a>
          ))}
        </div>
      )}

      {category !== "All" && filtered.length === 0 && (
        <div className="text-center py-16 text-zinc-400 dark:text-zinc-500">
          <p className="text-sm">No platforms match your search.</p>
        </div>
      )}
    </Section>
  );
}