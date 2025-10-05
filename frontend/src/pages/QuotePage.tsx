// frontend/src/pages/QuotePage.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  Calculator, 
  Send, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  User, 
  Briefcase, 
  Settings, 
  MessageSquare,
  CheckCircle,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';

interface QuoteFormData {
  name: string;
  email: string;
  serviceType: string;
  options: string[];
  message: string;
}

const QuotePage: React.FC = () => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const totalSteps = 4;
  
  const selectedPackFromNav = location.state?.selectedPack;

  const { register, handleSubmit, watch, reset, formState: { errors }, trigger, setValue } = useForm<QuoteFormData>({
    defaultValues: {
      name: '',
      email: '',
      serviceType: '',
      options: [],
      message: ''
    }
  });

  const watchedServiceType = watch('serviceType');
  const watchedOptions = watch('options', []);

  const servicePrices: Record<string, number> = {
    starter: 1490,
    business: 3490,
    premium: 6900,
    ai: 4500,
    custom: 0,
  };

  const optionPrices = {
    design: 1500,
    maintenance: 800,
    support: 1200,
  };

  const stepConfig = [
    {
      id: 1,
      title: t('quote.step1.title'),
      subtitle: t('quote.step1.subtitle'),
      icon: Briefcase,
      fields: ['serviceType']
    },
    {
      id: 2,
      title: t('quote.step2.title'),
      subtitle: t('quote.step2.subtitle'),
      icon: Settings,
      fields: ['options']
    },
    {
      id: 3,
      title: t('quote.step3.title'),
      subtitle: t('quote.step3.subtitle'),
      icon: MessageSquare,
      fields: ['message']
    },
    {
      id: 4,
      title: t('quote.step4.title'),
      subtitle: t('quote.step4.subtitle'),
      icon: User,
      fields: ['name', 'email']
    }
  ];

  useEffect(() => {
    if (selectedPackFromNav) {
      setValue('serviceType', selectedPackFromNav);
    }
  }, [selectedPackFromNav, setValue]);

  useEffect(() => {
    let basePrice = servicePrices[watchedServiceType] || 0;
    let optionsTotal = 0;

    if (Array.isArray(watchedOptions)) {
      optionsTotal = watchedOptions.reduce((total, option) => {
        return total + (optionPrices[option as keyof typeof optionPrices] || 0);
      }, 0);
    }

    setEstimatedPrice(basePrice + optionsTotal);
  }, [watchedServiceType, watchedOptions]);

  const nextStep = async () => {
    const currentStepConfig = stepConfig[currentStep - 1];
    const fieldsToValidate = currentStepConfig.fields as (keyof QuoteFormData)[];
    
    const isValid = await trigger(fieldsToValidate);
    
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);
    try {
      const submitData = {
        ...data,
        options: Array.isArray(data.options) ? data.options : [],
        estimatedPrice,
        message: data.message || ''
      };

      await api.post('/quotes', submitData);
      
      toast.success(t('quote.success'));
      reset();
      setEstimatedPrice(0);
      setCurrentStep(1);
      
      setTimeout(() => {
        navigate('/');
      }, 500);
      
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(t('quote.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-6 sm:mb-8 overflow-x-auto pb-2">
      <div className="flex items-center min-w-max px-4">
        {stepConfig.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`
              relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-300 flex-shrink-0
              ${currentStep >= step.id 
                ? 'bg-primary-600 border-primary-600 text-white' 
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400'
              }
            `}>
              {currentStep > step.id ? (
                <CheckCircle size={20} className="sm:w-[22px] sm:h-[22px]" />
              ) : (
                <step.icon size={20} className="sm:w-[22px] sm:h-[22px]" />
              )}
            </div>
            {index < stepConfig.length - 1 && (
              <div className={`
                w-8 sm:w-12 md:w-16 h-1 mx-1 sm:mx-2 rounded-full transition-all duration-300 flex-shrink-0
                ${currentStep > step.id ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}
              `} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                {t('quote.service.label')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {[
                  { value: 'starter', label: t('quote.service.starter'), price: 1490, desc: t('quote.service.starter.desc') },
                  { value: 'business', label: t('quote.service.business'), price: 3490, desc: t('quote.service.business.desc'), popular: true },
                  { value: 'premium', label: t('quote.service.premium'), price: 6900, desc: t('quote.service.premium.desc') },
                  { value: 'ai', label: t('quote.service.ai'), price: 4500, desc: t('quote.service.ai.desc') },
                  { value: 'custom', label: t('quote.service.custom'), price: 0, desc: t('quote.service.custom.desc') }
                ].map((service) => (
                  <label
                    key={service.value}
                    className={`
                      relative cursor-pointer p-3 sm:p-4 rounded-lg border-2 transition-all
                      ${watchedServiceType === service.value 
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                        : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      value={service.value}
                      {...register('serviceType', { required: t('quote.service.required') })}
                      className="sr-only"
                    />
                    {service.popular && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-yellow-400 text-xs px-2 py-0.5 sm:py-1 rounded-full font-bold">
                        {t('quote.service.business.popular')}
                      </div>
                    )}
                    <div className="flex justify-between items-center mb-1 sm:mb-2">
                      <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">{service.label}</h3>
                      <span className="font-bold text-sm sm:text-base text-primary-600">
                        {service.price > 0 ? `${service.price}€` : t('quote.service.custom.price')}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{service.desc}</p>
                    {watchedServiceType === service.value && (
                      <CheckCircle className="absolute top-2 right-2 text-primary-600" size={18} />
                    )}
                  </label>
                ))}
              </div>
              {errors.serviceType && (
                <p className="mt-2 text-sm text-red-600">{errors.serviceType.message}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-3 sm:space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              {t('quote.options.label')}
            </label>
            {[
              { value: 'design', label: t('quote.option.design'), price: 1500, desc: t('quote.option.design.desc') },
              { value: 'maintenance', label: t('quote.option.maintenance'), price: 800, desc: t('quote.option.maintenance.desc') },
              { value: 'support', label: t('quote.option.support'), price: 1200, desc: t('quote.option.support.desc') }
            ].map((option) => (
              <label
                key={option.value}
                className={`
                  flex items-start p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${watchedOptions.includes(option.value)
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700'
                  }
                `}
              >
                <input
                  type="checkbox"
                  value={option.value}
                  {...register('options')}
                  className="h-5 w-5 text-primary-600 rounded mt-0.5 flex-shrink-0"
                />
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <span className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">{option.label}</span>
                    <span className="font-bold text-sm sm:text-base text-primary-600 whitespace-nowrap">+{option.price}€</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{option.desc}</p>
                </div>
              </label>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('quote.details.label')}
              </label>
              <textarea
                id="message"
                rows={6}
                {...register('message')}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                placeholder={t('quote.details.placeholder')}
              />
            </div>

            {watchedServiceType && (
              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-3 sm:p-4 border border-primary-200 dark:border-primary-800">
                <h3 className="font-bold text-sm sm:text-base mb-3">{t('quote.summary.title')}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>{t('quote.summary.service')}</span>
                    <span className="font-bold">
                      {watchedServiceType === 'custom' ? t('quote.service.custom.price') : `${servicePrices[watchedServiceType]}€`}
                    </span>
                  </div>
                  {watchedOptions.map((opt) => (
                    <div key={opt} className="flex justify-between text-sm sm:text-base">
                      <span>{t(`quote.option.${opt}`)}</span>
                      <span className="text-primary-600">+{optionPrices[opt as keyof typeof optionPrices]}€</span>
                    </div>
                  ))}
                  {watchedServiceType !== 'custom' && estimatedPrice > 0 && (
                    <div className="pt-2 border-t flex justify-between font-bold text-sm sm:text-base">
                      <span>{t('quote.summary.total')}</span>
                      <span className="text-primary-600">{estimatedPrice}€</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('quote.name.label')}
              </label>
              <input
                type="text"
                id="name"
                {...register('name', { required: t('quote.name.required') })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                placeholder={t('quote.name.placeholder')}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('quote.email.label')}
              </label>
              <input
                type="email"
                id="email"
                {...register('email', { 
                  required: t('quote.email.required'),
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: t('quote.email.invalid')
                  }
                })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                placeholder={t('quote.email.placeholder')}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const currentStepConfig = stepConfig[currentStep - 1];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} pt-20 sm:pt-24 pb-8 sm:pb-12`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="text-center mb-6 sm:mb-8">
          <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2 sm:mb-4`}>
            {t('quote.title')}
          </h1>
          <p className={`text-base sm:text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} px-4`}>
            {t('quote.subtitle')}
          </p>
        </div>

        {selectedPackFromNav && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-primary-100 dark:bg-primary-900/20 rounded-lg max-w-md mx-auto text-center text-sm sm:text-base">
            <Check className="inline mr-2" size={16} />
            <span dangerouslySetInnerHTML={{ 
              __html: t('quote.pack.preselected').replace('{packName}', location.state?.packName || selectedPackFromNav) 
            }} />
          </div>
        )}

        <StepIndicator />
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            
            <div className="lg:col-span-2">
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-4 sm:p-6`}>
                
                <div className="mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <currentStepConfig.icon className="text-primary-600 flex-shrink-0" size={20} />
                    <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {currentStepConfig.title}
                    </h2>
                  </div>
                  <p className={`text-sm sm:text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {currentStepConfig.subtitle}
                  </p>
                  <div className="mt-2 text-xs sm:text-sm text-gray-500">
                    {t('quote.step.progress').replace('{current}', currentStep.toString()).replace('{total}', totalSteps.toString())}
                  </div>
                </div>

                {renderStepContent()}

                <div className="flex justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700 gap-3">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center justify-center gap-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base transition-colors"
                  >
                    <ChevronLeft size={16} />
                    <span className="hidden xs:inline">{t('quote.button.previous')}</span>
                  </button>

                  {currentStep < totalSteps ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center justify-center gap-1 px-4 sm:px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm sm:text-base transition-colors"
                    >
                      <span>{t('quote.button.next')}</span>
                      <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center justify-center gap-1 px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base transition-colors"
                    >
                      {isSubmitting ? (
                        <span>{t('quote.button.submitting')}</span>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>{t('quote.button.submit')}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 order-first lg:order-last">
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-4 sm:p-6 lg:sticky lg:top-24`}>
                <div className="flex items-center gap-2 mb-3 sm:mb-4 pb-2 sm:pb-3 border-b">
                  <Calculator className="text-primary-600 flex-shrink-0" size={18} />
                  <h3 className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {t('quote.estimate')}
                  </h3>
                </div>

                {watchedServiceType ? (
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between py-2 text-sm sm:text-base">
                      <span className="text-sm">{t('quote.estimate.service')}</span>
                      <span className="font-bold">
                        {watchedServiceType === 'custom' ? t('quote.service.custom.price') : `${servicePrices[watchedServiceType]}€`}
                      </span>
                    </div>

                    {watchedOptions.map((opt) => (
                      <div key={opt} className="flex justify-between py-2 text-sm sm:text-base">
                        <span className="text-sm">{t(`quote.option.${opt}`)}</span>
                        <span className="text-primary-600">+{optionPrices[opt as keyof typeof optionPrices]}€</span>
                      </div>
                    ))}

                    {watchedServiceType !== 'custom' && estimatedPrice > 0 && (
                      <div className="pt-2 sm:pt-3 border-t">
                        <div className="flex justify-between font-bold">
                          <span className="text-sm sm:text-base">{t('quote.estimate.total')}</span>
                          <span className="text-xl sm:text-2xl text-primary-600">{estimatedPrice}€</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-gray-500 text-center py-4">
                    {t('quote.estimate.select')}
                  </p>
                )}

                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t">
                  <div className="flex justify-between text-xs sm:text-sm mb-2">
                    <span>{t('quote.progress')}</span>
                    <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};

export default QuotePage;