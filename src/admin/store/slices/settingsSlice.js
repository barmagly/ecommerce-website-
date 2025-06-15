import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { settingsAPI } from '../../services/api';

// Async thunks
export const fetchSettings = createAsyncThunk(
    'settings/fetchSettings',
    async (_, { rejectWithValue }) => {
        try {
            const response = await settingsAPI.getSettings();
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error fetching settings');
        }
    }
);

export const updateSettings = createAsyncThunk(
    'settings/updateSettings',
    async (settings, { rejectWithValue }) => {
        try {
            const response = await settingsAPI.updateSettings(settings);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error updating settings');
        }
    }
);

export const resetSettings = createAsyncThunk(
    'settings/resetSettings',
    async (_, { rejectWithValue }) => {
        try {
            const response = await settingsAPI.resetSettings();
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error resetting settings');
        }
    }
);

const initialState = {
    settings: null,
    loading: false,
    error: null,
    isDirty: false
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setDirty: (state, action) => {
            state.isDirty = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch settings
            .addCase(fetchSettings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSettings.fulfilled, (state, action) => {
                state.loading = false;
                state.settings = action.payload;
                state.isDirty = false;
            })
            .addCase(fetchSettings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update settings
            .addCase(updateSettings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSettings.fulfilled, (state, action) => {
                state.loading = false;
                state.settings = action.payload;
                state.isDirty = false;
            })
            .addCase(updateSettings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Reset settings
            .addCase(resetSettings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetSettings.fulfilled, (state, action) => {
                state.loading = false;
                state.settings = action.payload;
                state.isDirty = false;
            })
            .addCase(resetSettings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setDirty, clearError } = settingsSlice.actions;
export default settingsSlice.reducer; 