import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { Provider } from 'react-redux';
import { store } from './store';
import { fetchDashboardData } from './store/slices/dashboardSlice';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import AppContent from './AppContent';

// Import pages
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Categories from './pages/Categories';
import Coupons from './pages/Coupons';
import Reviews from './pages/Reviews';
import Carts from './pages/Carts';
import Variants from './pages/Variants';
import Settings from './pages/Settings';
import AdminLogin from './pages/AdminLogin';
import Profile from './pages/Profile';
import Offers from './pages/Offers';

// Import layout and auth
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Arabic RTL theme
const theme = createTheme({
  direction: 'rtl',
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      'Cairo',
      'Tajawal',
      'Noto Sans Arabic',
      'Arial',
      'sans-serif'
    ].join(','),
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          direction: 'rtl',
          fontFamily: 'Cairo, Tajawal, sans-serif',
        },
        '*': {
          boxSizing: 'border-box',
        },
        html: {
          direction: 'rtl',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

const AdminAppContent = () => {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastContainer />
        <AppContent>
          <Routes>
            <Route path="/" element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
            <Route path="products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
            <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
            <Route path="coupons" element={<ProtectedRoute><Coupons /></ProtectedRoute>} />
            <Route path="reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
            <Route path="carts" element={<ProtectedRoute><Carts /></ProtectedRoute>} />
            <Route path="variants" element={<ProtectedRoute><Variants /></ProtectedRoute>} />
            <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="login" element={<AdminLogin />} />
            <Route path="offers" element={<ProtectedRoute><Offers /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </AppContent>
      </ThemeProvider>
    </AuthProvider>
  );
};

const AdminApp = () => {
  return (
    <Provider store={store}>
      <AdminAppContent />
    </Provider>
  );
};

export default AdminApp; 