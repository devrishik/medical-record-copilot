"use client";

interface StepHeaderProps {
  stepKey: string;
  question: string;
}

export function StepHeader({ stepKey, question }: StepHeaderProps) {
  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-gray-600">Step:</span>
        <div className="flex items-center">
          {stepKey.split('').map((num, index, array) => (
            <div key={index} className="flex items-center">
              <span className="font-medium">{num}</span>
              {index < array.length - 1 && (
                <span className="mx-1">→</span>
              )}
            </div>
          ))}
        </div>
      </div>
      <h3 className="font-bold mb-2">{question}</h3>
    </>
  );
}
