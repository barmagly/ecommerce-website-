import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Create user API instance
const userApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for admin API
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('Making request to:', config.url, config);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Request interceptor for user API
userApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for admin API
api.interceptors.response.use(
    (response) => {
        console.log('Response from:', response.config.url, response);
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('adminToken');
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);

// Response interceptor for user API
userApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Frontend API
export const frontendAPI = {
    getNewArrivals: () => api.get('/api/products/new-arrivals'),
    getBestSellers: () => api.get('/api/products/best-sellers'),
    getMostReviewed: () => api.get('/api/products/most-reviewed'),
    getFlashSales: () => api.get('/api/products/flash-sales'),
    getAllProducts: () => api.get('/api/products'),
    // Wishlist endpoints
    getWishlist: () => userApi.get('/api/auth/wishlist'),
    addToWishlist: (productId) => userApi.post(`/api/auth/wishlist/${productId}`),
    removeFromWishlist: (productId) => userApi.delete(`/api/auth/wishlist/${productId}`),
};

// Dashboard API
export const dashboardAPI = {
    getOverview: () => api.get('/api/dashboard'),
    getStats: () => api.get('/api/dashboard'),
    getRecentOrders: () => api.get('/api/dashboard'),
    getTopProducts: () => api.get('/api/dashboard'),
    getSalesData: () => api.get('/api/dashboard'),
    getCategoryData: () => api.get('/api/dashboard'),
};

// Products API
export const productsAPI = {
    getAll: () => api.get('/api/products'),
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
    getVariants: (productId) => api.get(`/products/${productId}/variants`),
    createVariant: (productId, data) => {
        // If data contains files, use FormData
        if (data instanceof FormData) {
            return api.post(`/products/${productId}/variants`, data);
        }
        return api.post(`/products/${productId}/variants`, data);
    },
    updateVariant: (productId, variantId, data) => {
        // If data contains files, use FormData
        if (data instanceof FormData) {
            return api.patch(`/products/${productId}/variants/${variantId}`, data);
        }
        return api.patch(`/products/${productId}/variants/${variantId}`, data);
    },
    deleteVariant: (productId, variantId) => api.delete(`/products/${productId}/variants/${variantId}`),
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
            return api.put(`/api/orders/${id}`, data);
        }
        return api.put(`/api/orders/${id}`, data);
    },
    delete: (id) => api.delete(`/api/orders/${id}`),
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

// Carts API
export const cartsAPI = {
    getAll: () => api.get('/api/cart/admin/all'),
    getOne: (id) => api.get(`/api/cart/${id}`),
    delete: (id) => api.delete(`/api/cart/${id}`),
};

export default api; 