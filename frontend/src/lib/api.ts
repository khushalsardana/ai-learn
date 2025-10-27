import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses (token expired/invalid)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear it
      localStorage.removeItem('token');
      // Redirect to login if not already there
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  logout: () =>
    api.post('/auth/logout'),
  
  getMe: () =>
    api.get('/auth/me'),
};

// Courses API
export const coursesAPI = {
  getAll: () =>
    api.get('/courses'),
  
  getByTopic: (topic: string) =>
    api.get(`/courses/${topic}`),
};

// Quiz API
export const quizAPI = {
  generate: (topic: string, difficulty = 'medium', count = 5) =>
    api.get(`/quiz/generate?topic=${topic}&difficulty=${difficulty}&count=${count}`),
  
  submit: (data: { quizId: string; answers: string[]; timeSpent: number }) =>
    api.post('/quiz/submit', data),
  
  getHistory: (userId: string) =>
    api.get(`/quiz/history/${userId}`),
  
  getDetails: (quizId: string) =>
    api.get(`/quiz/details/${quizId}`),
};

// Analytics API
export const analyticsAPI = {
  analyze: (userId: string) =>
    api.get(`/analyze/${userId}`),
};

export default api;
