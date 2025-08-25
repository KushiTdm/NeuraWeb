// frontend/src/context/LanguageContext.tsx
import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.contact': 'Contact',
    'nav.quote': 'Get Quote',
    'nav.booking': 'Book Meeting',
    'nav.login': 'Login',
    'nav.register': 'Sign Up',
    'nav.logout': 'Logout',
    'nav.projectWizard': 'Project Wizard',
    
    // Homepage
    'home.hero.title': 'Professional Web Development & AI Integration',
    'home.hero.subtitle': 'Transform your business with cutting-edge web solutions, intelligent automation, and seamless AI integration.',
    'home.hero.cta1': 'Get Started',
    'home.hero.cta2': 'Request Quote',
    'home.hero.cta.ready': 'Ready to Transform Your Business?',
    'home.hero.cta.discuss': "Let's discuss your project and create something amazing together.",
    'home.features.title': 'Why Choose NeuraWeb?',
    'home.features.subtitle': 'We combine technical expertise with business insight to deliver exceptional results.',
    'home.features.fast.title': 'Fast & Efficient',
    'home.features.fast.desc': 'Lightning-fast development with modern tools',
    'home.features.secure.title': 'Secure & Reliable',
    'home.features.secure.desc': 'Enterprise-grade security and reliability',
    'home.features.support.title': '24/7 Support',
    'home.features.support.desc': 'Round-the-clock support for your peace of mind',
    'home.services.subtitle': 'We offer comprehensive solutions to help your business thrive in the digital age.',
    
    // Services
    'services.title': 'Our Services',
    'services.web.title': 'Web Development',
    'services.web.desc': 'Custom websites and web applications built with modern technologies.',
    'services.automation.title': 'Automation',
    'services.automation.desc': 'Streamline your processes with intelligent automation solutions.',
    'services.ai.title': 'AI Integration',
    'services.ai.desc': 'Integrate artificial intelligence to enhance your business capabilities.',
    
    // Contact
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Get in touch with us to discuss your project and see how we can help bring your vision to life.',
    'contact.name': 'Full Name',
    'contact.email': 'Email Address',
    'contact.message': 'Your Message',
    'contact.send': 'Send Message',
    'contact.success': 'Message sent successfully!',
    'contact.info.title': 'Get in Touch',
    'contact.info.email': 'Email',
    'contact.info.phone': 'Phone',
    'contact.info.location': 'Location',
    'contact.info.location.value': 'Montreal, QC, Canada',
    'contact.why.title': 'Why Work With Us?',
    'contact.why.experience': '• Expert team with 10+ years experience',
    'contact.why.tech': '• Cutting-edge technologies and best practices',
    'contact.why.support': '• Dedicated support throughout the project',
    'contact.why.pricing': '• Transparent pricing and timelines',
    
    // Quote
    'quote.title': 'Request a Quote',
    'quote.subtitle': 'Tell us about your project and get an instant estimate. We\'ll provide a detailed quote within 24 hours.',
    'quote.service': 'Service Type',
    'quote.service.placeholder': 'Select a service...',
    'quote.service.showcase': 'Showcase Website',
    'quote.service.ecommerce': 'E-commerce Platform',
    'quote.service.automation': 'Automation Bot',
    'quote.service.ai': 'AI Integration',
    'quote.options': 'Additional Options',
    'quote.option.design': 'Custom Design',
    'quote.option.maintenance': 'Maintenance Package',
    'quote.option.support': 'Priority Support',
    'quote.estimate': 'Estimated Price',
    'quote.estimate.total': 'Total',
    'quote.estimate.disclaimer': '*This is an estimated price. Final quote may vary based on specific requirements.',
    'quote.estimate.included': 'What\'s Included:',
    'quote.estimate.included.design': '• Professional design & development',
    'quote.estimate.included.responsive': '• Responsive mobile-friendly layout',
    'quote.estimate.included.seo': '• SEO optimization',
    'quote.estimate.included.warranty': '• 3 months warranty',
    'quote.submit': 'Request Quote',
    'quote.success': 'Quote request submitted successfully!',
    'quote.details': 'Additional Details',
    'quote.details.placeholder': 'Tell us more about your project requirements...',
    
    // Booking
    'booking.title': 'Book a Meeting',
    'booking.subtitle': 'Schedule a free consultation to discuss your project requirements and explore how we can help.',
    'booking.select': 'Select a time slot',
    'booking.book': 'Book Meeting',
    'booking.success': 'Meeting booked successfully!',
    'booking.info.title': 'Your Information',
    'booking.phone': 'Phone Number',
    'booking.discuss': 'What would you like to discuss?',
    'booking.discuss.placeholder': 'Tell us about your project or questions you\'d like to discuss...',
    'booking.selected': 'Selected Time Slot:',
    'booking.available': 'Available',
    'booking.booked': 'Booked',
    'booking.meeting.time': 'Meeting Time:',
    'booking.slot.select.error': 'Please select a time slot',
    
    // Admin
    'admin.title': 'Admin Dashboard',
    'admin.login': 'Login',
    'admin.email': 'Email',
    'admin.password': 'Password',
    'admin.demo.title': 'Demo Credentials:',
    'admin.demo.email': 'Email: admin@neuraweb.com',
    'admin.demo.password': 'Password: admin123',
    'admin.logout': 'Logout',
    'admin.quotes': 'Quote Requests',
    'admin.contacts': 'Contact Messages',
    'admin.meetings': 'Booked Meetings',
    'admin.status.pending': 'Pending',
    'admin.status.reviewing': 'Reviewing',
    'admin.status.completed': 'Completed',
    'admin.status.confirmed': 'Confirmed',
    'admin.no.quotes': 'No quote requests yet.',
    'admin.no.contacts': 'No contact messages yet.',
    'admin.no.meetings': 'No booked meetings yet.',
    'admin.details': 'Details',
    'admin.service': 'Service:',
    'admin.price': 'Price:',
    'admin.login.success': 'Logged in successfully',
    'admin.login.error': 'Invalid credentials',
    'admin.logout.success': 'Logged out successfully',
    'admin.status.update.success': 'Status updated successfully',
    'admin.status.update.error': 'Error updating status',
    
    // Header
    'header.toggle.theme': 'Toggle theme',
    'header.toggle.language': 'Toggle language',
    'header.toggle.menu': 'Toggle menu',
    'header.logout': 'Logout',

    // Footer
    'footer.company.description': 'Professional web development and AI integration services to transform your business.',
    'footer.services.ecommerce': 'E-commerce Solutions',
    'footer.services.maintenance': 'Maintenance & Support',
    'footer.links.title': 'Quick Links',
    'footer.links.admin': 'Admin Login',
    'footer.copyright': '© 2024 NeuraWeb. All rights reserved.',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.name.required': 'Name is required',
    'common.email.required': 'Email is required',
    'common.email.invalid': 'Please enter a valid email address',
    'common.message.required': 'Message is required',
    'common.password.required': 'Password is required',
    'common.service.required': 'Please select a service type',
  },
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.services': 'Services',
    'nav.contact': 'Contact',
    'nav.quote': 'Devis',
    'nav.booking': 'Rendez-vous',
    'nav.login': 'Connexion',
    'nav.register': 'S\'inscrire',
    'nav.logout': 'Déconnexion',
    'nav.projectWizard': 'Assistant Projet',
    
    // Homepage
    'home.hero.title': 'Développement Web Professionnel & Intégration IA',
    'home.hero.subtitle': 'Transformez votre entreprise avec des solutions web de pointe, une automatisation intelligente et une intégration IA transparente.',
    'home.hero.cta1': 'Commencer',
    'home.hero.cta2': 'Demander un Devis',
    'home.hero.cta.ready': 'Prêt à Transformer Votre Entreprise ?',
    'home.hero.cta.discuss': 'Discutons de votre projet et créons quelque chose d\'extraordinaire ensemble.',
    'home.features.title': 'Pourquoi Choisir NeuraWeb ?',
    'home.features.subtitle': 'Nous combinons l\'expertise technique avec l\'intelligence business pour livrer des résultats exceptionnels.',
    'home.features.fast.title': 'Rapide & Efficace',
    'home.features.fast.desc': 'Développement ultra-rapide avec des outils modernes',
    'home.features.secure.title': 'Sécurisé & Fiable',
    'home.features.secure.desc': 'Sécurité et fiabilité de niveau entreprise',
    'home.features.support.title': 'Support 24/7',
    'home.features.support.desc': 'Support continu pour votre tranquillité d\'esprit',
    'home.services.subtitle': 'Nous offrons des solutions complètes pour aider votre entreprise à prospérer à l\'ère numérique.',
    
    // Services
    'services.title': 'Nos Services',
    'services.web.title': 'Développement Web',
    'services.web.desc': 'Sites web et applications web personnalisés construits avec des technologies modernes.',
    'services.automation.title': 'Automatisation',
    'services.automation.desc': 'Optimisez vos processus avec des solutions d\'automatisation intelligentes.',
    'services.ai.title': 'Intégration IA',
    'services.ai.desc': 'Intégrez l\'intelligence artificielle pour améliorer les capacités de votre entreprise.',
    
    // Contact
    'contact.title': 'Nous Contacter',
    'contact.subtitle': 'Contactez-nous pour discuter de votre projet et voir comment nous pouvons vous aider à concrétiser votre vision.',
    'contact.name': 'Nom Complet',
    'contact.email': 'Adresse Email',
    'contact.message': 'Votre Message',
    'contact.send': 'Envoyer le Message',
    'contact.success': 'Message envoyé avec succès !',
    'contact.info.title': 'Entrer en Contact',
    'contact.info.email': 'Email',
    'contact.info.phone': 'Téléphone',
    'contact.info.location': 'Localisation',
    'contact.info.location.value': 'Montréal, QC, Canada',
    'contact.why.title': 'Pourquoi Travailler Avec Nous ?',
    'contact.why.experience': '• Équipe d\'experts avec plus de 10 ans d\'expérience',
    'contact.why.tech': '• Technologies de pointe et meilleures pratiques',
    'contact.why.support': '• Support dédié tout au long du projet',
    'contact.why.pricing': '• Tarification et délais transparents',
    
    // Quote
    'quote.title': 'Demander un Devis',
    'quote.subtitle': 'Parlez-nous de votre projet et obtenez une estimation instantanée. Nous fournirons un devis détaillé sous 24 heures.',
    'quote.service': 'Type de Service',
    'quote.service.placeholder': 'Sélectionnez un service...',
    'quote.service.showcase': 'Site Vitrine',
    'quote.service.ecommerce': 'Plateforme E-commerce',
    'quote.service.automation': 'Bot d\'Automatisation',
    'quote.service.ai': 'Intégration IA',
    'quote.options': 'Options Additionnelles',
    'quote.option.design': 'Design Personnalisé',
    'quote.option.maintenance': 'Package Maintenance',
    'quote.option.support': 'Support Prioritaire',
    'quote.estimate': 'Prix Estimé',
    'quote.estimate.total': 'Total',
    'quote.estimate.disclaimer': '*Ceci est un prix estimé. Le devis final peut varier selon les exigences spécifiques.',
    'quote.estimate.included': 'Ce qui est Inclus :',
    'quote.estimate.included.design': '• Design et développement professionnel',
    'quote.estimate.included.responsive': '• Interface responsive adaptée mobile',
    'quote.estimate.included.seo': '• Optimisation SEO',
    'quote.estimate.included.warranty': '• 3 mois de garantie',
    'quote.submit': 'Demander un Devis',
    'quote.success': 'Demande de devis soumise avec succès !',
    'quote.details': 'Détails Supplémentaires',
    'quote.details.placeholder': 'Parlez-nous davantage des exigences de votre projet...',
    
    // Booking
    'booking.title': 'Réserver un Rendez-vous',
    'booking.subtitle': 'Planifiez une consultation gratuite pour discuter des exigences de votre projet et explorer comment nous pouvons vous aider.',
    'booking.select': 'Sélectionnez un créneau',
    'booking.book': 'Réserver',
    'booking.success': 'Rendez-vous réservé avec succès !',
    'booking.info.title': 'Vos Informations',
    'booking.phone': 'Numéro de Téléphone',
    'booking.discuss': 'De quoi aimeriez-vous discuter ?',
    'booking.discuss.placeholder': 'Parlez-nous de votre projet ou des questions que vous aimeriez discuter...',
    'booking.selected': 'Créneau Sélectionné :',
    'booking.available': 'Disponible',
    'booking.booked': 'Réservé',
    'booking.meeting.time': 'Heure du Rendez-vous :',
    'booking.slot.select.error': 'Veuillez sélectionner un créneau horaire',
    
    // Admin
    'admin.title': 'Tableau de Bord Admin',
    'admin.login': 'Connexion',
    'admin.email': 'Email',
    'admin.password': 'Mot de Passe',
    'admin.demo.title': 'Identifiants de Démo :',
    'admin.demo.email': 'Email : admin@neuraweb.com',
    'admin.demo.password': 'Mot de passe : admin123',
    'admin.logout': 'Déconnexion',
    'admin.quotes': 'Demandes de Devis',
    'admin.contacts': 'Messages de Contact',
    'admin.meetings': 'Rendez-vous Réservés',
    'admin.status.pending': 'En Attente',
    'admin.status.reviewing': 'En Révision',
    'admin.status.completed': 'Terminé',
    'admin.status.confirmed': 'Confirmé',
    'admin.no.quotes': 'Aucune demande de devis pour le moment.',
    'admin.no.contacts': 'Aucun message de contact pour le moment.',
    'admin.no.meetings': 'Aucun rendez-vous réservé pour le moment.',
    'admin.details': 'Détails',
    'admin.service': 'Service :',
    'admin.price': 'Prix :',
    'admin.login.success': 'Connecté avec succès',
    'admin.login.error': 'Identifiants invalides',
    'admin.logout.success': 'Déconnecté avec succès',
    'admin.status.update.success': 'Statut mis à jour avec succès',
    'admin.status.update.error': 'Erreur lors de la mise à jour du statut',
    
    // Header
    'header.toggle.theme': 'Basculer le thème',
    'header.toggle.language': 'Changer la langue',
    'header.toggle.menu': 'Basculer le menu',
    'header.logout': 'Se déconnecter',

    // Footer
    'footer.company.description': 'Services professionnels de développement web et d\'intégration IA pour transformer votre entreprise.',
    'footer.services.ecommerce': 'Solutions E-commerce',
    'footer.services.maintenance': 'Maintenance et Support',
    'footer.links.title': 'Liens Rapides',
    'footer.links.admin': 'Connexion Admin',
    'footer.copyright': '© 2024 NeuraWeb. Tous droits réservés.',

    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Une erreur s\'est produite',
    'common.cancel': 'Annuler',
    'common.save': 'Sauvegarder',
    'common.edit': 'Modifier',
    'common.delete': 'Supprimer',
    'common.name.required': 'Le nom est requis',
    'common.email.required': 'L\'email est requis',
    'common.email.invalid': 'Veuillez entrer une adresse email valide',
    'common.message.required': 'Le message est requis',
    'common.password.required': 'Le mot de passe est requis',
    'common.service.required': 'Veuillez sélectionner un type de service',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[Language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};