import axios from 'axios';

// Base URL for API requests
const API_URL = 'http://localhost:4000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Get current user from localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  }
  return null;
};

// Student API functions
export const studentAPI = {
  // Get student profile
  getProfile: async () => {
    try {
      const response = await api.get('/student/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch profile' };
    }
  },

  // Update student profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/student/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  },

  // Login student
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', {
        ...credentials,
        role: 'student'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // Get student's tests
  getTests: async () => {
    try {
      const response = await api.get('/student/tests');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch tests' };
    }
  },

  // Get student's attempted tests
  getAttemptedTests: async () => {
    try {
      const response = await api.get('/student/attempted-tests');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch attempted tests' };
    }
  },

  // Get test result
  getTestResult: async (testId) => {
    try {
      const response = await api.get(`/student/result/${testId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch test result' };
    }
  }
};

export default api; 