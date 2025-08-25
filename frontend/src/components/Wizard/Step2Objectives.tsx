import React from 'react';
import { useForm } from 'react-hook-form';

interface Step2Data {
  primaryGoals: string[];
  successMetrics: string;
  currentChallenges: string;
  competitorAnalysis: string;
  uniqueValue: string;
}

interface Step2Props {
  data: Step2Data;
  onNext: (data: Step2Data) => void;
  onSaveDraft: (data: Step2Data) => void;
  isSaving: boolean;
  isSubmitted: boolean;
}

const Step2Objectives: React.FC<Step2Props> = ({
  data,
  onNext,
  onSaveDraft,
  isSaving,
  isSubmitted,
}) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<Step2Data>({
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

  const goalOptions = [
    'Increase brand awareness',
    'Generate leads',
    'Boost online sales',
    'Improve customer engagement',
    'Streamline business processes',
    'Enhance user experience',
    'Expand market reach',
    'Reduce operational costs',
    'Improve data collection',
    'Automate workflows',
  ];

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Primary Goals * (Select all that apply)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {goalOptions.map((goal) => (
            <label key={goal} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                value={goal}
                {...register('primaryGoals', { required: 'Please select at least one goal' })}
                className="form-checkbox h-5 w-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                disabled={isSubmitted}
              />
              <span className="text-gray-700 dark:text-gray-300">{goal}</span>
            </label>
          ))}
        </div>
        {errors.primaryGoals && (
          <p className="mt-1 text-sm text-error-600">{errors.primaryGoals.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="successMetrics" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Success Metrics *
        </label>
        <textarea
          id="successMetrics"
          rows={3}
          {...register('successMetrics', { required: 'Success metrics are required' })}
          className="input-field"
          placeholder="How will you measure the success of this project? (e.g., increased traffic, conversion rates, user engagement, etc.)"
          disabled={isSubmitted}
        />
        {errors.successMetrics && (
          <p className="mt-1 text-sm text-error-600">{errors.successMetrics.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="currentChallenges" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Current Challenges *
        </label>
        <textarea
          id="currentChallenges"
          rows={3}
          {...register('currentChallenges', { required: 'Current challenges are required' })}
          className="input-field"
          placeholder="What challenges are you currently facing that this project should address?"
          disabled={isSubmitted}
        />
        {errors.currentChallenges && (
          <p className="mt-1 text-sm text-error-600">{errors.currentChallenges.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="competitorAnalysis" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Competitor Analysis
        </label>
        <textarea
          id="competitorAnalysis"
          rows={3}
          {...register('competitorAnalysis')}
          className="input-field"
          placeholder="Who are your main competitors? What do you like/dislike about their websites or solutions?"
          disabled={isSubmitted}
        />
      </div>

      <div>
        <label htmlFor="uniqueValue" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Unique Value Proposition *
        </label>
        <textarea
          id="uniqueValue"
          rows={3}
          {...register('uniqueValue', { required: 'Unique value proposition is required' })}
          className="input-field"
          placeholder="What makes your business/project unique? What value do you provide that others don't?"
          disabled={isSubmitted}
        />
        {errors.uniqueValue && (
          <p className="mt-1 text-sm text-error-600">{errors.uniqueValue.message}</p>
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

export default Step2Objectives;