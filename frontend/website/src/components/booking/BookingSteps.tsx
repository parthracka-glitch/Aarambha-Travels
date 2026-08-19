'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface BookingStepsProps {
  steps: string[];
  currentStep: number;
}

export default function BookingSteps({ steps, currentStep }: BookingStepsProps) {
  return (
    <div className="flex items-center justify-between w-full max-w-xl mx-auto mb-8 px-2">
      {steps.map((label, index) => {
        const stepNum = index + 1;
        const isCompleted = stepNum < currentStep;
        const isActive = stepNum === currentStep;

        return (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={`step-dot ${
                  isCompleted ? 'completed' : isActive ? 'active' : 'pending'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
              </div>
              <span
                className={`text-[9px] sm:text-[10px] font-medium text-center max-w-[65px] sm:max-w-none leading-tight ${
                  isActive ? 'text-[#C85227] font-bold' : isCompleted ? 'text-emerald-600 font-semibold' : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`step-line mx-1 sm:mx-2 flex-1 ${
                  stepNum < currentStep ? 'active' : 'pending'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
