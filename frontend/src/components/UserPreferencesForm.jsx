import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './UserPreferencesForm.css';

const UserPreferencesForm = ({ onSave }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState({
    budget: 'medium',
    budget_min: '',
    budget_max: '',
    interest: 'beach',
    location: '',
    objective: 'leisure',
    accommodation_type: 'hotel',
    num_travelers: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [existingPreferences, setExistingPreferences] = useState(null);

  useEffect(() => {
    loadExistingPreferences();
  }, []);

  const loadExistingPreferences = async () => {
    try {
      const response = await api.getUserPreferences();
      if (response.data) {
        setExistingPreferences(response.data);
        setPreferences({
          budget: response.data.budget || 'medium',
          budget_min: response.data.budget_min || '',
          budget_max: response.data.budget_max || '',
          interest: response.data.interest || 'beach',
          location: response.data.location || '',
          objective: response.data.objective || 'leisure',
          accommodation_type: response.data.accommodation_type || 'hotel',
          num_travelers: response.data.num_travelers || 1,
        });
      }
    } catch (err) {
      // No preferences exist yet
      console.log('No existing preferences');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: name === 'num_travelers' ? parseInt(value) || 1 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Prepare data
      const dataToSend = {
        ...preferences,
        budget_min: preferences.budget_min ? parseFloat(preferences.budget_min) : null,
        budget_max: preferences.budget_max ? parseFloat(preferences.budget_max) : null,
      };

      if (existingPreferences) {
        // Update existing preferences
        await api.updateUserPreferences(existingPreferences.id, dataToSend);
        setSuccess('Preferences updated successfully!');
      } else {
        // Create new preferences - use userId from auth context
        const userId = user?.userId || localStorage.getItem('userId');
        if (!userId) {
          setError('User ID not found. Please log in again.');
          return;
        }
        await api.createUserPreferences({ user: userId, ...dataToSend });
        setSuccess('Preferences saved successfully!');
      }

      if (onSave) {
        onSave(preferences);
      }

      // Reload preferences
      setTimeout(() => {
        loadExistingPreferences();
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="preferences-form-container">
      <h2 className="form-heading">Travel Preferences</h2>
      <p className="form-description">
        Tell us about your travel preferences so we can recommend the best destinations for you
      </p>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="preferences-form">
        {/* Budget Range */}
        <div className="form-section">
          <h3 className="section-title">Budget</h3>
          <div className="form-group">
            <label htmlFor="budget">Budget Level *</label>
            <select
              id="budget"
              name="budget"
              value={preferences.budget}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="low">Low Budget</option>
              <option value="medium">Medium Budget</option>
              <option value="high">High Budget</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="budget_min">Minimum Budget ($)</label>
              <input
                type="number"
                id="budget_min"
                name="budget_min"
                value={preferences.budget_min}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., 500"
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label htmlFor="budget_max">Maximum Budget ($)</label>
              <input
                type="number"
                id="budget_max"
                name="budget_max"
                value={preferences.budget_max}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., 2000"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        {/* Travel Preferences */}
        <div className="form-section">
          <h3 className="section-title">Travel Preferences</h3>
          
          <div className="form-group">
            <label htmlFor="interest">Interest Category *</label>
            <select
              id="interest"
              name="interest"
              value={preferences.interest}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="beach">Beach</option>
              <option value="wildlife">Wildlife</option>
              <option value="historical">Historical</option>
              <option value="city_tour">City Tour</option>
              <option value="adventure">Adventure</option>
              <option value="culture">Culture</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="location">Preferred Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={preferences.location}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., Tanzania, Europe, Asia"
            />
          </div>

          <div className="form-group">
            <label htmlFor="objective">Travel Objective *</label>
            <select
              id="objective"
              name="objective"
              value={preferences.objective}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="leisure">Leisure</option>
              <option value="adventure">Adventure</option>
              <option value="honeymoon">Honeymoon</option>
              <option value="business">Business</option>
              <option value="family">Family</option>
            </select>
          </div>
        </div>

        {/* Accommodation */}
        <div className="form-section">
          <h3 className="section-title">Accommodation</h3>
          
          <div className="form-group">
            <label htmlFor="accommodation_type">Accommodation Type *</label>
            <select
              id="accommodation_type"
              name="accommodation_type"
              value={preferences.accommodation_type}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="hotel">Hotel</option>
              <option value="resort">Resort</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="hostel">Hostel</option>
              <option value="guesthouse">Guest House</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="num_travelers">Number of Travelers *</label>
            <input
              type="number"
              id="num_travelers"
              name="num_travelers"
              value={preferences.num_travelers}
              onChange={handleChange}
              className="form-input"
              min="1"
              max="20"
              required
            />
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Saving...' : existingPreferences ? 'Update Preferences' : 'Save Preferences'}
        </button>
      </form>
    </div>
  );
};

export default UserPreferencesForm;
