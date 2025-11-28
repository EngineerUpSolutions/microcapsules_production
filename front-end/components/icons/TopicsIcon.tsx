// components/icons/CoursesIcon.tsx
import React from "react";

export function TopicsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    // <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    //   <path d="M0.666992 1.55539L1.55588 2.44428L3.33366 0.666504M0.666992 6.88873L1.55588 7.77762L3.33366 5.99984M0.666992 12.2221L1.55588 13.111L3.33366 11.3332M6.00033 1.55539H16.667M6.00033 6.88873H16.667M6.00033 12.2221H16.667" stroke="#002C4D" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    // </svg>
    <svg
      viewBox="0 0 18 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0.666992 1.55539L1.55588 2.44428L3.33366 0.666504M0.666992 6.88873L1.55588 7.77762L3.33366 5.99984M0.666992 12.2221L1.55588 13.111L3.33366 11.3332M6.00033 1.55539H16.667M6.00033 6.88873H16.667M6.00033 12.2221H16.667"
        stroke="#002C4D"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>

  );
}
