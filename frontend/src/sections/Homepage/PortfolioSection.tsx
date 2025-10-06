// frontend/src/sections/PortfolioSection.tsx
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface Project {
  titleKey: string;
  descriptionKey: string;
  image: string;
  technologies: string[];
  category: string;
}

const portfolio: Project[] = [
  {
    titleKey: 'portfolio.ecommerce.title',
    descriptionKey: 'portfolio.ecommerce.description',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop',
    technologies: ['React', 'Node.js', 'Stripe'],
    category: 'web'
  },
  {
    titleKey: 'portfolio.fitness.title',
    descriptionKey: 'portfolio.fitness.description',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop',
    technologies: ['React Native', 'Firebase'],
    category: 'mobile'
  },
  {
    titleKey: 'portfolio.chatbot.title',
    descriptionKey: 'portfolio.chatbot.description',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
    technologies: ['Python', 'OpenAI', 'FastAPI'],
    category: 'ai'
  },
  {
    titleKey: 'portfolio.dashboard.title',
    descriptionKey: 'portfolio.dashboard.description',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    technologies: ['React', 'D3.js', 'MongoDB'],
    category: 'web'
  },
  {
    titleKey: 'portfolio.booking.title',
    descriptionKey: 'portfolio.booking.description',
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&h=400&fit=crop',
    technologies: ['Vue.js', 'Laravel', 'MySQL'],
    category: 'web'
  },
  {
    titleKey: 'portfolio.automation.title',
    descriptionKey: 'portfolio.automation.description',
    image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&h=400&fit=crop',
    technologies: ['Docker', 'Jenkins', 'AWS'],
    category: 'automation'
  }
];

