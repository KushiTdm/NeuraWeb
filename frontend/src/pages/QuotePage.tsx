// frontend/src/pages/QuotePage.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Calculator, Send, Check } from 'lucide-react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<QuoteFormData>({
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
      
      toast.success(t('quote.success'));
      reset();
      setEstimatedPrice(0);
    } catch (error: any) {
      console.error('Quote form error:', error);
      
      if (error.response?.data?.error) {
        toast.error(`Error: ${error.response.data.error}`);
        
        if (error.response.data.details) {
          console.log('Validation details:', error.response.data.details);
        }
      } else {
        toast.error(t('common.error'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Section principale - Compensation du header fixe */}
      <section className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-8" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-center" style={{ maxHeight: 'calc(100vh - 128px)' }}>
          
          {/* Titre compact */}
          <div className="text-center mb-4 lg:mb-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 lg:mb-3">
              {t('quote.title')}
            </h1>
            <p className="text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('quote.subtitle')}
            </p>
          </div>

          {/* Contenu principal en grid avec hauteurs égales */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 flex-1 overflow-hidden">
            
            {/* Quote Form - 2/3 de la largeur sur desktop */}
            <div className="lg:col-span-2 flex flex-col min-h-0">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-5 flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent pr-2 -mr-2">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    
                    {/* Nom et Email en grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {t('contact.name')}
                        </label>
                        <input
                          type="text"
                          id="name"
                          {...register('name', { required: t('common.name.required') })}
                          className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all text-sm"
                          placeholder="John Doe"
                        />
                        {errors.name && (
                          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.name.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                          className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all text-sm"
                          placeholder="john@example.com"
                        />
                        {errors.email && (
                          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Type de service */}
                    <div>
                      <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('quote.service')}
                      </label>
                      <select
                        id="serviceType"
                        {...register('serviceType', { required: t('common.service.required') })}
                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all text-sm"
                        defaultValue=""
                      >
                        <option value="">{t('quote.service.placeholder')}</option>
                        <option value="showcase">{t('quote.service.showcase')} ($2,500)</option>
                        <option value="ecommerce">{t('quote.service.ecommerce')} ($5,000)</option>
                        <option value="automation">{t('quote.service.automation')} ($3,500)</option>
                        <option value="ai">{t('quote.service.ai')} ($4,500)</option>
                      </select>
                      {errors.serviceType && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.serviceType.message}</p>
                      )}
                    </div>

                    {/* Options - Layout compact */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('quote.options')}
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <input
                            type="checkbox"
                            value="design"
                            {...register('options')}
                            className="form-checkbox h-4 w-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300 dark:border-gray-600"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                            {t('quote.option.design')}
                          </span>
                          <span className="text-sm font-medium text-primary-600">+$1,500</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <input
                            type="checkbox"
                            value="maintenance"
                            {...register('options')}
                            className="form-checkbox h-4 w-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300 dark:border-gray-600"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                            {t('quote.option.maintenance')}
                          </span>
                          <span className="text-sm font-medium text-primary-600">+$800</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <input
                            type="checkbox"
                            value="support"
                            {...register('options')}
                            className="form-checkbox h-4 w-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300 dark:border-gray-600"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                            {t('quote.option.support')}
                          </span>
                          <span className="text-sm font-medium text-primary-600">+$1,200</span>
                        </label>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('quote.details')}
                      </label>
                      <textarea
                        id="message"
                        rows={3}
                        {...register('message')}
                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all resize-vertical text-sm"
                        placeholder={t('quote.details.placeholder')}
                      />
                    </div>

                    {/* Bouton submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl text-sm"
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
                </div>
              </div>
            </div>

            {/* Price Estimate - 1/3 de la largeur sur desktop */}
            <div className="lg:col-span-1 flex flex-col min-h-0">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                  <div className="flex items-center space-x-2 mb-4">
                    <Calculator className="text-primary-600" size={18} />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t('quote.estimate')}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {/* Service sélectionné */}
                    {watchedServiceType && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {t(`quote.service.${watchedServiceType}`)}
                        </span>
                        <span className="font-medium text-sm text-gray-900 dark:text-white">
                          ${servicePrices[watchedServiceType as keyof typeof servicePrices]?.toLocaleString()}
                        </span>
                      </div>
                    )}

                    {/* Options sélectionnées */}
                    {Array.isArray(watchedOptions) && watchedOptions.map((option) => (
                      <div key={option} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {t(`quote.option.${option}`)}
                        </span>
                        <span className="font-medium text-sm text-primary-600">
                          +${optionPrices[option as keyof typeof optionPrices]?.toLocaleString()}
                        </span>
                      </div>
                    ))}

                    {/* Total */}
                    {(watchedServiceType || (Array.isArray(watchedOptions) && watchedOptions.length > 0)) && (
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

                    {/* Ce qui est inclus */}
                    <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-3 mt-4">
                      <div className="flex items-start space-x-2">
                        <Check className="text-primary-600 flex-shrink-0 mt-0.5" size={14} />
                        <div className="text-xs text-primary-800 dark:text-primary-200">
                          <strong className="block mb-1">{t('quote.estimate.included')}</strong>
                          <ul className="space-y-0.5 list-disc list-inside">
                            <li>{t('quote.estimate.included.design')}</li>
                            <li>{t('quote.estimate.included.responsive')}</li>
                            <li>{t('quote.estimate.included.seo')}</li>
                            <li>{t('quote.estimate.included.warranty')}</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Call to action */}
                    {estimatedPrice > 0 && (
                      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg p-3 text-white">
                        <p className="text-xs font-medium mb-1">🚀 Prêt à commencer ?</p>
                        <p className="text-xs opacity-90">Soumettez votre demande pour recevoir un devis détaillé !</p>
                      </div>
                    )}
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