// frontend/src/pages/HomePage.tsx
import React, { useEffect, useState, useRef } from 'react';
import { HeroSection } from '../sections/HeroSection';
import  {VideoScrollSection}  from '../sections/VideoScrollSection';
import { ServicesSection } from '../sections/ServicesSection';
import { PortfolioSection } from '../sections/PortfolioSection';
import { TechnologiesSection } from '../sections/TechnologiesSection';
import { ProcessSection } from '../sections/ProcessSection';
import { StatsSection } from '../sections/StatsSection';
import { TestimonialsSection } from '../sections/TestimonialsSection';
import { AboutSection } from '../sections/AboutSection';
import { FAQSection } from '../sections/FAQSection';
import { CTASection } from '../sections/CTASection';

const HomePage: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  // Auto-scroll vers Hero après 5 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      heroRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 50,
        y: (e.clientY / window.innerHeight - 0.5) * 50
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Intersection Observer pour les animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Fonction pour scroller vers la section suivante
  const scrollToNextSection = () => {
    servicesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="homepage-container">
      <style>{`

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(59, 130, 246, 0.5);
          border-radius: 50%;
          animation: particle-rise 3s ease-in infinite;
        }

        @keyframes particle-rise {
          0% { transform: translateY(0) scale(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-100px) scale(1); opacity: 0; }
        }

        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .homepage-container {
          overflow-y: auto;
          scroll-behavior: smooth;
        }

        @media (min-width: 1024px) {
          .homepage-container {
            height: 100vh;
            overflow-y: scroll;
            scroll-snap-type: y mandatory;
          }
          
          .section-snap {
            min-height: 100vh;
            scroll-snap-align: start;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }

        .animate-on-scroll {
          opacity: 0;
          transform: translateY(50px);
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .animate-on-scroll.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        .fade-up { transform: translateY(60px); }
        .fade-up.animate-in { transform: translateY(0); }
        
        .fade-left { transform: translateX(-60px); }
        .fade-left.animate-in { transform: translateX(0); }
        
        .fade-right { transform: translateX(60px); }
        .fade-right.animate-in { transform: translateX(0); }
        
        .scale-up { transform: scale(0.8); }
        .scale-up.animate-in { transform: scale(1); }

        .delay-100 { transition-delay: 0.1s; }
        .delay-200 { transition-delay: 0.2s; }
        .delay-300 { transition-delay: 0.3s; }
        .delay-400 { transition-delay: 0.4s; }
        .delay-500 { transition-delay: 0.5s; }

        .service-card, .portfolio-card {
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .service-card:hover {
          transform: translateY(-15px) scale(1.03);
        }

        .portfolio-card:hover {
          transform: translateY(-10px);
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(59, 130, 246, 0.5);
          border-radius: 50%;
          animation: particle-rise 3s ease-in infinite;
        }

        @keyframes particle-rise {
          0% { transform: translateY(0) scale(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-100px) scale(1); opacity: 0; }
        }

        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @media (max-width: 768px) {
          .section-snap {
            min-height: auto;
            padding: 3rem 1rem;
          }
        }
      `}</style>
      <VideoScrollSection/>
      <div ref={heroRef}>
        <HeroSection mousePosition={mousePosition} onScrollToNext={scrollToNextSection} />
      </div>
      <div ref={servicesRef}>
        <ServicesSection />
      </div>
      <PortfolioSection />
      <TechnologiesSection mousePosition={mousePosition} />
      <ProcessSection />
      <TestimonialsSection />
      <AboutSection />
      <FAQSection />
      <CTASection />
    </div>
  );
};

export default HomePage;