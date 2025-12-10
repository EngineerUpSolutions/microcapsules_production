// components/steps/Step1Courses.tsx
import React from "react";
import { CoursesIcon } from "../icons/CoursesIcon";

export type Course = {
  id: string; // Moodle sends id as string
  fullname: string;
};

type Step1CoursesProps = {
  courses: Course[];
  selectedCourseId: string | null;
  onSelectCourse: (courseId: string) => void;
  onContinue: () => void;
  isContinuing?: boolean;
  // map of courseId -> explicitly subscribed (true/false)
  subscriptions: Record<string, boolean>;
  // toggle handler coming from PageClient
  onToggleSubscription: (courseId: string) => void;
};

function splitNameAndCode(fullname: string): { name: string; code: string } {
  const match = fullname.match(/\((\d+)\)\s*$/);
  if (match) {
    const code = match[1];
    const name = fullname.replace(/\s*\(\d+\)\s*$/, "").trim();
    return { name, code };
  }
  // fallback: no code in parentheses
  return { name: fullname, code: "" };
}

export function Step1Courses({
  courses,
  selectedCourseId,
  onSelectCourse,
  onContinue,
  isContinuing = false,
  subscriptions,
  onToggleSubscription,
}: Step1CoursesProps) {
  const hasSelection = selectedCourseId !== null;

  return (
    <div className="flex flex-col gap-4">
      {/* Title + helper text */}
      <div>
        <h2 className="flex items-center gap-[10px] text-[20px] leading-[24px] font-[500] tracking-[-0.5px] text-[#002C4D]">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100">
            <CoursesIcon className="h-5 w-5" />
          </span>
          <span>Cursos inscritos</span>
        </h2>
        <p className="mt-[4px] text-[14px] leading-[16px] font-[400] text-[#5A5C5E]">
          Selecciona uno de tus cursos y da click en continuar.
        </p>
      </div>

      {/* Courses list */}
      <div
        className="
          bg-[#F1F1F1]
          rounded-xl
          px-4 pt-6 pb-6
          overflow-y-auto

          /* Responsive dynamic height similar to Step 3 */
          max-h-[calc(100vh-350px)]
          sm:max-h-[calc(100vh-330px)]
          md:max-h-[calc(100vh-300px)]
          lg:max-h-[calc(100vh-280px)]
        "
      >
        {courses.length === 0 && (
          <p className="text-sm text-gray-500 px-2 py-4">
            No se encontraron cursos.
          </p>
        )}

        <ul className="flex flex-col gap-4 pb-8">
          {courses.map((course) => {
            const selected = course.id === selectedCourseId;
            const { name, code } = splitNameAndCode(course.fullname);
            const effectiveSubscribed =
              subscriptions[course.id] ?? true; // default: true if no record

            return (
              <li
                key={course.id}
                className={`
                  flex flex-wrap items-center
                  gap-[10px]
                  rounded-[12px]
                  px-[12px] py-[14px]
                  cursor-pointer
                  transition-colors
                  border-none
                  ${selected ? "bg-[#D0EED0]" : "bg-white"}
                  hover:bg-[#D0EED0]
                `}
                onClick={() => onSelectCourse(course.id)}
              >
                {/* LEFT: checkbox + code + name */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Checkbox visual */}
                  <div
                    className={`
                      h-6 w-6
                      rounded-[6px]
                      border-[1.8px]
                      flex items-center justify-center
                      transition-colors
                      ${
                        selected
                          ? "bg-[#00AA00] border-transparent"
                          : "bg-white border-[#96A8B6]"
                      }
                    `}
                  >
                    {selected && (
                      <span className="text-white text-sm font-bold leading-none">
                        ✓
                      </span>
                    )}
                  </div>

                  {/* Course code + name */}
                  <div className="flex items-center gap-1 flex-1 flex-wrap">
                    <span
                      className="
                        inline-flex items-center justify-center
                        rounded-[6px]
                        bg-[#EBF6E6]
                        text-[#208820]
                        text-[18px] font-semibold
                        leading-[24px]
                        tracking-[-0.5px]
                        h-[32px]
                        px-[6px] py-[4px]
                      "
                    >
                      {code || course.id}
                    </span>

                    <span
                      className="
                        text-[18px]
                        font-[500]
                        uppercase
                        text-[#5A5C5E]
                        leading-[16px]
                      "
                    >
                      {name}
                    </span>
                  </div>
                </div>

                {/* Subscription pill */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // don't change selected course when toggling
                    onToggleSubscription(course.id);
                  }}
                  className={`
                    ml-auto
                    mt-2
                    px-3 py-1
                    rounded-full
                    text-xs
                    font-semibold
                    border
                    text-center
                    ${
                      effectiveSubscribed
                        ? "bg-[#E6F4EA] text-[#1E7A1E] border-[#B5E0C2]"
                        : "bg-[#F3F4F6] text-[#4B5563] border-[#D1D5DB]"
                    }
                  `}
                >
                  {effectiveSubscribed ? "Suscrito" : "No suscrito"}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
