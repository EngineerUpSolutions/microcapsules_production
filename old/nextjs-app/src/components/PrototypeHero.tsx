// src/components/PrototypeHero.tsx
export default function PrototypeHero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="max-w-2xl text-center p-8">
        <h1 className="text-4xl font-bold mb-4">Microcapsules — Prototype View</h1>
        <p className="text-lg mb-6">
          This is the single prototype view. Edit <code>src/app/page.tsx</code> or
          <code>src/components/PrototypeHero.tsx</code> to iterate.
        </p>
        <a href="#" className="inline-block px-6 py-3 bg-white text-black rounded">
          Primary action
        </a>
      </div>
    </section>
  )
}
