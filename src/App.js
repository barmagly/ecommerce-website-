import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Error404 from './pages/Error404';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import SearchResults from './pages/SearchResults';
import Shop from './pages/Shop';
import Profile from './pages/Profile';
import WhatsAppFloat from './components/WhatsAppFloat';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderConfirmation from './pages/OrderConfirmation';
import ProductDetails from './pages/ProductDetails';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminApp from './admin/App';
import { Provider } from 'react-redux';
import Store from './services/Slice/Store'
import { ToastContainer } from 'react-toastify';

function App() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <Provider store={Store}>
      <ToastContainer />
      <Router>
        <div dir="rtl">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            {/* <Route path="/about" element={<About />} /> */}
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/admin/*" element={<AdminApp />} />
            <Route
              path="*"
              element={
                <>
                  <WhatsAppFloat />
                  {/* هنا ضع باقي الراوتات الخارجية مثل الصفحة الرئيسية وغيرها */}
                </>
              }
            />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App; 