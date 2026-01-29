"use client";

interface CheckIconProps {
  className?: string;
}

export function CheckIcon({ className = "" }: CheckIconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      aria-hidden
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
