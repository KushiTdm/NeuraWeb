// frontend/src/components/Section.tsx
import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
}

export const Section = ({ children, className = '' }: SectionProps) => {
  return (
    <section className={`h-screen w-full flex items-center justify-center relative overflow-hidden scroll-snap-section ${className}`}>
      {children}
    </section>
  );
};
