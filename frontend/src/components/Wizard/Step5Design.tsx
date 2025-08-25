// frontend/src/components/Wizard/Step5Design.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useLanguage } from '../../context/LanguageContext';

interface Step5Data {
  designStyle: string;
  colorPreferences: string;
  brandGuidelines: string;
  inspirationSites: string;
  logoRequirements: string;
  imageRequirements: string;
}

interface Step5Props {
  data: Step5Data;
  onNext: (data: Step5Data) => void;
  onSaveDraft: (data: Step5Data) => void;
  isSaving: boolean;
  isSubmitted: boolean;
}

const Step5Design: React.FC<Step5Props> = ({
  data,
  onNext,
  onSaveDraft,
  isSaving,
  isSubmitted,
}) => {
  const { t } = useLanguage();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<Step5Data>({
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
        <label htmlFor="designStyle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step5.design.style')} *
        </label>
        <select
          id="designStyle"
          {...register('designStyle', { required: t('wizard.step5.error.design.style') })}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">{t('wizard.step5.design.style.placeholder')}</option>
          <option value="modern-minimalist">{t('wizard.step5.design.style.modern')}</option>
          <option value="corporate-professional">{t('wizard.step5.design.style.corporate')}</option>
          <option value="creative-artistic">{t('wizard.step5.design.style.creative')}</option>
          <option value="bold-vibrant">{t('wizard.step5.design.style.bold')}</option>
          <option value="elegant-sophisticated">{t('wizard.step5.design.style.elegant')}</option>
          <option value="playful-fun">{t('wizard.step5.design.style.playful')}</option>
          <option value="industrial-tech">{t('wizard.step5.design.style.industrial')}</option>
          <option value="vintage-retro">{t('wizard.step5.design.style.vintage')}</option>
          <option value="clean-simple">{t('wizard.step5.design.style.clean')}</option>
          <option value="custom">{t('wizard.step5.design.style.custom')}</option>
        </select>
        {errors.designStyle && (
          <p className="mt-1 text-sm text-error-600">{errors.designStyle.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="colorPreferences" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step5.color.preferences')} *
        </label>
        <textarea
          id="colorPreferences"
          rows={3}
          {...register('colorPreferences', { required: t('wizard.step5.error.color.preferences') })}
          className="input-field"
          placeholder={t('wizard.step5.color.preferences.placeholder')}
          disabled={isSubmitted}
        />
        {errors.colorPreferences && (
          <p className="mt-1 text-sm text-error-600">{errors.colorPreferences.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="brandGuidelines" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step5.brand.guidelines')}
        </label>
        <textarea
          id="brandGuidelines"
          rows={3}
          {...register('brandGuidelines')}
          className="input-field"
          placeholder={t('wizard.step5.brand.guidelines.placeholder')}
          disabled={isSubmitted}
        />
      </div>

      <div>
        <label htmlFor="inspirationSites" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step5.inspiration.sites')}
        </label>
        <textarea
          id="inspirationSites"
          rows={3}
          {...register('inspirationSites')}
          className="input-field"
          placeholder={t('wizard.step5.inspiration.sites.placeholder')}
          disabled={isSubmitted}
        />
      </div>

      <div>
        <label htmlFor="logoRequirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step5.logo.requirements')}
        </label>
        <select
          id="logoRequirements"
          {...register('logoRequirements')}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">{t('wizard.step5.logo.requirements.placeholder')}</option>
          <option value="have-logo">{t('wizard.step5.logo.have')}</option>
          <option value="need-logo">{t('wizard.step5.logo.need')}</option>
          <option value="update-logo">{t('wizard.step5.logo.update')}</option>
          <option value="no-logo">{t('wizard.step5.logo.none')}</option>
        </select>
      </div>

      <div>
        <label htmlFor="imageRequirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step5.image.requirements')} *
        </label>
        <select
          id="imageRequirements"
          {...register('imageRequirements', { required: t('wizard.step5.error.image.requirements') })}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">{t('wizard.step5.image.requirements.placeholder')}</option>
          <option value="client-provides">{t('wizard.step5.image.client')}</option>
          <option value="stock-photos">{t('wizard.step5.image.stock')}</option>
          <option value="professional-photos">{t('wizard.step5.image.professional')}</option>
          <option value="mixed-approach">{t('wizard.step5.image.mixed')}</option>
          <option value="custom-graphics">{t('wizard.step5.image.custom')}</option>
          <option value="minimal-images">{t('wizard.step5.image.minimal')}</option>
        </select>
        {errors.imageRequirements && (
          <p className="mt-1 text-sm text-error-600">{errors.imageRequirements.message}</p>
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

export default Step5Design;