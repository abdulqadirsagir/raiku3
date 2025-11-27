import React from 'react';
import { RaikuLogo } from './RaikuLogo';
import { Auth } from './Auth';

interface HeaderProps {
    session: any;
}

export const Header: React.FC<HeaderProps> = ({ session }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800 transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
        </div>
        
        <div className="flex items-center gap-4 w-full justify-between">
             <div className="flex-1"></div>
             <div className="flex-none"></div>
             <div className="flex-1 flex justify-end items-center gap-4">
                 <Auth session={session} />
                 <a href="https://docs.raiku.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                    <RaikuLogo className="h-8 md:h-10 w-auto text-raiku-lime drop-shadow-raiku-lime" />
                 </a>
             </div>
        </div>
      </div>
    </header>
  );
};