import { useState, useCallback } from 'react';
import { showtimesAPI, bookingsAPI } from '../services/api';

export const useBooking = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const selectMovie = useCallback(async (movie) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedMovie(movie);
      
      const showtimesData = await showtimesAPI.getByMovie(movie.id);
      setShowtimes(showtimesData);
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch showtimes';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const selectShowtime = useCallback(async (showtime) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedShowtime(showtime);
      
      const seatsData = await showtimesAPI.getSeats(showtime.id);
      setSeats(seatsData.seats);
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch seats';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleSeat = useCallback((seat) => {
    if (seat.status === 'booked') return;
    
    const seatKey = `${seat.row}${seat.number}`;
    const isSelected = selectedSeats.some(s => `${s.row}${s.number}` === seatKey);
    
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => `${s.row}${s.number}` !== seatKey));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  }, [selectedSeats]);

  const bookTickets = useCallback(async () => {
    if (selectedSeats.length === 0) {
      return { success: false, error: 'Please select at least one seat' };
    }

    try {
      setLoading(true);
      setError(null);
      
      const totalAmount = selectedSeats.length * selectedShowtime.price;
      const bookingData = {
        showtimeId: selectedShowtime.id,
        seats: selectedSeats.map(seat => ({
          row: seat.row,
          number: seat.number,
          status: 'BOOKED'
        })),
        totalAmount: totalAmount
      };

      await bookingsAPI.create(bookingData);
      
      // Reset selection
      setSelectedSeats([]);
      
      // Fetch updated bookings to include the new booking
      try {
        const bookingsData = await bookingsAPI.getAll();
        setBookings(bookingsData);
      } catch (fetchErr) {
        console.warn('Failed to fetch updated bookings:', fetchErr);
        // Don't fail the booking if we can't fetch updated bookings
      }
      
      return { success: true, totalAmount };
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Booking failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [selectedSeats, selectedShowtime]);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const bookingsData = await bookingsAPI.getAll();
      setBookings(bookingsData);
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch bookings';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelBooking = useCallback(async (bookingId) => {
    try {
      setLoading(true);
      setError(null);
      await bookingsAPI.cancel(bookingId);
      setBookings((prev) => prev.filter(b => b.id !== bookingId));
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to cancel booking';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const getBookingById = useCallback(async (bookingId) => {
    try {
      setLoading(true);
      setError(null);
      const booking = await bookingsAPI.getById(bookingId);
      return booking;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch booking details';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedMovie(null);
    setSelectedShowtime(null);
    setShowtimes([]);
    setSeats([]);
    setSelectedSeats([]);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    selectedMovie,
    selectedShowtime,
    showtimes,
    theatres,
    seats,
    selectedSeats,
    bookings,
    loading,
    error,
    
    // Actions
    selectMovie,
    selectShowtime,
    toggleSeat,
    bookTickets,
    fetchBookings,
    cancelBooking,
    getBookingById,
    clearSelection,
    clearError,
  };
}; 