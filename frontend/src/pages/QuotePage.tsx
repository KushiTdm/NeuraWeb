// frontend/src/pages/QuotePage.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
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
  CheckCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
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
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const totalSteps = 4;

  const { register, handleSubmit, watch, reset, formState: { errors }, trigger, getValues } = useForm<QuoteFormData>({
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

  const servicePrices = {
    showcase: 2500,
    ecommerce: 5000,
    automation: 3500,
    ai: 4500,
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
    icon: User,
    fields: ['name', 'email']
  },
  {
    id: 2,
    title: t('quote.step2.title'),
    subtitle: t('quote.step2.subtitle'),
    icon: Briefcase,
    fields: ['serviceType']
  },
  {
    id: 3,
    title: t('quote.step3.title'),
    subtitle: t('quote.step3.subtitle'),
    icon: Settings,
    fields: ['options']
  },
  {
    id: 4,
    title: t('quote.step4.title'),
    subtitle: t('quote.step4.subtitle'),
    icon: MessageSquare,
    fields: ['message']
  }
];

  useEffect(() => {
    let basePrice = servicePrices[watchedServiceType as keyof typeof servicePrices] || 0;
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
    console.log('Submitting quote data:', data);
    
    setIsSubmitting(true);
    try {
      const submitData = {
        ...data,
        options: Array.isArray(data.options) ? data.options : [],
        estimatedPrice,
        message: data.message || ''
      };

      console.log('Final submit data:', submitData);

      const response = await api.post('/quotes', submitData);
      console.log('Quote submission response:', response.data);
      
      toast.success('🎉 Votre demande de devis a été envoyée avec succès ! Vous recevrez une réponse dans les 24h.');
      reset();
      setEstimatedPrice(0);
      setCurrentStep(1);
      
      // Rediriger vers la page d'accueil après 2 secondes
      setTimeout(() => {
        navigate('/');
      }, 500);
      
    } catch (error: any) {
      console.error('Quote form error:', error);
      
      if (error.response?.data?.error) {
        toast.error(`Erreur: ${error.response.data.error}`);
        
        if (error.response.data.details) {
          console.log('Validation details:', error.response.data.details);
        }
      } else if (error.response?.status === 400) {
        toast.error('Erreur: Données invalides. Vérifiez vos informations.');
      } else if (error.response?.status === 500) {
        toast.error('Erreur serveur. Veuillez réessayer plus tard.');
      } else {
        toast.error('Erreur: Impossible d\'envoyer votre demande. Vérifiez votre connexion.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {stepConfig.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className={`
            relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
            ${currentStep >= step.id 
              ? 'bg-primary-600 border-primary-600 text-white' 
              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400'
            }
          `}>
            {currentStep > step.id ? (
              <CheckCircle size={20} />
            ) : (
              <step.icon size={20} />
            )}
          </div>
          {index < stepConfig.length - 1 && (
            <div className={`
              w-16 h-0.5 mx-2 transition-all duration-300
              ${currentStep > step.id ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}
            `} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('contact.name')}
              </label>
              <input
                type="text"
                id="name"
                {...register('name', { required: t('common.name.required') })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('contact.email')}
              </label>
              <input
                type="email"
                id="email"
                {...register('email', { 
                  required: t('common.email.required'),
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: t('common.email.invalid')
                  }
                })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                {t('quote.service')}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { value: 'showcase', label: t('quote.service.showcase'), price: 2500, desc: 'Site vitrine professionnel' },
                  { value: 'ecommerce', label: t('quote.service.ecommerce'), price: 5000, desc: 'Boutique en ligne complète' },
                  { value: 'automation', label: t('quote.service.automation'), price: 3500, desc: 'Automatisation des processus' },
                  { value: 'ai', label: t('quote.service.ai'), price: 4500, desc: 'Solutions IA personnalisées' }
                ].map((service) => (
                  <label
                    key={service.value}
                    className={`
                      relative cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md
                      ${watchedServiceType === service.value 
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                        : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      value={service.value}
                      {...register('serviceType', { required: t('common.service.required') })}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {service.label}
                      </h3>
                      <span className="text-lg font-bold text-primary-600">
                        ${service.price.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {service.desc}
                    </p>
                    {watchedServiceType === service.value && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="text-primary-600" size={20} />
                      </div>
                    )}
                  </label>
                ))}
              </div>
              {errors.serviceType && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.serviceType.message}</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                {t('quote.options')}
              </label>
              <div className="space-y-3">
                {[
                  { value: 'design', label: t('quote.option.design'), price: 1500, desc: 'Design personnalisé et branding' },
                  { value: 'maintenance', label: t('quote.option.maintenance'), price: 800, desc: 'Maintenance mensuelle incluse' },
                  { value: 'support', label: t('quote.option.support'), price: 1200, desc: 'Support technique prioritaire' }
                ].map((option) => {
                  const isSelected = Array.isArray(watchedOptions) && watchedOptions.includes(option.value);
                  return (
                    <label
                      key={option.value}
                      className={`
                        relative cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md flex items-start space-x-3
                        ${isSelected
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                          : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700'
                        }
                      `}
                    >
                      <input
                        type="checkbox"
                        value={option.value}
                        {...register('options')}
                        className="h-5 w-5 text-primary-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 focus:ring-2 mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {option.label}
                          </h3>
                          <span className="text-lg font-bold text-primary-600">
                            +${option.price.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {option.desc}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('quote.details')}
              </label>
              <textarea
                id="message"
                rows={6}
                {...register('message')}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all resize-vertical"
                placeholder={t('quote.details.placeholder')}
              />
            </div>

            {/* Résumé de la commande */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Résumé de votre projet
              </h3>
              <div className="space-y-2">
                {watchedServiceType && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      {t(`quote.service.${watchedServiceType}`)}
                    </span>
                    <span className="font-medium">
                      ${servicePrices[watchedServiceType as keyof typeof servicePrices]?.toLocaleString()}
                    </span>
                  </div>
                )}
                {Array.isArray(watchedOptions) && watchedOptions.map((option) => (
                  <div key={option} className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      {t(`quote.option.${option}`)}
                    </span>
                    <span className="font-medium text-primary-600">
                      +${optionPrices[option as keyof typeof optionPrices]?.toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Total estimé
                    </span>
                    <span className="text-xl font-bold text-primary-600">
                      ${estimatedPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const currentStepConfig = stepConfig[currentStep - 1];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-center">
          
          {/* Titre */}
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              {t('quote.title')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('quote.subtitle')}
            </p>
          </div>

          {/* Indicateur d'étapes */}
          <StepIndicator />

          {/* Contenu principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
            
            {/* Formulaire wizard */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                
                {/* En-tête de l'étape */}
                <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-3 mb-2">
                    <currentStepConfig.icon className="text-primary-600" size={24} />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {currentStepConfig.title}
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {currentStepConfig.subtitle}
                  </p>
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Étape {currentStep} sur {totalSteps}
                  </div>
                </div>

                {/* Contenu de l'étape - SANS form wrapper ici */}
                {renderStepContent()}

                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={16} />
                    <span>Précédent</span>
                  </button>

                  {currentStep < totalSteps ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center space-x-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all"
                    >
                      <span>Suivant</span>
                      <ChevronRight size={16} />
                    </button>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center space-x-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-all"
                      >
                        {isSubmitting ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <Send size={16} />
                            <span>{t('quote.submit')}</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* Estimation des prix */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
                <div className="flex items-center space-x-2 mb-4">
                  <Calculator className="text-primary-600" size={20} />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('quote.estimate')}
                  </h3>
                </div>

                <div className="space-y-3">
                  {watchedServiceType && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {t(`quote.service.${watchedServiceType}`)}
                      </span>
                      <span className="font-medium">
                        ${servicePrices[watchedServiceType as keyof typeof servicePrices]?.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {Array.isArray(watchedOptions) && watchedOptions.map((option) => (
                    <div key={option} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {t(`quote.option.${option}`)}
                      </span>
                      <span className="font-medium text-primary-600">
                        +${optionPrices[option as keyof typeof optionPrices]?.toLocaleString()}
                      </span>
                    </div>
                  ))}

                  {estimatedPrice > 0 && (
                    <div className="pt-3 border-t-2 border-primary-200 dark:border-primary-800">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {t('quote.estimate.total')}
                        </span>
                        <span className="text-xl font-bold text-primary-600">
                          ${estimatedPrice.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t('quote.estimate.disclaimer')}
                      </p>
                    </div>
                  )}
                </div>

                {/* Barre de progression */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <span>Progression</span>
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
        </div>
      </section>
    </div>
  );
};

export default QuotePage;
