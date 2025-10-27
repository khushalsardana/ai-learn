import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
