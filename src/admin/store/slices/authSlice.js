import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';

// Helper function to format error
const formatError = (error) => {
  if (typeof error === 'string') return error;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return 'An error occurred';
};

// Fetch admin profile
export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Attempting to fetch admin profile...');
      const response = await authAPI.getProfile();
      console.log('Full API response for fetchProfile:', JSON.stringify(response.data, null, 2));
      const user = response.data.data;
      if (!user) {
        console.error('User data not found in fetchProfile response:', response.data);
        throw new Error('User data not found in profile response');
      }
      return user;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return rejectWithValue(formatError(error));
    }
  }
);

// Login admin
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('Attempting login with credentials:', { ...credentials, password: '[REDACTED]' });
      const response = await authAPI.login(credentials);
      console.log('Login response:', response.data);
      
      if (!response.data.data.user) {
        console.error('No user data in response');
        return rejectWithValue('Invalid response from server');
      }

      if (response.data.data.user.role !== "admin") {
        console.error('User is not an admin:', response.data.data.user.role);
        return rejectWithValue('Only admin users can access this area');
      }

      if (!response.data.data.token) {
        console.error('No token in response');
        return rejectWithValue('No authentication token received');
      }

      console.log('Login successful, storing token');
      return response.data.data;
    } catch (error) {
      console.error('Login error:', error);
      return rejectWithValue(formatError(error));
    }
  }
);

// Logout admin
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
      return null;
    } catch (error) {
      return rejectWithValue(formatError(error));
    }
  }
);

// Update admin profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      // Safely access the user object, assuming it could be in .data.data.user or .data.user
      const user = response.data.data?.user || response.data.user;
      if (!user) {
        throw new Error('User data not found in response after profile update');
      }
      return user;
    } catch (error) {
      return rejectWithValue(formatError(error));
    }
  }
);

export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      console.log('Updating password:', { ...passwordData, newPassword: '[REDACTED]' });
      const response = await authAPI.updatePassword(passwordData);
      console.log('Password update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Password update error:', error);
      return rejectWithValue(formatError(error));
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('adminToken'),
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('adminToken'),
  updateLoading: false,
  updateError: null,
  profileLoading: false,
  profileError: null,
  passwordError: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.updateError = null;
      state.profileError = null;
      state.passwordError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        console.log('fetchProfile fulfilled. User state updated:', state.user);
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
        console.error('fetchProfile rejected. Error:', action.payload);
        if (action.payload?.status === 401) {
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
          localStorage.removeItem('adminToken');
        }
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem('adminToken');
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('adminToken');
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      })
      // Update Password
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.passwordError = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.loading = false;
        state.passwordError = null;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.passwordError = action.payload;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer; 