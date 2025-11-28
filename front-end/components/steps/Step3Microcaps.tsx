// components/steps/Step3Microcaps.tsx
import React from "react";
import type { Course } from "./Step1Courses";
import { TopicsIcon } from "../icons/TopicsIcon"; // we reuse the same icon for now

type Step3MicrocapsProps = {
  selectedCourse: Course | null;
  selectedTopic: string | null;
  microcapsules: string[];
};

export function Step3Microcaps({
  selectedCourse,
  selectedTopic,
  microcapsules,
}: Step3MicrocapsProps) {
  if (!selectedCourse || !selectedTopic) {
    return (
      <div className="text-sm text-red-500">
        Falta curso o tema seleccionado (error interno).
      </div>
    );
  }

  // Same logic you use in Step1/Step2 to get code + name
  const match = selectedCourse.fullname.match(/\((\d+)\)\s*$/);
  const code = match ? match[1] : selectedCourse.id;
  const name = match
    ? selectedCourse.fullname.replace(/\s*\(\d+\)\s*$/, "").trim()
    : selectedCourse.fullname;

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // In the future we can add a toast here
    } catch (err) {
      console.error("Error al copiar la microcápsula:", err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div>
        <h2 className="flex items-center gap-2 text-base font-semibold text-sky-900">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100">
            <TopicsIcon className="h-5 w-5" />
          </span>
          <span>Microcápsulas</span>
        </h2>

        <p className="text-xs text-gray-500 mt-1">
          Copia el texto de la microcápsula que desees, usando el icono de
          copia en cada tarjeta.
        </p>
      </div>

      {/* Banner curso */}
      <div className="rounded-2xl bg-[#e1f0ff] px-4 py-3 text-sm font-semibold text-slate-800 flex items-center gap-3">
        <span className="inline-flex items-center justify-center rounded-md bg-green-100 text-green-700 text-xs font-semibold px-3 py-1">
          {code}
        </span>
        <span>{name}</span>
      </div>

      {/* Banner tema seleccionado */}
      <div className="rounded-2xl bg-[#c7ddff] px-4 py-3 text-sm font-semibold text-slate-800">
        {selectedTopic}
      </div>

      {/* Lista de microcápsulas */}
      <div className="bg-black/80 rounded-2xl px-4 py-4 max-h-72 overflow-y-auto">
        {microcapsules.length === 0 ? (
          <p className="text-sm text-gray-400">
            Aún no se han generado microcápsulas.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {microcapsules.map((text, idx) => (
              <li
                key={idx}
                className="rounded-2xl bg-zinc-900 px-4 py-3 flex flex-col gap-2"
              >
                {/* Header microcápsula */}
                <div className="flex items-center justify-between text-sm font-semibold text-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-800">
                      {/* Simple microcápsula icon (can be replaced later) */}
                      <span className="text-xs">Ⓜ</span>
                    </span>
                    <span>Microcápsula #{idx + 1}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(text)}
                    className="inline-flex items-center justify-center rounded-md border border-slate-600 px-2 py-1 text-xs text-slate-100 hover:bg-slate-700"
                  >
                    Copiar
                  </button>
                </div>

                {/* Texto de la microcápsula */}
                <p className="text-sm text-slate-200 leading-relaxed">
                  {text}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
