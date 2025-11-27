'use client';

import { useSearchParams } from 'next/navigation';
import CryptoJS from 'crypto-js';
import { useEffect } from 'react';

export default function PageClient() {
  const searchParams = useSearchParams();

  const uid = searchParams.get('uid');
  const name = searchParams.get('name');
  const rawCourses = searchParams.get('courses');
  const sig = searchParams.get('sig');

  if (!uid || !name || !rawCourses || !sig) {
    return <div>Missing parameters</div>;
  }

  // 👉 1) Usamos el string JSON EXACTO que viene desde Moodle
  const decodedCoursesStr = decodeURIComponent(rawCourses);

  let courses: any[] = [];
  try {
    // Solo para poder trabajar con el array después,
    // pero la firma se hace con decodedCoursesStr, no con JSON.stringify(courses)
    courses = JSON.parse(decodedCoursesStr);
  } catch (err) {
    console.error('Error parsing courses', err);
    return <div>Invalid courses</div>;
  }

  // SECRET MUST MATCH MOODLE
  // En un componente "use client", process.env.* no funciona como en el servidor,
  // pero como el fallback es el MISMO string que en Moodle, estamos bien para ahora.
  const SECRET =
    process.env.MICROCAPS_SECRET || 'k8Z3pL9qT2vX6sR1yB4nW7cH5mD0fG8Q';


  // 👉 2) Construimos raw EXACTAMENTE igual que en PHP:
  // $raw = $userid . '|' . $fullname . '|' . json_encode($filteredcourses);
  const raw = `${uid}|${name}|${decodedCoursesStr}`;

  // crypto-js HMAC SHA256
  const expectedSig = CryptoJS.HmacSHA256(raw, SECRET).toString();
  const isValid = expectedSig === sig;

  if (!isValid) {
    console.error('Invalid signature', { raw, expectedSig, sig });
    return <div>INVALID ACCESS</div>;
  }

  // If valid → authentication success
  const userData = { uid, name, courses };

  // Store session
  useEffect(() => {
    localStorage.setItem('micro_user', JSON.stringify(userData));
  }, [userData]);
  return (
  <main className="min-h-screen p-8 flex items-center justify-center">
    <div className="w-full max-w-4xl bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-8 text-white">
      <h1 className="text-4xl font-bold mb-4">Microcápsulas</h1>
      <p className="text-lg mb-4">User authenticated ✔</p>
      <pre className="bg-black/60 text-white p-4 rounded-md text-sm overflow-auto max-h-[300px]">
        {JSON.stringify(userData, null, 2)}
      </pre>
    </div>
  </main>
);

}
