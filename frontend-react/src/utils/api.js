import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ⭐ CRITICAL: Send cookies with requests
});

// Request interceptor to add auth token (for backward compatibility)
api.interceptors.request.use(
  (config) => {
    // Check both localStorage and sessionStorage for token (backward compatibility)
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Note: Cookie will be sent automatically due to withCredentials: true
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear all auth data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('user');
      // Redirect to landing page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  verifyOTP: (data) => api.post('/api/auth/verify-otp', data),
  resendOTP: (data) => api.post('/api/auth/resend-otp', data),
  login: (data) => api.post('/api/auth/login', data),
  logout: () => api.post('/api/auth/logout'), // New logout endpoint
  forgotPassword: (data) => api.post('/api/auth/forgot-password', data),
  resetPassword: (data) => api.post('/api/auth/reset-password', data),
};

// User APIs
export const userAPI = {
  getProfile: (userId) => api.get(`/api/users/${userId}`),
  updateProfile: (userId, data) => api.post(`/api/users/${userId}`, data),
  updatePassword: (userId, data) => api.post(`/api/users/${userId}/password`, data),
  deleteAccount: (userId) => api.delete(`/api/users/${userId}`),
};

// Crawl Request APIs
export const requestAPI = {
  createRequest: (data) => api.post('/api/requests', data),
  getRequests: (params) => api.get('/api/requests', { params }),
  getRequest: (id) => api.get(`/api/requests/${id}`),
  deleteRequest: (id) => api.delete(`/api/requests/${id}`),
};

// Chat/Dialog APIs
export const dialogAPI = {
  sendMessage: (data) => api.post('/api/dialogs', data),
  getMessages: (userId, params) => api.get(`/api/dialogs/${userId}`, { params }),
};

// Data & Export APIs
export const dataAPI = {
  getCrawledData: (requestId, params) => api.get(`/api/data/${requestId}`, { params }),
  downloadExport: (requestId, format) => api.get(`/api/exports/${requestId}/${format}`, {
    responseType: 'blob',
  }),
  getUserExports: (params) => api.get('/api/exports', { params }),
  createExport: (data) => api.post('/api/exports', data),
};

export default api;