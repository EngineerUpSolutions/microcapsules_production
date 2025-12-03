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

  // Extract course code and cleaned name
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

      {/* Grey container (same as Step1) */}
      <div className="bg-[#F1F1F1] rounded-xl px-4 pt-6 pb-6 max-h-[420px] overflow-y-auto flex flex-col gap-4">

        {/* Blue course banner (Figma values) */}
        {/* Blue course banner — EXACT FIGMA DESIGN */}
        <div
          className="
            w-full
            h-[60px]
            rounded-[12px]
            bg-[#D1EAFD]
            px-[12px]
            py-[14px]
            flex items-center
            gap-[20px]
          "
        >
          {/* Code pill */}
          <span
            className="
              flex items-center justify-center
              h-[32px]
              min-w-[86px]
              rounded-[6px]
              bg-[#EEF7FF]
              px-[6px] py-[4px]

              font-[600]
              text-[18px]
              leading-[24px]
              tracking-[-0.5px]
              text-[#2B506B]
            "
          >
            {code}
          </span>

          {/* Course name */}
          <span
            className="
              flex items-center
              h-[32px]

              font-[500]
              text-[18px]
              leading-[16px]
              uppercase
              text-[#2B506B]
            "
          >
            {name}
          </span>
        </div>

        

        {/* Topics list */}
        {topics.length === 0 ? (
          <p className="text-sm text-gray-500 px-2 py-4">
            No se recibieron temas del backend.
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {topics.map((topic, idx) => {
              const selected = topic === selectedTopic;

              return (
                <li
                  key={idx}
                  className={`
                    flex items-center gap-3 rounded-2xl px-4 py-3 cursor-pointer
                    transition-colors border-none
                    ${selected ? "bg-[#D0EED0]" : "bg-white"}
                    hover:bg-[#D0EED0]
                  `}
                  onClick={() => onSelectTopic(topic)}
                >
                  {/* Checkbox identical to Step1 */}
                  <div
                    className={`
                      h-6 w-6 rounded-[6px] border-[1.8px]
                      flex items-center justify-center transition-colors
                      ${
                        selected
                          ? "bg-[#00AA00] border-transparent"
                          : "bg-white border-[#96A8B6]"
                      }
                    `}
                  >
                    {selected && (
                      <span className="text-white text-sm font-bold leading-none">✓</span>
                    )}
                  </div>

                  <span className="text-sm text-slate-800 font-medium">
                    {topic}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Continue button */}
      <div className="flex justify-end mt-2">
        <button
          type="button"
          disabled={!selectedTopic || isContinuing}
          onClick={onContinue}
          className={`
            flex items-center justify-center
            px-4 py-[10px]
            rounded-[12px]
            text-sm font-medium transition-all gap-2 shadow-sm
            ${
              !selectedTopic || isContinuing
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#349A00] text-white hover:bg-[#2E8F00]"
            }
          `}
        >
          {isContinuing ? "Cargando microcápsulas..." : "Continuar"}
        </button>
      </div>
    </div>
  );
}
