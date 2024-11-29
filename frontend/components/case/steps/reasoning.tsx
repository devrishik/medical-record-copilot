"use client";

interface StepReasoningProps {
  decision: string;
  reasoning: string;
}

export function StepReasoning({ decision, reasoning }: StepReasoningProps) {
  if (!reasoning) return null;

  return (
    <div className="mb-6">
      <h4 className="text-lg font-medium text-gray-800 mb-3">
        Section {decision} has been selected because...
      </h4>
      <div className="space-y-4 text-gray-600">
        {reasoning.split('\n\n').map((paragraph, index) => (
          <p key={index} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
