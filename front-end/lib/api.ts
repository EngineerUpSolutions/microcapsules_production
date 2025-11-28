// front-end/lib/api.ts

export type TopicsData = {
  curso: string;
  total_generados: number;
  temas: string[];
};

/**
 * Calls the Next.js API route /api/topics, which in turn
 * calls the Go backend (/proxy/topics).
 *
 * It returns only the "data" part:
 *   { curso, total_generados, temas }
 */
export async function generateTopics(
  curso: string,
  numero_temas: number
): Promise<TopicsData> {
  // From the browser, this hits http://127.0.0.1/api/topics
  // Apache proxies /api → http://127.0.0.1:3000/api
  const response = await fetch("/api/topics", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ curso, numero_temas }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Error calling /api/topics:", response.status, text);
    throw new Error("Failed to generate topics");
  }

  const json = await response.json();
  // Backend returns: { data: { curso, total_generados, temas }, meta: {...} }
  return json.data as TopicsData;
}
// Call Next.js API route -> backend /proxy/microcapsules
export async function generateMicrocapsules(
  tema: string,
  min_caracteres: number,
  max_caracteres: number,
  cantidad_microcapsulas: number
) {
  const resp = await fetch("/api/microcapsules", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tema,
      min_caracteres,
      max_caracteres,
      cantidad_microcapsulas,
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    console.error("Error from /api/microcapsules:", text);
    throw new Error("Failed to generate microcapsules");
  }

  const json = await resp.json();
  // backend returns: { data: { tema, microcapsulas: string[] }, meta: ... }
  return json.data; // { tema, microcapsulas }
}
