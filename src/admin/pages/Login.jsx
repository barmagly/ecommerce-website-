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
  Alert
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const success = await login(formData);
      if (success) {
        navigate('/admin/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  // Debug function to test API connectivity
  const testApiConnection = async () => {
    console.log('Testing API connection...');
    
    // Test different credential formats
    const testCredentials = [
      { email: 'admin@admin.com', password: 'admin123' },
      { username: 'admin', password: 'admin123' },
      { email: 'admin', password: 'admin' },
      { username: 'admin', password: 'admin' }
    ];
    
    for (let i = 0; i < testCredentials.length; i++) {
      const creds = testCredentials[i];
      console.log(`Testing credentials ${i + 1}:`, creds);
      
      try {
        const response = await fetch('https://ecommerce-website-backend-nine.vercel.app/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(creds)
        });
        
        console.log(`Test ${i + 1} - Status:`, response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`Test ${i + 1} - Success! Response:`, data);
          alert(`Success with credentials: ${JSON.stringify(creds)}`);
          return;
        } else {
          const errorText = await response.text();
          console.log(`Test ${i + 1} - Error response:`, errorText);
        }
      } catch (error) {
        console.error(`Test ${i + 1} - Fetch error:`, error);
      }
    }
    
    alert('All credential tests failed. Check console for details.');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
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
          <Typography component="h1" variant="h5" gutterBottom>
            تسجيل الدخول للوحة التحكم
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="اسم المستخدم"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
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
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'تسجيل الدخول'
              )}
            </Button>

            {/* Debug button */}
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={testApiConnection}
              sx={{ mt: 1 }}
            >
              اختبار الاتصال بالـ API
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login; 