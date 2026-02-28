import { useState, useEffect, useCallback } from 'react';
import { moviesAPI } from '../services/api';

export const useMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await moviesAPI.getAll();
      setMovies(data);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch movies';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getMovieById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const movie = await moviesAPI.getById(id);
      return movie;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch movie details';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createMovie = useCallback(async (movieData) => {
    try {
      setLoading(true);
      setError(null);
      const newMovie = await moviesAPI.create(movieData);
      setMovies((prev) => [...prev, newMovie]);
      return { success: true, movie: newMovie };
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to create movie';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return {
    movies,
    loading,
    error,
    fetchMovies,
    getMovieById,
    createMovie,
  };
}; 