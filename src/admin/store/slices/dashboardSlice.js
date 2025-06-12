import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardAPI } from '../../services/api';

// Async thunks
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.getOverview();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch dashboard data');
    }
  }
);

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.getStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch dashboard stats');
    }
  }
);

const initialState = {
  overview: {
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCategories: 0,
    totalCoupons: 0,
    totalReviews: 0,
    totalCarts: 0,
    totalVariants: 0,
  },
  stats: {
    salesData: [],
    categoryData: [],
    recentOrders: [],
    topProducts: [],
    performanceMetrics: [],
  },
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch dashboard data
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch dashboard stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer; 