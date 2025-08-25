// frontend/src/components/Wizard/StepWizard.tsx
import React, { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { ChevronLeft, ChevronRight, Send, Save } from 'lucide-react';
import { useWizardStore } from '../../stores/wizardStore';
import { wizardApi } from '../../utils/api';

// Step Components
import Step1GeneralInfo from './Step1GeneralInfo';
import Step2Objectives from './Step2Objectives';
import Step3Content from './Step3Content';
import Step4Features from './Step4Features';
import Step5Design from './Step5Design';
import Step6Hosting from './Step6Hosting';
import Step7Evolution from './Step7Evolution';
import Step8Budget from './Step8Budget';
import Step9Other from './Step9Other';

const StepWizard: React.FC = () => {
  const {
    currentStep,
    steps,
    isSubmitted,
    setCurrentStep,
    updateStepData,
    markStepCompleted,
    setSubmitted,
  } = useWizardStore();

  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStepData, setCurrentStepData] = useState({});

  // Refs to store current form data for each step
  const stepDataRefs = useRef<Record<number, any>>({});

  const stepComponents = {
    1: Step1GeneralInfo,
    2: Step2Objectives,
    3: Step3Content,
    4: Step4Features,
    5: Step5Design,
    6: Step6Hosting,
    7: Step7Evolution,
    8: Step8Budget,
    9: Step9Other,
  };

  const stepTitles = {
    1: 'General Information',
    2: 'Project Objectives',
    3: 'Content & Structure',
    4: 'Features & Functionality',
    5: 'Design Preferences',
    6: 'Hosting & Technical',
    7: 'Future Evolution',
    8: 'Budget & Timeline',
    9: 'Additional Information',
  };

  const saveStep = async (step: number, data: any, isDraft = true) => {
    if (!data || Object.keys(data).length === 0) {
      return; // Don't save empty data
    }

    setIsSaving(true);
    try {
      await wizardApi.saveStep(step, data, isDraft);
      updateStepData(step, data);
      if (!isDraft) {
        markStepCompleted(step);
      }
      toast.success(isDraft ? 'Draft saved' : 'Step completed');
    } catch (error) {
      toast.error('Failed to save step');
      console.error('Save step error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getCurrentStepData = () => {
    return stepDataRefs.current[currentStep] || steps[currentStep]?.data || {};
  };

  const handleNext = async () => {
    const data = getCurrentStepData();
    if (data && Object.keys(data).length > 0) {
      await saveStep(currentStep, data, false);
      if (currentStep < 9) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      toast.error('Please fill in the required fields');
    }
  };

  const handlePrevious = async () => {
    const data = getCurrentStepData();
    if (data && Object.keys(data).length > 0) {
      await saveStep(currentStep, data, true);
    }
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = async () => {
    const data = getCurrentStepData();
    if (data && Object.keys(data).length > 0) {
      await saveStep(currentStep, data, true);
    } else {
      toast.error('No data to save');
    }
  };

  const handleSubmitWizard = async () => {
    const data = getCurrentStepData();
    setIsSubmitting(true);
    try {
      // Save final step
      if (data && Object.keys(data).length > 0) {
        await saveStep(currentStep, data, false);
      }
      
      // Submit entire wizard
      await wizardApi.submitWizard();
      
      setSubmitted(true);
      toast.success('Project brief submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit project brief');
      console.error('Submit wizard error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler to receive form data from step components
  const handleStepDataChange = (data: any) => {
    stepDataRefs.current[currentStep] = data;
    setCurrentStepData(data);
  };

  // Enhanced step component props
  const stepProps = {
    data: steps[currentStep]?.data || {},
    onNext: handleNext,
    onPrevious: handlePrevious,
    onSaveDraft: handleStepDataChange, // Changed to update data instead of saving
    onSubmit: handleSubmitWizard,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === 9,
    isSaving: isSaving,
    isSubmitting: isSubmitting,
    isSubmitted: isSubmitted,
  };

  const CurrentStepComponent = stepComponents[currentStep as keyof typeof stepComponents];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Step {currentStep} of 9
          </span>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {Math.round((currentStep / 9) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 9) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          {Array.from({ length: 9 }, (_, i) => i + 1).map((step) => (
            <button
              key={step}
              onClick={() => {
                // Save current step data before switching
                const data = getCurrentStepData();
                if (data && Object.keys(data).length > 0) {
                  saveStep(currentStep, data, true);
                }
                setCurrentStep(step);
              }}
              className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                step === currentStep
                  ? 'bg-primary-600 text-white'
                  : step < currentStep || steps[step]?.isCompleted
                  ? 'bg-success-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
              disabled={isSubmitted}
            >
              {step}
            </button>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="card mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {stepTitles[currentStep as keyof typeof stepTitles]}
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full" />
        </div>

        <CurrentStepComponent {...stepProps} />
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1 || isSaving || isSubmitted}
          className="flex items-center space-x-2 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={20} />
          <span>Previous</span>
        </button>

        <button
          onClick={handleSaveDraft}
          disabled={isSaving || isSubmitted}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
          ) : (
            <Save size={20} />
          )}
          <span>Save Draft</span>
        </button>

        {currentStep < 9 ? (
          <button
            onClick={handleNext}
            disabled={isSaving || isSubmitted}
            className="flex items-center space-x-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ChevronRight size={20} />
          </button>
        ) : (
          <button
            onClick={handleSubmitWizard}
            disabled={isSubmitting || isSubmitted}
            className="flex items-center space-x-2 bg-success-600 hover:bg-success-700 text-white px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <Send size={20} />
            )}
            <span>{isSubmitted ? 'Submitted' : 'Submit Project Brief'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default StepWizard;