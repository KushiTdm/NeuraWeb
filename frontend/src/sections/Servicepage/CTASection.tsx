//src/components/CTASection.tsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageCircle, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
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
  }, []);

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

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-6 bg-gradient-to-b from-slate-900 to-slate-950 overflow-hidden"
    >
      <div
        ref={particlesRef}
        className="absolute inset-0 pointer-events-none"
      >
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5,
            }}
          ></div>
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-radial from-violet-600/20 via-transparent to-transparent"></div>

      <div className="relative max-w-5xl mx-auto text-center z-10">
        <MessageCircle className="w-20 h-20 text-violet-400 mx-auto mb-8 animate-pulse" />

        <h2 ref={titleRef} className="text-5xl md:text-7xl font-bold text-white mb-12 leading-tight">
          <span className="word inline-block mr-4">Des</span>
          <span className="word inline-block mr-4">questions</span>
          <span className="word inline-block mr-4">avant</span>
          <span className="word inline-block mr-4">de</span>
          <span className="word inline-block mr-4">lancer</span>
          <span className="word inline-block mr-4">votre</span>
          <span className="word inline-block mr-4 bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            projet ?
          </span>
        </h2>

        <p className="text-xl text-white/70 mb-16 max-w-2xl mx-auto">
          Discutons ensemble de votre vision et transformons-la en réalité digitale.
        </p>

        <button
          ref={buttonRef}
          onMouseEnter={() => handleButtonHover(true)}
          onMouseLeave={() => handleButtonHover(false)}
          className="group relative px-12 py-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xl font-bold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-3">
            Démarrer mon projet
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>

        <div className="mt-16 flex justify-center gap-8 text-white/60 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Réponse en 24h</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>Devis gratuit</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span>Sans engagement</span>
          </div>
        </div>
      </div>
    </section>
  );
}
