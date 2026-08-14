import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "YouTube Dev Toolkit",
  description:
    "Extract YouTube video metadata, transcripts and timestamps into clean, formatted summaries and copy-ready content. A free dev tool by Ishfaq Dar.",
  keywords: [
    "youtube transcript extractor",
    "youtube metadata",
    "video seo tool",
    "content creator tool",
    "Ishfaq Dar",
  ],
  openGraph: {
    title: "YouTube Dev Toolkit",
    description:
      "Extract YouTube video metadata, transcripts and timestamps into clean, formatted summaries and copy-ready content.",
    type: "website",
  },
};

export default function YouTubeDevLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}