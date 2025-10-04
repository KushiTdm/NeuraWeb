// frontend/src/sections/AboutSection.tsx
import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const AboutSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="section-snap bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="animate-on-scroll fade-left">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=700&h=500&fit=crop" 
                alt={t('about.image.alt')}
                className="rounded-3xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl -z-10"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full -z-10 animate-pulse"></div>
            </div>
          </div>

          <div className="animate-on-scroll fade-right">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t('about.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              {t('about.description')}
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-2xl transform hover:scale-105 transition-transform">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">100%</div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('about.stat.projects')}</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-orange-50 dark:from-pink-900 dark:to-orange-900 rounded-2xl transform hover:scale-105 transition-transform">
                <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent mb-2">24/7</div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('about.stat.support')}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {['React', 'Node.js', 'Python', 'AWS', 'MongoDB', 'TypeScript'].map((tech, index) => (
                <span 
                  key={index}
                  className="px-5 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold transform hover:scale-110 transition-transform cursor-pointer"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};