import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './App.css';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import DestinationDetails from './pages/DestinationDetails';
import ProfilePage from './pages/ProfilePage';
import BudgetPage from './pages/BudgetPage';

// Components
import UserPreferencesForm from './components/UserPreferencesForm';

const App = () => {
  const { isAuthenticated, logout } = useAuth();

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
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
            <Link to="/dashboard" className="nav-link">
              <span className="nav-icon">🏠</span>
              <span className="nav-text">Dashboard</span>
            </Link>
            <Link to="/preferences" className="nav-link">
              <span className="nav-icon">⚙️</span>
              <span className="nav-text">Preferences</span>
            </Link>
            <Link to="/budget" className="nav-link">
              <span className="nav-icon">💰</span>
              <span className="nav-text">Budget</span>
            </Link>
            <Link to="/profile" className="nav-link">
              <span className="nav-icon">👤</span>
              <span className="nav-text">Profile</span>
            </Link>
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
