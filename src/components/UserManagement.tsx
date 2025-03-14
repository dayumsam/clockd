// components/UserManagement.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Save, X, Plus, RefreshCw } from 'lucide-react';
import { User } from '@/types';
import { getUsers, createUser, updateUser, deleteUser, toggleUserActiveStatus } from '@/services/userService';
import { encrypt } from '@/config/encryption';
import Image from 'next/image';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state for editing/adding user
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    company: '',
    apiToken: '',
    isActive: true,
  });
  
  // New user form state
  const [isAddingUser, setIsAddingUser] = useState(false);
  
  // Fetch users
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
      setError(null);
    } catch (err) {
      setError('Failed to load users');
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initialize
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Start editing a user
  const handleEdit = (user: User) => {
    setEditingId(user.id);
    // Don't include the apiToken to avoid showing it in the form
    // It will be updated only if the user enters a new one
    setFormData({
      name: user.name,
      email: user.email,
      company: user.company,
      apiToken: '',
      isActive: user.isActive
    });
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      company: '',
      apiToken: '',
      isActive: true,
    });
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  // Save user (edit or add)
  const handleSave = async () => {
    // Validate form
    if (!formData.name || !formData.email) {
      setError('Name and email are required');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // If adding a new user, the API token is required
      if (!editingId && !formData.apiToken) {
        setError('API Token is required for new users');
        setIsLoading(false);
        return;
      }
      
      if (editingId) {
        // Update existing user
        const userData = { ...formData };
        
        // If a new API token was provided, encrypt it
        if (formData.apiToken) {
          const email = formData.email || '';
          const password = formData.apiToken || '';
          const togglAuth = Buffer.from(`${email}:${password}`).toString('base64');
          userData.apiToken = encrypt(togglAuth);
        } else {
          // Don't update the API token if not provided
          delete userData.apiToken;
        }
        
        const updatedUser = await updateUser(editingId, userData);
        if (updatedUser) {
          setUsers(users.map(user => 
            user.id === editingId ? updatedUser : user
          ));
        }
      } else {
        // Add new user
        // For new users, we need to encrypt the API token
        if (formData.email && formData.apiToken) {
          const togglAuth = Buffer.from(`${formData.email}:${formData.apiToken}`).toString('base64');
          const encryptedToken = encrypt(togglAuth);
          
          const newUser = await createUser({
            name: formData.name || '',
            email: formData.email || '',
            company: formData.company || '',
            apiToken: encryptedToken,
            isActive: formData.isActive ?? true,
          });
          
          if (newUser) {
            setUsers([...users, newUser]);
          }
        }
      }
      
      // Reset form
      handleCancelEdit();
      setIsAddingUser(false);
      setError(null);
    } catch (err) {
      setError('Failed to save user');
      console.error('Error saving user:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete user
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      setIsLoading(true);
      const success = await deleteUser(id);
      if (success) {
        setUsers(users.filter(user => user.id !== id));
      }
    } catch (err) {
      setError('Failed to delete user');
      console.error('Error deleting user:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle user active status
  const handleToggleStatus = async (user: User) => {
    try {
      setIsLoading(true);
      const newStatus = !user.isActive;
      const success = await toggleUserActiveStatus(user.id, newStatus);
      
      if (success) {
        setUsers(users.map(u => 
          u.id === user.id ? { ...u, isActive: newStatus } : u
        ));
      }
    } catch (err) {
      setError(`Failed to ${user.isActive ? 'deactivate' : 'activate'} user`);
      console.error('Error toggling user status:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Start adding a new user
  const handleAddNew = () => {
    setIsAddingUser(true);
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      company: '',
      apiToken: '',
      isActive: true,
    });
  };
  
  return (
    <div className="max-mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <button 
            onClick={fetchUsers} 
            className="bg-gray-100 cursor-pointer hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md flex items-center"
            disabled={isLoading}
          >
            <RefreshCw size={18} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button 
            onClick={handleAddNew} 
            className="bg-secondary hover:bg-secondary-light cursor-pointer text-white px-4 py-2 rounded-md flex items-center"
            disabled={isAddingUser || isLoading}
          >
            <Plus size={18} className="mr-2" />
            Add New User
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {/* Add/Edit Form */}
      {(isAddingUser || editingId) && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? 'Edit User' : 'Add New User'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Team/Company</label>
              <input
                type="text"
                name="company"
                value={formData.company || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {editingId ? 'New Toggl Password (leave blank to keep current)' : 'Toggl Password'}
              </label>
              <input
                type="password"
                name="apiToken"
                value={formData.apiToken || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
              <p className="text-sm text-gray-500 mt-1">
                This is the password used for Toggl account authentication
              </p>
            </div>
            
            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive || false}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Active User</span>
              </label>
            </div>
          </div>
          
          <div className="flex space-x-2 justify-end">
            <button
              onClick={handleCancelEdit}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center"
              disabled={isLoading}
            >
              <X size={18} className="mr-2" />
              Cancel
            </button>
            
            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
              disabled={isLoading}
            >
              <Save size={18} className="mr-2" />
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}
      
      {/* Users Table */}
      {isLoading && !users.length ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading users...</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border-l-4 border-secondary shadow overflow-hidden">
          {users.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-4">No users found</p>
              <button
                onClick={handleAddNew}
                className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
              >
                <Plus size={18} className="mr-2" />
                Add Your First User
              </button>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user.id} className={!user.isActive ? 'bg-gray-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <Image
                              src={user.avatar || "./temp.png"}
                              width={500}
                              height={500}
                              alt="User Image"
                              className='w-10 h-10 rounded-full'
                              />
                        </div>
                        <div className="ml-4">
                          <div className="text-xl font-medium text-gray-900 capitalize">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.company || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isActive 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        disabled={isLoading}
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={isLoading}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default UserManagement;