// frontend/src/context/v3.tsx
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
  Sparkles
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
      title: 'Choisissez votre pack',
      subtitle: 'Sélectionnez le pack qui correspond à vos besoins',
      icon: Briefcase,
      fields: ['serviceType']
    },
    {
      id: 2,
      title: 'Options supplémentaires',
      subtitle: 'Personnalisez votre projet',
      icon: Settings,
      fields: ['options']
    },
    {
      id: 3,
      title: 'Détails du projet',
      subtitle: 'Parlez-nous de vos besoins',
      icon: MessageSquare,
      fields: ['message']
    },
    {
      id: 4,
      title: 'Vos coordonnées',
      subtitle: 'Pour vous contacter rapidement',
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
      
      toast.success('🎉 Votre demande de devis a été envoyée avec succès !');
      reset();
      setEstimatedPrice(0);
      setCurrentStep(1);
      
      setTimeout(() => {
        navigate('/');
      }, 500);
      
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Erreur lors de l\'envoi de la demande');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {stepConfig.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className={`
            relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300
            ${currentStep >= step.id 
              ? 'bg-primary-600 border-primary-600 text-white' 
              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400'
            }
          `}>
            {currentStep > step.id ? (
              <CheckCircle size={22} />
            ) : (
              <step.icon size={22} />
            )}
          </div>
          {index < stepConfig.length - 1 && (
            <div className={`
              w-12 sm:w-16 h-1 mx-2 rounded-full transition-all duration-300
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Type de service
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { value: 'starter', label: 'Starter', price: 1490, desc: 'Site vitrine professionnel' },
                  { value: 'business', label: 'Business', price: 3490, desc: 'Boutique en ligne complète', popular: true },
                  { value: 'premium', label: 'Premium', price: 6900, desc: 'Solution haut de gamme' },
                  { value: 'ai', label: 'IA', price: 4500, desc: 'Solutions IA personnalisées' },
                  { value: 'custom', label: 'Personnalisé', price: 0, desc: 'Solution sur mesure' }
                ].map((service) => (
                  <label
                    key={service.value}
                    className={`
                      relative cursor-pointer p-4 rounded-lg border-2 transition-all
                      ${watchedServiceType === service.value 
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                        : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      value={service.value}
                      {...register('serviceType', { required: 'Veuillez sélectionner un service' })}
                      className="sr-only"
                    />
                    {service.popular && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-yellow-400 text-xs px-2 py-1 rounded-full font-bold">
                        POPULAIRE
                      </div>
                    )}
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-gray-900 dark:text-white">{service.label}</h3>
                      <span className="font-bold text-primary-600">
                        {service.price > 0 ? `${service.price}€` : 'Sur devis'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{service.desc}</p>
                    {watchedServiceType === service.value && (
                      <CheckCircle className="absolute top-2 right-2 text-primary-600" size={20} />
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
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Options supplémentaires (Optionnel)
            </label>
            {[
              { value: 'design', label: 'Design personnalisé', price: 1500 },
              { value: 'maintenance', label: 'Maintenance', price: 800 },
              { value: 'support', label: 'Support prioritaire', price: 1200 }
            ].map((option) => (
              <label
                key={option.value}
                className={`
                  flex items-center p-4 rounded-lg border-2 cursor-pointer
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
                  className="h-5 w-5 text-primary-600 rounded"
                />
                <div className="ml-3 flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">{option.label}</span>
                    <span className="font-bold text-primary-600">+{option.price}€</span>
                  </div>
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
                Détails du projet (Optionnel)
              </label>
              <textarea
                id="message"
                rows={6}
                {...register('message')}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Décrivez votre projet..."
              />
            </div>

            {watchedServiceType && (
              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 border border-primary-200 dark:border-primary-800">
                <h3 className="font-bold mb-3">Résumé</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Service</span>
                    <span className="font-bold">
                      {watchedServiceType === 'custom' ? 'Sur devis' : `${servicePrices[watchedServiceType]}€`}
                    </span>
                  </div>
                  {watchedOptions.map((opt) => (
                    <div key={opt} className="flex justify-between">
                      <span>{opt}</span>
                      <span className="text-primary-600">+{optionPrices[opt as keyof typeof optionPrices]}€</span>
                    </div>
                  ))}
                  {watchedServiceType !== 'custom' && estimatedPrice > 0 && (
                    <div className="pt-2 border-t flex justify-between font-bold">
                      <span>Total</span>
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
                Nom complet *
              </label>
              <input
                type="text"
                id="name"
                {...register('name', { required: 'Le nom est requis' })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="John Doe"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                {...register('email', { 
                  required: 'L\'email est requis',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Email invalide'
                  }
                })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="john@example.com"
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
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-12`}>
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Demande de devis
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Obtenez une estimation instantanée
          </p>
        </div>

        {selectedPackFromNav && (
          <div className="mb-6 p-4 bg-primary-100 dark:bg-primary-900/20 rounded-lg max-w-md mx-auto text-center">
            <Check className="inline mr-2" size={16} />
            <span>Pack <strong>{location.state?.packName}</strong> pré-sélectionné</span>
          </div>
        )}

        <StepIndicator />
      <form onSubmit={handleSubmit(onSubmit)}>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2">
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              
              <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <currentStepConfig.icon className="text-primary-600" size={24} />
                  <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {currentStepConfig.title}
                  </h2>
                </div>
                <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  {currentStepConfig.subtitle}
                </p>
                <div className="mt-2 text-sm text-gray-500">
                  Étape {currentStep} sur {totalSteps}
                </div>
              </div>

              {renderStepContent()}

              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft className="inline mr-1" size={16} />
                  Précédent
                </button>

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Suivant
                    <ChevronRight className="inline ml-1" size={16} />
                  </button>
                ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                    >
                      {isSubmitting ? 'Envoi...' : (
                        <>
                          <Send className="inline mr-1" size={16} />
                          Envoyer
                        </>
                      )}
                    </button>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 sticky top-24`}>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                <Calculator className="text-primary-600" size={20} />
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Estimation
                </h3>
              </div>

              {watchedServiceType ? (
                <div className="space-y-3">
                  <div className="flex justify-between py-2">
                    <span className="text-sm">Service</span>
                    <span className="font-bold">
                      {watchedServiceType === 'custom' ? 'Sur devis' : `${servicePrices[watchedServiceType]}€`}
                    </span>
                  </div>

                  {watchedOptions.map((opt) => (
                    <div key={opt} className="flex justify-between py-2">
                      <span className="text-sm">{opt}</span>
                      <span className="text-primary-600">+{optionPrices[opt as keyof typeof optionPrices]}€</span>
                    </div>
                  ))}

                  {watchedServiceType !== 'custom' && estimatedPrice > 0 && (
                    <div className="pt-3 border-t">
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-2xl text-primary-600">{estimatedPrice}€</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  Sélectionnez un pack
                </p>
              )}

              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progression</span>
                  <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all"
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