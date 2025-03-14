// components/ui/AdminLogin.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

interface AdminLoginProps {
  onSubmit: (password: string) => Promise<void>;
  errorMessage: string;
  isLoading: boolean;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onSubmit, errorMessage, isLoading }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password);
  };

  return (
    <div className="min-h-screen bg-background from-slate-50 to-blue-50 text-slate-800 flex flex-col">
      {/* Top navigation */}
      <div className="absolute top-6 left-6 z-10">
        <Link 
          href="/" 
          className="flex items-center space-x-2 text-white hover:text-blue-100 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium">Back to Dashboard</span>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="bg-secondary text-background p-8 md:p-12 md:pt-30 h-[350px] rounded-b-[3rem] flex items-center">

        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-black font-lexend mb-2">Admin<br/>Access</h1>
        </div>

      </section>
      

      {/* Login Card */}
      <div className="flex items-center justify-center -mt-28 px-4">
        <div className="max-w-md w-full p-8 bg-white rounded-3xl shadow-md border border-blue-50 relative overflow-hidden">
          
          <h2 className="text-2xl font-bold text-center mb-8 font-lexend relative z-10">Admin Login</h2>
          
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 shadow-sm flex items-start">
              <div className="mr-3 text-red-500 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <span>{errorMessage}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label htmlFor="password" className="block text-slate-700 font-medium">
                Password
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg pr-12 shadow-sm group-hover:border-blue-300 transition-all"
                  required
                  autoFocus
                  placeholder="Enter your admin password"
                />
                <button 
                  type="button" 
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors p-1.5 rounded-full hover:bg-blue-50"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 text-background bg-secondary cursor-pointer rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-lg font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Lock size={18} className="mr-2" />
                  Login to Admin
                </span>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm text-slate-500">
            Ask sam if you need help
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-auto py-8 text-center text-slate-500 text-sm">
        <div className="mb-1 font-medium text-slate-600">   made with 💗 by @dayumsam</div>
      </div>
    </div>
  );
};

export default AdminLogin;