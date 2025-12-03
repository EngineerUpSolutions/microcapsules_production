import React from "react";

export const Copy: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="24" height="24" rx="6" fill="white" />
      <path
        d="M16.5 6.8145L12.6855 3H6.75C6.15326 3 5.58097 3.23705 5.15901 3.65901C4.73705 4.08097 4.5 4.65326 4.5 5.25V18H16.5V6.8145ZM6 16.5V5.25C6 5.05109 6.07902 4.86032 6.21967 4.71967C6.36032 4.57902 6.55109 4.5 6.75 4.5H12V7.5H15V16.5H6ZM19.5 9.75V21H8.25V19.5H18V8.25L19.5 9.75Z"
        fill="currentColor"   // <-- THIS ENABLES COLOR CHANGING
      />
    </svg>
  );
};
