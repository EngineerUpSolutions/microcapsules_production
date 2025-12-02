import React from "react";

export const CloseTab: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="66"
      height="52"
      viewBox="0 0 66 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter="url(#filter0_d_153_3750)">
        {/* BACKGROUND — UPDATED TO FIGMA GREEN #349A00 */}
        <rect x="5" y="3" width="56" height="42" rx="12" fill="#349A00" />

        {/* ARROWS */}
        <path
          d="M40.5885 32L34.0022 25.4137C33.8148 25.229 33.666 25.0089 33.5645 24.7662C33.463 24.5235 33.4107 24.2631 33.4107 24C33.4107 23.7369 33.463 23.4765 33.5645 23.2338C33.666 22.9911 33.8148 22.771 34.0022 22.5863L40.5885 16"
          stroke="white"
          strokeWidth="1.74545"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M32.5885 32L26.0022 25.4137C25.8152 25.2288 25.6668 25.0086 25.5655 24.766C25.4643 24.5233 25.4121 24.263 25.4121 24C25.4121 23.737 25.4643 23.4767 25.5655 23.234C25.6668 22.9914 25.8152 22.7712 26.0022 22.5863L32.5885 16"
          stroke="white"
          strokeWidth="1.74545"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_153_3750"
          x="0"
          y="0"
          width="66"
          height="52"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="2.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 
                    0 0 0 0 0 
                    0 0 0 0 0 
                    0 0 0 0.25 0"
          />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_153_3750" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_153_3750" result="shape" />
        </filter>
      </defs>
    </svg>
  );
};
