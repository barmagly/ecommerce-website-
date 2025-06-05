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
    try {
      // Try both token keys
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const adminInfo = localStorage.getItem('adminInfo');
      
      if (token && adminInfo) {
        const parsedInfo = JSON.parse(adminInfo);
        setAdmin({ 
          user: parsedInfo, 
          token,
          hasToken: true,
          hasUser: true
        });
      } else {
        setAdmin(null);
        // Clear any stale data
        localStorage.removeItem('adminToken');
        localStorage.removeItem('token');
        localStorage.removeItem('adminInfo');
      }
    } catch (error) {
      console.error('AuthContext: Error checking auth:', error);
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      console.log('AuthContext: Starting login process...');
      const response = await authService.login(credentials);
      console.log('AuthContext: Login response received:', response);
      
      const { 
        token, 
        admin: adminInfo, 
        hasToken, 
        hasUser,
        user,
        adminData 
      } = response.data;
      
      if (!token) {
        throw new Error('No token received from server');
      }
      
      console.log('AuthContext: Extracted data:', { 
        hasToken, 
        hasUser, 
        user: user ? 'present' : 'missing',
        adminData: adminData ? 'present' : 'missing'
      });
      
      // Store token in both keys for compatibility
      localStorage.setItem('adminToken', token);
      localStorage.setItem('token', token);
      
      // Store admin info
      const adminInfoToStore = adminInfo || user || adminData;
      localStorage.setItem('adminInfo', JSON.stringify(adminInfoToStore));
      
      // Update state with all available data
      setAdmin({ 
        user: adminInfoToStore,
        token,
        hasToken: hasToken ?? true,
        hasUser: hasUser ?? true,
        rawUser: user,
        rawAdminData: adminData
      });
      
      console.log('AuthContext: Admin state updated:', { 
        user: adminInfoToStore ? 'present' : 'missing',
        token: token ? 'present' : 'missing',
        hasToken: hasToken ?? true,
        hasUser: hasUser ?? true
      });
      
      toast.success('تم تسجيل الدخول بنجاح');
      console.log('AuthContext: Login completed successfully');
      return true;
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      
      // Clear any stale data
      localStorage.removeItem('adminToken');
      localStorage.removeItem('token');
      localStorage.removeItem('adminInfo');
      setAdmin(null);
      
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
    // Clear all auth data
    localStorage.removeItem('adminToken');
    localStorage.removeItem('token');
    localStorage.removeItem('adminInfo');
    setAdmin(null);
    toast.success('تم تسجيل الخروج بنجاح');
  };

  const value = {
    admin,
    loading,
    login,
    logout,
    isAuthenticated: !!admin?.token && !!admin?.user,
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