// frontend/src/components/Wizard/Step2Objectives.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useLanguage } from '../../context/LanguageContext';

interface Step2Data {
  primaryGoals: string[];
  successMetrics: string;
  currentChallenges: string;
  competitorAnalysis: string;
  uniqueValue: string;
}

interface Step2Props {
  data: Step2Data;
  onNext: (data: Step2Data) => void;
  onSaveDraft: (data: Step2Data) => void;
  isSaving: boolean;
  isSubmitted: boolean;
}

const Step2Objectives: React.FC<Step2Props> = ({
  data,
  onNext,
  onSaveDraft,
  isSaving,
  isSubmitted,
}) => {
  const { t } = useLanguage();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<Step2Data>({
    defaultValues: data,
  });

  const watchedData = watch();

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!isSubmitted) {
        onSaveDraft(watchedData);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [watchedData, onSaveDraft, isSubmitted]);

  const goalOptions = [
    { key: 'brand', label: t('wizard.step2.goals.brand') },
    { key: 'leads', label: t('wizard.step2.goals.leads') },
    { key: 'sales', label: t('wizard.step2.goals.sales') },
    { key: 'engagement', label: t('wizard.step2.goals.engagement') },
    { key: 'processes', label: t('wizard.step2.goals.processes') },
    { key: 'ux', label: t('wizard.step2.goals.ux') },
    { key: 'reach', label: t('wizard.step2.goals.reach') },
    { key: 'costs', label: t('wizard.step2.goals.costs') },
    { key: 'data', label: t('wizard.step2.goals.data') },
    { key: 'workflows', label: t('wizard.step2.goals.workflows') },
  ];

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          {t('wizard.step2.primary.goals')} * ({t('wizard.step2.primary.goals.select')})
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {goalOptions.map((goal) => (
            <label key={goal.key} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                value={goal.label}
                {...register('primaryGoals', { required: t('wizard.step2.error.goals') })}
                className="form-checkbox h-5 w-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                disabled={isSubmitted}
              />
              <span className="text-gray-700 dark:text-gray-300">{goal.label}</span>
            </label>
          ))}
        </div>
        {errors.primaryGoals && (
          <p className="mt-1 text-sm text-error-600">{errors.primaryGoals.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="successMetrics" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step2.success.metrics')} *
        </label>
        <textarea
          id="successMetrics"
          rows={3}
          {...register('successMetrics', { required: t('wizard.step2.error.success.metrics') })}
          className="input-field"
          placeholder={t('wizard.step2.success.metrics.placeholder')}
          disabled={isSubmitted}
        />
        {errors.successMetrics && (
          <p className="mt-1 text-sm text-error-600">{errors.successMetrics.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="currentChallenges" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step2.challenges')} *
        </label>
        <textarea
          id="currentChallenges"
          rows={3}
          {...register('currentChallenges', { required: t('wizard.step2.error.challenges') })}
          className="input-field"
          placeholder={t('wizard.step2.challenges.placeholder')}
          disabled={isSubmitted}
        />
        {errors.currentChallenges && (
          <p className="mt-1 text-sm text-error-600">{errors.currentChallenges.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="competitorAnalysis" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step2.competitors')}
        </label>
        <textarea
          id="competitorAnalysis"
          rows={3}
          {...register('competitorAnalysis')}
          className="input-field"
          placeholder={t('wizard.step2.competitors.placeholder')}
          disabled={isSubmitted}
        />
      </div>

      <div>
        <label htmlFor="uniqueValue" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step2.unique.value')} *
        </label>
        <textarea
          id="uniqueValue"
          rows={3}
          {...register('uniqueValue', { required: t('wizard.step2.error.unique.value') })}
          className="input-field"
          placeholder={t('wizard.step2.unique.value.placeholder')}
          disabled={isSubmitted}
        />
        {errors.uniqueValue && (
          <p className="mt-1 text-sm text-error-600">{errors.uniqueValue.message}</p>
        )}
      </div>

      {isSaving && (
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400" />
          <span>{t('wizard.step1.autosaving')}</span>
        </div>
      )}
    </form>
  );
};

export default Step2Objectives;