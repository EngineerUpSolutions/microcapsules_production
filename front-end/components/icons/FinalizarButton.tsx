// components/icons/FinalizarButton.tsx
import React from "react";

export const FinalizarButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
  return (
    <button
      {...props}
      onClick={() => window.close()}
      className={`
        rounded-[12px]
        bg-[#349A00]
        text-white
        font-semibold
        shadow-[0px_2px_5px_0px_rgba(0,0,0,0.25)]
        hover:scale-105 active:scale-95
        transition-all
        flex items-center justify-center
      `}
      style={{
        width: "91px",
        height: "42px",
        paddingTop: "10px",
        paddingBottom: "10px",
        paddingLeft: "16px",
        paddingRight: "16px",
        ...(props.style || {}),
      }}
    >
      <span
        className="
          text-[14px]
          font-[600]
          leading-[22px]
        "
      >
        Finalizar
      </span>
    </button>
  );
};
