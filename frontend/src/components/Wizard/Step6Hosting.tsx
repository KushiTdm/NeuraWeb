// frontend/src/components/Wizard/Step6Hosting.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useLanguage } from '../../context/LanguageContext';

interface Step6Data {
  hostingPreference: string;
  domainRequirements: string;
  performanceRequirements: string;
  securityRequirements: string[];
  backupRequirements: string;
  technicalSupport: string;
}

interface Step6Props {
  data: Step6Data;
  onNext: (data: Step6Data) => void;
  onSaveDraft: (data: Step6Data) => void;
  isSaving: boolean;
  isSubmitted: boolean;
}

const Step6Hosting: React.FC<Step6Props> = ({
  data,
  onNext,
  onSaveDraft,
  isSaving,
  isSubmitted,
}) => {
  const { t } = useLanguage();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<Step6Data>({
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

  const securityOptions = [
    { key: 'wizard.step6.security.ssl', value: 'SSL Certificate' },
    { key: 'wizard.step6.security.updates', value: 'Regular security updates' },
    { key: 'wizard.step6.security.malware', value: 'Malware scanning' },
    { key: 'wizard.step6.security.firewall', value: 'Firewall protection' },
    { key: 'wizard.step6.security.ddos', value: 'DDoS protection' },
    { key: 'wizard.step6.security.2fa', value: 'Two-factor authentication' },
    { key: 'wizard.step6.security.audits', value: 'Regular security audits' },
    { key: 'wizard.step6.security.gdpr', value: 'GDPR compliance' },
    { key: 'wizard.step6.security.pci', value: 'PCI compliance' },
    { key: 'wizard.step6.security.custom', value: 'Custom security measures' },
  ];

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div>
        <label htmlFor="hostingPreference" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step6.hosting.preference')} *
        </label>
        <select
          id="hostingPreference"
          {...register('hostingPreference', { required: t('wizard.step6.error.hosting.preference') })}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">{t('wizard.step6.hosting.preference.placeholder')}</option>
          <option value="managed-hosting">{t('wizard.step6.hosting.managed')}</option>
          <option value="shared-hosting">{t('wizard.step6.hosting.shared')}</option>
          <option value="vps-hosting">{t('wizard.step6.hosting.vps')}</option>
          <option value="dedicated-server">{t('wizard.step6.hosting.dedicated')}</option>
          <option value="cloud-hosting">{t('wizard.step6.hosting.cloud')}</option>
          <option value="existing-hosting">{t('wizard.step6.hosting.existing')}</option>
          <option value="recommendations">{t('wizard.step6.hosting.recommendations')}</option>
        </select>
        {errors.hostingPreference && (
          <p className="mt-1 text-sm text-error-600">{errors.hostingPreference.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="domainRequirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step6.domain.requirements')} *
        </label>
        <select
          id="domainRequirements"
          {...register('domainRequirements', { required: t('wizard.step6.error.domain.requirements') })}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">{t('wizard.step6.domain.requirements.placeholder')}</option>
          <option value="have-domain">{t('wizard.step6.domain.have')}</option>
          <option value="need-domain">{t('wizard.step6.domain.need')}</option>
          <option value="transfer-domain">{t('wizard.step6.domain.transfer')}</option>
          <option value="subdomain">{t('wizard.step6.domain.subdomain')}</option>
          <option value="multiple-domains">{t('wizard.step6.domain.multiple')}</option>
          <option value="help-choosing">{t('wizard.step6.domain.help')}</option>
        </select>
        {errors.domainRequirements && (
          <p className="mt-1 text-sm text-error-600">{errors.domainRequirements.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="performanceRequirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step6.performance.requirements')} *
        </label>
        <select
          id="performanceRequirements"
          {...register('performanceRequirements', { required: t('wizard.step6.error.performance.requirements') })}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">{t('wizard.step6.performance.requirements.placeholder')}</option>
          <option value="basic">{t('wizard.step6.performance.basic')}</option>
          <option value="standard">{t('wizard.step6.performance.standard')}</option>
          <option value="high">{t('wizard.step6.performance.high')}</option>
          <option value="enterprise">{t('wizard.step6.performance.enterprise')}</option>
          <option value="global">{t('wizard.step6.performance.global')}</option>
          <option value="unsure">{t('wizard.step6.performance.unsure')}</option>
        </select>
        {errors.performanceRequirements && (
          <p className="mt-1 text-sm text-error-600">{errors.performanceRequirements.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          {t('wizard.step6.security.requirements')}
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {securityOptions.map((security) => (
            <label key={security.value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                value={security.value}
                {...register('securityRequirements')}
                className="form-checkbox h-5 w-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                disabled={isSubmitted}
              />
              <span className="text-gray-700 dark:text-gray-300">{t(security.key)}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="backupRequirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step6.backup.requirements')} *
        </label>
        <select
          id="backupRequirements"
          {...register('backupRequirements', { required: t('wizard.step6.error.backup.requirements') })}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">{t('wizard.step6.backup.requirements.placeholder')}</option>
          <option value="daily">{t('wizard.step6.backup.daily')}</option>
          <option value="weekly">{t('wizard.step6.backup.weekly')}</option>
          <option value="monthly">{t('wizard.step6.backup.monthly')}</option>
          <option value="real-time">{t('wizard.step6.backup.realtime')}</option>
          <option value="manual">{t('wizard.step6.backup.manual')}</option>
          <option value="no-backups">{t('wizard.step6.backup.none')}</option>
        </select>
        {errors.backupRequirements && (
          <p className="mt-1 text-sm text-error-600">{errors.backupRequirements.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="technicalSupport" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('wizard.step6.support.needs')} *
        </label>
        <select
          id="technicalSupport"
          {...register('technicalSupport', { required: t('wizard.step6.error.support.needs') })}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">{t('wizard.step6.support.needs.placeholder')}</option>
          <option value="basic">{t('wizard.step6.support.basic')}</option>
          <option value="standard">{t('wizard.step6.support.standard')}</option>
          <option value="priority">{t('wizard.step6.support.priority')}</option>
          <option value="managed">{t('wizard.step6.support.managed')}</option>
          <option value="self-managed">{t('wizard.step6.support.self')}</option>
          <option value="custom">{t('wizard.step6.support.custom')}</option>
        </select>
        {errors.technicalSupport && (
          <p className="mt-1 text-sm text-error-600">{errors.technicalSupport.message}</p>
        )}
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

export default Step6Hosting;