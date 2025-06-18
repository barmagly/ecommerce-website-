import React, { useState, useEffect, useRef } from 'react';
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

const Orders = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { items: orders, loading, error, stats } = useSelector(state => state.orders || { items: [], loading: false, error: null, stats: { total: 0, statusCounts: {}, paymentStatusCounts: {} } });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('All');

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

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

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
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setEditOrderOpen(true);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
    setMenuAnchorEl(null);
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      dispatch(deleteOrder(orderId));
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
    setOrderToPrint(order);
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  const handleExportPDF = (order) => {
    exportInvoiceAsPDF(order);
    toast.success('تم تصدير الفاتورة كملف PDF');
    setMenuAnchorEl(null);
  };

  const handleSendEmail = (order) => {
    toast.info(`إرسال الفاتورة إلى ${order.email}`);
    setMenuAnchorEl(null);
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
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
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
          <Grid item xs={12} md={3}>
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
          <Grid item xs={12} md={3}>
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
          <Grid item xs={12} md={3}>
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
            </Grid>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => dispatch(fetchOrders())}
              >
                تحديث
              </Button>
            </Box>
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
                  <TableCell sx={{ fontWeight: 'bold' }}>رقم الطلب</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>العميل</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>المجموع</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>سعر المورد</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>الربح الصافي</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>حالة الطلب</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>حالة الدفع</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>طريقة الدفع</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>التاريخ</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>الإجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <AnimatePresence>
                  {sortedAndFilteredOrders
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((order, index) => (
                      <motion.tr
                        key={order._id}
                        component={TableRow}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                      >
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            #{order._id.slice(-6)}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              src={order.image}
                              sx={{ bgcolor: 'primary.main' }}
                            >
                              <PersonIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {order.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {order.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {order.total} جنيه
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {(() => {
                              const supplierTotal = order.cartItems?.reduce((total, item) => {
                                return total + (item.supplierPrice || 0) * item.quantity;
                              }, 0) || 0;
                              return `${supplierTotal.toFixed(2)} جنيه`;
                            })()}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Box sx={{ 
                            p: 1, 
                            bgcolor: 'rgba(76, 175, 80, 0.1)', 
                            borderRadius: 1, 
                            border: '1px solid rgba(76, 175, 80, 0.3)',
                            textAlign: 'center'
                          }}>
                            <Typography variant="body2" color="success.main" fontWeight="bold">
                              {(() => {
                                const supplierTotal = order.cartItems?.reduce((total, item) => {
                                  return total + (item.supplierPrice || 0) * item.quantity;
                                }, 0) || 0;
                                const profit = parseFloat(order.total) - supplierTotal;
                                return `${profit.toFixed(2)} جنيه`;
                              })()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {(() => {
                                const supplierTotal = order.cartItems?.reduce((total, item) => {
                                  return total + (item.supplierPrice || 0) * item.quantity;
                                }, 0) || 0;
                                const profit = parseFloat(order.total) - supplierTotal;
                                const percentage = (profit / parseFloat(order.total)) * 100;
                                return `${percentage.toFixed(1)}%`;
                              })()}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          {renderStatusBadge(order.status)}
                        </TableCell>

                        <TableCell>
                          {renderStatusBadge(order.paymentStatus)}
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {getPaymentMethodLabel(order.paymentMethod)}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="عرض التفاصيل">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleOpenDialog(order)}
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="حذف">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteOrder(order._id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </motion.tr>
                    ))}
                </AnimatePresence>
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

        <DialogContent sx={{ p: 3, mt: 2 }}>
          {selectedOrder && (
            <Grid container spacing={3}>
              {/* Customer Information */}
              <Grid grid={{ xs: 12, md: 6 }}>
                <Typography variant="h6" gutterBottom>
                  معلومات العميل
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    الاسم: {selectedOrder.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    البريد الإلكتروني: {selectedOrder.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    رقم الهاتف: {selectedOrder.phone}
                  </Typography>
                </Box>
              </Grid>

              {/* Shipping Information */}
              <Grid grid={{ xs: 12, md: 6 }}>
                <Typography variant="h6" gutterBottom>
                  معلومات الشحن
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    العنوان: {selectedOrder.address}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    المدينة: {selectedOrder.city}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    الرمز البريدي: {selectedOrder.postalCode}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    الدولة: {selectedOrder.country}
                  </Typography>
                </Box>
              </Grid>

              {/* Instapay Image (Conditionally Rendered) */}
              {selectedOrder.paymentMethod === 'bank_transfer' && selectedOrder.image && (
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    صورة إثبات التحويل (Instapay)
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <img
                      src={selectedOrder.image}
                      alt="Instapay Proof"
                      style={{ maxWidth: 400, maxHeight: 200, borderRadius: 8, border: '1px solid #ddd' }}
                    />
                  </Box>
                </Grid>
              )}

              {/* Order Items */}
              <Grid grid={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom>
                  المنتجات
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>المنتج</TableCell>
                        <TableCell>السعر النهائي</TableCell>
                        <TableCell>سعر المورد</TableCell>
                        <TableCell>الربح الصافي</TableCell>
                        <TableCell>الكمية</TableCell>
                        <TableCell>المجموع</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedOrder.cartItems.map((item) => (
                        <TableRow key={item._id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar
                                src={item.image}
                                sx={{ width: 40, height: 40 }}
                              >
                                <ShoppingCartIcon />
                              </Avatar>
                              <Typography variant="body2">
                                {item.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{item.price} جنيه</TableCell>
                          <TableCell>{item.supplierPrice || 'غير محدد'} جنيه</TableCell>
                          <TableCell>
                            <Box sx={{ 
                              p: 1, 
                              bgcolor: 'rgba(76, 175, 80, 0.1)', 
                              borderRadius: 1, 
                              border: '1px solid rgba(76, 175, 80, 0.3)',
                              textAlign: 'center'
                            }}>
                              <Typography variant="body2" color="success.main" fontWeight="bold">
                                {item.supplierPrice ? 
                                  `${(parseFloat(item.price) - parseFloat(item.supplierPrice)).toFixed(2)} جنيه` : 
                                  'غير محدد'
                                }
                              </Typography>
                              {item.supplierPrice && (
                                <Typography variant="caption" color="text.secondary">
                                  {((parseFloat(item.price) - parseFloat(item.supplierPrice)) / parseFloat(item.price) * 100).toFixed(1)}%
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.price * item.quantity} جنيه</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              {/* Supplier Summary */}
              <Grid grid={{ xs: 12 }}>
                <Paper elevation={1} sx={{ p: 3, bgcolor: 'rgba(76, 175, 80, 0.05)' }}>
                  <Typography variant="h6" gutterBottom color="success.main">
                    ملخص المورد والربح
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 2 }}>
                        <Typography variant="h6" color="primary.main" fontWeight="bold">
                          إجمالي المبيعات
                        </Typography>
                        <Typography variant="h4" color="primary.main" fontWeight="bold">
                          {selectedOrder.total} جنيه
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 2 }}>
                        <Typography variant="h6" color="warning.main" fontWeight="bold">
                          إجمالي سعر المورد
                        </Typography>
                        <Typography variant="h4" color="warning.main" fontWeight="bold">
                          {(() => {
                            const supplierTotal = selectedOrder.cartItems.reduce((total, item) => {
                              return total + (item.supplierPrice || 0) * item.quantity;
                            }, 0);
                            return `${supplierTotal.toFixed(2)} جنيه`;
                          })()}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 2 }}>
                        <Typography variant="h6" color="success.main" fontWeight="bold">
                          الربح الصافي
                        </Typography>
                        <Typography variant="h4" color="success.main" fontWeight="bold">
                          {(() => {
                            const supplierTotal = selectedOrder.cartItems.reduce((total, item) => {
                              return total + (item.supplierPrice || 0) * item.quantity;
                            }, 0);
                            const profit = parseFloat(selectedOrder.total) - supplierTotal;
                            return `${profit.toFixed(2)} جنيه`;
                          })()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          نسبة الربح: {(() => {
                            const supplierTotal = selectedOrder.cartItems.reduce((total, item) => {
                              return total + (item.supplierPrice || 0) * item.quantity;
                            }, 0);
                            const profit = parseFloat(selectedOrder.total) - supplierTotal;
                            const percentage = (profit / parseFloat(selectedOrder.total)) * 100;
                            return `${percentage.toFixed(1)}%`;
                          })()}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Order Status */}
              <Grid grid={{ xs: 12 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <FormControl fullWidth>
                    <InputLabel>حالة الطلب</InputLabel>
                    <Select
                      value={selectedOrder.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      label="حالة الطلب"
                    >
                      <MenuItem value="pending">قيد الانتظار</MenuItem>
                      <MenuItem value="processing">قيد المعالجة</MenuItem>
                      <MenuItem value="shipped">تم الشحن</MenuItem>
                      <MenuItem value="delivered">تم التوصيل</MenuItem>
                      <MenuItem value="cancelled">ملغي</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>حالة الدفع</InputLabel>
                    <Select
                      value={selectedOrder.paymentStatus}
                      onChange={(e) => handlePaymentStatusChange(e.target.value)}
                      label="حالة الدفع"
                    >
                      <MenuItem value="pending">قيد الانتظار</MenuItem>
                      <MenuItem value="paid">مدفوع</MenuItem>
                      <MenuItem value="failed">فشل</MenuItem>
                      <MenuItem value="refunded">مسترد</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            إغلاق
          </Button>
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
        </DialogActions>
      </Dialog>

      {/* Invoice Print Component (Hidden) */}
      {orderToPrint && (
        <Box sx={{ display: 'none' }}>
          <InvoicePrint ref={printRef} order={orderToPrint} />
        </Box>
      )}
    </Box>
  );
};

export default Orders; 