// components/steps/Step2Topics.tsx
import React from "react";
import type { Course } from "./Step1Courses";
import { TopicsIcon } from "../icons/TopicsIcon";
type Step2TopicsProps = {
  selectedCourse: Course | null;
};
export function Step2Topics({ selectedCourse }: Step2TopicsProps) {
  if (!selectedCourse) {
    return (
      <div className="text-sm text-red-600">
        No hay curso seleccionado (error interno).
      </div>
    );
  }
  const match = selectedCourse.fullname.match(/\((\d+)\)\s*$/);
  const code = match ? match[1] : selectedCourse.id;
  const name = match
    ? selectedCourse.fullname.replace(/\s*\(\d+\)\s*$/, "").trim()
    : selectedCourse.fullname;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div>
        <h2 className="flex items-center gap-2 text-base font-semibold text-sky-900">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100">
            <TopicsIcon className="h-5 w-5" />
          </span>
          <span>Temas</span>
        </h2>

        
        <p className="text-xs text-gray-500 mt-1">
          Selecciona un tema y da click en continuar.
        </p>
      </div>

      {/* Banner con el curso seleccionado */}
      <div className="rounded-2xl bg-[#e1f0ff] px-4 py-3 text-sm font-semibold text-slate-800 flex items-center gap-3">
        <span className="inline-flex items-center justify-center rounded-md bg-green-100 text-green-700 text-xs font-semibold px-3 py-1">
        {code}
        </span>
        <span>{name}</span>
      </div>

      {/* Placeholder de la lista de temas (estático por ahora) */}
      <div className="bg-[#f5f5f5] rounded-2xl px-4 py-3">
        <p className="text-sm text-gray-600">
          Aquí irá la lista de temas generados por la API (por ahora es solo un
          placeholder).
        </p>
      </div>
    </div>
  );
}
