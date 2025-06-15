import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardAPI } from '../../services/api';
import { usersAPI } from '../../services/api';

// Async thunks
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      let overviewResponse = { data: { overview: {}, stats: {} } }; // Default empty structure
      try {
        overviewResponse = await dashboardAPI.getOverview();
      } catch (overviewError) {
        console.warn('Failed to fetch dashboard overview, using defaults:', overviewError);
        // Continue even if overview fails, other data might still be fetchable
      }

      const usersResponse = await usersAPI.getAll();

      // Ensure all overview fields are present, merging with defaults if backend omits any
      const combinedOverview = {
        totalUsers: usersResponse.data.users.length, // Always update totalUsers with actual count
        totalProducts: overviewResponse.data.overview?.totalProducts || 0,
        totalOrders: overviewResponse.data.overview?.totalOrders || 0,
        totalRevenue: overviewResponse.data.overview?.totalRevenue || 0,
        totalCategories: overviewResponse.data.overview?.totalCategories || 0,
        totalCoupons: overviewResponse.data.overview?.totalCoupons || 0,
        totalReviews: overviewResponse.data.overview?.totalReviews || 0,
        totalCarts: overviewResponse.data.overview?.totalCarts || 0,
        totalVariants: overviewResponse.data.overview?.totalVariants || 0,
        totalSales: overviewResponse.data.overview?.totalSales || 0,
        // Add any other expected overview fields here with default values
      };

      return {
        overview: combinedOverview,
        recentOrders: overviewResponse.data.stats?.recentOrders || [],
        topProducts: overviewResponse.data.stats?.topProducts || [],
        salesData: overviewResponse.data.stats?.salesData || [],
        categoryData: overviewResponse.data.stats?.categoryData || [],
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch dashboard data');
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
    totalSales: 0,
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
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload.overview;
        state.stats.recentOrders = action.payload.recentOrders;
        state.stats.topProducts = action.payload.topProducts;
        state.stats.salesData = action.payload.salesData;
        state.stats.categoryData = action.payload.categoryData;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer; 