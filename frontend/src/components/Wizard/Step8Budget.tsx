// frontend/src/components/Wizard/Step8Budget.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useLanguage } from '../../context/LanguageContext';

interface Step8Data {
  budgetRange: string;
  budgetFlexibility: string;
  paymentPreference: string;
  timeline: string;
  priorityFeatures: string;
  budgetConcerns: string;
}

interface Step8Props {
  data: Step8Data;
  onNext: (data: Step8Data) => void;
  onSaveDraft: (data: Step8Data) => void;
  isSaving: boolean;
  isSubmitted: boolean;
}

const Step8Budget: React.FC<Step8Props> = ({
  data,
  onNext,
  onSaveDraft,
  isSaving,
  isSubmitted,
}) => {
  const { t } = useLanguage();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<Step8Data>({
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

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div>
        <label htmlFor="budgetRange" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step8.budget.range')} *
        </label>
        <select
          id="budgetRange"
          {...register('budgetRange', { required: t('wizard.step8.error.budget.range') })}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">{t('wizard.step8.budget.range.placeholder')}</option>
          <option value="under-5k">{t('wizard.step8.budget.under5k')}</option>
          <option value="5k-10k">{t('wizard.step8.budget.5k10k')}</option>
          <option value="10k-25k">{t('wizard.step8.budget.10k25k')}</option>
          <option value="25k-50k">{t('wizard.step8.budget.25k50k')}</option>
          <option value="50k-100k">{t('wizard.step8.budget.50k100k')}</option>
          <option value="over-100k">{t('wizard.step8.budget.over100k')}</option>
          <option value="discuss">{t('wizard.step8.budget.discuss')}</option>
        </select>
        {errors.budgetRange && (
          <p className="mt-1 text-sm text-error-600">{errors.budgetRange.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="budgetFlexibility" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step8.budget.flexibility')} *
        </label>
        <select
          id="budgetFlexibility"
          {...register('budgetFlexibility', { required: t('wizard.step8.error.budget.flexibility') })}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">{t('wizard.step8.budget.flexibility.placeholder')}</option>
          <option value="fixed">{t('wizard.step8.flexibility.fixed')}</option>
          <option value="some-flexibility">{t('wizard.step8.flexibility.some')}</option>
          <option value="flexible">{t('wizard.step8.flexibility.flexible')}</option>
          <option value="value-focused">{t('wizard.step8.flexibility.value')}</option>
          <option value="phased">{t('wizard.step8.flexibility.phased')}</option>
        </select>
        {errors.budgetFlexibility && (
          <p className="mt-1 text-sm text-error-600">{errors.budgetFlexibility.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="paymentPreference" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step8.payment.preference')} *
        </label>
        <select
          id="paymentPreference"
          {...register('paymentPreference', { required: t('wizard.step8.error.payment.preference') })}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">{t('wizard.step8.payment.preference.placeholder')}</option>
          <option value="milestone">{t('wizard.step8.payment.milestone')}</option>
          <option value="monthly">{t('wizard.step8.payment.monthly')}</option>
          <option value="50-50">{t('wizard.step8.payment.5050')}</option>
          <option value="third-payments">{t('wizard.step8.payment.thirds')}</option>
          <option value="completion">{t('wizard.step8.payment.completion')}</option>
          <option value="custom">{t('wizard.step8.payment.custom')}</option>
        </select>
        {errors.paymentPreference && (
          <p className="mt-1 text-sm text-error-600">{errors.paymentPreference.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step8.timeline')} *
        </label>
        <select
          id="timeline"
          {...register('timeline', { required: t('wizard.step8.error.timeline') })}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">{t('wizard.step8.timeline.placeholder')}</option>
          <option value="asap">{t('wizard.step8.timeline.asap')}</option>
          <option value="1-month">{t('wizard.step8.timeline.1month')}</option>
          <option value="2-3-months">{t('wizard.step8.timeline.2to3months')}</option>
          <option value="3-6-months">{t('wizard.step8.timeline.3to6months')}</option>
          <option value="6-12-months">{t('wizard.step8.timeline.6to12months')}</option>
          <option value="over-year">{t('wizard.step8.timeline.overyear')}</option>
          <option value="flexible">{t('wizard.step8.timeline.flexible')}</option>
        </select>
        {errors.timeline && (
          <p className="mt-1 text-sm text-error-600">{errors.timeline.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="priorityFeatures" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step8.priority.features')} *
        </label>
        <textarea
          id="priorityFeatures"
          rows={3}
          {...register('priorityFeatures', { required: t('wizard.step8.error.priority.features') })}
          className="input-field"
          placeholder={t('wizard.step8.priority.features.placeholder')}
          disabled={isSubmitted}
        />
        {errors.priorityFeatures && (
          <p className="mt-1 text-sm text-error-600">{errors.priorityFeatures.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="budgetConcerns" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step8.budget.concerns')}
        </label>
        <textarea
          id="budgetConcerns"
          rows={3}
          {...register('budgetConcerns')}
          className="input-field"
          placeholder={t('wizard.step8.budget.concerns.placeholder')}
          disabled={isSubmitted}
        />
      </div>

      {isSaving && (
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400" />
          <span>{t('common.auto.saving')}</span>
        </div>
      )}
    </form>
  );
};

export default Step8Budget;