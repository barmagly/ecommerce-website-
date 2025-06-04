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
      // Check if it's a development token
      if (token.startsWith('dev-token-')) {
        // Development mode - bypass backend verification
        setAdmin({ 
          id: 1,
          name: 'مطور النظام', 
          email: 'dev@admin.com',
          role: 'admin' 
        });
      } else {
        // Production mode - you can implement profile fetching here later
        setAdmin({ name: 'مدير', role: 'admin' });
      }
    }
    setLoading(false);
  };

  const login = async (credentials) => {
    try {
      console.log('AuthContext: Starting login process...');
      const response = await authService.login(credentials);
      console.log('AuthContext: Login response received:', response);
      
      const { token, admin: adminData } = response.data;
      console.log('AuthContext: Extracted data:', { hasToken: !!token, adminData });
      
      if (token) {
        localStorage.setItem('adminToken', token);
        console.log('AuthContext: Token saved to localStorage');
      }
      
      if (adminData) {
        setAdmin(adminData);
        console.log('AuthContext: Admin state updated:', adminData);
      }
      
      toast.success('تم تسجيل الدخول بنجاح');
      console.log('AuthContext: Login completed successfully');
      return true;
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      
      // Handle different types of errors
      if (error.code === 'ERR_NETWORK') {
        toast.error('خطأ في الشبكة - تحقق من الاتصال بالإنترنت');
        throw new Error('خطأ في الشبكة');
      } else if (error.response?.status === 404) {
        toast.error('نقطة النهاية غير موجودة - تحقق من عنوان الخادم');
        throw new Error('نقطة النهاية غير موجودة');
      } else if (error.response?.status === 401) {
        toast.error('بيانات الدخول غير صحيحة');
        throw new Error('بيانات الدخول غير صحيحة');
      } else if (error.response?.status === 400) {
        const message = error.response?.data?.message || 'بيانات غير صحيحة';
        toast.error(message);
        throw new Error(message);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        toast.error('فشل تسجيل الدخول - تحقق من بيانات الدخول');
        throw new Error('فشل تسجيل الدخول');
      }
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