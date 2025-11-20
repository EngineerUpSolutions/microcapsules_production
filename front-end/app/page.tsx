// app/page.tsx (Server Component)

import { Suspense } from 'react';
// import PageClient from './PageClient';
import PageClient from './PageClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <PageClient />
    </Suspense>
  );
}
