import React from 'react';
import { useForm } from 'react-hook-form';

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
  const { register, handleSubmit, formState: { errors }, watch } = useForm<Step7Data>({
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

  const futureFeatureOptions = [
    'Advanced analytics and reporting',
    'AI-powered features',
    'Mobile app development',
    'Advanced e-commerce features',
    'Multi-language expansion',
    'API integrations',
    'Advanced user management',
    'Automation workflows',
    'Advanced SEO features',
    'Social media integration',
    'Advanced security features',
    'Performance optimization',
    'Custom integrations',
    'Advanced content management',
    'Marketing automation',
  ];

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Future Features (Select features you might want to add later)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {futureFeatureOptions.map((feature) => (
            <label key={feature} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                value={feature}
                {...register('futureFeatures')}
                className="form-checkbox h-5 w-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                disabled={isSubmitted}
              />
              <span className="text-gray-700 dark:text-gray-300">{feature}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="scalabilityNeeds" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Scalability Requirements *
        </label>
        <select
          id="scalabilityNeeds"
          {...register('scalabilityNeeds', { required: 'Scalability needs are required' })}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">Select scalability needs</option>
          <option value="minimal">Minimal growth expected</option>
          <option value="moderate">Moderate growth expected</option>
          <option value="high">High growth expected</option>
          <option value="enterprise">Enterprise-level scalability needed</option>
          <option value="global">Global expansion planned</option>
          <option value="unsure">Unsure about future growth</option>
        </select>
        {errors.scalabilityNeeds && (
          <p className="mt-1 text-sm text-error-600">{errors.scalabilityNeeds.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="maintenancePreference" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Maintenance Preference *
        </label>
        <select
          id="maintenancePreference"
          {...register('maintenancePreference', { required: 'Maintenance preference is required' })}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">Select maintenance approach</option>
          <option value="full-service">Full-service maintenance (we handle everything)</option>
          <option value="partial">Partial maintenance (we handle technical, you handle content)</option>
          <option value="training">Training-based (we train your team)</option>
          <option value="self-managed">Self-managed (minimal ongoing support)</option>
          <option value="as-needed">As-needed support (pay per request)</option>
          <option value="custom">Custom maintenance plan</option>
        </select>
        {errors.maintenancePreference && (
          <p className="mt-1 text-sm text-error-600">{errors.maintenancePreference.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="updateFrequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Expected Update Frequency *
        </label>
        <select
          id="updateFrequency"
          {...register('updateFrequency', { required: 'Update frequency is required' })}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">Select update frequency</option>
          <option value="daily">Daily updates</option>
          <option value="weekly">Weekly updates</option>
          <option value="monthly">Monthly updates</option>
          <option value="quarterly">Quarterly updates</option>
          <option value="rarely">Rarely (static content)</option>
          <option value="seasonal">Seasonal updates</option>
          <option value="as-needed">As needed</option>
        </select>
        {errors.updateFrequency && (
          <p className="mt-1 text-sm text-error-600">{errors.updateFrequency.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="trainingNeeds" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Training Requirements
        </label>
        <select
          id="trainingNeeds"
          {...register('trainingNeeds')}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">Select training needs</option>
          <option value="none">No training needed</option>
          <option value="basic">Basic training (content updates)</option>
          <option value="comprehensive">Comprehensive training (all features)</option>
          <option value="ongoing">Ongoing training and support</option>
          <option value="documentation">Documentation only</option>
          <option value="video-tutorials">Video tutorials</option>
          <option value="live-sessions">Live training sessions</option>
        </select>
      </div>

      <div>
        <label htmlFor="longTermVision" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Long-term Vision
        </label>
        <textarea
          id="longTermVision"
          rows={4}
          {...register('longTermVision')}
          className="input-field"
          placeholder="Describe your long-term vision for this project. Where do you see it in 2-3 years? What are your growth plans?"
          disabled={isSubmitted}
        />
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

export default Step7Evolution;