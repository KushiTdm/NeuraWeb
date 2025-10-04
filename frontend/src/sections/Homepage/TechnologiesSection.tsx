import React, { useRef } from 'react';

const technologies = [
  { name: 'React', icon: '⚛️', color: '#61DAFB' },
  { name: 'Node.js', icon: '🟢', color: '#339933' },
  { name: 'Python', icon: '🐍', color: '#3776AB' },
  { name: 'TypeScript', icon: 'TS', color: '#3178C6' },
  { name: 'MongoDB', icon: '🍃', color: '#47A248' },
  { name: 'AWS', icon: '☁️', color: '#FF9900' },
  { name: 'Docker', icon: '🐳', color: '#2496ED' },
  { name: 'PostgreSQL', icon: '🐘', color: '#4169E1' }
];

interface TechnologiesSectionProps {
  mousePosition: { x: number; y: number };
}

export const TechnologiesSection: React.FC<TechnologiesSectionProps> = ({ mousePosition }) => {
  const techSectionRef = useRef<HTMLDivElement>(null);

  return (
    <section 
      className="section-snap bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden min-h-screen flex items-center justify-center" 
      ref={techSectionRef}
    >
      {/* Desktop & Tablet Layout (md and up) */}
      <div className="hidden md:block absolute inset-0">
        {technologies.map((tech, i) => (
          <div
            key={i}
            className="tech-float absolute"
            style={{
              left: `${15 + (i % 4) * 20}%`,
              top: `${15 + Math.floor(i / 4) * 30}%`,
              animationDelay: `${i * 0.5}s`,
              transform: `translate(${mousePosition.x * (i % 2 ? 0.1 : -0.1)}px, ${mousePosition.y * (i % 2 ? 0.1 : -0.1)}px)`
            }}
          >
            <div 
              className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl flex flex-col items-center justify-center text-white shadow-2xl transform hover:scale-125 transition-transform duration-300 cursor-pointer"
              style={{ 
                backgroundColor: tech.color,
                boxShadow: `0 20px 60px ${tech.color}50`
              }}
            >
              <span className="text-2xl lg:text-3xl mb-1">{tech.icon}</span>
              <span className="text-xs font-bold">{tech.name}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Layout (below md) */}
      <div className="md:hidden absolute inset-0 flex items-center justify-center px-4 py-20">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-sm mx-auto">
          {technologies.map((tech, i) => (
            <div
              key={i}
              className="tech-float-mobile"
              style={{
                animationDelay: `${i * 0.3}s`
              }}
            >
              <div 
                className="w-full aspect-square rounded-2xl flex flex-col items-center justify-center text-white shadow-2xl active:scale-95 transition-transform duration-300"
                style={{ 
                  backgroundColor: tech.color,
                  boxShadow: `0 10px 40px ${tech.color}50`
                }}
              >
                <span className="text-3xl sm:text-4xl mb-2">{tech.icon}</span>
                <span className="text-xs sm:text-sm font-bold">{tech.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6 animate-on-scroll fade-up">
          Nos Technologies en Action
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-300 animate-on-scroll fade-up delay-200">
          Un écosystème technologique moderne pour des solutions performantes
        </p>
      </div>

      <style>{`
        /* Desktop floating animation */
        .tech-float {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        /* Mobile floating animation (less movement) */
        .tech-float-mobile {
          animation: float-mobile 4s ease-in-out infinite;
        }

        @keyframes float-mobile {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.05); }
        }

        /* Fade up animation */
        .animate-on-scroll {
          opacity: 0;
          animation: fadeUp 0.8s ease-out forwards;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};