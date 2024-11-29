"use client";

import { Step } from '@/types/case';
import { EvidenceList } from './evidence';
import { StepHeader } from './header';
import { SelectedOptionList } from './selected';
import { StepOptions } from './options';
import { StepReasoning } from './reasoning';

interface StepCardProps {
  step: Step;
}

export function StepCard({ step }: StepCardProps) {
  const selectedOptions = step.options.filter(opt => opt.selected);

  return (
    <div className="border rounded-lg p-4">
      <StepHeader stepKey={step.key} question={step.question} />
      
      <div className="space-y-4">
        <SelectedOptionList options={selectedOptions} />
        <StepOptions step={step} />

        {step.reasoning && step.decision && (
          <StepReasoning 
            decision={step.decision} 
            reasoning={step.reasoning} 
          />
        )}

        <EvidenceList evidence={step.evidence} />
      </div>
    </div>
  );
}
