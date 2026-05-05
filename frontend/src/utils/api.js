import axios from 'axios';

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// In development, we use Vite's proxy (/api) to avoid CORS/Unreachable issues.
// In production, we use the full Render URL.
const defaultBaseURL = isLocal ? '/api' : 'https://guide-go-backend.onrender.com/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || defaultBaseURL,
  withCredentials: true 
});

console.log(`🔌 API Connected to: ${api.defaults.baseURL}`);

// REQUEST INTERCEPTOR: Inject token from localStorage into Headers
api.interceptors.request.use((config) => {
  const userData = JSON.parse(localStorage.getItem('gg_user'));
  if (userData?.token) {
    config.headers.Authorization = `Bearer ${userData.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loop if refresh token itself fails
    if (originalRequest.url.includes('/auth/refresh-token')) {
      return Promise.reject(error);
    }

    // Handle Token Expired (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.post('/auth/refresh-token');
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear user and redirect silently
        localStorage.removeItem('gg_user');
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
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
    
    // Show alert for debugging (only in local dev)
    if (isLocal && error.response?.status !== 401 && error.response?.status !== 403) {
      console.error(`API Error (${error.config?.url}):`, error.response?.status);
    }
    
    console.groupEnd();

    return Promise.reject(error);
  }
);

export default api;
