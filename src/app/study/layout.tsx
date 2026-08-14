import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Study Hub",
  description:
    "Interactive study tools: the guided library, reading progress, flashcards, and analytics — part of Ishfaq Dar's personal digital ecosystem.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Study Hub",
    description:
      "Guided study library, progress analytics and flashcards — by Ishfaq Dar.",
    type: "website",
  },
};

export default function StudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}