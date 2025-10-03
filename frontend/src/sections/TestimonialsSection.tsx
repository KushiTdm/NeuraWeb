import React, { useState, useEffect } from 'react';
import { Star, CheckCircle } from 'lucide-react';

const testimonials = [
  {
    name: 'Marie Dupont',
    company: 'TechCorp',
    text: 'Un travail exceptionnel sur notre site e-commerce. L\'équipe a su comprendre nos besoins et livrer un produit qui dépasse nos attentes.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=faces'
  },
  {
    name: 'Jean Martin',
    company: 'StartupX',
    text: 'Développement rapide et professionnel. Notre application mobile a été livrée dans les délais avec une qualité remarquable.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces'
  },
  {
    name: 'Sophie Chen',
    company: 'DigitalFlow',
    text: 'L\'intégration d\'IA dans notre workflow a révolutionné notre productivité. Un partenaire technique de confiance.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces'
  },
];

export const TestimonialsSection: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="section-snap bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 animate-on-scroll fade-up">
            Ils Nous Font Confiance
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-on-scroll fade-up delay-200">
            Des clients satisfaits qui parlent de leur expérience
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="relative h-96 overflow-hidden rounded-2xl">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`testimonial-card absolute inset-0 ${
                  index === currentTestimonial ? 'active' : 
                  index < currentTestimonial ? 'prev' : ''
                }`}
              >
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-12 h-full flex flex-col justify-center border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-8 h-8 text-yellow-400 fill-current animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                  <blockquote className="text-2xl text-gray-700 dark:text-gray-300 text-center mb-8 leading-relaxed italic">
                    "{testimonial.text}"
                  </blockquote>
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-20 h-20 rounded-full object-cover shadow-xl border-4 border-white dark:border-gray-700"
                      />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="ml-6 text-left">
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-lg text-gray-600 dark:text-gray-400">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8 space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentTestimonial 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 w-12 h-4' 
                    : 'bg-gray-300 dark:bg-gray-600 w-4 h-4 hover:bg-gray-400'
                }`}
              />
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
      `}</style>
    </section>
  );
};