import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TablePagination, IconButton, Chip,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions, FormControl,
  InputLabel, Select, MenuItem, Grid, InputAdornment, Tooltip, useTheme,
  alpha, CircularProgress, Avatar, List, ListItem, ListItemText,
  ListItemAvatar, Divider,
} from '@mui/material';
import {
  Visibility as ViewIcon, Search as SearchIcon, ShoppingCart as CartIcon,
  Delete as DeleteIcon, Refresh as RefreshIcon, FilterAlt as FilterIcon,
  TrendingUp as TrendingIcon, AttachMoney as MoneyIcon, Person as PersonIcon,
  Clear as ClearIcon, Schedule as ScheduleIcon, ShoppingBag as BagIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const initialCarts = [
  {
    id: 1, userId: 1, userName: 'أحمد محمد', userEmail: 'ahmed@example.com',
    userAvatar: 'https://via.placeholder.com/40x40?text=أ',
    items: [{
      id: 1, productId: 1, productName: 'iPhone 15 Pro',
      productImage: 'https://via.placeholder.com/60x60?text=iPhone',
      price: 1200, quantity: 1, variant: 'أزرق - 256GB',
      addedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    }],
    totalAmount: 1200, status: 'active',
    lastActivity: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    sessionDuration: 45, pageViews: 12,
  },
  {
    id: 2, userId: 2, userName: 'فاطمة علي', userEmail: 'fatima@example.com',
    userAvatar: 'https://via.placeholder.com/40x40?text=ف',
    items: [{
      id: 2, productId: 2, productName: 'Samsung Galaxy S24',
      productImage: 'https://via.placeholder.com/60x60?text=Samsung',
      price: 900, quantity: 1, variant: 'أسود - 128GB',
      addedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    }],
    totalAmount: 900, status: 'abandoned',
    lastActivity: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    sessionDuration: 25, pageViews: 8,
  }
];

const Carts = () => {
  const theme = useTheme();
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCart, setSelectedCart] = useState(null);

  useEffect(() => { loadCarts(); }, []);

  const loadCarts = () => {
    setLoading(true);
    try {
      const savedCarts = localStorage.getItem('adminCarts');
      if (savedCarts) {
        setCarts(JSON.parse(savedCarts));
      } else {
        setCarts(initialCarts);
        localStorage.setItem('adminCarts', JSON.stringify(initialCarts));
      }
    } catch (error) {
      console.error('Error loading carts:', error);
      toast.error('فشل في تحميل عربات التسوق');
    } finally {
      setLoading(false);
    }
  };

  const saveCarts = (updatedCarts) => {
    try {
      localStorage.setItem('adminCarts', JSON.stringify(updatedCarts));
      setCarts(updatedCarts);
    } catch (error) {
      console.error('Error saving carts:', error);
      toast.error('فشل في حفظ البيانات');
    }
  };

  const filteredCarts = carts.filter(cart => {
    const matchesSearch = cart.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cart.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || cart.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleChangePage = (event, newPage) => { setPage(newPage); };
  const handleChangeRowsPerPage = (event) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); };
  const handleOpenDialog = (cart) => { setSelectedCart(cart); setOpenDialog(true); };
  const handleCloseDialog = () => { setOpenDialog(false); setSelectedCart(null); };

  const handleDeleteCart = (cartId) => {
    if (window.confirm('هل أنت متأكد من حذف هذه العربة؟')) {
      try {
        const updatedCarts = carts.filter(cart => cart.id !== cartId);
        saveCarts(updatedCarts);
        toast.success('تم حذف العربة بنجاح');
      } catch (error) {
        toast.error('فشل في حذف العربة');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'abandoned': return 'warning';
      case 'converted': return 'primary';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'نشطة';
      case 'abandoned': return 'متروكة';
      case 'converted': return 'تم الشراء';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => { return `${amount.toLocaleString()} ر.س`; };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} دقيقة`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} ساعة`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} يوم`;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  const activeCarts = carts.filter(c => c.status === 'active').length;
  const abandonedCarts = carts.filter(c => c.status === 'abandoned').length;
  const totalRevenue = carts.filter(c => c.status === 'converted').reduce((sum, c) => sum + c.totalAmount, 0);

  return (
    <Box sx={{ p: 3 }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>إدارة عربات التسوق</Typography>
          <Typography variant="body1" color="text.secondary">متابعة وإدارة عربات التسوق النشطة والمهجورة</Typography>
        </Box>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">{carts.length}</Typography>
                    <Typography variant="h6">إجمالي العربات</Typography>
                  </Box>
                  <CartIcon sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)', color: 'white', borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">{activeCarts}</Typography>
                    <Typography variant="h6">عربات نشطة</Typography>
                  </Box>
                  <TrendingIcon sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)', color: 'white', borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">{abandonedCarts}</Typography>
                    <Typography variant="h6">عربات متروكة</Typography>
                  </Box>
                  <ScheduleIcon sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)', color: 'white', borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">{formatCurrency(totalRevenue)}</Typography>
                    <Typography variant="h6">إيرادات محولة</Typography>
                  </Box>
                  <MoneyIcon sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <Card sx={{ mb: 4, borderRadius: 3 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField fullWidth placeholder="البحث في العربات..." value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment> }}
                />
              </Grid>
              
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>الحالة</InputLabel>
                  <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} label="الحالة">
                    <MenuItem value="">جميع الحالات</MenuItem>
                    <MenuItem value="active">نشطة</MenuItem>
                    <MenuItem value="abandoned">متروكة</MenuItem>
                    <MenuItem value="converted">تم الشراء</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadCarts} fullWidth>تحديث</Button>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <Button variant="contained" startIcon={<FilterIcon />} fullWidth
                  sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': { background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)' } }}>
                  تصفية
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
        <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>العميل</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>المنتجات</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>المبلغ الإجمالي</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>الحالة</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>النشاط الأخير</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>الإجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <AnimatePresence>
                  {filteredCarts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((cart, index) => (
                      <motion.tr key={cart.id} component={TableRow}
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar src={cart.userAvatar} sx={{ width: 40, height: 40 }}>
                              <PersonIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="bold">{cart.userName}</Typography>
                              <Typography variant="caption" color="text.secondary">{cart.userEmail}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                              {cart.items.length} منتج
                            </Typography>
                            {cart.items.slice(0, 2).map((item, i) => (
                              <Typography key={i} variant="caption" display="block" color="text.secondary">
                                {item.productName} (x{item.quantity})
                              </Typography>
                            ))}
                            {cart.items.length > 2 && (
                              <Typography variant="caption" color="primary">
                                +{cart.items.length - 2} المزيد
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="h6" fontWeight="bold" color="primary">
                            {formatCurrency(cart.totalAmount)}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Chip label={getStatusText(cart.status)} color={getStatusColor(cart.status)} size="small" />
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {getTimeAgo(cart.lastActivity)} مضت
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(cart.lastActivity)}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="عرض التفاصيل">
                              <IconButton size="small" color="info" onClick={() => handleOpenDialog(cart)}>
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="حذف العربة">
                              <IconButton size="small" color="error" onClick={() => handleDeleteCart(cart.id)}>
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
          
          <TablePagination component="div" count={filteredCarts.length} page={page}
            onPageChange={handleChangePage} rowsPerPage={rowsPerPage} onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="عدد الصفوف في الصفحة:" labelDisplayedRows={({ from, to, count }) => `${from}-${to} من ${count}`} />
        </Card>
      </motion.div>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', fontWeight: 'bold' }}>
          تفاصيل عربة التسوق
        </DialogTitle>
        
        <DialogContent sx={{ p: 3, mt: 2 }}>
          {selectedCart && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar src={selectedCart.userAvatar} sx={{ width: 60, height: 60 }}>
                  <PersonIcon />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight="bold">{selectedCart.userName}</Typography>
                  <Typography variant="body2" color="text.secondary">{selectedCart.userEmail}</Typography>
                  <Chip label={getStatusText(selectedCart.status)} color={getStatusColor(selectedCart.status)} size="small" sx={{ mt: 1 }} />
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" fontWeight="bold" color="primary">
                    {formatCurrency(selectedCart.totalAmount)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">المجموع الإجمالي</Typography>
                </Box>
              </Box>

              <Typography variant="h6" gutterBottom>منتجات العربة:</Typography>
              {selectedCart.items.length > 0 ? (
                <List>
                  {selectedCart.items.map((item, index) => (
                    <React.Fragment key={item.id}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar src={item.productImage} variant="rounded" sx={{ width: 60, height: 60 }}>
                            <BagIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle1" fontWeight="bold">{item.productName}</Typography>
                              <Typography variant="h6" color="primary">
                                {formatCurrency(item.price * item.quantity)}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">{item.variant}</Typography>
                              <Typography variant="body2">
                                الكمية: {item.quantity} × {formatCurrency(item.price)}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < selectedCart.items.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Card sx={{ p: 3, textAlign: 'center', bgcolor: alpha(theme.palette.grey[500], 0.05) }}>
                  <CartIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">العربة فارغة</Typography>
                </Card>
              )}
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} color="inherit">إغلاق</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Carts; 