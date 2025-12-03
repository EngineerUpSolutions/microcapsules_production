// components/steps/Step3Microcaps.tsx
import React from "react";
import type { Course } from "./Step1Courses";
import { MicrocapsIcon } from "../icons/MicrocapsIcon";
import { Copy } from "../icons/Copy";

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

  // Extract code and name using same logic as Step 1 & 2
  const match = selectedCourse.fullname.match(/\((\d+)\)\s*$/);
  const code = match ? match[1] : selectedCourse.id;
  const name = match
    ? selectedCourse.fullname.replace(/\s*\(\d+\)\s*$/, "").trim()
    : selectedCourse.fullname;

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Error al copiar la microcápsula:", err);
    }
  };

  return (
    <div className="flex flex-col gap-4">

      {/* Main container (same grey as Step 1 & Step 2) */}
      <div className="bg-[#F1F1F1] rounded-xl px-4 py-4 max-h-72 overflow-y-auto">

        <div className="flex flex-col gap-4">

          {/* ---------------------------------------------------------
              COURSE BANNER — FIGMA PERFECT (same as Step 2)
          ------------------------------------------------------------ */}
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
                h-[32px]
                min-w-[86px]
                rounded-[6px]
                bg-[#EEF7FF]
                text-[#2B506B]
                text-[18px]
                font-[600]
                leading-[24px]
                tracking-[-0.5px]
                flex items-center justify-center
                px-[6px] py-[4px]
              "
            >
              {code}
            </span>

            {/* Course name */}
            <span
              className="
                h-[32px]
                flex items-center
                text-[18px]
                font-[500]
                uppercase
                leading-[16px]
                text-[#2B506B]
              "
            >
              {name}
            </span>
          </div>

          {/* ---------------------------------------------------------
              TOPIC BANNER (light blue, same semantic as Figma)
          ------------------------------------------------------------ */}
          {/* TOPIC BANNER — FIGMA PERFECT */}
          <div
            className="
              w-full
              h-[52px]
              rounded-[12px]
              bg-[#D1EAFD]
              px-[12px]
              py-[14px]
              flex items-center
              gap-[20px]
              text-[18px]
              font-[500]
              uppercase
              leading-[16px]
              text-[#2B506B]
            "
          >
            {selectedTopic}
          </div>


          {/* ---------------------------------------------------------
              LISTA DE MICROCÁPSULAS
          ------------------------------------------------------------ */}
          {microcapsules.length === 0 ? (
            <p className="text-sm text-gray-500">
              Aún no se han generado microcápsulas.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {microcapsules.map((text, idx) => (



                <li
                  key={idx}
                  className="
                    rounded-2xl bg-white
                    px-4 py-3
                    flex flex-col gap-2
                    shadow-sm
                  "
                >
                  {/* Header */}
                  <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-800">
                        <MicrocapsIcon className="h-4 w-4 text-white" />
                      </span>
                      <span>Microcápsula #{idx + 1}</span>
                    </div>

                    {/* Copy button */}
                    <button
                        type="button"
                        onClick={() => handleCopy(text)}
                        className="
                        inline-flex items-center justify-center
                        w-6 h-6
                        cursor-pointer
                        hover:scale-110
                        transition
                        "
                        >
                        <Copy className="w-6 h-6" />
                    </button>

                  </div>

                  {/* Texto de la microcápsula */}
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {text}
                  </p>
                </li>






              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
