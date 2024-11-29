"use client";

import { LogicRule } from "@/types/case";
import { Collapsible } from "@/components/common/collapsible";
import { Checkbox } from "./checkbox";

interface LogicRulesProps {
  rules: LogicRule[];
}

export function LogicRules({ rules }: LogicRulesProps) {
  if (!rules || rules.length === 0) return null;

  return (
    <Collapsible
      title=""
      defaultOpen={false}
      buttonText="logic rules"
    >
      <div className="space-y-2">
        {rules.map((rule, index) => (
          <div
            key={index}
            className={`p-2 rounded flex items-start gap-3 ${
              rule.selected
                ? "bg-green-50 border border-green-200"
                : "bg-gray-50 border border-gray-200"
            }`}
          >
            <Checkbox checked={rule.selected} />
            <span className="flex-1">{rule.text}</span>
          </div>
        ))}
      </div>
    </Collapsible>
  );
}
