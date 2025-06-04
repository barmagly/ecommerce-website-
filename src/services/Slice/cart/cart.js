import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_KEY = import.meta.env.VITE_API_KEY || "https://ecommerce-website-backend-nine.vercel.app/api/cart";

export const getCartThunk = createAsyncThunk(
    "product/getCart",
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${API_KEY}/showMyCart`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            console.log("data in slice", data);
            return {
                status: data.status,
                products: data.products,
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data || "error server");
        }
    }
);

export const addToCartThunk = createAsyncThunk(
    "product/addToCart",
    async ({ productId, quantity = 1 }, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.post(
                `${API_KEY}/addToCart`,
                {
                    prdID: productId,
                    quantity
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            return {
                status: data.status,
                product: data.product
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data || "error server");
        }
    }
);

const cartSlice = createSlice({
    name: "product",
    initialState: {
        products: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearCartError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Cart
            .addCase(getCartThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCartThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products;
            })
            .addCase(getCartThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "getProducts failed";
            })
            // Add to Cart
            .addCase(addToCartThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCartThunk.fulfilled, (state, action) => {
                state.loading = false;
                const existingProduct = state.products.find(p => p.product._id === action.payload.product._id);
                if (existingProduct) {
                    existingProduct.quantity += 1;
                } else {
                    state.products.push({ product: action.payload.product, quantity: 1 });
                }
            })
            .addCase(addToCartThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to add product to cart";
            });
    }
});

export const { clearCartError } = cartSlice.actions;
export default cartSlice;
