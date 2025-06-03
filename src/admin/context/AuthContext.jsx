import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      // You can set a dummy admin object or fetch profile if you implement it later
      setAdmin({ name: 'مدير', role: 'admin' });
    }
    setLoading(false);
  };

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const { token, admin: adminData } = response.data;
      localStorage.setItem('adminToken', token);
      setAdmin(adminData);
      toast.success('تم تسجيل الدخول بنجاح');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل تسجيل الدخول');
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setAdmin(null);
    toast.success('تم تسجيل الخروج بنجاح');
  };

  const value = {
    admin,
    loading,
    login,
    logout,
    isAuthenticated: !!admin,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 