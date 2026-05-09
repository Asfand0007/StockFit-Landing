import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export function getCookie(name) {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(nameEQ)) {
      return cookie.substring(nameEQ.length);
    }
  }

  return null;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token from auth_token cookie if present
api.interceptors.request.use((config) => {
  const requestUrl = config.url || '';
  const isAuthRoute = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/signup');
  const token = getCookie('auth_token');

  if (token && !isAuthRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor can handle global errors (e.g., logout on 401)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;
