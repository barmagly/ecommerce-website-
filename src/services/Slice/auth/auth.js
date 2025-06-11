import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_KEY = import.meta.env.VITE_API_URL + "/api/auth";

export const googleLoginThunk = createAsyncThunk(
    "auth/googleLogin",
    async ({ idToken, email, name }, thunkAPI) => {
        try {
            const { data } = await axios.post(`${API_KEY}/google-login`,
                { idToken, email, name },
            );
            return {
                status: data.status,
                user: data.data?.user || data.user,
                token: data.data?.token || data.token,
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data || "error server");
        }
    }
);
export const loginThunk = createAsyncThunk(
    "auth/login",
    async ({ email, password }, thunkAPI) => {
        try {
            const { data } = await axios.post(`${API_KEY}/login`, { email, password });
            return {
                status: data.status,
                user: data.data?.user || data.user,
                token: data.data?.token || data.token,
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data || "error server");
        }
    }
);
export const registerThunk = createAsyncThunk(
    "auth/register",
    async ({ name, address, phone, email, password }, thunkAPI) => {
        try {
            const { data } = await axios.post(`${API_KEY}/register`, { name, address, phone, email, password });
            return {
                status: data.status,
                user: data.data?.user || data.user,
                token: data.data?.token || data.token,
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data || "error server");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        token: localStorage.getItem("token") || null,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("token");
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(googleLoginThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(googleLoginThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem("token", action.payload.token);
            })
            .addCase(googleLoginThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Login failed";
            })
            .addCase(loginThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem("token", action.payload.token);
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Login failed";
            }).addCase(registerThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem("token", action.payload.token);
            }).addCase(registerThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Register failed";
            })
    }
});

export const { logout } = authSlice.actions;
export default authSlice;
