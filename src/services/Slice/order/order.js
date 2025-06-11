import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_KEY = `${import.meta.env.VITE_API_URL}/api/orders`;

export const getOrdersThunk = createAsyncThunk(
    "order/getOrders",
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(API_KEY, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return {
                status: data.status,
                orders: data.orders,
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || { message: "Server error" });
        }
    }
);

export const createOrderThunk = createAsyncThunk(
    "order/createOrder",
    async (formData, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.post(`${API_KEY}/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            return {
                status: data.status,
                order: data.order,
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || { message: "Server error" });
        }
    }
);

// Slice
const orderSlice = createSlice({
    name: "order",
    initialState: {
        orders: [],
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        resetOrderStatus: (state) => {
            state.success = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // getOrdersThunk
            .addCase(getOrdersThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrdersThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.orders;
            })
            .addCase(getOrdersThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "فشل جلب الطلبات";
            })

            // createOrderThunk
            .addCase(createOrderThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createOrderThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.orders.push(action.payload.order);
                state.success = true;
            })
            .addCase(createOrderThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "فشل إنشاء الطلب";
                state.success = false;
            });
    },
});

export const { resetOrderStatus } = orderSlice.actions;
export default orderSlice;
