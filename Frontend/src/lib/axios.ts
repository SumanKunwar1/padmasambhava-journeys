// src/lib/axios.ts
import axios from 'axios';

// Get API URL from environment
const isDevelopment = import.meta.env.MODE === 'development';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (isDevelopment ? 'http://localhost:5020/api/v1' : 'https://api.padmasambhavatrip.com/api/v1');

console.log('🔧 Axios configuration:');
console.log('   Mode:', import.meta.env.MODE);
console.log('   API_BASE_URL:', API_BASE_URL);
console.log('   isDevelopment:', isDevelopment);

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // CRITICAL: Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor - Add auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('adminToken');
    
    // CRITICAL: Always add Authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token added to request:', token.substring(0, 20) + '...');
    } else {
      console.warn('⚠️  No token found in localStorage');
    }
    
    console.log('📤 Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      fullURL: config.baseURL + config.url,
      hasAuth: !!token,
      withCredentials: config.withCredentials,
      headers: {
        Authorization: config.headers.Authorization ? 'Present' : 'Missing',
        'Content-Type': config.headers['Content-Type'],
      }
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('📥 Response:', {
      status: response.status,
      url: response.config.url,
      success: response.data?.status === 'success',
    });
    return response;
  },
  (error) => {
    console.error('❌ Response error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
    });

    // If 401 Unauthorized, clear token and redirect to login
    if (error.response?.status === 401) {
      console.warn('⚠️  Unauthorized (401) - clearing token');
      localStorage.removeItem('adminToken');
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/admin/login')) {
        console.log('🔄 Redirecting to login...');
        window.location.href = '/admin/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;