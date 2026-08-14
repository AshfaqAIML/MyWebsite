"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Section, SectionGrid } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDigitalResources } from "@/lib/data";

export function DigitalWorld() {
  const resources = getDigitalResources();

  return (
    <Section
      id="digital-world"
      title="Digital World"
      subtitle="My presence across platforms and services."
      className="bg-zinc-50/50 dark:bg-zinc-900/50"
    >
      <SectionGrid>
        {resources.map((resource, index) => (
          <motion.div
            key={resource.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.03 }}
          >
            <Card className="group hover:border-blue-200 dark:hover:border-blue-700">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                    {resource.title}
                  </p>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider">
                    {resource.platform}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
                  {resource.description}
                </p>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm" className="w-full">
                    Open
                    <ExternalLink className="ml-1.5 h-3 w-3" />
                  </Button>
                </a>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </SectionGrid>
    </Section>
  );
}
