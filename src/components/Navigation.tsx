
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const NavigationItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Upload', path: '/upload' },
  { name: 'Results', path: '/results' },
];

const Navigation = () => {
  const location = useLocation();

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {NavigationItems.map((item) => (
          <NavigationMenuItem key={item.name}>
            <Link to={item.path}>
              <NavigationMenuLink 
                className={cn(
                  "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                  location.pathname === item.path ? "bg-accent text-accent-foreground" : "text-foreground"
                )}
              >
                {item.name}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navigation;
