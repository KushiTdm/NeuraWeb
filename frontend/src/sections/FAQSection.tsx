import React from 'react';

const faqs = [
  {
    question: 'Quel est le délai moyen pour un projet web ?',
    answer: 'Le délai varie selon la complexité du projet, de 2-4 semaines pour un site vitrine à 3-6 mois pour une application web complexe. Nous établissons un planning détaillé dès le départ.'
  },
  {
    question: 'Proposez-vous de la maintenance après livraison ?',
    answer: 'Oui, nous offrons des contrats de maintenance flexibles avec support technique, mises à jour de sécurité et évolutions fonctionnelles selon vos besoins.'
  },
  {
    question: 'Quelles technologies utilisez-vous ?',
    answer: 'Nous utilisons des technologies modernes et éprouvées : React, Node.js, Python, AWS, MongoDB, et bien d\'autres selon les besoins spécifiques de votre projet.'
  },
  {
    question: 'Comment se déroule le paiement ?',
    answer: 'Nous proposons un paiement échelonné : 30% au démarrage, 40% à mi-projet, et 30% à la livraison finale. Des arrangements personnalisés sont possibles.'
  }
];

export const FAQSection: React.FC = () => (
  <section className="section-snap bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 min-h-screen flex items-center justify-center">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4 animate-on-scroll fade-up">
          Questions Fréquentes
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 animate-on-scroll fade-up delay-200 px-4">
          Tout ce que vous devez savoir
        </p>
      </div>

      <div className="space-y-4 md:space-y-6">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-lg p-5 sm:p-6 md:p-8 transform hover:scale-102 transition-all duration-300 animate-on-scroll fade-up border-l-4 border-blue-500"
            style={{ animationDelay: `${(index + 1) * 100}ms` }}
          >
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4 flex items-start">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3 md:mr-4 flex-shrink-0 shadow-lg">
                <span className="text-white text-base sm:text-lg font-bold">?</span>
              </div>
              <span className="flex-1">{faq.question}</span>
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed ml-10 sm:ml-12">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </div>

    <style>{`
      .animate-on-scroll {
        opacity: 0;
        animation: fadeUp 0.8s ease-out forwards;
      }

      .delay-200 {
        animation-delay: 0.2s;
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

      .hover\:scale-102:hover {
        transform: scale(1.02);
      }
    `}</style>
  </section>
);