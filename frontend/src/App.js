import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './App.css';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import DestinationDetails from './pages/DestinationDetails';
import ProfilePage from './pages/ProfilePage';
import BudgetPage from './pages/BudgetPage';
import AdminDestinationsPage from './pages/AdminDestinationsPage';
import AdminHotelsPage from './pages/AdminHotelsPage';
import AdminTransportPage from './pages/AdminTransportPage';

// Components
import UserPreferencesForm from './components/UserPreferencesForm';

const App = () => {
  const { isAuthenticated, logout, isAdmin } = useAuth();

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // Admin-only Route Component
  const AdminRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    if (!isAdmin) {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  };

  // Main Layout with Sidebar for authenticated users
  const Layout = ({ children }) => {
    const handleLogout = () => {
      logout();
    };

    return (
      <div className="app-container">
        <aside className="sidebar">
          <div className="sidebar-header">
            <h1>✈️ Traveline</h1>
          </div>
          <nav className="sidebar-nav">
            <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">🏠</span>
              <span className="nav-text">Dashboard</span>
            </NavLink>
            <NavLink to="/preferences" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">⚙️</span>
              <span className="nav-text">Preferences</span>
            </NavLink>
            <NavLink to="/budget" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">💰</span>
              <span className="nav-text">Budget</span>
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">👤</span>
              <span className="nav-text">Profile</span>
            </NavLink>

            {/* Admin Section */}
            {isAdmin && (
              <>
                <div className="sidebar-divider"></div>
                <div className="sidebar-section-title">Admin</div>
                <NavLink to="/admin/destinations" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <span className="nav-icon">📍</span>
                  <span className="nav-text">Destinations</span>
                </NavLink>
                <NavLink to="/admin/hotels" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <span className="nav-icon">🏨</span>
                  <span className="nav-text">Hotels</span>
                </NavLink>
                <NavLink to="/admin/transport" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <span className="nav-icon">🚗</span>
                  <span className="nav-text">Transport</span>
                </NavLink>
              </>
            )}
          </nav>
          <div className="sidebar-footer">
            <button onClick={handleLogout} className="btn-logout">
              <span className="nav-icon">🚪</span>
              <span className="nav-text">Logout</span>
            </button>
          </div>
        </aside>
        <main className="main-content">{children}</main>
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <RegisterPage />
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/destinations/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <DestinationDetails />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/preferences"
          element={
            <ProtectedRoute>
              <Layout>
                <UserPreferencesForm
                  onSave={() => {
                    // Optionally navigate back to dashboard after saving
                    // navigate('/dashboard');
                  }}
                />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/budget"
          element={
            <ProtectedRoute>
              <Layout>
                <BudgetPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <ProfilePage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/destinations"
          element={
            <AdminRoute>
              <Layout>
                <AdminDestinationsPage />
              </Layout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/hotels"
          element={
            <AdminRoute>
              <Layout>
                <AdminHotelsPage />
              </Layout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/transport"
          element={
            <AdminRoute>
              <Layout>
                <AdminTransportPage />
              </Layout>
            </AdminRoute>
          }
        />

        {/* Default Route */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
