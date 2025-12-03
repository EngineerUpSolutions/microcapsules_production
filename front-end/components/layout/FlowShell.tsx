// components/layout/FlowShell.tsx
import React from "react";
import { CloseTab } from "../icons/CloseTab";
import { BackButtonStep2Step3 } from "../icons/BackButtonStep2Step3";
import { CopyToastContainer } from "../toasts/CopyToast";
import { FinalizarButton } from "../icons/FinalizarButton";

type FlowShellProps = {
  currentStep: 1 | 2 | 3;
  userName: string;
  children: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  onContinue?: () => void; // NEW
  onFinish?: () => void;   // NEW
};

export function FlowShell({
  currentStep,
  userName,
  children,
  showBack = false,
  onBack,
  onContinue,
  onFinish,
}: FlowShellProps) {
  return (
    <div
      className="
        h-screen flex flex-col items-center
        px-4 pt-24 sm:pt-[49px]
        relative
      "
    >
      {/* Floating close-tab button */}
      <button
        onClick={() => window.close()}
        className="
          absolute top-[40px] left-[40px] z-50
          group flex items-center
          bg-[#349A00] text-white font-semibold rounded-xl
          px-3 py-2 shadow-lg
          transition-all duration-300
          active:scale-95 hover:px-5
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
            overflow-hidden max-w-0 ml-3 whitespace-nowrap
            font-semibold opacity-0 transition-all duration-300
            group-hover:max-w-[200px] group-hover:opacity-100
          "
        >
          Volver a Zajuna
        </span>
      </button>

      {/* ----- MAIN CARD ----- */}
      <div
        className="
          w-full max-w-[720px] bg-white rounded-xl
          shadow-[0_2px_5px_0_#c1c1c1]
          flex flex-col
          flex-1
          relative
        "
      >
        {/* TITLE + DESCRIPTION */}
        <div className="w-full px-[16px] flex flex-col gap-[16px] mt-6">
          <h1 className="font-[600] text-[28px] leading-[100%] text-[#002C4D]">
            Microcápsulas
          </h1>

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
                <span className="font-[600]">“Continuar”</span>.
              </>
            )}

            {currentStep === 3 && (
              <>
                <span className="font-[600]">{userName}</span> aquí podrás ver las
                microcápsulas generadas. Copia el contenido que necesites usando el
                botón de cada microcápsula.
              </>
            )}
          </p>
        </div>

        {/* PROGRESS BAR */}
        <div className="flex items-center justify-center gap-4 mt-6 mb-4">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`h-2 w-[190px] rounded-full transition-colors ${
                currentStep >= step ? "bg-green-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto px-4 pb-24">
          {children}
        </div>

        {/* ----- BOTTOM BUTTON BAR (Figma aligned) ----- */}
        <div
          className="
            w-full h-[70px]
            flex items-center justify-between
            px-6
            absolute bottom-0 left-0
            bg-white
          "
        >
          {/* BACK BUTTON (only steps 2 & 3) */}
          {showBack && onBack ? (
            <button onClick={onBack}>
              <BackButtonStep2Step3 />
            </button>
          ) : (
            <div /> // Keeps spacing consistent
          )}

          {/* RIGHT BUTTON: Continuar or Finalizar */}
          {currentStep === 1 && onContinue && (
            <button
              onClick={onContinue}
              className="
                bg-[#349A00] text-white font-semibold
                px-6 py-2 rounded-xl shadow
                active:scale-95 transition
              "
            >
              Continuar
            </button>
          )}

          {currentStep === 2 && onContinue && (
            <button
              onClick={onContinue}
              className="
                bg-[#349A00] text-white font-semibold
                px-6 py-2 rounded-xl shadow
                active:scale-95 transition
              "
            >
              Continuar
            </button>
          )}

          {currentStep === 3 && onFinish && (
            <FinalizarButton onClick={onFinish} />
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="mt-6 mb-6 text-[11px] sm:text-xs text-slate-100/80">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          <span>COPYRIGHT © 2025</span>
          <span className="w-px h-4 bg-slate-100/50" />
          <span>LMS ZAJUNA</span>
          <span className="w-px h-4 bg-slate-100/50" />
          <span>Todos los derechos reservados</span>
        </div>
      </footer>

      {/* TOAST SYSTEM */}
      <CopyToastContainer />
    </div>
  );
}
