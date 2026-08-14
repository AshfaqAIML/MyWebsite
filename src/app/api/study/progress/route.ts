import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/study-db";
import { getErrorMessage } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const bookId = req.nextUrl.searchParams.get("bookId");
  const userId = req.nextUrl.searchParams.get("userId") || "default";
  if (!bookId) return NextResponse.json({ error: "Missing bookId" }, { status: 400 });
  const progress = await prisma.readingProgress.findUnique({ where: { bookId_userId: { bookId, userId } } });
  return NextResponse.json(progress);
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookId, currentPage, totalPages, userId = "default" } = body;
    if (!bookId || currentPage === undefined) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    const percentage = totalPages ? Math.round((currentPage / totalPages) * 100) : 0;
    const completed = totalPages ? currentPage >= totalPages : false;
    const progress = await prisma.readingProgress.upsert({
      where: { bookId_userId: { bookId, userId } },
      create: { bookId, userId, currentPage, totalPages, percentage, completed, lastPage: currentPage },
      update: { currentPage, totalPages, percentage, completed, lastPage: currentPage },
    });
    return NextResponse.json(progress);
  } catch (err: unknown) {
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
