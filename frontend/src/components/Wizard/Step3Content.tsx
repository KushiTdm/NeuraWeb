// frontend/src/components/Wizard/Step3Content.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useLanguage } from '../../context/LanguageContext';

interface Step3Data {
  contentStrategy: string;
  existingContent: string;
  contentCreation: string;
  languages: string[];
  seoRequirements: string;
  contentManagement: string;
}

interface Step3Props {
  data: Step3Data;
  onNext: (data: Step3Data) => void;
  onSaveDraft: (data: Step3Data) => void;
  isSaving: boolean;
  isSubmitted: boolean;
}

const Step3Content: React.FC<Step3Props> = ({
  data,
  onNext,
  onSaveDraft,
  isSaving,
  isSubmitted,
}) => {
  const { t } = useLanguage();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<Step3Data>({
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

  const languageOptions = [
    { key: 'english', label: t('wizard.step3.languages.english') },
    { key: 'french', label: t('wizard.step3.languages.french') },
    { key: 'spanish', label: t('wizard.step3.languages.spanish') },
    { key: 'german', label: t('wizard.step3.languages.german') },
    { key: 'italian', label: t('wizard.step3.languages.italian') },
    { key: 'portuguese', label: t('wizard.step3.languages.portuguese') },
    { key: 'chinese', label: t('wizard.step3.languages.chinese') },
    { key: 'japanese', label: t('wizard.step3.languages.japanese') },
    { key: 'arabic', label: t('wizard.step3.languages.arabic') },
    { key: 'other', label: t('wizard.step3.languages.other') },
  ];

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div>
        <label htmlFor="contentStrategy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step3.content.strategy')} *
        </label>
        <textarea
          id="contentStrategy"
          rows={4}
          {...register('contentStrategy', { required: t('wizard.step3.error.content.strategy') })}
          className="input-field"
          placeholder={t('wizard.step3.content.strategy.placeholder')}
          disabled={isSubmitted}
        />
        {errors.contentStrategy && (
          <p className="mt-1 text-sm text-error-600">{errors.contentStrategy.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="existingContent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step3.existing.content')}
        </label>
        <textarea
          id="existingContent"
          rows={3}
          {...register('existingContent')}
          className="input-field"
          placeholder={t('wizard.step3.existing.content.placeholder')}
          disabled={isSubmitted}
        />
      </div>

      <div>
        <label htmlFor="contentCreation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step3.content.creation')} *
        </label>
        <select
          id="contentCreation"
          {...register('contentCreation', { required: t('wizard.step3.error.content.creation') })}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">{t('wizard.step3.content.creation.placeholder')}</option>
          <option value="client-provided">{t('wizard.step3.content.creation.client')}</option>
          <option value="collaborative">{t('wizard.step3.content.creation.collaborative')}</option>
          <option value="full-service">{t('wizard.step3.content.creation.fullservice')}</option>
          <option value="mixed">{t('wizard.step3.content.creation.mixed')}</option>
        </select>
        {errors.contentCreation && (
          <p className="mt-1 text-sm text-error-600">{errors.contentCreation.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          {t('wizard.step3.languages')} * ({t('wizard.step3.languages.select')})
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {languageOptions.map((language) => (
            <label key={language.key} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                value={language.label}
                {...register('languages', { required: t('wizard.step3.error.languages') })}
                className="form-checkbox h-5 w-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                disabled={isSubmitted}
              />
              <span className="text-gray-700 dark:text-gray-300">{language.label}</span>
            </label>
          ))}
        </div>
        {errors.languages && (
          <p className="mt-1 text-sm text-error-600">{errors.languages.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="seoRequirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step3.seo.requirements')}
        </label>
        <textarea
          id="seoRequirements"
          rows={3}
          {...register('seoRequirements')}
          className="input-field"
          placeholder={t('wizard.step3.seo.requirements.placeholder')}
          disabled={isSubmitted}
        />
      </div>

      <div>
        <label htmlFor="contentManagement" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step3.content.management')} *
        </label>
        <select
          id="contentManagement"
          {...register('contentManagement', { required: t('wizard.step3.error.content.management') })}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">{t('wizard.step3.content.management.placeholder')}</option>
          <option value="cms-easy">{t('wizard.step3.content.management.easy')}</option>
          <option value="cms-advanced">{t('wizard.step3.content.management.advanced')}</option>
          <option value="headless">{t('wizard.step3.content.management.headless')}</option>
          <option value="static">{t('wizard.step3.content.management.static')}</option>
          <option value="custom">{t('wizard.step3.content.management.custom')}</option>
          <option value="unsure">{t('wizard.step3.content.management.unsure')}</option>
        </select>
        {errors.contentManagement && (
          <p className="mt-1 text-sm text-error-600">{errors.contentManagement.message}</p>
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

export default Step3Content;