import { useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import { CONFIG } from '../constants/config';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
        const userData = localStorage.getItem(CONFIG.STORAGE_KEYS.USER);
        
        if (token && userData) {
          setUser(JSON.parse(userData));
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        // Clear corrupted data
        localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      const { accessToken, user: userData } = await authAPI.login(email, password);
      
      // Store in localStorage
      localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, accessToken);
      localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(userData));
      
      setUser(userData);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const register = useCallback(async (name, email, password, role = 'USER') => {
    try {
      setError(null);
      const { accessToken, user: userData } = await authAPI.register(name, email, password, role);
      
      // Store in localStorage
      localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, accessToken);
      localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(userData));
      
      setUser(userData);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
    localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
    setUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user,
  };
}; 