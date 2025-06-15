import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = "http://localhost:5000/api";
export const getCartThunk = createAsyncThunk(
    "product/getCart",
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${API_URL}/cart/showMyCart`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            return data[0] || { cartItems: [], total: 0 };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "error server");
        }
    }
);

export const addToCartThunk = createAsyncThunk(
    "product/addToCart",
    async ({ productId, variantId = null, quantity = 1 }, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.patch(
                `${API_URL}/cart/cartOP`,
                {
                    prdID: productId,
                    variantId,
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

function authFetch(url, options = {}) {
    return fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            ...(options.headers || {})
        }
    });
}

function calculateTotal(cartItems) {
    const total = cartItems.reduce((acc, item) => acc + (item.variantId ? item.variantId.price : item.prdID.price) * item.quantity, 0);
    return total;
}

const cartSlice = createSlice({
    name: "product",
    initialState: {
        products: {
            cartItems: [],
            total: 0
        },
        loading: false,
        error: null,
    },
    reducers: {
        clearCartError: (state) => {
            state.error = null;
        },
        decreaseQ(state, action) {
            const item = state.products.cartItems.find(item => item.variantId?._id === action.payload.variantId && item.prdID?._id === action.payload.prdID)
            if (item) {
                item.quantity -= 1
                authFetch(`${API_URL}/cart/cartOP`, {
                    method: "PATCH",
                    body: JSON.stringify({
                        prdID: item.prdID?._id,
                        variantId: item.variantId?._id,
                        quantity: -1,
                    }),
                });
                state.products.total = calculateTotal(state.products.cartItems);
            }
        },
        increaseQ(state, action) {
            const item = state.products.cartItems.find(item => item.variantId?._id === action.payload.variantId && item.prdID?._id === action.payload.prdID)
            if (item) {
                item.quantity += 1
                authFetch(`${API_URL}/cart/cartOP`, {
                    method: "PATCH",
                    body: JSON.stringify({
                        prdID: item.prdID?._id,
                        variantId: item.variantId?._id,
                        quantity: 1,
                    }),
                });
                state.products.total = calculateTotal(state.products.cartItems);
            }
        },
        deleteItem(state, action) {
            if (state.products.cartItems.length > 1) {
                const item = state.products.cartItems.find(item => item.variantId?._id === action.payload.variantId && item.prdID?._id === action.payload.prdID)
                if (item) {
                    authFetch(
                        `${API_URL}/cart/cartOP`,
                        {
                            method: "PATCH",
                            body: JSON.stringify({ prdID: item.prdID?._id, variantId: item.variantId?._id, quantity: 0 }),
                        }
                    );
                    state.products.cartItems = state.products.cartItems.filter(item => item.variantId?._id !== action.payload.variantId || item.prdID?._id !== action.payload.prdID)
                    state.products.total = calculateTotal(state.products.cartItems);
                }
            }
            else {
                authFetch(`${API_URL}/cart/${state.products._id}`, {
                    method: "DELETE",
                });
                state.products = { cartItems: [], total: 0 };
            }
        },
        deleteAllCart(state, action) {
            authFetch(`${API_URL}/cart/${state.products._id}`, {
                method: "DELETE",
            });
            state.products = { cartItems: [], total: 0 };
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
                state.products = action.payload;
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
                // Refresh cart data after adding item
                if (action.payload.status === 'success') {
                    // The cart data will be updated when getCartThunk is called
                    return;
                }
            })
            .addCase(addToCartThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to add product to cart";
            });
    }
});

export const { clearCartError, decreaseQ, deleteAllCart, deleteItem, increaseQ } = cartSlice.actions;
export default cartSlice;
