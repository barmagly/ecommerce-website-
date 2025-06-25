import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL + "/api/products";

export const getProductsThunk = createAsyncThunk(
    "product/getProducts",
    async (_, thunkAPI) => {
        try {
            const { data } = await axios.get(`${API_URL}`);
            return data.products;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "error server");
        }
    }
);

export const searchProductsThunk = createAsyncThunk(
    "product/searchProducts",
    async (keyword, thunkAPI) => {
        try {
            const { data } = await axios.get(`${API_URL}/filter?search=${keyword}`);
            return data.data || [];
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Search failed");
        }
    }
);

export const getDiscountedProductsThunk = createAsyncThunk(
    "product/getDiscountedProducts",
    async ({ page = 1, limit = 5 } = {}, thunkAPI) => {
        try {
            const { data } = await axios.get(`${API_URL}?discounted=true&page=${page}&limit=${limit}`);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to retrieve discounted products");
        }
    }
);

const productSlice = createSlice({
    name: "product",
    initialState: {
        products: [],
        searchResults: [],
        loading: false,
        searchLoading: false,
        error: null,
        total: 0,
        page: 1,
        pages: 1,
    },
    reducers: {
        clearSearchResults: (state) => {
            state.searchResults = [];
        }
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
            // Reducers for discounted products
            .addCase(getDiscountedProductsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDiscountedProductsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products;
                state.total = action.payload.total;
                state.page = action.payload.page;
                state.pages = action.payload.pages;
            })
            .addCase(getDiscountedProductsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Search products reducers
            .addCase(searchProductsThunk.pending, (state) => {
                state.searchLoading = true;
            })
            .addCase(searchProductsThunk.fulfilled, (state, action) => {
                state.searchLoading = false;
                state.searchResults = action.payload;
            })
            .addCase(searchProductsThunk.rejected, (state, action) => {
                state.searchLoading = false;
                state.error = action.payload;
            });
    }
});

export const { clearSearchResults } = productSlice.actions;
export default productSlice;
