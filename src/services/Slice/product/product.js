import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_KEY = process.env.REACT_APP_API_URL + "/api/products";

export const getProductsThunk = createAsyncThunk(
    "product/getProducts",
    async (_, thunkAPI) => {
        try {
            const { data } = await axios.get(`${API_KEY}`);
            
            return data.products;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "error server");
        }
    }
);

const productSlice = createSlice({
    name: "product",
    initialState: {
        products: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProductsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProductsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(getProductsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "getProducts failed";
            })
    }
});

export default productSlice;
