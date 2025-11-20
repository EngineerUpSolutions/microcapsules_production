'use client';

import { useEffect, useState } from 'react';

export default function Page({ searchParams }: any) {
  const [uid, setUid] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    const uidParam = searchParams.uid || null;
    const nameParam = searchParams.name ? decodeURIComponent(searchParams.name) : null;

    let parsedCourses: any[] = [];
    if (searchParams.courses) {
      try {
        parsedCourses = JSON.parse(decodeURIComponent(searchParams.courses));
      } catch (err) {
        console.error("❌ Error parsing courses", err);
      }
    }

    setUid(uidParam);
    setName(nameParam);
    setCourses(parsedCourses);
  }, [searchParams]);

  return (
    <main style={{ padding: "20px" }}>
      <h1>Microcápsulas</h1>
      <p>Información recibida desde Moodle:</p>

      <pre style={{ background: "#111", padding: "15px", borderRadius: "8px" }}>
        {JSON.stringify(
          {
            uid,
            name,
            courses
          },
          null,
          2
        )}
      </pre>
    </main>
  );
}
