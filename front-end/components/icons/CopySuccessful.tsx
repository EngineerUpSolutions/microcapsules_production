import React from "react";

export const CopySuccessful: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}   // permite className, width, height, etc
    >
      <rect width="28" height="28" rx="7" fill="#00AA00" />
      <path
        d="M7.46582 15.8662L10.7325 19.1329L20.5325 8.86621"
        stroke="white"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
