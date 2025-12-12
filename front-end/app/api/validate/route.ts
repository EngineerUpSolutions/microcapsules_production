import { NextRequest, NextResponse } from "next/server";
import CryptoJS from "crypto-js";

type ValidatePayload = {
  uid: string;
  name: string;
  courses: string; // raw JSON string (decoded)
  sig: string;
};

export async function POST(req: NextRequest) {
  try {
    // ---------------------------
    // 1. Parse request body
    // ---------------------------
    const body = (await req.json()) as Partial<ValidatePayload>;
    const { uid, name, courses, sig } = body;

    if (!uid || !name || !courses || !sig) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    // ---------------------------
    // 2. Load secret (SERVER ONLY)
    // ---------------------------
    const SECRET =
      process.env.MICROCAPS_SECRET ||
      (() => {
        console.error("MICROCAPS_SECRET is not defined in environment");
        return "";
      })();

    if (!SECRET) {
      return NextResponse.json(
        { error: "Server misconfigured: missing secret" },
        { status: 500 }
      );
    }

    // ---------------------------
    // 3. Validate signature
    // ---------------------------
    const raw = `${uid}|${name}|${courses}`;
    const expectedSig = CryptoJS.HmacSHA256(raw, SECRET).toString();

    if (expectedSig !== sig) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 403 }
      );
    }

    // ---------------------------
    // 4. Success
    // ---------------------------
    return NextResponse.json({ ok: true }, { status: 200 });

  } catch (err) {
    console.error("Validation error:", err);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
