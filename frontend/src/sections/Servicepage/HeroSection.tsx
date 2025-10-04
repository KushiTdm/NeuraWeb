//src/components/HeroSection.tsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
      });

      gsap.from(subtitleRef.current, {
        y: 80,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out',
      });

      gsap.from(ctaRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        delay: 0.6,
        ease: 'power3.out',
      });

      gsap.to(ctaRef.current, {
        y: -10,
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: 'power1.inOut',
      });

      gsap.to(bgRef.current, {
        yPercent: 50,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      const letters = titleRef.current?.querySelectorAll('.letter');
      if (letters) {
        gsap.from(letters, {
          opacity: 0,
          y: 50,
          rotateX: -90,
          stagger: 0.05,
          duration: 0.8,
          ease: 'back.out(1.7)',
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const splitText = (text: string) => {
    return text.split('').map((char, i) => (
      <span key={i} className="letter inline-block">
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <section
      ref={heroRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      <div
        ref={bgRef}
        className="absolute inset-0 -z-10"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl">
        <h1
          ref={titleRef}
          className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight"
        >
          {splitText('Services & Tarifs')}
        </h1>
        <p
          ref={subtitleRef}
          className="text-xl md:text-3xl text-white/90 mb-12 font-light"
        >
          Des solutions web sur mesure pour propulser votre business
        </p>
        <div ref={ctaRef} className="flex justify-center">
          <div className="cursor-pointer animate-bounce">
            <ChevronDown className="w-12 h-12 text-white" strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </section>
  );
}
