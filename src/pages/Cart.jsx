import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { decreaseQ, deleteCartItemThunk, getCartThunk, increaseQ } from "../services/Slice/cart/cart";
import ProtectedRoute from "../components/ProtectedRoute";
import { toast } from 'react-toastify';
import axios from "axios";

export default function Cart() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.userCart);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleRemove = async (variantId, prdID) => {
    console.log('🔄 Delete button clicked with:', { variantId, prdID });
    try {
      console.log('📡 Dispatching deleteCartItemThunk...');
      const result = await dispatch(deleteCartItemThunk({ variantId, prdID })).unwrap();
      console.log('✅ deleteCartItemThunk successful:', result);
      toast.success("تم حذف المنتج من السلة", {
        position: "top-center",
        rtl: true,
        autoClose: 2000
      });
    } catch (error) {
      console.error('❌ deleteCartItemThunk failed:', error);
      toast.error("فشل في حذف المنتج من السلة", {
        position: "top-center",
        rtl: true,
        autoClose: 3000
      });
    }
  };

  const decreaseQuantity = (variantId, prdID) => {
    dispatch(decreaseQ({ variantId, prdID }));
  };

  const increaseQuantity = (variantId, prdID) => {
    dispatch(increaseQ({ variantId, prdID }));
  };

  const handleCheckout = () => {
    if (!products?.cartItems?.length) {
      toast.error('سلة المشتريات فارغة', {
        position: "top-center",
        rtl: true,
        autoClose: 3000
      });
      return;
    }
    navigate('/checkout', { state: { cartItems: products.cartItems, total: products.total } });
  };

  useEffect(() => {
    if (token) {
      dispatch(getCartThunk());
    }
  }, [dispatch, token]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">جاري التحميل...</span>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="text-center py-5">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!products?.cartItems?.length) {
    return (
      <>
        <Header />
        <div className="container py-5">
          <Breadcrumb items={[
            { label: "سلة المشتريات", to: "/cart" }
          ]} />
          <div className="text-center py-5">
            <h3>سلة المشتريات فارغة</h3>
            <button className="btn btn-primary mt-3" onClick={() => navigate('/shop')}>
              تصفح المنتجات
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container py-5">
        <Breadcrumb items={[
          { label: "سلة المشتريات", to: "/cart" }
        ]} />
        <div className="row">
          <div className="col-12 col-lg-8">
            {products.cartItems.map((item) => (
              <div key={item._id} className="card mb-3">
                <div className="row g-0">
                  <div className="col-md-4">
                    <img
                      src={
                        item.prdID?.images?.[0]?.url ||
                        item.prdID?.imageCover ||
                        "/images/Placeholder.png"
                      }
                      className="img-fluid rounded-start"
                      alt={item.prdID?.name}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title">{item.prdID?.name}</h5>
                      <p className="card-text">
                        السعر: {item.prdID?.price} ج.م
                      </p>
                      <div className="d-flex align-items-center">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => decreaseQuantity(item.variantId?._id, item.prdID?._id)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="mx-3">{item.quantity}</span>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => increaseQuantity(item.variantId?._id, item.prdID?._id)}
                          disabled={item.quantity >= item.prdID?.stock}
                        >
                          +
                        </button>
                        <button
                          className="btn btn-danger btn-sm me-3"
                          onClick={() => handleRemove(item.variantId?._id, item.prdID?._id)}
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="col-12 col-lg-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">ملخص الطلب</h5>
                <div className="d-flex justify-content-between mb-3">
                  <span>المجموع:</span>
                  <span>{products.total} ج.م</span>
                </div>
                <button
                  className="btn btn-primary w-100"
                  onClick={handleCheckout}
                >
                  متابعة الشراء
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 