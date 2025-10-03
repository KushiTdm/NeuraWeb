import React from 'react';
import { MessageCircle, Palette, Code, CheckCircle } from 'lucide-react';

const workProcess = [
  {
    step: '01',
    title: 'Consultation',
    description: 'Analyse approfondie de vos besoins et objectifs',
    icon: MessageCircle,
    color: 'from-blue-500 to-blue-600'
  },
  {
    step: '02',
    title: 'Design',
    description: 'Création de maquettes et prototypes interactifs',
    icon: Palette,
    color: 'from-purple-500 to-purple-600'
  },
  {
    step: '03',
    title: 'Développement',
    description: 'Codage avec les meilleures pratiques et technologies',
    icon: Code,
    color: 'from-pink-500 to-pink-600'
  },
  {
    step: '04',
    title: 'Tests & Livraison',
    description: 'Validation complète et déploiement en production',
    icon: CheckCircle,
    color: 'from-green-500 to-green-600'
  }
];

export const ProcessSection: React.FC = () => (
  <section className="section-snap bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 animate-on-scroll fade-up">
          Le Voyage de Votre Projet
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-on-scroll fade-up delay-200">
          Un processus éprouvé pour transformer vos idées en succès
        </p>
      </div>

      <div className="relative">
        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform -translate-y-1/2" style={{ zIndex: 0 }}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
          {workProcess.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div
                key={index}
                className={`text-center animate-on-scroll fade-up delay-${(index + 1) * 100}`}
              >
                <div className="relative mb-6">
                  <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 relative z-10 shadow-2xl transform hover:scale-110 transition-transform cursor-pointer`}>
                    <span className="text-3xl font-bold text-white">
                      {step.step}
                    </span>
                  </div>

                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20">
                    <div className={`absolute inset-0 bg-gradient-to-r ${step.color} rounded-full animate-ping opacity-20`}></div>
                  </div>

                  <div className="flex justify-center">
                    <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-lg border-4 border-gray-100 dark:border-gray-600">
                      <IconComponent className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-16 text-center">
        <div className="inline-flex items-center gap-4 bg-white dark:bg-gray-800 rounded-full px-8 py-4 shadow-xl">
          <div className="relative w-16 h-16">
            <svg className="transform -rotate-90 w-16 h-16">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="url(#progressGradient)"
                strokeWidth="4"
                fill="none"
                strokeDasharray="175.93"
                strokeDashoffset="44"
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-gray-900 dark:text-white">4</span>
            </div>
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#667eea" />
                <stop offset="100%" stopColor="#764ba2" />
              </linearGradient>
            </defs>
          </div>
          <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Étapes pour votre succès
          </span>
        </div>
      </div>
    </div>
  </section>
);