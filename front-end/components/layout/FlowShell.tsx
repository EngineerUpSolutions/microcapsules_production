// components/layout/FlowShell.tsx
import React from "react";

type FlowShellProps = {
  currentStep: 1 | 2 | 3;
  userName: string;
  children: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
};

export function FlowShell({
  currentStep,
  userName,
  children,
  showBack = false,
  onBack,
}: FlowShellProps) {
  // Text under the title, depends on the step
  const description = () => {
    if (currentStep === 1) {
      return (
        <>
          Hola, <span className="font-semibold">{userName}</span> aquí podrás
          ver los cursos en los cuales estás enrolado y activos. Selecciona uno
          y haz clic en{" "}
          <span className="font-semibold">“Continuar”</span> para seguir al
          siguiente paso.
        </>
      );
    }

    if (currentStep === 2) {
      return (
        <>
          <span className="font-semibold">{userName}</span> aquí podrás
          ver los temas asociados al curso seleccionado. Elige un tema y haz
          clic en <span className="font-semibold">“Continuar”</span> para ver
          las microcápsulas.
        </>
      );
    }

    // currentStep === 3
    return (
      <>
        <span className="font-semibold">{userName}</span> aquí podrás ver
        las microcápsulas generadas para el tema seleccionado. Copia el
        contenido que necesites usando el botón de cada microcápsula.
      </>
    );
  };

return (
  <div
    className="
      h-screen overflow-hidden
      flex flex-col items-center
      justify-center px-4 pt-6 pb-0
      sm:justify-start sm:pt-[49px] sm:pb-0
    "
  >


      {/* Card */}
      <div
        className="
          w-full max-w-[720px] bg-white rounded-xl
          shadow-[0_2px_5px_0_#c1c1c1]
          px-4 pt-6 pb-4                  /* mobile */
          sm:px-[26px] sm:pt-8 sm:pb-[10px]  /* >= 640px: closer to Figma */
          relative
        "
      >
        {/* Header */}
        <h1 className="text-3xl font-bold text-sky-900 mb-2">
          Microcápsulas
        </h1>

        <p className="text-sm text-gray-600 mb-6">{description()}</p>

        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-8">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`h-2 rounded-full flex-1 transition-colors ${
                currentStep >= step ? "bg-green-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Content (steps) */}
        <div className="mb-10">{children}</div>

        {/* Footer inside card (back button) */}
        {showBack && onBack && (
          <button
            type="button"
            onClick={onBack}
            className="absolute left-8 bottom-8 w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center text-xl shadow-md"
          >
            «
          </button>
        )}
      </div>

      {/* Global footer */}
      <footer className="mt-10 mb-10 text-[11px] sm:text-xs text-slate-100/80">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          <span>Copyright © 2025</span>
          <span className="w-px h-4 bg-slate-100/50" />
          <span>LMS ZAJUNA</span>
          <span className="w-px h-4 bg-slate-100/50" />
          <span>Todos los derechos reservados</span>
        </div>
      </footer>




    </div>
  );
}
