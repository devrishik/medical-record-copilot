"use client";

import { Step } from '@/types/case';
import { OptionsList } from './options-list';
import { LogicRules } from './logic';

interface StepOptionsProps {
  step: Step;
}

export function StepOptions({ step }: StepOptionsProps) {
  return (
    <div className="space-y-2">
      <OptionsList options={step.options} />
      {step.logic && step.logic.length > 0 && (
        <LogicRules rules={step.logic} />
      )}
    </div>
  );
}
