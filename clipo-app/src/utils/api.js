import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://clipo-server.onrender.com/api';

console.debug('[API] baseURL', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('clipo_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => {
  console.error('[API] request error', error);
  return Promise.reject(error);
});

// Handle 401 globally and log full errors
api.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error('[API] response error', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url,
      method: error.config?.method
    });

    if (error.response?.status === 401) {
      localStorage.removeItem('clipo_token');
      localStorage.removeItem('clipo_user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
