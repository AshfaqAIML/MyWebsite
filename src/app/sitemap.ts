import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/data";
import type { StudyBook } from "@/lib/study/types";
import studyBooksData from "../../data/study-books.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const config = getSiteConfig();
  const base = config.url.replace(/\/$/, "");

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "monthly", priority: 1.0 },
    { url: `${base}/study-corner`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/study`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/study/library`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/study/flashcards`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/study/analytics`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/study/settings`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/books/read`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/picnic`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/youtube-dev`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const studyBookRoutes: MetadataRoute.Sitemap = (
    studyBooksData as StudyBook[]
  ).flatMap((book) => [
    { url: `${base}/study/reader/${book.id}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${base}/study-corner/read/${book.id}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 },
  ]);

  return [...staticRoutes, ...studyBookRoutes];
}
