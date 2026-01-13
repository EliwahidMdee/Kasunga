import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import HeroSection from '../components/HeroSection';
import DestinationCard from '../components/DestinationCard';
import './DashboardPage.css';

const DashboardPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [recommendedDestinations, setRecommendedDestinations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPreferences, setUserPreferences] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load user preferences first
      let preferences = null;
      try {
        const prefResponse = await api.getUserPreferences();
        preferences = prefResponse.data;
        setUserPreferences(preferences);
      } catch (err) {
        console.warn('No user preferences found');
      }

      // Load all destinations
      const destResponse = await api.getDestinations();
      setDestinations(destResponse.data.slice(0, 6)); // Show first 6

      // Load hotels
      try {
        const hotelResponse = await api.getHotels();
        setHotels(hotelResponse.data.slice(0, 6)); // Show first 6
      } catch (err) {
        console.warn('Failed to load hotels:', err);
      }

      // If user has preferences, load recommended destinations
      if (preferences) {
        try {
          const recResponse = await api.getRecommendedDestinations({
            budget: preferences.budget,
            interest: preferences.interest,
            location: preferences.location
          });
          setRecommendedDestinations(recResponse.data.recommendations.slice(0, 6));
        } catch (err) {
          console.warn('Failed to load recommendations:', err);
        }
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading-message">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <HeroSection />

      {/* Recommended For You Section */}
      {userPreferences && recommendedDestinations.length > 0 && (
        <section className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Recommended For You</h2>
            <p className="section-subtitle">
              Based on your preferences: {userPreferences.interest}, {userPreferences.budget} budget
            </p>
          </div>
          <div className="destinations-grid">
            {recommendedDestinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        </section>
      )}

      {/* Popular Destinations Section */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Popular Destinations</h2>
          <p className="section-subtitle">Explore trending travel destinations</p>
        </div>
        {destinations.length > 0 ? (
          <div className="destinations-grid">
            {destinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        ) : (
          <p className="no-data-message">No destinations available at the moment.</p>
        )}
      </section>

      {/* Hotels Section */}
      {hotels.length > 0 && (
        <section className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Featured Hotels</h2>
            <p className="section-subtitle">Comfortable stays for your journey</p>
          </div>
          <div className="hotels-grid">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="hotel-card">
                <div className="hotel-image">
                  <img
                    src={hotel.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'}
                    alt={hotel.name}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400';
                    }}
                  />
                  <div className="hotel-stars">{'⭐'.repeat(hotel.stars)}</div>
                </div>
                <div className="hotel-content">
                  <h3 className="hotel-name">{hotel.name}</h3>
                  <p className="hotel-destination">{hotel.destination_name}</p>
                  <div className="hotel-footer">
                    <div className="hotel-price">
                      <span className="price-label">From</span>
                      <span className="price-value">${hotel.price_per_night}/night</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Call to Action */}
      {!userPreferences && (
        <section className="cta-section">
          <div className="cta-content">
            <h2>Get Personalized Recommendations</h2>
            <p>Set your travel preferences to get destinations tailored just for you</p>
            <a href="/preferences" className="cta-button">
              Set Preferences
            </a>
          </div>
        </section>
      )}
    </div>
  );
};

export default DashboardPage;

