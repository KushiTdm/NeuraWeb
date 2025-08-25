import React from 'react';
import { useForm } from 'react-hook-form';

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
    'SSL Certificate',
    'Regular security updates',
    'Malware scanning',
    'Firewall protection',
    'DDoS protection',
    'Two-factor authentication',
    'Regular security audits',
    'GDPR compliance',
    'PCI compliance',
    'Custom security measures',
  ];

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div>
        <label htmlFor="hostingPreference" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Hosting Preference *
        </label>
        <select
          id="hostingPreference"
          {...register('hostingPreference', { required: 'Hosting preference is required' })}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">Select hosting preference</option>
          <option value="managed-hosting">Fully managed hosting (we handle everything)</option>
          <option value="shared-hosting">Shared hosting (cost-effective)</option>
          <option value="vps-hosting">VPS hosting (more control and resources)</option>
          <option value="dedicated-server">Dedicated server (maximum performance)</option>
          <option value="cloud-hosting">Cloud hosting (AWS, Google Cloud, etc.)</option>
          <option value="existing-hosting">Use existing hosting</option>
          <option value="recommendations">Need recommendations</option>
        </select>
        {errors.hostingPreference && (
          <p className="mt-1 text-sm text-error-600">{errors.hostingPreference.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="domainRequirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Domain Requirements *
        </label>
        <select
          id="domainRequirements"
          {...register('domainRequirements', { required: 'Domain requirements are required' })}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">Select domain needs</option>
          <option value="have-domain">We already have a domain</option>
          <option value="need-domain">We need a new domain</option>
          <option value="transfer-domain">We need to transfer our domain</option>
          <option value="subdomain">We'll use a subdomain</option>
          <option value="multiple-domains">We need multiple domains</option>
          <option value="help-choosing">Need help choosing a domain</option>
        </select>
        {errors.domainRequirements && (
          <p className="mt-1 text-sm text-error-600">{errors.domainRequirements.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="performanceRequirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Performance Requirements *
        </label>
        <select
          id="performanceRequirements"
          {...register('performanceRequirements', { required: 'Performance requirements are required' })}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">Select performance needs</option>
          <option value="basic">Basic performance (small website, low traffic)</option>
          <option value="standard">Standard performance (medium traffic)</option>
          <option value="high">High performance (high traffic, fast loading)</option>
          <option value="enterprise">Enterprise level (maximum performance)</option>
          <option value="global">Global performance (CDN, multiple regions)</option>
          <option value="unsure">Not sure, need recommendations</option>
        </select>
        {errors.performanceRequirements && (
          <p className="mt-1 text-sm text-error-600">{errors.performanceRequirements.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Security Requirements (Select all that apply)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {securityOptions.map((security) => (
            <label key={security} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                value={security}
                {...register('securityRequirements')}
                className="form-checkbox h-5 w-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                disabled={isSubmitted}
              />
              <span className="text-gray-700 dark:text-gray-300">{security}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="backupRequirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Backup Requirements *
        </label>
        <select
          id="backupRequirements"
          {...register('backupRequirements', { required: 'Backup requirements are required' })}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">Select backup needs</option>
          <option value="daily">Daily automated backups</option>
          <option value="weekly">Weekly automated backups</option>
          <option value="monthly">Monthly automated backups</option>
          <option value="real-time">Real-time backups</option>
          <option value="manual">Manual backups only</option>
          <option value="no-backups">No backup requirements</option>
        </select>
        {errors.backupRequirements && (
          <p className="mt-1 text-sm text-error-600">{errors.backupRequirements.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="technicalSupport" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Technical Support Needs *
        </label>
        <select
          id="technicalSupport"
          {...register('technicalSupport', { required: 'Technical support needs are required' })}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">Select support level</option>
          <option value="basic">Basic support (email, business hours)</option>
          <option value="standard">Standard support (email/phone, extended hours)</option>
          <option value="priority">Priority support (24/7, faster response)</option>
          <option value="managed">Fully managed (we handle all technical issues)</option>
          <option value="self-managed">Self-managed (minimal support needed)</option>
          <option value="custom">Custom support arrangement</option>
        </select>
        {errors.technicalSupport && (
          <p className="mt-1 text-sm text-error-600">{errors.technicalSupport.message}</p>
        )}
      </div>

      {isSaving && (
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400" />
          <span>Auto-saving...</span>
        </div>
      )}
    </form>
  );
};

export default Step6Hosting;