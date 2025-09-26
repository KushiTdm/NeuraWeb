// frontend/src/pages/HomePage.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Bot, Brain, Zap, Shield, Headphones, Star, Users, CheckCircle, Clock, Palette, Rocket, Award, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const services = [
    {
      icon: Code,
      titleKey: 'services.web.title',
      descKey: 'services.web.desc',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Bot,
      titleKey: 'services.automation.title',
      descKey: 'services.automation.desc',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Brain,
      titleKey: 'services.ai.title',
      descKey: 'services.ai.desc',
      color: 'from-pink-500 to-pink-600',
    },
  ];

  const features = [
    { 
      icon: Zap, 
      titleKey: 'home.features.fast.title', 
      descKey: 'home.features.fast.desc' 
    },
    { 
      icon: Shield, 
      titleKey: 'home.features.secure.title', 
      descKey: 'home.features.secure.desc' 
    },
    { 
      icon: Headphones, 
      titleKey: 'home.features.support.title', 
      descKey: 'home.features.support.desc' 
    },
  ];

  // Nouvelles données pour les sections ajoutées
  const stats = [
  { number: 50, labelKey: 'home.stats.projects.completed', icon: Rocket },
  { number: 25, labelKey: 'home.stats.satisfied.clients', icon: Users },
  { number: 5, labelKey: 'home.stats.years.experience', icon: Award },
];

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

  const portfolio = [
  {
    titleKey: 'home.portfolio.ecommerce.title',
    descriptionKey: 'home.portfolio.ecommerce.desc',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop',
    technologies: ['React', 'Node.js', 'Stripe'],
    category: 'web'
  },
  {
    titleKey: 'home.portfolio.mobile.title',
    descriptionKey: 'home.portfolio.mobile.desc',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop',
    technologies: ['React Native', 'Firebase'],
    category: 'mobile'
  },
  {
    titleKey: 'home.portfolio.ai.title',
    descriptionKey: 'home.portfolio.ai.desc',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop',
    technologies: ['Python', 'OpenAI', 'FastAPI'],
    category: 'ai'
  },
];

  const workProcess = [
  {
    step: '01',
    titleKey: 'home.process.consultation.title',
    descriptionKey: 'home.process.consultation.desc',
    icon: MessageCircle,
    color: 'from-blue-500 to-blue-600'
  },
  {
    step: '02', 
    titleKey: 'home.process.design.title',
    descriptionKey: 'home.process.design.desc',
    icon: Palette,
    color: 'from-purple-500 to-purple-600'
  },
  {
    step: '03',
    titleKey: 'home.process.development.title',
    descriptionKey: 'home.process.development.desc',
    icon: Code,
    color: 'from-pink-500 to-pink-600'
  },
  {
    step: '04',
    titleKey: 'home.process.testing.title',
    descriptionKey: 'home.process.testing.desc',
    icon: CheckCircle,
    color: 'from-green-500 to-green-600'
  },
];

  // Animation counter hook
  const useAnimatedCounter = (end: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      if (!isVisible) return;

      let startTime: number;
      let animationFrame: number;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        setCount(Math.floor(progress * end));
        
        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }, [isVisible, end, duration]);

    return { count, setIsVisible };
  };

  // Testimonial carousel effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Configuration de l'Intersection Observer pour les animations au scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          entry.target.classList.remove('animate-out');
        }
      });
    }, observerOptions);

    // Observer tous les éléments avec la classe animate-on-scroll
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach((el) => {
      if (observerRef.current) {
        observerRef.current.observe(el);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Composant AnimatedStat
  const AnimatedStat: React.FC<{ stat: typeof stats[0] }> = ({ stat }) => {
  const { count, setIsVisible } = useAnimatedCounter(stat.number);
  const [hasAnimated, setHasAnimated] = useState(false);
  const statRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true); // Marquer comme animé
        }
      },
      { threshold: 0.5 }
    );

    if (statRef.current) {
      observer.observe(statRef.current);
    }

    return () => observer.disconnect();
  }, [setIsVisible, hasAnimated]);

  return (
    <div 
      ref={statRef} 
      className={`text-center animate-on-scroll fade-up ${hasAnimated ? 'animate-in' : ''}`}
    >
      <div className="flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full mx-auto mb-4">
        <stat.icon className="w-8 h-8 text-primary-600" />
      </div>
      <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
        {hasAnimated ? count : 0}+
      </div>
      <div className="text-gray-600 dark:text-gray-300 font-medium">
        {t(stat.labelKey)}
      </div>
    </div>
  );
};

  return (
    <div className="homepage-container">
      <style>{`
        /* Container principal avec scroll snapping adaptatif */
        .homepage-container {
          overflow-y: auto;
          scroll-behavior: smooth;
        }

        /* Desktop: scroll snapping activé */
        @media (min-width: 1024px) {
          .homepage-container {
            height: 100vh;
            overflow-y: scroll;
            scroll-snap-type: y mandatory;
          }
          
          .section-snap {
            height: 100vh;
            scroll-snap-align: start;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .cta-footer-section {
            height: 100vh;
            scroll-snap-align: start;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
        }

        /* Mobile et tablette: pas de scroll snapping, hauteurs adaptatives */
        @media (max-width: 1023px) {
          .section-snap {
            min-height: 100vh;
            padding: 4rem 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .cta-footer-section {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
        }

        /* Animations au scroll */
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(50px);
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .animate-on-scroll.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        /* Animations spécifiques pour différents éléments */
        .fade-up {
          transform: translateY(60px);
        }

        .fade-up.animate-in {
          transform: translateY(0);
        }

        .fade-left {
          transform: translateX(-60px);
        }

        .fade-left.animate-in {
          transform: translateX(0);
        }

        .fade-right {
          transform: translateX(60px);
        }

        .fade-right.animate-in {
          transform: translateX(0);
        }

        .scale-up {
          transform: scale(0.8);
        }

        .scale-up.animate-in {
          transform: scale(1);
        }

        .rotate-in {
          transform: rotate(-10deg) scale(0.8);
        }

        .rotate-in.animate-in {
          transform: rotate(0deg) scale(1);
        }

        /* Délais d'animation pour un effet cascade */
        .delay-100 { transition-delay: 0.1s; }
        .delay-200 { transition-delay: 0.2s; }
        .delay-300 { transition-delay: 0.3s; }
        .delay-400 { transition-delay: 0.4s; }
        .delay-500 { transition-delay: 0.5s; }
        .delay-600 { transition-delay: 0.6s; }

        /* Animation pour les icônes */
        .icon-bounce {
          animation: iconFloat 3s ease-in-out infinite;
        }

        @keyframes iconFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        /* Animation pour le background du hero */
        .bg-grid-pattern {
          background-image: radial-gradient(circle, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: gridMove 20s linear infinite;
        }

        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 50px 50px; }
        }

        /* Hover effects améliorés */
        .service-card, .portfolio-card {
          transform: translateY(0);
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .service-card:hover, .portfolio-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .feature-item {
          transition: all 0.3s ease;
        }

        .feature-item:hover {
          transform: translateY(-5px);
        }

        /* Testimonial carousel */
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

        /* Process timeline */
        .process-step {
          position: relative;
        }

        .process-step::after {
          content: '';
          position: absolute;
          top: 50%;
          right: -50%;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, rgba(59, 130, 246, 0.3), transparent);
          transform: translateY(-50%);
        }

        .process-step:last-child::after {
          display: none;
        }

        /* Portfolio filter buttons */
        .filter-btn {
          transition: all 0.3s ease;
        }

        .filter-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          transform: translateY(-2px);
        }

        /* Mobile spécifique */
        @media (max-width: 768px) {
          .section-snap {
            min-height: auto;
            padding: 3rem 0;
          }
          
          .hero-section {
            min-height: 100vh;
            padding: 2rem 0;
          }
          
          .hero-title {
            font-size: 2.25rem !important;
            line-height: 1.2 !important;
            margin-bottom: 1.5rem !important;
          }
          
          .hero-subtitle {
            font-size: 1.125rem !important;
            margin-bottom: 2rem !important;
            padding: 0 1rem;
          }
          
          .section-title {
            font-size: 1.875rem !important;
            margin-bottom: 1rem !important;
            padding: 0 1rem;
          }
          
          .service-grid, .portfolio-grid, .process-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
            padding: 0 1rem;
            max-height: none !important;
          }
          
          .features-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
            padding: 0 1rem;
            max-height: none !important;
          }
          
          .service-card, .portfolio-card {
            padding: 1.5rem !important;
            margin-bottom: 0;
          }
          
          .feature-item {
            padding: 1rem;
            text-align: center;
          }
          
          .cta-buttons {
            flex-direction: column !important;
            gap: 1rem !important;
            padding: 0 1rem;
          }
          
          .cta-buttons .btn-primary,
          .cta-buttons .btn-outline,
          .cta-buttons a {
            width: 100%;
            text-align: center;
            padding: 0.875rem 2rem;
          }
          
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
            text-align: center !important;
          }
          
          .footer-section {
            text-align: center !important;
          }
          
          .section-content {
            padding: 2rem 1rem !important;
          }
          
          .cta-content {
            padding: 2rem 1rem !important;
          }
          
          .footer-content {
            padding: 2rem 1rem !important;
          }

          /* Réduire les animations sur mobile pour les performances */
          .animate-on-scroll {
            transition-duration: 0.6s;
          }

          .process-step::after {
            display: none;
          }
        }

        /* Très petits écrans */
        @media (max-width: 480px) {
          .hero-title {
            font-size: 1.875rem !important;
            padding: 0 0.5rem;
          }
          
          .hero-subtitle {
            font-size: 1rem !important;
            padding: 0 0.5rem;
          }
          
          .section-title {
            font-size: 1.5rem !important;
            padding: 0 0.5rem;
          }
          
          .service-card, .portfolio-card {
            padding: 1rem !important;
          }
          
          .service-card h3, .portfolio-card h3 {
            font-size: 1.25rem !important;
          }
          
          .feature-title {
            font-size: 1.125rem !important;
          }
          
          .service-grid, .portfolio-grid, .process-grid,
          .features-grid {
            padding: 0 0.5rem;
            gap: 1rem !important;
          }
          
          .cta-buttons {
            padding: 0 0.5rem;
          }
          
          .section-content {
            padding: 1.5rem 0.5rem !important;
          }
          
          .cta-content {
            padding: 1.5rem 0.5rem !important;
          }
        }

        /* Tablettes portrait */
        @media (min-width: 769px) and (max-width: 1023px) {
          .service-grid, .portfolio-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 2rem !important;
            max-height: none !important;
          }
          
          .features-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 2rem !important;
            max-height: none !important;
          }

          .process-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 2rem !important;
          }
          
          .hero-title {
            font-size: 3rem !important;
          }
          
          .hero-subtitle {
            font-size: 1.25rem !important;
          }
        }

        /* Tablettes paysage et petits desktops */
        @media (min-width: 1024px) and (max-width: 1279px) {
          .hero-title {
            font-size: 3.5rem !important;
          }
          
          .service-grid, .portfolio-grid {
            max-height: 60vh;
          }
          
          .features-grid {
            max-height: 50vh;
          }
        }

        /* Amélioration de l'accessibilité */
        @media (prefers-reduced-motion: reduce) {
          .homepage-container {
            scroll-behavior: auto;
          }
          
          .animate-on-scroll,
          .service-card,
          .portfolio-card,
          .feature-item {
            transition: none !important;
            animation: none !important;
          }
          
          .bg-grid-pattern {
            animation: none !important;
          }
          
          .icon-bounce {
            animation: none !important;
          }
        }

        /* Ajustements pour les écrans courts */
        @media (max-height: 700px) and (min-width: 1024px) {
          .service-grid,
          .portfolio-grid,
          .features-grid {
            max-height: none !important;
          }
          
          .section-snap {
            min-height: 100vh;
            height: auto;
            padding: 2rem 0;
          }
        }
        
        /* Ajustements pour les écrans très courts sur mobile */
        @media (max-height: 600px) and (max-width: 768px) {
          .hero-section {
            min-height: auto;
            padding: 1.5rem 0;
          }
          
          .section-snap {
            min-height: auto;
            padding: 2rem 0;
          }
          
          .cta-footer-section {
            min-height: auto;
          }
        }
      `}</style>

      <div className="animate-fade-in">
        {/* Hero Section */}
        <section className="hero-section section-snap relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center section-content">
            <div className="animate-slide-up">
              <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight animate-on-scroll fade-up">
                {t('home.hero.title')}
              </h1>
              <p className="hero-subtitle text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed animate-on-scroll fade-up delay-200">
                {t('home.hero.subtitle')}
              </p>
              <div className="cta-buttons flex flex-col sm:flex-row gap-4 justify-center max-w-md sm:max-w-none mx-auto animate-on-scroll fade-up delay-400">
                <Link 
                  to="/contact" 
                  className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 inline-flex items-center justify-center space-x-2 group"
                >
                  <span>{t('home.hero.cta1')}</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/quote" 
                  className="btn-outline text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 inline-flex items-center justify-center"
                >
                  {t('home.hero.cta2')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="section-snap bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-content">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-on-scroll fade-up">
                {t('home.stats.projects.completed')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-on-scroll fade-up delay-200">
                {t('home.stats.projects.description')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <AnimatedStat key={index} stat={stat} />
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="section-snap bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full section-content">
            <div className="text-center mb-8 lg:mb-12">
              <h2 className="section-title text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-on-scroll fade-up">
                {t('services.title')}
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4 animate-on-scroll fade-up delay-200">
                {t('home.services.subtitle')}
              </p>
            </div>

            <div className="service-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-h-none lg:max-h-[60vh] items-stretch">
              {services.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <div
                    key={index}
                    className={`service-card card hover:shadow-xl transition-all duration-300 group cursor-pointer transform hover:-translate-y-2 p-6 animate-on-scroll scale-up delay-${(index + 1) * 100}`}
                  >
                    <div className={`w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r ${service.color} rounded-lg flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform mx-auto sm:mx-0`}>
                      <IconComponent size={24} className="sm:w-8 sm:h-8 text-white icon-bounce" />
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 text-center sm:text-left">
                      {t(service.titleKey)}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed text-center sm:text-left">
                      {t(service.descKey)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section className="section-snap bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-content">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-on-scroll fade-up">
                {t('home.portfolio.title')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-on-scroll fade-up delay-200">
                {t('home.portfolio.subtitle')}
              </p>
            </div>

            <div className="portfolio-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolio.map((project, index) => (
                <div 
                  key={index} 
                  className={`portfolio-card bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden group animate-on-scroll scale-up delay-${(index + 1) * 100}`}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={t(project.titleKey)}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {t(project.titleKey)}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {t(project.descriptionKey)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span 
                          key={techIndex}
                          className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="section-snap bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-content">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-on-scroll fade-up">
                {t('home.process.title')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-on-scroll fade-up delay-200">
                {t('home.process.subtitle')}
              </p>
            </div>

            <div className="process-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {workProcess.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div 
                    key={index} 
                    className={`process-step text-center animate-on-scroll fade-up delay-${(index + 1) * 100}`}
                  >
                    <div className="relative mb-6">
                      {/* Cercle avec numéro uniquement */}
                      <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 relative z-10`}>
                        <span className="text-2xl font-bold text-white">
                          {step.step}
                        </span>
                      </div>
                      
                      {/* Cercle en pointillés autour */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-full animate-pulse -mt-2"></div>
                      
                      {/* Icône séparée sous le cercle */}
                      <div className="flex justify-center mt-2">
                        <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-md">
                          <IconComponent className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {t(step.titleKey)}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {t(step.descriptionKey)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="section-snap bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-content">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-on-scroll fade-up">
                {t('home.testimonials.title')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-on-scroll fade-up delay-200">
                {t('home.testimonials.subtitle')}
              </p>
            </div>

            <div className="relative max-w-4xl mx-auto">
              <div className="relative h-64 overflow-hidden">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className={`testimonial-card absolute inset-0 ${
                      index === currentTestimonial ? 'active' : 
                      index < currentTestimonial ? 'prev' : ''
                    }`}
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 h-full flex flex-col justify-center">
                      <div className="flex items-center justify-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <blockquote className="text-lg text-gray-700 dark:text-gray-300 text-center mb-6 leading-relaxed">
                        "{testimonial.text}"
                      </blockquote>
                      <div className="flex items-center justify-center">
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover mr-4"
                        />
                        <div className="text-left">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {testimonial.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {testimonial.company}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Testimonial Navigation */}
              <div className="flex justify-center mt-8 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial 
                        ? 'bg-primary-600 w-8' 
                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-primary-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="section-snap bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-content">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-on-scroll fade-left">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop" 
                  alt="Notre équipe de développement"
                  className="rounded-xl shadow-lg w-full h-80 object-cover"
                />
              </div>
              <div className="animate-on-scroll fade-right">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  {t('home.about.title')}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {t('home.about.description')}
                </p>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="text-center p-4 bg-white dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-primary-600 mb-2">100%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{t('home.about.projects.delivered')}</div>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-primary-600 mb-2">24/7</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{t('home.about.client.support')}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {['React', 'Node.js', 'Python', 'AWS', 'MongoDB', 'TypeScript'].map((tech, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="section-snap bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full section-content">
            <div className="text-center mb-8 lg:mb-12">
              <h2 className="section-title text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-on-scroll fade-up">
                {t('home.features.title')}
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4 animate-on-scroll fade-up delay-200">
                {t('home.features.subtitle')}
              </p>
            </div>

            <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-h-none lg:max-h-[50vh] items-center">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                const animationClass = index === 0 ? 'fade-left' : index === 2 ? 'fade-right' : 'fade-up';
                return (
                  <div key={index} className={`feature-item text-center p-4 animate-on-scroll ${animationClass} delay-${(index + 1) * 200}`}>
                    <div className="w-12 sm:w-16 h-12 sm:h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <IconComponent size={24} className="sm:w-8 sm:h-8 text-primary-600 icon-bounce" />
                    </div>
                    <h3 className="feature-title text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                      {t(feature.titleKey)}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 px-2">
                      {t(feature.descKey)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section-snap bg-gray-50 dark:bg-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 section-content">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-on-scroll fade-up">
                {t('home.faq.title')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 animate-on-scroll fade-up delay-200">
                {t('home.faq.subtitle')}
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  questionKey: 'home.faq.timeline.question',
                  answerKey: 'home.faq.timeline.answer'
                },
                {
                  questionKey: 'home.faq.maintenance.question',
                  answerKey: 'home.faq.maintenance.answer'
                },
                {
                  questionKey: 'home.faq.technologies.question',
                  answerKey: 'home.faq.technologies.answer'
                },
                {
                  questionKey: 'home.faq.payment.question',
                  answerKey: 'home.faq.payment.answer'
                }
              ].map((faq, index) => (
                <div 
                  key={index} 
                  className={`bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 animate-on-scroll fade-up delay-${(index + 1) * 100}`}
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-primary-600 text-sm font-bold">?</span>
                    </div>
                    {t(faq.questionKey)}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed ml-9">
                    {t(faq.answerKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section avec Footer intégré */}
        <section className="cta-footer-section bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
          {/* CTA Content */}
          <div className="flex-1 flex items-center justify-center py-8 lg:py-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full cta-content">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 animate-on-scroll fade-up">
                {t('home.hero.cta.ready')}
              </h2>
              <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 max-w-3xl mx-auto px-4 animate-on-scroll fade-up delay-200">
                {t('home.hero.cta.discuss')}
              </p>
              <div className="cta-buttons flex flex-col sm:flex-row gap-4 justify-center max-w-md sm:max-w-none mx-auto animate-on-scroll rotate-in delay-400">
                <Link 
                  to="/booking" 
                  className="bg-white text-primary-600 font-medium py-3 px-6 sm:px-8 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
                >
                  {t('nav.booking')}
                </Link>
                <Link 
                  to="/quote" 
                  className="border-2 border-white text-white font-medium py-3 px-6 sm:px-8 rounded-lg hover:bg-white hover:text-primary-600 transition-colors inline-flex items-center justify-center"
                >
                  {t('nav.quote')}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;