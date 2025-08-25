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
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<QuoteFormData>();

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
    setIsSubmitting(true);
    try {
      await api.post('/quotes', { ...data, estimatedPrice });
      toast.success(t('quote.success'));
      reset();
      setEstimatedPrice(0);
    } catch (error) {
      toast.error(t('common.error'));
      console.error('Quote form error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('quote.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('quote.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quote Form */}
          <div className="lg:col-span-2 card">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('contact.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register('name', { required: t('common.name.required') })}
                    className="input-field"
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-error-600">{errors.name.message}</p>
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
                    className="input-field"
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('quote.service')}
                </label>
                <select
                  id="serviceType"
                  {...register('serviceType', { required: t('common.service.required') })}
                  className="input-field"
                >
                  <option value="">{t('quote.service.placeholder')}</option>
                  <option value="showcase">{t('quote.service.showcase')} ($2,500)</option>
                  <option value="ecommerce">{t('quote.service.ecommerce')} ($5,000)</option>
                  <option value="automation">{t('quote.service.automation')} ($3,500)</option>
                  <option value="ai">{t('quote.service.ai')} ($4,500)</option>
                </select>
                {errors.serviceType && (
                  <p className="mt-1 text-sm text-error-600">{errors.serviceType.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  {t('quote.options')}
                </label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      value="design"
                      {...register('options')}
                      className="form-checkbox h-5 w-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      {t('quote.option.design')} (+$1,500)
                    </span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      value="maintenance"
                      {...register('options')}
                      className="form-checkbox h-5 w-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      {t('quote.option.maintenance')} (+$800)
                    </span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      value="support"
                      {...register('options')}
                      className="form-checkbox h-5 w-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      {t('quote.option.support')} (+$1,200)
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('quote.details')}
                </label>
                <textarea
                  id="message"
                  rows={4}
                  {...register('message')}
                  className="input-field"
                  placeholder={t('quote.details.placeholder')}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send size={20} />
                    <span>{t('quote.submit')}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Price Estimate */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <div className="flex items-center space-x-2 mb-6">
                <Calculator className="text-primary-600" size={24} />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('quote.estimate')}
                </h3>
              </div>

              <div className="space-y-4">
                {watchedServiceType && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                    <span className="text-gray-600 dark:text-gray-300">
                      {t(`quote.service.${watchedServiceType}`)}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ${servicePrices[watchedServiceType as keyof typeof servicePrices]?.toLocaleString()}
                    </span>
                  </div>
                )}

                {Array.isArray(watchedOptions) && watchedOptions.map((option) => (
                  <div key={option} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                    <span className="text-gray-600 dark:text-gray-300">
                      {t(`quote.option.${option}`)}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      +${optionPrices[option as keyof typeof optionPrices]?.toLocaleString()}
                    </span>
                  </div>
                ))}

                <div className="pt-4 border-t-2 border-primary-200 dark:border-primary-800">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t('quote.estimate.total')}
                    </span>
                    <span className="text-2xl font-bold text-primary-600">
                      ${estimatedPrice.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {t('quote.estimate.disclaimer')}
                  </p>
                </div>

                <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <Check className="text-primary-600 flex-shrink-0 mt-0.5" size={16} />
                    <div className="text-sm text-primary-800 dark:text-primary-200">
                      <strong>{t('quote.estimate.included')}</strong>
                      <ul className="mt-1 space-y-1">
                        <li>{t('quote.estimate.included.design')}</li>
                        <li>{t('quote.estimate.included.responsive')}</li>
                        <li>{t('quote.estimate.included.seo')}</li>
                        <li>{t('quote.estimate.included.warranty')}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotePage;