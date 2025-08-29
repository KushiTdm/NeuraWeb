// frontend/src/components/Layout/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <img 
                src="/assets/neurawebW.png"
                alt="NeuraWeb Logo" 
                className="h-8 w-auto object-contain"
                onError={(e) => {
                  // Fallback en cas d'erreur de chargement du logo
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              {/* Fallback logo en cas d'erreur */}
              <div 
                className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center"
                style={{ display: 'none' }}
              >
                <span className="text-white font-bold text-sm">NW</span>
              </div>
            </Link>
            <p className="text-gray-400 mb-4">
              {t('footer.company.description')}
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail size={16} />
                <span>contact@neuraweb.tech</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Phone size={16} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <MapPin size={16} />
                <span>{t('contact.info.location.value')}</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">{t('services.title')}</h3>
            <ul className="space-y-2 text-gray-400">
              <li>{t('services.web.title')}</li>
              <li>{t('footer.services.ecommerce')}</li>
              <li>{t('services.automation.title')}</li>
              <li>{t('services.ai.title')}</li>
              <li>{t('footer.services.maintenance')}</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">{t('footer.links.title')}</h3>
            <ul className="space-y-2 text-gray-400">
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
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">
                  {t('footer.links.admin')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;