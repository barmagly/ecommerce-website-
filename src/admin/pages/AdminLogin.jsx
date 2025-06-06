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
import adminUsers from '../data/adminUsers.json';

const AdminLogin = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  // Show loading if auth is still being checked
  if (authLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <CircularProgress size={60} sx={{ color: 'white' }} />
          <Typography variant="h6" color="white">
            جاري التحقق...
          </Typography>
        </Box>
      </Box>
    );
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user in JSON data
      const user = adminUsers.users.find(
        u => u.username === formData.username && u.password === formData.password
      );

      if (user) {
        // Use auth context login
        const userData = {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
          email: user.email,
          loginTime: new Date().toISOString()
        };
        
        login(userData);
        toast.success('تم تسجيل الدخول بنجاح!');
        navigate('/admin', { replace: true });
      } else {
        setError('اسم المستخدم أو كلمة المرور غير صحيحة');
        toast.error('فشل في تسجيل الدخول');
      }
    } catch (error) {
      setError('حدث خطأ في تسجيل الدخول');
      toast.error('حدث خطأ في النظام');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 0.8, 
            type: "spring", 
            stiffness: 100,
            delay: 0.1 
          }}
        >
          <Card
            sx={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 6,
              boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                p: 4,
                textAlign: 'center',
                color: 'white',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
                }
              }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  duration: 0.8, 
                  type: "spring", 
                  stiffness: 150,
                  delay: 0.3 
                }}
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 2,
                    background: 'rgba(255,255,255,0.2)',
                    border: '3px solid rgba(255,255,255,0.3)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <AdminPanelSettings sx={{ fontSize: 40 }} />
                </Avatar>
              </motion.div>
              
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                لوحة التحكم
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                تسجيل الدخول لإدارة النظام
              </Typography>
            </Box>

            <CardContent sx={{ p: 4 }}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <form onSubmit={handleLogin}>
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      name="username"
                      label="اسم المستخدم"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          background: alpha(theme.palette.primary.main, 0.02),
                          '&:hover': {
                            background: alpha(theme.palette.primary.main, 0.05),
                          },
                          '&.Mui-focused': {
                            background: alpha(theme.palette.primary.main, 0.08),
                          }
                        }
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AdminPanelSettings sx={{ color: 'primary.main' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      name="password"
                      label="كلمة المرور"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          background: alpha(theme.palette.primary.main, 0.02),
                          '&:hover': {
                            background: alpha(theme.palette.primary.main, 0.05),
                          },
                          '&.Mui-focused': {
                            background: alpha(theme.palette.primary.main, 0.08),
                          }
                        }
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Security sx={{ color: 'primary.main' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                        {error}
                      </Alert>
                    </motion.div>
                  )}

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={loading}
                      startIcon={<LoginIcon />}
                      sx={{
                        py: 2,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                          boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
                        },
                        '&:disabled': {
                          background: 'linear-gradient(135deg, #ccc 0%, #999 100%)',
                        }
                      }}
                    >
                      {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                    </Button>
                  </motion.div>
                </form>
              </motion.div>

              {/* Demo Credentials */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <Paper
                  sx={{
                    mt: 4,
                    p: 3,
                    background: alpha(theme.palette.info.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                    borderRadius: 3,
                  }}
                >
                  <Typography variant="subtitle2" color="info.main" fontWeight="bold" sx={{ mb: 1 }}>
                    بيانات تجريبية:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    اسم المستخدم: <strong>admin</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    كلمة المرور: <strong>admin</strong>
                  </Typography>
                </Paper>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default AdminLogin; 