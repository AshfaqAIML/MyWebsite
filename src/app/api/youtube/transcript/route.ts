import { NextRequest, NextResponse } from "next/server";

function extractVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /watch\?v=([a-zA-Z0-9_-]{11})/,
    /shorts\/([a-zA-Z0-9_-]{11})/,
    /embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { video_id } = body;

    if (!video_id) {
      return NextResponse.json(
        { success: false, error: "No video_id provided" },
        { status: 400 }
      );
    }

    const resolvedId = extractVideoId(video_id) || video_id;

    const { fetchTranscript } = await import("youtube-transcript");

    const transcript = await fetchTranscript(resolvedId);

    if (!transcript || transcript.length === 0) {
      return NextResponse.json(
        { success: false, error: "No transcript available for this video." },
        { status: 404 }
      );
    }

    const fullText = transcript.map((s) => s.text).join(" ");

    return NextResponse.json({
      success: true,
      message: fullText,
      video_id: resolvedId,
      total_segments: transcript.length,
      languages: [...new Set(transcript.map((s) => s.lang))],
    });
  } catch (error: any) {
    const msg = error?.message || String(error);

    if (msg.includes("disabled")) {
      return NextResponse.json(
        { success: false, error: "Transcripts are disabled for this video." },
        { status: 403 }
      );
    }
    if (msg.includes("unavailable") || msg.includes("not available")) {
      return NextResponse.json(
        { success: false, error: "Video is unavailable or has no captions." },
        { status: 404 }
      );
    }
    if (msg.includes("Too many")) {
      return NextResponse.json(
        { success: false, error: "Rate limited. Please try again in a moment." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { success: false, error: `Failed to fetch transcript: ${msg}` },
      { status: 500 }
    );
  }
}
