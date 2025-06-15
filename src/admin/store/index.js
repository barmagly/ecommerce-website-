import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import categoriesReducer from './slices/categoriesSlice';
import productVariantsReducer from './slices/productVariantsSlice';
import usersReducer from './slices/usersSlice';
import ordersReducer from './slices/ordersSlice';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    categories: categoriesReducer,
    productVariants: productVariantsReducer,
    users: usersReducer,
    orders: ordersReducer,
    auth: authReducer,
    dashboard: dashboardReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store; 