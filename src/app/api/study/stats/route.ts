import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/study-db";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId") || "default";

  const [totalBooks, totalHighlights, totalNotes, totalBookmarks, totalFlashcards, sessions, completedBooks] = await Promise.all([
    prisma.book.count({ where: { userId } }),
    prisma.highlight.count({ where: { userId } }),
    prisma.note.count({ where: { userId } }),
    prisma.bookmark.count({ where: { userId } }),
    prisma.flashcard.count({ where: { userId } }),
    prisma.studySession.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 100,
      include: { book: { select: { title: true } } },
    }),
    prisma.readingProgress.count({ where: { userId, completed: true } }),
  ]);

  const totalStudyMinutes = sessions.reduce((sum: number, s) => sum + s.duration, 0);

  const now = new Date();
  let streak = 0;
  const dates = new Set(sessions.map((s) => s.date.toISOString().slice(0, 10)));
  for (let i = 0; i < 365; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    if (dates.has(d.toISOString().slice(0, 10))) streak++;
    else if (i > 0) break;
  }

  const recentActivity = sessions.slice(0, 10).map((s) => ({
    id: s.id,
    type: "read" as const,
    description: s.duration > 0 ? `Studied for ${Math.round(s.duration / 60)} min` : "Opened a book",
    bookName: s.book?.title || "Unknown",
    date: s.date,
  }));

  return NextResponse.json({
    totalBooks,
    booksCompleted: completedBooks,
    totalHighlights,
    totalNotes,
    totalBookmarks,
    totalFlashcards,
    totalStudySessions: sessions.length,
    totalStudyMinutes,
    currentStreak: streak,
    recentActivity,
  });
}
