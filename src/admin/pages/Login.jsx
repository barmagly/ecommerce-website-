import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Tab,
  Tabs,
  Grid
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Login form data
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  // Register form data
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    phone: '',
  });

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
    setSuccess('');
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Attempting login with:', loginData);
      const success = await login(loginData);
      console.log('Login result:', success);
      
      if (success) {
        setSuccess('تم تسجيل الدخول بنجاح! جاري التوجيه...');
        
        // Small delay to ensure state is updated
        setTimeout(() => {
          console.log('Navigating to dashboard...');
          navigate('/admin/dashboard', { replace: true });
        }, 500);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('فشل تسجيل الدخول. تحقق من بيانات الدخول.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords match
    if (registerData.password !== registerData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      setLoading(false);
      return;
    }

    // Validate password length
    if (registerData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      setLoading(false);
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://ecommerce-website-backend-nine.vercel.app/api';
      
      // Based on the Redux auth slice, the backend expects: name, address, phone, email, password
      const registrationPayload = {
        name: registerData.name,
        address: registerData.address,
        phone: registerData.phone,
        email: registerData.email,
        password: registerData.password
      };

      console.log('Registration attempt with correct format:', registrationPayload);

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationPayload),
      });

      console.log('Registration response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Registration success:', data);
        setSuccess('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.');
        
        // Clear register form
        setRegisterData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          address: '',
          phone: '',
        });
        
        // Switch to login tab after 2 seconds
        setTimeout(() => {
          setTabValue(0);
          setSuccess('');
        }, 2000);
      } else {
        const errorData = await response.json();
        console.log('Registration error:', errorData);
        
        if (errorData.message) {
          if (errorData.message.includes('already exists') || errorData.message.includes('duplicate')) {
            setError('البريد الإلكتروني مستخدم بالفعل');
          } else if (errorData.message.includes('required')) {
            setError('جميع الحقول مطلوبة - تأكد من ملء جميع البيانات');
          } else {
            setError(`خطأ في التسجيل: ${errorData.message}`);
          }
        } else {
          setError('فشل في إنشاء الحساب - تحقق من البيانات المدخلة');
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('خطأ في الشبكة. تحقق من الاتصال بالإنترنت.');
    } finally {
      setLoading(false);
    }
  };

  // Quick admin creation function
  const createQuickAdmin = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://ecommerce-website-backend-nine.vercel.app/api';
      
      // Use the correct format based on Redux auth slice discovery: name, address, phone, email, password
      const adminData = {
        name: 'مدير النظام',
        address: 'عنوان المدير',
        phone: '1234567890',
        email: 'admin@admin.com',
        password: 'admin123'
      };

      console.log('Creating admin with correct format:', adminData);

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminData),
      });

      console.log('Admin creation response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Admin creation success:', data);
        setSuccess('تم إنشاء حساب المدير بنجاح!\nالبريد: admin@admin.com\nكلمة المرور: admin123');
        
        // Auto-fill login form
        setLoginData({
          username: 'admin@admin.com',
          password: 'admin123'
        });
        
        setTabValue(0); // Switch to login tab
      } else {
        const errorData = await response.json();
        console.log('Admin creation error:', errorData);
        
        if (errorData.message && (errorData.message.includes('already exists') || errorData.message.includes('duplicate'))) {
          setSuccess('حساب المدير موجود بالفعل!\nالبريد: admin@admin.com\nكلمة المرور: admin123');
          
          // Auto-fill login form
          setLoginData({
            username: 'admin@admin.com',
            password: 'admin123'
          });
          
          setTabValue(0); // Switch to login tab
        } else {
          setError('فشل في إنشاء حساب المدير: ' + (errorData.message || 'خطأ غير معروف'));
        }
      }
    } catch (err) {
      console.error('Quick admin creation error:', err);
      setError('خطأ في الشبكة أثناء إنشاء حساب المدير');
    } finally {
      setLoading(false);
    }
  };

  // Development bypass function
  const bypassAuth = () => {
    setLoading(true);
    try {
      const devToken = 'dev-token-' + Date.now();
      localStorage.setItem('adminToken', devToken);
      
      // Manually trigger auth context update
      const devAdmin = {
        id: 1,
        name: 'مطور النظام',
        email: 'dev@admin.com',
        role: 'admin'
      };
      
      // Force update the auth context by calling checkAuth
      setSuccess('تم تجاوز المصادقة للتطوير! جاري التوجيه...');
      
      setTimeout(() => {
        // Force page reload to trigger auth context update
        window.location.href = '/admin/dashboard';
      }, 1000);
    } catch (err) {
      setError('فشل في تجاوز المصادقة');
    } finally {
      setLoading(false);
    }
  };

  // Test backend API endpoints (only valid endpoints)
  const testBackendEndpoints = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    const API_URL = import.meta.env.VITE_API_URL || 'https://ecommerce-website-backend-nine.vercel.app/api';
    const token = localStorage.getItem('adminToken');
    console.log('Testing backend endpoints...');
    const endpoints = [
      { path: '/auth', protected: true },
      { path: '/products', protected: false },
      { path: '/categories', protected: false },
      { path: '/cart', protected: true },
      { path: '/orders', protected: true },
      { path: '/reviews', protected: false },
      { path: '/coupons', protected: true },
      { path: '/dashboard', protected: false }
    ];

    const results = [];

    for (const endpoint of endpoints) {
      try {
        const headers = { 'Content-Type': 'application/json' };
        if (endpoint.protected && token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        const getResponse = await fetch(`${API_URL}${endpoint.path}`, {
          method: 'GET',
          headers,
        });
        const getResult = await getResponse.text();
        let statusMsg = `GET ${endpoint.path}: ${getResponse.status} - ${getResult.substring(0, 100)}`;
        if (getResponse.status === 401 && endpoint.protected) {
          statusMsg += ' (🔒 Requires login)';
        }
        results.push(statusMsg);
      } catch (error) {
        results.push(`❌ ${endpoint.path}: ${error.message}`);
      }
    }

    // Display results
    const resultMessage = results.length > 0 
      ? `نتائج اختبار الـ API:\n${results.join('\n')}`
      : 'لم يتم العثور على أي endpoints متاحة';
    setSuccess(resultMessage);
    setLoading(false);
  };

  // Analyze backend schema to discover required fields (only /auth/register with correct payloads)
  const analyzeBackendSchema = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    const API_URL = import.meta.env.VITE_API_URL || 'https://ecommerce-website-backend-nine.vercel.app/api';
    const endpoint = '/auth/register';
    console.log('Analyzing backend schema...');
    // Test with missing fields one by one
    const testPayloads = [
      {},
      { email: 'test@test.com', password: 'test123', phone: '1234567890', address: 'Test Address' }, // missing name
      { name: 'Test User', password: 'test123', phone: '1234567890', address: 'Test Address' }, // missing email
      { name: 'Test User', email: 'test@test.com', phone: '1234567890', address: 'Test Address' }, // missing password
      { name: 'Test User', email: 'test@test.com', password: 'test123', address: 'Test Address' }, // missing phone
      { name: 'Test User', email: 'test@test.com', password: 'test123', phone: '1234567890' }, // missing address
      // All fields present
      { name: 'Test User', email: 'test@test.com', password: 'test123', phone: '1234567890', address: 'Test Address' },
    ];
    const results = [];
    for (let i = 0; i < testPayloads.length; i++) {
      const payload = testPayloads[i];
      console.log(`Schema test ${i + 1}:`, payload);
      try {
        const response = await fetch(`${API_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        console.log(`Schema test ${i + 1} - Status:`, response.status);
        const respText = await response.text();
        results.push(`Test ${i + 1} (${JSON.stringify(payload)}): ${response.status} - ${respText}`);
      } catch (error) {
        console.log(`Schema test ${i + 1} - Error:`, error.message);
        results.push(`Test ${i + 1}: ${error.message}`);
      }
    }
    // Display analysis results
    const analysisResult = results.length > 0 
      ? `تحليل متطلبات الخادم:\n${results.join('\n')}`
      : 'لم يتم العثور على معلومات حول المتطلبات';
    setSuccess(analysisResult);
    setLoading(false);
  };

  // Comprehensive backend field discovery (only /auth/register with all required fields)
  const discoverBackendFields = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    const API_URL = import.meta.env.VITE_API_URL || 'https://ecommerce-website-backend-nine.vercel.app/api';
    const endpoint = '/auth/register';
    console.log('🔍 Discovering backend field requirements...');
    // Use a unique email for each test
    const uniqueEmail = `test+${Date.now()}@test.com`;
    const payload = {
      name: 'Test User',
      email: uniqueEmail,
      password: 'test123',
      phone: '1234567890',
      address: 'Test Address',
    };
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const respText = await response.text();
      if (response.status === 500) {
        setError(`❌ الخادم أعاد خطأ 500 (Internal Server Error). تحقق من سجل الخادم لمعرفة التفاصيل.\n${respText}`);
      } else {
        setSuccess(`نتيجة اختبار الحقول المطلوبة:\n${response.status} - ${respText}`);
      }
    } catch (error) {
      setError(`❌ اكتشاف الحقول المطلوبة فشل: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Test /auth/login with correct payload
  const testAuthLogin = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    const API_URL = import.meta.env.VITE_API_URL || 'https://ecommerce-website-backend-nine.vercel.app/api';
    const endpoint = '/auth/login';
    const payload = {
      email: 'admin@admin.com',
      password: 'admin123',
    };
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const respText = await response.text();
      setSuccess(`نتيجة اختبار تسجيل الدخول:\n${response.status} - ${respText}`);
    } catch (error) {
      setError(`❌ اختبار تسجيل الدخول فشل: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom sx={{ mb: 3 }}>
            لوحة التحكم الإدارية
          </Typography>

          {/* Tabs for Login/Register */}
          <Box sx={{ width: '100%', mb: 2 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              centered
              sx={{
                '& .MuiTab-root': {
                  fontSize: '1.1rem',
                  fontWeight: 'bold'
                }
              }}
            >
              <Tab label="تسجيل الدخول" />
              <Tab label="إنشاء حساب" />
            </Tabs>
          </Box>

          {/* Error/Success Messages */}
          {error && (
            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2, width: '100%', whiteSpace: 'pre-line' }}>
              {success}
            </Alert>
          )}

          {/* Login Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box component="form" onSubmit={handleLoginSubmit} sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="البريد الإلكتروني أو اسم المستخدم"
                name="username"
                autoComplete="username"
                autoFocus
                value={loginData.username}
                onChange={handleLoginChange}
                disabled={loading}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="كلمة المرور"
                type="password"
                id="password"
                autoComplete="current-password"
                value={loginData.password}
                onChange={handleLoginChange}
                disabled={loading}
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mb: 2, py: 1.5 }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'تسجيل الدخول'
                )}
              </Button>
            </Box>
          </TabPanel>

          {/* Register Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box component="form" onSubmit={handleRegisterSubmit} sx={{ width: '100%' }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="name"
                    label="الاسم الكامل"
                    name="name"
                    autoComplete="name"
                    value={registerData.name}
                    onChange={handleRegisterChange}
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="البريد الإلكتروني"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="كلمة المرور"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    disabled={loading}
                    helperText="6 أحرف على الأقل"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="confirmPassword"
                    label="تأكيد كلمة المرور"
                    type="password"
                    id="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="address"
                    label="العنوان"
                    name="address"
                    autoComplete="address"
                    value={registerData.address}
                    onChange={handleRegisterChange}
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="phone"
                    label="رقم الهاتف"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={registerData.phone}
                    onChange={handleRegisterChange}
                    disabled={loading}
                  />
                </Grid>
              </Grid>
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'إنشاء حساب'
                )}
              </Button>
            </Box>
          </TabPanel>

          {/* Quick Actions */}
          <Divider sx={{ width: '100%', my: 3 }}>أو</Divider>

          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              fullWidth
              variant="contained"
              color="success"
              onClick={createQuickAdmin}
              disabled={loading}
              sx={{ py: 1.2 }}
            >
              إنشاء حساب مدير سريع
            </Button>

            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={testBackendEndpoints}
              disabled={loading}
              sx={{ py: 1.2 }}
            >
              اختبار endpoints الخلفية
            </Button>

            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={analyzeBackendSchema}
              disabled={loading}
              sx={{ py: 1.2 }}
            >
              تحليل متطلبات الخادم
            </Button>

            <Button
              fullWidth
              variant="outlined"
              color="error"
              onClick={discoverBackendFields}
              disabled={loading}
              sx={{ py: 1.2 }}
            >
              🔍 اكتشاف الحقول المطلوبة
            </Button>

            <Button
              fullWidth
              variant="outlined"
              color="warning"
              onClick={testAuthLogin}
              disabled={loading}
              sx={{ py: 1.2 }}
            >
              🔐 اختبار تسجيل الدخول
            </Button>

           
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login; 