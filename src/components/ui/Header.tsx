// components/ui/Header.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CurrentUserStats } from '@/types';

interface HeaderProps {
  currentUser?: CurrentUserStats | null;
  activePage?: 'dashboard' | 'members' | 'admin';
  isAdminAuthenticated?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  activePage = 'dashboard',
  isAdminAuthenticated = false
}) => {
  const pathname = usePathname();
  
  // Check if the current path contains '/auth/'
  const isAuthPath = pathname?.includes('/auth/') || false;
  
  // Fixed header style with transparent background
  const headerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    zIndex: 50,
    backgroundColor: 'transparent'
  } as React.CSSProperties;
  
  return (
    <div className='fixed'>
      <header style={headerStyle} className="px-12 py-8 flex gap-12 items-center">
        <div className="flex items-center space-x-4 font-oswald ">
          <div className="bg-background text-secondary font-bold p-2 rounded text-xl">8:8</div>
          <span className="font-bold text-2xl text-background">Clockd</span>
        </div>
        
        <nav className="hidden md:flex space-x-8">
          <Link 
            href="/" 
            className={`${
              isAuthPath && activePage === 'dashboard' 
                ? `border-b-2 border-current text-background` 
                : "text-background"
            }`}
          >
            Dashboard
          </Link>
          {isAdminAuthenticated && (
            <Link 
              href="/admin" 
              className={`${
                isAuthPath && activePage === 'admin' 
                  ? `border-b-2 border-current text-background` 
                  : "text-background"
              }`}
            >
              Admin
            </Link>
          )}
        </nav>
      </header>
      {/* Add spacing element to prevent content from being hidden under the fixed header */}
      <div className="h-24"></div>
    </div>
  );
};

export default Header;