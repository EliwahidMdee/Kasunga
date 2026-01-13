import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <div className="hero-section">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">Discover Your Next Adventure</h1>
        <p className="hero-subtitle">
          Explore amazing destinations, create unforgettable memories
        </p>
        <div className="hero-search">
          <input
            type="text"
            placeholder="Where do you want to go?"
            className="hero-search-input"
          />
          <button className="hero-search-btn">Search</button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
