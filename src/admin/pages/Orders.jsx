import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Grid,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  useTheme,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Stack,
  TablePagination,
  Menu,
  ListItemIcon,
  Tooltip,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import InvoicePrint from '../components/InvoicePrint';
import { exportInvoiceAsPDF, printInvoice } from '../components/InvoiceExporter';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  ShoppingCart as OrdersIcon,
  CheckCircle as CheckCircleIcon,
  Schedule,
  LocalShipping,
  Cancel as CancelIcon,
  AttachMoney,
  TrendingUp,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  Delete as DeleteIcon,
  Assignment as InvoiceIcon,
  PictureAsPdf as PdfIcon,
  Download as DownloadIcon,
  TableChart as ExportIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Payment as PaymentIcon,
  Person as PersonIcon,
  ShoppingCart as ShoppingCartIcon,
  AccessTime as AccessTimeIcon,
  ShoppingBag as ShoppingBagIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { fetchOrders, updateOrderStatus, deleteOrder } from '../store/slices/ordersSlice';
import { updateOrderShippingDetailsThunk, sendOrderConfirmationEmailThunk } from '../../services/Slice/order/order';

const POLLING_INTERVAL = 30000; // Poll every 30 seconds

const Orders = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const pollingInterval = useRef(null);

  const { items: orders, loading, error, stats } = useSelector(state => state.orders || { items: [], loading: false, error: null, stats: { total: 0, statusCounts: {}, paymentStatusCounts: {} } });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('All');
  const [actionLoading, setActionLoading] = useState({ id: null, type: null });

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [editOrderOpen, setEditOrderOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderToPrint, setOrderToPrint] = useState(null);

  // Print functionality
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `فاتورة-${orderToPrint?.orderNumber || 'غير محدد'}`,
    onAfterPrint: () => {
      setOrderToPrint(null);
    },
  });

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('view');

  // Form state
  const [formData, setFormData] = useState({
    status: '',
    paymentStatus: '',
    isDelivered: false,
    deliveredAt: '',
  });

  // Start polling for orders
  const startPolling = useCallback(() => {
    if (pollingInterval.current) return;
    
    // Initial fetch
    dispatch(fetchOrders());
    
    // Set up polling
    pollingInterval.current = setInterval(() => {
      dispatch(fetchOrders());
    }, POLLING_INTERVAL);
  }, [dispatch]);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }
  }, []);

  useEffect(() => {
    startPolling();
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  // Utility functions
  const getStatusLabel = (status) => {
    const statusMap = {
      pending: 'قيد الانتظار',
      processing: 'قيد المعالجة',
      shipped: 'تم الشحن',
      delivered: 'تم التوصيل',
      cancelled: 'ملغي'
    };
    return statusMap[status] || status;
  };

  const getPaymentStatusLabel = (status) => {
    const statusMap = {
      pending: 'قيد الانتظار',
      paid: 'مدفوع',
      failed: 'فشل',
      refunded: 'مسترد'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      pending: 'warning',
      processing: 'info',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'error'
    };
    return colorMap[status] || 'default';
  };

  const getPaymentStatusColor = (status) => {
    const colorMap = {
      pending: 'warning',
      paid: 'success',
      failed: 'error',
      refunded: 'info'
    };
    return colorMap[status] || 'default';
  };

  const getPaymentMethodLabel = (method) => {
    const methodMap = {
      paypal: 'باي بال',
      bank_transfer: 'تحويل بنكي',
      cash_on_delivery: 'الدفع عند الاستلام'
    };
    return methodMap[method] || method;
  };

  // Filter and sort orders based on search and filters
  const sortedAndFilteredOrders = orders
    .filter(order => {
      if (!order) return false;

      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch =
        (order.name?.toLowerCase() || '').includes(searchTermLower) ||
        (order.email?.toLowerCase() || '').includes(searchTermLower) ||
        (order.phone || '').includes(searchTerm) ||
        (order._id || '').includes(searchTerm);

      const matchesStatus = selectedStatus === 'All' || order.status === selectedStatus;
      const matchesPaymentStatus = selectedPaymentStatus === 'All' || order.paymentStatus === selectedPaymentStatus;

      return matchesSearch && matchesStatus && matchesPaymentStatus;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by newest first

  // Event handlers
  const handleViewOrder = (order) => {
    if (order && order._id) {
      setSelectedOrder(order);
      setOrderDetailsOpen(true);
    }
  };

  const handleEditOrder = (order) => {
    if (order && order._id) {
      setSelectedOrder(order);
      setEditOrderOpen(true);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      setActionLoading({ id: orderId, type: 'status' });
      await dispatch(updateOrderStatus({ id: orderId, status: newStatus })).unwrap();
      toast.success('تم تحديث حالة الطلب بنجاح');
    } catch (error) {
      toast.error(error.message || 'فشل تحديث حالة الطلب');
    } finally {
      setActionLoading({ id: null, type: null });
      setMenuAnchorEl(null);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;

    try {
      setActionLoading({ id: orderId, type: 'delete' });
      await dispatch(deleteOrder(orderId)).unwrap();
      toast.success('تم حذف الطلب بنجاح');
    } catch (error) {
      toast.error(error.message || 'فشل حذف الطلب');
    } finally {
      setActionLoading({ id: null, type: null });
      setMenuAnchorEl(null);
    }
  };

  const handleMenuClick = (event, orderId) => {
    setSelectedOrderId(orderId);
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handlePrintInvoice = (order) => {
    if (order && order._id) {
      setOrderToPrint(order);
      setTimeout(() => {
        handlePrint();
      }, 100);
    }
  };

  const handleExportPDF = async (order) => {
    try {
      if (!order || !order._id) {
        toast.error('لا توجد بيانات صحيحة للطلب');
        return;
      }
      
      setActionLoading({ id: order._id, type: 'pdf' });
      const result = await exportInvoiceAsPDF(order);
      if (result.success) {
        toast.success('تم تصدير الفاتورة بنجاح');
      } else {
        throw new Error(result.error || 'فشل تصدير الفاتورة');
      }
    } catch (error) {
      toast.error(error.message || 'فشل تصدير الفاتورة');
    } finally {
      setActionLoading({ id: null, type: null });
    }
  };

  const handleDownloadOrder = (order) => {
    try {
      if (!order || !order._id) {
        toast.error('لا توجد بيانات صحيحة للطلب');
        return;
      }
      
      setActionLoading({ id: order._id, type: 'download' });
      
      // تحضير بيانات الطلب للتحميل
      const orderData = {
        orderNumber: order._id,
        customerName: order.name,
        customerEmail: order.email,
        customerPhone: order.phone,
        orderDate: new Date(order.createdAt).toLocaleDateString('ar-EG'),
        status: getStatusLabel(order.status),
        paymentStatus: getPaymentStatusLabel(order.paymentStatus),
        paymentMethod: getPaymentMethodLabel(order.paymentMethod),
        items: order.cartItems.map(item => ({
          name: item.prdID.name,
          price: item.prdID.price,
          quantity: item.quantity,
          total: item.prdID.price * item.quantity
        })),
        subtotal: order.subtotal,
        shippingCost: order.shippingCost,
        total: order.total
      };

      // تحويل البيانات إلى JSON
      const dataStr = JSON.stringify(orderData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      // إنشاء رابط التحميل
      const url = window.URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `order-${order._id}.json`;
      
      // تنفيذ التحميل
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('تم تحميل بيانات الطلب بنجاح');
    } catch (error) {
      toast.error('فشل تحميل بيانات الطلب');
    } finally {
      setActionLoading({ id: null, type: null });
    }
  };

  const handleSendEmail = async (order) => {
    try {
      setActionLoading({ id: order._id, type: 'email' });
      
      // Send to customer
      await dispatch(sendOrderConfirmationEmailThunk({
        orderId: order._id,
        email: order.email
      })).unwrap();
      
      // Send copy to admin
      await dispatch(sendOrderConfirmationEmailThunk({
        orderId: order._id,
        email: 'support@mizanoo.com',
        isAdminCopy: true
      })).unwrap();
      
      toast.success('تم إرسال البريد الإلكتروني بنجاح');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('فشل في إرسال البريد الإلكتروني');
    } finally {
      setActionLoading({ id: null, type: null });
    }
  };

  const handlePrintReport = () => {
    toast.info('طباعة تقرير الطلبات...');
  };

  const handleStatusChange = (newStatus) => {
    setSelectedOrder(prev => ({
      ...prev,
      status: newStatus
    }));
  };

  const handlePaymentStatusChange = (newStatus) => {
    setSelectedOrder(prev => ({
      ...prev,
      paymentStatus: newStatus
    }));
  };

  const handleUpdateOrder = async () => {
    try {
      if (!selectedOrder || !selectedOrder._id) {
        toast.error('لا توجد بيانات صحيحة للطلب');
        return;
      }
      
      dispatch(updateOrderStatus({
        id: selectedOrder._id,
        status: selectedOrder.status,
        paymentStatus: selectedOrder.paymentStatus
      }));

      toast.success('تم تحديث الطلب بنجاح');
      handleCloseDialog();
    } catch (err) {
      console.error('Error updating order:', err);
      toast.error('فشل في تحديث الطلب');
    }
  };

  const handleOpenDialog = (order = null) => {
    setDialogMode(order ? 'view' : 'edit');
    setSelectedOrder(order);

    if (order) {
      setFormData({
        status: order.status,
        paymentStatus: order.paymentStatus,
        isDelivered: order.isDelivered,
        deliveredAt: order.deliveredAt ? new Date(order.deliveredAt).toISOString().split('T')[0] : '',
      });
    }

    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
    setFormData({
      status: '',
      paymentStatus: '',
      isDelivered: false,
      deliveredAt: '',
    });
  };

  const renderStatusBadge = (status) => {
    if (!status) return null; // Handle null or undefined status

    let color;
    switch (status.toLowerCase()) {
      case 'pending':
        color = 'warning';
        break;
      case 'processing':
        color = 'info';
        break;
      case 'shipped':
        color = 'primary';
        break;
      case 'delivered':
        color = 'success';
        break;
      case 'cancelled':
        color = 'error';
        break;
      default:
        color = 'default';
    }
    return (
      <Chip
        label={getStatusLabel(status)}
        color={getStatusColor(status)}
        size="small"
      />
    );
  };

  const handleUpdateShippingDetails = async (order) => {
    try {
      setActionLoading({ id: order._id, type: 'shipping' });
      
      const maxShippingCost = Math.max(...order.cartItems.map(item => 
        Number(item?.shippingCost || item?.prdID?.shippingCost) || 0
      ));
      
      const maxDeliveryDays = Math.max(...order.cartItems.map(item => 
        Number(item?.deliveryDays || item?.prdID?.deliveryDays) || 2
      ));

      await dispatch(updateOrderShippingDetailsThunk({
        orderId: order._id,
        shippingCost: maxShippingCost,
        deliveryDays: maxDeliveryDays
      })).unwrap();

      toast.success('تم تحديث تفاصيل الشحن بنجاح');
    } catch (error) {
      console.error('Error updating shipping details:', error);
      toast.error('فشل في تحديث تفاصيل الشحن');
    } finally {
      setActionLoading({ id: null, type: null });
    }
  };

  const handleUpdateAllShippingDetails = async () => {
    if (!window.confirm('هل أنت متأكد من تحديث تفاصيل الشحن لجميع الطلبات؟')) {
      return;
    }

    let successCount = 0;
    let failureCount = 0;

    try {
      setActionLoading({ id: 'all', type: 'shipping' });
      
      // Update each order sequentially
      for (const order of orders) {
        try {
          const maxShippingCost = Math.max(...order.cartItems.map(item => 
            Number(item?.shippingCost || item?.prdID?.shippingCost) || 0
          ));
          
          const maxDeliveryDays = Math.max(...order.cartItems.map(item => 
            Number(item?.deliveryDays || item?.prdID?.deliveryDays) || 2
          ));

          await dispatch(updateOrderShippingDetailsThunk({
            orderId: order._id,
            shippingCost: maxShippingCost,
            deliveryDays: maxDeliveryDays
          })).unwrap();

          successCount++;
        } catch (error) {
          console.error(`Error updating order ${order._id}:`, error);
          failureCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`تم تحديث ${successCount} طلب بنجاح`);
      }
      if (failureCount > 0) {
        toast.error(`فشل تحديث ${failureCount} طلب`);
      }
    } catch (error) {
      console.error('Error in bulk update:', error);
      toast.error('حدث خطأ أثناء تحديث الطلبات');
    } finally {
      setActionLoading({ id: null, type: null });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            إدارة الطلبات
          </Typography>
          <Typography variant="body1" color="text.secondary">
            متابعة وإدارة طلبات العملاء
          </Typography>
        </Box>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Grid container spacing={3} sx={{ mb: 4 }} >
          <Grid item xs={12} md={3} size={3}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">إجمالي الطلبات</Typography>
                  <ShoppingBagIcon color="primary" sx={{ fontSize: 40 }} />
                </Box>
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                  {stats?.total || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3} size={3}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">الطلبات المعلقة</Typography>
                  <AccessTimeIcon color="warning" sx={{ fontSize: 40 }} />
                </Box>
                <Typography variant="h4" fontWeight="bold" color="warning.main">
                  {stats?.statusCounts?.pending || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3} size={3}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">الطلبات المكتملة</Typography>
                  <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
                </Box>
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  {stats?.statusCounts?.delivered || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3} size={3}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">طلبات ملغاة</Typography>
                  <CancelIcon color="error" sx={{ fontSize: 40 }} />
                </Box>
                <Typography variant="h4" fontWeight="bold" color="error.main">
                  {stats?.statusCounts?.cancelled || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card sx={{ mb: 4, borderRadius: 3 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid grid={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  placeholder="البحث في الطلبات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid grid={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel id="status-filter-label">تصفية حسب الحالة</InputLabel>
                  <Select
                    labelId="status-filter-label"
                    id="status-filter"
                    value={selectedStatus}
                    label="تصفية حسب الحالة"
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <MenuItem value="All">جميع الطلبات</MenuItem>
                    <MenuItem value="pending">قيد الانتظار</MenuItem>
                    <MenuItem value="processing">قيد المعالجة</MenuItem>
                    <MenuItem value="shipped">تم الشحن</MenuItem>
                    <MenuItem value="delivered">تم التوصيل</MenuItem>
                    <MenuItem value="cancelled">ملغي</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid grid={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel id="payment-status-filter-label">تصفية حسب حالة الدفع</InputLabel>
                  <Select
                    labelId="payment-status-filter-label"
                    id="payment-status-filter"
                    value={selectedPaymentStatus}
                    label="تصفية حسب حالة الدفع"
                    onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                  >
                    <MenuItem value="All">جميع حالات الدفع</MenuItem>
                    <MenuItem value="pending">قيد الانتظار</MenuItem>
                    <MenuItem value="paid">مدفوع</MenuItem>
                    <MenuItem value="failed">فشل</MenuItem>
                    <MenuItem value="refunded">مسترد</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button
              size='large'
                variant="outlined"
                startIcon={<RefreshIcon sx={{ml: 1}}/>}
                onClick={() => dispatch(fetchOrders())}
              >
                تحديث
              </Button>
            </Box>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                  <TableCell sx={{ fontWeight: 'bold' }} align='center'>رقم الطلب</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align='center'>تاريخ الطلب</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align='center'>العميل</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align='center'>المدينة</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align='center'>مصاريف الشحن</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align='center'>مدة التوصيل</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align='center'>الإجمالي</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align='center'>حالة الطلب</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align='center'>حالة الدفع</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align='center'>إجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading && !orders.length ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <Alert severity="error">{error}</Alert>
                    </TableCell>
                  </TableRow>
                ) : !sortedAndFilteredOrders.length ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      لا توجد طلبات
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedAndFilteredOrders
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((order) => (
                      order && order._id ? (
                        <TableRow
                          key={order._id}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                            backgroundColor: order.isNew ? alpha(theme.palette.info.light, 0.1) : 'inherit',
                          }}
                        >
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              #{order._id.slice(-6)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <div style={{ maxWidth: 200 }}>
                              <Typography variant="body2" noWrap>
                                {order.name}
                              </Typography>
                              <Typography variant="caption" color="textSecondary" noWrap>
                                {order.email?.replace('khaledahmed.201188@gmail.com', 'khaledahmedhaggagy@gmail.com')}
                              </Typography>
                              <Typography variant="caption" display="block" noWrap>
                                {order.phone}
                              </Typography>
                            </div>
                          </TableCell>
                          <TableCell>{order.city || 'نجع حمادي'}</TableCell>
                          <TableCell>
                            {Number(order.shippingCost) > 0 ? order.shippingCost :
                              order.cartItems?.reduce((total, item) => 
                                total + (Number(item?.shippingCost || item?.prdID?.shippingCost) || 0), 0)} ج.م
                          </TableCell>
                          <TableCell>
                            {Number(order.deliveryDays) > 0 ? order.deliveryDays :
                              Math.max(...(order.cartItems?.map(item => 
                                Number(item?.deliveryDays || item?.prdID?.deliveryDays) || 2) || [2]))} يوم
                          </TableCell>
                          <TableCell>{order.total} ج.م</TableCell>
                          <TableCell>
                            <Chip
                              label={getStatusLabel(order.status)}
                              color={getStatusColor(order.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={getPaymentStatusLabel(order.paymentStatus)}
                              color={getPaymentStatusColor(order.paymentStatus)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={(event) => handleMenuClick(event, order._id)}
                              disabled={!!actionLoading.id}
                            >
                              <MoreIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ) : null
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={sortedAndFilteredOrders.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="عدد الصفوف في الصفحة:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} من ${count}`}
          />
        </Card>
      </motion.div>

      {/* Order Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 'bold'
        }}>
          تفاصيل الطلب
        </DialogTitle>

        <DialogContent dividers>
          {selectedOrder ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  معلومات الطلب
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="رقم الطلب"
                      secondary={`#${selectedOrder?._id?.slice(-6)}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="تاريخ الطلب"
                      secondary={new Date(selectedOrder?.createdAt).toLocaleDateString('ar-EG')}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="المدينة"
                      secondary={selectedOrder?.city || 'نجع حمادي'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="مصاريف الشحن"
                      secondary={`${Number(selectedOrder?.shippingCost) > 0 ? selectedOrder?.shippingCost :
                        selectedOrder?.cartItems?.reduce((total, item) => 
                          total + (Number(item?.shippingCost || item?.prdID?.shippingCost) || 0), 0)} ج.م`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="مدة التوصيل"
                      secondary={`${Number(selectedOrder?.deliveryDays) > 0 ? selectedOrder?.deliveryDays :
                        Math.max(...(selectedOrder?.cartItems?.map(item => 
                          Number(item?.deliveryDays || item?.prdID?.deliveryDays) || 2) || [2]))} يوم`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="الإجمالي"
                      secondary={`${selectedOrder?.total} ج.م`}
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  معلومات العميل
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="الاسم"
                      secondary={selectedOrder?.name}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="البريد الإلكتروني"
                      secondary={selectedOrder?.email?.replace('khaledahmed.201188@gmail.com', 'khaledahmedhaggagy@gmail.com')}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="رقم الهاتف"
                      secondary={selectedOrder?.phone}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="العنوان"
                      secondary={selectedOrder?.address}
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          ) : (
            <Typography variant="body1" align="center">
              لا توجد بيانات للطلب
            </Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            إغلاق
          </Button>
          {selectedOrder && (
            <Button
              variant="contained"
              onClick={handleUpdateOrder}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                }
              }}
            >
              حفظ التغييرات
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Actions Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { borderRadius: 2, minWidth: 200 }
        }}
      >
        <MenuItem onClick={() => {
          const order = orders.find(o => o._id === selectedOrderId);
          if (order) {
            handleOpenDialog(order);
          }
          handleMenuClose();
        }}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>عرض التفاصيل</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => {
          const order = orders.find(o => o._id === selectedOrderId);
          if (order) {
            handleDownloadOrder(order);
          }
          handleMenuClose();
        }}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>تحميل الطلب</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => {
          const order = orders.find(o => o._id === selectedOrderId);
          if (order) {
            handleExportPDF(order);
          }
          handleMenuClose();
        }}>
          <ListItemIcon>
            <PdfIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>تصدير PDF</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => {
          const order = orders.find(o => o._id === selectedOrderId);
          if (order) {
            handlePrintInvoice(order);
          }
          handleMenuClose();
        }}>
          <ListItemIcon>
            <PrintIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>طباعة الفاتورة</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => {
          if (selectedOrder) {
            handleUpdateShippingDetails(selectedOrder);
          }
          handleMenuClose();
        }}>
          <ListItemIcon>
            <LocalShipping fontSize="small" />
          </ListItemIcon>
          <ListItemText>تحديث تفاصيل الشحن</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => {
          if (selectedOrder) {
            handleSendEmail(selectedOrder);
          }
          handleMenuClose();
        }}>
          <ListItemIcon>
            <EmailIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>إرسال الفاتورة بالبريد</ListItemText>
          {selectedOrder && actionLoading.id === selectedOrder._id && actionLoading.type === 'email' && (
            <CircularProgress size={20} />
          )}
        </MenuItem>

        <Divider />

        <MenuItem onClick={() => {
          if (selectedOrderId) {
            handleUpdateOrderStatus(selectedOrderId, 'cancelled');
          }
        }}>
          <ListItemIcon>
            <CancelIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText sx={{ color: 'error.main' }}>إلغاء الطلب</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => {
          if (selectedOrderId) {
            handleDeleteOrder(selectedOrderId);
          }
          handleMenuClose();
        }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText sx={{ color: 'error.main' }}>حذف الطلب</ListItemText>
        </MenuItem>
      </Menu>

      {/* Invoice Print Component (Hidden) */}
      {orderToPrint && (
        <Box sx={{ display: 'none' }}>
          <InvoicePrint ref={printRef} order={orderToPrint} />
        </Box>
      )}

      {/* Add button to toolbar */}
      <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdateAllShippingDetails}
          disabled={actionLoading.id === 'all'}
          startIcon={<LocalShipping />}
          sx={{
            background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)',
            }
          }}
        >
          تحديث تفاصيل الشحن للكل
          {actionLoading.id === 'all' && (
            <CircularProgress
              size={24}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default Orders; 