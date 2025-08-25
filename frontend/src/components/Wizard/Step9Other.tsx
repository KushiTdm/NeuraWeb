import React from 'react';
import { useForm } from 'react-hook-form';

interface Step9Data {
  additionalRequirements: string;
  concerns: string;
  questions: string;
  communicationPreference: string;
  decisionMakers: string;
  additionalInfo: string;
}

interface Step9Props {
  data: Step9Data;
  onSubmit: (data: Step9Data) => void;
  onSaveDraft: (data: Step9Data) => void;
  isLastStep: boolean;
  isSaving: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;
}

const Step9Other: React.FC<Step9Props> = ({
  data,
  onSubmit,
  onSaveDraft,
  isSaving,
  isSubmitting,
  isSubmitted,
}) => {
  const { register, handleSubmit, watch } = useForm<Step9Data>({
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="additionalRequirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Additional Requirements
        </label>
        <textarea
          id="additionalRequirements"
          rows={4}
          {...register('additionalRequirements')}
          className="input-field"
          placeholder="Any additional requirements, features, or specifications that weren't covered in the previous steps?"
          disabled={isSubmitted}
        />
      </div>

      <div>
        <label htmlFor="concerns" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Concerns or Challenges
        </label>
        <textarea
          id="concerns"
          rows={3}
          {...register('concerns')}
          className="input-field"
          placeholder="Do you have any concerns about the project? Past experiences with web development? Specific challenges you're worried about?"
          disabled={isSubmitted}
        />
      </div>

      <div>
        <label htmlFor="questions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Questions for Us
        </label>
        <textarea
          id="questions"
          rows={3}
          {...register('questions')}
          className="input-field"
          placeholder="What questions do you have for us? About our process, timeline, pricing, or anything else?"
          disabled={isSubmitted}
        />
      </div>

      <div>
        <label htmlFor="communicationPreference" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Communication Preference
        </label>
        <select
          id="communicationPreference"
          {...register('communicationPreference')}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">Select communication preference</option>
          <option value="email">Email</option>
          <option value="phone">Phone calls</option>
          <option value="video">Video calls</option>
          <option value="slack">Slack/Teams</option>
          <option value="project-management">Project management tool</option>
          <option value="mixed">Mixed approach</option>
        </select>
      </div>

      <div>
        <label htmlFor="decisionMakers" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Decision Makers
        </label>
        <textarea
          id="decisionMakers"
          rows={2}
          {...register('decisionMakers')}
          className="input-field"
          placeholder="Who will be involved in making decisions about this project? Should we include anyone else in communications?"
          disabled={isSubmitted}
        />
      </div>

      <div>
        <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Anything Else?
        </label>
        <textarea
          id="additionalInfo"
          rows={4}
          {...register('additionalInfo')}
          className="input-field"
          placeholder="Is there anything else you'd like us to know about your project, your business, or your expectations?"
          disabled={isSubmitted}
        />
      </div>

      {!isSubmitted && (
        <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-200 mb-3">
            Ready to Submit Your Project Brief?
          </h3>
          <p className="text-primary-700 dark:text-primary-300 mb-4">
            Once you submit this project brief, our team will review your requirements and get back to you within 24-48 hours with:
          </p>
          <ul className="list-disc list-inside text-primary-700 dark:text-primary-300 space-y-1">
            <li>A detailed project proposal</li>
            <li>Accurate timeline and pricing</li>
            <li>Next steps for moving forward</li>
            <li>Answers to any questions you've asked</li>
          </ul>
        </div>
      )}

      {isSaving && (
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400" />
          <span>Auto-saving...</span>
        </div>
      )}
    </form>
  );
};

export default Step9Other;