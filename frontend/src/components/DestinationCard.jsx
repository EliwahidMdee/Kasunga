import React from 'react';
import { Link } from 'react-router-dom';
import './DestinationCard.css';

const DestinationCard = ({ destination }) => {
  return (
    <div className="destination-card">
      <div className="card-image">
        <img
          src={destination.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'}
          alt={destination.name}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400';
          }}
        />
        {destination.category && (
          <span className="card-badge">{destination.category}</span>
        )}
      </div>
      <div className="card-content">
        <h3 className="card-title">{destination.name}</h3>
        <p className="card-location">
          <i className="icon-location">📍</i>
          {destination.city}, {destination.country}
        </p>
        <p className="card-description">
          {destination.description?.substring(0, 100)}...
        </p>
        <div className="card-footer">
          <div className="card-budget">
            <span className="budget-label">Budget:</span>
            <span className="budget-value">
              {destination.budget_min && destination.budget_max 
                ? `$${destination.budget_min} - $${destination.budget_max}`
                : destination.budget_level}
            </span>
          </div>
          <Link to={`/destinations/${destination.id}`} className="card-button">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
