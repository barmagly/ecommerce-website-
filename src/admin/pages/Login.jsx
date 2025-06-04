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
      const success = await login(loginData);
      if (success) {
        navigate('/admin/dashboard');
      }
    } catch (err) {
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
      
      // Prepare registration data
      const registrationPayload = {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        role: 'admin' // Set as admin for admin panel
      };

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationPayload),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.');
        
        // Clear register form
        setRegisterData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
        
        // Switch to login tab after 2 seconds
        setTimeout(() => {
          setTabValue(0);
          setSuccess('');
        }, 2000);
      } else {
        const errorData = await response.json();
        
        if (errorData.message) {
          if (errorData.message.includes('already exists') || errorData.message.includes('duplicate')) {
            setError('البريد الإلكتروني مستخدم بالفعل');
          } else if (errorData.message.includes('required')) {
            setError('جميع الحقول مطلوبة');
          } else {
            setError(errorData.message);
          }
        } else {
          setError('فشل في إنشاء الحساب');
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
      
      const adminData = {
        name: 'مدير النظام',
        email: 'admin@admin.com',
        password: 'admin123',
        role: 'admin'
      };

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminData),
      });

      if (response.ok) {
        setSuccess('تم إنشاء حساب المدير بنجاح!\nالبريد: admin@admin.com\nكلمة المرور: admin123');
        
        // Auto-fill login form
        setLoginData({
          username: 'admin@admin.com',
          password: 'admin123'
        });
        
        setTabValue(0); // Switch to login tab
      } else {
        const errorData = await response.json();
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
      setSuccess('تم تجاوز المصادقة للتطوير! جاري التوجيه...');
      
      setTimeout(() => {
        window.location.href = '/admin/dashboard';
      }, 1500);
    } catch (err) {
      setError('فشل في تجاوز المصادقة');
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
              color="warning"
              onClick={bypassAuth}
              disabled={loading}
              sx={{ py: 1.2 }}
            >
              تجاوز المصادقة (للتطوير)
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login; 