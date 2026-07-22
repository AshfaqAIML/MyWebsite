import { NextRequest, NextResponse } from "next/server";
import {
  YoutubeTranscript,
  YoutubeTranscriptError,
  YoutubeTranscriptDisabledError,
  YoutubeTranscriptVideoUnavailableError,
  YoutubeTranscriptNotAvailableError,
  YoutubeTranscriptNotAvailableLanguageError,
  YoutubeTranscriptTooManyRequestError,
} from "youtube-transcript";

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

    const transcript = await YoutubeTranscript.fetchTranscript(resolvedId);

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
    if (error instanceof YoutubeTranscriptDisabledError) {
      return NextResponse.json(
        { success: false, error: "Transcripts are disabled for this video." },
        { status: 403 }
      );
    }
    if (error instanceof YoutubeTranscriptVideoUnavailableError) {
      return NextResponse.json(
        { success: false, error: "This video is unavailable." },
        { status: 404 }
      );
    }
    if (error instanceof YoutubeTranscriptNotAvailableError) {
      return NextResponse.json(
        { success: false, error: "No captions available for this video." },
        { status: 404 }
      );
    }
    if (error instanceof YoutubeTranscriptNotAvailableLanguageError) {
      return NextResponse.json(
        { success: false, error: "Captions are not available in the requested language." },
        { status: 404 }
      );
    }
    if (error instanceof YoutubeTranscriptTooManyRequestError) {
      return NextResponse.json(
        { success: false, error: "Rate limited by YouTube. Please try again in a moment." },
        { status: 429 }
      );
    }
    if (error instanceof YoutubeTranscriptError) {
      return NextResponse.json(
        { success: false, error: error.message || "Failed to fetch transcript." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: error?.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
