import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GuideCharacter } from '@molecules/GuideCharacter';
import { Spotlight } from '@atoms/Spotlight';

/**
 * GuidedTour Organism Component
 * Step-by-step guided experience with animated character
 */

export interface TourStep {
  id: string;
  title: string;
  description: string;
  audioUrl?: string; // Optional audio narration for the step
  target?: string; // CSS selector for the element to highlight (optional for intro steps)
  position?: 'top' | 'bottom' | 'left' | 'right';
  showOverlay?: boolean; // Show dark overlay (default true)
  showSpotlight?: boolean; // Show spotlight effect (default true)
  requiresInteraction?: boolean; // Step requires user interaction to proceed
  interactionType?: 'click' | 'hover' | 'custom';
  interactionTarget?: string; // Selector for interaction element
  action?: () => void; // Optional action to perform when step is shown
  onNext?: () => void; // Optional action before going to next step
  autoProgress?: boolean; // Automatically progress to next step after duration
  progressDuration?: number; // Duration in ms before auto-progressing (default 3000)
}

export interface GuidedTourProps {
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
  characterImage: string;
  onComplete?: () => void;
  onStepChange?: (stepIndex: number) => void;
}

export const GuidedTour = ({
  steps,
  isOpen,
  onClose,
  characterImage,
  onComplete,
  onStepChange,
}: GuidedTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [interactionCompleted, setInteractionCompleted] = useState(false);

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;
  
  const showOverlay = step.showOverlay !== false;

  // Execute action when step changes
  useEffect(() => {
    if (!isOpen || !step) return;

    if (step.action) {
      step.action();
    }
    
    // Notificar mudança de step
    onStepChange?.(currentStep);
  }, [isOpen, step, currentStep, onStepChange]);

  // Play audio narration when step changes
  useEffect(() => {
    if (!isOpen || !step?.audioUrl) return;

    const audio = new Audio(step.audioUrl);
    audio.play().catch(error => {
      console.warn('Failed to play audio:', error);
    });

    // Cleanup: stop audio when step changes or tour closes
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [isOpen, step?.audioUrl, currentStep]);

  useEffect(() => {
    if (!step.requiresInteraction || !step.interactionTarget) return;

    const handleInteraction = () => {
      setInteractionCompleted(true);
    };

    const element = document.querySelector(step.interactionTarget);
    if (element) {
      if (step.interactionType === 'click') {
        element.addEventListener('click', handleInteraction);
        return () => element.removeEventListener('click', handleInteraction);
      } else if (step.interactionType === 'hover') {
        element.addEventListener('mouseenter', handleInteraction);
        return () => element.removeEventListener('mouseenter', handleInteraction);
      }
    }
  }, [step, currentStep]);

  // Auto-progress timer
  useEffect(() => {
    if (!isOpen || !step.autoProgress) return;

    const duration = step.progressDuration || 3000;
    const timer = setTimeout(() => {
      handleNext();
    }, duration);

    return () => clearTimeout(timer);
  }, [isOpen, step, currentStep]);

  const handleNext = () => {
    // Check if interaction is required and not completed
    if (step.requiresInteraction && !interactionCompleted) {
      return;
    }

    // Execute onNext callback
    step.onNext?.();

    if (isLastStep) {
      onComplete?.();
      onClose();
    } else {
      setCurrentStep(prev => prev + 1);
      setInteractionCompleted(false); // Reset for next step
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    onClose();
    setCurrentStep(0);
  };

  if (!isOpen || !step) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Spotlight effect - when there's a target */}
          <AnimatePresence mode="sync">
            {step.target && step.target.length > 0 ? (
              <Spotlight
                key={`spotlight-${step.id}`}
                targetSelector={step.target}
                isActive={isOpen}
                spotlightRadius={100}
                overlayOpacity={showOverlay ? 0.85 : 0}
                transitionDuration={0.8}
              />
            ) : showOverlay ? (
              <motion.div
                key={`overlay-${step.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="fixed inset-0 z-[9998] bg-black/85 pointer-events-none"
              />
            ) : null}
          </AnimatePresence>

          {/* Character with speech - Always at bottom left */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed left-8 bottom-8 z-[10001] pointer-events-none"
          >
            <GuideCharacter
              imageUrl={characterImage}
              message={step.description}
              isActive
              showMessage
              avatarSize="lg"
            />
          </motion.div>

          {/* Navigation arrows - Bottom right (hidden during required interaction) */}
          {!(step.requiresInteraction && !interactionCompleted) && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="fixed bottom-8 right-8 z-[99999] pointer-events-auto"
            >
              <div className="flex flex-row gap-3">
            {/* Previous button */}
            <button
              onClick={handlePrev}
              disabled={isFirstStep}
              className={cn(
                'p-4 rounded-full backdrop-blur-md border transition-all',
                isFirstStep
                  ? 'bg-gray-800/50 border-gray-700 text-gray-600 cursor-not-allowed'
                  : 'bg-black/80 border-white/20 text-white hover:bg-white/10 hover:scale-110'
              )}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Next button or custom action button */}
            {isLastStep && step.id === 'next-story' ? (
              <button
                onClick={() => window.location.href = '/flood-globe'}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-lg border border-blue-400 text-white font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-500/50 flex items-center gap-2"
              >
                <span>View Flood Story</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            ) : isLastStep && step.id === 'credits' ? (
              <button
                onClick={() => window.location.href = '/credits'}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg border border-purple-400 text-white font-semibold transition-all hover:scale-105 shadow-lg shadow-purple-500/50 flex items-center gap-2"
              >
                <span>View Credits</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={step.requiresInteraction && !interactionCompleted}
                className={cn(
                  'p-4 rounded-full backdrop-blur-md border transition-all',
                  step.requiresInteraction && !interactionCompleted
                    ? 'bg-gray-800/50 border-gray-700 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-500 border-blue-400 text-white hover:bg-blue-600 hover:scale-110 shadow-lg shadow-blue-500/50'
                )}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}
              </div>
            </motion.div>
            )
          }

          {/* Close button and Step indicator - Left side */}
          <div className="fixed left-4 top-1/2 -translate-y-1/2 z-[99999] flex flex-col items-center gap-3">
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleSkip}
              className="p-2 rounded-full bg-black/80 backdrop-blur-md border border-white/20 hover:bg-white/10 transition-colors text-white pointer-events-auto"
            >
              <X className="h-4 w-4" />
            </motion.button>

          {/* Step indicator */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col items-center gap-1 bg-black/80 backdrop-blur-md border border-white/20 rounded-full px-1.5 py-2"
          >
            {steps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  'w-1.5 rounded-full transition-all',
                  index === currentStep
                    ? 'h-4 bg-blue-500'
                    : index < currentStep
                    ? 'h-1.5 bg-blue-500/50'
                    : 'h-1.5 bg-gray-600'
                )}
              />
            ))}
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
