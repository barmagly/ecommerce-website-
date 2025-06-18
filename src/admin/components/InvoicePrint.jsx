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
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box
      ref={ref}
      sx={{
        p: 0,
        backgroundColor: '#ffffff',
        color: '#333333',
        direction: 'rtl',
        fontFamily: '"Arial", "Tahoma", sans-serif',
        maxWidth: '800px',
        minHeight: '1000px',
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden',
        '@media print': {
          p: 0,
          margin: 0,
          maxWidth: 'none',
          minHeight: 'auto',
        }
      }}
    >
      {/* Header Section with Gradient */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #9C27B0 100%)',
        color: 'white',
        p: 4,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '200px',
          height: '200px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          transform: 'translate(50%, -50%)'
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '150px',
          height: '150px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '50%',
          transform: 'translate(-50%, 50%)'
        }
      }}>
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 'bold',
                mb: 1,
                fontSize: { xs: '2rem', md: '2.5rem' },
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              المتجر الإلكتروني
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                opacity: 0.9,
                fontSize: '1.1rem',
                fontWeight: '300'
              }}
            >
              فاتورة مبيعات • تجارة إلكترونية موثوقة
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 'bold',
                  mb: 1,
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                فاتورة
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  opacity: 0.9,
                  fontSize: '1rem'
                }}
              >
                #{order.orderNumber}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Status Banner */}
      <Box sx={{
        background: order.paymentStatus === 'paid' 
          ? 'linear-gradient(90deg, #4CAF50, #66BB6A)' 
          : 'linear-gradient(90deg, #FF9800, #FFB74D)',
        color: 'white',
        py: 1,
        px: 4,
        textAlign: 'center'
      }}>
        <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
          {order.paymentStatus === 'paid' ? '✓ تم الدفع بنجاح' : '⏳ في انتظار الدفع'}
        </Typography>
      </Box>

      {/* Content Container */}
      <Box sx={{ p: 4 }}>
        
        {/* Invoice Info Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3,
                border: '2px solid #FF6B35',
                borderRadius: '12px',
                background: 'linear-gradient(145deg, #FFF8F5, #FFFFFF)'
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#FF6B35',
                  fontWeight: 'bold',
                  mb: 2,
                  borderBottom: '2px solid #FF6B35',
                  pb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                📋 تفاصيل الفاتورة
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: '#666', fontWeight: '500' }}>رقم الفاتورة:</Typography>
                  <Typography sx={{ fontWeight: 'bold', color: '#FF6B35' }}>{order.orderNumber}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: '#666', fontWeight: '500' }}>التاريخ:</Typography>
                  <Typography sx={{ fontWeight: '500' }}>{formatDate(order.createdAt)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: '#666', fontWeight: '500' }}>الوقت:</Typography>
                  <Typography sx={{ fontWeight: '500' }}>{formatTime(order.createdAt)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: '#666', fontWeight: '500' }}>طريقة الدفع:</Typography>
                  <Typography sx={{ fontWeight: 'bold', color: '#9C27B0' }}>{order.paymentMethod}</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3,
                border: '2px solid #9C27B0',
                borderRadius: '12px',
                background: 'linear-gradient(145deg, #F8F5FF, #FFFFFF)'
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#9C27B0',
                  fontWeight: 'bold',
                  mb: 2,
                  borderBottom: '2px solid #9C27B0',
                  pb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                👤 بيانات العميل
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#333' }}>
                  {order.customer.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ color: '#666' }}>📧</Typography>
                  <Typography sx={{ color: '#666' }}>{order.customer.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ color: '#666' }}>📱</Typography>
                  <Typography sx={{ color: '#666' }}>{order.customer.phone}</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Shipping Address */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            mb: 4,
            border: '2px solid #4CAF50',
            borderRadius: '12px',
            background: 'linear-gradient(145deg, #F1F8E9, #FFFFFF)'
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#4CAF50',
              fontWeight: 'bold',
              mb: 2,
              borderBottom: '2px solid #4CAF50',
              pb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            🚚 عنوان التسليم
          </Typography>
          <Typography sx={{ fontSize: '1rem', lineHeight: 1.8, color: '#333' }}>
            {order.shippingAddress.street}<br/>
            {order.shippingAddress.city}, {order.shippingAddress.state}<br/>
            {order.shippingAddress.zipCode} - {order.shippingAddress.country}
          </Typography>
          {order.trackingNumber && (
            <Box sx={{ 
              mt: 2, 
              p: 2, 
              backgroundColor: '#E8F5E8', 
              borderRadius: '8px',
              border: '1px solid #4CAF50'
            }}>
              <Typography sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
                📦 رقم التتبع: {order.trackingNumber}
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Products Table */}
        <Paper 
          elevation={0}
          sx={{ 
            mb: 4, 
            overflow: 'hidden', 
            borderRadius: '12px',
            border: '2px solid #E0E0E0'
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ 
                  background: 'linear-gradient(135deg, #FF6B35, #9C27B0)',
                }}>
                  <TableCell sx={{ 
                    color: 'white', 
                    fontWeight: 'bold', 
                    textAlign: 'center',
                    fontSize: '1rem',
                    py: 2
                  }}>
                    م
                  </TableCell>
                  <TableCell sx={{ 
                    color: 'white', 
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    py: 2
                  }}>
                    المنتج
                  </TableCell>
                  <TableCell sx={{ 
                    color: 'white', 
                    fontWeight: 'bold', 
                    textAlign: 'center',
                    fontSize: '1rem',
                    py: 2
                  }}>
                    الكمية
                  </TableCell>
                  <TableCell sx={{ 
                    color: 'white', 
                    fontWeight: 'bold', 
                    textAlign: 'center',
                    fontSize: '1rem',
                    py: 2
                  }}>
                    السعر
                  </TableCell>
                  <TableCell sx={{ 
                    color: 'white', 
                    fontWeight: 'bold', 
                    textAlign: 'center',
                    fontSize: '1rem',
                    py: 2
                  }}>
                    الإجمالي
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.items.map((item, index) => (
                  <TableRow 
                    key={item._id} 
                    sx={{ 
                      '&:nth-of-type(even)': { 
                        backgroundColor: '#FAFAFA' 
                      },
                      borderBottom: '1px solid #E0E0E0'
                    }}
                  >
                    <TableCell sx={{ 
                      textAlign: 'center', 
                      fontWeight: 'bold',
                      color: '#FF6B35',
                      fontSize: '1.1rem',
                      py: 2
                    }}>
                      {index + 1}
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Box>
                        <Typography sx={{ fontWeight: 'bold', mb: 0.5, color: '#333' }}>
                          {item.name}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: '#9C27B0',
                            backgroundColor: '#F3E5F5',
                            px: 1,
                            py: 0.5,
                            borderRadius: '4px',
                            display: 'inline-block',
                            fontWeight: '500'
                          }}
                        >
                          {item.sku}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ 
                      textAlign: 'center', 
                      fontWeight: '600',
                      fontSize: '1rem',
                      py: 2
                    }}>
                      {item.quantity}
                    </TableCell>
                    <TableCell sx={{ 
                      textAlign: 'center', 
                      fontWeight: '600',
                      fontSize: '1rem',
                      py: 2
                    }}>
                      ${item.price.toFixed(2)}
                    </TableCell>
                    <TableCell sx={{ 
                      textAlign: 'center', 
                      fontWeight: 'bold', 
                      color: '#FF6B35',
                      fontSize: '1.1rem',
                      py: 2
                    }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Summary Section */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 7 }}>
            {order.notes && (
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3,
                  border: '2px solid #FFC107',
                  borderRadius: '12px',
                  background: 'linear-gradient(145deg, #FFFBF0, #FFFFFF)',
                  mb: 3
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#FF8F00',
                    fontWeight: 'bold',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  📝 ملاحظات خاصة
                </Typography>
                <Typography 
                  sx={{ 
                    fontStyle: 'italic',
                    color: '#666',
                    lineHeight: 1.6,
                    fontSize: '1rem'
                  }}
                >
                  "{order.notes}"
                </Typography>
              </Paper>
            )}
            
            {order.estimatedDelivery && (
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3,
                  border: '2px solid #2196F3',
                  borderRadius: '12px',
                  background: 'linear-gradient(145deg, #E3F2FD, #FFFFFF)'
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#1976D2',
                    fontWeight: 'bold',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  🕐 موعد التسليم
                </Typography>
                <Typography sx={{ fontWeight: '600', color: '#333', fontSize: '1rem' }}>
                  {formatDate(order.estimatedDelivery)}
                </Typography>
              </Paper>
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Paper 
              elevation={0}
              sx={{ 
                overflow: 'hidden',
                borderRadius: '12px',
                border: '2px solid #9C27B0'
              }}
            >
              {/* Header */}
              <Box sx={{
                background: 'linear-gradient(135deg, #9C27B0, #E91E63)',
                color: 'white',
                p: 2,
                textAlign: 'center'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  💰 ملخص المبالغ
                </Typography>
              </Box>
              
              {/* Content */}
              <Box sx={{ p: 3, backgroundColor: '#FFFFFF' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                    <Typography sx={{ fontWeight: '600', color: '#666' }}>المجموع الفرعي:</Typography>
                    <Typography sx={{ fontWeight: '600' }}>${order.subtotal.toFixed(2)}</Typography>
                  </Box>
                  <Divider sx={{ borderColor: '#E0E0E0' }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                    <Typography sx={{ fontWeight: '600', color: '#666' }}>الضريبة:</Typography>
                    <Typography sx={{ fontWeight: '600' }}>${order.tax.toFixed(2)}</Typography>
                  </Box>
                  <Divider sx={{ borderColor: '#E0E0E0' }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                    <Typography sx={{ fontWeight: '600', color: '#666' }}>الشحن:</Typography>
                    <Typography sx={{ fontWeight: '600' }}>${order.shipping.toFixed(2)}</Typography>
                  </Box>
                  
                  {order.discount > 0 && (
                    <>
                      <Divider sx={{ borderColor: '#E0E0E0' }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                        <Typography sx={{ fontWeight: '600', color: '#666' }}>الخصم:</Typography>
                        <Typography sx={{ fontWeight: '600', color: '#4CAF50' }}>
                          -${order.discount.toFixed(2)}
                        </Typography>
                      </Box>
                    </>
                  )}
                </Box>
                
                {/* Total */}
                <Box sx={{ 
                  mt: 3,
                  p: 2, 
                  background: 'linear-gradient(135deg, #FF6B35, #9C27B0)',
                  borderRadius: '8px',
                  color: 'white'
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      الإجمالي النهائي:
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      ${order.total.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Footer */}
      <Box sx={{ 
        mt: 4,
        background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #9C27B0 100%)',
        color: 'white',
        p: 3,
        textAlign: 'center'
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 'bold',
            mb: 2
          }}
        >
          شكراً لثقتكم بنا! 🙏
        </Typography>
        
        <Grid container spacing={2} justifyContent="center" sx={{ mb: 2 }}>
          <Grid size="auto">
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              📧 support@mizanoo.com
            </Typography>
          </Grid>
          <Grid size="auto">
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              📱 +966-11-1234567
            </Typography>
          </Grid>
          <Grid size="auto">
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              🌐 www.store.com
            </Typography>
          </Grid>
        </Grid>
        
                 <Typography variant="caption" sx={{ opacity: 0.8, display: 'block' }}>
           تم إنشاء هذه الفاتورة في {new Date().toLocaleDateString('ar-EG', { calendar: 'gregory', year: 'numeric', month: 'long', day: 'numeric' })} • نظام إدارة المبيعات
         </Typography>
      </Box>
    </Box>
  );
});

InvoicePrint.displayName = 'InvoicePrint';

export default InvoicePrint; 