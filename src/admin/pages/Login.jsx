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
      { username: 'admin', password: 'admin' },
      { email: 'admin', password: 'password' },
      { username: 'admin', password: 'password' }
    ];
    
    for (let i = 0; i < testCredentials.length; i++) {
      const creds = testCredentials[i];
      console.log(`Testing credentials ${i + 1}:`, creds);
      
      try {
        // Simple fetch without any extra headers to avoid CORS preflight
        const response = await fetch('https://ecommerce-website-backend-nine.vercel.app/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(creds)
        });
        
        console.log(`Test ${i + 1} - Status:`, response.status);
        console.log(`Test ${i + 1} - Headers:`, [...response.headers.entries()]);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`Test ${i + 1} - Success! Response:`, data);
          alert(`✅ Success with credentials: ${JSON.stringify(creds)}\nToken: ${data.token ? 'Present' : 'Missing'}`);
          return;
        } else {
          const errorText = await response.text();
          console.log(`Test ${i + 1} - Error response:`, errorText);
          
          if (response.status === 401) {
            console.log(`Test ${i + 1} - Unauthorized (wrong credentials)`);
          } else if (response.status === 404) {
            console.log(`Test ${i + 1} - Endpoint not found`);
          }
        }
      } catch (error) {
        console.error(`Test ${i + 1} - Fetch error:`, error);
        if (error.message.includes('CORS')) {
          console.log(`Test ${i + 1} - CORS error detected`);
        }
      }
    }
    
    alert('❌ All credential tests failed. Check console for details.');
  };

  // Alternative login method using form submission to bypass CORS
  const loginWithForm = async (credentials) => {
    return new Promise((resolve, reject) => {
      // Create a hidden iframe to handle the response
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.name = 'login-frame';
      document.body.appendChild(iframe);

      // Create a form
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://ecommerce-website-backend-nine.vercel.app/api/auth/login';
      form.target = 'login-frame';
      form.style.display = 'none';

      // Add form fields
      const emailField = document.createElement('input');
      emailField.type = 'hidden';
      emailField.name = 'email';
      emailField.value = credentials.username;
      form.appendChild(emailField);

      const usernameField = document.createElement('input');
      usernameField.type = 'hidden';
      usernameField.name = 'username';
      usernameField.value = credentials.username;
      form.appendChild(usernameField);

      const passwordField = document.createElement('input');
      passwordField.type = 'hidden';
      passwordField.name = 'password';
      passwordField.value = credentials.password;
      form.appendChild(passwordField);

      // Handle iframe load
      iframe.onload = () => {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
          const responseText = iframeDoc.body.textContent;
          console.log('Form response:', responseText);
          
          try {
            const result = JSON.parse(responseText);
            resolve({ data: result });
          } catch {
            reject(new Error('Invalid response format'));
          }
        } catch (error) {
          console.error('Form submission error:', error);
          reject(error);
        } finally {
          // Cleanup
          document.body.removeChild(form);
          document.body.removeChild(iframe);
        }
      };

      // Submit form
      document.body.appendChild(form);
      form.submit();
    });
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

            {/* Debug buttons */}
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={testApiConnection}
              sx={{ mt: 1 }}
            >
              اختبار الاتصال بالـ API
            </Button>

            <Button
              fullWidth
              variant="outlined"
              color="info"
              onClick={async () => {
                try {
                  setLoading(true);
                  const result = await loginWithForm(formData);
                  console.log('Form login result:', result);
                  alert('Form login successful! Check console for details.');
                } catch (error) {
                  console.error('Form login error:', error);
                  alert('Form login failed: ' + error.message);
                } finally {
                  setLoading(false);
                }
              }}
              sx={{ mt: 1 }}
              disabled={loading}
            >
              تجربة تسجيل الدخول بالنموذج
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login; 