// components/steps/Step2Topics.tsx
import React from "react";
import type { Course } from "./Step1Courses";
import { TopicsIcon } from "../icons/TopicsIcon";
type Step2TopicsProps = {
  selectedCourse: Course | null;
  topics: string[];
  selectedTopic: string | null;
  onSelectTopic: (topic: string) => void;
  onContinue: () => void;
  isContinuing: boolean;
};


export function Step2Topics({
  selectedCourse,
  topics,
  selectedTopic,
  onSelectTopic,
  onContinue,
  isContinuing,
}: Step2TopicsProps) {
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
      {/* Lista de temas (selección única) */}
      <div className="bg-black/80 rounded-2xl px-4 py-4">
        {topics.length === 0 ? (
          <p className="text-sm text-gray-400">
            No se recibieron temas del backend. Verifica la llamada a la API.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {topics.map((topic, idx) => {
              const isSelected = topic === selectedTopic;

              return (
                <li
                  key={idx}
                  onClick={() => onSelectTopic(topic)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 cursor-pointer transition-colors ${
                    isSelected ? "bg-green-900/60" : "bg-zinc-900"
                  }`}
                >
                  {/* checkbox visual */}
                  <div
                    className={`h-5 w-5 rounded-md border flex items-center justify-center transition-colors ${
                      isSelected
                        ? "border-green-400 bg-green-500"
                        : "border-gray-500 bg-transparent"
                    }`}
                  >
                    {isSelected && (
                      <span className="text-white text-xs font-bold">✓</span>
                    )}
                  </div>

                  <span
                    className={`text-sm font-medium ${
                      isSelected ? "text-green-100" : "text-slate-100"
                    }`}
                  >
                    {topic}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Botón Continuar */}
      <div className="flex justify-end mt-2">
        <button
          type="button"
          disabled={!selectedTopic || isContinuing}
          onClick={onContinue}
          className={`px-6 py-2 rounded-full text-sm font-medium shadow-sm transition-colors ${
            !selectedTopic || isContinuing
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-sky-900 text-white hover:bg-sky-800"
          }`}
        >
          {isContinuing ? "Generando..." : "Continuar"}
        </button>
      </div>
    </div>
  );
}
