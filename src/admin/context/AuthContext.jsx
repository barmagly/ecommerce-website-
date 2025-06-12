import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login as loginAction, logout as logoutAction, clearError } from '../store/slices/authSlice';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check if there's a token in localStorage on mount
    const storedToken = localStorage.getItem('adminToken');
    if (storedToken && !isAuthenticated) {
      // You might want to validate the token here
      // For now, we'll just set it in the state
      dispatch(loginAction({ token: storedToken })).unwrap()
        .catch((error) => {
          console.error('Token validation error:', error);
          localStorage.removeItem('adminToken');
        });
    }
  }, [dispatch, isAuthenticated]);

  const login = async (credentials) => {
    try {
      // Clear any previous errors
      dispatch(clearError());
      
      const result = await dispatch(loginAction(credentials)).unwrap();
      return result;
    } catch (error) {
      // Ensure the error is properly propagated
      throw new Error(error.message || 'Login failed');
    }
  };

  const logout = async () => {
    try {
      await dispatch(logoutAction()).unwrap();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if the API call fails, we should still log out locally
      localStorage.removeItem('adminToken');
      navigate('/admin/login');
    }
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 