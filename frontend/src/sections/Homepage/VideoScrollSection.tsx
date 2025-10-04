// frontend/src/sections/VideoScrollSection.tsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Section } from '../../components/Section';
import { useLanguage } from '../../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export const VideoScrollSection = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !videoRef.current || !overlayTextRef.current) return;

    const video = videoRef.current;
    const section = sectionRef.current;
    const overlayText = overlayTextRef.current;

    // Créer une timeline GSAP
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      }
    });

    // Animations de la vidéo
    tl.fromTo(
      video,
      {
        scale: 0.5,
        borderRadius: '50px',
        opacity: 0.7,
      },
      {
        scale: 1,
        borderRadius: '0px',
        opacity: 1,
        duration: 1,
      }
    )
    .to(video, {
      scale: 1.1,
      duration: 1,
    });

    // Animations du texte en overlay
    tl.fromTo(
      overlayText.children[0],
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.5 },
      0.3
    )
    .to(
      overlayText.children[0],
      { opacity: 0, y: -50, duration: 0.3 },
      1.2
    )
    .fromTo(
      overlayText.children[1],
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.5 },
      1.5
    );

    // Synchroniser la lecture de la vidéo avec le scroll
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        if (video.duration) {
          const progress = self.progress;
          video.currentTime = video.duration * progress;
        }
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      tl.kill();
    };
  }, []);

  return (
    <Section className="bg-black relative section-snap" ref={sectionRef}>
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          src="/assets/ampouleExplose.mp4"
          className="w-full h-full object-cover"
          muted
          autoPlay
          playsInline
          preload="auto"
        />
      </div>

      <div
        ref={overlayTextRef}
        className="relative z-10 text-center max-w-4xl px-6 pointer-events-none"
      >
        <h2 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
          {t('video.title')}
        </h2>

      </div>

      {/* Indicateur de scroll */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex flex-col items-center text-white animate-bounce">
          <span className="text-sm mb-2">{t('hero.scroll.discover')}</span>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </Section>
  );
};