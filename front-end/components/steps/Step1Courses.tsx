import { CoursesIcon } from "../icons/CoursesIcon";
import React from "react";

export type Course = {
  id: string;       // Moodle sends id as string
  fullname: string;
};

type Step1CoursesProps = {
  courses: Course[];
  selectedCourseId: string | null;
  onSelectCourse: (courseId: string) => void;
  onContinue: () => void;
  isContinuing?: boolean;
};

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
      <div className="bg-slate-100 rounded-2xl p-2 max-h-72 overflow-y-auto">
        {courses.length === 0 && (
          <p className="text-sm text-gray-500 px-2 py-4">
            No se encontraron cursos.
          </p>
        )}

        <ul className="flex flex-col gap-2">
          {courses.map((course) => {
            const selected = course.id === selectedCourseId;
            return (
              <li
                key={course.id}
                className={`flex items-center gap-3 rounded-xl bg-white px-3 py-3 cursor-pointer border ${
                  selected ? "border-green-500" : "border-transparent"
                }`}
                onClick={() => onSelectCourse(course.id)}
              >
                {/* Checkbox visual */}
                <div
                  className={`h-5 w-5 rounded-md border flex items-center justify-center ${
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 flex-1">
                  <span className="inline-flex items-center justify-center rounded-md bg-green-100 text-green-700 text-xs font-semibold px-3 py-1">
                    {course.id}
                  </span>
                  <span className="text-sm text-slate-800 font-medium">
                    {course.fullname}
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
