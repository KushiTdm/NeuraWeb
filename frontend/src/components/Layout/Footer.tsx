// frontend/src/components/Layout/Footer.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-black/20 backdrop-blur-sm border-t border-white/20">
      <style>{`
        /* Styles responsifs pour le footer */
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
            text-align: center !important;
          }
          
          .footer-section {
            text-align: center !important;
          }
          
          .footer-content {
            padding: 2rem 1rem !important;
          }
        }

        @media (max-width: 480px) {
          .footer-content {
            padding: 1.5rem 0.5rem !important;
          }
        }
      `}</style>
      
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
            </div>
          </div>

          {/* Services */}
          <div className="footer-section text-center">
            <h4 className="text-white font-medium mb-3">Services</h4>
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
  );
};

export default Footer;