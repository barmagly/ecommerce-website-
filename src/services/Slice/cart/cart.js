import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL +'/api';

export const getCartThunk = createAsyncThunk(
    "product/getCart",
    async (_, thunkAPI) => {
        console.log('🔄 getCartThunk started');
        try {
            const token = localStorage.getItem("token");
            console.log('🔑 Token available for getCart:', !!token);
            const { data } = await axios.get(`${API_URL}/cart/showMyCart?ts=${Date.now()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            console.log('📥 getCartThunk response:', data);
            const result = data[0] || { cartItems: [], total: 0 };
            console.log('🎯 getCartThunk returning:', result);
            return result;
        } catch (error) {
            console.error('💥 getCartThunk error:', error);
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

// NEW: Async thunk for deleting a cart item
export const deleteCartItemThunk = createAsyncThunk(
    "product/deleteCartItem",
    async ({ prdID, variantId }, thunkAPI) => {
        console.log('🚀 deleteCartItemThunk started with:', { prdID, variantId });
        try {
            const token = localStorage.getItem("token");
            console.log('🔑 Token available:', !!token);
            
            const requestBody = { 
                prdID, 
                quantity: 0  // Set quantity to 0 to delete the item
            };
            if (variantId) requestBody.variantId = variantId;
            
            console.log('📤 Sending request body:', requestBody);
            console.log('🌐 API URL:', `${API_URL}/cart/cartOP`);
            
            const { data } = await axios.patch(
                `${API_URL}/cart/cartOP`,
                requestBody,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );
            
            console.log('📥 API response:', data);
            return { prdID, variantId, deleted: true };
        } catch (error) {
            console.error('💥 deleteCartItemThunk error:', error);
            console.error('💥 Error response:', error.response?.data);
            console.error('💥 Error status:', error.response?.status);
            return thunkAPI.rejectWithValue(error.response?.data || "error server");
        }
    }
);

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
                const requestBody = {
                    prdID: item.prdID?._id,
                    quantity: -1,
                };
                // Only add variantId if it exists
                if (item.variantId?._id) {
                    requestBody.variantId = item.variantId._id;
                }
                // Use axios instead of fetch for consistency
                const token = localStorage.getItem("token");
                axios.patch(`${API_URL}/cart/cartOP`, requestBody, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                }).catch(error => {
                    console.error('Error updating cart quantity:', error);
                    // Revert the quantity change if the API call fails
                    item.quantity += 1;
                    state.products.total = calculateTotal(state.products.cartItems);
                });
                state.products.total = calculateTotal(state.products.cartItems);
            }
        },
        increaseQ(state, action) {
            const item = state.products.cartItems.find(item => item.variantId?._id === action.payload.variantId && item.prdID?._id === action.payload.prdID)
            if (item) {
                item.quantity += 1
                const requestBody = {
                    prdID: item.prdID?._id,
                    quantity: 1,
                };
                // Only add variantId if it exists
                if (item.variantId?._id) {
                    requestBody.variantId = item.variantId._id;
                }
                // Use axios instead of fetch for consistency
                const token = localStorage.getItem("token");
                axios.patch(`${API_URL}/cart/cartOP`, requestBody, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                }).catch(error => {
                    console.error('Error updating cart quantity:', error);
                    // Revert the quantity change if the API call fails
                    item.quantity -= 1;
                    state.products.total = calculateTotal(state.products.cartItems);
                });
                state.products.total = calculateTotal(state.products.cartItems);
            }
        },
        // Synchronous: just remove from state
        deleteItem(state, action) {
            state.products.cartItems = state.products.cartItems.filter(item => item.variantId?._id !== action.payload.variantId || item.prdID?._id !== action.payload.prdID)
            state.products.total = calculateTotal(state.products.cartItems);
        },
        deleteAllCart(state, action) {
            const token = localStorage.getItem("token");
            axios.delete(`${API_URL}/cart/${state.products._id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }).catch(error => {
                console.error('Error clearing cart:', error);
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
                // Filter out cart items with missing or null prdID
                if (action.payload && action.payload.cartItems) {
                    const filteredCartItems = action.payload.cartItems.filter(item => item.prdID && typeof item.prdID === 'object');
                    if (filteredCartItems.length < action.payload.cartItems.length && typeof window !== 'undefined' && window.toast) {
                        window.toast.info('تم حذف بعض المنتجات من السلة لأنها لم تعد متوفرة');
                    }
                    state.products = {
                        ...action.payload,
                        cartItems: filteredCartItems
                    };
                } else {
                    state.products = action.payload;
                }
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
            })
            // Handle deleteCartItemThunk
            .addCase(deleteCartItemThunk.fulfilled, (state, action) => {
                console.log('🎯 deleteCartItemThunk.fulfilled - removing item from state:', action.payload);
                // Remove the item from cart state
                const { prdID, variantId } = action.payload;
                const beforeCount = state.products.cartItems.length;
                state.products.cartItems = state.products.cartItems.filter(item => item.prdID?._id !== prdID || item.variantId?._id !== variantId);
                const afterCount = state.products.cartItems.length;
                console.log(`📊 Cart items: ${beforeCount} → ${afterCount}`);
                state.products.total = calculateTotal(state.products.cartItems);
                console.log('💰 New total:', state.products.total);
                if (typeof window !== 'undefined' && window.toast) {
                    window.toast.info('تم حذف المنتج من السلة');
                }
            });
    }
});

export const { clearCartError, decreaseQ, deleteAllCart, deleteItem, increaseQ } = cartSlice.actions;
export default cartSlice;
