// frontend/src/pages/HomePage.tsx
import React from 'react';
import CTASection from '../sections/Servicepage/CTASection';
import CustomCursor from '../sections/Servicepage/CustomCursor';
import HeroSection from '../sections/Servicepage/HeroSection';
import PricingSection from '../sections/Servicepage/PricingSection';
import ProcessSection from '../sections/Servicepage/ProcessSection';


const ServicePage: React.FC = () => {


  return (
    <div className="servicePage-container min-h-screen bg-slate-950 overflow-x-hidden">
      <style>{`
            @tailwind base;
            @tailwind components;
            @tailwind utilities;

            @layer base {
            * {
                cursor: none;
            }

            body {
                overflow-x: hidden;
            }
            }

            @layer utilities {
            .bg-gradient-radial {
                background-image: radial-gradient(var(--tw-gradient-stops));
            }
            }
      `}</style>
      <CustomCursor />
      <HeroSection />
      <ProcessSection />
      <PricingSection />
      <CTASection />
    </div>
  );
};

export default ServicePage;