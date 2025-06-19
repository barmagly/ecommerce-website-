import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL +'/api/orders';

export const getOrdersThunk = createAsyncThunk(
    "order/getOrders",
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return {
                status: data.status,
                orders: data.orders,
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || { message: "Server error" });
        }
    }
);

export const createOrderThunk = createAsyncThunk(
    "order/createOrder",
    async (formData, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            
            // طباعة محتويات FormData للتحقق
            console.log('FormData in createOrderThunk:');
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            // التأكد من تحويل قيم الشحن إلى أرقام
            const shippingCost = formData.get('shippingCost');
            const deliveryDays = formData.get('deliveryDays');
            
            console.log('=== ORDER SLICE - SHIPPING VALUES ===');
            console.log('Original shippingCost from FormData:', shippingCost, 'Type:', typeof shippingCost);
            console.log('Original deliveryDays from FormData:', deliveryDays, 'Type:', typeof deliveryDays);
            
            if (shippingCost !== null) {
                formData.set('shippingCost', Number(shippingCost));
                console.log('Converted shippingCost:', Number(shippingCost));
            }
            
            if (deliveryDays !== null) {
                formData.set('deliveryDays', Number(deliveryDays));
                console.log('Converted deliveryDays:', Number(deliveryDays));
            }
            console.log('=====================================');

            const { data } = await axios.post(`${API_URL}/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            
            console.log('Server response:', data);
            console.log('=== SERVER RESPONSE - SHIPPING VALUES ===');
            console.log('Server shippingCost:', data.order?.shippingCost, 'Type:', typeof data.order?.shippingCost);
            console.log('Server deliveryDays:', data.order?.deliveryDays, 'Type:', typeof data.order?.deliveryDays);
            console.log('==========================================');
            
            return {
                status: data.status,
                order: {
                    ...data.order,
                    shippingCost: Number(data.order.shippingCost),
                    deliveryDays: Number(data.order.deliveryDays)
                },
            };
        } catch (error) {
            console.error('Error in createOrderThunk:', error);
            const errorMessage = error.response?.data?.message || error.message || "Server error";
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

export const updateOrderStatusThunk = createAsyncThunk(
    "order/updateStatus",
    async ({ orderId, status }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.patch(`${API_URL}/status/${orderId}`, { status }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.order; // إرجاع الطلب المحدث فقط
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "حدث خطأ أثناء تحديث حالة الطلب";
            return rejectWithValue(errorMessage);
        }
    }
);

export const updateOrderShippingDetailsThunk = createAsyncThunk(
    "order/updateShippingDetails",
    async ({ orderId, shippingCost, deliveryDays }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.put(
                `${API_URL}/${orderId}/shipping`,
                { shippingCost, deliveryDays },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return data.order;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Server error";
            return rejectWithValue(errorMessage);
        }
    }
);

export const sendOrderConfirmationEmailThunk = createAsyncThunk(
    "order/sendConfirmationEmail",
    async ({ orderId, email, isAdminCopy = false }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.post(
                `${API_URL}/${orderId}/send-confirmation-email`,
                { email, isAdminCopy },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Server error";
            return rejectWithValue(errorMessage);
        }
    }
);

export const cancelOrderThunk = createAsyncThunk(
    "order/cancelOrder",
    async (orderId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.patch(`${API_URL}/${orderId}/cancel`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.order.status === 'cancelled') {
                return response.data.order;
            }
            if (response.data.order.status !== 'pending') {
                return rejectWithValue(response.data.order);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "حدث خطأ أثناء إلغاء الطلب";
            return rejectWithValue(errorMessage);
        }
    }
);

// Slice
const orderSlice = createSlice({
    name: "order",
    initialState: {
        orders: [],
        loading: false,
        error: null,
        success: false,
        isUpdating: false,
    },
    reducers: {
        resetOrderStatus: (state) => {
            state.success = false;
            state.error = null;
        },
        updateOrderStatusLocally: (state, action) => {
            const { orderId, status } = action.payload;
            const orderIndex = state.orders.findIndex(order => order._id === orderId);
            if (orderIndex !== -1) {
                state.orders[orderIndex].status = status;
                state.orders[orderIndex].isLocalUpdate = true;
                state.orders[orderIndex].localUpdateTime = new Date().toISOString();
                
                // حفظ التحديثات في localStorage
                try {
                    const localOrders = JSON.parse(localStorage.getItem('localOrderUpdates') || '{}');
                    localOrders[orderId] = { 
                        status, 
                        updatedAt: new Date().toISOString(),
                        originalStatus: state.orders[orderIndex].status || 'pending'
                    };
                    localStorage.setItem('localOrderUpdates', JSON.stringify(localOrders));
                } catch (error) {
                    console.error('Error saving to localStorage:', error);
                }
            }
        },
        loadLocalUpdates: (state) => {
            try {
                const localOrders = JSON.parse(localStorage.getItem('localOrderUpdates') || '{}');
                Object.keys(localOrders).forEach(orderId => {
                    const orderIndex = state.orders.findIndex(order => order._id === orderId);
                    if (orderIndex !== -1) {
                        state.orders[orderIndex].status = localOrders[orderId].status;
                    }
                });
            } catch (error) {
                console.error('Error loading local updates:', error);
            }
        },
        removeOrderLocally: (state, action) => {
            const orderId = action.payload;
            state.orders = state.orders.filter(order => order._id !== orderId);
        },
        cleanupOldLocalUpdates: (state) => {
            try {
                const localOrders = JSON.parse(localStorage.getItem('localOrderUpdates') || '{}');
                const now = new Date();
                const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000)); // يوم واحد
                
                Object.keys(localOrders).forEach(orderId => {
                    const updateTime = new Date(localOrders[orderId].updatedAt);
                    if (updateTime < oneDayAgo) {
                        delete localOrders[orderId];
                    }
                });
                
                localStorage.setItem('localOrderUpdates', JSON.stringify(localOrders));
            } catch (error) {
                console.error('Error cleaning up old local updates:', error);
            }
        },
        cleanupOldDeletedOrders: (state) => {
            try {
                const deletedOrders = JSON.parse(localStorage.getItem('deletedOrders') || '[]');
                const now = new Date();
                const oneWeekAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)); // أسبوع واحد
                
                const filteredDeletedOrders = deletedOrders.filter(item => {
                    const deletedTime = new Date(item.deletedAt);
                    return deletedTime > oneWeekAgo;
                });
                
                localStorage.setItem('deletedOrders', JSON.stringify(filteredDeletedOrders));
            } catch (error) {
                console.error('Error cleaning up old deleted orders:', error);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // getOrdersThunk
            .addCase(getOrdersThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrdersThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.orders;
                
                // تصفية الطلبات المحذوفة
                try {
                    const deletedOrders = JSON.parse(localStorage.getItem('deletedOrders') || '[]');
                    const deletedOrderIds = deletedOrders.map(item => item.orderId);
                    state.orders = state.orders.filter(order => !deletedOrderIds.includes(order._id));
                } catch (error) {
                    console.error('Error filtering deleted orders:', error);
                }
                
                // تطبيق التحديثات المحلية على البيانات القادمة من الخادم
                try {
                    const localOrders = JSON.parse(localStorage.getItem('localOrderUpdates') || '{}');
                    Object.keys(localOrders).forEach(orderId => {
                        const orderIndex = state.orders.findIndex(order => order._id === orderId);
                        if (orderIndex !== -1) {
                            // تحديث حالة الطلب
                            state.orders[orderIndex].status = localOrders[orderId].status;
                            // إضافة علامة أن هذا تحديث محلي
                            state.orders[orderIndex].isLocalUpdate = true;
                            state.orders[orderIndex].localUpdateTime = localOrders[orderId].updatedAt;
                        }
                    });
                } catch (error) {
                    console.error('Error applying local updates:', error);
                }
            })
            .addCase(getOrdersThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = typeof action.payload === 'string' ? action.payload : "فشل جلب الطلبات";
            })

            // createOrderThunk
            .addCase(createOrderThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createOrderThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.orders.push({
                    ...action.payload.order,
                    shippingCost: Number(action.payload.order.shippingCost),
                    deliveryDays: Number(action.payload.order.deliveryDays)
                });
                state.success = true;
            })
            .addCase(createOrderThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = typeof action.payload === 'string' ? action.payload : "فشل إنشاء الطلب";
                state.success = false;
            })

            // Update Order Status
            .addCase(updateOrderStatusThunk.pending, (state) => {
                state.isUpdating = true;
                state.error = null;
            })
            .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
                state.isUpdating = false;
                // تحديث حالة الطلب في القائمة المحلية
                const index = state.orders.findIndex(order => order._id === action.payload._id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
            })
            .addCase(updateOrderStatusThunk.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = typeof action.payload === 'string' ? action.payload : 'حدث خطأ أثناء تحديث حالة الطلب';
            })

            // Update Order Shipping Details
            .addCase(updateOrderShippingDetailsThunk.pending, (state) => {
                state.isUpdating = true;
                state.error = null;
            })
            .addCase(updateOrderShippingDetailsThunk.fulfilled, (state, action) => {
                state.isUpdating = false;
                const index = state.orders.findIndex(order => order._id === action.payload._id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
            })
            .addCase(updateOrderShippingDetailsThunk.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = typeof action.payload === 'string' ? action.payload : "فشل تحديث تفاصيل الشحن";
            })

            // Send Order Confirmation Email
            .addCase(sendOrderConfirmationEmailThunk.pending, (state) => {
                state.isUpdating = true;
                state.error = null;
            })
            .addCase(sendOrderConfirmationEmailThunk.fulfilled, (state, action) => {
                state.isUpdating = false;
                state.success = true;
            })
            .addCase(sendOrderConfirmationEmailThunk.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = typeof action.payload === 'string' ? action.payload : "فشل إرسال البريد الإلكتروني";
            })

            // Cancel Order
            .addCase(cancelOrderThunk.pending, (state) => {
                state.isUpdating = true;
                state.error = null;
            })
            .addCase(cancelOrderThunk.fulfilled, (state, action) => {
                state.isUpdating = false;
                const index = state.orders.findIndex(order => order._id === action.payload._id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
            })
            .addCase(cancelOrderThunk.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = typeof action.payload === 'string' ? action.payload : "فشل إلغاء الطلب";
            })
    },
});

export const { resetOrderStatus, updateOrderStatusLocally, loadLocalUpdates, removeOrderLocally, cleanupOldLocalUpdates, cleanupOldDeletedOrders } = orderSlice.actions;
export default orderSlice.reducer;
