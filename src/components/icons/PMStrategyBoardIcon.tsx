import React from "react";

export function PMStrategyBoardIcon({ className = "size-3.5", ...props }: React.SVGProps<SVGSVGElement>) {
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
      {/* Outer strategy board container */}
      <rect width="18" height="18" x="3" y="3" rx="3.5" />
      {/* Column divider */}
      <path d="M12 3v18" strokeDasharray="3 2" strokeWidth="1.5" />
      {/* Product Roadmap / Kanban milestone cards */}
      <rect width="5" height="4" x="5.5" y="6" rx="1" fill="currentColor" fillOpacity="0.25" />
      <rect width="5" height="6" x="5.5" y="12" rx="1" fill="currentColor" fillOpacity="0.25" />
      <rect width="5" height="7" x="13.5" y="6" rx="1" fill="currentColor" fillOpacity="0.25" />
      <rect width="5" height="3.5" x="13.5" y="14.5" rx="1" fill="currentColor" fillOpacity="0.25" />
      {/* Milestone growth indicator dot */}
      <circle cx="16" cy="9.5" r="0.75" fill="currentColor" />
    </svg>
  );
}
