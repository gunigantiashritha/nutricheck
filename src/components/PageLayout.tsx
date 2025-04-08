
import React, { ReactNode } from 'react';
import Header from '@/components/Header';

interface PageLayoutProps {
  children: ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-health-blue/10 to-health-teal/10">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-4xl mx-auto w-full">
          {children}
        </div>
      </main>
      
      <footer className="bg-white py-3 md:py-4 border-t">
        <div className="container mx-auto px-4 text-center text-xs md:text-sm text-gray-500">
          <p>NutriCheck © 2025 | This tool provides general guidance and is not a replacement for professional medical advice.</p>
        </div>
      </footer>
    </div>
  );
};

export default PageLayout;
