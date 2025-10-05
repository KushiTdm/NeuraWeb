import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

export default function PricingSection() {
  const { t, language } = useLanguage();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  const packs: Array<{
    id: string;
    icon: string;
    gradient: string;
    popular?: boolean;
    featuresCount: number;
  }> = [
    {
      id: 'starter',
      icon: '/assets/etoile.png',
      gradient: 'from-blue-500 to-cyan-500',
      featuresCount: 5,
    },
    {
      id: 'business',
      icon: '/assets/eclair.png',
      gradient: 'from-purple-500 to-pink-500',
      popular: true,
      featuresCount: 6,
    },
    {
      id: 'premium',
      icon: '/assets/couronne.png',
      gradient: 'from-orange-500 to-red-500',
      featuresCount: 7,
    },
    {
      id: 'ai',
      icon: '/assets/robot.png', 
      gradient: 'from-green-500 to-teal-500',
      featuresCount: 5,
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 80,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
          end: 'bottom 60%',
          toggleActions: 'play none none reverse',
        },
      });

      cardsRef.current.forEach((card, index) => {
        gsap.from(card, {
          x: index === 0 ? -200 : index === 2 ? 200 : 0,
          y: index === 1 ? -100 : 0,
          opacity: 0,
          scale: 0.8,
          duration: 1,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            end: 'bottom 60%',
            toggleActions: 'play none none reverse',
          },
        });

        gsap.to(card, {
          y: '+=10',
          repeat: -1,
          yoyo: true,
          duration: 2 + index * 0.5,
          ease: 'power1.inOut',
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [language]);

  const toggleFlip = (index: number) => {
    setFlippedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleChoosePack = (packId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/quote', { 
      state: { 
        selectedPack: packId,
        packName: t(`servicePage.pricing.${packId}.name`)
      } 
    });
  };

  return (
    <section ref={sectionRef} className={`min-h-screen py-36 px-6 ${isDark ? 'bg-gradient-to-b from-slate-800 to-slate-900' : 'bg-gradient-to-b from-gray-50 to-gray-100'} flex items-center transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto w-full">
        <h2
          ref={titleRef}
          className={`text-5xl md:text-7xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} text-center mb-24 transition-colors duration-300`}
        >
          {t('servicePage.pricing.title')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {packs.map((pack, index) => {
            const isFlipped = flippedCards.has(index);

            return (
              <div
                key={index}
                ref={(el) => {
                  if (el) cardsRef.current[index] = el;
                }}
                className="relative h-[650px] cursor-pointer"
                style={{ perspective: '1000px' }}
                onClick={() => toggleFlip(index)}
              >
                <div
                  className="relative w-full h-full transition-transform duration-700"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  <div
                    className={`absolute w-full h-full rounded-3xl bg-gradient-to-br ${pack.gradient} p-8 shadow-2xl flex flex-col justify-between`}
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    {pack.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-slate-900 px-6 py-2 rounded-full font-bold text-sm">
                        {t(`servicePage.pricing.${pack.id}.popular`)}
                      </div>
                    )}
                    <div>
                      <img 
                        src={pack.icon} 
                        alt={t(`servicePage.pricing.${pack.id}.name`)}
                        className="w-16 h-16 mb-6 object-contain drop-shadow-lg"
                      />
                      <h3 className="text-4xl font-bold text-white mb-4">
                        {t(`servicePage.pricing.${pack.id}.name`)}
                      </h3>
                      <div className="mb-2">
                        <p className="text-white/70 text-sm font-medium mb-1">
                          {t(`servicePage.pricing.priceLabel`)}
                        </p>
                        <div className="text-5xl font-bold text-white">
                          {t(`servicePage.pricing.${pack.id}.price`)}
                        </div>
                      </div>
                      <p className="text-white/80 text-sm mb-8">{t('servicePage.pricing.vat')}</p>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <p className="text-white/95 text-base leading-relaxed">
                          {t(`servicePage.pricing.${pack.id}.desc`)}
                        </p>
                      </div>
                    </div>
                    <div className="text-center text-white/90 text-lg">
                      {t('servicePage.pricing.clickDetails')}
                    </div>
                  </div>

                  <div
                    className={`absolute w-full h-full rounded-3xl ${isDark ? 'bg-white' : 'bg-white'} p-8 shadow-2xl flex flex-col justify-between overflow-y-auto transition-colors duration-300`}
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <div>
                      <h3 className={`text-3xl font-bold ${isDark ? 'text-slate-900' : 'text-slate-900'} mb-6 transition-colors duration-300`}>
                        {t(`servicePage.pricing.${pack.id}.name`)}
                      </h3>
                      <ul className="space-y-3 mb-8">
                        {Array.from({ length: pack.featuresCount }).map((_, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                            <span className={`${isDark ? 'text-slate-700' : 'text-slate-700'} text-base transition-colors duration-300`}>
                              {t(`servicePage.pricing.${pack.id}.features.${i + 1}`)}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <div className={`${isDark ? 'bg-slate-100' : 'bg-slate-50'} rounded-xl p-4 mb-6 transition-colors duration-300`}>
                        <p className="text-slate-600 text-sm font-semibold mb-1">
                          {t('servicePage.pricing.deadline')}
                        </p>
                        <p className="text-slate-900 text-lg font-bold">
                          {t(`servicePage.pricing.${pack.id}.delay`)}
                        </p>
                      </div>
                    </div>
                    <button
                      className={`w-full py-4 rounded-xl bg-gradient-to-r ${pack.gradient} text-white font-bold text-lg hover:scale-105 transition-transform shadow-lg`}
                      onClick={(e) => handleChoosePack(pack.id, e)}
                    >
                      {t('servicePage.pricing.choosePack')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <button 
            onClick={() => navigate('/quote')}
            className={`px-8 py-4 ${isDark ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'} font-bold text-lg rounded-full hover:scale-105 transition-all duration-300 shadow-lg`}
          >
            {t('servicePage.pricing.cta')}
          </button>
        </div>
      </div>
    </section>
  );
}