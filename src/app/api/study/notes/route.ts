import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/study-db";
import { getErrorMessage } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const bookId = req.nextUrl.searchParams.get("bookId");
  const userId = req.nextUrl.searchParams.get("userId") || "default";
  const where = { userId, ...(bookId ? { bookId } : {}) };
  type NoteRow = Awaited<ReturnType<typeof prisma.note.findMany>>[number];
  const notes = await prisma.note.findMany({ where, orderBy: { updatedAt: "desc" } });
  const mapped = notes.map((n: NoteRow) => ({ ...n, tags: JSON.parse(n.tags || "[]") }));
  return NextResponse.json(mapped);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookId, title, content, page, color, tags, pinned, highlightId, userId = "default" } = body;
    const note = await prisma.note.create({
      data: { title, content, page, color, pinned: pinned || false, userId, bookId, highlightId, tags: JSON.stringify(tags || []) },
    });
    return NextResponse.json(note, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, content, color, tags, pinned } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const note = await prisma.note.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(color !== undefined && { color }),
        ...(pinned !== undefined && { pinned }),
        ...(tags !== undefined && { tags: JSON.stringify(tags) }),
      },
    });
    return NextResponse.json(note);
  } catch (err: unknown) {
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.note.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
