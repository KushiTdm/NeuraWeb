import React from 'react';
import { useForm } from 'react-hook-form';

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
    'Contact forms',
    'Newsletter signup',
    'Blog/News section',
    'Photo gallery',
    'Video integration',
    'Social media integration',
    'Search functionality',
    'User profiles',
    'Comments system',
    'Rating/Review system',
    'Booking/Appointment system',
    'E-commerce functionality',
    'Inventory management',
    'Analytics dashboard',
    'Multi-language support',
  ];

  const integrationOptions = [
    'Google Analytics',
    'Google Maps',
    'Social media platforms',
    'Email marketing tools',
    'CRM systems',
    'Payment gateways',
    'Shipping providers',
    'Accounting software',
    'Customer support tools',
    'Marketing automation',
    'API integrations',
    'Other',
  ];

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Core Features * (Select all that apply)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {coreFeatureOptions.map((feature) => (
            <label key={feature} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                value={feature}
                {...register('coreFeatures', { required: 'Please select at least one feature' })}
                className="form-checkbox h-5 w-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                disabled={isSubmitted}
              />
              <span className="text-gray-700 dark:text-gray-300">{feature}</span>
            </label>
          ))}
        </div>
        {errors.coreFeatures && (
          <p className="mt-1 text-sm text-error-600">{errors.coreFeatures.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="userAuthentication" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          User Authentication Requirements
        </label>
        <select
          id="userAuthentication"
          {...register('userAuthentication')}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">Select authentication needs</option>
          <option value="none">No user authentication needed</option>
          <option value="basic">Basic login/registration</option>
          <option value="social">Social media login (Google, Facebook, etc.)</option>
          <option value="advanced">Advanced user management with roles</option>
          <option value="sso">Single Sign-On (SSO)</option>
          <option value="custom">Custom authentication solution</option>
        </select>
      </div>

      <div>
        <label htmlFor="paymentIntegration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Payment Integration
        </label>
        <select
          id="paymentIntegration"
          {...register('paymentIntegration')}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">Select payment needs</option>
          <option value="none">No payment processing needed</option>
          <option value="stripe">Stripe</option>
          <option value="paypal">PayPal</option>
          <option value="square">Square</option>
          <option value="multiple">Multiple payment gateways</option>
          <option value="subscription">Subscription/recurring payments</option>
          <option value="custom">Custom payment solution</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Third-party Integrations (Select all that apply)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {integrationOptions.map((integration) => (
            <label key={integration} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                value={integration}
                {...register('thirdPartyIntegrations')}
                className="form-checkbox h-5 w-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                disabled={isSubmitted}
              />
              <span className="text-gray-700 dark:text-gray-300">{integration}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="customFunctionality" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Custom Functionality
        </label>
        <textarea
          id="customFunctionality"
          rows={4}
          {...register('customFunctionality')}
          className="input-field"
          placeholder="Describe any custom functionality or unique features you need that weren't listed above..."
          disabled={isSubmitted}
        />
      </div>

      <div>
        <label htmlFor="mobileRequirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Mobile Requirements *
        </label>
        <select
          id="mobileRequirements"
          {...register('mobileRequirements', { required: 'Mobile requirements are required' })}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">Select mobile approach</option>
          <option value="responsive">Responsive web design (works on all devices)</option>
          <option value="mobile-first">Mobile-first design approach</option>
          <option value="pwa">Progressive Web App (PWA)</option>
          <option value="native-app">Native mobile app (iOS/Android)</option>
          <option value="hybrid-app">Hybrid mobile app</option>
          <option value="desktop-only">Desktop only (no mobile optimization)</option>
        </select>
        {errors.mobileRequirements && (
          <p className="mt-1 text-sm text-error-600">{errors.mobileRequirements.message}</p>
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

export default Step4Features;