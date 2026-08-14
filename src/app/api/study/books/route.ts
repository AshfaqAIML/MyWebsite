import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/study-db";
import fs from "fs";
import path from "path";
import { getErrorMessage } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId") || "default";
  const category = req.nextUrl.searchParams.get("category");
  const search = req.nextUrl.searchParams.get("search");

  const where = {
    userId,
    ...(category && category !== "All" ? { category } : {}),
    ...(search ? { title: { contains: search } } : {}),
  };

  type BookRow = Awaited<ReturnType<typeof prisma.book.findMany>>[number];
  type ProgressRow = Awaited<ReturnType<typeof prisma.readingProgress.findMany>>[number];

  const books = await prisma.book.findMany({ where, orderBy: { updatedAt: "desc" } });
  const progress = await prisma.readingProgress.findMany({ where: { userId } });
  const progressMap = new Map<string, ProgressRow>(progress.map((p) => [p.bookId, p]));

  const enriched = books.map((b: BookRow) => {
    const p = progressMap.get(b.id);
    return {
      ...b,
      tags: JSON.parse(b.tags || "[]"),
      metadata: JSON.parse(b.metadata || "{}"),
      readingProgress: p
        ? {
            currentPage: p.currentPage,
            totalPages: p.totalPages,
            percentage: p.percentage,
            completed: p.completed,
          }
        : null,
    };
  });

  return NextResponse.json(enriched);
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId") || "default";
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string) || file?.name || "Untitled";
    const author = (formData.get("author") as string) || "";
    const category = (formData.get("category") as string) || "";
    const description = (formData.get("description") as string) || "";
    const tags = formData.get("tags") ? JSON.parse(formData.get("tags") as string) : [];

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const fileName = file.name.replace(/[^a-zA-Z0-9._ -]/g, "");
    const privateDir = path.join(process.cwd(), "private", "books");
    if (!fs.existsSync(privateDir)) fs.mkdirSync(privateDir, { recursive: true });
    const filePath = path.join(privateDir, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    const book = await prisma.book.create({
      data: {
        title,
        author,
        category,
        description,
        fileName,
        fileSize: buffer.length,
        tags: JSON.stringify(tags),
        userId,
      },
    });

    return NextResponse.json(book, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const bookId = req.nextUrl.searchParams.get("id");
  if (!bookId) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const filePath = path.join(process.cwd(), "private", "books", book.fileName);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  await prisma.book.delete({ where: { id: bookId } });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, author, category, description, tags } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const book = await prisma.book.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(author !== undefined && { author }),
        ...(category !== undefined && { category }),
        ...(description !== undefined && { description }),
        ...(tags !== undefined && { tags: JSON.stringify(tags) }),
      },
    });

    return NextResponse.json(book);
  } catch (err: unknown) {
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
