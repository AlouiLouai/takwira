import { useState, useEffect, useCallback } from 'react';

const ONBOARDING_KEY = 'takwira_onboarding_completed';

export type OnboardingStep = 0 | 1 | 2 | 3 | 4; // 0-3 are active steps, 4 = completed

export function useOnboarding() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(0);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(true); // Start as true to prevent flash

  // Check localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const completed = localStorage.getItem(ONBOARDING_KEY);
      if (completed === 'true') {
        setIsOnboardingCompleted(true);
        setCurrentStep(4);
      } else {
        setIsOnboardingCompleted(false);
        setCurrentStep(0);
      }
    }
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev < 3) {
        return (prev + 1) as OnboardingStep;
      }
      // Reached end, mark as completed
      if (typeof window !== 'undefined') {
        localStorage.setItem(ONBOARDING_KEY, 'true');
      }
      setIsOnboardingCompleted(true);
      return 4;
    });
  }, []);

  const skipTutorial = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ONBOARDING_KEY, 'true');
    }
    setCurrentStep(4);
    setIsOnboardingCompleted(true);
  }, []);

  const resetTutorial = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ONBOARDING_KEY);
    }
    setCurrentStep(0);
    setIsOnboardingCompleted(false);
  }, []);

  return {
    currentStep,
    isOnboardingCompleted,
    nextStep,
    skipTutorial,
    resetTutorial,
  };
}
