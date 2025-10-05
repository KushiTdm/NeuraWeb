import React, { useState, useEffect, useRef } from 'react';
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
  
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div className="min-h-screen bg-slate-950 overflow-hidden">
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
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

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Header */}
          <div className="text-center mb-12 lg:mb-16 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 lg:mb-6">
              {t('contact.title')}
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-white/70 max-w-3xl mx-auto">
              {t('contact.subtitle')}
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-12 lg:mb-16">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 lg:p-8 border border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-300 group animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 lg:mb-6 group-hover:rotate-6 transition-transform">
                <Mail className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3 className="text-lg lg:text-2xl font-bold text-white mb-2">
                {t('contact.info.email')}
              </h3>
              <a
                href="mailto:contact@neuraweb.com"
                className="text-sm lg:text-base text-blue-400 hover:text-blue-300 transition-colors break-all"
              >
                contact@neuraweb.com
              </a>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 lg:p-8 border border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-300 group animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 lg:mb-6 group-hover:rotate-6 transition-transform">
                <Phone className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3 className="text-lg lg:text-2xl font-bold text-white mb-2">
                {t('contact.info.phone')}
              </h3>
              <a
                href="tel:+15551234567"
                className="text-sm lg:text-base text-purple-400 hover:text-purple-300 transition-colors"
              >
                +1 (555) 123-4567
              </a>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 lg:p-8 border border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-300 group animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-pink-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 lg:mb-6 group-hover:rotate-6 transition-transform">
                <MapPin className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3 className="text-lg lg:text-2xl font-bold text-white mb-2">
                {t('contact.info.location')}
              </h3>
              <p className="text-sm lg:text-base text-pink-400">
                {t('contact.info.location.value')}
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left Column - Info */}
            <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 lg:p-8 border border-white/10">
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-4">
                  {t('contact.why.title')}
                </h3>
                <div className="space-y-3 text-sm lg:text-base text-white/60">
                  <p>• {t('contact.why.experience')}</p>
                  <p>• {t('contact.why.tech')}</p>
                  <p>• {t('contact.why.support')}</p>
                  <p>• {t('contact.why.pricing')}</p>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 lg:p-8 border border-white/10"
              >
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                  {t('contact.form.title')}
                </h3>

                <div className="space-y-5">
                  <div>
                    <label className="block text-white/80 font-medium mb-2 text-sm lg:text-base">
                      {t('contact.name')}
                    </label>
                    <input
                      type="text"
                      {...register('name', { required: t('common.name.required') })}
                      className="w-full px-4 lg:px-6 py-3 lg:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="mt-2 text-xs lg:text-sm text-red-400">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white/80 font-medium mb-2 text-sm lg:text-base">
                      {t('contact.email')}
                    </label>
                    <input
                      type="email"
                      {...register('email', { 
                        required: t('common.email.required'),
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: t('common.email.invalid')
                        }
                      })}
                      className="w-full px-4 lg:px-6 py-3 lg:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="mt-2 text-xs lg:text-sm text-red-400">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white/80 font-medium mb-2 text-sm lg:text-base">
                      {t('contact.message')}
                    </label>
                    <textarea
                      rows={5}
                      {...register('message', { required: t('common.message.required') })}
                      className="w-full px-4 lg:px-6 py-3 lg:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 resize-none"
                      placeholder={t('contact.message.placeholder')}
                    />
                    {errors.message && (
                      <p className="mt-2 text-xs lg:text-sm text-red-400">{errors.message.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 lg:px-8 py-3 lg:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <span className="text-sm lg:text-base">{t('contact.send')}</span>
                        <Send className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out backwards;
        }
      `}</style>
    </div>
  );
};

export default ContactPage;