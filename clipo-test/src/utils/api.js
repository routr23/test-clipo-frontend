import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://clipo-test-be.onrender.com/api',
  headers: { 'Content-Type': 'application/json' }
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('clipo_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — redirect to landing page, not login
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('clipo_token');
      localStorage.removeItem('clipo_user');
      // Dispatch event so AuthContext can sync in-memory state
      window.dispatchEvent(new Event('auth:logout'));
      // Only redirect if not already on a public page
      const pub = ['/', '/login', '/register', '/about', '/docs', '/privacy', '/terms'];
      if (!pub.includes(window.location.pathname)) {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
