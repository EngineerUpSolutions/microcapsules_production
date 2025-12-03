// components/layout/FlowShell.tsx
import React from "react";
import { CloseTab } from "../icons/CloseTab";
import { BackButtonStep2Step3 } from "../icons/BackButtonStep2Step3";

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

  return (
    <div
      className="
        h-screen overflow-hidden
        flex flex-col items-center
        justify-center sm:justify-start
        px-4 pb-0
        pt-24
        sm:pt-[49px]
        relative
      "
    >

      {/* Floating close-tab button */}
      <button
        onClick={() => window.close()}
        className="
          absolute top-[40px] left-[40px] z-50

          group
          flex items-center
          bg-[#349A00]
          text-white font-semibold
          rounded-xl

          px-3 py-2
          shadow-lg
          transition-all duration-300
          active:scale-95

          hover:px-5
        "
      >
        <CloseTab
          className="
            w-[32px] h-[32px]
            transition-transform duration-300
            group-hover:scale-125
          "
        />

        <span
          className="
            overflow-hidden
            max-w-0
            ml-3
            whitespace-nowrap
            font-semibold
            opacity-0
            transition-all duration-300

            group-hover:max-w-[200px]
            group-hover:opacity-100
          "
        >
          Volver a Zajuna
        </span>
      </button>

      {/* Main Card */}
      <div
        className="
          w-full max-w-[720px] bg-white rounded-xl
          shadow-[0_2px_5px_0_#c1c1c1]
          px-4 pt-6 pb-4
          sm:px-[26px] sm:pt-8 sm:pb-[10px]
          relative
        "
      >

        {/* ------- TITLE + DESCRIPTION (FIGMA PERFECT) ------- */}
        <div className="w-full px-[16px] flex flex-col gap-[16px] mb-6">

          {/* TITLE */}
          <h1
            className="
              font-[600]
              text-[28px]
              leading-[100%]
              text-[#002C4D]
            "
          >
            Microcápsulas
          </h1>

          {/* DESCRIPTION (dynamic per step) */}
          <p className="text-[16px] leading-[100%] text-[#5A5C5E]">
            {currentStep === 1 && (
              <>
                Hola, <span className="font-[600]">{userName}</span> aquí podrás ver
                los cursos en los cuales estás enrolado y activos. Selecciona uno y haz
                clic en <span className="font-[600]">“Continuar”</span> para seguir al
                siguiente paso.
              </>
            )}

            {currentStep === 2 && (
              <>
                <span className="font-[600]">{userName}</span> aquí podrás ver los
                temas asociados al curso seleccionado. Elige un tema y haz clic en{" "}
                <span className="font-[600]">“Continuar”</span> para ver las
                microcápsulas.
              </>
            )}

            {currentStep === 3 && (
              <>
                <span className="font-[600]">{userName}</span> aquí podrás ver las
                microcápsulas generadas para el tema seleccionado. Copia el contenido
                que necesites usando el botón de cada microcápsula.
              </>
            )}
          </p>

        </div>
        {/* ------- END TITLE + DESCRIPTION ------- */}

        {/* Progress bar */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`h-2 w-[190px] rounded-full transition-colors ${
                currentStep >= step ? "bg-green-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Content area */}
        <div className="mb-10">{children}</div>

        {/* Back button */}
        {showBack && onBack && (
          <button
            type="button"
            onClick={onBack}
            className="
              absolute left-8 bottom-8
              flex items-center justify-center
              transition-transform duration-200
              hover:scale-105 active:scale-95
              cursor-pointer
            "
            style={{
              background: "none",
              border: "none",
              padding: 0,
            }}
          >
            <BackButtonStep2Step3 />
          </button>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-10 mb-10 text-[11px] sm:text-xs text-slate-100/80">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          <span>COPYRIGHT © 2025</span>
          <span className="w-px h-4 bg-slate-100/50" />
          <span>LMS ZAJUNA</span>
          <span className="w-px h-4 bg-slate-100/50" />
          <span>Todos los derechos reservados</span>
        </div>
      </footer>
    </div>
  );
}
