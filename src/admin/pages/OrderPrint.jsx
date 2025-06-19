import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const OrderPrint = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then(res => res.json())
      .then(data => setOrder(data.data || data))
      .catch(() => setOrder(null));
  }, [id]);

  useEffect(() => {
    if (order) {
      setTimeout(() => window.print(), 500);
    }
  }, [order]);

  if (!order) return <div>Loading...</div>;

  return (
    <div style={{ padding: 40, fontFamily: 'Cairo, Arial, sans-serif', direction: 'rtl', background: '#fff' }}>
      <h2 style={{ textAlign: 'center', color: '#1976d2' }}>فاتورة الطلب</h2>
      <div>
        <b>رقم الطلب:</b> {order._id}<br />
        <b>اسم العميل:</b> {order.name}<br />
        <b>البريد الإلكتروني:</b> {order.email}<br />
        <b>رقم الهاتف:</b> {order.phone}<br />
        <b>العنوان:</b> {order.address}<br />
        <b>المدينة:</b> {order.city}<br />
        <b>تاريخ الطلب:</b> {new Date(order.createdAt).toLocaleDateString('ar-EG')}
      </div>
      <hr />
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
        <thead>
          <tr style={{ background: '#f2f2f2' }}>
            <th>المنتج</th>
            <th>الكمية</th>
            <th>السعر</th>
            <th>الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          {order.cartItems.map((item, idx) => (
            <tr key={idx}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.price} ج.م</td>
              <td>{item.price * item.quantity} ج.م</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 style={{ textAlign: 'left', marginTop: 30 }}>الإجمالي: {order.total} ج.م</h3>
    </div>
  );
};

export default OrderPrint; 