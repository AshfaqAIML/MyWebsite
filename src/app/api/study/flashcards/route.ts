import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/study-db";
import { getErrorMessage } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const bookId = req.nextUrl.searchParams.get("bookId");
  const userId = req.nextUrl.searchParams.get("userId") || "default";
  const dueOnly = req.nextUrl.searchParams.get("dueOnly") === "true";
  const where = {
    userId,
    ...(bookId ? { bookId } : {}),
    ...(dueOnly ? { nextReview: { lte: new Date() } } : {}),
  };
  type CardRow = Awaited<ReturnType<typeof prisma.flashcard.findMany>>[number];
  const cards = await prisma.flashcard.findMany({ where, orderBy: { nextReview: "asc" } });
  const mapped = cards.map((c: CardRow) => ({ ...c, tags: JSON.parse(c.tags || "[]") }));
  return NextResponse.json(mapped);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookId, front, back, hint, tags, highlightId, userId = "default" } = body;
    if (!front || !back) return NextResponse.json({ error: "Missing front or back" }, { status: 400 });
    const card = await prisma.flashcard.create({
      data: { front, back, hint, userId, bookId, highlightId, tags: JSON.stringify(tags || []) },
    });
    return NextResponse.json(card, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, front, back, hint, tags, difficulty, easeFactor, interval, repetitions, nextReview } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const card = await prisma.flashcard.update({
      where: { id },
      data: {
        ...(front !== undefined && { front }),
        ...(back !== undefined && { back }),
        ...(hint !== undefined && { hint }),
        ...(tags !== undefined && { tags: JSON.stringify(tags) }),
        ...(difficulty !== undefined && { difficulty }),
        ...(easeFactor !== undefined && { easeFactor }),
        ...(interval !== undefined && { interval }),
        ...(repetitions !== undefined && { repetitions }),
        ...(nextReview !== undefined && { nextReview: new Date(nextReview) }),
      },
    });
    return NextResponse.json(card);
  } catch (err: unknown) {
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.flashcard.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
