import axios from 'axios';
import { CONFIG, API_ENDPOINTS } from '../constants/config';

// Create axios instance with default config
const api = axios.create({
  baseURL: `${CONFIG.BACKEND_URL}${CONFIG.API_BASE}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
      localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
    return response.data;
  },
  
  register: async (name, email, password, role = 'USER') => {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, {
      name,
      email,
      password,
      role
    });
    return response.data;
  },
};

// Movies API
export const moviesAPI = {
  getAll: async () => {
    const response = await api.get(API_ENDPOINTS.MOVIES);
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`${API_ENDPOINTS.MOVIES}/${id}`);
    return response.data;
  },
  create: async (movieData) => {
    const response = await api.post(API_ENDPOINTS.MOVIES, movieData);
    return response.data;
  },
};

// Theatres API
export const theatresAPI = {
  getAll: async () => {
    const response = await api.get(API_ENDPOINTS.THEATRES);
    return response.data;
  },
  create: async (theatreData) => {
    const response = await api.post(API_ENDPOINTS.THEATRES, theatreData);
    return response.data;
  },
};

// Showtimes API
export const showtimesAPI = {
  getAll: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.SHOWTIMES, { params });
    return response.data;
  },
  getByMovie: async (movieId) => {
    const response = await api.get(API_ENDPOINTS.SHOWTIMES, { params: { movieId } });
    return response.data;
  },
  getByTheatre: async (theatreId) => {
    const response = await api.get(API_ENDPOINTS.SHOWTIMES, { params: { theatreId } });
    return response.data;
  },
  create: async (showtimeData) => {
    const response = await api.post(API_ENDPOINTS.SHOWTIMES, showtimeData);
    return response.data;
  },
  getSeats: async (showtimeId) => {
    const response = await api.get(`${API_ENDPOINTS.SHOWTIMES}/${showtimeId}/seats`);
    return response.data;
  },
};

// Bookings API
export const bookingsAPI = {
  getAll: async () => {
    const response = await api.get(API_ENDPOINTS.BOOKINGS);
    return response.data;
  },
  getById: async (bookingId) => {
    const response = await api.get(`${API_ENDPOINTS.BOOKINGS}/${bookingId}`);
    return response.data;
  },
  create: async (bookingData) => {
    const response = await api.post(API_ENDPOINTS.BOOKINGS, bookingData);
    return response.data;
  },
  cancel: async (bookingId) => {
    const response = await api.delete(`${API_ENDPOINTS.BOOKINGS}/${bookingId}`);
    return response.data;
  },
};

export default api; 