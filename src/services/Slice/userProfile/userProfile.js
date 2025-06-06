import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth/profile";

export const getUserProfileThunk = createAsyncThunk(
    "userProfile/getUserProfile",
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token found");
            }

            const { data } = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // console.log("Profile data received:", data);
            return data;
        } catch (error) {
            console.error("Error fetching profile:", error);
            return thunkAPI.rejectWithValue(error.response?.data || "Error fetching profile");
        }
    }
);

const userProfileSlice = createSlice({
    name: "userProfile",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserProfileThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserProfileThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.data;
                // console.log("Profile state updated:", state.user);
            })
            .addCase(getUserProfileThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to fetch profile";
                // console.error("Profile fetch failed:", state.error);
            });
    }
});

export default userProfileSlice.reducer;
