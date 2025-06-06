import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Grid,
  Paper,
} from '@mui/material';

const InvoicePrint = React.forwardRef(({ order }, ref) => {
  if (!order) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box
      ref={ref}
      sx={{
        p: 4,
        backgroundColor: 'white',
        color: 'black',
        direction: 'rtl',
        fontFamily: '"Times New Roman", "Arial", "Tahoma", sans-serif',
        maxWidth: '800px',
        minHeight: '1000px',
        margin: '0 auto',
        position: 'relative',
        boxShadow: '0 0 20px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        overflow: 'hidden',
        '@media print': {
          p: 2,
          margin: 0,
          boxShadow: 'none !important',
          backgroundColor: 'white !important',
          borderRadius: '0 !important',
          maxWidth: 'none !important',
          minHeight: 'auto !important',
        }
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight="bold" sx={{ mb: 1, color: '#1976d2' }}>
          متجر إلكتروني
        </Typography>
        <Typography variant="h6" color="text.secondary">
          فاتورة مبيعات
        </Typography>
        <Box
          sx={{
            width: '100px',
            height: '4px',
            background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
            margin: '16px auto',
            borderRadius: '2px'
          }}
        />
      </Box>

      {/* Invoice Details */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={6}>
          <Paper elevation={2} sx={{ p: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="#1976d2">
              معلومات الفاتورة
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography fontWeight="500">رقم الفاتورة:</Typography>
                <Typography fontWeight="bold">{order.orderNumber}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography fontWeight="500">التاريخ:</Typography>
                <Typography>{formatDate(order.createdAt)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography fontWeight="500">الوقت:</Typography>
                <Typography>{formatTime(order.createdAt)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography fontWeight="500">حالة الدفع:</Typography>
                <Typography fontWeight="bold" color={order.paymentStatus === 'paid' ? 'green' : 'orange'}>
                  {order.paymentStatus === 'paid' ? 'مدفوع' : 'معلق'}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={6}>
          <Paper elevation={2} sx={{ p: 3, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              معلومات العميل
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography fontWeight="bold" variant="subtitle1">
                {order.customer.name}
              </Typography>
              <Typography>{order.customer.email}</Typography>
              <Typography>{order.customer.phone}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Shipping Address */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          عنوان التسليم
        </Typography>
        <Typography>
          {order.shippingAddress.street}<br/>
          {order.shippingAddress.city}, {order.shippingAddress.state}<br/>
          {order.shippingAddress.zipCode}<br/>
          {order.shippingAddress.country}
        </Typography>
      </Paper>

      {/* Items Table */}
      <Paper elevation={3} sx={{ mb: 4 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1976d2' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>م</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>اسم المنتج</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>الكمية</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>السعر</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>المجموع</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.items.map((item, index) => (
                <TableRow key={item._id} sx={{ '&:nth-of-type(even)': { backgroundColor: '#f5f5f5' } }}>
                  <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography fontWeight="bold">{item.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        SKU: {item.sku}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', fontWeight: '500' }}>
                    {item.quantity}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', fontWeight: '500' }}>
                    ${item.price.toFixed(2)}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', color: '#1976d2' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Summary */}
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <Paper elevation={2} sx={{ p: 3, background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              معلومات إضافية
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography fontWeight="500">طريقة الدفع:</Typography>
                <Typography>{order.paymentMethod}</Typography>
              </Box>
              {order.trackingNumber && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography fontWeight="500">رقم التتبع:</Typography>
                  <Typography fontWeight="bold">{order.trackingNumber}</Typography>
                </Box>
              )}
              {order.estimatedDelivery && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography fontWeight="500">تاريخ التسليم المتوقع:</Typography>
                  <Typography>{formatDate(order.estimatedDelivery)}</Typography>
                </Box>
              )}
            </Box>
            {order.notes && (
              <Box sx={{ mt: 2 }}>
                <Typography fontWeight="500" gutterBottom>ملاحظات:</Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  {order.notes}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={4}>
          <Paper elevation={3} sx={{ p: 3, background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom textAlign="center">
              ملخص المبالغ
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>المجموع الفرعي:</Typography>
                <Typography fontWeight="500">${order.subtotal.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>الضريبة:</Typography>
                <Typography fontWeight="500">${order.tax.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>الشحن:</Typography>
                <Typography fontWeight="500">${order.shipping.toFixed(2)}</Typography>
              </Box>
              {order.discount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>الخصم:</Typography>
                  <Typography fontWeight="500" color="green">
                    -${order.discount.toFixed(2)}
                  </Typography>
                </Box>
              )}
              <Divider sx={{ my: 1, backgroundColor: '#1976d2' }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, backgroundColor: '#1976d2', borderRadius: 2, color: 'white' }}>
                <Typography variant="h6" fontWeight="bold">المجموع الكلي:</Typography>
                <Typography variant="h6" fontWeight="bold">
                  ${order.total.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Footer */}
      <Box sx={{ mt: 6, pt: 3, borderTop: '2px solid #1976d2', textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          شكراً لكم لتسوقكم معنا!
        </Typography>
        <Typography variant="caption" color="text.secondary">
          تم إنشاء هذه الفاتورة في {formatDate(new Date())} - {formatTime(new Date())}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            للاستفسارات: support@ecommerce.com | +966 12 345 6789
          </Typography>
        </Box>
      </Box>
    </Box>
  );
});

InvoicePrint.displayName = 'InvoicePrint';

export default InvoicePrint; 