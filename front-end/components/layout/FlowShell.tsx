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
  onContinue?: () => void;
  onFinish?: () => void;
  canContinue?: boolean;
};

export function FlowShell({
  currentStep,
  userName,
  children,
  showBack = false,
  onBack,
  onContinue,
  onFinish,
  canContinue = true,
}: FlowShellProps) {
  return (
    <div
      className="
        h-full
        flex flex-col items-center
        px-4 pt-24 sm:pt-[49px]
        relative
        overflow-y-auto md:overflow-hidden
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
          flex flex-col flex-1 relative
          px-4 sm:px-8 pt-8
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
                los cursos en los cuales estás enrolado y activos.
              </>
            )}

            {currentStep === 2 && (
              <>
                <span className="font-[600]">{userName}</span>, selecciona un tema del curso.
              </>
            )}

            {currentStep === 3 && (
              <>
                <span className="font-[600]">{userName}</span> aquí podrás ver las microcápsulas generadas.
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

        {/* CONTENT AREA SCROLLABLE */}
        <div className="flex-1 overflow-y-auto px-4 pb-24">
          {children}
        </div>

        {/* ----- FIXED BOTTOM BUTTON BAR ----- */}
        <div
          className="
            w-full h-[70px] flex items-center justify-between
            px-6 absolute bottom-0 left-0 bg-white
          "
        >
          {/* BACK BUTTON (only steps 2 & 3) */}
          {showBack && onBack ? (
            <button onClick={onBack}>
              <BackButtonStep2Step3 />
            </button>
          ) : (
            <div />
          )}

          {/* RIGHT BUTTON: CONTINUAR OR FINALIZAR */}
          {(currentStep === 1 || currentStep === 2) && (
            <button
              onClick={canContinue ? onContinue : undefined}
              disabled={!canContinue}
              className={`
                px-6 py-2 rounded-xl shadow font-semibold transition-all
                ${
                  canContinue
                    ? "bg-[#349A00] text-white active:scale-95"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              Continuar
            </button>
          )}

          {/* FINALIZAR ON STEP 3 */}
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
