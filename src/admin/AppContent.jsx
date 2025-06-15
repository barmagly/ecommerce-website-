import React, { useEffect } from 'react';
import { Box, CssBaseline } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from './context/AuthContext';
import { fetchDashboardData } from './store/slices/dashboardSlice';
import AdminLayout from './components/AdminLayout';

const AppContent = ({ children }) => {
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
      {isAuthenticated ? (
        <AdminLayout>{children}</AdminLayout>
      ) : (
        children
      )}
    </Box>
  );
};

export default AppContent; 