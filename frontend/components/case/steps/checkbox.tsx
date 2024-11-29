"use client";

interface CheckboxProps {
  checked: boolean;
}

export function Checkbox({ checked }: CheckboxProps) {
  return (
    <div className="flex-shrink-0 mt-0.5">
      <div className={`
        w-4 h-4 border rounded flex items-center justify-center
        ${checked 
          ? 'bg-green-500 border-green-500' 
          : 'border-gray-300'
        }
      `}>
        {checked && (
          <svg 
            className="w-3 h-3 text-white" 
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
        )}
      </div>
    </div>
  );
}
