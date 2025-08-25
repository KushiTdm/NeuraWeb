// frontend/src/components/Wizard/Step7Evolution.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useLanguage } from '../../context/LanguageContext';

interface Step7Data {
  futureFeatures: string[];
  scalabilityNeeds: string;
  maintenancePreference: string;
  updateFrequency: string;
  trainingNeeds: string;
  longTermVision: string;
}

interface Step7Props {
  data: Step7Data;
  onNext: (data: Step7Data) => void;
  onSaveDraft: (data: Step7Data) => void;
  isSaving: boolean;
  isSubmitted: boolean;
}

const Step7Evolution: React.FC<Step7Props> = ({
  data,
  onNext,
  onSaveDraft,
  isSaving,
  isSubmitted,
}) => {
  const { t } = useLanguage();
  const { register, handleSubmit, formState: { errors }, watch, getValues } = useForm<Step7Data>({
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

  const onSubmit = (formData: Step7Data) => {
    onNext(formData);
  };

  const futureFeatureOptions = [
    { key: 'wizard.step7.features.analytics', value: 'Advanced analytics and reporting' },
    { key: 'wizard.step7.features.ai', value: 'AI-powered features' },
    { key: 'wizard.step7.features.mobile', value: 'Mobile app development' },
    { key: 'wizard.step7.features.ecommerce', value: 'Advanced e-commerce features' },
    { key: 'wizard.step7.features.multilang', value: 'Multi-language expansion' },
    { key: 'wizard.step7.features.api', value: 'API integrations' },
    { key: 'wizard.step7.features.users', value: 'Advanced user management' },
    { key: 'wizard.step7.features.automation', value: 'Automation workflows' },
    { key: 'wizard.step7.features.seo', value: 'Advanced SEO features' },
    { key: 'wizard.step7.features.social', value: 'Social media integration' },
    { key: 'wizard.step7.features.security', value: 'Advanced security features' },
    { key: 'wizard.step7.features.performance', value: 'Performance optimization' },
    { key: 'wizard.step7.features.integrations', value: 'Custom integrations' },
    { key: 'wizard.step7.features.cms', value: 'Advanced content management' },
    { key: 'wizard.step7.features.marketing', value: 'Marketing automation' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          {t('wizard.step7.future.features')}
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {futureFeatureOptions.map((feature) => (
            <label key={feature.value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                value={feature.value}
                {...register('futureFeatures')}
                className="form-checkbox h-5 w-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                disabled={isSubmitted}
              />
              <span className="text-gray-700 dark:text-gray-300">{t(feature.key)}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="scalabilityNeeds" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step7.scalability.needs')} *
        </label>
        <select
          id="scalabilityNeeds"
          {...register('scalabilityNeeds', { required: t('wizard.step7.error.scalability.needs') })}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">{t('wizard.step7.scalability.needs.placeholder')}</option>
          <option value="minimal">{t('wizard.step7.scalability.minimal')}</option>
          <option value="moderate">{t('wizard.step7.scalability.moderate')}</option>
          <option value="high">{t('wizard.step7.scalability.high')}</option>
          <option value="enterprise">{t('wizard.step7.scalability.enterprise')}</option>
          <option value="global">{t('wizard.step7.scalability.global')}</option>
          <option value="unsure">{t('wizard.step7.scalability.unsure')}</option>
        </select>
        {errors.scalabilityNeeds && (
          <p className="mt-1 text-sm text-error-600">{errors.scalabilityNeeds.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="maintenancePreference" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step7.maintenance.preference')} *
        </label>
        <select
          id="maintenancePreference"
          {...register('maintenancePreference', { required: t('wizard.step7.error.maintenance.preference') })}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">{t('wizard.step7.maintenance.preference.placeholder')}</option>
          <option value="full-service">{t('wizard.step7.maintenance.full')}</option>
          <option value="partial">{t('wizard.step7.maintenance.partial')}</option>
          <option value="training">{t('wizard.step7.maintenance.training')}</option>
          <option value="self-managed">{t('wizard.step7.maintenance.self')}</option>
          <option value="as-needed">{t('wizard.step7.maintenance.asneeded')}</option>
          <option value="custom">{t('wizard.step7.maintenance.custom')}</option>
        </select>
        {errors.maintenancePreference && (
          <p className="mt-1 text-sm text-error-600">{errors.maintenancePreference.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="updateFrequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step7.update.frequency')} *
        </label>
        <select
          id="updateFrequency"
          {...register('updateFrequency', { required: t('wizard.step7.error.update.frequency') })}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">{t('wizard.step7.update.frequency.placeholder')}</option>
          <option value="daily">{t('wizard.step7.update.daily')}</option>
          <option value="weekly">{t('wizard.step7.update.weekly')}</option>
          <option value="monthly">{t('wizard.step7.update.monthly')}</option>
          <option value="quarterly">{t('wizard.step7.update.quarterly')}</option>
          <option value="rarely">{t('wizard.step7.update.rarely')}</option>
          <option value="seasonal">{t('wizard.step7.update.seasonal')}</option>
          <option value="as-needed">{t('wizard.step7.update.asneeded')}</option>
        </select>
        {errors.updateFrequency && (
          <p className="mt-1 text-sm text-error-600">{errors.updateFrequency.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="trainingNeeds" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step7.training.needs')}
        </label>
        <select
          id="trainingNeeds"
          {...register('trainingNeeds')}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">{t('wizard.step7.training.needs.placeholder')}</option>
          <option value="none">{t('wizard.step7.training.none')}</option>
          <option value="basic">{t('wizard.step7.training.basic')}</option>
          <option value="comprehensive">{t('wizard.step7.training.comprehensive')}</option>
          <option value="ongoing">{t('wizard.step7.training.ongoing')}</option>
          <option value="documentation">{t('wizard.step7.training.documentation')}</option>
          <option value="video-tutorials">{t('wizard.step7.training.video')}</option>
          <option value="live-sessions">{t('wizard.step7.training.live')}</option>
        </select>
      </div>

      <div>
        <label htmlFor="longTermVision" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step7.longterm.vision')}
        </label>
        <textarea
          id="longTermVision"
          rows={4}
          {...register('longTermVision')}
          className="input-field"
          placeholder={t('wizard.step7.longterm.vision.placeholder')}
          disabled={isSubmitted}
        />
      </div>

      {isSaving && (
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400" />
          <span>{t('wizard.step1.autosaving')}</span>
        </div>
      )}

      <form
        id="step7-form"
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: 'none' }}
      >
      </form>
    </div>
  );
};

export default Step7Evolution;