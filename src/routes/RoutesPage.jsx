import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import Store from '../services/Slice/Store'
import { store as adminStore } from '../admin/store'
import Layout from '../layouts/Layout'
import Home from '../pages/Home'
import Login from '../pages/Login'
import SignUp from '../pages/SignUp'
import Error404 from '../pages/Error404'
import Contact from '../pages/Contact'
import Cart from '../pages/Cart'
import Wishlist from '../pages/Wishlist'
import SearchResults from '../pages/SearchResults'
import Shop from '../pages/Shop'
import Profile from '../pages/Profile'
import Checkout from '../pages/Checkout'
import Orders from '../pages/Orders'
import OrderConfirmation from '../pages/OrderConfirmation'
import ProductDetails from '../pages/ProductDetails'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'
import WhatsAppFloat from '../components/WhatsAppFloat'

// Import admin components
import AdminApp from '../admin/App'

const RoutesPage = () => {
    return (
        <Routes>
            {/* Main app routes */}
            <Route path="/" element={
                <Provider store={Store}>
                    <Layout>
                        <Routes>
                            <Route index element={<Home />} />
                            <Route path="login" element={<Login />} />
                            <Route path="signup" element={<SignUp />} />
                            <Route path="contact" element={<Contact />} />
                            <Route path="cart" element={<Cart />} />
                            <Route path="wishlist" element={<Wishlist />} />
                            <Route path="search" element={<SearchResults />} />
                            <Route path="shop" element={<Shop />} />
                            <Route path="profile" element={<Profile />} />
                            <Route path="checkout" element={<Checkout />} />
                            <Route path="orders" element={<Orders />} />
                            <Route path="order-confirmation" element={<OrderConfirmation />} />
                            <Route path="product/:id" element={<ProductDetails />} />
                            <Route path="forgot-password" element={<ForgotPassword />} />
                            <Route path="reset-password" element={<ResetPassword />} />
                        </Routes>
                    </Layout>
                </Provider>
            } />

            {/* Admin routes */}
            <Route path="/admin/*" element={
                <React.Suspense fallback={
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        minHeight: '100vh',
                        background: '#f8fafc'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <img 
                                src="/loading.gif" 
                                alt="Loading..." 
                                style={{ width: 100, height: 100 }}
                            />
                            <p style={{ marginTop: 16, color: '#1a237e' }}>
                                جاري تحميل لوحة التحكم...
                            </p>
                        </div>
                    </div>
                }>
                    <AdminApp />
                </React.Suspense>
            } />

            {/* 404 route */}
            <Route path="*" element={
                <Provider store={Store}>
                    <Layout>
                        <Error404 />
                    </Layout>
                </Provider>
            } />
        </Routes>
    )
}

export default RoutesPage