import React, { useState, useEffect } from 'react';
import './App.css';
import * as api from './api';

// ==================== COMPONENTS ====================

// Registration Component - Allows users to create new account
const Register = ({ onSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...userData } = formData;
      await api.registerUser(userData);
      setSuccess('Registration successful! Switching to login...');
      setTimeout(() => onSuccess(), 1500);
    } catch (err) {
      setError(err.response?.data?.username?.[0] || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Create Account</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} />
          <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p>Already have an account? <button onClick={onSwitchToLogin} className="link-btn">Login here</button></p>
      </div>
    </div>
  );
};

// Login Component - Allows users to log in
const Login = ({ onSuccess, onSwitchToRegister }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.loginUser(credentials.username, credentials.password);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', credentials.username);
      onSuccess();
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="Username" value={credentials.username} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={credentials.password} onChange={handleChange} required />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p>Don't have an account? <button onClick={onSwitchToRegister} className="link-btn">Register here</button></p>
      </div>
    </div>
  );
};

// Travel Preference Component - Let users set their preferences
const TravelPreference = ({ onNext }) => {
  const [preferences, setPreferences] = useState({
    budget: 'medium',
    interest: 'beach',
    num_travelers: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({ ...prev, [name]: name === 'num_travelers' ? parseInt(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Try to get existing preferences first
      try {
        const existing = await api.getUserPreferences();
        await api.updateUserPreferences(existing.data.id, preferences);
      } catch {
        // If no preferences exist, create new ones
        const userId = localStorage.getItem('userId');
        await api.createUserPreferences({ user: userId, ...preferences });
      }
      onNext(preferences);
    } catch (err) {
      setError('Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>Travel Preferences</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          {/* Budget selection */}
          <div className="form-group">
            <label>Budget Level *</label>
            <select name="budget" value={preferences.budget} onChange={handleChange} required>
              <option value="low">Low Budget</option>
              <option value="medium">Medium Budget</option>
              <option value="high">High Budget</option>
            </select>
          </div>

          {/* Interest selection */}
          <div className="form-group">
            <label>Interest Category *</label>
            <select name="interest" value={preferences.interest} onChange={handleChange} required>
              <option value="beach">Beach</option>
              <option value="wildlife">Wildlife</option>
              <option value="historical">Historical</option>
              <option value="city_tour">City Tour</option>
              <option value="adventure">Adventure</option>
              <option value="culture">Culture</option>
            </select>
          </div>

          {/* Number of travelers */}
          <div className="form-group">
            <label>Number of Travelers *</label>
            <input type="number" name="num_travelers" value={preferences.num_travelers} onChange={handleChange} min="1" max="20" required />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Travel Planning Component - Main trip planning interface
const TravelPlanning = ({ preferences, onBack }) => {
  const [step, setStep] = useState(1);
  const [tripData, setTripData] = useState({
    travel_date: '',
    return_date: '',
    country: '',
  });
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Get destinations
  const handleGetRecommendations = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const destinations = await api.getRecommendedDestinations(
        preferences.budget,
        preferences.interest,
        tripData.country
      );
      setRecommendations({ destinations: destinations.data.recommendations });
      setStep(2);
    } catch (err) {
      setError('Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Select destination and get hotels
  const handleSelectDestination = async (destinationId) => {
    setError('');
    setLoading(true);

    try {
      const hotels = await api.getRecommendedHotels(destinationId, preferences.budget);
      setRecommendations((prev) => ({
        ...prev,
        selectedDestinationId: destinationId,
        hotels: hotels.data.recommendations,
      }));
      setStep(3);
    } catch (err) {
      setError('Failed to get hotel recommendations');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Create travel plan
  const handleCreatePlan = async (hotelId) => {
    setError('');
    setLoading(true);

    try {
      const response = await api.createTravelPlanWithRecommendations({
        travel_date: tripData.travel_date,
        return_date: tripData.return_date,
        budget: preferences.budget,
        num_travelers: preferences.num_travelers,
        interest: preferences.interest,
        country: tripData.country,
      });
      alert('Travel plan created successfully!');
      setStep(4);
      setRecommendations((prev) => ({ ...prev, travelPlan: response.data.travel_plan }));
    } catch (err) {
      setError('Failed to create travel plan');
    } finally {
      setLoading(false);
    }
  };

  const handleTripDataChange = (e) => {
    const { name, value } = e.target;
    setTripData((prev) => ({ ...prev, [name]: value }));
  };

  if (step === 1) {
    return (
      <div className="form-container">
        <button onClick={onBack} className="btn-back">← Back</button>
        <div className="form-card">
          <h2>Plan Your Trip</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleGetRecommendations}>
            <div className="form-group">
              <label>Destination Country</label>
              <input type="text" name="country" placeholder="e.g., Tanzania" value={tripData.country} onChange={handleTripDataChange} />
            </div>
            <div className="form-group">
              <label>Travel Date *</label>
              <input type="date" name="travel_date" value={tripData.travel_date} onChange={handleTripDataChange} required />
            </div>
            <div className="form-group">
              <label>Return Date *</label>
              <input type="date" name="return_date" value={tripData.return_date} onChange={handleTripDataChange} required />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Getting Recommendations...' : 'Get Recommendations'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (step === 2 && recommendations?.destinations) {
    return (
      <div className="form-container">
        <button onClick={() => setStep(1)} className="btn-back">← Back</button>
        <div className="form-card">
          <h2>Select Destination</h2>
          {error && <div className="error-message">{error}</div>}
          <div className="recommendations-grid">
            {recommendations.destinations.map((dest) => (
              <div key={dest.id} className="recommendation-card" onClick={() => handleSelectDestination(dest.id)}>
                {dest.image_url && <img src={dest.image_url} alt={dest.name} />}
                <h3>{dest.name}</h3>
                <p><strong>Country:</strong> {dest.country}</p>
                <p><strong>Category:</strong> {dest.category}</p>
                <p>{dest.description}</p>
                <p><strong>Budget:</strong> {dest.budget_level}</p>
                <button className="btn-select">Select</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === 3 && recommendations?.hotels) {
    return (
      <div className="form-container">
        <button onClick={() => setStep(2)} className="btn-back">← Back</button>
        <div className="form-card">
          <h2>Select Hotel</h2>
          {error && <div className="error-message">{error}</div>}
          <div className="recommendations-grid">
            {recommendations.hotels.map((hotel) => (
              <div key={hotel.id} className="recommendation-card" onClick={() => handleCreatePlan(hotel.id)}>
                {hotel.image_url && <img src={hotel.image_url} alt={hotel.name} />}
                <h3>{hotel.name}</h3>
                <p><strong>Stars:</strong> {'⭐'.repeat(hotel.stars)}</p>
                <p><strong>Price/Night:</strong> ${hotel.price_per_night}</p>
                <p>{hotel.description}</p>
                <p><strong>Amenities:</strong> {hotel.amenities}</p>
                <button className="btn-select">Book</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === 4 && recommendations?.travelPlan) {
    const plan = recommendations.travelPlan;
    return (
      <div className="form-container">
        <div className="form-card success-card">
          <h2>✓ Your Travel Plan is Ready!</h2>
          <div className="plan-summary">
            <div className="summary-section">
              <h3>Destination</h3>
              <p>{plan.destination_details?.name}, {plan.destination_details?.country}</p>
            </div>
            <div className="summary-section">
              <h3>Dates</h3>
              <p>{plan.travel_date} to {plan.return_date}</p>
            </div>
            <div className="summary-section">
              <h3>Hotel</h3>
              <p>{plan.hotel_details?.name} ({plan.hotel_details?.stars} ⭐)</p>
            </div>
            <div className="summary-section">
              <h3>Budget</h3>
              <p>${plan.budget}</p>
            </div>
            {plan.itinerary && (
              <div className="summary-section">
                <h3>Itinerary</h3>
                <p>Generated itinerary available for your trip</p>
              </div>
            )}
          </div>
          <button onClick={() => setStep(1)} className="btn-primary">Plan Another Trip</button>
        </div>
      </div>
    );
  }

  return null;
};

// ==================== MAIN APP COMPONENT ====================

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [showRegister, setShowRegister] = useState(false);
  const [preferences, setPreferences] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    if (localStorage.getItem('token')) {
      setIsAuthenticated(true);
      setCurrentPage('dashboard');
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage('preferences');
  };

  const handleRegisterSuccess = () => {
    setShowRegister(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    setCurrentPage('landing');
  };

  // Landing page for non-authenticated users
  if (!isAuthenticated && currentPage === 'landing') {
    return (
      <div className="landing-page">
        <header className="navbar">
          <h1>✈️ Travel Planner</h1>
        </header>
        <main className="landing-content">
          <section className="hero">
            <h2>Plan Your Perfect Trip</h2>
            <p>Get personalized travel recommendations based on your preferences, budget, and interests.</p>
            <button className="btn-primary large" onClick={() => setShowRegister(false)}>Login</button>
            <button className="btn-secondary large" onClick={() => setShowRegister(true)}>Register</button>
          </section>
          <section className="features">
            <h3>How It Works</h3>
            <div className="feature-grid">
              <div className="feature">
                <h4>1. Set Preferences</h4>
                <p>Tell us your budget and interests</p>
              </div>
              <div className="feature">
                <h4>2. Get Recommendations</h4>
                <p>Receive personalized destination suggestions</p>
              </div>
              <div className="feature">
                <h4>3. Choose Hotels & Transport</h4>
                <p>Select from recommended options</p>
              </div>
              <div className="feature">
                <h4>4. Get Itinerary</h4>
                <p>Automatic day-by-day travel plan</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // Authentication pages
  if (!isAuthenticated) {
    return showRegister ? (
      <Register onSuccess={handleRegisterSuccess} onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login onSuccess={handleLoginSuccess} onSwitchToRegister={() => setShowRegister(true)} />
    );
  }

  // Authenticated user pages
  return (
    <div className="app">
      <header className="navbar">
        <h1>✈️ Travel Planner</h1>
        <nav className="nav-menu">
          <button onClick={() => setCurrentPage('dashboard')} className={currentPage === 'dashboard' ? 'active' : ''}>
            Dashboard
          </button>
          <button onClick={() => setCurrentPage('preferences')} className={currentPage === 'preferences' ? 'active' : ''}>
            My Preferences
          </button>
          <button onClick={() => setCurrentPage('planning')} className={currentPage === 'planning' ? 'active' : ''}>
            Plan Trip
          </button>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </nav>
      </header>

      <main className="main-content">
        {currentPage === 'dashboard' && (
          <div className="dashboard">
            <h2>Welcome back, {localStorage.getItem('username')}!</h2>
            <p>Your travel planning dashboard</p>
            <button onClick={() => setCurrentPage('planning')} className="btn-primary">
              Start Planning a Trip
            </button>
          </div>
        )}

        {currentPage === 'preferences' && (
          <TravelPreference
            onNext={(prefs) => {
              setPreferences(prefs);
              setCurrentPage('planning');
            }}
          />
        )}

        {currentPage === 'planning' && preferences && (
          <TravelPlanning
            preferences={preferences}
            onBack={() => setCurrentPage('dashboard')}
          />
        )}
      </main>
    </div>
  );
}

export default App;

