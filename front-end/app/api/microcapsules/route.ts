// app/api/microcapsules/route.ts
import { NextRequest, NextResponse } from "next/server";

// Same as topics route
const BACKEND_URL = process.env.BACKEND_URL || "http://backend:8080";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // We expect: { tema: string, min_caracteres: number, max_caracteres: number, cantidad_microcapsulas: number }

    const resp = await fetch(`${BACKEND_URL}/proxy/microcapsules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await resp.text();

    let data: any;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Respuesta no JSON del backend (microcapsules):", text);
      return NextResponse.json(
        { error: "Respuesta inválida del backend (microcapsules)" },
        { status: 500 }
      );
    }

    // Return exactly what backend returns
    return NextResponse.json(data, { status: resp.status });
  } catch (err) {
    console.error("Error en /api/microcapsules:", err);
    return NextResponse.json(
      { error: "Error interno al generar microcápsulas" },
      { status: 500 }
    );
  }
}

