// frontend/src/components/Layout/Layout.tsx
import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header fixe en overlay avec z-index élevé */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>
      
      {/* Main content avec padding-top pour compenser le header fixe */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer conditionnel (n'apparaît pas sur la homepage) */}
      <Footer />
    </div>
  );
};

export default Layout;