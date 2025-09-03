// frontend/src/pages/ContactPage.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await api.post('/contact', data);
      toast.success(t('contact.success'));
      reset();
    } catch (error) {
      toast.error(t('common.error'));
      console.error('Contact form error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Section principale - Full height sur desktop, auto sur mobile */}
      <section className="min-h-screen lg:h-screen flex flex-col justify-center pt-20 pb-8 px-4 sm:px-6 lg:px-8 lg:pt-24 lg:pb-16">
        <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col justify-center">
          {/* Titre centré - Plus compact */}
          <div className="text-center mb-8 lg:mb-10">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white mb-3 lg:mb-4">
              {t('contact.title')}
            </h1>
            <p className="text-base lg:text-lg xl:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('contact.subtitle')}
            </p>
          </div>

          {/* Contenu principal en grid - Optimisé pour desktop et mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-12 flex-1">
            {/* Section informations de contact */}
            <div className="space-y-4 lg:space-y-4">
              <div>
                <h2 className="text-lg sm:text-xl lg:text-xl font-semibold text-gray-900 dark:text-white mb-3 lg:mb-4">
                  {t('contact.info.title')}
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 lg:w-10 lg:h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail size={16} className="text-primary-600 lg:w-5 lg:h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm lg:text-base">
                        {t('contact.info.email')}
                      </h3>
                      <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 break-all">contact@neuraweb.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 lg:w-10 lg:h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone size={16} className="text-primary-600 lg:w-5 lg:h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm lg:text-base">
                        {t('contact.info.phone')}
                      </h3>
                      <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 lg:w-10 lg:h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin size={16} className="text-primary-600 lg:w-5 lg:h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm lg:text-base">
                        {t('contact.info.location')}
                      </h3>
                      <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300">
                        {t('contact.info.location.value')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section "Pourquoi nous choisir" - Plus compacte */}
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-4 text-white">
                <h3 className="text-base lg:text-lg font-semibold mb-2">
                  {t('contact.why.title')}
                </h3>
                <ul className="space-y-1 text-sm">
                  <li>• {t('contact.why.experience')}</li>
                  <li>• {t('contact.why.tech')}</li>
                  <li>• {t('contact.why.support')}</li>
                  <li>• {t('contact.why.pricing')}</li>
                </ul>
              </div>
            </div>

            {/* Formulaire de contact - Optimisé */}
            <div className="">
              <div className="card h-full flex flex-col">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 lg:space-y-4 flex-1 flex flex-col">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('contact.name')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      {...register('name', { required: t('common.name.required') })}
                      className="input-field h-10 lg:h-11"
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs lg:text-sm text-error-600">{errors.name.message}</p>
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
                      className="input-field h-10 lg:h-11"
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs lg:text-sm text-error-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('contact.message')}
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      {...register('message', { required: t('common.message.required') })}
                      className="input-field resize-none flex-1 min-h-[100px] lg:min-h-[120px]"
                      placeholder={t('contact.message')}
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs lg:text-sm text-error-600">{errors.message.message}</p>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed py-3 lg:py-3"
                    >
                      {isSubmitting ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Send size={18} />
                          <span className="text-sm lg:text-base">{t('contact.send')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;