import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Study Corner",
  description:
    "A personal study corner with guided reading paths across backend engineering, data, Python and English mastery. Progress tracking, flashcards and reading analytics.",
  keywords: [
    "study corner",
    "backend development",
    "python",
    "data analyst",
    "reading tracker",
    "flashcards",
    "Ishfaq Dar",
  ],
  openGraph: {
    title: "Study Corner",
    description:
      "Guided reading paths with progress tracking, flashcards and analytics — by Ishfaq Dar.",
    type: "website",
  },
};

export default function StudyCornerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}