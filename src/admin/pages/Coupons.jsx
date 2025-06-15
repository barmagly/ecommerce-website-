import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  InputAdornment,
  Tooltip,
  useTheme,
  alpha,
  CircularProgress,
  Switch,
  FormControlLabel,
  Alert,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  LocalOffer as CouponIcon,
  Category as CategoryIcon,
  Refresh as RefreshIcon,
  CalendarToday as DateIcon,
  Percent as PercentIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { couponsAPI, categoriesAPI } from '../services/api';
import { productsAPI } from '../services/api';

// Initial sample coupons
const initialCoupons = [
  {
    id: 1,
    code: 'WELCOME20',
    name: 'خصم الترحيب',
    description: 'خصم 20% للعملاء الجدد',
    type: 'percentage',
    value: 20,
    minAmount: 100,
    maxDiscount: 50,
    usageLimit: 100,
    usedCount: 25,
    isActive: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    categories: [1, 2],
    categoryNames: ['إلكترونيات', 'ملابس'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    code: 'SAVE50',
    name: 'خصم 50 دولار',
    description: 'خصم ثابت 50 دولار عند الشراء بأكثر من 200 دولار',
    type: 'fixed',
    value: 50,
    minAmount: 200,
    maxDiscount: null,
    usageLimit: 50,
    usedCount: 12,
    isActive: true,
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    categories: [1],
    categoryNames: ['إلكترونيات'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    code: 'FASHION15',
    name: 'خصم الأزياء',
    description: 'خصم 15% على جميع الملابس',
    type: 'percentage',
    value: 15,
    minAmount: 50,
    maxDiscount: 30,
    usageLimit: 200,
    usedCount: 87,
    isActive: false,
    startDate: '2024-02-01',
    endDate: '2024-02-29',
    categories: [2],
    categoryNames: ['ملابس'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock categories for dropdown
const categories = [
  { id: 1, name: 'إلكترونيات' },
  { id: 2, name: 'ملابس' },
  { id: 3, name: 'كتب' },
  { id: 4, name: 'منزل وحديقة' },
  { id: 5, name: 'رياضة' },
  { id: 6, name: 'جمال وعناية' },
];

const Coupons = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add', 'edit', 'view'
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    type: 'percentage',
    value: '',
    minAmount: '',
    maxDiscount: '',
    usageLimit: '',
    isActive: true,
    startDate: '',
    endDate: '',
    categories: [],
    products: [],
    applyTo: 'all'
  });

  const [errors, setErrors] = useState({});

  // Load coupons, categories and products from API on component mount
  useEffect(() => {
    fetchCoupons();
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data.categories || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      toast.error('Failed to load categories');
    }
  };

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await couponsAPI.getAll();
      setCoupons(response.data.coupons || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch coupons');
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data.products || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      toast.error('Failed to load products');
    }
  };

  const saveCoupons = (updatedCoupons) => {
    try {
      localStorage.setItem('adminCoupons', JSON.stringify(updatedCoupons));
      setCoupons(updatedCoupons);
    } catch (error) {
      console.error('Error saving coupons:', error);
      toast.error('فشل في حفظ البيانات');
    }
  };

  // Filter coupons based on search and filters
  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = searchTerm === '' || (
      (coupon.code?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (coupon.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (coupon.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
    
    const matchesType = !filterType || coupon.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      type: 'percentage',
      value: '',
      minAmount: '',
      maxDiscount: '',
      usageLimit: '',
      isActive: true,
      startDate: '',
      endDate: '',
      categories: [],
      products: [],
      applyTo: 'all'
    });
    setErrors({});
  };

  const handleOpenDialog = (mode, coupon = null) => {
    setDialogMode(mode);
    setSelectedCoupon(coupon);
    
    if (mode === 'edit' && coupon) {
      setFormData({
        code: coupon.code || '',
        name: coupon.name || '',
        description: coupon.description || '',
        type: coupon.type || 'percentage',
        value: coupon.discount?.toString() || '',
        minAmount: coupon.minAmount?.toString() || '',
        maxDiscount: coupon.maxDiscount?.toString() || '',
        usageLimit: coupon.usageLimit?.toString() || '',
        isActive: true,
        startDate: coupon.startDate ? new Date(coupon.startDate).toISOString().split('T')[0] : '',
        endDate: coupon.expire ? new Date(coupon.expire).toISOString().split('T')[0] : '',
        categories: coupon.categories || [],
        products: coupon.products || [],
        applyTo: coupon.applyTo || 'all'
      });
    } else {
      resetForm();
    }
    
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCoupon(null);
    resetForm();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.code?.trim()) {
      newErrors.code = 'الكود مطلوب';
    }

    if (!formData.name?.trim()) {
      newErrors.name = 'الاسم مطلوب';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'الوصف مطلوب';
    }

    if (!formData.value?.trim()) {
      newErrors.value = 'قيمة الخصم مطلوبة';
    } else {
      const value = parseFloat(formData.value);
      if (isNaN(value) || value <= 0) {
        newErrors.value = 'قيمة الخصم يجب أن تكون أكبر من صفر';
      }
      if (formData.type === 'percentage' && value > 100) {
        newErrors.value = 'النسبة المئوية يجب أن تكون أقل من أو تساوي 100%';
      }
    }

    if (formData.minAmount?.trim()) {
      const minAmount = parseFloat(formData.minAmount);
      if (isNaN(minAmount) || minAmount < 0) {
        newErrors.minAmount = 'الحد الأدنى يجب أن يكون صفر أو أكبر';
      }
    }

    if (formData.maxDiscount?.trim() && formData.type === 'percentage') {
      const maxDiscount = parseFloat(formData.maxDiscount);
      if (isNaN(maxDiscount) || maxDiscount <= 0) {
        newErrors.maxDiscount = 'الحد الأقصى للخصم يجب أن يكون أكبر من صفر';
      }
    }

    if (formData.usageLimit?.trim()) {
      const usageLimit = parseInt(formData.usageLimit);
      if (isNaN(usageLimit) || usageLimit <= 0) {
        newErrors.usageLimit = 'حد الاستخدام يجب أن يكون أكبر من صفر';
      }
    }

    if (!formData.startDate) {
      newErrors.startDate = 'تاريخ البداية مطلوب';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'تاريخ النهاية مطلوب';
    } else if (formData.startDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية';
    }

    if (formData.applyTo === 'categories' && (!formData.categories || formData.categories.length === 0)) {
      newErrors.categories = 'يجب اختيار فئة واحدة على الأقل';
    }

    if (formData.applyTo === 'products' && (!formData.products || formData.products.length === 0)) {
      newErrors.products = 'يجب اختيار منتج واحد على الأقل';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const couponData = {
        code: formData.code,
        name: formData.name,
        description: formData.description,
        type: formData.type,
        discount: parseFloat(formData.value),
        minAmount: formData.minAmount ? parseFloat(formData.minAmount) : null,
        maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
        isActive: true,
        startDate: formData.startDate,
        expire: formData.endDate || null,
        categories: formData.categories,
        products: formData.products,
        applyTo: formData.applyTo
      };

      if (selectedCoupon) {
        await couponsAPI.update(selectedCoupon._id, couponData);
        toast.success('تم تحديث الكوبون بنجاح');
      } else {
        await couponsAPI.create(couponData);
        toast.success('تم إضافة الكوبون بنجاح');
      }
      handleCloseDialog();
      fetchCoupons();
    } catch (err) {
      console.error('Error submitting form:', err);
      toast.error(err.response?.data?.message || (selectedCoupon ? 'فشل في تحديث الكوبون' : 'فشل في إضافة الكوبون'));
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الكوبون؟')) {
      try {
        await couponsAPI.delete(couponId);
        toast.success('Coupon deleted successfully');
        fetchCoupons();
      } catch (error) {
        console.error('Error deleting coupon:', error);
        toast.error('فشل في حذف الكوبون');
      }
    }
  };

  const handleFormChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const isExpired = (endDate) => {
    return new Date(endDate) < new Date();
  };

  const isActive = (coupon) => {
    const now = new Date();
    const start = new Date(coupon.startDate);
    const end = new Date(coupon.endDate);
    return coupon.isActive && now >= start && now <= end;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
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
            إدارة الكوبونات
          </Typography>
          <Typography variant="body1" color="text.secondary">
            إدارة كوبونات الخصم والعروض الترويجية
          </Typography>
        </Box>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card sx={{ mb: 4, borderRadius: 3 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="بحث عن كوبون..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>نوع الخصم</InputLabel>
                  <Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    label="نوع الخصم"
                  >
                    <MenuItem value="">الكل</MenuItem>
                    <MenuItem value="percentage">نسبة مئوية</MenuItem>
                    <MenuItem value="fixed">مبلغ ثابت</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={fetchCoupons}
                  fullWidth
                >
                  تحديث
                </Button>
              </Grid>
              
              <Grid item xs={12} md={1.5}>
                <Button
                  variant="outlined"
                  startIcon={<CategoryIcon />}
                  onClick={() => navigate('/admin/categories')}
                  fullWidth
                  color="secondary"
                >
                  الفئات
                </Button>
              </Grid>
              
              <Grid item xs={12} md={1.5}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog('add')}
                  fullWidth
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    }
                  }}
                >
                  إضافة كوبون
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {coupons.length}
                    </Typography>
                    <Typography variant="h6">إجمالي الكوبونات</Typography>
                  </Box>
                  <CouponIcon sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
              color: 'white',
              borderRadius: 3
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {coupons.filter(c => isActive(c)).length}
                    </Typography>
                    <Typography variant="h6">كوبونات نشطة</Typography>
                  </Box>
                  <CouponIcon sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
              color: 'white',
              borderRadius: 3
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {coupons.filter(c => isExpired(c.endDate)).length}
                    </Typography>
                    <Typography variant="h6">كوبونات منتهية</Typography>
                  </Box>
                  <DateIcon sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)',
              color: 'white',
              borderRadius: 3
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {coupons.reduce((sum, c) => sum + c.usedCount, 0)}
                    </Typography>
                    <Typography variant="h6">إجمالي الاستخدامات</Typography>
                  </Box>
                  <PercentIcon sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      {/* Coupons Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>الكود</TableCell>
                  <TableCell>الاسم</TableCell>
                  <TableCell>الوصف</TableCell>
                  <TableCell>نوع الخصم</TableCell>
                  <TableCell>قيمة الخصم</TableCell>
                  <TableCell>تاريخ البداية</TableCell>
                  <TableCell>تاريخ النهاية</TableCell>
                  <TableCell>الإجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <AnimatePresence>
                  {filteredCoupons
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((coupon, index) => (
                      <motion.tr
                        key={coupon._id}
                        component={TableRow}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        hover
                      >
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {coupon.code}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {coupon.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{coupon.description}</TableCell>
                        <TableCell>
                          <Chip
                            label={coupon.type === 'percentage' ? 'نسبة مئوية' : 'مبلغ ثابت'}
                            color={coupon.type === 'percentage' ? 'primary' : 'secondary'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {coupon.type === 'percentage' ? `${coupon.discount}%` : `$${coupon.discount}`}
                        </TableCell>
                        <TableCell>{new Date(coupon.startDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(coupon.expire).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="عرض">
                              <IconButton
                                size="small"
                                color="info"
                                onClick={() => handleOpenDialog('view', coupon)}
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="تعديل">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleOpenDialog('edit', coupon)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="حذف">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteCoupon(coupon._id)}
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
            count={filteredCoupons.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="عدد الصفوف في الصفحة:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} من ${count}`}
          />
        </Card>
      </motion.div>

      {/* Coupon Dialog */}
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
          {dialogMode === 'add' ? 'إضافة كوبون جديد' : 
           dialogMode === 'edit' ? 'تعديل الكوبون' : 'عرض الكوبون'}
        </DialogTitle>
        
        <DialogContent sx={{ p: 3, mt: 2 }}>
          {dialogMode === 'view' && selectedCoupon ? (
            // View Mode
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card sx={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  mb: 3
                }}>
                  <CardContent>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                      {selectedCoupon.code}
                    </Typography>
                    <Typography variant="h6">
                      {selectedCoupon.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">الوصف</Typography>
                <Typography variant="body1" paragraph>{selectedCoupon.description}</Typography>
                
                <Typography variant="subtitle2" color="text.secondary">قيمة الخصم</Typography>
                <Typography variant="h6" color="primary">
                  {selectedCoupon.type === 'percentage' ? `${selectedCoupon.value}%` : `$${selectedCoupon.value}`}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">الاستخدام</Typography>
                <Typography variant="body1">
                  {selectedCoupon.usedCount} / {selectedCoupon.usageLimit || '∞'}
                </Typography>
                
                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>الصلاحية</Typography>
                <Typography variant="body1">
                  من {new Date(selectedCoupon.startDate).toLocaleDateString('ar-SA')} إلى {new Date(selectedCoupon.endDate).toLocaleDateString('ar-SA')}
                </Typography>
              </Grid>
            </Grid>
          ) : (
            // Add/Edit Mode
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="كود الكوبون"
                  value={formData.code}
                  onChange={handleFormChange('code')}
                  error={!!errors.code}
                  helperText={errors.code}
                  required
                  inputProps={{ style: { textTransform: 'uppercase' } }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="اسم الكوبون"
                  value={formData.name}
                  onChange={handleFormChange('name')}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="وصف الكوبون"
                  value={formData.description}
                  onChange={handleFormChange('description')}
                  error={!!errors.description}
                  helperText={errors.description}
                  multiline
                  rows={3}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>نوع الخصم</InputLabel>
                  <Select
                    value={formData.type}
                    onChange={handleFormChange('type')}
                    label="نوع الخصم"
                  >
                    <MenuItem value="percentage">نسبة مئوية</MenuItem>
                    <MenuItem value="fixed">مبلغ ثابت</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="قيمة الخصم"
                  type="number"
                  value={formData.value}
                  onChange={handleFormChange('value')}
                  error={!!errors.value}
                  helperText={errors.value}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {formData.type === 'percentage' ? '%' : '$'}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="الحد الأدنى للطلب"
                  type="number"
                  value={formData.minAmount}
                  onChange={handleFormChange('minAmount')}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">ج.م</InputAdornment>,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="الحد الأقصى للخصم"
                  type="number"
                  value={formData.maxDiscount}
                  onChange={handleFormChange('maxDiscount')}
                  disabled={formData.type === 'fixed'}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">ج.م</InputAdornment>,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="حد الاستخدام"
                  type="number"
                  value={formData.usageLimit}
                  onChange={handleFormChange('usageLimit')}
                  helperText="اتركه فارغاً للاستخدام بلا حدود"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="تاريخ البداية"
                  type="date"
                  value={formData.startDate}
                  onChange={handleFormChange('startDate')}
                  error={!!errors.startDate}
                  helperText={errors.startDate}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="تاريخ النهاية"
                  type="date"
                  value={formData.endDate}
                  onChange={handleFormChange('endDate')}
                  error={!!errors.endDate}
                  helperText={errors.endDate}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>نطاق التطبيق</InputLabel>
                  <Select
                    value={formData.applyTo}
                    onChange={handleFormChange('applyTo')}
                    label="نطاق التطبيق"
                  >
                    <MenuItem value="all">جميع المنتجات</MenuItem>
                    <MenuItem value="categories">فئات محددة</MenuItem>
                    <MenuItem value="products">منتجات محددة</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {formData.applyTo === 'categories' && (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>الفئات المطبقة</InputLabel>
                    <Select
                      multiple
                      value={formData.categories}
                      onChange={handleFormChange('categories')}
                      label="الفئات المطبقة"
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => {
                            const category = categories.find(cat => cat._id === value);
                            return (
                              <Chip key={value} label={category?.name} size="small" />
                            );
                          })}
                        </Box>
                      )}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category._id} value={category._id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              {formData.applyTo === 'products' && (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>المنتجات المطبقة</InputLabel>
                    <Select
                      multiple
                      value={formData.products}
                      onChange={handleFormChange('products')}
                      label="المنتجات المطبقة"
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => {
                            const product = products.find(prod => prod._id === value);
                            return (
                              <Chip 
                                key={value} 
                                label={`${product?.name} - $${product?.price}`} 
                                size="small" 
                              />
                            );
                          })}
                        </Box>
                      )}
                    >
                      {products.map((product) => (
                        <MenuItem key={product._id} value={product._id}>
                          {product.name} - ${product.price}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            {dialogMode === 'view' ? 'إغلاق' : 'إلغاء'}
          </Button>
          {dialogMode !== 'view' && (
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                }
              }}
            >
              {dialogMode === 'add' ? 'إضافة' : 'حفظ التغييرات'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Coupons; 