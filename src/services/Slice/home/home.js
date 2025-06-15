import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { frontendAPI } from "../../api";

// get new products
export const getNewArrivalProductsThunk = createAsyncThunk(
    "homeProducts/getNewArrivalProducts",
    async (_, thunkAPI) => {
        try {
            const { data } = await frontendAPI.getNewArrivals();
            return data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to retrieve new products"
            );
        }
    }
);

const homeSlice = createSlice({
    name: "homes",
    initialState: {
        products: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            // get new products
            .addCase(getNewArrivalProductsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getNewArrivalProductsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;                                
            })
            .addCase(getNewArrivalProductsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export default homeSlice;
