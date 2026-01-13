import React, { useState, useEffect } from 'react';
import './App.css';
import * as api from './services/api';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { useAuth } from './context/AuthContext';

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

// Dashboard Component - Shows user statistics and quick actions
const Dashboard = ({ onNavigate }) => {
  const [stats, setStats] = useState(null);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, tripsRes] = await Promise.all([
        api.getDashboardStats(),
        api.getUpcomingTrips(),
      ]);
      setStats(statsRes.data);
      setUpcomingTrips(tripsRes.data.trips);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="dashboard">
      <h2>Welcome back, {stats?.user?.username}!</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats?.statistics?.total_plans || 0}</h3>
          <p>Total Plans</p>
        </div>
        <div className="stat-card">
          <h3>{stats?.statistics?.upcoming_trips || 0}</h3>
          <p>Upcoming Trips</p>
        </div>
        <div className="stat-card">
          <h3>{stats?.statistics?.past_trips || 0}</h3>
          <p>Past Trips</p>
        </div>
        <div className="stat-card">
          <h3>${stats?.statistics?.total_budget_planned?.toFixed(2) || '0.00'}</h3>
          <p>Total Budget</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button onClick={() => onNavigate('planning')} className="btn-primary">
            Plan New Trip
          </button>
          <button onClick={() => onNavigate('budget')} className="btn-secondary">
            View Budget
          </button>
          <button onClick={() => onNavigate('preferences')} className="btn-secondary">
            Update Preferences
          </button>
        </div>
      </div>

      {upcomingTrips.length > 0 && (
        <div className="dashboard-section">
          <h3>Upcoming Trips</h3>
          <div className="trips-list">
            {upcomingTrips.slice(0, 3).map((trip) => (
              <div key={trip.id} className="trip-card">
                <h4>{trip.destination_name || 'Destination'}</h4>
                <p>Travel Date: {trip.travel_date}</p>
                <p>Return Date: {trip.return_date}</p>
                <p>Travelers: {trip.num_travelers}</p>
                <p>Budget: ${trip.budget}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats?.preferences?.has_preferences === false && (
        <div className="alert-box">
          <p>⚠️ You haven't set your travel preferences yet!</p>
          <button onClick={() => onNavigate('preferences')} className="btn-primary">
            Set Preferences Now
          </button>
        </div>
      )}
    </div>
  );
};

// Budget Tracker Component - Shows budget summary and breakdowns
const BudgetTracker = () => {
  const [budgetSummary, setBudgetSummary] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [breakdown, setBreakdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBudgetSummary();
  }, []);

  const fetchBudgetSummary = async () => {
    try {
      const res = await api.getBudgetSummary();
      setBudgetSummary(res.data);
    } catch (err) {
      setError('Failed to load budget data');
    } finally {
      setLoading(false);
    }
  };

  const fetchBreakdown = async (planId) => {
    try {
      const res = await api.getBudgetBreakdown(planId);
      setBreakdown(res.data);
      setSelectedPlan(planId);
    } catch (err) {
      setError('Failed to load budget breakdown');
    }
  };

  if (loading) return <div className="loading">Loading budget...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="budget-tracker">
      <h2>Budget Tracker</h2>

      <div className="budget-summary">
        <h3>Overall Summary</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>${budgetSummary?.total_budget?.toFixed(2) || '0.00'}</h3>
            <p>Total Budget</p>
          </div>
          <div className="stat-card">
            <h3>${budgetSummary?.total_estimated_spent?.toFixed(2) || '0.00'}</h3>
            <p>Estimated Spent</p>
          </div>
          <div className="stat-card">
            <h3>${budgetSummary?.total_remaining?.toFixed(2) || '0.00'}</h3>
            <p>Remaining</p>
          </div>
        </div>
      </div>

      <div className="plans-budget">
        <h3>Budget by Travel Plan</h3>
        {budgetSummary?.plans?.length === 0 ? (
          <p>No travel plans yet</p>
        ) : (
          <div className="plans-list">
            {budgetSummary?.plans?.map((plan) => (
              <div key={plan.plan_id} className="plan-budget-card">
                <h4>{plan.destination}</h4>
                <div className="budget-details">
                  <p><strong>Budget:</strong> ${plan.budget.toFixed(2)}</p>
                  <p><strong>Estimated:</strong> ${plan.estimated_spent.toFixed(2)}</p>
                  <p><strong>Remaining:</strong> ${plan.remaining.toFixed(2)}</p>
                </div>
                <button 
                  onClick={() => fetchBreakdown(plan.plan_id)} 
                  className="btn-secondary"
                >
                  View Breakdown
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {breakdown && (
        <div className="budget-breakdown">
          <h3>Detailed Breakdown - {breakdown.destination}</h3>
          <div className="breakdown-details">
            <div className="breakdown-section">
              <h4>Hotel Costs</h4>
              <p>Hotel: {breakdown.costs.hotel.name}</p>
              <p>Price per Night: ${breakdown.costs.hotel.price_per_night}</p>
              <p>Nights: {breakdown.costs.hotel.nights}</p>
              <p>Travelers: {breakdown.costs.hotel.travelers}</p>
              <p><strong>Total: ${breakdown.costs.hotel.total.toFixed(2)}</strong></p>
            </div>
            <div className="breakdown-section">
              <h4>Transport Costs</h4>
              <p>Transport: {breakdown.costs.transport.name}</p>
              <p>Price per Person: ${breakdown.costs.transport.price_per_person}</p>
              <p>Travelers: {breakdown.costs.transport.travelers}</p>
              <p><strong>Total: ${breakdown.costs.transport.total.toFixed(2)}</strong></p>
            </div>
            <div className="breakdown-section">
              <h4>Summary</h4>
              <p>Total Budget: ${breakdown.total_budget.toFixed(2)}</p>
              <p>Total Spent: ${breakdown.total_estimated_spent.toFixed(2)}</p>
              <p><strong>Remaining: ${breakdown.remaining_budget.toFixed(2)}</strong></p>
            </div>
          </div>
          <button onClick={() => setBreakdown(null)} className="btn-secondary">
            Close Breakdown
          </button>
        </div>
      )}
    </div>
  );
};

// User Profile Component - Manage profile and account settings
const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.getUserProfile();
      setProfile(res.data);
      setFormData({
        first_name: res.data.first_name || '',
        last_name: res.data.last_name || '',
        email: res.data.email || '',
      });
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.updateUserProfile(formData);
      setSuccess('Profile updated successfully');
      setEditMode(false);
      fetchProfile();
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      const res = await api.changePassword(passwordData.oldPassword, passwordData.newPassword);
      localStorage.setItem('token', res.data.token);
      setSuccess('Password changed successfully');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to change password');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await api.deleteUserAccount();
        localStorage.clear();
        window.location.reload();
      } catch (err) {
        setError('Failed to delete account');
      }
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;

  return (
    <div className="user-profile">
      <h2>My Profile</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="profile-section">
        <h3>Profile Information</h3>
        {!editMode ? (
          <div className="profile-details">
            <p><strong>Username:</strong> {profile?.username}</p>
            <p><strong>Email:</strong> {profile?.email}</p>
            <p><strong>First Name:</strong> {profile?.first_name || 'Not set'}</p>
            <p><strong>Last Name:</strong> {profile?.last_name || 'Not set'}</p>
            <button onClick={() => setEditMode(true)} className="btn-primary">
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdateProfile} className="profile-form">
            <input
              type="text"
              placeholder="First Name"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <div className="button-group">
              <button type="submit" className="btn-primary">Save Changes</button>
              <button type="button" onClick={() => setEditMode(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="profile-section">
        <h3>Change Password</h3>
        <form onSubmit={handleChangePassword} className="profile-form">
          <input
            type="password"
            placeholder="Current Password"
            value={passwordData.oldPassword}
            onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            required
          />
          <button type="submit" className="btn-primary">Change Password</button>
        </form>
      </div>

      <div className="profile-section danger-zone">
        <h3>Danger Zone</h3>
        <p>Once you delete your account, there is no going back. Please be certain.</p>
        <button onClick={handleDeleteAccount} className="btn-danger">
          Delete Account
        </button>
      </div>
    </div>
  );
};

// ==================== MAIN APP COMPONENT ====================

function App() {
  const { isAuthenticated, login, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('landing');
  const [showRegister, setShowRegister] = useState(false);
  const [preferences, setPreferences] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      setCurrentPage('dashboard');
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    setCurrentPage('preferences');
  };

  const handleRegisterSuccess = () => {
    setShowRegister(false);
  };

  const handleLogout = () => {
    logout();
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
            <button
              className="btn-primary large"
              onClick={() => {
                setShowRegister(false);
                setCurrentPage('auth');
              }}
            >
              Login
            </button>
            <button
              className="btn-secondary large"
              onClick={() => {
                setShowRegister(true);
                setCurrentPage('auth');
              }}
            >
              Register
            </button>
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
  if (!isAuthenticated && currentPage !== 'landing') {
    return showRegister ? (
      <RegisterPage onSuccess={handleRegisterSuccess} onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <LoginPage onSuccess={handleLoginSuccess} onSwitchToRegister={() => setShowRegister(true)} />
    );
  }

  // Authenticated user pages
  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>✈️ Travel Planner</h1>
        </div>
        <nav className="sidebar-nav">
          <button onClick={() => setCurrentPage('dashboard')} className={currentPage === 'dashboard' ? 'active' : ''}>
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </button>
          <button onClick={() => setCurrentPage('preferences')} className={currentPage === 'preferences' ? 'active' : ''}>
            <span className="nav-icon">⚙️</span>
            <span className="nav-text">My Preferences</span>
          </button>
          <button onClick={() => setCurrentPage('planning')} className={currentPage === 'planning' ? 'active' : ''}>
            <span className="nav-icon">✈️</span>
            <span className="nav-text">Plan Trip</span>
          </button>
          <button onClick={() => setCurrentPage('budget')} className={currentPage === 'budget' ? 'active' : ''}>
            <span className="nav-icon">💰</span>
            <span className="nav-text">Budget</span>
          </button>
          <button onClick={() => setCurrentPage('profile')} className={currentPage === 'profile' ? 'active' : ''}>
            <span className="nav-icon">👤</span>
            <span className="nav-text">Profile</span>
          </button>
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="btn-logout">
            <span className="nav-icon">🚪</span>
            <span className="nav-text">Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        {currentPage === 'dashboard' && <Dashboard onNavigate={setCurrentPage} />}

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

        {currentPage === 'budget' && <BudgetTracker />}

        {currentPage === 'profile' && <UserProfile />}
      </main>
    </div>
  );
}

export default App;

