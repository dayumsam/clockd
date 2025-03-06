// components/UserManagement.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Save, X, Plus } from 'lucide-react';
import { User } from '@/types';

// For demo purposes only - this would connect to your real API
// const mockApiEndpoint = '/api/users';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state for editing/adding user
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    team: '',
    apiToken: '',
    weeklyTarget: 40,
    isActive: true,
  });
  
  // New user form state
  const [isAddingUser, setIsAddingUser] = useState(false);
  
  // Fetch users
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // This would be replaced with a real API call
      // const response = await fetch(mockApiEndpoint);
      // const data = await response.json();
      // setUsers(data);
      
      // For now, we're using mock data
      const mockUsers = [
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@example.com',
          avatar: '/api/placeholder/40/40',
          team: 'Design Team',
          apiToken: 'api_token_1',
          weeklyTarget: 40,
          isActive: true,
        },
        {
          id: '2',
          name: 'David Chen',
          email: 'david.chen@example.com',
          avatar: '/api/placeholder/40/40',
          team: 'Development',
          apiToken: 'api_token_2',
          weeklyTarget: 40,
          isActive: true,
        },
        {
          id: '3',
          name: 'Maria Rodriguez',
          email: 'maria.rodriguez@example.com',
          avatar: '/api/placeholder/40/40',
          team: 'Marketing',
          apiToken: 'api_token_3',
          weeklyTarget: 40,
          isActive: true,
        },
      ];
      
      setUsers(mockUsers);
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
    setFormData({ ...user });
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      team: '',
      apiToken: '',
      weeklyTarget: 40,
      isActive: true,
    });
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else if (name === 'weeklyTarget') {
      setFormData({ ...formData, [name]: parseInt(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  // Save user (edit or add)
  const handleSave = async () => {
    // Validate form
    if (!formData.name || !formData.email || !formData.team || !formData.apiToken) {
      setError('All fields are required');
      return;
    }
    
    try {
      if (editingId) {
        // Update existing user
        // This would be a real API call in production
        // await fetch(`${mockApiEndpoint}/${editingId}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData),
        // });
        
        // For demo, update locally
        setUsers(users.map(user => 
          user.id === editingId ? { ...user, ...formData } as User : user
        ));
      } else {
        // Add new user
        // This would be a real API call in production
        // const response = await fetch(mockApiEndpoint, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData),
        // });
        // const newUser = await response.json();
        
        // For demo, create locally with a random ID
        const newUser = {
          ...formData,
          id: `new-${Date.now()}`,
          avatar: '/api/placeholder/40/40',
        } as User;
        
        setUsers([...users, newUser]);
      }
      
      // Reset form
      handleCancelEdit();
      setIsAddingUser(false);
      setError(null);
    } catch (err) {
      setError('Failed to save user');
      console.error('Error saving user:', err);
    }
  };
  
  // Delete user
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      // This would be a real API call in production
      // await fetch(`${mockApiEndpoint}/${id}`, { method: 'DELETE' });
      
      // For demo, remove locally
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      setError('Failed to delete user');
      console.error('Error deleting user:', err);
    }
  };
  
  // Start adding a new user
  const handleAddNew = () => {
    setIsAddingUser(true);
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      team: '',
      apiToken: '',
      weeklyTarget: 40,
      isActive: true,
    });
  };
  
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button 
          onClick={handleAddNew} 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
          disabled={isAddingUser}
        >
          <Plus size={18} className="mr-2" />
          Add New User
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {/* Add/Edit Form */}
      {(isAddingUser || editingId) && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
              <input
                type="text"
                name="team"
                value={formData.team || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weekly Target (hours)</label>
              <input
                type="number"
                name="weeklyTarget"
                value={formData.weeklyTarget || 40}
                onChange={handleInputChange}
                min="1"
                max="80"
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Toggl API Token</label>
              <input
                type="text"
                name="apiToken"
                value={formData.apiToken || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
              <p className="text-sm text-gray-500 mt-1">
                Users can find their API token in their Toggl profile settings
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
            >
              <X size={18} className="mr-2" />
              Cancel
            </button>
            
            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
            >
              <Save size={18} className="mr-2" />
              Save
            </button>
          </div>
        </div>
      )}
      
      {/* Users Table */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading users...</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weekly Target</th>
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
                        <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.team}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.weeklyTarget} hours</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleEdit(user)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;