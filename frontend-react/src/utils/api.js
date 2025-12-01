import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
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