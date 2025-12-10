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

          <h2 className="
            flex items-center gap-2
            text-[20px] leading-[24px] 
            font-[500] tracking-[-0.5px]
            text-[#002C4D]
          ">

          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100">
            <TopicsIcon className="h-5 w-5" />
          </span>
          <span>Temas</span>
        </h2>

        <p className="
          mt-1 
          text-[14px] leading-[16px] 
          font-[400]
          text-[#5A5C5E]
        ">
            
          Selecciona un tema y da click en continuar.
        </p>
      </div>

      {/* Grey container (same as Step1) */}
      <div
        className="
          bg-[#F1F1F1]
          rounded-xl
          px-4 pt-6 pb-6
          overflow-y-auto
          flex flex-col gap-4

          /* Responsive dynamic height similar to Step 3 */
          max-h-[calc(100vh-350px)]
          sm:max-h-[calc(100vh-330px)]
          md:max-h-[calc(100vh-300px)]
          lg:max-h-[calc(100vh-280px)]
        "
      >



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
                    flex items-center
                    gap-[20px]
                    rounded-[12px]
                    px-[12px] py-[14px]
                    cursor-pointer
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

                <span
                  className="
                    text-[18px]
                    font-[500]
                    leading-[16px]
                    text-[#5A5C5E]
                    uppercase
                  "
                >
                  {topic}
                </span>

                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
