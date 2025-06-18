import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
import ProtectedRoute from '../components/ProtectedRoute';
import { getOrdersThunk } from "../services/Slice/order/order";

const statusTabs = [
  { key: "all", label: "جميع الطلبات" },
  { key: "pending", label: "قيد الانتظار" },
  { key: "processing", label: "قيد المعالجة" },
  { key: "shipped", label: "تم الشحن" },
  { key: "delivered", label: "تم التوصيل" },
  { key: "cancelled", label: "ملغي" },
];

export default function Orders() {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.order);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(getOrdersThunk());
  }, [dispatch]);

  const filteredOrders = activeTab === "all"
    ? orders
    : orders.filter(order => order.status === activeTab);

  // Sort orders by createdAt date (newest first)
  const sortedOrders = [...filteredOrders].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  const handleShowDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return 'badge bg-success';
      case 'shipped':
        return 'badge bg-info';
      case 'processing':
        return 'badge bg-primary';
      case 'pending':
        return 'badge bg-warning text-dark';
      case 'cancelled':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'delivered':
        return 'تم التوصيل';
      case 'shipped':
        return 'تم الشحن';
      case 'processing':
        return 'قيد المعالجة';
      case 'pending':
        return 'قيد الانتظار';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="bg-white" dir="rtl" style={{ textAlign: "right" }}>
          <Header />
          <div className="container py-5 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">جاري التحميل...</span>
            </div>
          </div>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="bg-white" dir="rtl" style={{ textAlign: "right" }}>
          <Header />
          <div className="container py-5">
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          </div>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="bg-white" dir="rtl" style={{ textAlign: "right" }}>
        <Header />
        <div className="container py-5">
          <Breadcrumb items={[
            { label: "الطلبات", to: "/orders" }
          ]} />
          <h2 className="fw-bold mb-4">الطلبات</h2>
          <ul className="nav nav-tabs mb-4">
            {statusTabs.map(tab => (
              <li className="nav-item" key={tab.key}>
                <button
                  className={`nav-link${activeTab === tab.key ? " active" : ""}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="card shadow-sm border-0">
            <div className="card-body">
              {sortedOrders.length === 0 ? (
                <div className="text-center py-5">لا توجد طلبات في هذا القسم.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered text-center align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>رقم الطلب</th>
                        <th>تاريخ الطلب</th>
                        <th>الحالة</th>
                        <th>عدد المنتجات</th>
                        <th>الإجمالي</th>
                        <th>طريقة الدفع</th>
                        <th>تفاصيل</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedOrders.map(order => (
                        <tr key={order._id}>
                          <td>#{order._id.slice(-6)}</td>
                          <td>{formatDate(order.createdAt)}</td>
                          <td>
                            <span className={getStatusBadge(order.status)}>
                              {getStatusLabel(order.status)}
                            </span>
                          </td>
                          <td>{order.cartItems?.length || 0}</td>
                          <td>{order.total} ج.م</td>
                          <td>{order.paymentMethod}</td>
                          <td>
                            <button className="btn btn-outline-primary btn-sm" onClick={() => handleShowDetails(order)}>عرض</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Order Details Modal */}
        {selectedOrder && (
          <div className={`modal fade show`} style={{ display: showModal ? 'block' : 'none', background: 'rgba(0,0,0,0.5)' }} tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
              <div className="modal-content" dir="rtl">
                <div className="modal-header">
                  <h5 className="modal-title">تفاصيل الطلب #{selectedOrder._id.slice(-6)}</h5>
                  <button type="button" className="btn-close ms-0" aria-label="إغلاق" onClick={handleCloseModal}></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="fw-bold mb-3">معلومات الطلب</h6>
                      <ul className="list-unstyled mb-3">
                        <li><strong>رقم الطلب:</strong> #{selectedOrder._id.slice(-6)}</li>
                        <li><strong>تاريخ الطلب:</strong> {formatDate(selectedOrder.createdAt)}</li>
                        <li><strong>الحالة:</strong> <span className={getStatusBadge(selectedOrder.status)}>
                          {getStatusLabel(selectedOrder.status)}
                        </span></li>
                        <li><strong>طريقة الدفع:</strong> {selectedOrder.paymentMethod}</li>
                        <li><strong>حالة الدفع:</strong> {selectedOrder.paymentStatus}</li>
                        <li><strong>الإجمالي:</strong> {selectedOrder.total} ج.م</li>
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <h6 className="fw-bold mb-3">معلومات الشحن</h6>
                      <ul className="list-unstyled mb-3">
                        <li><strong>الاسم:</strong> {selectedOrder.name}</li>
                        <li><strong>البريد الإلكتروني:</strong> {selectedOrder.email}</li>
                        <li><strong>رقم الهاتف:</strong> {selectedOrder.phone}</li>
                        <li><strong>العنوان:</strong> {selectedOrder.address}</li>
                        <li><strong>المدينة:</strong> {selectedOrder.city}</li>
                        <li><strong>الرمز البريدي:</strong> {selectedOrder.postalCode}</li>
                        <li><strong>الدولة:</strong> {selectedOrder.country}</li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* Payment Receipt Image for Bank Transfer */}
                  {selectedOrder.paymentMethod === 'bank_transfer' && selectedOrder.image && (
                    <div className="row mt-3">
                      <div className="col-12">
                        <h6 className="fw-bold mb-3">صورة إثبات التحويل (Instapay)</h6>
                        <div className="text-center">
                          <img
                            src={selectedOrder.image}
                            alt="إثبات التحويل البنكي"
                            className="img-fluid"
                            style={{ 
                              maxWidth: '400px', 
                              maxHeight: '200px', 
                              borderRadius: '8px', 
                              border: '1px solid #ddd' 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedOrder.cartItems?.length > 0 && (
                    <div className="mt-4">
                      <h6 className="fw-bold mb-3">المنتجات</h6>
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead className="table-light">
                            <tr>
                              <th>المنتج</th>
                              <th>السعر</th>
                              <th>الكمية</th>
                              <th>الإجمالي</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedOrder.cartItems.map((item, index) => (
                              <tr key={index}>
                                <td>{item.name}</td>
                                <td>{item.price} ج.م</td>
                                <td>{item.quantity}</td>
                                <td>{item.price * item.quantity} ج.م</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>إغلاق</button>
                </div>
              </div>
            </div>
          </div>
        )}
        <Footer />
      </div>
    </ProtectedRoute>
  );
} 