import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Authorization header to every request if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getNonce: (wallet) => api.post('/auth/web3/nonce', { wallet }),
  verifySignature: (wallet, signature) => api.post('/auth/web3/verify', { wallet, signature }),
};

// User Profile API
export const userApi = {
  getProfile: () => api.get('/user'),
  updateProfile: (data) => api.put('/user', data),
  completeLesson: (lessonId) => api.post(`/user/lesson/${lessonId}`),
  submitQuiz: (lessonId, data) => api.post(`/user/lesson/${lessonId}/quiz`, data),
};

// Market API (OHLC / daily series)
export const marketApi = {
  getDaily: (symbol, days = 30) => api.get(`/market/${symbol}/daily`, { params: { days } }),
};

// Prediction API
export const predictApi = {
  getPrediction: (symbol, userPrediction) => api.post('/predict', { symbol, userPrediction }),
};

// News API
export const newsApi = {
  getNews: (symbol) => api.get(`/news/${symbol}`),
};

// Portfolio API
export const portfolioApi = {
  getPortfolio: (userId) => api.get(`/portfolio/${userId}`),
  addHolding: (userId, holding) => api.post('/portfolio/add', { userId, holding }),
  getHistory: (userId, days = 30) => api.get(`/portfolio/${userId}/history`, { params: { days } }),
};

// Advisor API
export const advisorApi = {
  chat: (userId, message) => api.post('/advisor/chat', { userId, message }),
};

export default api;
