import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as api from '../services/api';
import './DestinationDetails.css';

const DestinationDetails = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Fallback image constant
  const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800';

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const response = await api.getDestinationDetail(id);
        setDestination(response.data);
        setSelectedImage(response.data.image_url);
      } catch (err) {
        setError('Failed to load destination details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDestination();
  }, [id]);

  if (loading) {
    return (
      <div className="destination-details-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="destination-details-container">
        <div className="error-message">{error}</div>
        <Link to="/dashboard" className="back-button">← Back to Dashboard</Link>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="destination-details-container">
        <div className="error-message">Destination not found</div>
        <Link to="/dashboard" className="back-button">← Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="destination-details-container">
      <Link to="/dashboard" className="back-link">← Back to Destinations</Link>

      {/* Image Gallery */}
      <div className="image-gallery">
        <div className="main-image">
          <img
            src={selectedImage || FALLBACK_IMAGE}
            alt={destination.name}
            onError={(e) => {
              e.target.src = FALLBACK_IMAGE;
            }}
          />
        </div>
        
        {destination.images && destination.images.length > 0 && (
          <div className="thumbnail-gallery">
            <div
              className={`thumbnail ${selectedImage === destination.image_url ? 'active' : ''}`}
              onClick={() => setSelectedImage(destination.image_url)}
            >
              <img src={destination.image_url} alt="Main" />
            </div>
            {destination.images.map((img, index) => (
              <div
                key={index}
                className={`thumbnail ${selectedImage === img.image_url ? 'active' : ''}`}
                onClick={() => setSelectedImage(img.image_url)}
              >
                <img src={img.image_url} alt={img.caption || `Image ${index + 1}`} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Destination Info */}
      <div className="destination-info">
        <div className="info-header">
          <div>
            <h1 className="destination-name">{destination.name}</h1>
            <p className="destination-location">
              <i className="icon">📍</i> {destination.city}, {destination.country}
            </p>
          </div>
          <div className="info-badges">
            {destination.category && (
              <span className="badge badge-category">{destination.category}</span>
            )}
            {destination.budget_level && (
              <span className="badge badge-budget">{destination.budget_level}</span>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="info-section">
          <h2 className="section-title">About</h2>
          <p className="destination-description">{destination.description}</p>
        </div>

        {/* Details Grid */}
        <div className="details-grid">
          <div className="detail-card">
            <div className="detail-icon">💰</div>
            <h3>Budget Range</h3>
            <p>
              {destination.budget_min && destination.budget_max
                ? `$${destination.budget_min} - $${destination.budget_max}`
                : destination.budget_level}
            </p>
          </div>

          <div className="detail-card">
            <div className="detail-icon">🌡️</div>
            <h3>Temperature</h3>
            <p>{destination.avg_temperature}</p>
          </div>

          <div className="detail-card">
            <div className="detail-icon">🗓️</div>
            <h3>Best Season</h3>
            <p>{destination.best_season}</p>
          </div>

          {destination.location && (
            <div className="detail-card">
              <div className="detail-icon">📍</div>
              <h3>Full Location</h3>
              <p>{destination.location}</p>
            </div>
          )}
        </div>

        {/* Travel Objectives */}
        {destination.objectives_supported && destination.objectives_supported.length > 0 && (
          <div className="info-section">
            <h2 className="section-title">Perfect For</h2>
            <div className="objectives-list">
              {destination.objectives_supported.map((objective, index) => (
                <span key={index} className="objective-badge">
                  {objective}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Booking Button */}
        <div className="booking-section">
          {destination.booking_url ? (
            <a
              href={destination.booking_url}
              target="_blank"
              rel="noopener noreferrer"
              className="booking-button"
            >
              Book Now →
            </a>
          ) : (
            <Link to="/planning" className="booking-button">
              Plan Your Trip →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default DestinationDetails;
