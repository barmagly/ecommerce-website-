import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://ecommerce-website-backend-nine.vercel.app/api/reviews";

// Get product reviews
export const getProductReviewsThunk = createAsyncThunk(
    "reviews/getProductReviews",
    async (productId, thunkAPI) => {
        try {
            const { data } = await axios.get(`${API_URL}/product/${productId}`);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to retrieve product reviews"
            );
        }
    }
);

// Create review
export const createReviewThunk = createAsyncThunk(
    "reviews/createReview",
    async ({ productId, rating, comment }, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found");

            // First check if user has purchased the product
            const { data: purchaseCheck } = await axios.get(
                `${API_URL}/check-purchase/${productId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!purchaseCheck.hasPurchased) {
                throw new Error("يمكنك فقط اضافة تقييم للمنتجات التي اشتريتها");
            }

            const { data } = await axios.post(
                API_URL,
                { productId, rating, comment },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message || "Failed to create review"
            );
        }
    }
);

// Update review
export const updateReviewThunk = createAsyncThunk(
    "reviews/updateReview",
    async ({ reviewId, rating, comment }, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found");

            const { data } = await axios.patch(
                `${API_URL}/${reviewId}`,
                { rating, comment },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to update review"
            );
        }
    }
);

// Delete review
export const deleteReviewThunk = createAsyncThunk(
    "reviews/deleteReview",
    async (reviewId, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found");

            await axios.delete(`${API_URL}/${reviewId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return reviewId;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to delete review"
            );
        }
    }
);

const reviewSlice = createSlice({
    name: "reviews",
    initialState: {
        reviews: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearReviews: (state) => {
            state.reviews = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get Product Reviews
            .addCase(getProductReviewsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProductReviewsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload.reviews;
            })
            .addCase(getProductReviewsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create Review
            .addCase(createReviewThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createReviewThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews.unshift(action.payload.populatedReview);
            })
            .addCase(createReviewThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Review
            .addCase(updateReviewThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateReviewThunk.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.reviews.findIndex(
                    (review) => review._id === action.payload.review._id
                );
                if (index !== -1) {
                    state.reviews[index] = action.payload.review;
                }
            })
            .addCase(updateReviewThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete Review
            .addCase(deleteReviewThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteReviewThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = state.reviews.filter(
                    (review) => review._id !== action.payload
                );
            })
            .addCase(deleteReviewThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearReviews } = reviewSlice.actions;
export default reviewSlice;
