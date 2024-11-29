"use client";

import { StepOption } from "@/types/case";

interface SelectedOptionListProps {
  options: StepOption[];
}

function formatText(text: string): string {
  return text
    .replace(/≥/g, '≥')  // Replace encoded greater than or equal to
    .replace(/â‰¥/g, '≥')  // Replace malformed greater than or equal to
    .replace(/>/g, '>')  // Replace greater than
    .replace(/</g, '<'); // Replace less than
}

export function SelectedOptionList({ options }: SelectedOptionListProps) {
  if (options.length === 0) return null;

  return (
    <div className="space-y-2">
      {options.map((option) => (
        <div 
          key={option.key}
          className="p-2 rounded bg-green-50 border border-green-200 flex items-center gap-2"
        >
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="flex-1">
            {`(${option.key}) ${formatText(option.text)}`}
          </span>
        </div>
      ))}
    </div>
  );
}
