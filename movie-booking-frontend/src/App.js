import React, { useState, useEffect } from 'react';
import './App.css';

// Hooks
import { useAuth } from './hooks/useAuth';
import { useMovies } from './hooks/useMovies';
import { useBooking } from './hooks/useBooking';
import { useTheatres } from './hooks/useTheatres';

// Components
import Header from './components/layout/Header';
import HomePage from './components/pages/HomePage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import MovieDetailsPage from './components/pages/MovieDetailsPage';
import SeatSelectionPage from './components/pages/SeatSelectionPage';
import BookingsPage from './components/pages/BookingsPage';
import AdminTheatresPage from './components/pages/AdminTheatresPage';
import AdminShowtimesPage from './components/pages/AdminShowtimesPage';
import AdminMoviesPage from './components/pages/AdminMoviesPage';

// Constants
import { CONFIG } from './constants/config';

function App() {
  const [currentPage, setCurrentPage] = useState(CONFIG.PAGES.HOME);
  
  // Custom hooks
  const auth = useAuth();
  const movies = useMovies();
  const booking = useBooking();
  const theatresHook = useTheatres();

  // Navigation handler
  const handleNavigate = (page) => {
    setCurrentPage(page);
    
    // Clear booking selection when navigating away from booking flow
    if (page === CONFIG.PAGES.HOME && currentPage !== CONFIG.PAGES.HOME) {
      booking.clearSelection();
    }
  };

  // Movie selection handler
  const handleMovieSelect = async (movie) => {
    const result = await booking.selectMovie(movie);
    if (result.success) {
      handleNavigate(CONFIG.PAGES.MOVIE_DETAILS);
    }
  };

  // Showtime selection handler
  const handleShowtimeSelect = async (showtime) => {
    const result = await booking.selectShowtime(showtime);
    if (result.success) {
      handleNavigate(CONFIG.PAGES.SEAT_SELECTION);
    }
  };

  // Booking handler
  const handleBookTickets = async () => {
    if (!auth.isAuthenticated) {
      alert('Please login to book tickets');
      handleNavigate(CONFIG.PAGES.LOGIN);
      return { success: false, error: 'Please login to book tickets' };
    }
    
    return await booking.bookTickets();
  };

  // Cancel booking handler
  const handleCancelBooking = async (bookingId) => {
    if (!auth.isAuthenticated) {
      alert('Please login to cancel bookings');
      handleNavigate(CONFIG.PAGES.LOGIN);
      return { success: false, error: 'Please login to cancel bookings' };
    }
    
    return await booking.cancelBooking(bookingId);
  };

  // Fetch bookings handler
  const handleFetchBookings = async () => {
    if (!auth.isAuthenticated) {
      handleNavigate(CONFIG.PAGES.LOGIN);
      return;
    }
    
    const result = await booking.fetchBookings();
    if (result.success) {
      handleNavigate(CONFIG.PAGES.BOOKINGS);
    }
  };

  // Logout handler
  const handleLogout = () => {
    auth.logout();
    booking.clearSelection();
    handleNavigate(CONFIG.PAGES.HOME);
  };

  // Login handler
  const handleLogin = async (email, password) => {
    return await auth.login(email, password);
  };

  // Register handler
  const handleRegister = async (name, email, password) => {
    return await auth.register(name, email, password);
  };

  // Admin navigation handlers
  const handleAdminNavigate = (page) => {
    if (!auth.isAuthenticated || auth.user?.role !== 'ADMIN') {
      alert('Admin access required');
      handleNavigate(CONFIG.PAGES.HOME);
      return;
    }
    setCurrentPage(page);
  };

  // Fetch theatres on mount
  useEffect(() => {
    theatresHook.fetchTheatres();
  }, [theatresHook.fetchTheatres]);

  // Render current page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case CONFIG.PAGES.HOME:
        return (
          <HomePage
            movies={movies.movies}
            loading={movies.loading}
            error={movies.error}
            onMovieSelect={handleMovieSelect}
            onRetry={movies.fetchMovies}
          />
        );
        
      case CONFIG.PAGES.LOGIN:
        return (
          <LoginPage
            onLogin={handleLogin}
            onNavigate={handleNavigate}
            error={auth.error}
            onClearError={auth.clearError}
          />
        );
        
      case CONFIG.PAGES.REGISTER:
        return (
          <RegisterPage
            onRegister={handleRegister}
            onNavigate={handleNavigate}
            error={auth.error}
            onClearError={auth.clearError}
          />
        );
        
      case CONFIG.PAGES.MOVIE_DETAILS:
        return (
          <MovieDetailsPage
            selectedMovie={booking.selectedMovie}
            showtimes={booking.showtimes}
            theatres={theatresHook.theatres}
            loading={booking.loading || theatresHook.loading}
            error={booking.error || theatresHook.error}
            onNavigate={handleNavigate}
            onSelectShowtime={handleShowtimeSelect}
            onRetry={() => booking.selectMovie(booking.selectedMovie)}
          />
        );
        
      case CONFIG.PAGES.SEAT_SELECTION:
        return (
          <SeatSelectionPage
            selectedMovie={booking.selectedMovie}
            selectedShowtime={booking.selectedShowtime}
            seats={booking.seats}
            selectedSeats={booking.selectedSeats}
            loading={booking.loading}
            error={booking.error}
            onNavigate={handleNavigate}
            onToggleSeat={booking.toggleSeat}
            onBookTickets={handleBookTickets}
            onRetry={() => booking.selectShowtime(booking.selectedShowtime)}
          />
        );
        
      case CONFIG.PAGES.BOOKINGS:
        return (
          <BookingsPage
            bookings={booking.bookings}
            movies={movies.movies}
            showtimes={booking.showtimes}
            loading={booking.loading}
            error={booking.error}
            onNavigate={handleNavigate}
            onRetry={booking.fetchBookings}
            onCancelBooking={handleCancelBooking}
          />
        );
        
      case CONFIG.PAGES.ADMIN_THEATRES:
        return <AdminTheatresPage />;
        
      case CONFIG.PAGES.ADMIN_SHOWTIMES:
        return <AdminShowtimesPage />;
        
      case CONFIG.PAGES.ADMIN_MOVIES:
        return <AdminMoviesPage />;
        
      default:
        return (
          <HomePage
            movies={movies.movies}
            loading={movies.loading}
            error={movies.error}
            onMovieSelect={handleMovieSelect}
            onRetry={movies.fetchMovies}
          />
        );
    }
  };

  // Show loading spinner while auth is initializing
  if (auth.loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Header
        user={auth.user}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        onFetchBookings={handleFetchBookings}
        onAdminNavigate={handleAdminNavigate}
      />
      {renderCurrentPage()}
    </div>
  );
}

export default App;