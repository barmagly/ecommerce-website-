import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
import ProtectedRoute from '../components/ProtectedRoute';

const mockOrders = [
  { id: 1, number: "#1001", date: "2024-06-01", status: "قيد التنفيذ", total: 1200, items: 2 },
  { id: 2, number: "#1002", date: "2024-05-28", status: "مكتمل", total: 650, items: 1 },
  { id: 3, number: "#1003", date: "2024-05-20", status: "ملغى", total: 900, items: 1 },
  { id: 4, number: "#1004", date: "2024-06-02", status: "قيد التنفيذ", total: 1750, items: 3 },
  { id: 5, number: "#1005", date: "2024-05-15", status: "مكتمل", total: 300, items: 1 },
];

const statusTabs = [
  { key: "all", label: "جميع الطلبات" },
  { key: "قيد التنفيذ", label: "قيد التنفيذ" },
  { key: "مكتمل", label: "مكتمل" },
  { key: "ملغى", label: "ملغى" },
];

export default function Orders() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const filteredOrders = activeTab === "all"
    ? mockOrders
    : mockOrders.filter(order => order.status === activeTab);

  const handleShowDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

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
              {filteredOrders.length === 0 ? (
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
                        <th>تفاصيل</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map(order => (
                        <tr key={order.id}>
                          <td>{order.number}</td>
                          <td>{order.date}</td>
                          <td>
                            <span className={
                              order.status === "مكتمل" ? "badge bg-success" :
                                order.status === "قيد التنفيذ" ? "badge bg-warning text-dark" :
                                  "badge bg-danger"
                            }>
                              {order.status}
                            </span>
                          </td>
                          <td>{order.items}</td>
                          <td>{order.total} ج.م</td>
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
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content" dir="rtl">
                <div className="modal-header">
                  <h5 className="modal-title">تفاصيل الطلب {selectedOrder.number}</h5>
                  <button type="button" className="btn-close ms-0" aria-label="إغلاق" onClick={handleCloseModal}></button>
                </div>
                <div className="modal-body">
                  <ul className="list-unstyled mb-3">
                    <li><strong>رقم الطلب:</strong> {selectedOrder.number}</li>
                    <li><strong>تاريخ الطلب:</strong> {selectedOrder.date}</li>
                    <li><strong>الحالة:</strong> <span className={
                      selectedOrder.status === "مكتمل" ? "badge bg-success" :
                        selectedOrder.status === "قيد التنفيذ" ? "badge bg-warning text-dark" :
                          "badge bg-danger"
                    }>{selectedOrder.status}</span></li>
                    <li><strong>عدد المنتجات:</strong> {selectedOrder.items}</li>
                    <li><strong>الإجمالي:</strong> {selectedOrder.total} ج.م</li>
                  </ul>
                  {/* يمكن إضافة تفاصيل المنتجات هنا لاحقًا */}
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