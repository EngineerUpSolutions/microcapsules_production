// app/PageClient.tsx

'use client';

import { useSearchParams } from 'next/navigation';

export default function PageClient() {
  const searchParams = useSearchParams();

  const uid = searchParams.get('uid');
  const name = searchParams.get('name');
  const rawCourses = searchParams.get('courses');

  let courses: any[] = [];
  if (rawCourses) {
    try {
      courses = JSON.parse(decodeURIComponent(rawCourses));
    } catch (err) {
      console.error('Error parsing courses', err);
    }
  }

  return (
    <main style={{ padding: '20px' }}>
      <h1>Microcápsulas</h1>
      <p>Información recibida desde Moodle:</p>
      <pre style={{ background: '#111', padding: '15px', borderRadius: '8px' }}>
        {JSON.stringify({ uid, name, courses }, null, 2)}
      </pre>
    </main>
  );
}
