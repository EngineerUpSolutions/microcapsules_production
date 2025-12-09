// app/api/subscriptions/route.ts
import { NextRequest } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL || "http://backend:8080";

// GET /api/subscriptions?user_id=175878
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id");

  if (!userId) {
    return new Response(
      JSON.stringify({ error: "user_id es requerido" }),
      { status: 400 },
    );
  }

  const backendUrl = `${BACKEND_URL}/api/v1/distribution/subscriptions?user_id=${encodeURIComponent(
    userId,
  )}`;

  const resp = await fetch(backendUrl, {
    method: "GET",
  });

  const body = await resp.text();

  return new Response(body, {
    status: resp.status,
    headers: { "Content-Type": "application/json" },
  });
}

// POST /api/subscriptions
export async function POST(req: NextRequest) {
  const payload = await req.json();

  const backendUrl = `${BACKEND_URL}/api/v1/distribution/subscriptions`;

  const resp = await fetch(backendUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = await resp.text();

  return new Response(body, {
    status: resp.status,
    headers: { "Content-Type": "application/json" },
  });
}
