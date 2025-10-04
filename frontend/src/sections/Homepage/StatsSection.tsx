import React, { useEffect, useRef, useState } from 'react';
import { Rocket, Users, Award } from 'lucide-react';
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';

const stats = [
  { number: 50, label: 'Projets Réalisés', icon: Rocket },
  { number: 25, label: 'Clients Satisfaits', icon: Users },
  { number: 5, label: 'Années d\'Expérience', icon: Award }
];

const AnimatedStat: React.FC<{ stat: typeof stats[0] }> = ({ stat }) => {
  const { count, setIsVisible } = useAnimatedCounter(stat.number);
  const [hasAnimated, setHasAnimated] = useState(false);
  const statRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
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
    <div ref={statRef} className="text-center animate-on-scroll fade-up">
      <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 shadow-lg transform hover:scale-110 transition-transform">
        <stat.icon className="w-10 h-10 text-white" />
      </div>
      <div className="text-5xl font-bold text-white mb-2">
        {hasAnimated ? count : 0}+
      </div>
      <div className="text-white text-lg font-medium">
        {stat.label}
      </div>
    </div>
  );
};

export const StatsSection: React.FC = () => (
  <section className="section-snap bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {stats.map((stat, index) => (
          <AnimatedStat key={index} stat={stat} />
        ))}
      </div>
    </div>
  </section>
);