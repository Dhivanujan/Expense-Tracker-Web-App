import axios from 'axios';
import { useMemo } from 'react';
import { useAuth } from '../state/AuthContext.jsx';
import { useNotification } from '../state/NotificationContext.jsx';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const useApiClient = () => {
  const { token, logout } = useAuth();
  const { addNotification } = useNotification();

  return useMemo(() => {
    const client = axios.create({
      baseURL: `${API_BASE_URL}/api`,
    });

    client.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    client.interceptors.response.use(
      (response) => response,
      (error) => {
        const message = error.response?.data?.message || error.message || 'Something went wrong';
        
        if (error.response?.status === 401) {
          addNotification('Session expired. Please login again.', 'error');
          logout();
        } else if (error.response?.status >= 500) {
          addNotification('Server error. Please try again later.', 'error');
        } else {
          addNotification(message, 'error');
        }

        return Promise.reject(error);
      }
    );

    return client;
  }, [token, logout, addNotification]);
};
