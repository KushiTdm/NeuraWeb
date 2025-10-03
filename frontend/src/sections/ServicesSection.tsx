import React from 'react';
import { Code, Bot, Brain } from 'lucide-react';

const services = [
  {
    icon: Code,
    title: 'Développement Web',
    desc: 'Applications web modernes et performantes avec React, Node.js et les dernières technologies',
    color: 'from-blue-500 to-blue-600',
    screenshot: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop'
  },
  {
    icon: Bot,
    title: 'Automatisation',
    desc: 'Automatisation de vos processus métier pour gagner en productivité et efficacité',
    color: 'from-purple-500 to-purple-600',
    screenshot: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop'
  },
  {
    icon: Brain,
    title: 'Intelligence Artificielle',
    desc: 'Intégration d\'IA et de machine learning pour des solutions intelligentes et innovantes',
    color: 'from-pink-500 to-pink-600',
    screenshot: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop'
  },
];

export const ServicesSection: React.FC = () => (
  <section className="section-snap bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 animate-on-scroll fade-up">
          Les Outils de la Création
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-on-scroll fade-up delay-200">
          Des solutions complètes pour chaque aspect de votre transformation digitale
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, index) => {
          const IconComponent = service.icon;
          const direction = index % 2 === 0 ? 'fade-left' : 'fade-right';
          
          return (
            <div
              key={index}
              className={`service-card relative group animate-on-scroll ${direction} delay-${(index + 1) * 100}`}
            >
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <img 
                  src={service.screenshot} 
                  alt={service.title}
                  className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-900/70 backdrop-blur-sm" />
              </div>

              <div className="relative p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-transparent hover:shadow-2xl transition-all duration-300">
                <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {service.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);