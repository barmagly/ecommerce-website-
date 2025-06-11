// Get environment variables with fallback values
const getEnvVar = (key, defaultValue) => {
  // Try Vite's import.meta.env first
  try {
    if (import.meta.env[key]) {
      return import.meta.env[key];
    }
  } catch (error) {
    // Ignore error if import.meta is not available
  }

  // Fall back to process.env (Create React App)
  try {
    if (process.env[key]) {
      return process.env[key];
    }
  } catch (error) {
    // Ignore error if process.env is not available
  }

  // Return default value if neither is available
  console.warn(`Environment variable ${key} not found, using default value`);
  return defaultValue;
};

const config = {
  API_URL: getEnvVar('VITE_API_URL', getEnvVar('REACT_APP_API_URL', 'http://localhost:5000/api')),
  IMAGE_URL: getEnvVar('VITE_IMAGE_URL', getEnvVar('REACT_APP_IMAGE_URL', 'http://localhost:5000/uploads')),
  CURRENCY: 'SAR',
  CURRENCY_SYMBOL: 'ر.س',
  ITEMS_PER_PAGE: 12,
  ADMIN_ITEMS_PER_PAGE: 10
};

export default config; 