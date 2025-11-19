'use client'
import { useState } from 'react'

type Topic = {
  id: number
  title: string
  excerpt: string
  microcapsulas?: string[]
  body?: string
}
type Course = { id: number; name: string; code: string; topics: Topic[] }

const MOCK_COURSES: Course[] = [
  { id: 1, name: 'VENTA DE PRODUCTOS EN LÍNEA', code: '2977858', topics: [] },
  { id: 2, name: 'GESTIÓN INTEGRAL DEL TRANSPORTE', code: '2758116', topics: [] },
  {
    id: 3,
    name: 'NEGOCIACIÓN INTERNACIONAL',
    code: '2282285',
    topics: [
      {
        id: 1,
        title: 'Estrategias de negociación intercultural',
        excerpt: 'microcápsulas',
        microcapsulas: [
          'Microcápsula 1 — Preparación: Investiga la cultura y las expectativas comerciales del contraparte. Entender su estructura de toma de decisiones ayuda a planificar quién debe participar y qué argumentos priorizar.',
          'Microcápsula 2 — Relación: En muchas culturas la confianza se construye antes de negociar números. Invierte tiempo en presentaciones formales, contexto y referencias que muestren seriedad y estabilidad.',
          'Microcápsula 3 — Adaptación: Ajusta el ritmo y lenguaje de la negociación (formal vs directo). Evita modismos locales; usa ejemplos claros y documentados para reducir malentendidos.',
        ],
      },
      {
        id: 2,
        title: 'Comunicación y barreras culturales',
        excerpt: 'microcápsulas',
        microcapsulas: [
          'Microcápsula 1 — Señales no verbales: Gestos, silencio y tono transmiten mucho; en algunos grupos el silencio indica respeto, en otros desinterés. Clarifica intenciones con preguntas abiertas.',
          'Microcápsula 2 — Lenguaje: Evita traducciones literales. Prefiere frases cortas, definiciones y ejemplos. Cuando sea posible, provee material por escrito y evita ambigüedades.',
          'Microcápsula 3 — Contexto: Alto contexto vs bajo contexto. Si hay mezcla cultural, explicita procesos y responsabilidades para evitar suposiciones.',
        ],
      },
      {
        id: 3,
        title: 'Negociación internacional y acuerdos comerciales',
        excerpt: 'microcápsulas',
        microcapsulas: [
          'Microcápsula 1 — Términos de entrega: Definir Incoterms y responsabilidades logísticas reduce disputas. Aclara quién asume transporte, seguros y riesgos en cada etapa.',
          'Microcápsula 2 — Formas de pago: Evalúa cartas de crédito, pagos escalonados y garantías. Establece hitos y comprobantes que liberen pagos para minimizar riesgo financiero.',
          'Microcápsula 3 — Cláusulas contractuales: Incluye revisiones periódicas, cláusulas de cumplimiento y mecanismos de resolución de conflictos (jurisdicción, arbitraje).',
        ],
      },
    ],
  },
  { id: 4, name: 'DESARROLLO PUBLICITARIO', code: '2879774', topics: [] },
  { id: 5, name: 'GESTIÓN DE MERCADOS', code: '2348755', topics: [] },
]

