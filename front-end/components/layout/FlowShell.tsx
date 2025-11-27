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
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {/* Card */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-10 relative">
        {/* Header */}
        <h1 className="text-3xl font-bold text-sky-900 mb-2">
          Microcápsulas
        </h1>


        <p className="text-sm text-gray-600 mb-6">
          Hola, <span className="font-semibold">{userName}</span> aquí
          podrás ver la descripción del funcionamiento de este módulo en el que
          podrás lograr x resultado.
        </p>






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

        {/* Footer inside card (back button + continue can live in step components) */}
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
      <footer className="mt-6 text-xs text-slate-100/80">
        <div className="flex items-center gap-4">
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
