// API Service for communicating with Django backend
// This file handles all HTTP requests to the backend

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

// Register new user
export const registerUser = (userData) => {
  return api.post('/users/', userData);
};

// Login user (basic auth)
export const loginUser = (username, password) => {
  return api.post('/auth-token/', { username, password });
};

// Get user preferences
export const getUserPreferences = () => {
  return api.get('/preferences/my_preferences/');
};

// Update user preferences
export const updateUserPreferences = (id, data) => {
  return api.patch(`/preferences/${id}/`, data);
};

// Create user preferences
export const createUserPreferences = (data) => {
  return api.post('/preferences/', data);
};

// ==================== DESTINATION ENDPOINTS ====================

// Get all destinations
export const getDestinations = () => {
  return api.get('/destinations/');
};

// Get recommended destinations
export const getRecommendedDestinations = (budget, interest, country = null) => {
  const params = {};
  if (budget) params.budget = budget;
  if (interest) params.interest = interest;
  if (country) params.country = country;
  
  return api.get('/destinations/recommended/', { params });
};

// Get destination details
export const getDestinationDetail = (id) => {
  return api.get(`/destinations/${id}/`);
};

// ==================== HOTEL ENDPOINTS ====================

// Get recommended hotels
export const getRecommendedHotels = (destinationId, budget) => {
  return api.get('/hotels/recommended/', {
    params: {
      destination_id: destinationId,
      budget: budget,
    },
  });
};

// Get all hotels
export const getHotels = () => {
  return api.get('/hotels/');
};

// Get hotel details
export const getHotelDetail = (id) => {
  return api.get(`/hotels/${id}/`);
};

// ==================== TRANSPORT ENDPOINTS ====================

// Get recommended transport
export const getRecommendedTransport = (distanceKm, budget) => {
  return api.get('/transports/recommended/', {
    params: {
      distance_km: distanceKm,
      budget: budget,
    },
  });
};

// Get all transports
export const getTransports = () => {
  return api.get('/transports/');
};

// ==================== TRAVEL PLAN ENDPOINTS ====================

// Get user's travel plans
export const getTravelPlans = () => {
  return api.get('/travel-plans/');
};

// Get single travel plan
export const getTravelPlanDetail = (id) => {
  return api.get(`/travel-plans/${id}/`);
};

// Create travel plan
export const createTravelPlan = (data) => {
  return api.post('/travel-plans/', data);
};

// Create travel plan with recommendations (complete flow)
export const createTravelPlanWithRecommendations = (data) => {
  return api.post('/travel-plans/create_plan_with_recommendations/', data);
};

// Update travel plan
export const updateTravelPlan = (id, data) => {
  return api.patch(`/travel-plans/${id}/`, data);
};

// Delete travel plan
export const deleteTravelPlan = (id) => {
  return api.delete(`/travel-plans/${id}/`);
};

// Generate itinerary for travel plan
export const generateItinerary = (travelPlanId) => {
  return api.post(`/travel-plans/${travelPlanId}/generate_itinerary/`);
};

// ==================== ITINERARY ENDPOINTS ====================

// Get itineraries
export const getItineraries = () => {
  return api.get('/itineraries/');
};

// Get itinerary details
export const getItineraryDetail = (id) => {
  return api.get(`/itineraries/${id}/`);
};

export default api;
