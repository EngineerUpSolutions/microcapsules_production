// app/api/topics/route.ts
import { NextRequest, NextResponse } from "next/server";

// Este valor viene del docker-compose (BACKEND_URL: "http://backend:8080")
const BACKEND_URL = process.env.BACKEND_URL || "http://backend:8080";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Esperamos algo como: { curso: "GUIANZA TURISTICA", numero_temas: 5 }

    const resp = await fetch(`${BACKEND_URL}/proxy/topics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await resp.text();

    let data: any;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Respuesta no JSON del backend:", text);
      return NextResponse.json(
        { error: "Respuesta inválida del backend" },
        { status: 500 }
      );
    }

    // Devolvemos tal cual lo que responde el backend
    return NextResponse.json(data, { status: resp.status });
  } catch (err) {
    console.error("Error en /api/topics:", err);
    return NextResponse.json(
      { error: "Error interno al generar temas" },
      { status: 500 }
    );
  }
}
