import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';

export const authService = {

  login: async (email: string, password: string) => {
    try {
      const response = await axios.post('/users/sign_in', {
        user: { email, password }
      });

      // console.log('Login response data:', response.data);
      if (response.data.user) {
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('userRole', response.data.user.role || '')
        localStorage.setItem('token', response.data.token || '')
      } else {
        console.warn("No user found in response!");
      }

      const { role, email: userEmail } = response.data.user;
      // console.log('Login successful', response.status, role, userEmail);
      return { success: true, role, email: userEmail };

    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || 'Invalid email or password'
      };
    }
  },

  register: async (email: string, password: string, role: string) => {
    // console.log('Registering with role:', role);
    try {
      const response = await axios.post('/users', {
        user: {
          email,
          password,
          password_confirmation: password,
          role
        }
      });

      if (response.data.user) {
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('userRole', response.data.user.role || '')
        localStorage.setItem('token', response.data.token || '')
      } else {
        console.warn("No user found in response!");
      }

      // console.log('Registration successful', response.status);
      return { success: true };
    } catch (error: any) {
      console.error('Registration error:', error);

      if (error.response?.status === 422) {
        const errors = error.response.data?.errors || ['Registration failed'];
        return { success: false, errors };
      }

      return { success: false, errors: ['Registration failed. Please try again.'] };
    }
  },


  logout: async () => {
    try {
      await axios.delete('/users/sign_out');

      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      localStorage.removeItem('token');
      console.log('Logout successful');

      return { success: true };
    } catch (error: any) {
      console.error('Logout error:', error.response?.data || error.message);
      if (error.response?.status === 204) {
        console.log('Logout successful (204 No Content)');
        return { success: true };
      }
      return { success: true };
    }
  }
};
