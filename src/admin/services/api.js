import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
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
    login: (credentials) => api.post('/auth/login', credentials),
    logout: () => {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
    },
};

// Dashboard API
export const dashboardAPI = {
    getOverview: () => api.get('/dashboard'),
    getStats: () => api.get('/dashboard'),
};

// Products API
export const productsAPI = {
    getAll: () => api.get('/dashboard/products'),
    getOne: (id) => api.get(`/dashboard/products/${id}`),
    create: (data) => api.post('/dashboard/products', data),
    update: (id, data) => api.put(`/dashboard/products/${id}`, data),
    delete: (id) => api.delete(`/dashboard/products/${id}`),
};

// Categories API
export const categoriesAPI = {
    getAll: () => api.get('/dashboard/categories'),
    getOne: (id) => api.get(`/dashboard/categories/${id}`),
    create: (data) => api.post('/dashboard/categories', data),
    update: (id, data) => api.put(`/dashboard/categories/${id}`, data),
    delete: (id) => api.delete(`/dashboard/categories/${id}`),
};

// Users API
export const usersAPI = {
    getAll: () => api.get('/dashboard/users'),
    getOne: (id) => api.get(`/dashboard/users/${id}`),
    create: (data) => api.post('/dashboard/users', data),
    update: (id, data) => api.put(`/dashboard/users/${id}`, data),
    delete: (id) => api.delete(`/dashboard/users/${id}`),
};

// Orders API
export const ordersAPI = {
    getAll: () => api.get('/dashboard/orders'),
    getOne: (id) => api.get(`/dashboard/orders/${id}`),
    create: (data) => api.post('/dashboard/orders', data),
    update: (id, data) => api.put(`/dashboard/orders/${id}`, data),
    delete: (id) => api.delete(`/dashboard/orders/${id}`),
};

// Profile API
export const profileAPI = {
    get: (id) => api.get(`/dashboard/profile/${id}`),
    update: (id, data) => api.put(`/dashboard/profile/${id}`, data),
};

export default api; 