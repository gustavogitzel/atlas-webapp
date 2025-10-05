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
  target?: string; // CSS selector for the element to highlight (optional for intro steps)
  position?: 'top' | 'bottom' | 'left' | 'right';
  showOverlay?: boolean; // Show dark overlay (default true)
  showSpotlight?: boolean; // Show spotlight effect (default true)
  requiresInteraction?: boolean; // Step requires user interaction to proceed
  interactionType?: 'click' | 'hover' | 'custom';
  interactionTarget?: string; // Selector for interaction element
  action?: () => void; // Optional action to perform when step is shown
  onNext?: () => void; // Optional action before going to next step
}

export interface GuidedTourProps {
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
  characterImage: string;
  onComplete?: () => void;
}

export const GuidedTour = ({
  steps,
  isOpen,
  onClose,
  characterImage,
  onComplete,
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
  }, [isOpen, step, currentStep]);

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


          {/* Character with speech - Always at bottom */}
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

          {/* Close button - Top right */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleSkip}
            className="fixed top-4 right-4 z-[10001] p-3 rounded-full bg-black/80 backdrop-blur-md border border-white/20 hover:bg-white/10 transition-colors text-white pointer-events-auto"
          >
            <X className="h-5 w-5" />
          </motion.button>

          {/* Step indicator - Top center */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center gap-2 bg-black/80 backdrop-blur-md border border-white/20 rounded-full px-4 py-2"
            style={{ 
              position: 'fixed',
              top: '1rem',
              left: '50vw',
              transform: 'translateX(-50%)',
              zIndex: 10001
            }}
          >
            {steps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  'h-2 rounded-full transition-all',
                  index === currentStep
                    ? 'w-8 bg-blue-500'
                    : index < currentStep
                    ? 'w-2 bg-blue-500/50'
                    : 'w-2 bg-gray-600'
                )}
              />
            ))}
            <span className="text-xs text-white ml-2">
              {currentStep + 1}/{steps.length}
            </span>
          </motion.div>

          {/* Navigation arrows - Fixed right side (hidden during required interaction) */}
          {!(step.requiresInteraction && !interactionCompleted) && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="fixed right-8 top-1/2 transform -translate-y-1/2 z-[10001] flex flex-col gap-4 pointer-events-auto"
            >
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

            {/* Next button */}
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
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};
