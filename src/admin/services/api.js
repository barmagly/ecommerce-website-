import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to add auth token and handle content type
api.interceptors.request.use((config) => {
    console.log('Making request to:', config.url, {
        method: config.method,
        headers: config.headers,
        data: config.data instanceof FormData ? '[FormData]' : config.data
    });

    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // If the request data is FormData, remove the Content-Type header
    // to let the browser set it with the boundary
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    }

    return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        console.log('Response from:', response.config.url, {
            status: response.status,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });

        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('adminToken');
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/api/auth/login', credentials),
    logout: () => {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
    },
    getProfile: () => api.get('/api/auth/admin/profile'),
    updateProfile: (profileData) => api.put('/api/auth/admin/profile', profileData),
    updatePassword: (passwordData) => api.put('/api/auth/admin/profile/password', passwordData),
};

// Dashboard API
export const dashboardAPI = {
    getOverview: () => api.get('/api/dashboard'),
    getStats: () => api.get('/api/dashboard'),
    getRecentOrders: () => api.get('/api/dashboard/recent-orders'),
    getTopProducts: () => api.get('/api/dashboard/top-products'),
    getSalesData: () => api.get('/api/dashboard'),
    getCategoryData: () => api.get('/api/dashboard'),
};

// Products API
export const productsAPI = {
    getAll: (params) => {
        const queryString = params ? `?${params.toString()}` : '';
        return api.get(`/api/products${queryString}`);
    },
    getOne: (id) => api.get(`/api/products/${id}`),
    create: (data) => {
        // If data contains files, use FormData
        if (data instanceof FormData) {
            return api.post('/api/products', data);
        }
        return api.post('/api/products', data);
    },
    update: (id, data) => {
        // If data contains files, use FormData
        if (data instanceof FormData) {
            return api.patch(`/api/products/${id}`, data);
        }
        return api.patch(`/api/products/${id}`, data);
    },
    delete: (id) => api.delete(`/api/products/${id}`),

    // Product Variants API
    getVariants: (productId) => api.get(`/api/products/${productId}/variants`),
    createVariant: (productId, data) => {
        // If data contains files, use FormData
        if (data instanceof FormData) {
            return api.post(`/api/products/${productId}/variants`, data);
        }
        return api.post(`/api/products/${productId}/variants`, data);
    },
    updateVariant: (productId, variantId, data) => {
        // If data contains files, use FormData
        if (data instanceof FormData) {
            return api.patch(`/api/products/${productId}/variants/${variantId}`, data);
        }
        return api.patch(`/api/products/${productId}/variants/${variantId}`, data);
    },
    deleteVariant: (productId, variantId) => api.delete(`/api/products/${productId}/variants/${variantId}`),
};

// Categories API
export const categoriesAPI = {
    getAll: () => api.get('/api/categories'),
    getOne: (id) => api.get(`/api/categories/${id}`),
    create: (data) => {
        // If data contains files, use FormData
        if (data instanceof FormData) {
            return api.post('/api/categories', data);
        }
        return api.post('/api/categories', data);
    },
    update: (id, data) => {
        // If data contains files, use FormData
        if (data instanceof FormData) {
            return api.patch(`/api/categories/${id}`, data);
        }
        return api.patch(`/api/categories/${id}`, data);
    },
    delete: (id) => api.delete(`/api/categories/${id}`),
};

// Users API
export const usersAPI = {
    getAll: () => api.get('/api/dashboard/users'),
    getOne: (id) => api.get(`/api/dashboard/users/${id}`),
    create: (data) => {
        // If data contains files, use FormData
        if (data instanceof FormData) {
            return api.post('/api/dashboard/users', data);
        }
        return api.post('/api/dashboard/users', data);
    },
    update: (id, data) => {
        // If data contains files, use FormData
        if (data instanceof FormData) {
            return api.put(`/api/dashboard/users/${id}`, data);
        }
        return api.put(`/api/dashboard/users/${id}`, data);
    },
    delete: (id) => api.delete(`/api/dashboard/users/${id}`),
};

// Orders API
export const ordersAPI = {
    getAll: () => api.get('/api/orders'),
    getOne: (id) => api.get(`/api/orders/${id}`),
    create: (data) => {
        // If data contains files, use FormData
        if (data instanceof FormData) {
            return api.post('/api/orders', data);
        }
        return api.post('/api/orders', data);
    },
    update: (id, data) => {
        // If data contains files, use FormData
        if (data instanceof FormData) {
            return api.patch(`/api/orders/status/${id}`, data);
        }
        return api.patch(`/api/orders/status/${id}`, data);
    },
    delete: (id) => api.delete(`/api/orders/${id}`),
    cancel: (id) => api.patch(`/api/orders/${id}/cancel`),
};

// Coupons API
export const couponsAPI = {
    getAll: () => api.get('/api/coupons'),
    getOne: (id) => api.get(`/api/coupons/${id}`),
    create: (data) => api.post('/api/coupons', data),
    update: (id, data) => api.patch(`/api/coupons/${id}`, data),
    delete: (id) => api.delete(`/api/coupons/${id}`),
    validate: (code) => api.get(`/api/coupons/validate/${code}`),
};

// Profile API
export const profileAPI = {
    get: (id) => api.get(`/api/auth/profile/${id}`),
    update: (id, data) => {
        // Profile updates often include files, so use FormData
        if (data instanceof FormData) {
            return api.put(`/api/auth/profile/${id}`, data);
        }
        return api.put(`/api/auth/profile/${id}`, data);
    },
};

// Reviews API
export const reviewsAPI = {
    getAll: () => api.get('/api/reviews'),
    getOne: (id) => api.get(`/api/reviews/${id}`),
    create: (data) => api.post('/api/reviews', data),
    update: (id, data) => api.patch(`/api/reviews/${id}`, data),
    delete: (id) => {
        const token = localStorage.getItem('token');
        if (!token) {
            return Promise.reject(new Error('No authentication token found'));
        }
        return api.delete(`/api/reviews/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },
    addReply: (id, data) => api.post(`/api/reviews/${id}/replies`, data),
    updateStatus: (id, status) => api.patch(`/api/reviews/${id}/status`, { status }),
};

// Carts API
export const cartsAPI = {
    getAll: () => api.get('/api/cart/admin/all'),
    getOne: (id) => api.get(`/api/cart/${id}`),
    delete: (id) => api.delete(`/api/cart/${id}`),
};

// Settings API
export const settingsAPI = {
    getSettings: () => api.get('/api/settings'),
    updateSettings: (settings) => api.put('/api/settings', settings),
    resetSettings: () => api.post('/api/settings/reset')
};

export default api; 