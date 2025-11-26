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

  let courses: any[] = [];
  try {
    courses = JSON.parse(decodeURIComponent(rawCourses));
  } catch (err) {
    console.error('Error parsing courses', err);
    return <div>Invalid courses</div>;
  }

  // SECRET MUST MATCH MOODLE
  const SECRET = process.env.NEXT_PUBLIC_MICROCAPS_SECRET || "CHANGE_THIS_SECRET_32_CHARACTERS";

  // Build raw string exactly like Moodle
  const raw = `${uid}|${name}|${JSON.stringify(courses)}`;

  // crypto-js HMAC SHA256
  const expectedSig = CryptoJS.HmacSHA256(raw, SECRET).toString();

  const isValid = expectedSig === sig;

  if (!isValid) {
    return <div>INVALID ACCESS</div>;
  }

  // If valid → authentication success
  const userData = { uid, name, courses };

  // Store session
  useEffect(() => {
    localStorage.setItem("micro_user", JSON.stringify(userData));
  }, []);

  return (
    // <main style={{ padding: '20px' }}>
    //   <h1>Microcápsulas</h1>
    //   <p>User authenticated ✔</p>
    //   <pre style={{ background: '#111', padding: '15px', borderRadius: '8px' }}>
    //     {JSON.stringify(userData, null, 2)}
    //   </pre>
    // </main>
    <main className="min-h-screen p-8 bg-gray-100 text-gray-800">
      <h1 className="text-4xl font-bold mb-4 text-blue-700">Microcápsulas</h1>
      <p className="text-lg mb-4">User authenticated ✔</p>
      <pre className="bg-black text-white p-4 rounded-md">
      {JSON.stringify(userData, null, 2)}
      </pre>
    </main>

  );
}
