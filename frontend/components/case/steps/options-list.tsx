"use client";

import { StepOption } from "@/types/case";
import { Collapsible } from "@/components/common/collapsible";
import { Checkbox } from "./checkbox";

interface OptionsListProps {
  options: StepOption[];
}

function formatText(text: string): string {
  return text
    .replace(/≥/g, '≥')  // Replace encoded greater than or equal to
    .replace(/â‰¥/g, '≥')  // Replace malformed greater than or equal to
    .replace(/>/g, '>')  // Replace greater than
    .replace(/</g, '<'); // Replace less than
}

export function OptionsList({ options }: OptionsListProps) {
  return (
    <Collapsible
      title=""
      defaultOpen={false}
      buttonText="all options"
    >
      <div className="space-y-2">
        {options.map((option) => (
          <div
            key={option.key}
            className={`p-2 rounded flex items-start gap-3 ${
              option.selected
                ? "bg-green-50 border border-green-200"
                : "bg-gray-50 border border-gray-200"
            }`}
          >
            <Checkbox checked={option.selected} />
            <span className="flex-1">
              {`(${option.key}) ${formatText(option.text)}`}
            </span>
          </div>
        ))}
      </div>
    </Collapsible>
  );
}
