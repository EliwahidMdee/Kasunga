// Simple localStorage helpers
export const setToken = (token) => localStorage.setItem('token', token);
export const getToken = () => localStorage.getItem('token');
export const clearToken = () => localStorage.removeItem('token');

export const setUser = (username, userId) => {
  if (username) localStorage.setItem('username', username);
  if (userId) localStorage.setItem('userId', userId);
};

export const getUser = () => ({
  username: localStorage.getItem('username'),
  userId: localStorage.getItem('userId'),
});

export const clearUser = () => {
  localStorage.removeItem('username');
  localStorage.removeItem('userId');
};

export const clearAll = () => {
  clearToken();
  clearUser();
};
