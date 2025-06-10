import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://ecommerce-website-backend-nine.vercel.app/api/auth";

export const getUserProfileThunk = createAsyncThunk(
    "userProfile/getUserProfile",
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token found");
            }

            const { data } = await axios.get(`${API_URL}/profile`, {
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
export const updateUserProfileThunk = createAsyncThunk(
    "userProfile/updateUserProfile",
    async (formData, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return thunkAPI.rejectWithValue({ message: "No token provided" });
            }

            const { data } = await axios.patch(`${API_URL}/profile`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || { message: "Server error" });
        }
    }
);
export const updateUserPasswordThunk = createAsyncThunk(
    "userProfile/updateUserPassword",
    async ({ currentPassword, newPassword }, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return thunkAPI.rejectWithValue({ message: "No token found" });
            }

            const { data } = await axios.patch(
                `${API_URL}/password`,
                {
                    currentPassword,
                    newPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return data;
        } catch (error) {
            console.error("Error updating password:", error);
            return thunkAPI.rejectWithValue(error.response?.data || { message: "Error updating password" });
        }
    }
);
export const addAddressToBookThunk = createAsyncThunk(
    "userProfile/addAddressToBook",
    async ({ label, details, city }, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return thunkAPI.rejectWithValue({ message: "No token found" });
            }

            const { data } = await axios.post(
                `${API_URL}/address-book`,
                {
                    label, details, city
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return data;
        } catch (error) {
            console.error("Error add address:", error);
            return thunkAPI.rejectWithValue(error.response?.data || { message: "Error add address" });
        }
    }
);
export const getAddressToBookThunk = createAsyncThunk(
    "userProfile/getAddressToBook",
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return thunkAPI.rejectWithValue({ message: "No token found" });
            }

            const { data } = await axios.get(
                `${API_URL}/address-book`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return data;
        } catch (error) {
            console.error("Error get address:", error);
            return thunkAPI.rejectWithValue(error.response?.data || { message: "Error add address" });
        }
    }
);
export const updateAddressToBookThunk = createAsyncThunk(
    "userProfile/updateAddressToBook",
    async ({ _id, label, details, city }, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return thunkAPI.rejectWithValue({ message: "No token found" });
            }

            const { data } = await axios.patch(
                `${API_URL}/address-book/${_id}`,
                {
                    label, details, city
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return data;
        } catch (error) {
            console.error("Error updating address:", error);
            return thunkAPI.rejectWithValue(error.response?.data || { message: "Error updating address" });
        }
    }
);
export const deleteAddressToBookThunk = createAsyncThunk(
    "userProfile/deleteAddressToBook",
    async ({ _id }, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return thunkAPI.rejectWithValue({ message: "No token found" });
            }

            const { data } = await axios.delete(
                `${API_URL}/address-book/${_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return data;
        } catch (error) {
            console.error("Error delete address:", error);
            return thunkAPI.rejectWithValue(error.response?.data || { message: "Error delete address" });
        }
    }
);
export const addPaymentOptionsThunk = createAsyncThunk(
    "userProfile/addPaymentOptions",
    async ({ cardType, cardNumber, cardholderName }, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return thunkAPI.rejectWithValue({ message: "No token found" });
            }

            const { data } = await axios.post(
                `${API_URL}/payment-options`,
                {
                    cardType, cardNumber, cardholderName
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return data;
        } catch (error) {
            console.error("Error add PaymentOptions:", error);
            return thunkAPI.rejectWithValue(error.response?.data || { message: "Error add PaymentOptions" });
        }
    }
);
export const getPaymentOptionsThunk = createAsyncThunk(
    "userProfile/getPaymentOptions",
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return thunkAPI.rejectWithValue({ message: "No token found" });
            }

            const { data } = await axios.get(
                `${API_URL}/payment-options`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return data;
        } catch (error) {
            console.error("Error get payment options:", error);
            return thunkAPI.rejectWithValue(error.response?.data || { message: "Error add payment options" });
        }
    }
);
export const updatePaymentOptionsThunk = createAsyncThunk(
    "userProfile/updatePaymentOptions",
    async ({ _id, cardType, cardNumber, cardholderName }, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return thunkAPI.rejectWithValue({ message: "No token found" });
            }

            const { data } = await axios.patch(
                `${API_URL}/payment-options/${_id}`,
                {
                    cardType, cardNumber, cardholderName
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return data;
        } catch (error) {
            console.error("Error updating address:", error);
            return thunkAPI.rejectWithValue(error.response?.data || { message: "Error updating address" });
        }
    }
);
export const deletePaymentOptionsThunk = createAsyncThunk(
    "userProfile/deletePaymentOptions",
    async ({ _id }, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return thunkAPI.rejectWithValue({ message: "No token found" });
            }

            const { data } = await axios.delete(
                `${API_URL}/payment-options/${_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return data;
        } catch (error) {
            console.error("Error delete payment options:", error);
            return thunkAPI.rejectWithValue(error.response?.data || { message: "Error delete payment options" });
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
