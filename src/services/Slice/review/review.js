import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/reviews";

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
            if (!token) {
                throw new Error("Authentication required. Please log in to submit a review.");
            }

            const { data } = await axios.post(
                API_URL,
                { productId, rating, comment },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                }
            );

            if (!data || data.status !== 'success') {
                throw new Error(data?.message || "Failed to create review");
            }

            return data;
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                const errorMessage = error.response.data?.message || error.response.data?.error || "Failed to create review";
                return thunkAPI.rejectWithValue(errorMessage);
            } else if (error.request) {
                // The request was made but no response was received
                return thunkAPI.rejectWithValue("No response from server. Please check your connection.");
            } else {
                // Something happened in setting up the request that triggered an Error
                return thunkAPI.rejectWithValue(error.message || "Failed to create review");
            }
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
            if (!token) {
                throw new Error("Authentication required. Please log in.");
            }

            const { data } = await axios.delete(`${API_URL}/${reviewId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            if (data.status === 'success') {
                return reviewId;
            } else {
                throw new Error(data.message || "Failed to delete review");
            }
        } catch (error) {
            // Handle different types of errors
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                const errorMessage = error.response.data?.message || error.response.data?.error || "Failed to delete review";
                return thunkAPI.rejectWithValue(errorMessage);
            } else if (error.request) {
                // The request was made but no response was received
                return thunkAPI.rejectWithValue("No response from server. Please check your connection.");
            } else {
                // Something happened in setting up the request that triggered an Error
                return thunkAPI.rejectWithValue(error.message || "Failed to delete review");
            }
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
                state.reviews = action.payload.reviews || [];
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
                if (action.payload.review) {
                    state.reviews.unshift(action.payload.review);
                }
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
                if (action.payload.review) {
                    const index = state.reviews.findIndex(
                        (review) => review._id === action.payload.review._id
                    );
                    if (index !== -1) {
                        state.reviews[index] = action.payload.review;
                    }
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
export default reviewSlice.reducer;
