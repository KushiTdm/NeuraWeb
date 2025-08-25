// frontend/src/components/Wizard/Step4Features.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useLanguage } from '../../context/LanguageContext';

interface Step4Data {
  coreFeatures: string[];
  userAuthentication: string;
  paymentIntegration: string;
  thirdPartyIntegrations: string[];
  customFunctionality: string;
  mobileRequirements: string;
}

interface Step4Props {
  data: Step4Data;
  onNext: (data: Step4Data) => void;
  onSaveDraft: (data: Step4Data) => void;
  isSaving: boolean;
  isSubmitted: boolean;
}

const Step4Features: React.FC<Step4Props> = ({
  data,
  onNext,
  onSaveDraft,
  isSaving,
  isSubmitted,
}) => {
  const { t } = useLanguage();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<Step4Data>({
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

  const coreFeatureOptions = [
    { key: 'contact', label: t('wizard.step4.features.contact') },
    { key: 'newsletter', label: t('wizard.step4.features.newsletter') },
    { key: 'blog', label: t('wizard.step4.features.blog') },
    { key: 'gallery', label: t('wizard.step4.features.gallery') },
    { key: 'video', label: t('wizard.step4.features.video') },
    { key: 'social', label: t('wizard.step4.features.social') },
    { key: 'search', label: t('wizard.step4.features.search') },
    { key: 'profiles', label: t('wizard.step4.features.profiles') },
    { key: 'comments', label: t('wizard.step4.features.comments') },
    { key: 'reviews', label: t('wizard.step4.features.reviews') },
    { key: 'booking', label: t('wizard.step4.features.booking') },
    { key: 'ecommerce', label: t('wizard.step4.features.ecommerce') },
    { key: 'inventory', label: t('wizard.step4.features.inventory') },
    { key: 'analytics', label: t('wizard.step4.features.analytics') },
    { key: 'multilang', label: t('wizard.step4.features.multilang') },
  ];

  const integrationOptions = [
    { key: 'analytics', label: t('wizard.step4.integrations.analytics') },
    { key: 'maps', label: t('wizard.step4.integrations.maps') },
    { key: 'socialmedia', label: t('wizard.step4.integrations.socialmedia') },
    { key: 'email', label: t('wizard.step4.integrations.email') },
    { key: 'crm', label: t('wizard.step4.integrations.crm') },
    { key: 'payments', label: t('wizard.step4.integrations.payments') },
    { key: 'shipping', label: t('wizard.step4.integrations.shipping') },
    { key: 'accounting', label: t('wizard.step4.integrations.accounting') },
    { key: 'support', label: t('wizard.step4.integrations.support') },
    { key: 'marketing', label: t('wizard.step4.integrations.marketing') },
    { key: 'api', label: t('wizard.step4.integrations.api') },
    { key: 'other', label: t('wizard.step4.integrations.other') },
  ];

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          {t('wizard.step4.core.features')} * ({t('wizard.step4.core.features.select')})
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {coreFeatureOptions.map((feature) => (
            <label key={feature.key} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                value={feature.label}
                {...register('coreFeatures', { required: t('wizard.step4.error.core.features') })}
                className="form-checkbox h-5 w-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                disabled={isSubmitted}
              />
              <span className="text-gray-700 dark:text-gray-300">{feature.label}</span>
            </label>
          ))}
        </div>
        {errors.coreFeatures && (
          <p className="mt-1 text-sm text-error-600">{errors.coreFeatures.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="userAuthentication" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step4.user.auth')}
        </label>
        <select
          id="userAuthentication"
          {...register('userAuthentication')}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">{t('wizard.step4.user.auth.placeholder')}</option>
          <option value="none">{t('wizard.step4.user.auth.none')}</option>
          <option value="basic">{t('wizard.step4.user.auth.basic')}</option>
          <option value="social">{t('wizard.step4.user.auth.social')}</option>
          <option value="advanced">{t('wizard.step4.user.auth.advanced')}</option>
          <option value="sso">{t('wizard.step4.user.auth.sso')}</option>
          <option value="custom">{t('wizard.step4.user.auth.custom')}</option>
        </select>
      </div>

      <div>
        <label htmlFor="paymentIntegration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step4.payment')}
        </label>
        <select
          id="paymentIntegration"
          {...register('paymentIntegration')}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">{t('wizard.step4.payment.placeholder')}</option>
          <option value="none">{t('wizard.step4.payment.none')}</option>
          <option value="stripe">{t('wizard.step4.payment.stripe')}</option>
          <option value="paypal">{t('wizard.step4.payment.paypal')}</option>
          <option value="square">{t('wizard.step4.payment.square')}</option>
          <option value="multiple">{t('wizard.step4.payment.multiple')}</option>
          <option value="subscription">{t('wizard.step4.payment.subscription')}</option>
          <option value="custom">{t('wizard.step4.payment.custom')}</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          {t('wizard.step4.integrations')} ({t('wizard.step4.integrations.select')})
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {integrationOptions.map((integration) => (
            <label key={integration.key} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                value={integration.label}
                {...register('thirdPartyIntegrations')}
                className="form-checkbox h-5 w-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                disabled={isSubmitted}
              />
              <span className="text-gray-700 dark:text-gray-300">{integration.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="customFunctionality" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step4.custom.functionality')}
        </label>
        <textarea
          id="customFunctionality"
          rows={4}
          {...register('customFunctionality')}
          className="input-field"
          placeholder={t('wizard.step4.custom.functionality.placeholder')}
          disabled={isSubmitted}
        />
      </div>

      <div>
        <label htmlFor="mobileRequirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step4.mobile.requirements')} *
        </label>
        <select
          id="mobileRequirements"
          {...register('mobileRequirements', { required: t('wizard.step4.error.mobile.requirements') })}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">{t('wizard.step4.mobile.requirements.placeholder')}</option>
          <option value="responsive">{t('wizard.step4.mobile.responsive')}</option>
          <option value="mobile-first">{t('wizard.step4.mobile.first')}</option>
          <option value="pwa">{t('wizard.step4.mobile.pwa')}</option>
          <option value="native-app">{t('wizard.step4.mobile.native')}</option>
          <option value="hybrid-app">{t('wizard.step4.mobile.hybrid')}</option>
          <option value="desktop-only">{t('wizard.step4.mobile.desktop')}</option>
        </select>
        {errors.mobileRequirements && (
          <p className="mt-1 text-sm text-error-600">{errors.mobileRequirements.message}</p>
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

export default Step4Features;