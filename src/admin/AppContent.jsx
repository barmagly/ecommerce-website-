import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from './context/AuthContext';
import { fetchDashboardData } from './store/slices/dashboardSlice';

// Import pages
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import Users from './pages/Users';
import AdminLayout from './components/AdminLayout';

const AppContent = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useAuth();
  const { loading: dashboardLoading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchDashboardData());
    }
  }, [dispatch, isAuthenticated]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="background.default"
      >
        <Box
          component="img"
          src="/loading.gif"
          alt="Loading..."
          sx={{ width: 100, height: 100 }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <CssBaseline />
      <Routes>
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <AdminLogin />
            ) : (
              <Navigate to="/admin/dashboard" replace />
            )
          }
        />
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <AdminLayout>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="products/*" element={<Products />} />
                  <Route path="categories/*" element={<Categories />} />
                  <Route path="orders/*" element={<Orders />} />
                  <Route path="users/*" element={<Users />} />
                  <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                </Routes>
              </AdminLayout>
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        />
      </Routes>
    </Box>
  );
};

export default AppContent; 