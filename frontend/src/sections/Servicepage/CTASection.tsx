//src/components/CTASection.tsx
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const { t, language } = useLanguage();
  const { isDark } = useTheme();
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const splitTitle = titleRef.current?.querySelectorAll('.word');
      if (splitTitle) {
        gsap.from(splitTitle, {
          y: 100,
          opacity: 0,
          rotateX: -90,
          stagger: 0.1,
          duration: 1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            end: 'bottom 60%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      gsap.from(buttonRef.current, {
        scale: 0,
        opacity: 0,
        duration: 1,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: {
          trigger: buttonRef.current,
          start: 'top 85%',
          end: 'bottom 60%',
          toggleActions: 'play none none reverse',
        },
      });

      if (particlesRef.current) {
        const particles = particlesRef.current.children;
        Array.from(particles).forEach((particle) => {
          gsap.to(particle, {
            y: `+=${Math.random() * 100 - 50}`,
            x: `+=${Math.random() * 100 - 50}`,
            opacity: Math.random() * 0.5 + 0.3,
            duration: Math.random() * 3 + 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [language]);

  const handleButtonHover = (isHovering: boolean) => {
    gsap.to(buttonRef.current, {
      scale: isHovering ? 1.1 : 1,
      boxShadow: isHovering
        ? '0 20px 60px rgba(139, 92, 246, 0.6)'
        : '0 10px 40px rgba(139, 92, 246, 0.3)',
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  // Déterminer le nombre de mots selon la langue
  const titleWords = language === 'fr' ? 7 : 6;

  return (
    <section
      ref={sectionRef}
      className={`relative py-32 px-6 overflow-hidden transition-colors duration-500 ${
        isDark
          ? 'bg-gradient-to-b from-slate-900 to-slate-950'
          : 'bg-gradient-to-b from-slate-50 to-white'
      }`}
    >
      <div
        ref={particlesRef}
        className="absolute inset-0 pointer-events-none"
      >
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${
              isDark ? 'bg-white' : 'bg-violet-600'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5,
            }}
          ></div>
        ))}
      </div>

      <div className={`absolute inset-0 ${
        isDark
          ? 'bg-gradient-radial from-violet-600/20 via-transparent to-transparent'
          : 'bg-gradient-radial from-violet-400/10 via-transparent to-transparent'
      }`}></div>

      <div className="relative max-w-5xl mx-auto text-center z-10">
        <MessageCircle className={`w-20 h-20 mx-auto mb-8 animate-pulse ${
          isDark ? 'text-violet-400' : 'text-violet-600'
        }`} />

        <h2 
          ref={titleRef} 
          className={`text-5xl md:text-7xl font-bold mb-12 leading-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          <span className="word inline-block mr-4">{t('servicePage.cta.title.word1')}</span>
          <span className="word inline-block mr-4">{t('servicePage.cta.title.word2')}</span>
          <span className="word inline-block mr-4">{t('servicePage.cta.title.word3')}</span>
          <span className="word inline-block mr-4">{t('servicePage.cta.title.word4')}</span>
          <span className="word inline-block mr-4">{t('servicePage.cta.title.word5')}</span>
          {titleWords === 7 ? (
            <>
              <span className="word inline-block mr-4">{t('servicePage.cta.title.word6')}</span>
              <span className="word inline-block bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                {t('servicePage.cta.title.word7')}
              </span>
            </>
          ) : (
            <span className="word inline-block bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              {t('servicePage.cta.title.word6')}
            </span>
          )}
        </h2>

        <p className={`text-xl mb-16 max-w-2xl mx-auto ${
          isDark ? 'text-white/70' : 'text-slate-600'
        }`}>
          {t('servicePage.cta.subtitle')}
        </p>
        
        <Link to="/quote">
          <button
            ref={buttonRef}
            onMouseEnter={() => handleButtonHover(true)}
            onMouseLeave={() => handleButtonHover(false)}
            className="group relative px-12 py-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xl font-bold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              {t('servicePage.cta.button')}
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </Link>

        <div className={`mt-16 flex justify-center gap-8 text-sm ${
          isDark ? 'text-white/60' : 'text-slate-500'
        }`}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>{t('servicePage.cta.feature1')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>{t('servicePage.cta.feature2')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span>{t('servicePage.cta.feature3')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}