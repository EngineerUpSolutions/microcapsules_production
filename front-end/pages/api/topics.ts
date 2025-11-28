// pages/api/topics.ts
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Next.js API route: /api/topics
 * This runs on the frontend container (Node), server-side only.
 * It receives { curso, numero_temas } from the browser,
 * calls the Go backend at http://backend:8080/proxy/topics,
 * and returns the backend JSON to the browser.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { curso, numero_temas } = req.body || {};

    if (!curso || !numero_temas) {
      return res
        .status(400)
        .json({ error: "Faltan parámetros: curso o numero_temas" });
    }

    // Call the backend container over the internal Docker network
    const backendResponse = await fetch("http://backend:8080/proxy/topics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ curso, numero_temas }),
    });

    if (!backendResponse.ok) {
      const text = await backendResponse.text().catch(() => "");
      console.error(
        "[frontend] /api/topics backend error:",
        backendResponse.status,
        text
      );
      return res.status(backendResponse.status).json({
        error: "Error al consultar el backend",
        status: backendResponse.status,
      });
    }

    const data = await backendResponse.json();
    // Just forward backend JSON
    return res.status(200).json(data);
  } catch (err) {
    console.error("[frontend] /api/topics error:", err);
    return res.status(500).json({ error: "Error interno en /api/topics" });
  }
}
