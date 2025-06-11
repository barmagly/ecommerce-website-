import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// رابط الـ API الأساسي
const API_KEY = `${import.meta.env.VITE_API_URL}/api/products`;

// Thunk لجلب المتغيرات (variants) الخاصة بمنتج معين
export const getVariantsThunk = createAsyncThunk(
    "product/getVariants",
    async ({ prdId }, thunkAPI) => {
        try {
            const { data } = await axios.get(`${API_KEY}/${prdId}/variants`);
            return data.data.variants; // ✅ تأكدنا إنها هنا بناءً على الريسبونس الحقيقي
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || { message: "خطأ في جلب المتغيرات" });
        }
    }
);

// Slice الخاصة بالمنتج والمتغيرات
const variantSlice = createSlice({
    name: "product",
    initialState: {
        variants: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getVariantsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getVariantsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.variants = action.payload;
            })
            .addCase(getVariantsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "فشل في جلب المتغيرات";
            });
    },
});

export default variantSlice;
