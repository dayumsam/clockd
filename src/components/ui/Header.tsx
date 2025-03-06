// components/ui/Header.tsx
import React from 'react';
import Link from 'next/link';
import { Clock, Calendar } from 'lucide-react';
import { CurrentUserStats } from '@/types';

interface HeaderProps {
  currentUser?: CurrentUserStats | null;
  activePage?: 'dashboard' | 'members';
}

const Header: React.FC<HeaderProps> = ({ 
  currentUser = null, 
  activePage = 'dashboard' 
}) => {
  return (
    <header className="bg-transparent shadow-sm p-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <div className="bg-black text-white font-bold p-2 rounded">MM</div>
        <span className="font-bold">MIX MASTERMIND</span>
      </div>
      
      <nav className="hidden md:flex space-x-8">
        <Link 
          href="/" 
          className={`${activePage === 'dashboard' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
        >
          Dashboard
        </Link>
        <Link 
          href="/members" 
          className={`${activePage === 'members' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
        >
          Members
        </Link>
      </nav>
      
      <div className="flex items-center space-x-4">
        <button className="text-gray-500">
          <Clock size={20} />
        </button>
        <button className="text-gray-500">
          <Calendar size={20} />
        </button>
        {currentUser && (
          <img 
            src={currentUser.avatar || "/api/placeholder/40/40"} 
            alt="Profile" 
            className="w-8 h-8 rounded-full" 
          />
        )}
      </div>
    </header>
  );
};

export default Header;