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

// Helper: split "VENTA DE PRODUCTOS EN LINEA (2977856)"
// → name: "VENTA DE PRODUCTOS EN LINEA"
// → code: "2977856"
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
      <div className="bg-black rounded-2xl px-4 pt-6 pb-6 max-h-72 overflow-y-auto">
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
                className={`flex items-center gap-3 rounded-2xl bg-white px-4 py-3 cursor-pointer border transition-colors ${
                  selected ? "border-green-500" : "border-gray-200"
                }`}
                onClick={() => onSelectCourse(course.id)}
              >
                {/* Checkbox visual */}
                <div
                  className={`h-5 w-5 rounded-md border flex items-center justify-center transition-colors ${
                    selected
                      ? "border-green-500 bg-green-500"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {selected && (
                    <span className="text-white text-xs font-bold">✓</span>
                  )}
                </div>

                {/* Course code + name */}
                <div className="flex flex-row items-center gap-3 flex-1">
                  <span className="inline-flex items-center justify-center rounded-md bg-green-100 text-green-700 text-xs font-semibold px-3 py-1">
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
          className={`px-6 py-2 rounded-full text-sm font-medium shadow-sm transition-colors ${
            !hasSelection || isContinuing
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-sky-900 text-white hover:bg-sky-800"
          }`}
        >
          {isContinuing ? "Cargando..." : "Continuar"}
        </button>
      </div>
    </div>
  );
}
