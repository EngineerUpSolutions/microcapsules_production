// lib/api.ts

// Estructura esperada desde el backend Go:
// {
//   "data": {
//     "curso": "...",
//     "total_generados": 5,
//     "temas": ["...", "...", ...]
//   },
//   "meta": { ... }
// }

type TopicsBackendResponse = {
  data: {
    curso: string;
    total_generados: number;
    temas: string[];
  };
  meta: any;
};

// Debe coincidir con tu basePath de next.config.ts
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "/microcapsulas";

/**
 * Llama a la ruta API de Next, que a su vez llama al backend Go.
 * Devuelve directamente el arreglo de temas.
 */
export async function generateTopics(
  curso: string,
  numero_temas: number
): Promise<string[]> {
  const res = await fetch(`${BASE_PATH}/api/topics`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ curso, numero_temas }),
  });

  if (!res.ok) {
    const msg = await res.text();
    console.error("Error generateTopics:", res.status, msg);
    throw new Error("Error al generar temas");
  }

  const json = (await res.json()) as TopicsBackendResponse;

  if (!json.data || !Array.isArray(json.data.temas)) {
    console.error("Formato inesperado en respuesta de topics:", json);
    throw new Error("Formato inesperado en respuesta de backend");
  }

  return json.data.temas;
}
