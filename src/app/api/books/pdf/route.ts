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

  // Serve large PDFs via static CDN to avoid Vercel's 4.5 MB serverless response limit
  const staticPath = path.join(process.cwd(), "public", "study", "books", fileName);
  if (fs.existsSync(staticPath)) {
    const staticUrl = `/study/books/${encodeURIComponent(fileName)}`;
    if (mode === "download") {
      return NextResponse.redirect(new URL(staticUrl, req.url), 302);
    }
    return NextResponse.redirect(new URL(staticUrl, req.url), 302);
  }

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

  if (mode === "download") {
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex",
      },
    });
  }

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": "inline",
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
