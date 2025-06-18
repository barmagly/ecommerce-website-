import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
import ProtectedRoute from '../components/ProtectedRoute';
import { getOrdersThunk, updateOrderStatusThunk, updateOrderStatusLocally, loadLocalUpdates, removeOrderLocally, cleanupOldLocalUpdates, cleanupOldDeletedOrders } from "../services/Slice/order/order";
import { toast } from 'react-toastify';

const statusTabs = [
  { key: "all", label: "جميع الطلبات" },
  { key: "pending", label: "قيد الانتظار" },
  { key: "confirmed", label: "مؤكدة" },
  { key: "shipped", label: "تم الشحن" },
  { key: "delivered", label: "تم التوصيل" },
  { key: "cancelled", label: "ملغية" }
];

export default function Orders() {
  const dispatch = useDispatch();
  const orderState = useSelector((state) => state.order);
  const { orders = [], loading = false, error = null } = orderState || {};
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [hideCancelledOrders, setHideCancelledOrders] = useState(true);

  useEffect(() => {
    dispatch(getOrdersThunk());
    dispatch(loadLocalUpdates());
    dispatch(cleanupOldLocalUpdates());
    dispatch(cleanupOldDeletedOrders());
  }, [dispatch]);

  const filteredOrders = orders.filter(order => {
    if (activeTab === "all") {
      return hideCancelledOrders ? order.status !== 'cancelled' : true;
    } else if (activeTab === "cancelled") {
      return order.status === 'cancelled';
    } else {
      return order.status === activeTab;
    }
  });

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

  const getStatusBadge = (status, isLocalUpdate = false) => {
    const baseClass = "badge rounded-pill px-3 py-2";
    let statusClass = "";
    
    switch (status) {
      case "pending":
        statusClass = "bg-warning text-dark";
        break;
      case "confirmed":
        statusClass = "bg-success text-white";
        break;
      case "shipped":
        statusClass = "bg-info text-white";
        break;
      case "delivered":
        statusClass = "bg-primary text-white";
        break;
      case "cancelled":
        statusClass = "bg-danger text-white";
        break;
      default:
        statusClass = "bg-secondary text-white";
    }
    
    // إضافة مؤشر للتحديث المحلي
    if (isLocalUpdate) {
      statusClass += " border border-warning";
    }
    
    return `${baseClass} ${statusClass}`;
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

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('هل أنت متأكد من إلغاء هذا الطلب؟')) return;
    
    try {
      setIsUpdating(true);
      await dispatch(updateOrderStatusThunk({ orderId, status: 'cancelled' })).unwrap();
      toast.success('تم إلغاء الطلب بنجاح');
      setShowModal(false);
    } catch (error) {
      console.error('Error canceling order:', error);
      toast.error(error || 'فشل في إلغاء الطلب');
    } finally {
      setIsUpdating(false);
    }
  };

  const canModifyOrder = (status) => {
    return status === 'pending';
  };

  const handleRemoveCancelledOrder = (orderId) => {
    if (!window.confirm('هل أنت متأكد من إزالة هذا الطلب من القائمة؟')) return;
    
    try {
      // إزالة من localStorage
      const localOrders = JSON.parse(localStorage.getItem('localOrderUpdates') || '{}');
      delete localOrders[orderId];
      localStorage.setItem('localOrderUpdates', JSON.stringify(localOrders));
      
      // إضافة إلى قائمة الطلبات المحذوفة
      const deletedOrders = JSON.parse(localStorage.getItem('deletedOrders') || '[]');
      deletedOrders.push({
        orderId,
        deletedAt: new Date().toISOString()
      });
      localStorage.setItem('deletedOrders', JSON.stringify(deletedOrders));
      
      // إزالة من Redux store
      dispatch(removeOrderLocally(orderId));
      
      toast.success('تم إزالة الطلب من القائمة');
    } catch (error) {
      console.error('Error removing order:', error);
      toast.error('فشل في إزالة الطلب');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="bg-white" dir="rtl" style={{ textAlign: "right" }}>
          <Header />
          <Breadcrumb title="طلباتي" />
          <div className="container py-5">
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">جاري التحميل...</span>
              </div>
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
          <Breadcrumb title="طلباتي" />
          <div className="container py-5">
            <div className="alert alert-danger" role="alert">
              {typeof error === 'object' ? error.message || 'حدث خطأ ما' : error}
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
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0">الطلبات</h2>
            {activeTab === "all" && (
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="hideCancelled"
                  checked={hideCancelledOrders}
                  onChange={(e) => setHideCancelledOrders(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="hideCancelled">
                  إخفاء الطلبات الملغية
                </label>
              </div>
            )}
          </div>
          
          {/* Order Statistics */}
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card bg-primary text-white">
                <div className="card-body text-center">
                  <h5 className="card-title">إجمالي الطلبات</h5>
                  <h3>{orders.length}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-warning text-white">
                <div className="card-body text-center">
                  <h5 className="card-title">قيد الانتظار</h5>
                  <h3>{orders.filter(o => o.status === 'pending').length}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-success text-white">
                <div className="card-body text-center">
                  <h5 className="card-title">مؤكدة</h5>
                  <h3>{orders.filter(o => o.status === 'confirmed').length}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-danger text-white">
                <div className="card-body text-center">
                  <h5 className="card-title">ملغية</h5>
                  <h3>{orders.filter(o => o.status === 'cancelled').length}</h3>
                </div>
              </div>
            </div>
          </div>
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
                <div className="text-center py-5">
                  {activeTab === "cancelled" ? (
                    <div>
                      <i className="fas fa-trash text-muted" style={{ fontSize: '3rem' }}></i>
                      <h5 className="mt-3">لا توجد طلبات ملغية</h5>
                      <p className="text-muted">لم تقم بإلغاء أي طلبات بعد</p>
                    </div>
                  ) : (
                    <div>
                      <i className="fas fa-box text-muted" style={{ fontSize: '3rem' }}></i>
                      <h5 className="mt-3">لا توجد طلبات في هذا القسم</h5>
                      <p className="text-muted">لم يتم العثور على طلبات تطابق المعايير المحددة</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered text-center align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>رقم الطلب</th>
                        <th>تاريخ الطلب</th>
                        <th>الحالة</th>
                        <th>المدينة</th>
                        <th>مصاريف الشحن</th>
                        <th>مدة التوصيل</th>
                        <th>عدد المنتجات</th>
                        <th>الإجمالي</th>
                        <th>طريقة الدفع</th>
                        <th>إجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedOrders.map(order => (
                        <tr key={order._id}>
                          <td>#{order._id.slice(-6)}</td>
                          <td>{formatDate(order.createdAt)}</td>
                          <td>
                            <span className={getStatusBadge(order.status, order.isLocalUpdate)}>
                              {getStatusLabel(order.status)}
                            </span>
                            {order.isLocalUpdate && (
                              <div className="small text-muted mt-1">
                                <i className="fas fa-info-circle text-warning"></i>
                                تحديث محلي
                              </div>
                            )}
                          </td>
                          <td>{order.city || 'نجع حمادي'}</td>
                          <td>{order.shippingCost || 0} ج.م</td>
                          <td>{order.deliveryDays || 2} يوم</td>
                          <td>{order.cartItems?.length || 0}</td>
                          <td>{order.total} ج.م</td>
                          <td>{order.paymentMethod}</td>
                          <td>
                            <div className="btn-group">
                              <button 
                                className="btn btn-outline-primary btn-sm" 
                                onClick={() => handleShowDetails(order)}
                              >
                                عرض
                              </button>
                              {canModifyOrder(order.status) && (
                                <button 
                                  className="btn btn-outline-danger btn-sm" 
                                  onClick={() => handleCancelOrder(order._id)}
                                  disabled={isUpdating}
                                  title="إلغاء الطلب"
                                >
                                  {isUpdating ? 'جاري الإلغاء...' : 'إلغاء'}
                                </button>
                              )}
                              {order.status === 'cancelled' && (
                                <button 
                                  className="btn btn-outline-danger btn-sm" 
                                  onClick={() => handleRemoveCancelledOrder(order._id)}
                                  title="إزالة من القائمة"
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              )}
                            </div>
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
                        <li><strong>الحالة:</strong> <span className={getStatusBadge(selectedOrder.status, selectedOrder.isLocalUpdate)}>
                          {getStatusLabel(selectedOrder.status)}
                        </span></li>
                        <li><strong>طريقة الدفع:</strong> {selectedOrder.paymentMethod}</li>
                        <li><strong>حالة الدفع:</strong> {selectedOrder.paymentStatus}</li>
                        <li><strong>مصاريف الشحن:</strong> {selectedOrder.shippingCost || 0} ج.م</li>
                        <li><strong>مدة التوصيل:</strong> {selectedOrder.deliveryDays || 2} يوم</li>
                        <li><strong>الإجمالي:</strong> {selectedOrder.total} ج.م</li>
                      </ul>
                      <h6 className="fw-bold mb-3">معلومات العميل</h6>
                      <ul className="list-unstyled mb-3">
                        <li><strong>الاسم:</strong> {selectedOrder.name}</li>
                        <li><strong>البريد الإلكتروني:</strong> {selectedOrder.email?.replace('khaledahmed.201188@gmail.com', 'khaledahmedhaggagy@gmail.com')}</li>
                        <li><strong>رقم الهاتف:</strong> {selectedOrder.phone}</li>
                        <li><strong>العنوان:</strong> {selectedOrder.address}</li>
                        <li><strong>المدينة:</strong> {selectedOrder.city || 'نجع حمادي'}</li>
                        <li><strong>الرمز البريدي:</strong> {selectedOrder.postalCode}</li>
                        <li><strong>الدولة:</strong> {selectedOrder.country}</li>
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
                  {canModifyOrder(selectedOrder.status) && (
                    <button 
                      type="button" 
                      className="btn btn-danger"
                      onClick={() => handleCancelOrder(selectedOrder._id)}
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'جاري الإلغاء...' : 'إلغاء الطلب'}
                    </button>
                  )}
                  {selectedOrder.status === 'cancelled' && (
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        handleRemoveCancelledOrder(selectedOrder._id);
                        handleCloseModal();
                      }}
                    >
                      إزالة من القائمة
                    </button>
                  )}
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