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

  // Extract code + name
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

      {/* Main container */}
      <div className="bg-[#F1F1F1] rounded-xl px-4 py-4 max-h-72 overflow-y-auto">

        <div className="flex flex-col gap-4">

          {/* ---------------------------------------------------------
              COURSE BANNER — FIGMA PERFECT
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
              TOPIC BANNER — FIGMA
          ------------------------------------------------------------ */}
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
              MICROCÁPSULAS LIST
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
                  relative
                  w-full
                  rounded-[12px]
                  bg-white
                  px-[37px]    /* AUMENTADO PARA RESPETAR FIGMA */
                  py-[14px]
                  flex flex-col
                  gap-[12px]
                  "
                  >
                  {/* Header */}
                  <div className="flex items-center gap-[10px]">
                  <MicrocapsIcon className="w-4 h-4 text-[#696969]" />

                  <span
                  className="
                  text-[14px]
                  font-[500]
                  leading-[16px]
                  text-[#696969]
                  "
                  >
                  Microcápsula #{idx + 1}
                  </span>
                  </div>

                  {/* Copy button */}
                  <button
                  type="button"
                  onClick={() => handleCopy(text)}
                  className="
                  absolute
                  top-[10px]
                  right-[10px]
                  inline-flex items-center justify-center
                  w-[24px] h-[24px]
                  bg-white
                  rounded-[6px]
                  hover:scale-110
                  transition
                  "
                  >
                  <Copy className="w-[24px] h-[24px]" />
                  </button>

                  {/* Texto */}
                  <p
                  className="
                  text-[14px]
                  font-[400]
                  leading-[20px]
                  text-[#5A5C5E]
                  text-justify
                  pr-[10px]   /* EVITA QUE EL TEXTO CHOQUE CON EL ICONO */
                  "
                  >
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
