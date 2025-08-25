import React from 'react';
import { useForm } from 'react-hook-form';

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
    'English',
    'French',
    'Spanish',
    'German',
    'Italian',
    'Portuguese',
    'Chinese',
    'Japanese',
    'Arabic',
    'Other',
  ];

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div>
        <label htmlFor="contentStrategy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Content Strategy *
        </label>
        <textarea
          id="contentStrategy"
          rows={4}
          {...register('contentStrategy', { required: 'Content strategy is required' })}
          className="input-field"
          placeholder="Describe your content strategy. What type of content will you publish? How often? What's the tone and style?"
          disabled={isSubmitted}
        />
        {errors.contentStrategy && (
          <p className="mt-1 text-sm text-error-600">{errors.contentStrategy.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="existingContent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Existing Content
        </label>
        <textarea
          id="existingContent"
          rows={3}
          {...register('existingContent')}
          className="input-field"
          placeholder="Do you have existing content (text, images, videos) that needs to be migrated or updated?"
          disabled={isSubmitted}
        />
      </div>

      <div>
        <label htmlFor="contentCreation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Content Creation Needs *
        </label>
        <select
          id="contentCreation"
          {...register('contentCreation', { required: 'Content creation preference is required' })}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">Select content creation approach</option>
          <option value="client-provided">We will provide all content</option>
          <option value="collaborative">Collaborative approach (we provide some, you help with some)</option>
          <option value="full-service">Full-service (you create all content)</option>
          <option value="mixed">Mixed approach (depends on content type)</option>
        </select>
        {errors.contentCreation && (
          <p className="mt-1 text-sm text-error-600">{errors.contentCreation.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Languages * (Select all that apply)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {languageOptions.map((language) => (
            <label key={language} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                value={language}
                {...register('languages', { required: 'Please select at least one language' })}
                className="form-checkbox h-5 w-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                disabled={isSubmitted}
              />
              <span className="text-gray-700 dark:text-gray-300">{language}</span>
            </label>
          ))}
        </div>
        {errors.languages && (
          <p className="mt-1 text-sm text-error-600">{errors.languages.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="seoRequirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          SEO Requirements
        </label>
        <textarea
          id="seoRequirements"
          rows={3}
          {...register('seoRequirements')}
          className="input-field"
          placeholder="Do you have specific SEO requirements? Target keywords, local SEO needs, etc."
          disabled={isSubmitted}
        />
      </div>

      <div>
        <label htmlFor="contentManagement" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Content Management Preferences *
        </label>
        <select
          id="contentManagement"
          {...register('contentManagement', { required: 'Content management preference is required' })}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">Select content management approach</option>
          <option value="cms-easy">Easy-to-use CMS (WordPress, etc.)</option>
          <option value="cms-advanced">Advanced CMS with more features</option>
          <option value="headless">Headless CMS for flexibility</option>
          <option value="static">Static content (no frequent updates)</option>
          <option value="custom">Custom solution</option>
          <option value="unsure">Not sure, need recommendations</option>
        </select>
        {errors.contentManagement && (
          <p className="mt-1 text-sm text-error-600">{errors.contentManagement.message}</p>
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

export default Step3Content;