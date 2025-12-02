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
}: Step1CoursesProps) {
  const hasSelection = selectedCourseId !== null;

  return (
    <div className="flex flex-col gap-4">
      {/* Title + helper text */}
      <div>
        <h2 className="flex items-center gap-2 text-base font-semibold text-sky-900">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100">
            <CoursesIcon className="h-5 w-5" />
          </span>
          <span>Cursos inscritos</span>
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Selecciona uno de tus cursos y da click en continuar.
        </p>
      </div>

      {/* Courses list */}
      <div className="bg-[#F1F1F1] rounded-xl px-4 pt-6 pb-6 max-h-[420px] overflow-y-auto">
        {courses.length === 0 && (
          <p className="text-sm text-gray-500 px-2 py-4">
            No se encontraron cursos.
          </p>
        )}

        <ul className="flex flex-col gap-4">
          {courses.map((course) => {
            const selected = course.id === selectedCourseId;
            const { name, code } = splitNameAndCode(course.fullname);

            return (
              <li
                key={course.id}
                className={`
                  flex items-center gap-3 rounded-2xl px-4 py-3 cursor-pointer
                  transition-colors

                  border-none
                  ${selected ? "bg-[#D0EED0]" : "bg-white"}
                  hover:bg-[#D0EED0]
                `}
                onClick={() => onSelectCourse(course.id)}
              >



                {/* Checkbox visual */}
                <div
                  className={`
                    h-6 w-6
                    rounded-[6px]
                    border-[1.8px]
                    flex items-center justify-center
                    transition-colors
                    ${selected ? "bg-[#00AA00] border-transparent" : "bg-white border-[#96A8B6]"}
                  `}
                >
                  {selected && (
                    <span className="text-white text-sm font-bold leading-none">✓</span>
                  )}
                </div>


                {/* Course code + name */}
                <div className="flex flex-row items-center gap-3 flex-1">
                  

                  <span
                      className="
                      inline-flex items-center justify-center
                      rounded-[6px]
                      bg-[#E4F7E4]
                      text-[#208820]
                      text-xs font-semibold
                      px-[6px] py-[4px]
                      "
                      >
                      {code || course.id}
                  </span>



                  <span className="text-sm text-slate-800 font-medium">
                    {name}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Continue button */}
      <div className="flex justify-end mt-2">
        <button
          type="button"
          disabled={!hasSelection || isContinuing}
          onClick={onContinue}
          className={`
            flex items-center justify-center
            px-4 py-[10px]
            rounded-[12px]
            text-sm font-medium
            transition-all
            gap-2
            shadow-sm
            ${!hasSelection || isContinuing
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-[#349A00] text-white hover:bg-[#2E8F00]"}
          `}
        >
          {isContinuing ? (
            <>
              {/* Spinner */}
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16 8 8 0 01-8-8z"
                ></path>
              </svg>

              <span>Cargando temas</span>
            </>
          ) : (
            "Continuar"
          )}
        </button>
      </div>







    </div>
  );
}
