import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TablePagination, IconButton, Chip,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions, FormControl,
  InputLabel, Select, MenuItem, Grid, InputAdornment, Tooltip, useTheme,
  CircularProgress, Avatar, List, ListItem, ListItemText,
  ListItemAvatar, Divider, Paper
} from '@mui/material';
import {
  Visibility as ViewIcon, Search as SearchIcon, ShoppingCart as CartIcon,
  Delete as DeleteIcon, Refresh as RefreshIcon, FilterAlt as FilterIcon,
  TrendingUp as TrendingIcon, AttachMoney as MoneyIcon, Person as PersonIcon,
  Clear as ClearIcon, Schedule as ScheduleIcon, ShoppingBag as BagIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { cartsAPI } from '../../services/api';

const Carts = () => {
  const theme = useTheme();
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedCart, setSelectedCart] = useState(null);

  const loadCarts = async () => {
    try {
      setLoading(true);
      const response = await cartsAPI.getAll();
      setCarts(response.data.carts || []);
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'فشل في تحميل سلات التسوق';
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-center",
        rtl: true,
        autoClose: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCarts();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleFilterStatus = (status) => {
    setFilterStatus(status);
    setPage(0);
  };

  const handleDeleteClick = (cart) => {
    setSelectedCart(cart);
    setDeleteDialogOpen(true);
  };

  const handleViewClick = (cart) => {
    setSelectedCart(cart);
    setViewDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await cartsAPI.delete(selectedCart._id);
      toast.success('تم حذف السلة بنجاح', {
        position: "top-center",
        rtl: true,
        autoClose: 2000
      });
      loadCarts();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'فشل في حذف السلة';
      toast.error(errorMessage, {
        position: "top-center",
        rtl: true,
        autoClose: 3000
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedCart(null);
    }
  };

  const handleRefresh = () => {
    loadCarts();
    toast.info('جاري تحديث البيانات...', {
      position: "top-center",
      rtl: true,
      autoClose: 1000
    });
  };

  const filteredCarts = carts.filter(cart => {
    const matchesSearch = cart.userID?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cart.userID?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Sort newest first
  const sortedCarts = [...filteredCarts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const paginatedCarts = sortedCarts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) return '0 ج.م';
    return `${Number(amount).toLocaleString('ar-SA')} ج.م`;
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `منذ ${diffInMinutes} دقيقة`;
    } else if (diffInMinutes < 1440) {
      return `منذ ${Math.floor(diffInMinutes / 60)} ساعة`;
    } else {
      return `منذ ${Math.floor(diffInMinutes / 1440)} يوم`;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="60vh" gap={2}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
        >
          إعادة المحاولة
        </Button>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ fontFamily: 'Cairo, sans-serif' }}>
          إدارة سلات التسوق
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<RefreshIcon sx={{ml: 1}}/>}
          onClick={handleRefresh}
        >
          تحديث
        </Button>
      </Box>

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3} size={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CartIcon color="primary" sx={{ ml: 1 }} />
                <Box>
                  <Typography variant="h6">{carts.length}</Typography>
                  <Typography color="textSecondary">إجمالي السلات</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3} size={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <MoneyIcon color="primary" sx={{ ml: 1 }} />
                <Box>
                  <Typography variant="h6">
                    {carts.reduce((total, cart) => total + (cart.total || 0), 0).toFixed()}
                  </Typography>
                  <Typography color="textSecondary">إجمالي المبيعات</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField
          placeholder="بحث..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchTerm('')}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 200 }}
        />
      </Box>

      {/* Carts Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align='center'>المستخدم</TableCell>
              <TableCell align='center'>المنتجات</TableCell>
              <TableCell align='center'>المبلغ</TableCell>
              <TableCell align='center'>آخر تحديث</TableCell>
              <TableCell align='center'>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCarts.map((cart) => (
              <TableRow key={cart._id}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar>
                      {cart.userID?.name?.[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" textAlign={'right'}>{cart.userID?.name}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {cart.userID?.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" flexDirection="column" alignItems="center">
                    {cart.cartItems && cart.cartItems.length > 0 ? (
                      cart.cartItems.slice(0, 2).map((item, index) => (
                        <Typography variant="body2" key={index}>
                          {item.prdID?.name || 'اسم غير متوفر'} (الكمية: {item.quantity})
                        </Typography>
                      ))
                    ) : (
                      <Typography variant="body2">0 منتج</Typography>
                    )}
                    {cart.cartItems && cart.cartItems.length > 2 && (
                      <Typography variant="caption" color="textSecondary">
                        و {cart.cartItems.length - 2} آخرون
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell align='center'>جنيه {cart.total || 0}</TableCell>
                <TableCell>
                  <Tooltip title={cart.updatedAt}>
                    <Typography variant="body2" textAlign={'center'}>
                      {getTimeAgo(cart.updatedAt)}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1} justifyContent="center">
                    <Tooltip title="عرض التفاصيل">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleViewClick(cart)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="حذف السلة">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(cart)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredCarts.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="عدد الصفوف:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} من ${count}`}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        dir="rtl"
      >
        <DialogTitle>تأكيد الحذف</DialogTitle>
        <DialogContent>
          <Typography>
            هل أنت متأكد من حذف هذه السلة؟ لا يمكن التراجع عن هذا الإجراء.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>إلغاء</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            حذف
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Cart Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
        dir="rtl"
      >
        <DialogTitle>
          تفاصيل السلة
          <IconButton
            onClick={() => setViewDialogOpen(false)}
            sx={{ position: 'absolute', left: 8, top: 8 }}
          >
            <ClearIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedCart && (
            <Box>
              <Typography variant="h6" gutterBottom>
                معلومات المستخدم
              </Typography>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar src={selectedCart.userID?.profileImg}>
                      {selectedCart.userID?.name?.[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={selectedCart.userID?.name}
                    secondary={selectedCart.userID?.email}
                  />
                </ListItem>
                {selectedCart.userID?.phone && (
                  <ListItem>
                    <ListItemText primary="رقم الهاتف" secondary={selectedCart.userID.phone} />
                  </ListItem>
                )}
                {selectedCart.userID?.address && (
                  <ListItem>
                    <ListItemText primary="العنوان" secondary={selectedCart.userID.address} />
                  </ListItem>
                )}
                {selectedCart.userID?.city && (
                  <ListItem>
                    <ListItemText primary="المدينة" secondary={selectedCart.userID.city} />
                  </ListItem>
                )}
              </List>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                المنتجات
              </Typography>
              <List>
                {selectedCart.cartItems?.map((item) => (
                  <ListItem key={item._id}>
                    <ListItemAvatar>
                      <Avatar src={item.prdID?.images?.[0]?.url}>
                        {item.prdID?.name?.[0]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.prdID?.name}
                      secondary={`الكمية: ${item.quantity} | السعر: ${formatCurrency(item.prdID?.price)}`}
                    />
                    <Typography variant="body2" color="primary">
                      {formatCurrency(item.prdID?.price * item.quantity)}
                    </Typography>
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">المجموع</Typography>
                <Typography variant="h6" color="primary">
                  {formatCurrency(selectedCart.total || 0)}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Carts; 