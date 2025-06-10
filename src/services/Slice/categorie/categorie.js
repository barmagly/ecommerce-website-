import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_KEY = "https://ecommerce-website-backend-nine.vercel.app" + "/api/categories";

export const getCategoriesThunk = createAsyncThunk(
    "categorie/getCategories",
    async (_, thunkAPI) => {
        try {
            const { data } = await axios.get(`${API_KEY}`);
            // console.log("data in slice", data);
            return {
                status: data.status,
                categories: data.categories,
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data || "error server");
        }
    }
);

const categorieSlice = createSlice({
    name: "categorie",
    initialState: {
        categories: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCategoriesThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCategoriesThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload.categories;
            })
            .addCase(getCategoriesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "getCategories failed";
            })
    }
});

export default categorieSlice;
