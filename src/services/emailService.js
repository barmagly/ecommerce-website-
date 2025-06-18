export const generateOrderConfirmationEmailHTML = (order, isAdminCopy = false) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'قيد الانتظار';
      case 'confirmed':
        return 'مؤكدة';
      case 'shipped':
        return 'تم الشحن';
      case 'delivered':
        return 'تم التوصيل';
      case 'cancelled':
        return 'ملغية';
      default:
        return status;
    }
  };

  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case 'credit_card':
        return 'بطاقة ائتمان';
      case 'bank_transfer':
        return 'تحويل بنكي';
      case 'cash_on_delivery':
        return 'الدفع عند الاستلام';
      default:
        return method;
    }
  };

  const getPaymentStatusLabel = (status) => {
    switch (status) {
      case 'paid':
        return 'تم الدفع';
      case 'pending':
        return 'في انتظار الدفع';
      case 'failed':
        return 'فشل الدفع';
      default:
        return status;
    }
  };

  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>تأكيد الطلب - ${order._id?.slice(-6) || 'temp'}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Arial', 'Tahoma', 'Segoe UI', sans-serif;
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }
        
        .email-wrapper {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          min-height: 100vh;
        }
        
        .email-container {
          max-width: 800px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        .header {
          background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
          padding: 40px 30px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        
        .header::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="10" cy="60" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="90" cy="40" r="0.5" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.3;
        }
        
        .header-content {
          position: relative;
          z-index: 1;
        }
        
        .logo {
          font-size: 32px;
          font-weight: bold;
          color: #ffffff;
          margin-bottom: 10px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .order-title {
          font-size: 28px;
          color: #ffffff;
          margin-bottom: 15px;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }
        
        .order-number {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
          padding: 10px 20px;
          border-radius: 25px;
          font-size: 18px;
          font-weight: bold;
          display: inline-block;
          backdrop-filter: blur(10px);
        }
        
        .status-banner {
          background: ${order.paymentStatus === 'paid' ? 
            'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' : 
            'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)'};
          color: white;
          padding: 20px;
          text-align: center;
          font-weight: bold;
          font-size: 18px;
          position: relative;
          overflow: hidden;
        }
        
        .status-banner::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          animation: shine 2s infinite;
        }
        
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        .content-section {
          background: #ffffff;
          padding: 30px;
          margin: 0;
        }
        
        .section-title {
          color: #FF6B35;
          margin: 0 0 25px 0;
          font-size: 22px;
          font-weight: bold;
          position: relative;
          padding-bottom: 15px;
        }
        
        .section-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          right: 0;
          width: 60px;
          height: 3px;
          background: linear-gradient(135deg, #FF6B35, #F7931E);
          border-radius: 2px;
        }
        
        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 30px;
        }
        
        .info-card {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 20px;
          border-radius: 15px;
          border: 1px solid #e9ecef;
        }
        
        .info-item {
          margin-bottom: 15px;
          padding: 10px 0;
          border-bottom: 1px solid #e9ecef;
        }
        
        .info-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }
        
        .info-label {
          font-weight: bold;
          color: #495057;
          margin-bottom: 5px;
        }
        
        .info-value {
          color: #212529;
          font-size: 16px;
        }
        
        .products-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .products-table th {
          background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
          color: white;
          padding: 15px;
          text-align: center;
          font-weight: bold;
          font-size: 14px;
        }
        
        .products-table td {
          padding: 15px;
          border-bottom: 1px solid #e9ecef;
          text-align: center;
        }
        
        .products-table tr:nth-child(even) {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }
        
        .products-table tr:hover {
          background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
        }
        
        .total-section {
          background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
          color: white;
          padding: 25px;
          border-radius: 15px;
          margin-top: 30px;
          box-shadow: 0 10px 25px rgba(255, 107, 53, 0.3);
        }
        
        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          font-size: 16px;
        }
        
        .total-row:last-child {
          margin-bottom: 0;
          font-size: 20px;
          font-weight: bold;
          border-top: 2px solid rgba(255, 255, 255, 0.3);
          padding-top: 15px;
        }
        
        .footer {
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        
        .footer-content {
          max-width: 600px;
          margin: 0 auto;
        }
        
        .footer-title {
          font-size: 20px;
          margin-bottom: 15px;
          color: #FF6B35;
        }
        
        .footer-text {
          margin-bottom: 20px;
          line-height: 1.6;
        }
        
        .contact-info {
          background: rgba(255, 255, 255, 0.1);
          padding: 20px;
          border-radius: 10px;
          margin-top: 20px;
        }
        
        .contact-item {
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        
        .contact-item:last-child {
          margin-bottom: 0;
        }
        
        .admin-badge {
          background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
          color: white;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          margin-bottom: 15px;
          display: inline-block;
        }
        
        @media (max-width: 600px) {
          .email-wrapper {
            padding: 10px;
          }
          
          .header {
            padding: 30px 20px;
          }
          
          .logo {
            font-size: 24px;
          }
          
          .order-title {
            font-size: 20px;
          }
          
          .grid-2 {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .content-section {
            padding: 20px;
          }
          
          .products-table {
            font-size: 12px;
          }
          
          .products-table th,
          .products-table td {
            padding: 10px 5px;
          }
          
          .total-section {
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="email-container">
          <!-- Header -->
          <div class="header">
            <div class="header-content">
              ${isAdminCopy ? '<div class="admin-badge">نسخة إدارية</div>' : ''}
              <div class="logo">🛍️ المتجر الإلكتروني</div>
              <h1 class="order-title">تأكيد الطلب</h1>
              <div class="order-number">رقم الطلب: #${order._id?.slice(-6) || 'temp'}</div>
            </div>
          </div>

          <!-- Status Banner -->
          <div class="status-banner">
            ${order.paymentStatus === 'paid' ? '✅ تم الدفع بنجاح' : '⏳ في انتظار الدفع'}
          </div>

          <!-- Order Details -->
          <div class="content-section">
            <h3 class="section-title">📋 تفاصيل الطلب</h3>
            
            <div class="grid-2">
              <div class="info-card">
                <h4 style="color: #FF6B35; margin-bottom: 20px; font-size: 18px;">👤 معلومات العميل</h4>
                <div class="info-item">
                  <div class="info-label">الاسم:</div>
                  <div class="info-value">${order.name}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">البريد الإلكتروني:</div>
                  <div class="info-value">${order.email}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">رقم الهاتف:</div>
                  <div class="info-value">${order.phone}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">العنوان:</div>
                  <div class="info-value">${order.address}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">المدينة:</div>
                  <div class="info-value">${order.city || 'نجع حمادي'}</div>
                </div>
              </div>
              
              <div class="info-card">
                <h4 style="color: #FF6B35; margin-bottom: 20px; font-size: 18px;">📦 تفاصيل الشحن</h4>
                <div class="info-item">
                  <div class="info-label">تاريخ الطلب:</div>
                  <div class="info-value">${formatDate(order.createdAt)}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">طريقة الدفع:</div>
                  <div class="info-value">${getPaymentMethodLabel(order.paymentMethod)}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">حالة الدفع:</div>
                  <div class="info-value">${getPaymentStatusLabel(order.paymentStatus)}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">مصاريف الشحن:</div>
                  <div class="info-value">${Number(order.shippingCost) > 0 ? order.shippingCost :
                    order.cartItems?.reduce((total, item) => 
                      total + (Number(item?.shippingCost || item?.prdID?.shippingCost) || 0), 0)} ج.م</div>
                </div>
                <div class="info-item">
                  <div class="info-label">مدة التوصيل:</div>
                  <div class="info-value">${Number(order.deliveryDays) > 0 ? order.deliveryDays :
                    Math.max(...(order.cartItems?.map(item => 
                      Number(item?.deliveryDays || item?.prdID?.deliveryDays) || 2) || [2]))} يوم</div>
                </div>
              </div>
            </div>

            <!-- Products Section -->
            <h3 class="section-title">🛍️ المنتجات المطلوبة</h3>
            <div class="table-responsive">
              <table class="products-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>المنتج</th>
                    <th>الكمية</th>
                    <th>السعر</th>
                    <th>الإجمالي</th>
                    <th>مصاريف الشحن</th>
                    <th>مدة التوصيل</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.cartItems?.map((item, index) => `
                    <tr>
                      <td style="text-align: center; font-weight: bold; color: #FF6B35;">${index + 1}</td>
                      <td>
                        <strong>${item.name || item.prdID?.name}</strong>
                        ${item.prdID?.sku ? `<br><small style="color: #666;">SKU: ${item.prdID.sku}</small>` : ''}
                      </td>
                      <td style="text-align: center;">${item.quantity}</td>
                      <td style="text-align: center;">${item.price || item.prdID?.price} ج.م</td>
                      <td style="text-align: center; font-weight: bold;">${((item.price || item.prdID?.price) * item.quantity).toFixed(2)} ج.م</td>
                      <td style="text-align: center;">${item.shippingCost || item.prdID?.shippingCost || 0} ج.م</td>
                      <td style="text-align: center;">${item.deliveryDays || item.prdID?.deliveryDays || 2} يوم</td>
                    </tr>
                  `).join('') || ''}
                </tbody>
              </table>
            </div>

            <!-- Total Section -->
            <div class="total-section">
              <div class="total-row">
                <span>الإجمالي الفرعي:</span>
                <span>${((order.total || 0) - (Number(order.shippingCost) > 0 ? order.shippingCost : 
                  order.cartItems?.reduce((total, item) => 
                    total + (Number(item?.shippingCost || item?.prdID?.shippingCost) || 0), 0))).toFixed(2)} ج.م</span>
              </div>
              <div class="total-row">
                <span>مصاريف الشحن:</span>
                <span>${Number(order.shippingCost) > 0 ? order.shippingCost : 
                  order.cartItems?.reduce((total, item) => 
                    total + (Number(item?.shippingCost || item?.prdID?.shippingCost) || 0), 0)} ج.م</span>
              </div>
              <div class="total-row">
                <span>الإجمالي الكلي:</span>
                <span>${order.total} ج.م</span>
              </div>
            </div>

            ${order.notes ? `
              <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); padding: 20px; border-radius: 15px; margin-top: 30px; border-right: 4px solid #2196F3;">
                <h4 style="color: #1976d2; margin-bottom: 10px;">📝 ملاحظات إضافية:</h4>
                <p style="color: #1565c0; margin: 0; line-height: 1.6;">${order.notes}</p>
              </div>
            ` : ''}
          </div>

          <!-- Footer -->
          <div class="footer">
            <div class="footer-content">
              <h3 class="footer-title">شكراً لك على طلبك! 🙏</h3>
              <p class="footer-text">
                نعتذر عن أي تأخير قد يحدث في التوصيل. سنقوم بتحديث حالة طلبك عبر البريد الإلكتروني أو الهاتف.
              </p>
              
              <div class="contact-info">
                <h4 style="margin-bottom: 15px; color: #FF6B35;">📞 معلومات التواصل</h4>
                <div class="contact-item">
                  <span>📧 البريد الإلكتروني:</span>
                  <span>support@mizanoo.com</span>
                </div>
                <div class="contact-item">
                  <span>📱 رقم الهاتف:</span>
                  <span>01092474959</span>
                </div>
                <div class="contact-item">
                  <span>📍 العنوان:</span>
                  <span>نجع حمادي، مصر</span>
                </div>
              </div>
              
              <p style="margin-top: 20px; font-size: 12px; opacity: 0.8;">
                تم إنشاء هذه الفاتورة في ${new Date().toLocaleDateString('ar-EG')} • نظام إدارة المبيعات
              </p>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const generateOrderConfirmationEmailText = (order) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-EG');
  };

  return `
تأكيد الطلب

مرحباً ${order.name}،

شكراً لك على طلبك من المتجر الإلكتروني.

تفاصيل الطلب:
- رقم الطلب: ${order._id?.slice(-6) || 'temp'}
- تاريخ الطلب: ${formatDate(order.createdAt)}
- المجموع: ${order.total} ج.م
- طريقة الدفع: ${order.paymentMethod}
- حالة الدفع: ${order.paymentStatus}

المنتجات المطلوبة:
${order.cartItems?.map((item, index) => 
  `${index + 1}. ${item.prdID.name} - الكمية: ${item.quantity} - السعر: ${item.prdID.price} ج.م`
).join('\n')}

معلومات التوصيل:
- الاسم: ${order.name}
- الهاتف: ${order.phone}
- العنوان: ${order.address}
- المدينة: ${order.city || 'نجع حمادي'}

سيتم التواصل معك قريباً لتأكيد الطلب وتحديد موعد التسليم.

شكراً لثقتكم بنا!

المتجر الإلكتروني
📧 support@mizanoo.com
📱 01092474959
  `.trim();
}; 