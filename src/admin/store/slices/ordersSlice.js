import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ordersAPI } from '../../services/api';

// Async thunks
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ id, status, paymentStatus }, { rejectWithValue, getState }) => {
    try {
      let response;
      if (status === 'cancelled') {
        response = await ordersAPI.cancel(id); // Use cancel endpoint for stock restore
      } else {
        response = await ordersAPI.update(id, { status, paymentStatus });
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order status');
    }
  }
);

export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (id, { rejectWithValue }) => {
    try {
      await ordersAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete order');
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  selectedOrder: null,
  totalOrders: 0,
  totalRevenue: 0,
  filters: {
    status: 'all',
    dateRange: null,
    search: '',
  },
  pagination: {
    page: 1,
    limit: 10,
    totalPages: 1,
  },
  stats: {
    statusCounts: {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    },
    recentOrders: [],
    topCustomers: [],
  },
  lastUpdate: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to first page when filters change
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
    markOrderAsRead: (state, action) => {
      const order = state.items.find(o => o._id === action.payload);
      if (order) {
        order.isNew = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = state.items.length === 0; // Only show loading on initial fetch
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        
        // Compare with existing orders to mark new ones
        const existingIds = new Set(state.items.map(order => order._id));
        action.payload.orders = action.payload.orders.map(order => ({
          ...order,
          isNew: !existingIds.has(order._id) && (!state.lastUpdate || new Date(order.createdAt) > state.lastUpdate)
        }));
        
        state.items = action.payload.orders;
        state.totalOrders = action.payload.count;
        state.lastUpdate = new Date();

        // Calculate status counts
        const statusCounts = {
          pending: 0,
          processing: 0,
          shipped: 0,
          delivered: 0,
          cancelled: 0
        };

        action.payload.orders.forEach(order => {
          if (order.status && statusCounts.hasOwnProperty(order.status)) {
            statusCounts[order.status]++;
          }
        });

        state.stats = {
          ...state.stats,
          total: action.payload.count,
          statusCounts
        };

        state.pagination.totalPages = Math.ceil(action.payload.count / state.pagination.limit);
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Order by ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Order Status - Optimistic Update
      .addCase(updateOrderStatus.pending, (state, action) => {
        const { id, status, paymentStatus } = action.meta.arg;
        const orderIndex = state.items.findIndex(order => order._id === id);
        if (orderIndex !== -1) {
          const oldStatus = state.items[orderIndex].status;
          // Update status counts
          state.stats.statusCounts[oldStatus]--;
          state.stats.statusCounts[status]++;
          // Update order status
          state.items[orderIndex].status = status|| state.items[orderIndex].status;
          state.items[orderIndex].paymentStatus= paymentStatus || state.items[orderIndex].paymentStatus;
        }
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        // The optimistic update is already done, just clear any error
        state.error = null;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        // Revert the optimistic update
        state.error = action.payload;
        // Re-fetch orders to ensure consistency
        fetchOrders();
      })
      // Delete Order - Optimistic Update
      .addCase(deleteOrder.pending, (state, action) => {
        const id = action.meta.arg;
        const orderIndex = state.items.findIndex(order => order._id === id);
        if (orderIndex !== -1) {
          const order = state.items[orderIndex];
          // Update status counts
          state.stats.statusCounts[order.status]--;
          // Remove order
          state.items.splice(orderIndex, 1);
          state.totalOrders--;
        }
      })
      .addCase(deleteOrder.fulfilled, (state) => {
        // The optimistic update is already done, just clear any error
        state.error = null;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        // Revert the optimistic update by re-fetching
        state.error = action.payload;
        fetchOrders();
      });
  },
});

export const {
  setSelectedOrder,
  clearError,
  setFilters,
  setPagination,
  clearSelectedOrder,
  markOrderAsRead,
} = ordersSlice.actions;

export default ordersSlice.reducer; 