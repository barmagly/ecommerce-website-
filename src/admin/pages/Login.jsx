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
  Divider
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
  const [success, setSuccess] = useState('');

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
    setSuccess('');
    try {
      const success = await login(formData);
      if (success) {
        navigate('/admin/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to create admin user
  const createAdminUser = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    // Try different registration payloads
    const registrationAttempts = [
      {
        email: 'admin@admin.com',
        password: 'admin123',
        name: 'Admin User',
        username: 'admin',
        role: 'admin'
      },
      {
        email: 'admin@admin.com',
        password: 'admin123',
        name: 'Admin User'
      },
      {
        email: 'admin@admin.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User'
      }
    ];
    
    for (let i = 0; i < registrationAttempts.length; i++) {
      try {
        console.log(`Attempting registration ${i + 1}:`, registrationAttempts[i]);
        
        const response = await fetch('https://ecommerce-website-backend-nine.vercel.app/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(registrationAttempts[i])
        });
        
        console.log(`Registration attempt ${i + 1} status:`, response.status);
        
        if (response.ok) {
          const data = await response.json();
          setSuccess('✅ Admin user created successfully! You can now login with:\nEmail: admin@admin.com\nPassword: admin123');
          console.log('Admin user created:', data);
          setLoading(false);
          return;
        } else {
          const errorData = await response.json();
          console.log(`Registration attempt ${i + 1} error:`, errorData);
          
          if (errorData.message && (errorData.message.includes('already exists') || errorData.message.includes('duplicate'))) {
            setSuccess('ℹ️ Admin user already exists. Try logging in with:\nEmail: admin@admin.com\nPassword: admin123');
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.log(`Registration attempt ${i + 1} failed:`, error.message);
      }
    }
    
    setError('❌ Could not create admin user. The backend might not support registration or requires different fields. Please contact the backend developer.');
    setLoading(false);
  };

  // Function to try common admin credentials
  const tryCommonCredentials = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    const commonCredentials = [
      { username: 'admin@admin.com', password: 'admin123' },
      { username: 'admin', password: 'admin123' },
      { username: 'admin@admin.com', password: 'admin' },
      { username: 'admin', password: 'admin' },
      { username: 'admin', password: 'password' },
      { username: 'admin@example.com', password: 'admin123' },
      { username: 'test@admin.com', password: 'admin' },
      { username: 'administrator', password: 'admin123' }
    ];
    
    for (let i = 0; i < commonCredentials.length; i++) {
      try {
        console.log(`Trying credentials ${i + 1}:`, commonCredentials[i]);
        const success = await login(commonCredentials[i]);
        if (success) {
          setSuccess(`✅ Login successful with:\nUsername: ${commonCredentials[i].username}\nPassword: ${commonCredentials[i].password}`);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.log(`Credentials ${i + 1} failed:`, error.message);
      }
    }
    
    setError('❌ None of the common credentials worked. Please try creating an admin user or contact the backend developer.');
    setLoading(false);
  };

  // Manual test function for debugging (only runs when button is clicked)
  const testApiConnection = async () => {
    console.log('Testing API connection...');
    
    // Test different credential formats
    const testCredentials = [
      { email: 'admin@admin.com', password: 'admin123' },
      { username: 'admin', password: 'admin123' },
      { email: 'admin', password: 'admin' },
      { username: 'admin', password: 'admin' },
      { email: 'admin', password: 'password' },
      { username: 'admin', password: 'password' }
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
          alert(`✅ Success with credentials: ${JSON.stringify(creds)}\nToken: ${data.token ? 'Present' : 'Missing'}`);
          return;
        } else {
          const errorText = await response.text();
          console.log(`Test ${i + 1} - Error response:`, errorText);
        }
      } catch (error) {
        console.error(`Test ${i + 1} - Fetch error:`, error);
      }
    }
    
    alert('❌ All credential tests failed. Check console for details.');
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
            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2, width: '100%', whiteSpace: 'pre-line' }}>
              {success}
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

            <Divider sx={{ my: 2 }}>أو</Divider>

            {/* Admin user creation button */}
            <Button
              fullWidth
              variant="contained"
              color="success"
              onClick={createAdminUser}
              sx={{ mb: 1 }}
              disabled={loading}
            >
              إنشاء مستخدم إداري جديد
            </Button>

            {/* Try common credentials button */}
            <Button
              fullWidth
              variant="contained"
              color="info"
              onClick={tryCommonCredentials}
              sx={{ mb: 2 }}
              disabled={loading}
            >
              تجربة بيانات الدخول الشائعة
            </Button>

            {/* Debug button - only for testing */}
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