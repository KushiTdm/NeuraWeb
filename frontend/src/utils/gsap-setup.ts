// frontend/src/utils/gsap-setup.ts
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Enregistrer les plugins GSAP
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Exposer GSAP globalement pour les composants
if (typeof window !== 'undefined') {
  window.gsap = gsap;
  window.ScrollTrigger = ScrollTrigger;
  window.ScrollToPlugin = ScrollToPlugin;
}

// Types TypeScript
declare global {
  interface Window {
    gsap: typeof gsap;
    ScrollTrigger: typeof ScrollTrigger;
    ScrollToPlugin: typeof ScrollToPlugin;
    ScrollSmoother?: any;
  }
}

export { gsap, ScrollTrigger, ScrollToPlugin };

// Hook React pour initialiser GSAP
export const useGSAPSetup = () => {
  return { gsap, ScrollTrigger, ScrollToPlugin };
};