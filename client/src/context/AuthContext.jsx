import React, { createContext, useState, useEffect } from 'react';
import { authApi } from '../api/models/auth.api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize and verify user on mount
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await authApi.getMe();
          if (res.success) {
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
          }
        } catch (error) {
          console.error('Session expired or invalid token:', error);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res.success && res.data) {
      const loggedUser = res.data.user;
      const userToken = res.data.token;
      setToken(userToken);
      setUser(loggedUser);
      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      return loggedUser;
    }
    throw new Error(res.message || 'Login failed');
  };

  const signup = async (name, email, password, phone, photo, referralCode) => {
    const res = await authApi.signup({ name, email, password, phone, photo, referralCode });
    if (res.success && res.data) {
      const createdUser = res.data.user;
      const userToken = res.data.token;
      setToken(userToken);
      setUser(createdUser);
      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(createdUser));
      return createdUser;
    }
    throw new Error(res.message || 'Signup failed');
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // ignore server logout errors
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const updateUserProfile = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        updateUserProfile,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === 'admin',
        isStudent: user?.role === 'student',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
