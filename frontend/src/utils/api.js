import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://guide-go-backend.onrender.com/api',
  withCredentials: true // Crucial for HttpOnly cookies
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle Token Expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post(`${api.defaults.baseURL}/auth/refresh-token`, {}, { withCredentials: true });
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout
        localStorage.removeItem('gg_user');
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }

    // Safety check for payload logging (avoid crashing on FormData)
    let payload = 'None';
    try {
      if (error.config?.data) {
        payload = typeof error.config.data === 'string' 
          ? JSON.parse(error.config.data) 
          : 'FormData/Binary Content';
      }
    } catch (e) {
      payload = 'Unparseable Data';
    }

    console.group(`🚨 API ERROR: [${error.config?.method?.toUpperCase()}] ${error.config?.url}`);
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message || error.message);
    console.groupEnd();

    return Promise.reject(error);
  }
);

export default api;
