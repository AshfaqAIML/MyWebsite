"use client";

import { motion } from "framer-motion";
import {
  Code,
  Palette,
  Server,
  Globe,
  Layers,
  BarChart3,
  Sparkles,
  Check,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Section, SectionGrid } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getServices, getProfile } from "@/lib/data";

const iconMap: Record<string, { icon: React.ReactNode; gradient: string }> = {
  "Web Development": { icon: <Code className="h-5 w-5" />, gradient: "from-blue-400 to-purple-500" },
  "Backend Development": { icon: <Server className="h-5 w-5" />, gradient: "from-green-400 to-teal-500" },
  "UI/UX Design": { icon: <Palette className="h-5 w-5" />, gradient: "from-purple-400 to-pink-500" },
  "Portfolio Websites": { icon: <Globe className="h-5 w-5" />, gradient: "from-orange-400 to-rose-500" },
  "Data Analytics & Dashboards": { icon: <BarChart3 className="h-5 w-5" />, gradient: "from-cyan-400 to-blue-500" },
  "AI & ML Solutions": { icon: <Sparkles className="h-5 w-5" />, gradient: "from-violet-400 to-fuchsia-500" },
};

export function Expertise() {
  const services = getServices();
  const profile = getProfile();

  return (
    <Section
      id="expertise"
      title={
        <span>
          Services & <span className="gradient-text">Expertise</span>
        </span>
      }
      subtitle="Premium solutions built with modern technology — clear deliverables, transparent pricing, and results you can measure."
    >
      <SectionGrid>
        {services.map((service, index) => {
          const meta =
            iconMap[service.title] || {
              icon: <Layers className="h-5 w-5" />,
              gradient: "from-zinc-400 to-zinc-500",
            };
          const subject = encodeURIComponent(`Project inquiry: ${service.title}`);
          const hireUrl = `mailto:${profile.email}?subject=${subject}`;

          return (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="h-full"
            >
              <Card
                className={
                  service.featured
                    ? "h-full flex flex-col group hover:border-blue-200 dark:hover:border-blue-700 card-premium relative overflow-hidden"
                    : "h-full flex flex-col group hover:border-blue-200 dark:hover:border-blue-700 card-premium"
                }
              >
                <CardContent className="p-6 flex flex-col h-full">
                  {service.featured && (
                    <span className="absolute top-4 right-4 text-[10px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      Featured
                    </span>
                  )}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-white shadow-lg`}
                    >
                      {meta.icon}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                        ${service.startingPrice}
                        <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                          {" "}
                          / start
                        </span>
                      </div>
                      {service.timeline && (
                        <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                          <Clock className="h-3 w-3" />
                          {service.timeline}
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
                    {service.description}
                  </p>

                  <div className="space-y-1.5 mb-4 flex-1">
                    {service.deliverables.map((item) => (
                      <div key={item} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                        <span className="text-sm text-zinc-600 dark:text-zinc-300">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {service.skills.slice(0, 6).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <Button asChild size="sm">
                      <a href={hireUrl}>
                        Start a project <ArrowRight className="h-4 w-4 ml-1" />
                      </a>
                    </Button>
                    {service.pricingModel && (
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">
                        {service.pricingModel}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </SectionGrid>
    </Section>
  );
}
