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
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('userData');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, name) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const userData = {
      id: Date.now().toString(),
      name: name || email.split('@')[0],
      email,
      profilePic: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=150",
      subscription: 'free',
      usage: {
        documentsUploaded: 0,
        readingTime: 0,
        completedBooks: 0
      },
      settings: {
        notifications: true,
        darkMode: false,
        language: 'en'
      },
      joinDate: new Date().toISOString()
    };
    
    setUser(userData);
    localStorage.setItem('userData', JSON.stringify(userData));
    setLoading(false);
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
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    deleteAccount,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};