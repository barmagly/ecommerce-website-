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
  Fade,
  Zoom,
  Slide,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  AdminPanelSettings,
  Security,
  Email,
  Lock,
  ArrowForward,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import LoginSuccess from '../components/LoginSuccess';
import AnimatedBackground from '../components/AnimatedBackground';
import './AdminLogin.css';

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
  const [isFormFocused, setIsFormFocused] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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
      setShowSuccess(true);
      toast.success('تم تسجيل الدخول بنجاح');
      
      // Show success animation for 2 seconds then navigate
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message || 'فشل تسجيل الدخول');
      toast.error(err.message || 'فشل تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  // Show success screen if login was successful
  if (showSuccess) {
    return <LoginSuccess />;
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const floatingAnimation = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="login-container"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 80%, ${theme.palette.primary.main}10 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, ${theme.palette.secondary.main}10 0%, transparent 50%)`,
          zIndex: 0
        }
      }}
    >
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Particle Effects */}
      <Box className="particles">
        {[...Array(8)].map((_, index) => (
          <Box
            key={index}
            className="particle"
            component={motion.div}
            initial={{ opacity: 0, y: 100 }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              y: [100, -100],
              x: [0, Math.random() * 100 - 50]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: index * 1,
              ease: "linear"
            }}
          />
        ))}
      </Box>

      {/* Floating background elements */}
      <Box
        component={motion.div}
        variants={floatingAnimation}
        animate="animate"
        className="floating-shape"
        sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: `linear-gradient(45deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
          zIndex: 0
        }}
      />
      <Box
        component={motion.div}
        variants={floatingAnimation}
        animate="animate"
        className="floating-shape"
        sx={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: `linear-gradient(45deg, ${theme.palette.secondary.main}15, ${theme.palette.primary.main}15)`,
          zIndex: 0
        }}
      />
      <Box
        component={motion.div}
        variants={floatingAnimation}
        animate="animate"
        className="floating-shape"
        sx={{
          position: 'absolute',
          top: '80%',
          left: '20%',
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: `linear-gradient(45deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
          zIndex: 0
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 1,
          mt: 0,
          transform: 'none',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            gap: { xs: 4, lg: 8 },
            py: { xs: 4, md: 8 },
          }}
        >
          {/* Image Section */}
          <Box
            component={motion.div}
            variants={itemVariants}
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: { xs: 3, lg: 0 },
            }}
          >
            <Box
              component={motion.div}
              variants={floatingAnimation}
              animate="animate"
              sx={{
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -20,
                  left: -20,
                  right: -20,
                  bottom: -20,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
                  borderRadius: '50%',
                  zIndex: -1,
                  filter: 'blur(20px)'
                }
              }}
            >
              <Box
                component="img"
                src="https://www.pngall.com/wp-content/uploads/15/Login-PNG-HD-Image.png"
                alt="Login"
                sx={{
                  width: { xs: '80%', sm: '60%', lg: '100%' },
                  maxWidth: 500,
                  height: 'auto',
                  display: 'block',
                  mx: 'auto',
                  filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))',
                }}
              />
            </Box>
          </Box>

          {/* Login Form Section */}
          <Box
            component={motion.div}
            variants={itemVariants}
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <Paper
              component={motion.div}
              variants={formVariants}
              whileHover="hover"
              elevation={isFormFocused ? 8 : 3}
              className="login-form-container"
              sx={{
                p: { xs: 3, sm: 5 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                bgcolor: alpha(theme.palette.background.paper, 0.95),
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                width: '100%',
                maxWidth: 450,
                mx: 'auto',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                }
              }}
              onFocus={() => setIsFormFocused(true)}
              onBlur={() => setIsFormFocused(false)}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              >
                <Avatar
                  className="login-avatar"
                  sx={{
                    bgcolor: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    width: 70,
                    height: 70,
                    mb: 3,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
                  }}
                >
                  <AdminPanelSettings sx={{ fontSize: 40 }} />
                </Avatar>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <Typography 
                  component="h1" 
                  variant="h4" 
                  gutterBottom
                  className="login-title"
                  sx={{
                    fontWeight: 700,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textAlign: 'center',
                    mb: 1
                  }}
                >
                  تسجيل دخول المدير
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ textAlign: 'center', mb: 3 }}
                >
                  أدخل بياناتك للوصول إلى لوحة التحكم
                </Typography>
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ width: '100%', marginBottom: 16 }}
                  >
                    <Alert 
                      severity="error" 
                      className="error-alert"
                      sx={{ 
                        width: '100%',
                        borderRadius: 2,
                        boxShadow: `0 4px 12px ${alpha(theme.palette.error.main, 0.2)}`
                      }}
                    >
                      {error}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <Box 
                component="form" 
                onSubmit={handleSubmit} 
                sx={{ width: '100%' }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                  className="input-field"
                >
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
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                        },
                        '&.Mui-focused': {
                          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                        }
                      }
                    }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1, duration: 0.6 }}
                  className="input-field"
                >
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
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{
                              color: theme.palette.text.secondary,
                              '&:hover': {
                                color: theme.palette.primary.main,
                              }
                            }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                        },
                        '&.Mui-focused': {
                          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                        }
                      }
                    }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3, duration: 0.6 }}
                >
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    className="login-button"
                    sx={{
                      mt: 4,
                      mb: 2,
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 12px 35px ${alpha(theme.palette.primary.main, 0.4)}`,
                      },
                      '&:active': {
                        transform: 'translateY(0)',
                      }
                    }}
                    disabled={loading || authLoading}
                    startIcon={
                      loading || authLoading ? (
                        <CircularProgress size={20} color="inherit" className="loading-spinner" />
                      ) : (
                        <LoginIcon />
                      )
                    }
                    endIcon={
                      !loading && !authLoading && <ArrowForward />
                    }
                  >
                    {loading || authLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                  </Button>
                </motion.div>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminLogin; 