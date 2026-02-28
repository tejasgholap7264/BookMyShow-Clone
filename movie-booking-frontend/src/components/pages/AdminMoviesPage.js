import React, { useEffect, useState } from 'react';
import { useMovies } from '../../hooks/useMovies';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const AdminMoviesPage = () => {
  const { movies, loading, error, fetchMovies, createMovie } = useMovies();
  const [form, setForm] = useState({
    title: '',
    description: '',
    genre: '',
    rating: '',
    duration: '',
    language: '',
    posterUrl: '',
    releaseDate: '',
  });
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    // Basic validation
    if (!form.title || !form.description || !form.genre || !form.language || !form.posterUrl) {
      setSuccess('Title, description, genre, language, and poster URL are required.');
      return;
    }
    const payload = {
      title: form.title,
      description: form.description,
      genre: form.genre,
      rating: form.rating ? parseFloat(form.rating) : undefined,
      duration: form.duration ? parseInt(form.duration) : undefined,
      language: form.language,
      posterUrl: form.posterUrl,
      releaseDate: form.releaseDate ? new Date(form.releaseDate).toISOString() : undefined,
    };
    const result = await createMovie(payload);
    if (result.success) {
      setSuccess('Movie created successfully!');
      setForm({ title: '', description: '', genre: '', rating: '', duration: '', language: '', posterUrl: '', releaseDate: '' });
    } else {
      setSuccess(null);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold mb-6">Manage Movies</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8 max-w-lg">
        <h3 className="text-xl font-semibold mb-4">Add New Movie</h3>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Title</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" rows="3" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Genre</label>
          <input type="text" name="genre" value={form.genre} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Rating (0-10)</label>
          <input type="number" step="0.1" min="0" max="10" name="rating" value={form.rating} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Duration (minutes)</label>
          <input type="number" name="duration" value={form.duration} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Language</label>
          <input type="text" name="language" value={form.language} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Poster URL</label>
          <input type="url" name="posterUrl" value={form.posterUrl} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Release Date</label>
          <input type="date" name="releaseDate" value={form.releaseDate} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <button type="submit" className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors">Create Movie</button>
        {success && <div className="mt-4 text-green-600">{success}</div>}
        {error && <ErrorMessage message={error} />}
      </form>
      <h3 className="text-2xl font-semibold mb-4">All Movies</h3>
      {loading ? <LoadingSpinner /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map(movie => (
            <div key={movie.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={movie.posterUrl} alt={movie.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h4 className="text-lg font-semibold mb-2">{movie.title}</h4>
                <p className="text-gray-600 text-sm mb-2">{movie.description}</p>
                <div className="flex justify-between text-sm">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded">{movie.genre}</span>
                  <span className="text-gray-500">{movie.language}</span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <span>Rating: {movie.rating}/10</span>
                  <span className="ml-4">Duration: {movie.duration} min</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMoviesPage; 