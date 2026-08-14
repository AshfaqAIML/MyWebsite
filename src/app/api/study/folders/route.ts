import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/study-db";
import { getErrorMessage } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId") || "default";
  const folders = await prisma.folder.findMany({ where: { userId }, include: { books: { include: { book: true } } } });
  return NextResponse.json(folders);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, parentId, userId = "default" } = body;
    const folder = await prisma.folder.create({ data: { name, parentId, userId } });
    return NextResponse.json(folder, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.folder.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
