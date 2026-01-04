import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token from localStorage on every request
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

// Response interceptor to handle token refresh if needed
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Movies API
export const moviesAPI = {
  getAll: () => api.get('/movies'),
  getById: (id) => api.get(`/movies/${id}`),
  create: (data) => api.post('/movies', data),
  update: (id, data) => api.put(`/movies/${id}`, data),
  delete: (id) => api.delete(`/movies/${id}`),
};

// Reviews API
export const reviewsAPI = {
  getByMovieId: (movieId) => api.get(`/reviews/movie/${movieId}`),
  getByUser: () => api.get('/reviews/user'),
  getById: (id) => api.get(`/reviews/${id}`),
  create: (data) => api.post('/reviews', data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

// Watchlist API
export const watchlistAPI = {
  getAll: () => api.get('/watchlist'),
  add: (movieId) => api.post(`/watchlist/${movieId}`),
  remove: (movieId) => api.delete(`/watchlist/${movieId}`),
  check: (movieId) => api.get(`/watchlist/check/${movieId}`),
};

// Analytics API
export const analyticsAPI = {
  getStats: () => api.get('/analytics/stats'),
  getRatingDistribution: () => api.get('/analytics/rating-distribution'),
  getGenreAnalysis: () => api.get('/analytics/genre-analysis'),
  getTopMovies: (limit = 10) => api.get(`/analytics/top-movies?limit=${limit}`),
};

export default api;
