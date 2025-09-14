// frontend/src/components/Layout/Header.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Globe, User, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  // Effet pour détecter le scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Détermine si on est sur la homepage
  const isHomePage = location.pathname === '/';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled || !isHomePage
        ? 'bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700'
        : 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={isDark ? "/assets/neurawebW.png" : "/assets/neurawebB.png"}
              alt="NeuraWeb Logo" 
              className="h-14 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div 
              className="h-14 w-14 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center"
              style={{ display: 'none' }}
            >
              <span className="text-white font-bold text-lg">NW</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`font-medium transition-colors duration-200 ${
                isActive('/') ? 'text-primary-600' : 'text-gray-700 dark:text-gray-300 hover:text-primary-600'
              }`}
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/contact"
              className={`font-medium transition-colors duration-200 ${
                isActive('/contact') ? 'text-primary-600' : 'text-gray-700 dark:text-gray-300 hover:text-primary-600'
              }`}
            >
              {t('nav.contact')}
            </Link>
            {/* DÉSACTIVÉ - Bouton Devis */}
            {/* 
            <Link
              to="/quote"
              className={`font-medium transition-colors duration-200 ${
                isActive('/quote') ? 'text-primary-600' : 'text-gray-700 dark:text-gray-300 hover:text-primary-600'
              }`}
            >
              {t('nav.quote')}
            </Link>
            */}
            <Link
              to="/booking"
              className="btn-primary"
            >
              {t('nav.booking')}
            </Link>
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* User Authentication Section */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                  <User size={16} />
                  <span className="text-sm">{user?.name}</span>
                </div>
                {user?.type === 'client' && user?.isValidated && (
                  <Link
                    to="/wizard"
                    className="text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    Project Wizard
                  </Link>
                )}
                {user?.type === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-label={t('header.logout')}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors"
                >
                  {t('nav.login')}
                </Link>
                {/* DÉSACTIVÉ - Bouton S'inscrire */}
                {/* 
                <Link
                  to="/register"
                  className="text-sm font-medium btn-primary px-4 py-2"
                >
                  {t('nav.register')}
                </Link>
                */}
              </div>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label={t('header.toggle.theme')}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center space-x-1"
              aria-label={t('header.toggle.language')}
            >
              <Globe size={20} />
              <span className="text-sm font-medium">{language.toUpperCase()}</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              aria-label={t('header.toggle.menu')}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col space-y-4">
              {/* Navigation Links */}
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`font-medium transition-colors duration-200 ${
                  isActive('/') ? 'text-primary-600' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className={`font-medium transition-colors duration-200 ${
                  isActive('/contact') ? 'text-primary-600' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {t('nav.contact')}
              </Link>
              {/* DÉSACTIVÉ - Lien Devis mobile */}
              {/* 
              <Link
                to="/quote"
                onClick={() => setIsMenuOpen(false)}
                className={`font-medium transition-colors duration-200 ${
                  isActive('/quote') ? 'text-primary-600' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {t('nav.quote')}
              </Link>
              */}
              <Link
                to="/booking"
                onClick={() => setIsMenuOpen(false)}
                className="btn-primary inline-block text-center"
              >
                {t('nav.booking')}
              </Link>

              {/* Mobile Authentication Section */}
              {isAuthenticated ? (
                <>
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 mb-4">
                      <User size={16} />
                      <span className="text-sm">{user?.name}</span>
                    </div>
                    {user?.type === 'client' && user?.isValidated && (
                      <Link
                        to="/wizard"
                        onClick={() => setIsMenuOpen(false)}
                        className="block text-sm font-medium text-primary-600 hover:text-primary-700 mb-4"
                      >
                        Project Wizard
                      </Link>
                    )}
                    {user?.type === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className="block text-sm font-medium text-primary-600 hover:text-primary-700 mb-4"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      <LogOut size={16} />
                      <span>{t('nav.logout')}</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600"
                  >
                    {t('nav.login')}
                  </Link>
                  {/* DÉSACTIVÉ - Lien S'inscrire mobile */}
                  {/* 
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block btn-primary text-center text-sm"
                  >
                    {t('nav.register')}
                  </Link>
                  */}
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;