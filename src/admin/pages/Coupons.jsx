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
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
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
  });

  const [errors, setErrors] = useState({});

  // Load coupons from localStorage on component mount
  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = () => {
    setLoading(true);
    try {
      const savedCoupons = localStorage.getItem('adminCoupons');
      if (savedCoupons) {
        setCoupons(JSON.parse(savedCoupons));
      } else {
        // Initialize with sample data
        setCoupons(initialCoupons);
        localStorage.setItem('adminCoupons', JSON.stringify(initialCoupons));
      }
    } catch (error) {
      console.error('Error loading coupons:', error);
      toast.error('فشل في تحميل الكوبونات');
    } finally {
      setLoading(false);
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
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coupon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coupon.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filterStatus || 
      (filterStatus === 'active' && coupon.isActive) ||
      (filterStatus === 'inactive' && !coupon.isActive);
    
    const matchesType = !filterType || coupon.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
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
    });
    setErrors({});
  };

  const handleOpenDialog = (mode, coupon = null) => {
    setDialogMode(mode);
    setSelectedCoupon(coupon);
    
    if (mode === 'edit' && coupon) {
      setFormData({
        code: coupon.code,
        name: coupon.name,
        description: coupon.description,
        type: coupon.type,
        value: coupon.value.toString(),
        minAmount: coupon.minAmount ? coupon.minAmount.toString() : '',
        maxDiscount: coupon.maxDiscount ? coupon.maxDiscount.toString() : '',
        usageLimit: coupon.usageLimit ? coupon.usageLimit.toString() : '',
        isActive: coupon.isActive,
        startDate: coupon.startDate,
        endDate: coupon.endDate,
        categories: coupon.categories || [],
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

    if (!formData.code.trim()) newErrors.code = 'كود الكوبون مطلوب';
    if (!formData.name.trim()) newErrors.name = 'اسم الكوبون مطلوب';
    if (!formData.description.trim()) newErrors.description = 'وصف الكوبون مطلوب';
    if (!formData.value || parseFloat(formData.value) <= 0) newErrors.value = 'قيمة الخصم مطلوبة ويجب أن تكون أكبر من صفر';
    if (formData.type === 'percentage' && parseFloat(formData.value) > 100) newErrors.value = 'نسبة الخصم يجب أن تكون أقل من أو تساوي 100%';
    if (!formData.startDate) newErrors.startDate = 'تاريخ البداية مطلوب';
    if (!formData.endDate) newErrors.endDate = 'تاريخ النهاية مطلوب';
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveCoupon = () => {
    if (!validateForm()) return;

    try {
      const selectedCategories = categories.filter(cat => formData.categories.includes(cat.id));
      
      const couponData = {
        code: formData.code.trim().toUpperCase(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        type: formData.type,
        value: parseFloat(formData.value),
        minAmount: formData.minAmount ? parseFloat(formData.minAmount) : null,
        maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
        usedCount: 0,
        isActive: formData.isActive,
        startDate: formData.startDate,
        endDate: formData.endDate,
        categories: formData.categories,
        categoryNames: selectedCategories.map(cat => cat.name),
        updatedAt: new Date().toISOString(),
      };

      let updatedCoupons;

      if (dialogMode === 'add') {
        // Check if coupon code already exists
        const existingCoupon = coupons.find(c => c.code === couponData.code);
        if (existingCoupon) {
          setErrors({ code: 'كود الكوبون موجود بالفعل' });
          return;
        }

        const newId = Math.max(...coupons.map(c => c.id), 0) + 1;
        const newCoupon = {
          ...couponData,
          id: newId,
          createdAt: new Date().toISOString(),
        };
        updatedCoupons = [...coupons, newCoupon];
        toast.success('تم إضافة الكوبون بنجاح');
      } else {
        // Check if coupon code already exists (excluding current coupon)
        const existingCoupon = coupons.find(c => c.code === couponData.code && c.id !== selectedCoupon.id);
        if (existingCoupon) {
          setErrors({ code: 'كود الكوبون موجود بالفعل' });
          return;
        }

        updatedCoupons = coupons.map(coupon =>
          coupon.id === selectedCoupon.id
            ? { ...coupon, ...couponData, usedCount: coupon.usedCount }
            : coupon
        );
        toast.success('تم تحديث الكوبون بنجاح');
      }

      saveCoupons(updatedCoupons);
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving coupon:', error);
      toast.error('فشل في حفظ الكوبون');
    }
  };

  const handleDeleteCoupon = (couponId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الكوبون؟')) {
      try {
        const updatedCoupons = coupons.filter(coupon => coupon.id !== couponId);
        saveCoupons(updatedCoupons);
        toast.success('تم حذف الكوبون بنجاح');
      } catch (error) {
        console.error('Error deleting coupon:', error);
        toast.error('فشل في حذف الكوبون');
      }
    }
  };

  const handleToggleStatus = (couponId, newStatus) => {
    try {
      const updatedCoupons = coupons.map(coupon =>
        coupon.id === couponId ? { ...coupon, isActive: newStatus } : coupon
      );
      saveCoupons(updatedCoupons);
      toast.success(newStatus ? 'تم تفعيل الكوبون' : 'تم إلغاء تفعيل الكوبون');
    } catch (error) {
      console.error('Error toggling coupon status:', error);
      toast.error('فشل في تغيير حالة الكوبون');
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
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  placeholder="البحث في الكوبونات..."
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
              
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>الحالة</InputLabel>
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    label="الحالة"
                  >
                    <MenuItem value="">جميع الحالات</MenuItem>
                    <MenuItem value="active">نشط</MenuItem>
                    <MenuItem value="inactive">غير نشط</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>النوع</InputLabel>
                  <Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    label="النوع"
                  >
                    <MenuItem value="">جميع الأنواع</MenuItem>
                    <MenuItem value="percentage">نسبة مئوية</MenuItem>
                    <MenuItem value="fixed">مبلغ ثابت</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={loadCoupons}
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
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>الكوبون</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>النوع</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>القيمة</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>الاستخدام</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>التواريخ</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>الحالة</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>الإجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <AnimatePresence>
                  {filteredCoupons
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((coupon, index) => (
                      <motion.tr
                        key={coupon.id}
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
                            {coupon.categoryNames && coupon.categoryNames.length > 0 && (
                              <Box sx={{ mt: 0.5 }}>
                                {coupon.categoryNames.slice(0, 2).map((category, idx) => (
                                  <Chip
                                    key={idx}
                                    label={category}
                                    size="small"
                                    variant="outlined"
                                    sx={{ mr: 0.5, fontSize: '0.7rem' }}
                                  />
                                ))}
                                {coupon.categoryNames.length > 2 && (
                                  <Chip
                                    label={`+${coupon.categoryNames.length - 2}`}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontSize: '0.7rem' }}
                                  />
                                )}
                              </Box>
                            )}
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Chip
                            label={coupon.type === 'percentage' ? 'نسبة مئوية' : 'مبلغ ثابت'}
                            color={coupon.type === 'percentage' ? 'secondary' : 'primary'}
                            size="small"
                            icon={coupon.type === 'percentage' ? <PercentIcon /> : <MoneyIcon />}
                          />
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`}
                          </Typography>
                          {coupon.minAmount && (
                            <Typography variant="caption" color="text.secondary">
                              حد أدنى: ${coupon.minAmount}
                            </Typography>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              {coupon.usedCount} / {coupon.usageLimit || '∞'}
                            </Typography>
                            <Box sx={{ 
                              width: 60, 
                              height: 4, 
                              bgcolor: 'grey.300', 
                              borderRadius: 2,
                              mt: 0.5 
                            }}>
                              <Box sx={{
                                width: coupon.usageLimit ? `${(coupon.usedCount / coupon.usageLimit) * 100}%` : '0%',
                                height: '100%',
                                bgcolor: coupon.usageLimit && coupon.usedCount >= coupon.usageLimit ? 'error.main' : 'primary.main',
                                borderRadius: 2,
                              }} />
                            </Box>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              من: {new Date(coupon.startDate).toLocaleDateString('ar-SA')}
                            </Typography>
                            <br />
                            <Typography variant="caption" color="text.secondary">
                              إلى: {new Date(coupon.endDate).toLocaleDateString('ar-SA')}
                            </Typography>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Chip
                              label={isActive(coupon) ? 'نشط' : isExpired(coupon.endDate) ? 'منتهي' : 'غير نشط'}
                              color={isActive(coupon) ? 'success' : isExpired(coupon.endDate) ? 'error' : 'default'}
                              size="small"
                            />
                            <Switch
                              checked={coupon.isActive}
                              onChange={(e) => handleToggleStatus(coupon.id, e.target.checked)}
                              size="small"
                              disabled={isExpired(coupon.endDate)}
                            />
                          </Box>
                        </TableCell>
                        
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
                                onClick={() => handleDeleteCoupon(coupon.id)}
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
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
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
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
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
                  <InputLabel>الفئات المطبقة</InputLabel>
                  <Select
                    multiple
                    value={formData.categories}
                    onChange={handleFormChange('categories')}
                    label="الفئات المطبقة"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                          const category = categories.find(cat => cat.id === value);
                          return (
                            <Chip key={value} label={category?.name} size="small" />
                          );
                        })}
                      </Box>
                    )}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={handleFormChange('isActive')}
                      color="primary"
                    />
                  }
                  label="كوبون نشط"
                />
              </Grid>
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
              onClick={handleSaveCoupon}
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