import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const adminAuth = localStorage.getItem('adminAuth');
        if (adminAuth) {
          const userData = JSON.parse(adminAuth);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        localStorage.removeItem('adminAuth');
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = (userData) => {
    try {
      localStorage.setItem('adminAuth', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      setLoading(false);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('adminAuth');
      setUser(null);
      setIsAuthenticated(false);
      navigate('/admin/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 