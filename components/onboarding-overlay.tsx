'use client';

import { useEffect, useState } from 'react';
import type { OnboardingStep } from '@/hooks/use-onboarding';

type OnboardingOverlayProps = {
  currentStep: OnboardingStep;
  onNext: () => void;
  onSkip: () => void;
  spotlightRef?: HTMLElement | null;
};

type StepContent = {
  title: string;
  description: string;
  emoji: string;
  action?: string;
};

const STEP_CONTENT: Record<0 | 1 | 2 | 3, StepContent> = {
  0: {
    emoji: '👆',
    title: 'Add Your Players',
    description: 'Tap an empty slot to add your first player to the team',
    action: 'Tap any empty slot to continue',
  },
  1: {
    emoji: '✏️',
    title: 'Edit Players',
    description: 'Tap any player to edit their name or delete them. Use the 🗑️ button in the modal to remove players.',
  },
  2: {
    emoji: '👋',
    title: 'Reposition Players',
    description: 'Drag any player to move them to a new position on the pitch',
    action: 'Try dragging a player',
  },
  3: {
    emoji: '⚽',
    title: 'Build Both Teams',
    description: 'Create your perfect match! Build both Team A and Team B with your favorite players.',
  },
};

export function OnboardingOverlay({
  currentStep,
  onNext,
  onSkip,
  spotlightRef,
}: OnboardingOverlayProps) {
  const [spotlightPosition, setSpotlightPosition] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  // Calculate spotlight position based on ref
  useEffect(() => {
    if (spotlightRef) {
      const rect = spotlightRef.getBoundingClientRect();
      setSpotlightPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width + 20, // Add padding
        height: rect.height + 20,
      });
    } else {
      setSpotlightPosition(null);
    }
  }, [spotlightRef, currentStep]);

  if (currentStep === 4) return null;

  const content = STEP_CONTENT[currentStep as 0 | 1 | 2 | 3];
  const totalSteps = 4;
  const stepNumber = currentStep + 1;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark overlay with spotlight */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm">
        {spotlightPosition && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
          >
            <defs>
              <mask id="spotlight-mask">
                <rect width="100%" height="100%" fill="white" />
                <ellipse
                  cx={spotlightPosition.x}
                  cy={spotlightPosition.y}
                  rx={spotlightPosition.width / 2}
                  ry={spotlightPosition.height / 2}
                  fill="black"
                />
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="rgba(0, 0, 0, 0.8)"
              mask="url(#spotlight-mask)"
            />
          </svg>
        )}
      </div>

      {/* Tutorial content */}
      <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none" style={{ zIndex: 2 }}>
        <div className="w-full max-w-md pointer-events-auto">
          <div
            className="rounded-3xl border border-white/10 bg-[#02120c]/95 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-300"
          >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{content.emoji}</span>
                <div>
                  <h2 className="text-xl font-bold text-white">{content.title}</h2>
                  <p className="text-xs text-white/50">
                    Step {stepNumber} of {totalSteps}
                  </p>
                </div>
              </div>
              <button
                onClick={onSkip}
                className="text-white/60 hover:text-white text-sm transition"
                aria-label="Skip tutorial"
              >
                Skip
              </button>
            </div>

            {/* Description */}
            <p className="text-white/80 leading-relaxed mb-4">{content.description}</p>

            {/* Action hint */}
            {content.action && (
              <p className="text-sm text-amber-400/90 mb-4 italic">{content.action}</p>
            )}

            {/* Progress indicator */}
            <div className="flex gap-1.5 mb-4">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    i <= currentStep ? 'bg-amber-500' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              {currentStep === 3 ? (
                <button
                  onClick={onNext}
                  className="flex-1 rounded-2xl px-4 py-3 text-base font-semibold bg-amber-500 hover:bg-amber-600 text-stone-900 transition"
                >
                  Got it! 🎉
                </button>
              ) : (
                <>
                  <button
                    onClick={onSkip}
                    className="flex-1 rounded-2xl border border-white/25 px-4 py-3 text-base text-white hover:bg-white/5 transition"
                  >
                    Skip Tutorial
                  </button>
                  <button
                    onClick={onNext}
                    className="flex-1 rounded-2xl px-4 py-3 text-base font-semibold bg-amber-500 hover:bg-amber-600 text-stone-900 transition"
                  >
                    Next →
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
