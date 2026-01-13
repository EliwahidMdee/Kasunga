import React, { useState, useEffect } from 'react';
import {
  getAdminTransport,
  createAdminTransport,
  updateAdminTransport,
  deleteAdminTransport,
} from '../services/api';
import '../styles/AdminPage.css';

const AdminTransportPage = () => {
  const [transports, setTransports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    transport_type: 'flight',
    distance_km: '',
    price: '',
    duration_hours: '',
    description: '',
  });

  const transportTypes = ['flight', 'train', 'bus', 'car', 'ship'];

  useEffect(() => {
    fetchTransports();
  }, []);

  const fetchTransports = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getAdminTransport();
      setTransports(response.data);
    } catch (err) {
      setError('Failed to load transports: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['distance_km', 'price', 'duration_hours'].includes(name)
        ? parseFloat(value)
        : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (
      !formData.origin ||
      !formData.destination ||
      !formData.transport_type ||
      !formData.price
    ) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      if (editingId) {
        await updateAdminTransport(editingId, formData);
        setSuccess('Transport updated successfully!');
      } else {
        await createAdminTransport(formData);
        setSuccess('Transport created successfully!');
      }
      setFormData({
        origin: '',
        destination: '',
        transport_type: 'flight',
        distance_km: '',
        price: '',
        duration_hours: '',
        description: '',
      });
      setEditingId(null);
      fetchTransports();
    } catch (err) {
      setError('Failed to save transport: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleEdit = (transport) => {
    setEditingId(transport.id);
    setFormData({
      origin: transport.origin,
      destination: transport.destination,
      transport_type: transport.transport_type,
      distance_km: transport.distance_km,
      price: transport.price,
      duration_hours: transport.duration_hours,
      description: transport.description || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transport?')) {
      try {
        await deleteAdminTransport(id);
        setSuccess('Transport deleted successfully!');
        fetchTransports();
      } catch (err) {
        setError('Failed to delete transport: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      origin: '',
      destination: '',
      transport_type: 'flight',
      distance_km: '',
      price: '',
      duration_hours: '',
      description: '',
    });
    setError('');
    setSuccess('');
  };

  const getTransportEmoji = (type) => {
    const emojis = {
      flight: '✈️',
      train: '🚂',
      bus: '🚌',
      car: '🚗',
      ship: '🚢',
    };
    return emojis[type] || '🚗';
  };

  return (
    <div className="admin-page">
      <h1>🚗 Manage Transport</h1>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Form */}
      <div className="admin-form-section">
        <h2>{editingId ? 'Edit Transport' : 'Add New Transport'}</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="origin">Origin *</label>
              <input
                id="origin"
                type="text"
                name="origin"
                placeholder="e.g., New York"
                value={formData.origin}
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
                placeholder="e.g., Los Angeles"
                value={formData.destination}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="transport_type">Transport Type *</label>
              <select
                id="transport_type"
                name="transport_type"
                value={formData.transport_type}
                onChange={handleInputChange}
                required
              >
                {transportTypes.map((type) => (
                  <option key={type} value={type}>
                    {getTransportEmoji(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="distance_km">Distance (km)</label>
              <input
                id="distance_km"
                type="number"
                name="distance_km"
                placeholder="Enter distance"
                value={formData.distance_km}
                onChange={handleInputChange}
                step="0.1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="duration_hours">Duration (hours)</label>
              <input
                id="duration_hours"
                type="number"
                name="duration_hours"
                placeholder="Enter duration"
                value={formData.duration_hours}
                onChange={handleInputChange}
                step="0.5"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price (TSH) *</label>
              <input
                id="price"
                type="number"
                name="price"
                placeholder="Enter price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter transport description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
            ></textarea>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingId ? 'Update Transport' : 'Create Transport'}
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
        <h2>Transport List</h2>
        {loading ? (
          <p>Loading transports...</p>
        ) : transports.length === 0 ? (
          <p>No transports found</p>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Origin</th>
                  <th>Destination</th>
                  <th>Distance (km)</th>
                  <th>Duration (hrs)</th>
                  <th>Price (TSH)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transports.map((transport) => (
                  <tr key={transport.id}>
                    <td>
                      {getTransportEmoji(transport.transport_type)}{' '}
                      {transport.transport_type.charAt(0).toUpperCase() +
                        transport.transport_type.slice(1)}
                    </td>
                    <td>{transport.origin}</td>
                    <td>{transport.destination}</td>
                    <td>{transport.distance_km || '-'}</td>
                    <td>{transport.duration_hours || '-'}</td>
                    <td>TSH {transport.price.toLocaleString()}</td>
                    <td className="actions">
                      <button
                        onClick={() => handleEdit(transport)}
                        className="btn-edit"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(transport.id)}
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

export default AdminTransportPage;
