"use client";

interface StatusBarProps {
  status: "submitted" | "processing" | "complete" | "success" | "failed";
  isMet?: boolean;
}

const steps = ['submitted', 'processing', 'complete', 'success', 'failed'];

interface StatusBarStepProps {
  step: (typeof steps)[number];
  index: number;
  currentStepIndex: number;
  isSuccessState: boolean;
}

function StepIcon({ step, isFailedStep, isCompleted }: { step: string; isFailedStep: boolean; isCompleted: boolean }) {
  if (isFailedStep) {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  }
  if (isCompleted) {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    );
  }
  return <span>{step}</span>;
}

function StatusBarStep({ step, index, currentStepIndex, isSuccessState }: StatusBarStepProps) {
  const isFailedStep = step === 'failed';
  const isCompleted = index < currentStepIndex || (currentStepIndex === index && isSuccessState);

  return (
    <>
      {/* Circle and label */}
      <div className="flex flex-col items-center">
        <div className={`
          w-8 h-8 rounded-full flex items-center justify-center mb-2
          transition-all duration-500 ease-in-out
          ${index <= currentStepIndex
            ? isFailedStep
              ? 'bg-red-500 text-white'
              : isCompleted
                ? 'bg-green-500 text-white'
                : 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-400'
          }
        `}>
          <StepIcon step={String(index + 1)} isFailedStep={isFailedStep} isCompleted={isCompleted} />
        </div>
        <span className={`
          text-sm font-medium capitalize
          transition-all duration-500 ease-in-out
          ${index <= currentStepIndex
            ? isFailedStep
              ? 'text-red-500'
              : isCompleted
                ? 'text-green-500'
                : 'text-blue-500'
            : 'text-gray-400'
          }
        `}>
          {step}
        </span>
      </div>
    </>
  );
}

export function StatusBar({ status, isMet }: StatusBarProps) {
  const currentStepIndex = status === 'complete' 
    ? isMet ? steps.indexOf('success') : steps.indexOf('failed')
    : steps.indexOf(status);

  const isFailureState = status === 'complete' && !isMet;
  const isSuccessState = status === 'complete' && isMet;

  const visibleSteps = steps.filter(step => 
    !(step === 'failed' && !isFailureState) && 
    !(step === 'success' && !isSuccessState)
  );

  return (
    <div className="mb-8">
      <div className="flex items-center">
        {visibleSteps.map((step, index) => (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <StatusBarStep
              step={step}
              index={steps.indexOf(step)}
              currentStepIndex={currentStepIndex}
              isSuccessState={isSuccessState}
            />
            {index < visibleSteps.length - 1 && (
              <div className={`
                h-0.5 flex-1 mx-4
                transition-all duration-500 ease-in-out
                ${steps.indexOf(step) < currentStepIndex
                  ? (isSuccessState && step === 'complete')
                    ? 'bg-red-500'
                    : 'bg-green-500'
                  : 'bg-gray-200'
                }
              `} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
