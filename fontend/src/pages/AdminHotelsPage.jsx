import React, { useState, useEffect } from 'react';
import {
  getAdminHotels,
  createAdminHotel,
  updateAdminHotel,
  deleteAdminHotel,
} from '../services/api';
import '../styles/AdminPage.css';

const AdminHotelsPage = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    stars: 3,
    price_per_night: '',
    budget_category: 'mid-range',
    amenities: '',
    description: '',
  });

  const budgetCategories = ['budget', 'mid-range', 'luxury', 'ultra-luxury'];
  const amenitiesList = [
    'WiFi',
    'Pool',
    'Gym',
    'Restaurant',
    'Bar',
    'Spa',
    'Parking',
    'AC',
    'Room Service',
  ];

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getAdminHotels();
      setHotels(response.data);
    } catch (err) {
      setError('Failed to load hotels: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'stars' || name === 'price_per_night' ? parseFloat(value) : value,
    }));
  };

  const handleAmenitiesChange = (amenity) => {
    const amenities = formData.amenities.split(',').filter((a) => a.trim());
    const index = amenities.indexOf(amenity);

    if (index > -1) {
      amenities.splice(index, 1);
    } else {
      amenities.push(amenity);
    }

    setFormData((prev) => ({
      ...prev,
      amenities: amenities.join(', '),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.destination || !formData.price_per_night) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      if (editingId) {
        await updateAdminHotel(editingId, formData);
        setSuccess('Hotel updated successfully!');
      } else {
        await createAdminHotel(formData);
        setSuccess('Hotel created successfully!');
      }
      setFormData({
        name: '',
        destination: '',
        stars: 3,
        price_per_night: '',
        budget_category: 'mid-range',
        amenities: '',
        description: '',
      });
      setEditingId(null);
      fetchHotels();
    } catch (err) {
      setError('Failed to save hotel: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleEdit = (hotel) => {
    setEditingId(hotel.id);
    setFormData({
      name: hotel.name,
      destination: hotel.destination,
      stars: hotel.stars,
      price_per_night: hotel.price_per_night,
      budget_category: hotel.budget_category,
      amenities: hotel.amenities || '',
      description: hotel.description || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      try {
        await deleteAdminHotel(id);
        setSuccess('Hotel deleted successfully!');
        fetchHotels();
      } catch (err) {
        setError('Failed to delete hotel: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      name: '',
      destination: '',
      stars: 3,
      price_per_night: '',
      budget_category: 'mid-range',
      amenities: '',
      description: '',
    });
    setError('');
    setSuccess('');
  };

  return (
    <div className="admin-page">
      <h1>🏨 Manage Hotels</h1>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Form */}
      <div className="admin-form-section">
        <h2>{editingId ? 'Edit Hotel' : 'Add New Hotel'}</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Hotel Name *</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter hotel name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="destination">Destination *</label>
              <input
                id="destination"
                type="text"
                name="destination"
                placeholder="Enter destination"
                value={formData.destination}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="stars">Star Rating</label>
              <select
                id="stars"
                name="stars"
                value={formData.stars}
                onChange={handleInputChange}
              >
                <option value={1}>1 Star</option>
                <option value={2}>2 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={5}>5 Stars</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="price_per_night">Price Per Night (TSH) *</label>
              <input
                id="price_per_night"
                type="number"
                name="price_per_night"
                placeholder="Enter price"
                value={formData.price_per_night}
                onChange={handleInputChange}
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="budget_category">Budget Category</label>
              <select
                id="budget_category"
                name="budget_category"
                value={formData.budget_category}
                onChange={handleInputChange}
              >
                {budgetCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter hotel description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
            ></textarea>
          </div>

          <div className="form-group">
            <label>Amenities</label>
            <div className="amenities-grid">
              {amenitiesList.map((amenity) => (
                <label key={amenity} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenitiesChange(amenity)}
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingId ? 'Update Hotel' : 'Create Hotel'}
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
        <h2>Hotels List</h2>
        {loading ? (
          <p>Loading hotels...</p>
        ) : hotels.length === 0 ? (
          <p>No hotels found</p>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Destination</th>
                  <th>Stars</th>
                  <th>Price/Night</th>
                  <th>Category</th>
                  <th>Amenities</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {hotels.map((hotel) => (
                  <tr key={hotel.id}>
                    <td>{hotel.name}</td>
                    <td>{hotel.destination}</td>
                    <td>{'⭐'.repeat(hotel.stars)}</td>
                    <td>TSH {hotel.price_per_night.toLocaleString()}</td>
                    <td>{hotel.budget_category}</td>
                    <td>
                      {hotel.amenities ? (
                        <span className="amenities-tag">
                          {hotel.amenities.split(',').length} amenities
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="actions">
                      <button
                        onClick={() => handleEdit(hotel)}
                        className="btn-edit"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(hotel.id)}
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

export default AdminHotelsPage;
