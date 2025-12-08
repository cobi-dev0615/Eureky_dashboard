import { apiClient } from './api';

export const authService = {
  async register(userData) {
    const { phoneNumber, name, password, email } = userData;
    
    return await apiClient.post('/auth/register', {
      phoneNumber,
      name,
      password,
      email
    });
  },

  async login(credentials) {
    const { phoneNumber, password } = credentials;
    
    const response = await apiClient.post('/auth/login', {
      phoneNumber,
      password
    });

    // Store user data and token from response
    if (response.success && response.data) {
      const { token, userId, name, isVerified } = response.data;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify({
        userId,
        phoneNumber: response.data.phoneNumber,
        name,
        isVerified
      }));
    }

    return response;
  },

  async logout() {
    // Clear local storage or any auth tokens
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
};