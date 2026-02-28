import { useState, useCallback } from 'react';
import { theatresAPI } from '../services/api';

export const useTheatres = () => {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTheatres = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await theatresAPI.getAll();
      setTheatres(data);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch theatres';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTheatre = useCallback(async (theatreData) => {
    try {
      setLoading(true);
      setError(null);
      const newTheatre = await theatresAPI.create(theatreData);
      setTheatres((prev) => [...prev, newTheatre]);
      return { success: true, theatre: newTheatre };
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to create theatre';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    theatres,
    loading,
    error,
    fetchTheatres,
    createTheatre,
  };
}; 