"use client";

interface SelectedOptionProps {
  optionKey: string;
  optionText: string;
}

export function SelectedOption({ optionKey, optionText }: SelectedOptionProps) {
  return (
    <div className="bg-white border border-green-500 rounded p-3">
      <div className="flex items-center gap-2">
        <svg 
          className="w-5 h-5 text-green-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 13l4 4L19 7" 
          />
        </svg>
        {`(${optionKey}) ${optionText}`}
      </div>
    </div>
  );
}
