import React, { useState, useEffect } from 'react';
import {
  getAdminDestinations,
  createAdminDestination,
  updateAdminDestination,
  deleteAdminDestination,
} from '../services/api';
import '../styles/AdminPage.css';

const AdminDestinationsPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    city: '',
    description: '',
    category: 'beach',
    budget_level: 'medium',
    best_season: '',
    avg_temperature: '',
    image_url: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);

  const categoryOptions = ['beach', 'wildlife', 'historical', 'city_tour', 'adventure', 'culture'];
  const budgetOptions = ['low', 'medium', 'high'];

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getAdminDestinations();
      setDestinations(res.data.destinations || res.data);
    } catch (err) {
      setError('Failed to load destinations: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.country || !formData.city) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      if (editingId) {
        await updateAdminDestination(editingId, formData);
        setSuccess('Destination updated successfully!');
      } else {
        await createAdminDestination(formData);
        setSuccess('Destination created successfully!');
      }
      setFormData({
        name: '',
        country: '',
        city: '',
        description: '',
        category: 'beach',
        budget_level: 'medium',
        best_season: '',
        avg_temperature: '',
        image_url: '',
      });
      setEditingId(null);
      fetchDestinations();
    } catch (err) {
      setError('Failed to save destination: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleEdit = (destination) => {
    setEditingId(destination.id);
    setFormData({
      name: destination.name,
      country: destination.country,
      city: destination.city,
      description: destination.description || '',
      category: destination.category,
      budget_level: destination.budget_level,
      best_season: destination.best_season || '',
      avg_temperature: destination.avg_temperature || '',
      image_url: destination.image_url || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this destination?')) {
      try {
        await deleteAdminDestination(id);
        setSuccess('Destination deleted successfully!');
        fetchDestinations();
      } catch (err) {
        setError('Failed to delete destination: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      name: '',
      country: '',
      city: '',
      description: '',
      category: 'beach',
      budget_level: 'medium',
      best_season: '',
      avg_temperature: '',
      image_url: '',
    });
    setError('');
    setSuccess('');
  };

  return (
    <div className="admin-page">
      <h1>📍 Manage Destinations</h1>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Form */}
      <div className="admin-form-section">
        <h2>{editingId ? 'Edit Destination' : 'Add New Destination'}</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Destination Name *</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter destination name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="country">Country *</label>
              <input
                id="country"
                type="text"
                name="country"
                placeholder="Enter country"
                value={formData.country}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="city">City *</label>
              <input
                id="city"
                type="text"
                name="city"
                placeholder="Enter city"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="budget_level">Budget Level</label>
              <select
                id="budget_level"
                name="budget_level"
                value={formData.budget_level}
                onChange={handleInputChange}
              >
                {budgetOptions.map((level) => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="best_season">Best Season</label>
              <input
                id="best_season"
                type="text"
                name="best_season"
                placeholder="e.g., Summer, Winter"
                value={formData.best_season}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="avg_temperature">Average Temperature</label>
              <input
                id="avg_temperature"
                type="text"
                name="avg_temperature"
                placeholder="e.g., 25°C"
                value={formData.avg_temperature}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter destination description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="image_url">Image URL</label>
            <input
              id="image_url"
              type="url"
              name="image_url"
              placeholder="https://example.com/image.jpg"
              value={formData.image_url}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingId ? 'Update Destination' : 'Create Destination'}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancel} className="btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="admin-table-section">
        <h2>Destinations List</h2>
        {loading ? (
          <p>Loading destinations...</p>
        ) : destinations.length === 0 ? (
          <p>No destinations found</p>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Country</th>
                  <th>City</th>
                  <th>Category</th>
                  <th>Budget</th>
                  <th>Season</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {destinations.map((dest) => (
                  <tr key={dest.id}>
                    <td>{dest.name}</td>
                    <td>{dest.country}</td>
                    <td>{dest.city}</td>
                    <td>{dest.category}</td>
                    <td>{dest.budget_level}</td>
                    <td>{dest.best_season || '-'}</td>
                    <td className="actions">
                      <button
                        onClick={() => handleEdit(dest)}
                        className="btn-edit"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(dest.id)}
                        className="btn-delete"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDestinationsPage;
