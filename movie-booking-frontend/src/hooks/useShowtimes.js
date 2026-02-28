import { useState, useCallback } from 'react';
import { showtimesAPI } from '../services/api';

export const useShowtimes = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchShowtimes = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await showtimesAPI.getAll(params);
      setShowtimes(data);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch showtimes';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createShowtime = useCallback(async (showtimeData) => {
    try {
      setLoading(true);
      setError(null);
      const newShowtime = await showtimesAPI.create(showtimeData);
      setShowtimes((prev) => [...prev, newShowtime]);
      return { success: true, showtime: newShowtime };
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to create showtime';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    showtimes,
    loading,
    error,
    fetchShowtimes,
    createShowtime,
  };
}; 