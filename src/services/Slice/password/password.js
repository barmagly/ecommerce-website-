import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const API_KEY = "https://ecommerce-website-backend-nine.vercel.app/api/auth";

// Async thunk for forgot password
export const forgotPasswordThunk = createAsyncThunk(
    'password/forgot',
    async (email, { rejectWithValue }) => {
        try {
            console.log(email)
            const response = await axios.post(`${API_KEY}/forgot-password`, {
                email
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'حدث خطأ أثناء إرسال طلب إعادة تعيين كلمة المرور');
        }
    }
);

// Async thunk for reset password
export const resetPasswordThunk = createAsyncThunk(
    'password/reset',
    async ({ token, password }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_KEY}/reset-password/${token}`, {
                password
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'حدث خطأ أثناء إعادة تعيين كلمة المرور');
        }
    }
);

const initialState = {
    loading: false,
    error: null,
    success: false,
    message: null
};

const passwordSlice = createSlice({
    name: 'password',
    initialState,
    reducers: {
        clearPasswordState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
            state.message = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Forgot Password
            .addCase(forgotPasswordThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
                state.message = null;
            })
            .addCase(forgotPasswordThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message;
            })
            .addCase(forgotPasswordThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Reset Password
            .addCase(resetPasswordThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
                state.message = null;
            })
            .addCase(resetPasswordThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message;
            })
            .addCase(resetPasswordThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearPasswordState } = passwordSlice.actions;
export default passwordSlice.reducer;
