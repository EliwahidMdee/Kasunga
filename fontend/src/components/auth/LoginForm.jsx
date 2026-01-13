import React, { useState } from 'react';
import { loginUser } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { setUser, setToken } from '../../utilis/storage';

const LoginForm = ({ onSuccess, onSwitchToRegister }) => {
  const { login } = useAuth();
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
      const res = await loginUser(credentials.username, credentials.password);
      const { token, user_id, username } = res.data;
      setToken(token);
      setUser(username, user_id);
      login(token, username, user_id);
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
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
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={credentials.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p>
          Don't have an account?{' '}
          <button onClick={onSwitchToRegister} className="link-btn">
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
