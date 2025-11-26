// lib/api.ts
export const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://backend:8080";


  
export async function generateTopics(curso: string, numero_temas: number) {
  const res = await fetch(`${BASE_URL}/proxy/topics`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ curso, numero_temas }),
  });

  if (!res.ok) {
    throw new Error('Failed to generate topics');
  }

  const json = await res.json();
  return json.data;
}


export async function generateMicrocapsules({
  tema,
  min_caracteres,
  max_caracteres,
  cantidad_microcapsulas,
}: {
  tema: string;
  min_caracteres: number;
  max_caracteres: number;
  cantidad_microcapsulas: number;
}) {
  const res = await fetch(`${BASE_URL}/proxy/microcapsules`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tema,
      min_caracteres,
      max_caracteres,
      cantidad_microcapsulas,
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to generate microcapsules');
  }

  const json = await res.json();
  return json.data;
}
