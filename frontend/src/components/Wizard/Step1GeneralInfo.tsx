import React from 'react';
import { useForm } from 'react-hook-form';

interface Step1Data {
  projectName: string;
  companyName: string;
  industry: string;
  projectType: string;
  description: string;
  targetAudience: string;
}

interface Step1Props {
  data: Step1Data;
  onNext: (data: Step1Data) => void;
  onSaveDraft: (data: Step1Data) => void;
  isFirstStep: boolean;
  isSaving: boolean;
  isSubmitted: boolean;
}

const Step1GeneralInfo: React.FC<Step1Props> = ({
  data,
  onNext,
  onSaveDraft,
  isSaving,
  isSubmitted,
}) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<Step1Data>({
    defaultValues: data,
  });

  const watchedData = watch();

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!isSubmitted) {
        onSaveDraft(watchedData);
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(interval);
  }, [watchedData, onSaveDraft, isSubmitted]);

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Project Name *
          </label>
          <input
            type="text"
            id="projectName"
            {...register('projectName', { required: 'Project name is required' })}
            className="input-field"
            placeholder="My Awesome Website"
            disabled={isSubmitted}
          />
          {errors.projectName && (
            <p className="mt-1 text-sm text-error-600">{errors.projectName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Company/Organization Name *
          </label>
          <input
            type="text"
            id="companyName"
            {...register('companyName', { required: 'Company name is required' })}
            className="input-field"
            placeholder="Acme Corporation"
            disabled={isSubmitted}
          />
          {errors.companyName && (
            <p className="mt-1 text-sm text-error-600">{errors.companyName.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Industry/Sector *
          </label>
          <select
            id="industry"
            {...register('industry', { required: 'Industry is required' })}
            className="input-field"
            disabled={isSubmitted}
          >
            <option value="">Select an industry</option>
            <option value="technology">Technology</option>
            <option value="healthcare">Healthcare</option>
            <option value="finance">Finance</option>
            <option value="education">Education</option>
            <option value="retail">Retail/E-commerce</option>
            <option value="manufacturing">Manufacturing</option>
            <option value="consulting">Consulting</option>
            <option value="nonprofit">Non-profit</option>
            <option value="hospitality">Hospitality</option>
            <option value="real-estate">Real Estate</option>
            <option value="other">Other</option>
          </select>
          {errors.industry && (
            <p className="mt-1 text-sm text-error-600">{errors.industry.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Project Type *
          </label>
          <select
            id="projectType"
            {...register('projectType', { required: 'Project type is required' })}
            className="input-field"
            disabled={isSubmitted}
          >
            <option value="">Select project type</option>
            <option value="new-website">New Website</option>
            <option value="website-redesign">Website Redesign</option>
            <option value="web-application">Web Application</option>
            <option value="e-commerce">E-commerce Platform</option>
            <option value="mobile-app">Mobile Application</option>
            <option value="automation">Process Automation</option>
            <option value="ai-integration">AI Integration</option>
            <option value="other">Other</option>
          </select>
          {errors.projectType && (
            <p className="mt-1 text-sm text-error-600">{errors.projectType.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Project Description *
        </label>
        <textarea
          id="description"
          rows={4}
          {...register('description', { required: 'Project description is required' })}
          className="input-field"
          placeholder="Provide a brief overview of your project, what you want to achieve, and any specific requirements..."
          disabled={isSubmitted}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-error-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Target Audience *
        </label>
        <textarea
          id="targetAudience"
          rows={3}
          {...register('targetAudience', { required: 'Target audience is required' })}
          className="input-field"
          placeholder="Describe your target audience: demographics, interests, technical proficiency, etc."
          disabled={isSubmitted}
        />
        {errors.targetAudience && (
          <p className="mt-1 text-sm text-error-600">{errors.targetAudience.message}</p>
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

export default Step1GeneralInfo;