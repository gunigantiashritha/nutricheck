
import React from 'react';
import { HeartPulse, Menu } from 'lucide-react';
import Navigation from './Navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from 'react-router-dom';

const Header = () => {
  const isMobile = useIsMobile();

  return (
    <header className="bg-gradient-to-r from-health-blue to-health-teal p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <HeartPulse className="h-8 w-8 text-white" />
          <h1 className="text-2xl font-bold text-white">NutriCheck</h1>
        </Link>
        
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="mt-8">
                <Navigation vertical />
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <Navigation />
        )}
      </div>
    </header>
  );
};

export default Header;
