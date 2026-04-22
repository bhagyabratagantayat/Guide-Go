import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://guide-go-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gg_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response interceptor for detailed error logging & 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Detailed Debugging Snippet (Ready-to-paste style but permanent)
    console.group(`🚨 API ERROR: [${error.config?.method?.toUpperCase()}] ${error.config?.url}`);
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message || error.message);
    console.error('Payload:', error.config?.data ? JSON.parse(error.config.data) : 'None');
    console.groupEnd();

    if (error.response?.status === 401) {
      localStorage.removeItem('gg_token');
      localStorage.removeItem('gg_user');
      localStorage.removeItem('userInfo');
      // Only redirect if not already on login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
