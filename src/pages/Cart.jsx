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
    // البحث عن المنتج في السلة
    const cartItem = products.cartItems.find(item =>
      item.variantId?._id === variantId && item.prdID?._id === prdID
    );

    if (!cartItem) return;

    const product = cartItem.prdID;
    const currentQuantity = cartItem.quantity;
    const maxQuantityPerOrder = product.maxQuantityPerOrder;

    // التحقق من الحد الأقصى للشراء
    if (maxQuantityPerOrder && currentQuantity >= parseInt(maxQuantityPerOrder)) {
      toast.warning(`لا يمكن شراء أكثر من ${maxQuantityPerOrder} قطع من هذا المنتج في الطلب الواحد. الحد الأقصى المحدد من قبل الإدارة.`, {
        position: "top-center",
        rtl: true,
        autoClose: 4000
      });
      return;
    }

    // التحقق من المخزون المتاح
    if (currentQuantity >= product.stock) {
      toast.warning('لا يوجد مخزون كافي لهذا المنتج', {
        position: "top-center",
        rtl: true,
        autoClose: 3000
      });
      return;
    }

    dispatch(increaseQ({ variantId, prdID }));
  };

  const handleCheckout = async () => {
    if (!products?.cartItems?.length) {
      toast.error('سلة المشتريات فارغة', {
        position: "top-center",
        rtl: true,
        autoClose: 3000
      });
      return;
    }

    try {
      // Refresh cart data before proceeding
      await dispatch(getCartThunk()).unwrap();

      // التحقق من نطاق الشحن للمنتجات
      const hasNagHamadiOnlyProducts = products.cartItems.some(item =>
        item.prdID?.shippingAddress?.type === 'nag_hamadi'
      );

      if (hasNagHamadiOnlyProducts) {
        toast.info('بعض المنتجات متاحة للشحن في نجع حمادي و ضواحيها. سيتم التحقق من العنوان في صفحة إتمام الشراء.', {
          position: "top-center",
          rtl: true,
          autoClose: 5000
        });
      }

      // Navigate to checkout with fresh cart data
      navigate('/checkout');
    } catch (error) {
      console.error('Failed to proceed to checkout:', error);
      toast.error('حدث خطأ أثناء الانتقال إلى صفحة إتمام الشراء. حاول مرة أخرى.', {
        position: "top-center",
        rtl: true,
        autoClose: 3000
      });
    }
  };

  useEffect(() => {
    if (token) {
      dispatch(getCartThunk());
    }
  }, [dispatch, token]);

  // إضافة console.log للتحقق من قيم مصاريف الشحن
  useEffect(() => {
    if (products?.cartItems?.length > 0) {
      console.log('Cart Items in Cart page:', products.cartItems);
      console.log('Shipping costs in cart:', products.cartItems.map(item => ({
        productName: item.prdID?.name,
        shippingCost: item.prdID?.shippingCost,
        deliveryDays: item.prdID?.deliveryDays
      })));
    }
  }, [products?.cartItems]);

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
              <div key={item._id} className={`card mb-3 ${item.prdID?.shippingAddress?.type === 'nag_hamadi' ? 'border-warning' : ''
                }`}>
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
                        السعر:
                        {item.prdID?.originalPrice && item.prdID?.originalPrice > item.prdID?.price ? (
                          <span className="ms-2">
                            <span className="text-danger fw-bold" style={{ fontSize: '2rem' }}>{item.prdID?.price} ج.م</span>
                            <span className="text-muted text-decoration-line-through ms-2" style={{ fontSize: '1.2rem' }}>{item.prdID?.originalPrice} ج.م</span>
                          </span>
                        ) : (
                          <span className="text-danger fw-bold" style={{ fontSize: '2rem' }}>{item.prdID?.price} ج.م</span>
                        )}
                      </p>
                      <div className="text-muted small mb-2">
                        الشحن: {item.prdID?.shippingCost || 0} ج.م | التوصيل خلال {item.prdID?.deliveryDays || 2} يوم
                      </div>
                      {item.prdID?.maxQuantityPerOrder && (
                        <div className="text-muted small mb-2">
                          الحد الأقصى للشراء: <strong>{item.prdID.maxQuantityPerOrder}</strong> قطعة في الطلب الواحد
                        </div>
                      )}
                      {item.prdID?.maxQuantityPerOrder && item.prdID.maxQuantityPerOrder < item.prdID.stock && (
                        <div className="alert alert-info py-2 mb-2">
                          <small>
                            <i className="fas fa-info-circle ms-1"></i>
                            <strong>ملاحظة:</strong> تم تحديد حد أقصى للشراء من قبل الإدارة
                          </small>
                        </div>
                      )}
                      {item.prdID?.shippingAddress?.type === 'nag_hamadi' && (
                        <div className="alert alert-warning py-2 mb-2">
                          <small>
                            🚚 <strong>متاح للشحن في نجع حمادي و ضواحيها</strong>
                          </small>
                        </div>
                      )}
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
                          disabled={
                            item.quantity >= item.prdID?.stock ||
                            (item.prdID?.maxQuantityPerOrder && item.quantity >= parseInt(item.prdID.maxQuantityPerOrder))
                          }
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
                  <span>
                    {(() => {
                      const totalAfterDiscount = products.cartItems.reduce((sum, item) => sum + (item.prdID?.price * item.quantity), 0);
                      const totalOriginal = products.cartItems.reduce((sum, item) => sum + ((item.prdID?.originalPrice || item.prdID?.price) * item.quantity), 0);
                      if (totalOriginal > totalAfterDiscount) {
                        return <>
                          <span className="text-danger fw-bold">{totalAfterDiscount} ج.م</span>
                          <span className="text-muted text-decoration-line-through ms-2">{totalOriginal} ج.م</span>
                        </>;
                      }
                      return <span className="text-danger fw-bold">{totalAfterDiscount} ج.م</span>;
                    })()}
                  </span>
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