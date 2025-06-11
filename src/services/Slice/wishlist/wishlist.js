import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/api/auth/wishlist";

export const getUserWishlistThunk = createAsyncThunk(
    "userWishlist/getUserWishlist",
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found");

            const { data } = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "فشل في جلب المفضلة"
            );
        }
    }
);
export const addUserWishlistThunk = createAsyncThunk(
    "userWishlist/addUserWishlist",
    async ({ prdId }, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found");

            const { data } = await axios.post(
                `${API_URL}/${prdId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "فشل في إضافة المنتج للمفضلة"
            );
        }
    }
);

export const removeWishlistThunk = createAsyncThunk(
    "userWishlist/removeUserWishlist",
    async ({ prdId }, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found");

            await axios.delete(`${API_URL}/${prdId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return { prdId };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "فشل في حذف المنتج من المفضلة"
            );
        }
    }
);

const userWishlistSlice = createSlice({
    name: "userWishlist",
    initialState: {
        wishlist: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserWishlistThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserWishlistThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.wishlist = action.payload.data;
            })
            .addCase(getUserWishlistThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(removeWishlistThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeWishlistThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.wishlist = state.wishlist.filter(
                    (item) => item._id !== action.payload.prdId
                );
            })
            .addCase(removeWishlistThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default userWishlistSlice;
