import React from 'react';
import { useForm } from 'react-hook-form';

interface Step8Data {
  budgetRange: string;
  budgetFlexibility: string;
  paymentPreference: string;
  timeline: string;
  priorityFeatures: string;
  budgetConcerns: string;
}

interface Step8Props {
  data: Step8Data;
  onNext: (data: Step8Data) => void;
  onSaveDraft: (data: Step8Data) => void;
  isSaving: boolean;
  isSubmitted: boolean;
}

const Step8Budget: React.FC<Step8Props> = ({
  data,
  onNext,
  onSaveDraft,
  isSaving,
  isSubmitted,
}) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<Step8Data>({
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
        <label htmlFor="budgetRange" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Budget Range *
        </label>
        <select
          id="budgetRange"
          {...register('budgetRange', { required: 'Budget range is required' })}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">Select budget range</option>
          <option value="under-5k">Under $5,000</option>
          <option value="5k-10k">$5,000 - $10,000</option>
          <option value="10k-25k">$10,000 - $25,000</option>
          <option value="25k-50k">$25,000 - $50,000</option>
          <option value="50k-100k">$50,000 - $100,000</option>
          <option value="over-100k">Over $100,000</option>
          <option value="discuss">Prefer to discuss</option>
        </select>
        {errors.budgetRange && (
          <p className="mt-1 text-sm text-error-600">{errors.budgetRange.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="budgetFlexibility" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Budget Flexibility *
        </label>
        <select
          id="budgetFlexibility"
          {...register('budgetFlexibility', { required: 'Budget flexibility is required' })}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">Select flexibility level</option>
          <option value="fixed">Fixed budget (cannot exceed)</option>
          <option value="some-flexibility">Some flexibility (up to 10-20% more)</option>
          <option value="flexible">Flexible (willing to invest more for quality)</option>
          <option value="value-focused">Value-focused (best ROI within reason)</option>
          <option value="phased">Open to phased approach</option>
        </select>
        {errors.budgetFlexibility && (
          <p className="mt-1 text-sm text-error-600">{errors.budgetFlexibility.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="paymentPreference" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Payment Preference *
        </label>
        <select
          id="paymentPreference"
          {...register('paymentPreference', { required: 'Payment preference is required' })}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">Select payment structure</option>
          <option value="milestone">Milestone-based payments</option>
          <option value="monthly">Monthly payments</option>
          <option value="50-50">50% upfront, 50% on completion</option>
          <option value="third-payments">Three equal payments</option>
          <option value="completion">Full payment on completion</option>
          <option value="custom">Custom payment plan</option>
        </select>
        {errors.paymentPreference && (
          <p className="mt-1 text-sm text-error-600">{errors.paymentPreference.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Desired Timeline *
        </label>
        <select
          id="timeline"
          {...register('timeline', { required: 'Timeline is required' })}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">Select timeline</option>
          <option value="asap">ASAP (rush project)</option>
          <option value="1-month">Within 1 month</option>
          <option value="2-3-months">2-3 months</option>
          <option value="3-6-months">3-6 months</option>
          <option value="6-12-months">6-12 months</option>
          <option value="over-year">Over 1 year</option>
          <option value="flexible">Flexible timeline</option>
        </select>
        {errors.timeline && (
          <p className="mt-1 text-sm text-error-600">{errors.timeline.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="priorityFeatures" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Priority Features (if budget is limited) *
        </label>
        <textarea
          id="priorityFeatures"
          rows={3}
          {...register('priorityFeatures', { required: 'Priority features are required' })}
          className="input-field"
          placeholder="If we need to work within a tighter budget, which features are most important to you? What can be added later?"
          disabled={isSubmitted}
        />
        {errors.priorityFeatures && (
          <p className="mt-1 text-sm text-error-600">{errors.priorityFeatures.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="budgetConcerns" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Budget Concerns or Questions
        </label>
        <textarea
          id="budgetConcerns"
          rows={3}
          {...register('budgetConcerns')}
          className="input-field"
          placeholder="Do you have any concerns about the budget? Questions about pricing? Anything else we should know?"
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

export default Step8Budget;