import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

export const ordersAPI = {
  getAll: () => api.get('/orders'),
};

export default api; 