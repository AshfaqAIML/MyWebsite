import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/study-db";
import { getErrorMessage } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId") || "default";
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get("limit") || "50"), 200);
  const sessions = await prisma.studySession.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: limit,
    include: { book: { select: { id: true, title: true } } },
  });
  return NextResponse.json(sessions);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { duration, pagesRead, notesAdded, bookId, userId = "default" } = body;
    const session = await prisma.studySession.create({
      data: { duration: duration || 0, pagesRead: pagesRead || 0, notesAdded: notesAdded || 0, bookId, userId },
    });
    return NextResponse.json(session, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
