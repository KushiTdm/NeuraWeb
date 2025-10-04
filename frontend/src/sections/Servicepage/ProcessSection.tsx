import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../../context/LanguageContext';


gsap.registerPlugin(ScrollTrigger);

export default function ProcessSection() {
  const { t, language } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const stepsRef = useRef<HTMLDivElement[]>([]);

  const steps = [
    {
      title: t('servicePage.process.audit.title'),
      description: t('servicePage.process.audit.description'),
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: t('servicePage.process.design.title'),
      description: t('servicePage.process.design.description'),
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: t('servicePage.process.development.title'),
      description: t('servicePage.process.development.description'),
      image: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      title: t('servicePage.process.tests.title'),
      description: t('servicePage.process.tests.description'),
      image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      title: t('servicePage.process.delivery.title'),
      description: t('servicePage.process.delivery.description'),
      image: 'assets/livraison.jpg',
      gradient: 'from-yellow-500 to-amber-500',
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 80,
        opacity: 0,
        rotationX: -90,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
          end: 'bottom 60%',
          toggleActions: 'play none none reverse',
        },
      });

      if (pathRef.current) {
        const pathLength = pathRef.current.getTotalLength();
        pathRef.current.style.strokeDasharray = `${pathLength}`;
        pathRef.current.style.strokeDashoffset = `${pathLength}`;

        gsap.to(pathRef.current, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top center',
            end: 'bottom center',
            scrub: 1,
          },
        });
      }

      stepsRef.current.forEach((step, index) => {
        const direction = index % 2 === 0 ? 1 : -1;

        gsap.from(step, {
          x: direction * 200,
          y: 100,
          z: -500,
          opacity: 0,
          rotationY: direction * 45,
          scale: 0.5,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: step,
            start: 'top 90%',
            end: 'top 50%',
            toggleActions: 'play none none reverse',
          },
        });

        ScrollTrigger.create({
          trigger: step,
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            const rotation = (0.5 - progress) * 15 * direction;
            const z = (0.5 - Math.abs(0.5 - progress)) * 200;

            gsap.to(step, {
              rotationY: rotation,
              z: z,
              scale: 0.9 + (progress * 0.2),
              duration: 0.1,
            });
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [language]);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-6 bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden"
      style={{ perspective: '2000px' }}
    >
      <div className="max-w-6xl mx-auto">
        <h2
          ref={titleRef}
          className="text-5xl md:text-7xl font-bold text-white text-center mb-32"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {t('servicePage.process.title')}
        </h2>

        <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
          <svg
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
            viewBox="0 0 800 2000"
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              ref={pathRef}
              d="M 400 0 Q 600 200 400 400 Q 200 600 400 800 Q 600 1000 400 1200 Q 200 1400 400 1600 Q 500 1800 400 2000"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="25%" stopColor="#a855f7" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#f97316" stopOpacity="0.8" />
                <stop offset="75%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#eab308" stopOpacity="0.8" />
              </linearGradient>
            </defs>
          </svg>

          <div className="relative space-y-64" style={{ zIndex: 2 }}>
            {steps.map((step, index) => {
              const isLeft = index % 2 === 0;

              return (
                <div
                  key={index}
                  ref={(el) => {
                    if (el) stepsRef.current[index] = el;
                  }}
                  className={`flex items-center justify-center ${isLeft ? 'ml-0 mr-auto' : 'ml-auto mr-0'} max-w-xl`}
                  style={{
                    transformStyle: 'preserve-3d',
                    marginLeft: isLeft ? '0' : 'auto',
                    marginRight: isLeft ? 'auto' : '0',
                  }}
                >
                  <div
                    className={`group relative w-full bg-gradient-to-br ${step.gradient} rounded-3xl overflow-hidden shadow-2xl`}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div className="absolute inset-0 bg-black/40 z-10"></div>

                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-80 object-cover"
                    />

                    <div className="relative z-20 p-8">
                      <div className="absolute top-4 right-4 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {index + 1}
                      </div>

                      <h3 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
                        {step.title}
                      </h3>
                      <p className="text-white/90 text-lg leading-relaxed drop-shadow-md">
                        {step.description}
                      </p>
                    </div>

                    <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-32 text-center">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-white/10 backdrop-blur-sm rounded-full">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-white text-lg font-medium">{t('servicePage.process.badge')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}