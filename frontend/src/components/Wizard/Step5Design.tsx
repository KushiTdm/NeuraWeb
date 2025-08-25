import React from 'react';
import { useForm } from 'react-hook-form';

interface Step5Data {
  designStyle: string;
  colorPreferences: string;
  brandGuidelines: string;
  inspirationSites: string;
  logoRequirements: string;
  imageRequirements: string;
}

interface Step5Props {
  data: Step5Data;
  onNext: (data: Step5Data) => void;
  onSaveDraft: (data: Step5Data) => void;
  isSaving: boolean;
  isSubmitted: boolean;
}

const Step5Design: React.FC<Step5Props> = ({
  data,
  onNext,
  onSaveDraft,
  isSaving,
  isSubmitted,
}) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<Step5Data>({
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
        <label htmlFor="designStyle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Design Style Preference *
        </label>
        <select
          id="designStyle"
          {...register('designStyle', { required: 'Design style is required' })}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">Select design style</option>
          <option value="modern-minimalist">Modern & Minimalist</option>
          <option value="corporate-professional">Corporate & Professional</option>
          <option value="creative-artistic">Creative & Artistic</option>
          <option value="bold-vibrant">Bold & Vibrant</option>
          <option value="elegant-sophisticated">Elegant & Sophisticated</option>
          <option value="playful-fun">Playful & Fun</option>
          <option value="industrial-tech">Industrial & Tech</option>
          <option value="vintage-retro">Vintage & Retro</option>
          <option value="clean-simple">Clean & Simple</option>
          <option value="custom">Custom (will describe)</option>
        </select>
        {errors.designStyle && (
          <p className="mt-1 text-sm text-error-600">{errors.designStyle.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="colorPreferences" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Color Preferences *
        </label>
        <textarea
          id="colorPreferences"
          rows={3}
          {...register('colorPreferences', { required: 'Color preferences are required' })}
          className="input-field"
          placeholder="Describe your color preferences. Do you have brand colors? Any colors to avoid? Preferred color schemes?"
          disabled={isSubmitted}
        />
        {errors.colorPreferences && (
          <p className="mt-1 text-sm text-error-600">{errors.colorPreferences.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="brandGuidelines" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Existing Brand Guidelines
        </label>
        <textarea
          id="brandGuidelines"
          rows={3}
          {...register('brandGuidelines')}
          className="input-field"
          placeholder="Do you have existing brand guidelines, style guides, or brand assets we should follow?"
          disabled={isSubmitted}
        />
      </div>

      <div>
        <label htmlFor="inspirationSites" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Inspiration Websites
        </label>
        <textarea
          id="inspirationSites"
          rows={3}
          {...register('inspirationSites')}
          className="input-field"
          placeholder="Share URLs of websites you like and explain what you like about them (design, functionality, layout, etc.)"
          disabled={isSubmitted}
        />
      </div>

      <div>
        <label htmlFor="logoRequirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Logo Requirements
        </label>
        <select
          id="logoRequirements"
          {...register('logoRequirements')}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">Select logo needs</option>
          <option value="have-logo">We have an existing logo</option>
          <option value="need-logo">We need a new logo designed</option>
          <option value="update-logo">We want to update our existing logo</option>
          <option value="no-logo">No logo needed</option>
        </select>
      </div>

      <div>
        <label htmlFor="imageRequirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Image & Media Requirements *
        </label>
        <select
          id="imageRequirements"
          {...register('imageRequirements', { required: 'Image requirements are required' })}
          className="input-field"
          disabled={isSubmitted}
        >
          <option value="">Select image approach</option>
          <option value="client-provides">We will provide all images/media</option>
          <option value="stock-photos">Use stock photos/media</option>
          <option value="professional-photos">Need professional photography</option>
          <option value="mixed-approach">Mixed approach (some provided, some sourced)</option>
          <option value="custom-graphics">Need custom graphics/illustrations</option>
          <option value="minimal-images">Minimal image requirements</option>
        </select>
        {errors.imageRequirements && (
          <p className="mt-1 text-sm text-error-600">{errors.imageRequirements.message}</p>
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

export default Step5Design;