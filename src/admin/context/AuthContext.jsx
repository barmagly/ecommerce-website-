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
      console.log('Attempting login with credentials:', credentials);
      console.log('API URL being used:', 'https://ecommerce-website-backend-nine.vercel.app/api/auth/login');
      
      // Test if the API endpoint is reachable
      console.log('Testing API endpoint accessibility...');
      
      // Simple connectivity test
      try {
        const testResponse = await fetch('https://ecommerce-website-backend-nine.vercel.app/api/auth/login', {
          method: 'HEAD',
          mode: 'cors'
        });
        console.log('API connectivity test result:', testResponse.status);
      } catch (testError) {
        console.error('API connectivity test failed:', testError);
      }
      
      const response = await authService.login(credentials);
      console.log('Login response:', response);
      
      const { token, admin: adminData } = response.data;
      localStorage.setItem('adminToken', token);  
      setAdmin(adminData);
      toast.success('تم تسجيل الدخول بنجاح');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      console.error('Error config:', error.config);
      
      if (error.code === 'ERR_NETWORK') {
        console.error('Network error - API might be down or CORS issue');
        toast.error('خطأ في الشبكة - مشكلة CORS أو الخادم غير متاح');
      } else if (error.response?.status === 404) {
        console.error('API endpoint not found');
        toast.error('نقطة النهاية غير موجودة');
      } else if (error.response?.status === 401) {
        console.error('Unauthorized - wrong credentials');
        toast.error('بيانات الدخول غير صحيحة');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('فشل تسجيل الدخول - تحقق من بيانات الدخول');
      }
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