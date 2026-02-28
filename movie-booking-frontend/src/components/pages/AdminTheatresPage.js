import React, { useEffect, useState } from 'react';
import { useTheatres } from '../../hooks/useTheatres';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const AdminTheatresPage = () => {
  const { theatres, loading, error, fetchTheatres, createTheatre } = useTheatres();
  const [form, setForm] = useState({
    name: '',
    location: '',
    totalSeats: '',
    rows: '',
    seatsPerRow: '',
  });
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchTheatres();
  }, [fetchTheatres]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    // Basic validation
    if (!form.name || !form.location) {
      setSuccess('Name and location are required.');
      return;
    }
    const payload = {
      name: form.name,
      location: form.location,
      totalSeats: form.totalSeats ? parseInt(form.totalSeats) : undefined,
      rows: form.rows ? parseInt(form.rows) : undefined,
      seatsPerRow: form.seatsPerRow ? parseInt(form.seatsPerRow) : undefined,
    };
    const result = await createTheatre(payload);
    if (result.success) {
      setSuccess('Theatre created successfully!');
      setForm({ name: '', location: '', totalSeats: '', rows: '', seatsPerRow: '' });
    } else {
      setSuccess(null);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold mb-6">Manage Theatres</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8 max-w-lg">
        <h3 className="text-xl font-semibold mb-4">Add New Theatre</h3>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Location</label>
          <input type="text" name="location" value={form.location} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Total Seats</label>
          <input type="number" name="totalSeats" value={form.totalSeats} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Rows</label>
          <input type="number" name="rows" value={form.rows} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Seats Per Row</label>
          <input type="number" name="seatsPerRow" value={form.seatsPerRow} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <button type="submit" className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors">Create Theatre</button>
        {success && <div className="mt-4 text-green-600">{success}</div>}
        {error && <ErrorMessage message={error} />}
      </form>
      <h3 className="text-2xl font-semibold mb-4">All Theatres</h3>
      {loading ? <LoadingSpinner /> : (
        <table className="min-w-full bg-white rounded shadow-md">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Location</th>
              <th className="py-2 px-4 border-b">Total Seats</th>
              <th className="py-2 px-4 border-b">Rows</th>
              <th className="py-2 px-4 border-b">Seats/Row</th>
            </tr>
          </thead>
          <tbody>
            {theatres.map(theatre => (
              <tr key={theatre.id}>
                <td className="py-2 px-4 border-b">{theatre.name}</td>
                <td className="py-2 px-4 border-b">{theatre.location}</td>
                <td className="py-2 px-4 border-b">{theatre.totalSeats}</td>
                <td className="py-2 px-4 border-b">{theatre.rows}</td>
                <td className="py-2 px-4 border-b">{theatre.seatsPerRow}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminTheatresPage; 