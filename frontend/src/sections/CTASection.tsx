import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Target, Sparkles, TrendingUp, Shield, Headphones } from 'lucide-react';

export const CTASection: React.FC = () => (
  <section className="section-snap bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
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

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <Sparkles className="w-20 h-20 mx-auto mb-6 animate-pulse" />
      <h2 className="text-5xl lg:text-6xl font-bold mb-6 animate-on-scroll fade-up">
        Prêt à Transformer Votre Vision ?
      </h2>
      <p className="text-2xl mb-10 max-w-3xl mx-auto opacity-90 animate-on-scroll fade-up delay-200">
        Discutons de votre projet et créons ensemble quelque chose d'extraordinaire
      </p>

      <div className="flex flex-col sm:flex-row gap-6 justify-center animate-on-scroll fade-up delay-400">
        <Link 
          to="/booking" 
          className="bg-white text-purple-600 font-bold py-5 px-10 rounded-full hover:bg-gray-100 transition-all transform hover:scale-110 shadow-2xl inline-flex items-center justify-center text-lg"
        >
          <Clock className="mr-2" />
          Réserver un Appel
        </Link>
        <Link 
          to="/quote" 
          className="border-4 border-white text-white font-bold py-5 px-10 rounded-full hover:bg-white hover:text-purple-600 transition-all transform hover:scale-110 inline-flex items-center justify-center text-lg"
        >
          <Target className="mr-2" />
          Demander un Devis
        </Link>
      </div>

      <div className="mt-16 flex justify-center gap-8 flex-wrap">
        <div className="text-center">
          <TrendingUp className="w-12 h-12 mx-auto mb-2" />
          <div className="text-sm opacity-80">Croissance Garantie</div>
        </div>
        <div className="text-center">
          <Shield className="w-12 h-12 mx-auto mb-2" />
          <div className="text-sm opacity-80">100% Sécurisé</div>
        </div>
        <div className="text-center">
          <Headphones className="w-12 h-12 mx-auto mb-2" />
          <div className="text-sm opacity-80">Support Dédié</div>
        </div>
      </div>
    </div>
  </section>
);