import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const userWithDefaults = {
      ...userData,
      subscription: userData.subscription || 'basic',
      documentsUploaded: userData.documentsUploaded || 0,
      readingStreak: userData.readingStreak || 0,
      totalReadingTime: userData.totalReadingTime || 0,
      preferences: userData.preferences || {
        theme: 'light',
        notifications: true,
        autoPlay: false,
        fontSize: 'medium'
      }
    };
    setUser(userWithDefaults);
    localStorage.setItem('userData', JSON.stringify(userWithDefaults));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userData');
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('userData', JSON.stringify(updatedUser));
  };

  const deleteAccount = () => {
    setUser(null);
    localStorage.removeItem('userData');
    // In a real app, this would make an API call to delete the account
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    deleteAccount,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};