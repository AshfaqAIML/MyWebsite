import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/study-db";

export async function GET(req: NextRequest) {
  const bookId = req.nextUrl.searchParams.get("bookId");
  const userId = req.nextUrl.searchParams.get("userId") || "default";
  const where: any = { userId };
  if (bookId) where.bookId = bookId;
  const bookmarks = await prisma.bookmark.findMany({ where, orderBy: { page: "asc" } });
  return NextResponse.json(bookmarks);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookId, page, label, color, userId = "default" } = body;
    if (!bookId || page === undefined) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    const bookmark = await prisma.bookmark.create({ data: { page, label, color, userId, bookId } });
    return NextResponse.json(bookmark, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, label, color } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const bookmark = await prisma.bookmark.update({
      where: { id },
      data: { ...(label !== undefined && { label }), ...(color !== undefined && { color }) },
    });
    return NextResponse.json(bookmark);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.bookmark.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
