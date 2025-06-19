import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  Avatar,
  Container,
  Paper,
  useTheme,
  alpha,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  AdminPanelSettings,
  Security,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login, isAuthenticated, loading: authLoading, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Update error state when auth error changes
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData);
      toast.success('تم تسجيل الدخول بنجاح');
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'فشل تسجيل الدخول');
      toast.error(err.message || 'فشل تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: theme.palette.background.default,
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          mt: 0,
          transform: 'none',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            gap: { xs: 2, md: 4 },
            py: { xs: 4, md: 8 },
          }}
        >
          {/* Image Section */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: { xs: 3, md: 0 },
            }}
          >
            <Box
              component="img"
              src="https://www.pngall.com/wp-content/uploads/15/Login-PNG-HD-Image.png"
              alt="Login"
              sx={{
                width: { xs: '80%', sm: '60%', md: '100%' },
                maxWidth: 400,
                height: 'auto',
                display: 'block',
                mx: 'auto',
              }}
            />
          </Box>

          {/* Login Form Section */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <Paper
              elevation={3}
              sx={{
                p: { xs: 2, sm: 4 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                bgcolor: theme.palette.background.paper,
                borderRadius: 2,
                width: '100%',
                maxWidth: 400,
                mx: 'auto',
              }}
            >
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.main,
                  width: 56,
                  height: 56,
                  mb: 2
                }}
              >
                <AdminPanelSettings sx={{ fontSize: 32 }} />
              </Avatar>

              <Typography component="h1" variant="h5" gutterBottom>
                تسجيل دخول المدير
              </Typography>

              {error && (
                <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="البريد الإلكتروني"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={formData.email}
                  onChange={handleChange}
                  error={!!error}
                  dir="rtl"
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="كلمة المرور"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!error}
                  dir="rtl"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={loading || authLoading}
                  startIcon={loading || authLoading ? <CircularProgress size={20} /> : <LoginIcon />}
                >
                  {loading || authLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                </Button>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminLogin; 