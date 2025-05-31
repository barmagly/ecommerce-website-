import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    // تحقق من وجود طلب مؤكد
    if (!localStorage.getItem("orderConfirmed")) {
      navigate("/");
      return;
    }
    setTimeout(() => setConfirmed(true), 2000);
    setTimeout(() => {
      // أضف الطلب إلى الطلبات في localStorage
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      const newOrder = {
        id: Date.now(),
        date: new Date().toLocaleString("ar-EG"),
        status: "قيد المعالجة",
        items: JSON.parse(localStorage.getItem("cart") || "[]"),
        total: localStorage.getItem("lastOrderTotal") || 0
      };
      orders.unshift(newOrder);
      localStorage.setItem("orders", JSON.stringify(orders));
      // إزالة علامة التأكيد
      localStorage.removeItem("orderConfirmed");
      // الانتقال إلى صفحة الطلبات
      navigate("/orders");
    }, 4000);
  }, [navigate]);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light" dir="rtl">
      <div className="card p-5 shadow-lg text-center">
        <h2 className="mb-4 fw-bold">{confirmed ? "تم الشراء بنجاح!" : "جارٍ تأكيد الطلب..."}</h2>
        <div className="mb-3">
          {confirmed ? (
            <span className="text-success display-4">✔️</span>
          ) : (
            <span className="spinner-border text-primary" style={{width:48, height:48}}></span>
          )}
        </div>
        <p className="lead">{confirmed ? "تم إضافة طلبك إلى قسم طلباتي." : "يرجى الانتظار قليلاً..."}</p>
      </div>
    </div>
  );
} 