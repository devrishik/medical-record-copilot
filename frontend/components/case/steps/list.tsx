"use client";

import { Step } from '@/types/case';
import { StepCard } from './card';

interface StepsListProps {
  steps: Step[];
}

export function StepsList({ steps }: StepsListProps) {
  return (
    <div className="space-y-8">
      {steps.map((step) => (
        <StepCard key={step.key} step={step} />
      ))}
    </div>
  );
}
