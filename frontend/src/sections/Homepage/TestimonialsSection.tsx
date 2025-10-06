import React, { useState, useEffect } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const TestimonialsSection = () => {
  const { t } = useLanguage();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      nameKey: 'testimonials.marie.name',
      companyKey: 'testimonials.marie.company',
      textKey: 'testimonials.marie.text',
      rating: 5,
      avatar: 'assets/dupont.webp'
    },
    {
      nameKey: 'testimonials.jean.name',
      companyKey: 'testimonials.jean.company',
      textKey: 'testimonials.jean.text',
      rating: 5,
      avatar: 'assets/Martin.webp'
    },
    {
      nameKey: 'testimonials.sophie.name',
      companyKey: 'testimonials.sophie.company',
      textKey: 'testimonials.sophie.text',
      rating: 5,
      avatar: 'assets/chen.webp'
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="section-snap bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4 animate-on-scroll fade-up">
            {t('testimonials.title')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-on-scroll fade-up delay-200 px-4">
            {t('testimonials.subtitle')}
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="relative h-[450px] sm:h-[400px] md:h-96 overflow-hidden rounded-2xl">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`testimonial-card absolute inset-0 ${
                  index === currentTestimonial ? 'active' : 
                  index < currentTestimonial ? 'prev' : ''
                }`}
              >
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-6 sm:p-8 md:p-12 h-full flex flex-col justify-center border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-center mb-4 md:mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-yellow-400 fill-current animate-pulse" 
                        style={{ animationDelay: `${i * 0.1}s` }} 
                      />
                    ))}
                  </div>
                  <blockquote className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 text-center mb-6 md:mb-8 leading-relaxed italic px-2">
                    "{t(testimonial.textKey)}"
                  </blockquote>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0">
                    <div className="relative flex-shrink-0">
                      <img 
                        src={testimonial.avatar} 
                        alt={t(testimonial.nameKey)}
                        className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full object-cover shadow-xl border-4 border-white dark:border-gray-700"
                      />
                      <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                        <CheckCircle className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                      </div>
                    </div>
                    <div className="sm:ml-6 text-center sm:text-left">
                      <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                        {t(testimonial.nameKey)}
                      </div>
                      <div className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                        {t(testimonial.companyKey)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6 md:mt-8 space-x-2 md:space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`transition-all duration-300 rounded-full min-w-[44px] min-h-[44px] flex items-center justify-center ${
                  index === currentTestimonial 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                }`}
                aria-label={`${t('testimonials.viewTestimonial')} ${index + 1}`}
              >
                <span className={`block rounded-full transition-all duration-300 ${
                  index === currentTestimonial 
                    ? 'w-10 h-3 sm:w-12 sm:h-4' 
                    : 'w-3 h-3 sm:w-4 sm:h-4'
                }`} style={{ backgroundColor: index === currentTestimonial ? 'transparent' : 'currentColor' }} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .testimonial-card {
          opacity: 0;
          transform: translateX(100px);
          transition: all 0.5s ease;
        }

        .testimonial-card.active {
          opacity: 1;
          transform: translateX(0);
        }

        .testimonial-card.prev {
          opacity: 0;
          transform: translateX(-100px);
        }

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
      `}</style>
    </section>
  );
};

export default TestimonialsSection;