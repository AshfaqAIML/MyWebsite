import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  const fileParam = req.nextUrl.searchParams.get("file");
  const mode = req.nextUrl.searchParams.get("mode") || "read";

  if (!fileParam) {
    return NextResponse.json({ error: "Missing file parameter" }, { status: 400 });
  }

  const fileName = path.basename(fileParam);

  // For read mode, redirect to Vercel's static CDN to avoid the 4.5 MB serverless response limit
  if (mode === "read") {
    return NextResponse.redirect(new URL(`/study/books/${encodeURIComponent(fileName)}`, req.url), 302);
  }

  // For download mode, serve directly (small files only; large downloads fail on Vercel Hobby)
  const filePath = path.join(process.cwd(), "private", "books", fileName);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();

  const contentTypes: Record<string, string> = {
    ".pdf": "application/pdf",
    ".epub": "application/epub+zip",
  };
  const contentType = contentTypes[ext] || "application/octet-stream";

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
