import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface User {
  id: number;
  email: string;
  role: string;
  first_name?: string;
  last_name?: string;
  created_at: string;
}

export const userService = {
  getUsers: async (): Promise<{ success: boolean; users?: User[]; error?: string }> => {
    try {
      const response = await axios.get('/api/v1/users');
      console.log('👥 USERS_RESPONSE:', response.data);
      
      // Handle both old and new response formats
      const users = response.data.users || response.data;
      return { success: true, users: users };
    } catch (error: any) {
      console.error('❌ GET_USERS_ERROR:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || error.response?.data?.message || 'Failed to fetch users'
      };
    }
  },

  getUser: async (id: number): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      const response = await axios.get(`/api/v1/users/${id}`);
      return { success: true, user: response.data };
    } catch (error: any) {
      console.error('Get user error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch user'
      };
    }
  },

  createUser: async (userData: {
    email: string;
    password: string;
    password_confirmation: string;
    role: string;
    first_name?: string;
    last_name?: string;
  }): Promise<{ success: boolean; user?: User; error?: string; errors?: string[] }> => {
    try {
      const response = await axios.post('/api/v1/users', { user: userData });
      return { success: true, user: response.data.user };
    } catch (error: any) {
      console.error('Create user error:', error.response?.data || error.message);
      
      if (error.response?.status === 422) {
        return {
          success: false,
          errors: error.response.data?.errors || ['Failed to create user']
        };
      }
      
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create user'
      };
    }
  },

  
  updateUser: async (id: number, userData: Partial<User>): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      const response = await axios.put(`/api/v1/users/${id}`, { user: userData });
      return { success: true, user: response.data.user };
    } catch (error: any) {
      console.error('Update user error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update user'
      };
    }
  },

  deleteUser: async (id: number): Promise<{ success: boolean; error?: string }> => {
    try {
      await axios.delete(`/api/v1/users/${id}`);
      return { success: true };
    } catch (error: any) {
      console.error('Delete user error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete user'
      };
    }
  }
};
