import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Zap, Crown, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const packs = [
  {
    name: 'Starter',
    icon: Sparkles,
    price: '1 500€',
    features: [
      '3-5 pages',
      'Design responsive',
      'SEO de base',
      'Formulaire de contact',
      '1 mois de support',
    ],
    delay: '2-3 semaines',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Business',
    icon: Zap,
    price: '3 500€',
    features: [
      '8-12 pages',
      'Design sur-mesure',
      'SEO avancé',
      'Espace admin',
      'Blog intégré',
      '3 mois de support',
    ],
    delay: '4-6 semaines',
    gradient: 'from-purple-500 to-pink-500',
    popular: true,
  },
  {
    name: 'Premium',
    icon: Crown,
    price: '6 500€',
    features: [
      'Pages illimitées',
      'Design premium',
      'SEO expert',
      'Dashboard avancé',
      'E-commerce',
      'Animations 3D',
      '6 mois de support',
    ],
    delay: '8-10 semaines',
    gradient: 'from-orange-500 to-red-500',
  },
];

export default function PricingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

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
  }, []);

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
    <section ref={sectionRef} className="py-32 px-6 bg-gradient-to-b from-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto">
        <h2
          ref={titleRef}
          className="text-5xl md:text-7xl font-bold text-white text-center mb-24"
        >
          Packs & Tarifs
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
                className="relative h-[600px] cursor-pointer"
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
                        POPULAIRE
                      </div>
                    )}
                    <div>
                      <Icon className="w-16 h-16 text-white mb-6" />
                      <h3 className="text-4xl font-bold text-white mb-4">{pack.name}</h3>
                      <div className="text-5xl font-bold text-white mb-2">{pack.price}</div>
                      <p className="text-white/80 text-sm">HT</p>
                    </div>
                    <div className="text-center text-white/90 text-lg">
                      Cliquez pour voir les détails
                    </div>
                  </div>

                  <div
                    className={`absolute w-full h-full rounded-3xl bg-white p-8 shadow-2xl flex flex-col justify-between`}
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <div>
                      <h3 className="text-3xl font-bold text-slate-900 mb-6">{pack.name}</h3>
                      <ul className="space-y-4 mb-8">
                        {pack.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                            <span className="text-slate-700 text-lg">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="bg-slate-100 rounded-xl p-4 mb-6">
                        <p className="text-slate-600 text-sm font-semibold mb-1">Délai de réalisation</p>
                        <p className="text-slate-900 text-xl font-bold">{pack.delay}</p>
                      </div>
                    </div>
                    <button
                      className={`w-full py-4 rounded-xl bg-gradient-to-r ${pack.gradient} text-white font-bold text-lg hover:scale-105 transition-transform shadow-lg`}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      Choisir ce pack
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
