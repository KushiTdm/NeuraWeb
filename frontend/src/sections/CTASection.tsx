import React from 'react';
import { Clock, Target, Sparkles, TrendingUp, Shield, Headphones } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const CTASection: React.FC = () => {
  const { t } = useLanguage();

  return(
  <section className="section-snap bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden min-h-screen flex items-center justify-center">
    <div className="absolute inset-0">
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${3 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`
          }}
        />
      ))}
    </div>

     <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12 md:py-16 w-full">
      <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 animate-pulse" />
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 animate-on-scroll fade-up px-4">
        {t('cta.title')}
      </h2>
      <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 md:mb-10 max-w-3xl mx-auto opacity-90 animate-on-scroll fade-up delay-200 px-4">
        {t('cta.subtitle')}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center animate-on-scroll fade-up delay-400 px-4">
        <a 
          href="/booking" 
          className="bg-white text-purple-600 font-bold py-3 px-6 sm:py-4 sm:px-8 md:py-5 md:px-10 rounded-full hover:bg-gray-100 transition-all transform hover:scale-110 shadow-2xl inline-flex items-center justify-center text-base md:text-lg"
        >
          <Clock className="mr-2 w-5 h-5 md:w-6 md:h-6" />
          {t('cta.bookCall')}
        </a>
        <a 
          href="/quote" 
          className="border-2 sm:border-4 border-white text-white font-bold py-3 px-6 sm:py-4 sm:px-8 md:py-5 md:px-10 rounded-full hover:bg-white hover:text-purple-600 transition-all transform hover:scale-110 inline-flex items-center justify-center text-base md:text-lg"
        >
          <Target className="mr-2 w-5 h-5 md:w-6 md:h-6" />
          {t('cta.requestQuote')}
        </a>
      </div>

      <div className="mt-10 md:mt-16 flex justify-center gap-6 sm:gap-8 md:gap-12 flex-wrap px-4">
        <div className="text-center">
          <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-2" />
          <div className="text-xs sm:text-sm opacity-80">{t('cta.guaranteedGrowth')}</div>
        </div>
        <div className="text-center">
          <Shield className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-2" />
          <div className="text-xs sm:text-sm opacity-80">{t('cta.secure')}</div>
        </div>
        <div className="text-center">
          <Headphones className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-2" />
          <div className="text-xs sm:text-sm opacity-80">{t('cta.dedicatedSupport')}</div>
        </div>
      </div>
    </div>

    <style>{`
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }

      .animate-on-scroll {
        opacity: 0;
        animation: fadeUp 0.8s ease-out forwards;
      }

      .delay-200 {
        animation-delay: 0.2s;
      }

      .delay-400 {
        animation-delay: 0.4s;
      }

      @keyframes fadeUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}</style>
  </section>
);
}