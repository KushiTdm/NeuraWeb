// frontend/src/stores/wizardStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WizardStep {
  step: number;
  data: any;
  isCompleted: boolean;
}

interface WizardStore {
  currentStep: number;
  steps: Record<number, WizardStep>;
  isSubmitted: boolean;
  
  // Actions
  setCurrentStep: (step: number) => void;
  updateStepData: (step: number, data: any) => void;
  markStepCompleted: (step: number) => void;
  resetWizard: () => void;
  setSubmitted: (submitted: boolean) => void;
  loadFromServer: (serverData: any[]) => void;
}

export const useWizardStore = create<WizardStore>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      steps: {},
      isSubmitted: false,

      setCurrentStep: (step: number) => {
        set({ currentStep: step });
      },

      updateStepData: (step: number, data: any) => {
        set((state) => ({
          steps: {
            ...state.steps,
            [step]: {
              step,
              data,
              isCompleted: false,
            },
          },
        }));
      },

      markStepCompleted: (step: number) => {
        set((state) => ({
          steps: {
            ...state.steps,
            [step]: {
              ...state.steps[step],
              isCompleted: true,
            },
          },
        }));
      },

      resetWizard: () => {
        set({
          currentStep: 1,
          steps: {},
          isSubmitted: false,
        });
      },

      setSubmitted: (submitted: boolean) => {
        set({ isSubmitted: submitted });
      },

      loadFromServer: (serverData: any[]) => {
        const steps: Record<number, WizardStep> = {};
        let maxStep = 1;
        let allSubmitted = true;

        serverData.forEach((response) => {
          steps[response.step] = {
            step: response.step,
            data: response.data,
            isCompleted: !response.isDraft,
          };
          maxStep = Math.max(maxStep, response.step);
          if (response.isDraft) {
            allSubmitted = false;
          }
        });

        set({
          steps,
          currentStep: allSubmitted ? maxStep : Math.min(maxStep + 1, 9),
          isSubmitted: allSubmitted,
        });
      },
    }),
    {
      name: 'wizard-storage',
      partialize: (state) => ({
        currentStep: state.currentStep,
        steps: state.steps,
        isSubmitted: state.isSubmitted,
      }),
    }
  )
);