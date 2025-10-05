import React, { useState, useEffect, useRef } from 'react';
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
  Sparkles,
  Circle
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
  const containerRef = useRef<HTMLDivElement>(null);
  const stepContentRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

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
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {stepConfig.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex items-center">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  index < currentStep
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-purple-500/50'
                    : index === currentStep - 1
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-purple-500/50'
                    : 'bg-white/10 border-2 border-white/20'
                }`}
              >
                {index < currentStep - 1 ? (
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                ) : (
                  <step.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                )}
              </div>
              {index < stepConfig.length - 1 && (
                <div className="h-1 w-full mx-2 bg-white/10 relative overflow-hidden flex-1">
                  <div
                    className={`h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ${
                      index < currentStep - 1 ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          ref={progressRef}
          className="h-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 transition-all duration-600"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-white/80 font-medium mb-4 text-base sm:text-lg">
                {t('quote.service.label')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      relative cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105
                      ${watchedServiceType === service.value 
                        ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20' 
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
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
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-xs px-3 py-1 rounded-full font-bold text-white">
                        {t('quote.service.business.popular')}
                      </div>
                    )}
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-base sm:text-lg text-white">{service.label}</h3>
                      <span className="font-bold text-base sm:text-lg text-blue-400">
                        {service.price > 0 ? `${service.price}€` : t('quote.service.custom.price')}
                      </span>
                    </div>
                    <p className="text-sm text-white/60">{service.desc}</p>
                    {watchedServiceType === service.value && (
                      <CheckCircle className="absolute top-4 right-4 text-blue-400" size={20} />
                    )}
                  </label>
                ))}
              </div>
              {errors.serviceType && (
                <p className="mt-2 text-sm text-red-400">{errors.serviceType.message}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <label className="block text-white/80 font-medium mb-4 text-base sm:text-lg">
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
                  flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02]
                  ${watchedOptions.includes(option.value)
                    ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }
                `}
              >
                <input
                  type="checkbox"
                  value={option.value}
                  {...register('options')}
                  className="h-5 w-5 text-purple-600 rounded mt-0.5 flex-shrink-0 accent-purple-500"
                />
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <span className="font-medium text-base text-white">{option.label}</span>
                    <span className="font-bold text-base text-purple-400 whitespace-nowrap">+{option.price}€</span>
                  </div>
                  <p className="text-sm text-white/60">{option.desc}</p>
                </div>
              </label>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="message" className="block text-white/80 font-medium mb-2 text-base sm:text-lg">
                {t('quote.details.label')}
              </label>
              <textarea
                id="message"
                rows={6}
                {...register('message')}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 resize-none"
                placeholder={t('quote.details.placeholder')}
              />
            </div>

            {watchedServiceType && (
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-white/10">
                <h3 className="font-bold text-lg mb-4 text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  {t('quote.summary.title')}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-base">
                    <span className="text-white/70">{t('quote.summary.service')}</span>
                    <span className="font-bold text-white">
                      {watchedServiceType === 'custom' ? t('quote.service.custom.price') : `${servicePrices[watchedServiceType]}€`}
                    </span>
                  </div>
                  {watchedOptions.map((opt) => (
                    <div key={opt} className="flex justify-between text-base">
                      <span className="text-white/70">{t(`quote.option.${opt}`)}</span>
                      <span className="text-purple-400">+{optionPrices[opt as keyof typeof optionPrices]}€</span>
                    </div>
                  ))}
                  {watchedServiceType !== 'custom' && estimatedPrice > 0 && (
                    <div className="pt-3 border-t border-white/20 flex justify-between font-bold text-lg">
                      <span className="text-white">{t('quote.summary.total')}</span>
                      <span className="text-blue-400">{estimatedPrice}€</span>
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
              <label htmlFor="name" className="block text-white/80 font-medium mb-2 text-base">
                {t('quote.name.label')}
              </label>
              <input
                type="text"
                id="name"
                {...register('name', { required: t('quote.name.required') })}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                placeholder={t('quote.name.placeholder')}
              />
              {errors.name && <p className="mt-2 text-sm text-red-400">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-white/80 font-medium mb-2 text-base">
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
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                placeholder={t('quote.email.placeholder')}
              />
              {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const currentStepConfig = stepConfig[currentStep - 1];

  return (
    <div className="min-h-screen bg-slate-950 overflow-hidden relative">
      {/* Animated Background Blobs */}
      <div
        className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      >
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>
      <div
        className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      >
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>
      <div
        className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
        style={{ transform: `translateY(${scrollY * 0.2}px)` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen pt-20 sm:pt-24 pb-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4">
              {t('quote.title')}
            </h1>
            <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto">
              {t('quote.subtitle')}
            </p>
          </div>

          {selectedPackFromNav && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-xl border border-white/10 max-w-md mx-auto text-center">
              <Check className="inline mr-2 text-green-400" size={18} />
              <span className="text-white" dangerouslySetInnerHTML={{ 
                __html: t('quote.pack.preselected').replace('{packName}', location.state?.packName || selectedPackFromNav) 
              }} />
            </div>
          )}

          <div ref={containerRef} className="max-w-5xl mx-auto">
            <StepIndicator />
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                
                <div className="lg:col-span-2">
                  <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl">
                    
                    <div ref={stepContentRef} className="animate-slide-in">
                      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                        <currentStepConfig.icon className="text-purple-400 flex-shrink-0" size={24} />
                        <div>
                          <h2 className="text-xl sm:text-2xl font-bold text-white">
                            {currentStepConfig.title}
                          </h2>
                          <p className="text-sm text-white/60 mt-1">
                            {currentStepConfig.subtitle}
                          </p>
                        </div>
                      </div>

                      {renderStepContent()}

                      <div className="flex gap-4 mt-8 pt-6 border-t border-white/10">
                        {currentStep > 1 && (
                          <button
                            type="button"
                            onClick={prevStep}
                            className="flex-1 px-6 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 group"
                          >
                            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="hidden sm:inline">{t('quote.button.previous')}</span>
                          </button>
                        )}

                        {currentStep < totalSteps ? (
                          <button
                            type="button"
                            onClick={nextStep}
                            className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center gap-2 group"
                          >
                            <span>{t('quote.button.next')}</span>
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </button>
                        ) : (
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                          >
                            {isSubmitting ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                              <>
                                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                <span>{t('quote.button.submit')}</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1 order-first lg:order-last">
                  <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl lg:sticky lg:top-24">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                      <Calculator className="text-blue-400 flex-shrink-0" size={20} />
                      <h3 className="font-bold text-lg text-white">
                        {t('quote.estimate')}
                      </h3>
                    </div>

                    {watchedServiceType ? (
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 text-base">
                          <span className="text-white/70 text-sm">{t('quote.estimate.service')}</span>
                          <span className="font-bold text-white">
                            {watchedServiceType === 'custom' ? t('quote.service.custom.price') : `${servicePrices[watchedServiceType]}€`}
                          </span>
                        </div>

                        {watchedOptions.map((opt) => (
                          <div key={opt} className="flex justify-between py-2">
                            <span className="text-white/70 text-sm">{t(`quote.option.${opt}`)}</span>
                            <span className="text-purple-400 text-sm">+{optionPrices[opt as keyof typeof optionPrices]}€</span>
                          </div>
                        ))}

                        {watchedServiceType !== 'custom' && estimatedPrice > 0 && (
                          <div className="pt-3 border-t border-white/10">
                            <div className="flex justify-between font-bold">
                              <span className="text-white">{t('quote.estimate.total')}</span>
                              <span className="text-2xl text-blue-400">{estimatedPrice}€</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-white/50 text-center py-6">
                        {t('quote.estimate.select')}
                      </p>
                    )}

                    <div className="mt-6 pt-4 border-t border-white/10">
                      <div className="flex justify-between text-sm text-white/70 mb-2">
                        <span>{t('quote.progress')}</span>
                        <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
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
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default QuotePage;