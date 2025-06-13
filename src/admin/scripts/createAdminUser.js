const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

const createAdminUser = async () => {
  const adminData = {
    name: 'مدير النظام',
    email: 'admin@example.com',
    password: 'Admin@123',
    role: 'admin',
    status: 'active',
    phone: '+1234567890',
    addresses: ['عنوان افتراضي']
  };

  try {
    const response = await axios.post(`${API_BASE_URL}/dashboard/users`, adminData);
    console.log('Admin user created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to create admin user:', error.response?.data || error.message);
    throw error;
  }
};

// Execute the function
createAdminUser()
  .then(() => {
    console.log('Admin user creation completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Admin user creation failed:', error);
    process.exit(1);
  }); 