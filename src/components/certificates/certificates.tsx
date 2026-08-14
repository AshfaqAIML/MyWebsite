"use client";

import * as React from "react";
import { AnimatePresence } from "framer-motion";
import { getCertificates, getCertificateCategories } from "@/lib/data";
import { SectionHeader } from "./section-header";
import { CertificateCard } from "./certificate-card";
import { FilterBar } from "@/components/ui/filter-bar";
import { CertificateDetailModal } from "./certificate-detail-modal";
import type { Certificate } from "@/lib/types";

export function Certificates() {
  const certificates = React.useMemo(() => getCertificates(), []);
  const categories = React.useMemo(() => getCertificateCategories(), []);

  const [activeCategory, setActiveCategory] = React.useState("All");
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<Certificate | null>(null);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return certificates.filter((c) => {
      const matchesCategory =
        activeCategory === "All" || c.categories.includes(activeCategory);
      if (!matchesCategory) return false;
      if (!q) return true;
      const haystack = [
        c.title,
        c.issuer,
        c.description || "",
        ...c.categories,
        ...(c.skills || []),
        ...(c.tags || []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [certificates, activeCategory, search]);

  return (
    <section id="certificates" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Credentials"
          title="Certificates & Achievements"
          description="Verified certifications and courses spanning AI, machine learning, data engineering, and software development."
        />

        <FilterBar
          id="certificates"
          search={search}
          onSearch={setSearch}
          searchPlaceholder="Search certificates, skills, issuers…"
          options={categories}
          activeOption={activeCategory}
          onOptionChange={setActiveCategory}
          resultCount={filtered.length}
          totalCount={certificates.length}
        />

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((certificate, index) => (
              <CertificateCard
                key={certificate.id}
                certificate={certificate}
                onOpen={setSelected}
                index={index}
              />
            ))}
          </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-20 text-zinc-400 dark:text-zinc-500">
            <p className="text-sm">No certificates match your filters.</p>
          </div>
        )}
      </div>

      <CertificateDetailModal
        certificate={selected}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}