export const PortfolioSection: React.FC = () => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
    script.async = true;
    script.onload = () => {
      initAnimations();
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (window.gsap && cardsRef.current.length > 0) {
      updateCarousel();
    }
  }, [currentIndex]);

  useEffect(() => {
    if (isAutoPlay) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % portfolio.length);
      }, 4000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlay]);

  const initAnimations = () => {
    if (!window.gsap) return;

    window.gsap.from('.portfolio-title', {
      duration: 1,
      y: -50,
      opacity: 0,
      ease: 'power3.out'
    });

    updateCarousel();
  };

  const updateCarousel = () => {
    if (!window.gsap || cardsRef.current.length === 0) return;

    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      const offset = index - currentIndex;
      const absOffset = Math.abs(offset);
      
      let x = offset * 320;
      let z = -absOffset * 200;
      let scale = 1 - absOffset * 0.2;
      let opacity = absOffset <= 1 ? 1 : 0.3;
      let rotateY = offset * 15;

      if (window.innerWidth < 768) {
        x = offset * 260;
        z = -absOffset * 120;
        scale = 1 - absOffset * 0.15;
      }

      window.gsap.to(card, {
        duration: 0.8,
        x: x,
        z: z,
        scale: scale,
        opacity: opacity,
        rotateY: rotateY,
        ease: 'power2.out',
        zIndex: 100 - absOffset
      });
    });
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % portfolio.length);
    setIsAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + portfolio.length) % portfolio.length);
    setIsAutoPlay(false);
  };

  const openProject = (project: Project) => {
    setSelectedProject(project);
    setIsAutoPlay(false);
    if (window.gsap) {
      window.gsap.from('.modal-content', {
        duration: 0.5,
        scale: 0.5,
        opacity: 0,
        ease: 'back.out(1.7)'
      });
    }
  };

  const closeProject = () => {
    if (window.gsap) {
      window.gsap.to('.modal-content', {
        duration: 0.3,
        scale: 0.5,
        opacity: 0,
        ease: 'power2.in',
        onComplete: () => {
          setSelectedProject(null);
          setIsAutoPlay(true);
        }
      });
    } else {
      setSelectedProject(null);
      setIsAutoPlay(true);
    }
  };

 return (
  <>
    <section className="section-snap bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50 overflow-hidden relative min-h-screen">
      <div className="max-w-7xl mx-auto h-full min-h-screen flex flex-col justify-center px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-4 md:mb-6 relative z-[60]">
          <h2 className="portfolio-title text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            {t('portfolio.section.title.start')} <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">{t('portfolio.section.title.highlight')}</span>
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-gray-700 dark:text-gray-100 max-w-2xl mx-auto">
            {t('portfolio.section.subtitle')}
          </p>
        </div>

        {/* 3D Carousel */}
        <div className="flex-1 relative max-h-[450px] md:max-h-[500px]" style={{ perspective: '1500px' }}>
          <div 
            ref={carouselRef}
            className="absolute inset-0 flex items-center justify-center"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {portfolio.map((project, index) => (
              <div
                key={index}
                ref={el => cardsRef.current[index] = el}
                className="carousel-card absolute w-60 sm:w-64 md:w-72 lg:w-80 cursor-pointer"
                style={{ transformStyle: 'preserve-3d' }}
                onClick={() => index === currentIndex && openProject(project)}
              >
                <div className="bg-white dark:bg-gray-800/90 dark:backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl dark:shadow-2xl border border-gray-200 dark:border-white/20 transition-all duration-300 hover:border-purple-400 dark:hover:border-purple-400">
                  <div className="relative h-36 sm:h-40 md:h-48 overflow-hidden">
                    <img
                      src={project.image}
                      alt={t(project.titleKey)}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  </div>
                  <div className="p-4 md:p-5 lg:p-6">
                    <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {t(project.titleKey)}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-100 mb-3 text-xs md:text-sm line-clamp-2">
                      {t(project.descriptionKey)}
                    </p>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 md:px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-500/30 dark:to-purple-500/30 text-blue-600 dark:text-blue-200 rounded-full text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-4 lg:left-8 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 backdrop-blur-sm text-gray-900 dark:text-white p-2 md:p-3 rounded-full transition-all duration-300 hover:scale-110 z-50 shadow-lg"
            aria-label={t('portfolio.nav.previous')}
          >
            <ChevronLeft size={20} className="md:w-6 md:h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-4 lg:right-8 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 backdrop-blur-sm text-gray-900 dark:text-white p-2 md:p-3 rounded-full transition-all duration-300 hover:scale-110 z-50 shadow-lg"
            aria-label={t('portfolio.nav.next')}
          >
            <ChevronRight size={20} className="md:w-6 md:h-6" />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-4 md:mt-6 relative z-[60]">
          {portfolio.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsAutoPlay(false);
              }}
              className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-6 md:w-8 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400' 
                  : 'w-1.5 md:w-2 bg-gray-300 dark:bg-white/30 hover:bg-gray-400 dark:hover:bg-white/50'
              }`}
              aria-label={t('portfolio.nav.goto') + ` ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>

    {/* Modal */}
    {selectedProject && (
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
        onClick={closeProject}
      >
        <div 
          className="modal-content bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-auto border border-gray-200 dark:border-purple-500/30 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <img
              src={selectedProject.image}
              alt={t(selectedProject.titleKey)}
              className="w-full h-48 md:h-64 lg:h-96 object-cover rounded-t-3xl"
            />
            <button
              onClick={closeProject}
              className="absolute top-4 right-4 bg-white/90 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 backdrop-blur-sm text-gray-900 dark:text-white p-2 rounded-full transition-all duration-300"
              aria-label={t('portfolio.modal.close')}
            >
              <X size={24} />
            </button>
          </div>
          <div className="p-6 md:p-8">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t(selectedProject.titleKey)}
            </h3>
            <p className="text-gray-700 dark:text-gray-100 text-base md:text-lg mb-6">
              {t(selectedProject.descriptionKey)}
            </p>
            <div className="flex flex-wrap gap-3 mb-6">
              {selectedProject.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
            <button className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white px-8 py-3 rounded-full font-bold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105">
              {t('portfolio.modal.view')}
            </button>
          </div>
        </div>
      </div>
    )}
  </>
);
};