export const CONFIG = {
  // API Configuration
  BACKEND_URL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080',
  API_BASE: process.env.REACT_APP_API_BASE || '/api',
  
  
  // Application Configuration
  APP_NAME: process.env.REACT_APP_APP_NAME || 'Movie Booking App',
  VERSION: process.env.REACT_APP_VERSION || '1.0.0',
  
  // Feature Flags
  ENABLE_DEBUG: process.env.REACT_APP_ENABLE_DEBUG === 'true',
  ENABLE_ANALYTICS: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  
  // Storage Configuration
  STORAGE_KEYS: {
    TOKEN: 'token',
    USER: 'user',
  },
  
  // Page Routes
  PAGES: {
    HOME: 'home',
    MOVIE_DETAILS: 'movie-details',
    SEAT_SELECTION: 'seat-selection',
    LOGIN: 'login',
    REGISTER: 'register',
    BOOKINGS: 'bookings',
    ADMIN_THEATRES: 'admin-theatres',
    ADMIN_SHOWTIMES: 'admin-showtimes',
    ADMIN_MOVIES: 'admin-movies',
  },
  
  // Seat Status Constants
  SEAT_STATUS: {
    AVAILABLE: 'available',
    BOOKED: 'booked',
    SELECTED: 'selected',
  },
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  MOVIES: '/movies',
  THEATRES: '/theatres',
  SHOWTIMES: '/showtimes',
  BOOKINGS: '/bookings',
}; 