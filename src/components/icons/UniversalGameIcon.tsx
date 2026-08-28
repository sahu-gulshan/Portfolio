import React from "react";

export function UniversalGameIcon({ className = "size-3.5", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Game Controller Body */}
      <path d="M6 12h4m-2-2v4" strokeWidth="2.2" />
      <path d="M6 6h12a5 5 0 0 1 4.9 6.2l-1.2 5.5A2.5 2.5 0 0 1 19.3 20H17a3 3 0 0 1-2.6-1.5L13.2 16h-2.4l-1.2 2.5A3 3 0 0 1 7 20H4.7a2.5 2.5 0 0 1-2.4-2.3L1.1 12.2A5 5 0 0 1 6 6z" />
      {/* Action buttons A & B */}
      <circle cx="17.5" cy="10.5" r="1" fill="currentColor" />
      <circle cx="15.5" cy="13.5" r="1" fill="currentColor" />
    </svg>
  );
}
