"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Register: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setMessage({
      text: 'Verifying your Toggl credentials...',
      type: 'success'
    });
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage({
          text: 'Registration successful! Redirecting to dashboard...',
          type: 'success'
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        
        // Redirect to dashboard page after 2 seconds
        setTimeout(() => {
          router.push('/tv-dashboard');
        }, 2000);
      } else if (response.status === 401) {
        // Handle invalid Toggl credentials specifically
        setMessage({
          text: 'Invalid Toggl credentials. Please check your email and password.',
          type: 'error'
        });
      } else {
        setMessage({
          text: data.message || 'Registration failed',
          type: 'error'
        });
      }
    } catch {
      setMessage({
        text: 'An error occurred. Please try again later.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex ">
      {/* Video section (left side) */}
      <div className="hidden md:flex md:w-1/2 bg-secondary justify-center items-center p-8">
        <div className="w-full max-w-xl text-background">
          <h2 className="text-3xl font-bold mb-6 ">Connect Your Toggl Account</h2>
          <div className="rounded-lg overflow-hidden shadow-xl">
            <iframe 
              width="100%" 
              height="400" 
              src="https://www.loom.com/embed/eff643684d524e1ca5b76f74a9531986?sid=5f458181-670c-4b28-8f12-468c7a8b2a5c"
              allowFullScreen
              className="aspect-video"
            ></iframe>
          </div>
          <p className="mt-6">
            Watch this quick video guide to learn how our platform connects with your Toggl account to enhance your time tracking experience.
          </p>
        </div>
      </div>

      {/* Registration form (right side) */}
      <div className="w-full md:w-1/2 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-3xl font-extrabold text-secodary">
            Link your Toggl account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your Toggl email and password to connect your account
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow border-l-4 border-secondary shadow-sm  sm:rounded-xl sm:px-10">
            {message && (
              <div 
                className={`mb-4 p-4 rounded-md ${
                  message.type === 'success' 
                    ? 'bg-green-50 text-green-800' 
                    : 'bg-red-50 text-red-800'
                }`}
              >
                {message.text}
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-secondary">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                  {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Toggl Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                  {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Toggl Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                  {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                  {errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white cursor-pointer bg-secondary hover:bg-secondary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Registering...' : 'Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Mobile video section (shown below the form on small screens) */}
      <div className="md:hidden w-full px-4 py-8 bg-secondary">
        <h2 className="text-2xl font-bold text-background mb-4">Connect Your Toggl Account</h2>
        <div className="rounded-lg overflow-hidden shadow-xl">
          <iframe 
            width="100%" 
            height="215" 
            src="https://www.loom.com/embed/eff643684d524e1ca5b76f74a9531986?sid=5f458181-670c-4b28-8f12-468c7a8b2a5c" 
            allowFullScreen
            className="aspect-video"
          ></iframe>
        </div>
        <p className="mt-4 text-sm text-background">
          Watch this quick video guide to learn how our platform connects with your Toggl account to enhance your time tracking experience.
        </p>
      </div>
    </div>
  );
};

export default Register;