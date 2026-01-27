import axios from 'axios';
import { useAuth } from '../state/AuthContext.jsx';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const createApiClient = (token) => {
  const client = axios.create({
    baseURL: `${API_BASE_URL}/api`,
  });

  client.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return client;
};

export const useApiClient = () => {
  const { token } = useAuth();
  return createApiClient(token);
};
