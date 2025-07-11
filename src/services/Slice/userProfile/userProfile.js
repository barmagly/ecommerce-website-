import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL 
const API_KEY = `${API_URL}/api/auth`;

export const getUserProfileThunk = createAsyncThunk(
    "userProfile/getUserProfile",
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token found");
            }

            const { data } = await axios.get(`${API_KEY}/profile`, {
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

            const { data } = await axios.patch(`${API_KEY}/profile`, formData, {
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
                `${API_KEY}/password`,
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
                `${API_KEY}/address-book`,
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
                `${API_KEY}/address-book`,
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
                `${API_KEY}/address-book/${_id}`,
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
                `${API_KEY}/address-book/${_id}`,
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
                `${API_KEY}/payment-options`,
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
                `${API_KEY}/payment-options`,
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
                `${API_KEY}/payment-options/${_id}`,
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
                `${API_KEY}/payment-options/${_id}`,
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
                state.error = null;
                if (action.payload && action.payload.data) {
                    state.user = action.payload.data;
                    console.log("✅ Profile data saved to state:", state.user);
                } else if (action.payload) {
                    state.user = action.payload;
                    console.log("✅ Profile data saved directly to state:", state.user);
                } else {
                    console.warn("⚠️ No profile data received");
                    state.user = null;
                }
                
                if (state.user && state.user.profileImg) {
                    console.log("🖼️ Profile image found:", state.user.profileImg);
                } else {
                    console.log("⚠️ No profile image found");
                }
            })
            .addCase(getUserProfileThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "فشل في جلب بيانات الملف الشخصي";
                console.error("❌ Profile fetch failed:", state.error);
            })
            .addCase(updateUserProfileThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserProfileThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                if (action.payload && action.payload.data) {
                    state.user = action.payload.data;
                    console.log("✅ Profile updated successfully:", state.user);
                }
            })
            .addCase(updateUserProfileThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "فشل في تحديث الملف الشخصي";
                console.error("❌ Profile update failed:", state.error);
            });
    }
});

export default userProfileSlice.reducer;