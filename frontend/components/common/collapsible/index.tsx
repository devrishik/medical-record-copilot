"use client";

import { useState } from "react";

interface CollapsibleProps {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  buttonText?: string;
}

export function Collapsible({ 
  title, 
  children, 
  defaultOpen = true,
  buttonText = "evidence"
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div>
      <div>
        {title}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 mt-2"
        >
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
          {isOpen ? "Hide" : "Show"} {buttonText}
        </button>
      </div>
      {isOpen && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
}
