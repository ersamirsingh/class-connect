import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Unauthorized & Single-Session Expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isTerminated = error.response.data?.sessionTerminated;
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      if (isTerminated && !window.location.pathname.includes('/login')) {
        window.location.href = '/login?reason=session_terminated';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
