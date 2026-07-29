import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/study-db";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  const userId = req.nextUrl.searchParams.get("userId") || "default";
  if (!q || q.length < 2) return NextResponse.json([]);

  const [highlights, notes, bookmarks, cards] = await Promise.all([
    prisma.highlight.findMany({
      where: { userId, text: { contains: q } },
      include: { book: { select: { id: true, title: true } } },
      take: 20,
    }),
    prisma.note.findMany({
      where: { userId, content: { contains: q } },
      include: { book: { select: { id: true, title: true } } },
      take: 20,
    }),
    prisma.bookmark.findMany({
      where: { userId, label: { contains: q } },
      include: { book: { select: { id: true, title: true } } },
      take: 10,
    }),
    prisma.flashcard.findMany({
      where: { userId, OR: [{ front: { contains: q } }, { back: { contains: q } }] },
      include: { book: { select: { id: true, title: true } } },
      take: 10,
    }),
  ]);

  const results = [
    ...highlights.map((h: any) => ({ type: "highlight" as const, id: h.id, text: h.text.slice(0, 200), page: h.page, bookId: h.bookId, bookName: h.book.title, createdAt: h.createdAt })),
    ...notes.map((n: any) => ({ type: "note" as const, id: n.id, text: n.content.slice(0, 200), page: n.page, bookId: n.bookId, bookName: n.book.title, createdAt: n.createdAt })),
    ...bookmarks.map((b: any) => ({ type: "bookmark" as const, id: b.id, text: b.label || `Page ${b.page}`, page: b.page, bookId: b.bookId, bookName: b.book.title, createdAt: b.createdAt })),
    ...cards.map((c: any) => ({ type: "flashcard" as const, id: c.id, text: c.front.slice(0, 200), page: null, bookId: c.bookId || "", bookName: c.book?.title || "", createdAt: c.createdAt })),
  ];

  return NextResponse.json(results);
}
