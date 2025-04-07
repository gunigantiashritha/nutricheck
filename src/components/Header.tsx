
import React from 'react';
import { HeartPulse } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-health-blue to-health-teal p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <HeartPulse className="h-8 w-8 text-white" />
          <h1 className="text-2xl font-bold text-white">NutriCheck</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
