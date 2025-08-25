// frontend/src/components/Wizard/Step1GeneralInfo.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useLanguage } from '../../context/LanguageContext';

interface Step1Data {
  projectName: string;
  companyName: string;
  industry: string;
  projectType: string;
  description: string;
  targetAudience: string;
}

interface Step1Props {
  data: Step1Data;
  onNext: (data: Step1Data) => void;
  onSaveDraft: (data: Step1Data) => void;
  isFirstStep: boolean;
  isSaving: boolean;
  isSubmitted: boolean;
}

const Step1GeneralInfo: React.FC<Step1Props> = ({
  data,
  onNext,
  onSaveDraft,
  isSaving,
  isSubmitted,
}) => {
  const { t } = useLanguage();
  const { register, handleSubmit, formState: { errors }, watch, getValues } = useForm<Step1Data>({
    defaultValues: data,
  });

  const watchedData = watch();

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!isSubmitted) {
        onSaveDraft(getValues());
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(interval);
  }, [getValues, onSaveDraft, isSubmitted]);

  // Expose form data to parent component
  React.useEffect(() => {
    // This ensures parent component always has access to current form data
    const currentData = getValues();
    if (JSON.stringify(currentData) !== JSON.stringify(data)) {
      // Only update if data has changed to avoid unnecessary re-renders
      onSaveDraft(currentData);
    }
  }, [watchedData, getValues, data, onSaveDraft]);

  const onSubmit = (formData: Step1Data) => {
    onNext(formData);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('wizard.step1.project.name')} *
          </label>
          <input
            type="text"
            id="projectName"
            {...register('projectName', { required: t('wizard.step1.error.project.name') })}
            className="input-field"
            placeholder={t('wizard.step1.project.name.placeholder')}
            disabled={isSubmitted}
          />
          {errors.projectName && (
            <p className="mt-1 text-sm text-error-600">{errors.projectName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('wizard.step1.company.name')} *
          </label>
          <input
            type="text"
            id="companyName"
            {...register('companyName', { required: t('wizard.step1.error.company.name') })}
            className="input-field"
            placeholder={t('wizard.step1.company.name.placeholder')}
            disabled={isSubmitted}
          />
          {errors.companyName && (
            <p className="mt-1 text-sm text-error-600">{errors.companyName.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('wizard.step1.industry')} *
          </label>
          <select
            id="industry"
            {...register('industry', { required: t('wizard.step1.error.industry') })}
            className="input-field"
            disabled={isSubmitted}
          >
            <option value="">{t('wizard.step1.industry.placeholder')}</option>
            <option value="technology">{t('wizard.step1.industry.technology')}</option>
            <option value="healthcare">{t('wizard.step1.industry.healthcare')}</option>
            <option value="finance">{t('wizard.step1.industry.finance')}</option>
            <option value="education">{t('wizard.step1.industry.education')}</option>
            <option value="retail">{t('wizard.step1.industry.retail')}</option>
            <option value="manufacturing">{t('wizard.step1.industry.manufacturing')}</option>
            <option value="consulting">{t('wizard.step1.industry.consulting')}</option>
            <option value="nonprofit">{t('wizard.step1.industry.nonprofit')}</option>
            <option value="hospitality">{t('wizard.step1.industry.hospitality')}</option>
            <option value="real-estate">{t('wizard.step1.industry.realestate')}</option>
            <option value="other">{t('wizard.step1.industry.other')}</option>
          </select>
          {errors.industry && (
            <p className="mt-1 text-sm text-error-600">{errors.industry.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('wizard.step1.project.type')} *
          </label>
          <select
            id="projectType"
            {...register('projectType', { required: t('wizard.step1.error.project.type') })}
            className="input-field"
            disabled={isSubmitted}
          >
            <option value="">{t('wizard.step1.project.type.placeholder')}</option>
            <option value="new-website">{t('wizard.step1.project.type.new')}</option>
            <option value="website-redesign">{t('wizard.step1.project.type.redesign')}</option>
            <option value="web-application">{t('wizard.step1.project.type.webapp')}</option>
            <option value="e-commerce">{t('wizard.step1.project.type.ecommerce')}</option>
            <option value="mobile-app">{t('wizard.step1.project.type.mobile')}</option>
            <option value="automation">{t('wizard.step1.project.type.automation')}</option>
            <option value="ai-integration">{t('wizard.step1.project.type.ai')}</option>
            <option value="other">{t('wizard.step1.project.type.other')}</option>
          </select>
          {errors.projectType && (
            <p className="mt-1 text-sm text-error-600">{errors.projectType.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step1.description')} *
        </label>
        <textarea
          id="description"
          rows={4}
          {...register('description', { required: t('wizard.step1.error.description') })}
          className="input-field"
          placeholder={t('wizard.step1.description.placeholder')}
          disabled={isSubmitted}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-error-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step1.target.audience')} *
        </label>
        <textarea
          id="targetAudience"
          rows={3}
          {...register('targetAudience', { required: t('wizard.step1.error.target.audience') })}
          className="input-field"
          placeholder={t('wizard.step1.target.audience.placeholder')}
          disabled={isSubmitted}
        />
        {errors.targetAudience && (
          <p className="mt-1 text-sm text-error-600">{errors.targetAudience.message}</p>
        )}
      </div>

      {isSaving && (
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400" />
          <span>{t('wizard.step1.autosaving')}</span>
        </div>
      )}

      {/* Hidden form for validation - this will be triggered by parent component */}
      <form
        id="step1-form"
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: 'none' }}
      >
        {/* This form exists only for validation purposes */}
      </form>
    </div>
  );
};

export default Step1GeneralInfo;