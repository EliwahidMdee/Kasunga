import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, setToken, clearAll, setUser, getUser } from '../utilis/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(getToken());
  const [user, setUserState] = useState(getUser());

  useEffect(() => {
    if (token) {
      setToken(token);
    }
  }, [token]);

  const login = (tokenValue, username, userId) => {
    setTokenState(tokenValue);
    setToken(tokenValue);
    setUser(username, userId);
    setUserState({ username, userId });
  };

  const logout = () => {
    clearAll();
    setTokenState(null);
    setUserState({ username: null, userId: null });
  };

  const value = {
    token,
    user,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
