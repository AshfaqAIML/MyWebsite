import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Reader",
  robots: {
    index: false,
    follow: false,
  },
};

export default function BooksReadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}