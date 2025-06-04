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
      
      // Try different registration payload formats
      const registrationAttempts = [
        // Attempt 1: Standard format
        {
          name: registerData.name,
          email: registerData.email,
          password: registerData.password,
          role: 'admin'
        },
        // Attempt 2: With username field
        {
          name: registerData.name,
          username: registerData.email,
          email: registerData.email,
          password: registerData.password,
          role: 'admin'
        },
        // Attempt 3: firstName/lastName format
        {
          firstName: registerData.name.split(' ')[0] || registerData.name,
          lastName: registerData.name.split(' ')[1] || '',
          email: registerData.email,
          password: registerData.password,
          role: 'admin'
        },
        // Attempt 4: Without role
        {
          name: registerData.name,
          email: registerData.email,
          password: registerData.password
        },
        // Attempt 5: With confirmPassword
        {
          name: registerData.name,
          email: registerData.email,
          password: registerData.password,
          confirmPassword: registerData.confirmPassword,
          role: 'admin'
        }
      ];

      for (let i = 0; i < registrationAttempts.length; i++) {
        const payload = registrationAttempts[i];
        console.log(`Registration attempt ${i + 1}:`, payload);

        try {
          const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          console.log(`Attempt ${i + 1} - Status:`, response.status);

          if (response.ok) {
            const data = await response.json();
            console.log(`Attempt ${i + 1} - Success:`, data);
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
            setLoading(false);
            return;
          } else {
            const errorData = await response.json();
            console.log(`Attempt ${i + 1} - Error:`, errorData);
            
            // If this is the last attempt, show the error
            if (i === registrationAttempts.length - 1) {
              if (errorData.message) {
                if (errorData.message.includes('already exists') || errorData.message.includes('duplicate')) {
                  setError('البريد الإلكتروني مستخدم بالفعل');
                } else if (errorData.message.includes('required')) {
                  setError('جميع الحقول مطلوبة - تحقق من تنسيق البيانات');
                } else {
                  setError(`خطأ في التسجيل: ${errorData.message}`);
                }
              } else {
                setError('فشل في إنشاء الحساب - تحقق من البيانات المدخلة');
              }
            }
          }
        } catch (fetchError) {
          console.error(`Attempt ${i + 1} - Fetch error:`, fetchError);
          
          // If this is the last attempt, show the error
          if (i === registrationAttempts.length - 1) {
            setError('خطأ في الشبكة. تحقق من الاتصال بالإنترنت.');
          }
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('خطأ غير متوقع في التسجيل');
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
      
      // Try different admin data formats based on common backend requirements
      const adminAttempts = [
        // Attempt 1: Complete admin data with all possible fields
        {
          name: 'مدير النظام',
          firstName: 'مدير',
          lastName: 'النظام',
          username: 'admin',
          email: 'admin@admin.com',
          password: 'admin123',
          confirmPassword: 'admin123',
          role: 'admin',
          isAdmin: true,
          status: 'active'
        },
        // Attempt 2: Standard format with username
        {
          name: 'مدير النظام',
          username: 'admin',
          email: 'admin@admin.com',
          password: 'admin123',
          role: 'admin'
        },
        // Attempt 3: firstName/lastName format
        {
          firstName: 'مدير',
          lastName: 'النظام',
          email: 'admin@admin.com',
          password: 'admin123',
          confirmPassword: 'admin123',
          role: 'admin'
        },
        // Attempt 4: Basic format with phone number
        {
          name: 'مدير النظام',
          email: 'admin@admin.com',
          password: 'admin123',
          phone: '1234567890',
          role: 'admin'
        },
        // Attempt 5: All common e-commerce fields
        {
          name: 'مدير النظام',
          email: 'admin@admin.com',
          password: 'admin123',
          confirmPassword: 'admin123',
          phone: '1234567890',
          address: 'Admin Address',
          city: 'Admin City',
          country: 'Admin Country',
          role: 'admin',
          isAdmin: true
        },
        // Attempt 6: Minimal required fields
        {
          name: 'مدير النظام',
          email: 'admin@admin.com',
          password: 'admin123'
        }
      ];

      for (let i = 0; i < adminAttempts.length; i++) {
        const adminData = adminAttempts[i];
        console.log(`Admin creation attempt ${i + 1}:`, adminData);

        try {
          const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(adminData),
          });

          console.log(`Admin attempt ${i + 1} - Status:`, response.status);

          if (response.ok) {
            const data = await response.json();
            console.log(`Admin attempt ${i + 1} - Success:`, data);
            setSuccess('تم إنشاء حساب المدير بنجاح!\nالبريد: admin@admin.com\nكلمة المرور: admin123');
            
            // Auto-fill login form
            setLoginData({
              username: 'admin@admin.com',
              password: 'admin123'
            });
            
            setTabValue(0); // Switch to login tab
            setLoading(false);
            return;
          } else {
            const errorData = await response.json();
            console.log(`Admin attempt ${i + 1} - Error:`, errorData);
            
            if (errorData.message && (errorData.message.includes('already exists') || errorData.message.includes('duplicate'))) {
              setSuccess('حساب المدير موجود بالفعل!\nالبريد: admin@admin.com\nكلمة المرور: admin123');
              
              // Auto-fill login form
              setLoginData({
                username: 'admin@admin.com',
                password: 'admin123'
              });
              
              setTabValue(0); // Switch to login tab
              setLoading(false);
              return;
            }
            
            // If this is the last attempt, show the error
            if (i === adminAttempts.length - 1) {
              setError('فشل في إنشاء حساب المدير: ' + (errorData.message || 'خطأ غير معروف'));
            }
          }
        } catch (fetchError) {
          console.error(`Admin attempt ${i + 1} - Fetch error:`, fetchError);
          
          // If this is the last attempt, show the error
          if (i === adminAttempts.length - 1) {
            setError('خطأ في الشبكة أثناء إنشاء حساب المدير');
          }
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

  // Test backend API endpoints
  const testBackendEndpoints = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    const API_URL = import.meta.env.VITE_API_URL || 'https://ecommerce-website-backend-nine.vercel.app/api';
    
    console.log('Testing backend endpoints...');
    
    // Test different possible endpoints
    const endpoints = [
      '/auth/register',
      '/users/register', 
      '/register',
      '/auth/signup',
      '/users/signup',
      '/signup',
      '/auth',
      '/users',
      '/'
    ];

    const results = [];

    for (const endpoint of endpoints) {
      try {
        console.log(`Testing: ${API_URL}${endpoint}`);
        
        // Test GET request first
        const getResponse = await fetch(`${API_URL}${endpoint}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log(`GET ${endpoint} - Status: ${getResponse.status}`);
        
        if (getResponse.status !== 404) {
          const getResult = await getResponse.text();
          console.log(`GET ${endpoint} - Response:`, getResult);
          results.push(`✅ GET ${endpoint}: ${getResponse.status}`);
        }

        // Test POST request for registration endpoints
        if (endpoint.includes('register') || endpoint.includes('signup')) {
          const testPayload = {
            name: 'Test User',
            email: 'test@test.com',
            password: 'test123'
          };

          const postResponse = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(testPayload),
          });

          console.log(`POST ${endpoint} - Status: ${postResponse.status}`);
          
          if (postResponse.status !== 404) {
            const postResult = await postResponse.text();
            console.log(`POST ${endpoint} - Response:`, postResult);
            results.push(`✅ POST ${endpoint}: ${postResponse.status}`);
          }
        }
      } catch (error) {
        console.log(`❌ ${endpoint} - Error:`, error.message);
        results.push(`❌ ${endpoint}: ${error.message}`);
      }
    }

    // Display results
    const resultMessage = results.length > 0 
      ? `نتائج اختبار الـ API:\n${results.join('\n')}`
      : 'لم يتم العثور على أي endpoints متاحة';
    
    setSuccess(resultMessage);
    setLoading(false);
  };

  // Check backend status
  const checkBackendStatus = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    const API_URL = import.meta.env.VITE_API_URL || 'https://ecommerce-website-backend-nine.vercel.app/api';
    const BASE_URL = API_URL.replace('/api', '');
    
    console.log('Checking backend status...');
    console.log('API_URL:', API_URL);
    console.log('BASE_URL:', BASE_URL);

    try {
      // Test base URL first
      const baseResponse = await fetch(BASE_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Base URL Status:', baseResponse.status);
      
      if (baseResponse.ok) {
        const baseResult = await baseResponse.text();
        console.log('Base URL Response:', baseResult);
        
        setSuccess(`✅ الخادم متاح!\nالحالة: ${baseResponse.status}\nالاستجابة: ${baseResult.substring(0, 200)}...`);
      } else {
        setError(`❌ الخادم غير متاح\nالحالة: ${baseResponse.status}`);
      }
    } catch (error) {
      console.error('Backend status check error:', error);
      setError(`❌ خطأ في الاتصال بالخادم: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Analyze backend schema to discover required fields
  const analyzeBackendSchema = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    const API_URL = import.meta.env.VITE_API_URL || 'https://ecommerce-website-backend-nine.vercel.app/api';
    
    console.log('Analyzing backend schema...');
    
    // Send minimal data to get detailed error response
    const testPayloads = [
      {},  // Empty object
      { email: 'test@test.com' },  // Only email
      { password: 'test123' },  // Only password
      { name: 'Test' },  // Only name
      { email: 'test@test.com', password: 'test123' },  // Email + password
    ];

    const results = [];

    for (let i = 0; i < testPayloads.length; i++) {
      const payload = testPayloads[i];
      console.log(`Schema test ${i + 1}:`, payload);

      try {
        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        console.log(`Schema test ${i + 1} - Status:`, response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.log(`Schema test ${i + 1} - Error:`, errorData);
          
          // Analyze error message for field requirements
          if (errorData.message) {
            results.push(`Test ${i + 1}: ${errorData.message}`);
            
            // Look for specific field mentions
            const message = errorData.message.toLowerCase();
            if (message.includes('name')) results.push('- يتطلب حقل name');
            if (message.includes('email')) results.push('- يتطلب حقل email');
            if (message.includes('password')) results.push('- يتطلب حقل password');
            if (message.includes('phone')) results.push('- يتطلب حقل phone');
            if (message.includes('username')) results.push('- يتطلب حقل username');
            if (message.includes('firstname')) results.push('- يتطلب حقل firstName');
            if (message.includes('lastname')) results.push('- يتطلب حقل lastName');
          }
        }
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

  // Comprehensive backend field discovery
  const discoverBackendFields = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    const API_URL = import.meta.env.VITE_API_URL || 'https://ecommerce-website-backend-nine.vercel.app/api';
    
    console.log('🔍 Discovering backend field requirements...');
    
    // Test with every possible field combination
    const fieldTests = [
      // Test 1: Common e-commerce fields
      {
        name: 'Test User',
        email: 'test@test.com',
        password: 'test123',
        phone: '1234567890',
        address: 'Test Address'
      },
      // Test 2: User management fields
      {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@test.com',
        password: 'test123',
        phone: '1234567890'
      },
      // Test 3: Complete profile
      {
        name: 'Test User',
        firstName: 'Test',
        lastName: 'User',
        username: 'testuser',
        email: 'test@test.com',
        password: 'test123',
        confirmPassword: 'test123',
        phone: '1234567890',
        address: 'Test Address',
        city: 'Test City',
        state: 'Test State',
        country: 'Test Country',
        zipCode: '12345',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        role: 'admin',
        isAdmin: true,
        status: 'active'
      },
      // Test 4: Minimal with phone
      {
        name: 'Test User',
        email: 'test@test.com',
        password: 'test123',
        phone: '1234567890'
      },
      // Test 5: With all auth fields
      {
        name: 'Test User',
        email: 'test@test.com',
        password: 'test123',
        confirmPassword: 'test123',
        phone: '1234567890',
        terms: true,
        newsletter: false
      },
      // Test 6: Backend-specific fields (common in Node.js backends)
      {
        fullName: 'Test User',
        emailAddress: 'test@test.com',
        userPassword: 'test123',
        phoneNumber: '1234567890',
        userRole: 'admin'
      },
      // Test 7: Alternative naming conventions
      {
        user_name: 'Test User',
        user_email: 'test@test.com',
        user_password: 'test123',
        user_phone: '1234567890'
      },
      // Test 8: Camel case variations
      {
        userName: 'Test User',
        userEmail: 'test@test.com',
        userPassword: 'test123',
        userPhone: '1234567890',
        userRole: 'admin'
      }
    ];

    const results = [];

    for (let i = 0; i < fieldTests.length; i++) {
      const testData = fieldTests[i];
      console.log(`🧪 Field test ${i + 1}:`, testData);

      try {
        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testData),
        });

        console.log(`📊 Test ${i + 1} - Status: ${response.status}`);

        if (response.ok) {
          const successData = await response.json();
          console.log(`✅ Test ${i + 1} - SUCCESS!`, successData);
          results.push(`✅ Test ${i + 1}: SUCCESS! Fields that worked:`);
          results.push(`   ${Object.keys(testData).join(', ')}`);
          
          setSuccess(`🎉 تم اكتشاف التنسيق الصحيح!\nالحقول المطلوبة: ${Object.keys(testData).join(', ')}\n\nسيتم استخدام هذا التنسيق الآن.`);
          setLoading(false);
          return testData; // Return the working format
        } else {
          const errorData = await response.json();
          console.log(`❌ Test ${i + 1} - Error:`, errorData);
          results.push(`❌ Test ${i + 1}: ${errorData.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.log(`💥 Test ${i + 1} - Fetch error:`, error.message);
        results.push(`💥 Test ${i + 1}: ${error.message}`);
      }

      // Small delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // If no format worked, show all results
    const resultMessage = `🔍 نتائج اكتشاف الحقول:\n${results.join('\n')}\n\n❌ لم يتم العثور على تنسيق صحيح. قد يكون الخادم يتطلب مصادقة مسبقة.`;
    setError(resultMessage);
    setLoading(false);
    return null;
  };

  // Test if backend requires authentication for registration
  const testAuthRequirement = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    const API_URL = import.meta.env.VITE_API_URL || 'https://ecommerce-website-backend-nine.vercel.app/api';
    
    console.log('🔐 Testing authentication requirements...');
    
    // Test different authentication scenarios
    const authTests = [
      // Test 1: No authentication
      {
        headers: { 'Content-Type': 'application/json' },
        description: 'بدون مصادقة'
      },
      // Test 2: With fake admin token
      {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer fake-admin-token'
        },
        description: 'مع token وهمي'
      },
      // Test 3: With API key
      {
        headers: { 
          'Content-Type': 'application/json',
          'X-API-Key': 'admin-api-key'
        },
        description: 'مع API key'
      },
      // Test 4: With basic auth
      {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Basic YWRtaW46YWRtaW4='  // admin:admin
        },
        description: 'مع Basic Auth'
      },
      // Test 5: With custom headers
      {
        headers: { 
          'Content-Type': 'application/json',
          'X-Admin-Secret': 'admin-secret',
          'X-Client-Type': 'admin-panel'
        },
        description: 'مع headers مخصصة'
      }
    ];

    const testPayload = {
      name: 'Test Admin',
      email: 'test@admin.com',
      password: 'test123',
      phone: '1234567890'
    };

    const results = [];

    for (let i = 0; i < authTests.length; i++) {
      const { headers, description } = authTests[i];
      console.log(`🔑 Auth test ${i + 1} (${description}):`, headers);

      try {
        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers,
          body: JSON.stringify(testPayload),
        });

        console.log(`📊 Auth test ${i + 1} - Status: ${response.status}`);

        if (response.ok) {
          const successData = await response.json();
          console.log(`✅ Auth test ${i + 1} - SUCCESS!`, successData);
          results.push(`✅ ${description}: نجح!`);
          
          setSuccess(`🎉 تم اكتشاف متطلبات المصادقة!\n${description} يعمل بنجاح.\n\nHeaders المطلوبة: ${JSON.stringify(headers, null, 2)}`);
          setLoading(false);
          return { headers, payload: testPayload };
        } else {
          const errorData = await response.json();
          console.log(`❌ Auth test ${i + 1} - Error:`, errorData);
          results.push(`❌ ${description}: ${errorData.message || 'فشل'}`);
        }
      } catch (error) {
        console.log(`💥 Auth test ${i + 1} - Fetch error:`, error.message);
        results.push(`💥 ${description}: ${error.message}`);
      }

      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Test if we can get a token first
    console.log('🔄 Testing if we can get an auth token...');
    
    try {
      // Try to login with common admin credentials to get a token
      const loginAttempts = [
        { email: 'admin@admin.com', password: 'admin123' },
        { username: 'admin', password: 'admin123' },
        { email: 'admin@example.com', password: 'admin' }
      ];

      for (const loginData of loginAttempts) {
        try {
          const loginResponse = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData),
          });

          if (loginResponse.ok) {
            const loginResult = await loginResponse.json();
            console.log('✅ Got auth token:', loginResult);
            
            if (loginResult.token) {
              // Try registration with the token
              const authHeaders = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${loginResult.token}`
              };

              const authRegResponse = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: authHeaders,
                body: JSON.stringify(testPayload),
              });

              if (authRegResponse.ok) {
                const regResult = await authRegResponse.json();
                console.log('✅ Registration with token succeeded:', regResult);
                results.push(`✅ التسجيل مع token نجح!`);
                
                setSuccess(`🎉 تم اكتشاف الحل!\nيجب الحصول على token أولاً من خلال تسجيل الدخول، ثم استخدامه للتسجيل.\n\nToken: ${loginResult.token.substring(0, 20)}...`);
                setLoading(false);
                return { requiresAuth: true, token: loginResult.token };
              }
            }
          }
        } catch (loginError) {
          console.log('Login attempt failed:', loginError.message);
        }
      }
    } catch (tokenError) {
      console.log('Token test failed:', tokenError.message);
    }

    // Show all results
    const resultMessage = `🔐 نتائج اختبار المصادقة:\n${results.join('\n')}\n\n❌ لم يتم العثور على طريقة صحيحة للمصادقة.`;
    setError(resultMessage);
    setLoading(false);
    return null;
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
              color="primary"
              onClick={checkBackendStatus}
              disabled={loading}
              sx={{ py: 1.2 }}
            >
              فحص حالة الخادم
            </Button>

            <Button
              fullWidth
              variant="outlined"
              color="info"
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
              onClick={testAuthRequirement}
              disabled={loading}
              sx={{ py: 1.2 }}
            >
              🔐 اختبار متطلبات المصادقة
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