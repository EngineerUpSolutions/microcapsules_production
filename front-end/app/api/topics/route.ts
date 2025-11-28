// app/api/topics/route.ts
import { NextRequest, NextResponse } from "next/server";

// This runs only on the server (inside the frontend container).
// For now it just returns a dummy response so we can test the wiring.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  console.log("[frontend] /api/topics called with body:", body);

  return NextResponse.json(
    {
      ok: true,
      message: "Dummy topics response from frontend API route",
      received: body,
    },
    { status: 200 }
  );
}
