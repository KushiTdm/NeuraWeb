// frontend/src/sections/HeroSection.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  mousePosition: { x: number; y: number };
  onScrollToNext?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ mousePosition, onScrollToNext }) => {
  const handleStartProject = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onScrollToNext) {
      onScrollToNext();
    }
  };

  return (
    <section className="section-snap relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <div 
          className="transform transition-transform duration-300"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 animate-on-scroll fade-up">
            Transformons vos <span className="gradient-text">idées</span> en réalité
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto animate-on-scroll fade-up delay-200">
            Solutions digitales sur mesure pour propulser votre entreprise vers le futur
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-on-scroll fade-up delay-400">
            <button
              onClick={handleStartProject}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-4 rounded-full hover:shadow-2xl transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center group"
            >
              <span>Démarrer un Projet</span>
              <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
            </button>
            <Link 
              to="/quote" 
              className="border-2 border-purple-600 text-purple-600 dark:text-purple-400 font-semibold px-8 py-4 rounded-full hover:bg-purple-600 hover:text-white transition-all duration-300"
            >
              Obtenir un Devis
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};