export default function PrototypeView() {
  const [studentName] = useState('Daniel Zambrano')
  const [courses] = useState<Course[]>(MOCK_COURSES)

  const [selectedCourseId, setSelectedCourseId] = useState<number>(3)
  const selectedCourse =
    courses.find((c) => c.id === selectedCourseId) || courses[0]

  const [selectedTopicId, setSelectedTopicId] = useState<number>(
    selectedCourse.topics.length > 0
      ? selectedCourse.topics[0]?.id ?? 0
      : 0
  )

  function changeCourse(id: number) {
    setSelectedCourseId(id)
    const course = courses.find((c) => c.id === id)
    const firstTopic =
      course && course.topics && course.topics.length > 0
        ? course.topics[0].id
        : 0
    setSelectedTopicId(firstTopic)
  }

  const topics = selectedCourse.topics ?? []
  const selectedTopic =
    topics.find((t) => t.id === selectedTopicId) ??
    topics[0] ??
    null

  return (
    <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center">
      <div className="w-[calc(100vw-160px)] max-w-[1600px] mx-auto bg-white/5 border border-slate-700 rounded-lg p-8 md:p-10 min-h-[60vh]">
        
        {/* HEADER */}
        <header className="text-center pb-4">
          <h1 className="text-lg md:text-2xl tracking-widest text-blue-500 font-semibold">
            MICROCÁPSULAS
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-2">
            Descripción corta — resumen del módulo o propósito de la vista
          </p>
        </header>

        {/* CONTENT */}
        <div className="mt-6 border-t border-slate-700 pt-6 space-y-10">

          {/* STUDENT */}
          <div className="text-xs md:text-sm text-slate-300">
            <span className="font-medium text-slate-200">Estudiante:</span>{' '}
            <span className="ml-2">{studentName}</span>
          </div>

          {/* COURSES — HORIZONTAL */}
          <section>
            <div className="text-sm text-slate-400 mb-2 font-medium">
              Cursos inscritos
            </div>

            <div className="flex overflow-x-auto gap-3 py-2 scrollbar-thin scrollbar-thumb-slate-700">
              {courses.map((c) => {
                const isSelected = c.id === selectedCourseId
                return (
                  <button
                    key={c.id}
                    onClick={() => changeCourse(c.id)}
                    className={`
                      whitespace-nowrap px-4 py-2 rounded-lg border text-sm transition
                      ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-900/20 text-emerald-300 font-semibold'
                          : 'border-slate-700 text-slate-300 hover:bg-slate-800/40'
                      }
                    `}
                  >
                    {c.name}{' '}
                    <span className="text-xs text-slate-400">
                      ({c.code})
                    </span>
                  </button>
                )
              })}
            </div>
          </section>

          {/* TOPICS — HORIZONTAL */}
          <section>
            <div className="text-sm text-slate-400 mb-2 font-medium">
              Temas — escoge uno
            </div>

            {topics.length === 0 ? (
              <div className="text-sm text-slate-500 italic">
                No hay temas para este curso.
              </div>
            ) : (
              <div className="flex overflow-x-auto gap-3 py-2 scrollbar-thin scrollbar-thumb-slate-700">
                {topics.map((t) => {
                  const isSelected = t.id === selectedTopicId
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTopicId(t.id)}
                      className={`
                        whitespace-nowrap px-4 py-2 rounded-md text-sm transition
                        ${
                          isSelected
                            ? 'bg-emerald-900/20 border border-emerald-600 text-emerald-200'
                            : 'border border-slate-700 hover:bg-slate-800/30 text-slate-300'
                        }
                      `}
                    >
                      {t.title}
                    </button>
                  )
                })}
              </div>
            )}
          </section>

          {/* MICROCAPSULES — VERTICAL */}
          <section className="space-y-6">
            {selectedTopic ? (
              <>
                <h2 className="text-base md:text-lg font-semibold text-emerald-300">
                  {selectedTopic.title}
                </h2>
                <p className="mt-2 text-xs md:text-sm text-slate-400">
                  {selectedTopic.excerpt}
                </p>

                <div className="mt-4 space-y-4">
                  {selectedTopic.microcapsulas &&
                  selectedTopic.microcapsulas.length > 0 ? (
                    selectedTopic.microcapsulas.map((mc, idx) => (
                      <article
                        key={idx}
                        className="bg-white/3 border border-slate-700 rounded-md p-4 text-sm text-slate-200"
                      >
                        {mc.split('\n').map((p, i) => (
                          <p key={i} className="mb-2 leading-7">
                            {p}
                          </p>
                        ))}
                      </article>
                    ))
                  ) : selectedTopic.body ? (
                    <article className="bg-white/3 border border-slate-700 rounded-md p-4 text-sm text-slate-200">
                      {selectedTopic.body
                        .split('\n')
                        .map((p, i) => (
                          <p key={i} className="mb-2 leading-7">
                            {p}
                          </p>
                        ))}
                    </article>
                  ) : (
                    <div className="text-sm text-slate-500 italic">
                      No hay contenido disponible.
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-sm text-slate-500 italic">
                Selecciona un tema para ver la microcapsula.
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  )
}
