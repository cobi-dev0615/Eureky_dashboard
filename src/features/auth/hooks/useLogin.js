import { useState } from 'react';
import { authService } from '../../../shared/services/auth';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);
      
      if (!response.success) {
        throw new Error(response.message || 'Error al iniciar sesión');
      }

      return response;
    } catch (err) {
      const errorMessage = err.message || 'Error al iniciar sesión';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
    error,
    clearError: () => setError(null)
  };
};