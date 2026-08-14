"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { FilterBar } from "@/components/ui/filter-bar";
import { getCareerPlatforms, getCareerRegions } from "@/lib/data";

export function CareerPlatforms() {
  const regions = getCareerRegions();
  const allPlatforms = getCareerPlatforms();

  const [region, setRegion] = React.useState("All");
  const [search, setSearch] = React.useState("");

  const filtered = allPlatforms.filter((p) => {
    const matchesRegion = region === "All" || p.region === region;
    if (!matchesRegion) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return `${p.name} ${p.description} ${p.region}`.toLowerCase().includes(q);
  });

  const grouped = regions
    .map((r) => ({
      region: r,
      platforms: filtered.filter((p) => p.region === r),
    }))
    .filter((g) => g.platforms.length > 0);

  return (
    <Section
      id="career-platforms"
      title="Career Platforms I Follow"
      subtitle="Job and career platforms across different regions — for reference and discovery."
      className="bg-zinc-50/50 dark:bg-zinc-900/50"
    >
      <FilterBar
        id="career"
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search career platforms…"
        options={regions}
        activeOption={region}
        onOptionChange={setRegion}
        resultCount={filtered.length}
        totalCount={allPlatforms.length}
      />

      {grouped.length === 0 && (
        <div className="text-center py-16 text-zinc-500 dark:text-zinc-400">
          <p className="text-sm">No platforms match your search.</p>
        </div>
      )}

      {grouped.map(({ region: regionName, platforms }) => (
        <div key={regionName} className="mb-6 last:mb-0">
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2"
          >
            <span className="w-1 h-4 rounded-full bg-gradient-to-b from-blue-500 to-purple-500" />
            {regionName}
            <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
              ({platforms.length})
            </span>
          </motion.h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {platforms.map((platform, index) => (
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
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 rounded-2xl bg-white/60 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-700/50 backdrop-blur-sm hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300 card-premium group flex flex-col items-center text-center gap-2"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  {platform.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-xs text-zinc-700 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {platform.name}
                  </p>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-2">
                    {platform.description}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      ))}
    </Section>
  );
}