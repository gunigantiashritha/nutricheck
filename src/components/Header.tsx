import React from 'react';
import { HeartPulse, Menu, LogOut } from 'lucide-react';
import Navigation from './Navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Header = () => {
  const isMobile = useIsMobile();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You've been signed out successfully.",
    });
    navigate('/auth');
  };

  return (
    <header className="bg-gradient-to-r from-health-blue to-health-teal p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/home" className="flex items-center space-x-2">
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
              <div className="mt-8 space-y-6">
                <Navigation vertical />
                {user && (
                  <Button 
                    variant="ghost" 
                    onClick={handleSignOut}
                    className="w-full justify-start text-gray-700 hover:text-health-blue"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <div className="flex items-center space-x-4">
            <Navigation />
            {user && (
              <Button 
                variant="ghost" 
                onClick={handleSignOut}
                className="text-white/80 hover:text-white hover:bg-white/20"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
