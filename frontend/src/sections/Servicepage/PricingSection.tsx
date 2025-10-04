//frontend/src/sections/Servicepage/PricingSection.tsx
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Zap, Crown, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function PricingSection() {
  const { t, language } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  const packs = [
    {
      id: 'starter',
      icon: Sparkles,
      gradient: 'from-blue-500 to-cyan-500',
      featuresCount: 5,
    },
    {
      id: 'business',
      icon: Zap,
      gradient: 'from-purple-500 to-pink-500',
      popular: true,
      featuresCount: 6,
    },
    {
      id: 'premium',
      icon: Crown,
      gradient: 'from-orange-500 to-red-500',
      featuresCount: 7,
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

  return (
    <section ref={sectionRef} className="min-h-screen py-36 px-6 bg-gradient-to-b from-slate-800 to-slate-900 flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        <h2
          ref={titleRef}
          className="text-5xl md:text-7xl font-bold text-white text-center mb-24"
        >
          {t('servicePage.pricing.title')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packs.map((pack, index) => {
            const Icon = pack.icon;
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
                      <Icon className="w-16 h-16 text-white mb-6" />
                      <h3 className="text-4xl font-bold text-white mb-4">
                        {t(`servicePage.pricing.${pack.id}.name`)}
                      </h3>
                      <div className="text-4xl font-bold text-white mb-2">
                        {t(`servicePage.pricing.${pack.id}.price`)}
                      </div>
                      <p className="text-white/80 text-sm mb-6">{t('servicePage.pricing.vat')}</p>
                      <p className="text-white/90 text-base leading-relaxed">
                        {t(`servicePage.pricing.${pack.id}.desc`)}
                      </p>
                    </div>
                    <div className="text-center text-white/90 text-lg">
                      {t('servicePage.pricing.clickDetails')}
                    </div>
                  </div>

                  <div
                    className={`absolute w-full h-full rounded-3xl bg-white p-8 shadow-2xl flex flex-col justify-between overflow-y-auto`}
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <div>
                      <h3 className="text-3xl font-bold text-slate-900 mb-6">
                        {t(`servicePage.pricing.${pack.id}.name`)}
                      </h3>
                      <ul className="space-y-3 mb-8">
                        {Array.from({ length: pack.featuresCount }).map((_, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                            <span className="text-slate-700 text-base">
                              {t(`servicePage.pricing.${pack.id}.features.${i + 1}`)}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <div className="bg-slate-100 rounded-xl p-4 mb-6">
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
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
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
          <button className="px-8 py-4 bg-white text-slate-900 font-bold text-lg rounded-full hover:scale-105 transition-transform shadow-lg">
            {t('servicePage.pricing.cta')}
          </button>
        </div>
      </div>
    </section>
  );
}