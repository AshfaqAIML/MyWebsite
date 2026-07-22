import { NextRequest, NextResponse } from "next/server";

const FLASK_API_URL = process.env.TRANSCRIPT_API_URL || "http://127.0.0.1:5000";

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

    const response = await fetch(`${FLASK_API_URL}/get-transcript`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ video_id }),
      signal: AbortSignal.timeout(30000),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    if (error?.name === "TimeoutError" || error?.code === "ABORT_ERR") {
      return NextResponse.json(
        {
          success: false,
          error: "Flask backend timed out. Make sure the Python server is running.",
        },
        { status: 504 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: `Could not reach transcript backend at ${FLASK_API_URL}. Make sure the Python Flask server is running.`,
      },
      { status: 502 }
    );
  }
}
