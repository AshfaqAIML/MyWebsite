import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/study-db";

export async function GET(req: NextRequest) {
  const bookId = req.nextUrl.searchParams.get("bookId");
  const userId = req.nextUrl.searchParams.get("userId") || "default";
  const page = req.nextUrl.searchParams.get("page");

  const where: any = { userId };
  if (bookId) where.bookId = bookId;
  if (page) where.page = parseInt(page);

  const highlights = await prisma.highlight.findMany({ where, orderBy: { page: "asc" } });
  const mapped = highlights.map((h: any) => ({ ...h, tags: JSON.parse(h.tags || "[]") }));
  return NextResponse.json(mapped);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookId, page, color, type, text, x, y, w, h, note, tags, userId = "default" } = body;
    if (!bookId || page === undefined || !text) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const highlight = await prisma.highlight.create({
      data: { color, type, text, page, x, y, w, h, note, userId, bookId, tags: JSON.stringify(tags || []) },
    });
    return NextResponse.json(highlight, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, color, note, tags } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const highlight = await prisma.highlight.update({
      where: { id },
      data: {
        ...(color !== undefined && { color }),
        ...(note !== undefined && { note }),
        ...(tags !== undefined && { tags: JSON.stringify(tags) }),
      },
    });
    return NextResponse.json(highlight);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.highlight.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
