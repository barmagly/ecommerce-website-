import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://ecommerce-website-backend-nine.vercel.app/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create a custom fetch wrapper that mimics axios interceptors
const createFetchWithInterceptors = () => {
  const originalFetch = window.fetch;
  
  return async (url, options = {}) => {
    // Clone options to avoid mutating the original
    const newOptions = { ...options };
    
    // Get token from either key
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    console.log('API Interceptor: Token present?', !!token);
    
    // Add auth header if token exists
    if (token) {
      newOptions.headers = {
        ...newOptions.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      console.log('API Interceptor: Added Authorization header');
    } else {
      // Still set Content-Type even without token
      newOptions.headers = {
        ...newOptions.headers,
        'Content-Type': 'application/json'
      };
    }
    
    // Convert body to JSON if it's an object
    if (newOptions.body && typeof newOptions.body === 'object') {
      newOptions.body = JSON.stringify(newOptions.body);
    }
    
    try {
      console.log(`API Interceptor: ${newOptions.method || 'GET'} ${url}`);
      const response = await originalFetch(url, newOptions);
      
      // Handle 401 Unauthorized
      if (response.status === 401) {
        console.log('API Interceptor: 401 Unauthorized - clearing auth data');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('token');
        localStorage.removeItem('adminInfo');
        
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/admin/login')) {
          window.location.href = '/admin/login';
        }
      }
      
      return response;
    } catch (error) {
      console.error('API Interceptor error:', error);
      throw error;
    }
  };
};

// Replace global fetch with our interceptor version
window.fetch = createFetchWithInterceptors();

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
      
      // Extract from backend structure - using exact response format
      const { data: responseData } = result;
      const { user, token, hasToken, hasUser, adminData } = responseData;
      
      if (!token) {
        throw new Error('No token received from server');
      }
      
      console.log('Login successful:', { 
        hasToken: hasToken ?? true, 
        hasUser: hasUser ?? true,
        token: token ? 'present' : 'missing',
        user: user ? 'present' : 'missing',
        adminData: adminData ? 'present' : 'missing'
      });
      
      // Store token in both keys for compatibility
      localStorage.setItem('adminToken', token);
      localStorage.setItem('token', token);
      
      // Store admin info
      const adminInfo = adminData || user;
      localStorage.setItem('adminInfo', JSON.stringify(adminInfo));
      
      // Normalize response format
      const normalizedResult = {
        token,
        admin: adminInfo,
        hasToken: hasToken ?? true,
        hasUser: hasUser ?? true,
        user: user,
        adminData: adminData
      };
      
      // Return in axios-like format for compatibility
      return { data: normalizedResult };
    } catch (error) {
      console.error('Login fetch error:', error);
      
      // Clear any stale data
      localStorage.removeItem('adminToken');
      localStorage.removeItem('token');
      localStorage.removeItem('adminInfo');
      
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
  register: async (data) => {
    try {
      // Format data according to backend schema
      const registerData = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        // Send address as addresses array if provided
        ...(data.address && { addresses: [{ address: data.address }] })
      };
      
      console.log('Registering with data:', registerData);
      
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        body: JSON.stringify(registerData),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw {
          response: {
            status: response.status,
            data: errorData
          }
        };
      }
      
      const result = await response.json();
      return { data: result };
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },
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