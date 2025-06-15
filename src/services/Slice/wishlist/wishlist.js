import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { frontendAPI } from "../../api";

export const getUserWishlistThunk = createAsyncThunk(
    "userWishlist/getUserWishlist",
    async (_, thunkAPI) => {
        try {
            const { data } = await frontendAPI.getWishlist();
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
    async (productId, thunkAPI) => {
        try {
            const { data } = await frontendAPI.addToWishlist(productId);
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
    async (productId, thunkAPI) => {
        try {
            await frontendAPI.removeFromWishlist(productId);
            return { productId };
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
            .addCase(addUserWishlistThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addUserWishlistThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.wishlist.push(action.payload.data);
            })
            .addCase(addUserWishlistThunk.rejected, (state, action) => {
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
                    (item) => item._id !== action.payload.productId
                );
            })
            .addCase(removeWishlistThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default userWishlistSlice;
