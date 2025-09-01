// frontend/src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Bot, Brain, Zap, Shield, Headphones } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const HomePage: React.FC = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: Code,
      titleKey: 'services.web.title',
      descKey: 'services.web.desc',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Bot,
      titleKey: 'services.automation.title',
      descKey: 'services.automation.desc',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Brain,
      titleKey: 'services.ai.title',
      descKey: 'services.ai.desc',
      color: 'from-pink-500 to-pink-600',
    },
  ];

  const features = [
    { 
      icon: Zap, 
      titleKey: 'home.features.fast.title', 
      descKey: 'home.features.fast.desc' 
    },
    { 
      icon: Shield, 
      titleKey: 'home.features.secure.title', 
      descKey: 'home.features.secure.desc' 
    },
    { 
      icon: Headphones, 
      titleKey: 'home.features.support.title', 
      descKey: 'home.features.support.desc' 
    },
  ];

  return (
    <div className="homepage-container">
      <style>{`
        /* Container principal avec scroll snapping adaptatif */
        .homepage-container {
          overflow-y: auto;
          scroll-behavior: smooth;
        }

        /* Desktop: scroll snapping activé */
        @media (min-width: 1024px) {
          .homepage-container {
            height: 100vh;
            overflow-y: scroll;
            scroll-snap-type: y mandatory;
          }
          
          .section-snap {
            height: 100vh;
            scroll-snap-align: start;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .cta-footer-section {
            height: 100vh;
            scroll-snap-align: start;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
        }

        /* Mobile et tablette: pas de scroll snapping, hauteurs adaptatives */
        @media (max-width: 1023px) {
          .section-snap {
            min-height: 100vh;
            padding: 4rem 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .cta-footer-section {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
        }

        /* Mobile spécifique */
        @media (max-width: 768px) {
          .section-snap {
            min-height: auto;
            padding: 3rem 0;
          }
          
          .hero-section {
            min-height: 100vh;
            padding: 2rem 0;
          }
          
          .hero-title {
            font-size: 2.25rem !important;
            line-height: 1.2 !important;
            margin-bottom: 1.5rem !important;
          }
          
          .hero-subtitle {
            font-size: 1.125rem !important;
            margin-bottom: 2rem !important;
            padding: 0 1rem;
          }
          
          .section-title {
            font-size: 1.875rem !important;
            margin-bottom: 1rem !important;
            padding: 0 1rem;
          }
          
          .service-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
            padding: 0 1rem;
            max-height: none !important;
          }
          
          .features-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
            padding: 0 1rem;
            max-height: none !important;
          }
          
          .service-card {
            padding: 1.5rem !important;
            margin-bottom: 0;
          }
          
          .feature-item {
            padding: 1rem;
            text-align: center;
          }
          
          .cta-buttons {
            flex-direction: column !important;
            gap: 1rem !important;
            padding: 0 1rem;
          }
          
          .cta-buttons .btn-primary,
          .cta-buttons .btn-outline,
          .cta-buttons a {
            width: 100%;
            text-align: center;
            padding: 0.875rem 2rem;
          }
          
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
            text-align: center !important;
          }
          
          .footer-section {
            text-align: center !important;
          }
          
          .section-content {
            padding: 2rem 1rem !important;
          }
          
          .cta-content {
            padding: 2rem 1rem !important;
          }
          
          .footer-content {
            padding: 2rem 1rem !important;
          }
        }

        /* Très petits écrans */
        @media (max-width: 480px) {
          .hero-title {
            font-size: 1.875rem !important;
            padding: 0 0.5rem;
          }
          
          .hero-subtitle {
            font-size: 1rem !important;
            padding: 0 0.5rem;
          }
          
          .section-title {
            font-size: 1.5rem !important;
            padding: 0 0.5rem;
          }
          
          .service-card {
            padding: 1rem !important;
          }
          
          .service-card h3 {
            font-size: 1.25rem !important;
          }
          
          .feature-title {
            font-size: 1.125rem !important;
          }
          
          .service-grid,
          .features-grid {
            padding: 0 0.5rem;
            gap: 1rem !important;
          }
          
          .cta-buttons {
            padding: 0 0.5rem;
          }
          
          .section-content {
            padding: 1.5rem 0.5rem !important;
          }
          
          .cta-content {
            padding: 1.5rem 0.5rem !important;
          }
        }

        /* Tablettes portrait */
        @media (min-width: 769px) and (max-width: 1023px) {
          .service-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 2rem !important;
            max-height: none !important;
          }
          
          .features-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 2rem !important;
            max-height: none !important;
          }
          
          .hero-title {
            font-size: 3rem !important;
          }
          
          .hero-subtitle {
            font-size: 1.25rem !important;
          }
        }

        /* Tablettes paysage et petits desktops */
        @media (min-width: 1024px) and (max-width: 1279px) {
          .hero-title {
            font-size: 3.5rem !important;
          }
          
          .service-grid {
            max-height: 60vh;
          }
          
          .features-grid {
            max-height: 50vh;
          }
        }

        /* Amélioration de l'accessibilité */
        @media (prefers-reduced-motion: reduce) {
          .homepage-container {
            scroll-behavior: auto;
          }
        }

        /* Ajustements pour les écrans courts */
        @media (max-height: 700px) and (min-width: 1024px) {
          .service-grid,
          .features-grid {
            max-height: none !important;
          }
          
          .section-snap {
            min-height: 100vh;
            height: auto;
            padding: 2rem 0;
          }
        }
        
        /* Ajustements pour les écrans très courts sur mobile */
        @media (max-height: 600px) and (max-width: 768px) {
          .hero-section {
            min-height: auto;
            padding: 1.5rem 0;
          }
          
          .section-snap {
            min-height: auto;
            padding: 2rem 0;
          }
          
          .cta-footer-section {
            min-height: auto;
          }
        }
      `}</style>

      <div className="animate-fade-in">
        {/* Hero Section */}
        <section className="hero-section section-snap relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center section-content">
            <div className="animate-slide-up">
              <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                {t('home.hero.title')}
              </h1>
              <p className="hero-subtitle text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                {t('home.hero.subtitle')}
              </p>
              <div className="cta-buttons flex flex-col sm:flex-row gap-4 justify-center max-w-md sm:max-w-none mx-auto">
                <Link 
                  to="/contact" 
                  className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 inline-flex items-center justify-center space-x-2 group"
                >
                  <span>{t('home.hero.cta1')}</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/quote" 
                  className="btn-outline text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 inline-flex items-center justify-center"
                >
                  {t('home.hero.cta2')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="section-snap bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full section-content">
            <div className="text-center mb-8 lg:mb-12">
              <h2 className="section-title text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t('services.title')}
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
                {t('home.services.subtitle')}
              </p>
            </div>

            <div className="service-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-h-none lg:max-h-[60vh] items-stretch">
              {services.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <div
                    key={index}
                    className="service-card card hover:shadow-xl transition-all duration-300 group cursor-pointer transform hover:-translate-y-2 p-6"
                  >
                    <div className={`w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r ${service.color} rounded-lg flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform mx-auto sm:mx-0`}>
                      <IconComponent size={24} className="sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 text-center sm:text-left">
                      {t(service.titleKey)}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed text-center sm:text-left">
                      {t(service.descKey)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="section-snap bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full section-content">
            <div className="text-center mb-8 lg:mb-12">
              <h2 className="section-title text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t('home.features.title')}
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
                {t('home.features.subtitle')}
              </p>
            </div>

            <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-h-none lg:max-h-[50vh] items-center">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="feature-item text-center p-4">
                    <div className="w-12 sm:w-16 h-12 sm:h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <IconComponent size={24} className="sm:w-8 sm:h-8 text-primary-600" />
                    </div>
                    <h3 className="feature-title text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                      {t(feature.titleKey)}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 px-2">
                      {t(feature.descKey)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section avec Footer intégré */}
        <section className="cta-footer-section bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
          {/* CTA Content */}
          <div className="flex-1 flex items-center justify-center py-8 lg:py-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full cta-content">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                {t('home.hero.cta.ready')}
              </h2>
              <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
                {t('home.hero.cta.discuss')}
              </p>
              <div className="cta-buttons flex flex-col sm:flex-row gap-4 justify-center max-w-md sm:max-w-none mx-auto">
                <Link 
                  to="/booking" 
                  className="bg-white text-primary-600 font-medium py-3 px-6 sm:px-8 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
                >
                  {t('nav.booking')}
                </Link>
                <Link 
                  to="/quote" 
                  className="border-2 border-white text-white font-medium py-3 px-6 sm:px-8 rounded-lg hover:bg-white hover:text-primary-600 transition-colors inline-flex items-center justify-center"
                >
                  {t('nav.quote')}
                </Link>
              </div>
            </div>
          </div>

          {/* Footer intégré */}
          <footer className="bg-black/20 backdrop-blur-sm border-t border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 footer-content">
              <div className="footer-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                {/* Company Info */}
                <div className="footer-section text-center sm:text-left">
                  <Link to="/" className="flex items-center justify-center sm:justify-start space-x-2 mb-3">
                    <img 
                      src="/assets/neurawebW.png"
                      alt="NeuraWeb Logo" 
                      className="h-6 w-auto object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div 
                      className="w-6 h-6 bg-gradient-to-r from-primary-300 to-secondary-300 rounded-lg flex items-center justify-center"
                      style={{ display: 'none' }}
                    >
                      <span className="text-white font-bold text-xs">NW</span>
                    </div>
                  </Link>
                  <p className="text-white/80 text-xs mb-2 max-w-sm mx-auto sm:mx-0">
                    {t('footer.company.description')}
                  </p>
                  <div className="text-white/70 text-xs">
                    <div className="mb-1">contact@neuraweb.tech</div>
                    <div>+1 (555) 123-4567</div>
                  </div>
                </div>

                {/* Services */}
                <div className="footer-section text-center">
                  <h4 className="text-white font-medium mb-3">{t('services.title')}</h4>
                  <ul className="space-y-2 text-white/80 text-xs">
                    <li>{t('services.web.title')}</li>
                    <li>{t('services.automation.title')}</li>
                    <li>{t('services.ai.title')}</li>
                  </ul>
                </div>

                {/* Quick Links */}
                <div className="footer-section text-center sm:col-span-2 lg:col-span-1 lg:text-right">
                  <h4 className="text-white font-medium mb-3">{t('footer.links.title')}</h4>
                  <ul className="space-y-2 text-white/80 text-xs">
                    <li>
                      <Link to="/contact" className="hover:text-white transition-colors">
                        {t('nav.contact')}
                      </Link>
                    </li>
                    <li>
                      <Link to="/quote" className="hover:text-white transition-colors">
                        {t('nav.quote')}
                      </Link>
                    </li>
                    <li>
                      <Link to="/booking" className="hover:text-white transition-colors">
                        {t('nav.booking')}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-white/20 mt-6 pt-4 text-center text-white/60 text-xs">
                <p>{t('footer.copyright')}</p>
              </div>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
};

export default HomePage;