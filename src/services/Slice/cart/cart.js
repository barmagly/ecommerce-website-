import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL + "/api";
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
            // console.log("data in slice", data);
            const productsRequests = data[0].cartItems.map((item) =>
                axios.get(`${API_URL}/products/${item.prdID}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }).then(res => res.data)
            );

            const products = await Promise.all(productsRequests);

            data[0].cartItems.forEach(item => {
                const product = products.find(product => product._id === item.prdID);
                if (product) {
                    product.quantity = item.quantity;
                }
            });
            return { ...data[0], cartItems: products };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data || "error server");
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
    const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    return total;
}

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
        },
        decreaseQ(state, action) {
            const item = state.products.cartItems.find(item => item._id === action.payload)
            item.quantity -= 1
            authFetch(`${API_URL}/cart/cartOP`, {
                method: "PATCH",
                body: JSON.stringify({
                    prdID: item._id,
                    quantity: -1,
                }),
            });
            state.products.total = calculateTotal(state.products.cartItems);
        },
        increaseQ(state, action) {
            const item = state.products.cartItems.find(item => item._id === action.payload)
            item.quantity += 1
            authFetch(`${API_URL}/cart/cartOP`, {
                method: "PATCH",
                body: JSON.stringify({
                    prdID: item._id,
                    quantity: 1,
                }),
            });
            state.products.total = calculateTotal(state.products.cartItems);
        },
        deleteItem(state, action) {
            console.log("len: ", state.products.cartItems.length);

            if (state.products.cartItems.length > 1) {
                const item = state.products.cartItems.find(item => item._id === action.payload)
                authFetch(
                    `${API_URL}/cart/cartOP`,
                    {
                        method: "PATCH",
                        body: JSON.stringify({ prdID: item._id, quantity: 0 }),
                    }
                );
                state.products.cartItems = state.products.cartItems.filter(item => item._id !== action.payload)
                state.products.total = calculateTotal(state.products.cartItems);
            }
            else {
                authFetch(`${API_URL}/cart/${state.products._id}`, {
                    method: "DELETE",
                });
                state.products = [];
            }
        },
        deleteAllCart(state, action) {
            authFetch(`${API_URL}/cart/${state.products._id}`, {
                method: "DELETE",
            });
            state.items = [];
        },
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
            // .addCase(addToCartThunk.fulfilled, (state, action) => {
            //     state.loading = false;
            //     console.log(state.products);

            //     const existingProduct = state.products.find(p => p.product._id === action.payload.product._id);
            //     if (existingProduct) {
            //         existingProduct.quantity += 1;
            //     } else {
            //         state.products.push({ product: action.payload.product, quantity: 1 });
            //     }
            // })
            .addCase(addToCartThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to add product to cart";
            });
    }
});

export const { clearCartError, decreaseQ, deleteAllCart, deleteItem, increaseQ } = cartSlice.actions;
export default cartSlice;
