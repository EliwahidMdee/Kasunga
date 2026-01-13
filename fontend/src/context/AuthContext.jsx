import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, setToken, clearAll, setUser, getUser } from '../utilis/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(getToken());
  const [user, setUserState] = useState(getUser());
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('is_admin') === 'true');
  const [isSuperuser, setIsSuperuser] = useState(localStorage.getItem('is_superuser') === 'true');

  useEffect(() => {
    if (token) {
      setToken(token);
    }
  }, [token]);

  const login = (tokenValue, username, userId, isStaff = false, isSuperuserStatus = false) => {
    setTokenState(tokenValue);
    setToken(tokenValue);
    setUser(username, userId);
    setUserState({ username, userId });
    setIsAdmin(isStaff);
    setIsSuperuser(isSuperuserStatus);
    localStorage.setItem('is_admin', isStaff);
    localStorage.setItem('is_superuser', isSuperuserStatus);
  };

  const logout = () => {
    clearAll();
    setTokenState(null);
    setUserState({ username: null, userId: null });
    setIsAdmin(false);
    setIsSuperuser(false);
    localStorage.removeItem('is_admin');
    localStorage.removeItem('is_superuser');
  };

  const value = {
    token,
    user,
    login,
    logout,
    isAuthenticated: !!token,
    isAdmin,
    isSuperuser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
