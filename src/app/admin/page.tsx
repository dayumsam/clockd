// app/admin/page.tsx
"use client";

import { useState, useEffect } from 'react';
import UserManagement from '@/components/UserManagement';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import Header from '@/components/ui/Header';
import AdminLogin from '@/components/ui/AdminLogin';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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

  const handleSubmit = async (password: string) => {
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
    return <AdminLogin onSubmit={handleSubmit} errorMessage={errorMessage} isLoading={isLoading} />;
  }

  return (
    <div className="min-h-screen bg-background text-slate-800">
      {/* Transparent Header - Using the same Header component as WorkplaceHoursDashboard */}
      <Header activePage="admin" isAdminAuthenticated={isAuthenticated} />

      {/* Hero Section */}
      <section className="bg-secondary text-background p-8 md:p-12 md:pt-30 h-[350px] rounded-b-[3rem] flex items-center">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-black font-lexend mb-2">Admin<br/>Dashboard</h1>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto py-8">
        <div className="">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">User Management</h2>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-primary text-white cursor-pointer rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all flex items-center"
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