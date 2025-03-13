// app/admin/page.tsx
"use client";

import { useState, useEffect } from 'react';
import UserManagement from '@/components/UserManagement';
import { useRouter } from 'next/navigation';
import { Lock, LogOut } from 'lucide-react';
import Header from '@/components/ui/Header';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/check-auth', {
          method: 'GET',
          credentials: 'include', // Important for sending cookies
        });
        
        if (response.ok) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
        credentials: 'include', // Important for receiving cookies
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setIsAuthenticated(true);
        setErrorMessage('');
      } else {
        setErrorMessage(data.message || 'Invalid password. Please try again.');
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      setErrorMessage('An error occurred during authentication. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      setIsAuthenticated(false);
      router.push('/admin');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-slate-800 font-sans">
        {/* Hero Section - Similar to WorkplaceHoursDashboard */}
        <section className="bg-secondary text-background p-8 md:p-12 h-[450px] rounded-b-[3rem] flex items-center justify-center">
          <div className="max-w-4xl text-center">
            <h1 className="text-5xl md:text-8xl font-black font-lexend mb-8">Admin<br/>Access</h1>
            <div className="inline-block bg-white bg-opacity-20 px-4 py-2 rounded-full">
              <div className="flex items-center space-x-2">
                <Lock size={16} />
                <span>Secured Area</span>
              </div>
            </div>
          </div>
        </section>

        {/* Login Form */}
        <div className="flex items-center justify-center -mt-24">
          <div className="max-w-md w-full p-8 bg-white rounded-3xl shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
            
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                {errorMessage}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 mb-2 font-medium">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-lg"
                  required
                  autoFocus
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-3 px-4 bg-secondary text-white rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50 text-lg font-medium transition-all"
              >
                Login to Admin
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-slate-800 font-sans">
      {/* Transparent Header - Using the same Header component as WorkplaceHoursDashboard */}
      <Header activePage="admin" isAdminAuthenticated={isAuthenticated} />

      {/* Hero Section */}
      <section className="bg-secondary text-background p-8 md:p-12 md:pt-30 h-[350px] rounded-b-[3rem] flex items-center">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-black font-lexend mb-2">Admin<br/>Dashboard</h1>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto p-8">
        <div className="">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">User Management</h2>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all flex items-center"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
          </div>
          <UserManagement />
        </div>
      </div>
    </div>
  );
}