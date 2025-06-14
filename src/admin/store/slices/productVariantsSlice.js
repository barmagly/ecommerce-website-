import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productsAPI } from '../../services/api';
import { toast } from 'react-toastify';

// Async thunks
export const fetchProductVariants = createAsyncThunk(
    'productVariants/fetchAll',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await productsAPI.getVariants(productId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch variants');
        }
    }
);

export const createProductVariant = createAsyncThunk(
    'productVariants/create',
    async ({ productId, variantData }, { rejectWithValue }) => {
        try {
            const response = await productsAPI.createVariant(productId, variantData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create variant');
        }
    }
);

export const updateProductVariant = createAsyncThunk(
    'productVariants/update',
    async ({ productId, variantId, variantData }, { rejectWithValue }) => {
        try {
            const response = await productsAPI.updateVariant(productId, variantId, variantData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update variant');
        }
    }
);

export const deleteProductVariant = createAsyncThunk(
    'productVariants/delete',
    async ({ productId, variantId }, { rejectWithValue }) => {
        try {
            await productsAPI.deleteVariant(productId, variantId);
            return variantId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete variant');
        }
    }
);

const initialState = {
    variants: [],
    loading: false,
    error: null,
    currentVariant: null,
};

const productVariantsSlice = createSlice({
    name: 'productVariants',
    initialState,
    reducers: {
        setCurrentVariant: (state, action) => {
            state.currentVariant = action.payload;
        },
        clearCurrentVariant: (state) => {
            state.currentVariant = null;
        },
        clearVariants: (state) => {
            state.variants = [];
            state.currentVariant = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch variants
            .addCase(fetchProductVariants.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductVariants.fulfilled, (state, action) => {
                state.loading = false;
                state.variants = action.payload;
            })
            .addCase(fetchProductVariants.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            // Create variant
            .addCase(createProductVariant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProductVariant.fulfilled, (state, action) => {
                state.loading = false;
                state.variants.push(action.payload);
                toast.success('Variant created successfully');
            })
            .addCase(createProductVariant.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            // Update variant
            .addCase(updateProductVariant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProductVariant.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.variants.findIndex(v => v._id === action.payload._id);
                if (index !== -1) {
                    state.variants[index] = action.payload;
                }
                toast.success('Variant updated successfully');
            })
            .addCase(updateProductVariant.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            // Delete variant
            .addCase(deleteProductVariant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProductVariant.fulfilled, (state, action) => {
                state.loading = false;
                state.variants = state.variants.filter(v => v._id !== action.payload);
                toast.success('Variant deleted successfully');
            })
            .addCase(deleteProductVariant.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            });
    },
});

export const {
    setCurrentVariant,
    clearCurrentVariant,
    clearVariants
} = productVariantsSlice.actions;

export default productVariantsSlice.reducer; 