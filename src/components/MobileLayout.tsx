import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse } from 'lucide-react';
import BottomNav from './BottomNav';

interface MobileLayoutProps {
  children: ReactNode;
}

const MobileLayout = ({ children }: MobileLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-health-blue/10 to-health-teal/10">
      {/* Top Bar */}
      <header className="bg-[#4DC3E7] p-4 shadow-md">
        <div className="flex items-center justify-between">
          <Link to="/home" className="flex items-center space-x-2">
            <HeartPulse className="h-6 w-6 text-white" />
            <h1 className="text-xl font-bold text-white">NutriCheck</h1>
          </Link>
          
          <Link to="/about" className="text-white text-sm font-medium hover:text-white/80 transition-colors">
            About
          </Link>
        </div>
      </header>
      
      {/* Content Area */}
      <main className="flex-grow pb-20 overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </main>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default MobileLayout;
