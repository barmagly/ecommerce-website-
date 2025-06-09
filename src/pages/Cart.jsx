import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { decreaseQ, deleteItem, getCartThunk, increaseQ } from "../services/Slice/cart/cart";
import ProtectedRoute from "../components/ProtectedRoute";

export default function Cart() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.userCart);
  // const { isAuthenticated } = useSelector((state) => state.auth);
  const token= localStorage.getItem('token')
  const navigate = useNavigate();

  const handleRemove = (variantId, prdID) => {
    dispatch(deleteItem({variantId, prdID}))
  };

  const decreaseQuantity = (variantId, prdID) => {
    dispatch(decreaseQ({variantId, prdID}))
  };

  const increaseQuantity = (variantId, prdID) => {
    dispatch(increaseQ({variantId, prdID}))
  }

  const handleCheckout = () => {
    if (products.length === 0) {
      alert('سلة المشتريات فارغة');
      return;
    }
    navigate('/checkout', { state: { cartItems: products.cartItems, total: products.total } });
  };

  useEffect(() => {
    if (token) {
      dispatch(getCartThunk());
    }
  }, [dispatch,token])

  return (
    <ProtectedRoute>
      <div className="bg-white" dir="rtl" style={{ textAlign: 'right' }}>
        <Header />
        <div className="container py-5">
          <Breadcrumb items={[
            { label: "سلة المشتريات", to: "/cart" }
          ]} />
          <h2 className="fw-bold mb-4" data-aos="fade-up">سلة المشتريات</h2>
          <div className="row g-4">
            <div className="col-lg-8" data-aos="fade-right">
              <div className="table-responsive">
                <table className="table align-middle text-center">
                  <thead className="table-light">
                    <tr>
                      <th>المنتج</th>
                      <th>السعر</th>
                      <th>الكمية</th>
                      <th>الإجمالي</th>
                      <th>حذف</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr><td colSpan="5" className="text-center">سلة المشتريات فارغة</td></tr>
                    ) : products?.cartItems?.map(item => (
                      <tr key={item?.variantId ? item?.variantId._id : item?.prdID._id}>
                        <td>
                          <img src={item?.variantId ? item?.variantId?.images[0].url : item?.prdID?.images[0].url} alt={item?.prdID?.name} style={{ width: 54, height: 54, borderRadius: 8, marginLeft: 8 }} />
                          <span className="fw-bold">{item?.prdID?.name}</span>
                        </td>
                        <td>{item?.variantId ? item?.variantId?.price : item?.prdID?.price} ج.م</td>
                        <td>
                          <div className="d-flex align-items-center justify-content-center gap-2">
                            <button className="btn btn-light px-2 py-1" onClick={() => decreaseQuantity(item?.variantId?._id, item?.prdID?._id)} disabled={item.quantity === 1}>-</button>
                            <span className="mx-2">{item.quantity}</span>
                            <button className="btn btn-light px-2 py-1" onClick={() => increaseQuantity(item?.variantId?._id, item?.prdID?._id)} disabled={item.quantity >= item?.prdID?.stock}>+</button>
                          </div>
                        </td>
                        <td>{item?.variantId ? item?.variantId?.price * item?.quantity : item?.prdID?.price * item?.quantity} ج.م</td>
                        <td>
                          <button className="btn btn-danger btn-sm" onClick={() => handleRemove(item?.variantId?._id, item?.prdID?._id)} title="حذف المنتج">
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-lg-4" data-aos="fade-left">
              <div className="bg-light p-4 rounded shadow-sm">
                <h5 className="fw-bold mb-3">ملخص الطلب</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span>الإجمالي الفرعي:</span>
                  <span>{products.total} ج.م</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>الشحن:</span>
                  <span>مجاني</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <span className="fw-bold">الإجمالي الكلي:</span>
                  <span className="fw-bold text-danger">{products.total} ج.م</span>
                </div>
                <button className="btn btn-danger w-100 py-2 fw-bold" onClick={handleCheckout}>إتمام الشراء</button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
   </ProtectedRoute>
  );
} 