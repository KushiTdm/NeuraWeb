// frontend/src/components/Wizard/Step9Other.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useLanguage } from '../../context/LanguageContext';

interface Step9Data {
  additionalRequirements: string;
  concerns: string;
  questions: string;
  communicationPreference: string;
  decisionMakers: string;
  additionalInfo: string;
}

interface Step9Props {
  data: Step9Data;
  onSubmit: (data: Step9Data) => void;
  onSaveDraft: (data: Step9Data) => void;
  isLastStep: boolean;
  isSaving: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;
}

const Step9Other: React.FC<Step9Props> = ({
  data,
  onSubmit,
  onSaveDraft,
  isSaving,
  isSubmitting,
  isSubmitted,
}) => {
  const { t } = useLanguage();
  const { register, handleSubmit, watch, getValues } = useForm<Step9Data>({
    defaultValues: data,
  });

  const watchedData = watch();

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!isSubmitted) {
        onSaveDraft(getValues());
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [getValues, onSaveDraft, isSubmitted]);

  React.useEffect(() => {
    const currentData = getValues();
    if (JSON.stringify(currentData) !== JSON.stringify(data)) {
      onSaveDraft(currentData);
    }
  }, [watchedData, getValues, data, onSaveDraft]);

  const onSubmitForm = (formData: Step9Data) => {
    onSubmit(formData);
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="additionalRequirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step9.additional.requirements')}
        </label>
        <textarea
          id="additionalRequirements"
          rows={4}
          {...register('additionalRequirements')}
          className="input-field"
          placeholder={t('wizard.step9.additional.requirements.placeholder')}
          disabled={isSubmitted}
        />
      </div>

      <div>
        <label htmlFor="concerns" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step9.concerns')}
        </label>
        <textarea
          id="concerns"
          rows={3}
          {...register('concerns')}
          className="input-field"
          placeholder={t('wizard.step9.concerns.placeholder')}
          disabled={isSubmitted}
        />
      </div>

      <div>
        <label htmlFor="questions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step9.questions')}
        </label>
        <textarea
          id="questions"
          rows={3}
          {...register('questions')}
          className="input-field"
          placeholder={t('wizard.step9.questions.placeholder')}
          disabled={isSubmitted}
        />
      </div>

      <div>
        <label htmlFor="communicationPreference" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step9.communication.preference')}
        </label>
        <select
          id="communicationPreference"
          {...register('communicationPreference')}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">{t('wizard.step9.communication.preference.placeholder')}</option>
          <option value="email">{t('wizard.step9.communication.email')}</option>
          <option value="phone">{t('wizard.step9.communication.phone')}</option>
          <option value="video">{t('wizard.step9.communication.video')}</option>
          <option value="slack">{t('wizard.step9.communication.slack')}</option>
          <option value="project-management">{t('wizard.step9.communication.project')}</option>
          <option value="mixed">{t('wizard.step9.communication.mixed')}</option>
        </select>
      </div>

      <div>
        <label htmlFor="decisionMakers" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step9.decision.makers')}
        </label>
        <textarea
          id="decisionMakers"
          rows={2}
          {...register('decisionMakers')}
          className="input-field"
          placeholder={t('wizard.step9.decision.makers.placeholder')}
          disabled={isSubmitted}
        />
      </div>

      <div>
        <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step9.additional.info')}
        </label>
        <textarea
          id="additionalInfo"
          rows={4}
          {...register('additionalInfo')}
          className="input-field"
          placeholder={t('wizard.step9.additional.info.placeholder')}
          disabled={isSubmitted}
        />
      </div>

      {!isSubmitted && (
        <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-200 mb-3">
            {t('wizard.step9.ready.title')}
          </h3>
          <p className="text-primary-700 dark:text-primary-300 mb-4">
            {t('wizard.step9.ready.description')}
          </p>
          <ul className="list-disc list-inside text-primary-700 dark:text-primary-300 space-y-1">
            <li>{t('wizard.step9.ready.proposal')}</li>
            <li>{t('wizard.step9.ready.pricing')}</li>
            <li>{t('wizard.step9.ready.nextsteps')}</li>
            <li>{t('wizard.step9.ready.answers')}</li>
          </ul>
        </div>
      )}

      {isSaving && (
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400" />
          <span>{t('wizard.step1.autosaving')}</span>
        </div>
      )}

      <form
        id="step9-form"
        onSubmit={handleSubmit(onSubmitForm)}
        style={{ display: 'none' }}
      >
      </form>
    </div>
  );
};

export default Step9Other;