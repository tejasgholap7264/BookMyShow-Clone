import React, { useEffect, useState } from 'react';
import { useShowtimes } from '../../hooks/useShowtimes';
import { useMovies } from '../../hooks/useMovies';
import { useTheatres } from '../../hooks/useTheatres';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const AdminShowtimesPage = () => {
  const { showtimes, loading, error, fetchShowtimes, createShowtime } = useShowtimes();
  const { movies, fetchMovies } = useMovies();
  const { theatres, fetchTheatres } = useTheatres();
  const [form, setForm] = useState({
    movieId: '',
    theatreId: '',
    showDate: '',
    price: '',
  });
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchShowtimes();
    fetchMovies();
    fetchTheatres();
  }, [fetchShowtimes, fetchMovies, fetchTheatres]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    // Basic validation
    if (!form.movieId || !form.theatreId || !form.showDate || !form.price) {
      setSuccess('All fields are required.');
      return;
    }
    const payload = {
      movieId: form.movieId,
      theatreId: form.theatreId,
      showDate: new Date(form.showDate).toISOString(),
      price: parseFloat(form.price),
    };
    const result = await createShowtime(payload);
    if (result.success) {
      setSuccess('Showtime created successfully!');
      setForm({ movieId: '', theatreId: '', showDate: '', price: '' });
    } else {
      setSuccess(null);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold mb-6">Manage Showtimes</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8 max-w-lg">
        <h3 className="text-xl font-semibold mb-4">Add New Showtime</h3>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Movie</label>
          <select name="movieId" value={form.movieId} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
            <option value="">Select a movie</option>
            {movies.map(movie => (
              <option key={movie.id} value={movie.id}>{movie.title}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Theatre</label>
          <select name="theatreId" value={form.theatreId} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
            <option value="">Select a theatre</option>
            {theatres.map(theatre => (
              <option key={theatre.id} value={theatre.id}>{theatre.name} - {theatre.location}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Show Date & Time</label>
          <input type="datetime-local" name="showDate" value={form.showDate} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Price</label>
          <input type="number" step="0.01" name="price" value={form.price} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <button type="submit" className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors">Create Showtime</button>
        {success && <div className="mt-4 text-green-600">{success}</div>}
        {error && <ErrorMessage message={error} />}
      </form>
      <h3 className="text-2xl font-semibold mb-4">All Showtimes</h3>
      {loading ? <LoadingSpinner /> : (
        <table className="min-w-full bg-white rounded shadow-md">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Movie</th>
              <th className="py-2 px-4 border-b">Theatre</th>
              <th className="py-2 px-4 border-b">Show Date</th>
              <th className="py-2 px-4 border-b">Price</th>
              <th className="py-2 px-4 border-b">Available Seats</th>
            </tr>
          </thead>
          <tbody>
            {showtimes.map(showtime => (
              <tr key={showtime.id}>
                <td className="py-2 px-4 border-b">
                  {movies.find(m => m.id === showtime.movieId)?.title || 'N/A'}
                </td>
                <td className="py-2 px-4 border-b">
                  {theatres.find(t => t.id === showtime.theatreId)?.name || 'N/A'}
                </td>
                <td className="py-2 px-4 border-b">{new Date(showtime.showDate).toLocaleString()}</td>
                <td className="py-2 px-4 border-b">${showtime.price}</td>
                <td className="py-2 px-4 border-b">{showtime.availableSeats}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminShowtimesPage; 