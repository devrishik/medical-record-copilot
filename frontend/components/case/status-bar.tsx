"use client";

interface StatusBarProps {
  status: "submitted" | "processing" | "complete";
  isMet?: boolean;
}

export function StatusBar({ status, isMet }: StatusBarProps) {
  const steps = ['submitted', 'processing', 'complete', 'failed'] as const;
  const currentStepIndex = status === 'complete' 
    ? isMet === false ? steps.indexOf('failed') : steps.indexOf('complete')
    : steps.indexOf(status);

  const isFailureState = status === 'complete' && isMet === false;
  const isSuccessState = status === 'complete' && isMet === true;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => {
          if (step === 'failed' && !isFailureState) {
            return null;
          }

          const isLastStep = step === 'complete' && isSuccessState;
          const isFailedStep = step === 'failed';
          const isLastLine = index === steps.indexOf('complete') && isFailureState;

          return (
            <div key={step} className="flex flex-1 items-center">
              <div className="flex flex-col items-center flex-1">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center mb-2
                  ${index <= currentStepIndex
                    ? isFailedStep
                      ? 'bg-red-500 text-white'
                      : 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-400'
                  }
                `}>
                  {isFailedStep ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : isLastStep || (step === 'complete' && isSuccessState) ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`
                  text-sm font-medium capitalize
                  ${index <= currentStepIndex
                    ? isFailedStep
                      ? 'text-red-500'
                      : 'text-green-500'
                    : 'text-gray-400'
                  }
                `}>
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (!isFailedStep && !isLastStep) && (
                <div className={`
                  h-0.5 flex-1 mx-4
                  ${index < currentStepIndex
                    ? isLastLine
                      ? 'bg-red-500'
                      : 'bg-green-500'
                    : 'bg-gray-200'
                  }
                `} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
