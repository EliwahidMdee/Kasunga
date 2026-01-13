// API Service for communicating with Django backend
// Handles all HTTP requests to the backend

import axios from 'axios';

// API base URL
const API_URL = 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// ==================== USER ENDPOINTS ====================

export const registerUser = (userData) => api.post('/users/', userData);

export const loginUser = (username, password) => api.post('/auth/login/', { username, password });

export const logoutUser = () => api.post('/auth/logout/');

export const changePassword = (oldPassword, newPassword) =>
  api.post('/auth/change-password/', {
    old_password: oldPassword,
    new_password: newPassword,
  });

export const getUserProfile = () => api.get('/users/profile/');

export const updateUserProfile = (data) => api.patch('/users/update_profile/', data);

export const deleteUserAccount = () => api.delete('/users/delete_account/');

export const getUserPreferences = () => api.get('/preferences/my_preferences/');

export const updateUserPreferences = (id, data) => api.patch(`/preferences/${id}/`, data);

export const createUserPreferences = (data) => api.post('/preferences/', data);

// ==================== DESTINATION ENDPOINTS ====================

export const getDestinations = () => api.get('/destinations/');

export const getRecommendedDestinations = (options = {}) => {
  const params = {};
  if (options.budget) params.budget = options.budget;
  if (options.interest) params.interest = options.interest;
  if (options.country) params.country = options.country;
  if (options.budgetMin) params.budget_min = options.budgetMin;
  if (options.budgetMax) params.budget_max = options.budgetMax;
  if (options.objective) params.objective = options.objective;
  if (options.location) params.location = options.location;
  return api.get('/destinations/recommended/', { params });
};

export const getDestinationDetail = (id) => api.get(`/destinations/${id}/`);

export const getDestinationImages = (destinationId) =>
  api.get('/destination-images/', { params: { destination_id: destinationId } });

// ==================== HOTEL ENDPOINTS ====================

export const getRecommendedHotels = (destinationId, budget) =>
  api.get('/hotels/recommended/', {
    params: {
      destination_id: destinationId,
      budget,
    },
  });

export const getHotels = () => api.get('/hotels/');

export const getHotelDetail = (id) => api.get(`/hotels/${id}/`);

// ==================== TRANSPORT ENDPOINTS ====================

export const getRecommendedTransport = (distanceKm, budget) =>
  api.get('/transports/recommended/', {
    params: { distance_km: distanceKm, budget },
  });

export const getTransports = () => api.get('/transports/');

// ==================== TRAVEL PLAN ENDPOINTS ====================

export const getTravelPlans = () => api.get('/travel-plans/');

export const getTravelPlanDetail = (id) => api.get(`/travel-plans/${id}/`);

export const createTravelPlan = (data) => api.post('/travel-plans/', data);

export const createTravelPlanWithRecommendations = (data) =>
  api.post('/travel-plans/create_plan_with_recommendations/', data);

export const updateTravelPlan = (id, data) => api.patch(`/travel-plans/${id}/`, data);

export const deleteTravelPlan = (id) => api.delete(`/travel-plans/${id}/`);

export const generateItinerary = (travelPlanId) =>
  api.post(`/travel-plans/${travelPlanId}/generate_itinerary/`);

// ==================== ITINERARY ENDPOINTS ====================

export const getItineraries = () => api.get('/itineraries/');

export const getItineraryDetail = (id) => api.get(`/itineraries/${id}/`);

// ==================== BUDGET TRACKING ENDPOINTS ====================

export const getBudgetSummary = () => api.get('/budget/summary/');

export const getBudgetBreakdown = (planId) => api.get(`/budget/breakdown/${planId}/`);

// ==================== DASHBOARD ENDPOINTS ====================

export const getDashboardStats = () => api.get('/dashboard/stats/');

export const getUpcomingTrips = () => api.get('/dashboard/upcoming-trips/');

export const getPastTrips = () => api.get('/dashboard/past-trips/');

// ==================== ADMIN ENDPOINTS ====================

export const getAdminDashboard = () => api.get('/admin/dashboard/');

export const getAdminUsers = () => api.get('/admin/users/');

export const getAdminUserDetails = (userId) => api.get(`/admin/users/${userId}/`);

export const toggleUserStatus = (userId) => api.post(`/admin/users/${userId}/toggle-status/`);

export const getAdminTravelPlans = () => api.get('/admin/travel-plans/');

export const getPreferencesTracking = () => api.get('/admin/preferences-tracking/');

// ==================== ADMIN CONTENT MANAGEMENT ====================

export const getAdminDestinations = () => api.get('/admin/destinations/');

export const createAdminDestination = (data) => api.post('/admin/destinations/', data);

export const getAdminDestinationDetail = (destinationId) => api.get(`/admin/destinations/${destinationId}/`);

export const updateAdminDestination = (destinationId, data) =>
  api.patch(`/admin/destinations/${destinationId}/`, data);

export const deleteAdminDestination = (destinationId) => api.delete(`/admin/destinations/${destinationId}/`);

export const getAdminHotels = () => api.get('/admin/hotels/');

export const createAdminHotel = (data) => api.post('/admin/hotels/', data);

export const getAdminHotelDetail = (hotelId) => api.get(`/admin/hotels/${hotelId}/`);

export const updateAdminHotel = (hotelId, data) => api.patch(`/admin/hotels/${hotelId}/`, data);

export const deleteAdminHotel = (hotelId) => api.delete(`/admin/hotels/${hotelId}/`);

export const getAdminTransport = () => api.get('/admin/transport/');

export const createAdminTransport = (data) => api.post('/admin/transport/', data);

export const getAdminTransportDetail = (transportId) => api.get(`/admin/transport/${transportId}/`);

export const updateAdminTransport = (transportId, data) => api.patch(`/admin/transport/${transportId}/`, data);

export const deleteAdminTransport = (transportId) => api.delete(`/admin/transport/${transportId}/`);

export default api;
