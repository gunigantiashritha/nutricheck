import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Upload, FileText, Home, Info, User } from 'lucide-react';

interface NavigationProps {
  vertical?: boolean;
}

const Navigation = ({ vertical = false }: NavigationProps) => {
  const baseNavStyles = "flex items-center transition-all duration-200";
  const horizontalNavStyles = "space-x-6";
  const verticalNavStyles = "flex-col space-y-6";
  
  const baseLinkStyles = "flex items-center text-sm font-medium transition-colors";
  const horizontalLinkStyles = "text-white/80 hover:text-white";
  const verticalLinkStyles = "text-gray-700 hover:text-health-blue";
  
  const activeHorizontalClass = "text-white";
  const activeVerticalClass = "text-health-blue";
  
  return (
    <nav className={cn(baseNavStyles, vertical ? verticalNavStyles : horizontalNavStyles)}>
      <NavLink 
        to="/home" 
        end
        className={({ isActive }) => cn(
          baseLinkStyles,
          vertical ? verticalLinkStyles : horizontalLinkStyles,
          isActive ? (vertical ? activeVerticalClass : activeHorizontalClass) : ""
        )}
      >
        {vertical && <Home className="mr-2 h-4 w-4" />}
        Home
      </NavLink>
      
      <NavLink 
        to="/about" 
        className={({ isActive }) => cn(
          baseLinkStyles,
          vertical ? verticalLinkStyles : horizontalLinkStyles,
          isActive ? (vertical ? activeVerticalClass : activeHorizontalClass) : ""
        )}
      >
        {vertical && <Info className="mr-2 h-4 w-4" />}
        About
      </NavLink>
      
      <NavLink 
        to="/upload" 
        className={({ isActive }) => cn(
          baseLinkStyles,
          vertical ? verticalLinkStyles : horizontalLinkStyles,
          isActive ? (vertical ? activeVerticalClass : activeHorizontalClass) : ""
        )}
      >
        {vertical && <Upload className="mr-2 h-4 w-4" />}
        Upload
      </NavLink>
      
      <NavLink 
        to="/results" 
        className={({ isActive }) => cn(
          baseLinkStyles,
          vertical ? verticalLinkStyles : horizontalLinkStyles,
          isActive ? (vertical ? activeVerticalClass : activeHorizontalClass) : ""
        )}
      >
        {vertical && <FileText className="mr-2 h-4 w-4" />}
        Results
      </NavLink>
      
      <NavLink 
        to="/profile" 
        className={({ isActive }) => cn(
          baseLinkStyles,
          vertical ? verticalLinkStyles : horizontalLinkStyles,
          isActive ? (vertical ? activeVerticalClass : activeHorizontalClass) : ""
        )}
      >
        {vertical && <User className="mr-2 h-4 w-4" />}
        Profile
      </NavLink>
    </nav>
  );
};

export default Navigation;
