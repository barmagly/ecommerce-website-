import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://ecommerce-website-backend-nine.vercel.app/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    // Try both token keys
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear both token keys
      localStorage.removeItem('adminToken');
      localStorage.removeItem('token');
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (data) => {
    // Prepare login data with multiple field formats for backend compatibility
    const loginData = {
      email: data.username || data.email,
      password: data.password,
      // Also send username field in case backend expects it
      ...(data.username && { username: data.username })
    };
    
    try {
      console.log('Attempting login with:', { email: loginData.email, username: loginData.username });
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify(loginData),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Login response status:', response.status);
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
          console.log('Login error data:', errorData);
        } catch {
          const errorText = await response.text();
          console.log('Login error text:', errorText);
          errorData = { message: errorText || `HTTP ${response.status}` };
        }
        
        // Create axios-like error
        const error = new Error(errorData.message || `HTTP ${response.status}`);
        error.response = {
          status: response.status,
          data: errorData
        };
        throw error;
      }
      
      const result = await response.json();
      console.log('Raw login response:', result);
      
      // Extract from backend structure
      const token = result.data?.token;
      const adminData = result.data?.adminData || result.data?.user;
      
      if (!token) {
        throw new Error('No token received from server');
      }
      
      console.log('Login successful:', { 
        hasToken: !!token, 
        hasUser: !!adminData,
        token: token ? 'present' : 'missing',
        adminData: adminData ? 'present' : 'missing'
      });
      
      // Store token in both keys for compatibility
      localStorage.setItem('adminToken', token);
      localStorage.setItem('token', token);
      
      // Normalize response format
      const normalizedResult = {
        token,
        admin: adminData,
        hasToken: true,
        hasUser: !!adminData
      };
      
      // Return in axios-like format for compatibility
      return { data: normalizedResult };
    } catch (error) {
      console.error('Login fetch error:', error);
      
      // If it's already formatted, re-throw
      if (error.response) {
        throw error;
      }
      
      // Convert to axios-like error format
      throw {
        response: {
          status: 500,
          data: { message: error.message }
        },
        message: error.message,
        code: error.name === 'TypeError' ? 'ERR_NETWORK' : 'ERR_UNKNOWN'
      };
    }
  },
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('token');
    window.location.href = '/admin/login';
  },
  // Remove or update getProfile if not implemented in backend
  // getProfile: () => api.get('/users/me'),
};

// Upload services
export const uploadService = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  uploadImages: (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    return api.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Products services
export const productService = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// Categories services
export const categoryService = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Orders services
export const orderService = {
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}`, { status }),
  // getStats: () => api.get('/orders/stats'),
};

// Users services
export const userService = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  updateStatus: (id, status) => api.put(`/users/${id}`, { status }),
};

// Dashboard services
export const dashboardService = {
  getStats: async () => ({
    data: {
      totalProducts: 12,
      totalCategories: 4,
      totalOrders: 8,
      totalUsers: 3,
      totalSales: 24500
    }
  }),
  getRecentOrders: async () => ({
    data: [
      { id: 1, orderNumber: 'ORD-001', customerName: 'أحمد محمد', date: '2024-06-01', total: 1200, status: 'completed' },
      { id: 2, orderNumber: 'ORD-002', customerName: 'سارة علي', date: '2024-06-02', total: 800, status: 'pending' }
    ]
  }),
  getSalesChart: async (period) => ({
    data: [
      { date: '2024-06-01', sales: 1200 },
      { date: '2024-06-02', sales: 800 },
      { date: '2024-06-03', sales: 1500 },
      { date: '2024-06-04', sales: 2000 },
      { date: '2024-06-05', sales: 1800 },
      { date: '2024-06-06', sales: 2200 },
      { date: '2024-06-07', sales: 3000 }
    ]
  })
};

export default api; 