import React from "react";
import { CloseTab } from "./CloseTab";

type Props = {
  onClick: () => void;
};

export function CloseTabButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="
        group
        flex items-center gap-3
        absolute top-[40px] left-[40px]
        z-50
        bg-[#349A00]
        text-white
        rounded-[12px]
        px-4 py-2
        transition-all duration-300
        hover:pl-6 hover:pr-6
        shadow-md
      "
    >
      {/* ICONO SVG */}
      <div className="transition-transform duration-300 group-hover:scale-125">
        <CloseTab width={24} height={24} />
      </div>

      {/* TEXTO (solo aparece en hover) */}
      <span
        className="
          opacity-0 
          translate-x-[-10px]
          group-hover:opacity-100
          group-hover:translate-x-0
          transition-all duration-300
          whitespace-nowrap
          font-semibold
        "
      >
        Volver a Zajuna
      </span>
    </button>
  );
}
