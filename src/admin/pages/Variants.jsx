import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TablePagination, IconButton, Chip,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions, FormControl,
  InputLabel, Select, MenuItem, Grid, InputAdornment, Tooltip, useTheme,
  alpha, CircularProgress, Avatar, Switch, FormControlLabel, Divider,
  FormGroup, Checkbox,
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon,
  Search as SearchIcon, Refresh as RefreshIcon, FilterAlt as FilterIcon,
  TrendingUp as TrendingIcon, Palette as ColorIcon, Straighten as SizeIcon,
  Category as VariantIcon, Image as ImageIcon, Inventory as StockIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const initialVariants = [
  {
    id: 1, name: 'ألوان الهواتف الذكية', type: 'color', category: 'إلكترونيات',
    values: [
      { id: 1, value: 'أسود', colorCode: '#000000', image: 'https://via.placeholder.com/50x50/000000/000000',
        price: 0, stock: 150, sku: 'COLOR-BLACK', isActive: true },
      { id: 2, value: 'أبيض', colorCode: '#FFFFFF', image: 'https://via.placeholder.com/50x50/FFFFFF/FFFFFF',
        price: 0, stock: 120, sku: 'COLOR-WHITE', isActive: true },
      { id: 3, value: 'أزرق', colorCode: '#0066CC', image: 'https://via.placeholder.com/50x50/0066CC/0066CC',
        price: 50, stock: 80, sku: 'COLOR-BLUE', isActive: true },
    ],
    isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 2, name: 'أحجام الملابس', type: 'size', category: 'ملابس',
    values: [
      { id: 5, value: 'Small', description: 'مقاس صغير', measurements: 'الصدر: 90-95 سم',
        price: 0, stock: 200, sku: 'SIZE-S', isActive: true },
      { id: 6, value: 'Medium', description: 'مقاس متوسط', measurements: 'الصدر: 96-101 سم',
        price: 0, stock: 300, sku: 'SIZE-M', isActive: true },
      { id: 7, value: 'Large', description: 'مقاس كبير', measurements: 'الصدر: 102-107 سم',
        price: 0, stock: 250, sku: 'SIZE-L', isActive: true },
    ],
    isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
];

const Variants = () => {
  const theme = useTheme();
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [formData, setFormData] = useState({
    name: '', type: '', category: '', values: [], isActive: true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => { loadVariants(); }, []);

  const loadVariants = () => {
    setLoading(true);
    try {
      const savedVariants = localStorage.getItem('adminVariants');
      if (savedVariants) {
        setVariants(JSON.parse(savedVariants));
      } else {
        setVariants(initialVariants);
        localStorage.setItem('adminVariants', JSON.stringify(initialVariants));
      }
    } catch (error) {
      console.error('Error loading variants:', error);
      toast.error('فشل في تحميل الخيارات');
    } finally {
      setLoading(false);
    }
  };

  const saveVariants = (updatedVariants) => {
    try {
      localStorage.setItem('adminVariants', JSON.stringify(updatedVariants));
      setVariants(updatedVariants);
    } catch (error) {
      console.error('Error saving variants:', error);
      toast.error('فشل في حفظ البيانات');
    }
  };

  const filteredVariants = variants.filter(variant => {
    const matchesSearch = variant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         variant.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || variant.type === filterType;
    const matchesCategory = !filterCategory || variant.category === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const handleChangePage = (event, newPage) => { setPage(newPage); };
  const handleChangeRowsPerPage = (event) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); };

  const resetForm = () => {
    setFormData({ name: '', type: '', category: '', values: [], isActive: true, });
    setErrors({});
  };

  const handleOpenDialog = (mode, variant = null) => {
    setDialogMode(mode);
    setSelectedVariant(variant);
    
    if (mode === 'edit' && variant) {
      setFormData({
        name: variant.name, type: variant.type, category: variant.category,
        values: variant.values, isActive: variant.isActive,
      });
    } else {
      resetForm();
    }
    
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); setSelectedVariant(null); resetForm();
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'اسم الخيار مطلوب';
    if (!formData.type) newErrors.type = 'نوع الخيار مطلوب';
    if (!formData.category.trim()) newErrors.category = 'الفئة مطلوبة';
    if (formData.values.length === 0) newErrors.values = 'يجب إضافة قيمة واحدة على الأقل';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveVariant = () => {
    if (!validateForm()) return;

    try {
      const variantData = {
        name: formData.name.trim(), type: formData.type, category: formData.category.trim(),
        values: formData.values, isActive: formData.isActive, updatedAt: new Date().toISOString(),
      };

      let updatedVariants;

      if (dialogMode === 'add') {
        const newId = Math.max(...variants.map(v => v.id), 0) + 1;
        const newVariant = { ...variantData, id: newId, createdAt: new Date().toISOString(), };
        updatedVariants = [...variants, newVariant];
        toast.success('تم إضافة الخيار بنجاح');
      } else {
        updatedVariants = variants.map(variant =>
          variant.id === selectedVariant.id ? { ...variant, ...variantData } : variant
        );
        toast.success('تم تحديث الخيار بنجاح');
      }

      saveVariants(updatedVariants);
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving variant:', error);
      toast.error('فشل في حفظ الخيار');
    }
  };

  const handleDeleteVariant = (variantId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الخيار؟')) {
      try {
        const updatedVariants = variants.filter(variant => variant.id !== variantId);
        saveVariants(updatedVariants);
        toast.success('تم حذف الخيار بنجاح');
      } catch (error) {
        console.error('Error deleting variant:', error);
        toast.error('فشل في حذف الخيار');
      }
    }
  };

  const handleToggleStatus = (variantId, newStatus) => {
    try {
      const updatedVariants = variants.map(variant =>
        variant.id === variantId ? { ...variant, isActive: newStatus } : variant
      );
      saveVariants(updatedVariants);
      toast.success(newStatus ? 'تم تفعيل الخيار' : 'تم إلغاء تفعيل الخيار');
    } catch (error) {
      console.error('Error toggling variant status:', error);
      toast.error('فشل في تغيير حالة الخيار');
    }
  };

  const addVariantValue = () => {
    const newValue = {
      id: Date.now(), value: '', description: '', price: 0, stock: 0, sku: '', isActive: true
    };

    if (formData.type === 'color') {
      newValue.colorCode = '#000000';
      newValue.image = '';
    } else if (formData.type === 'size') {
      newValue.measurements = '';
    }

    setFormData(prev => ({ ...prev, values: [...prev.values, newValue] }));
  };

  const removeVariantValue = (valueId) => {
    setFormData(prev => ({ ...prev, values: prev.values.filter(v => v.id !== valueId) }));
  };

  const updateVariantValue = (valueId, field, value) => {
    setFormData(prev => ({
      ...prev, values: prev.values.map(v => v.id === valueId ? { ...v, [field]: value } : v)
    }));
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'color': return <ColorIcon />;
      case 'size': return <SizeIcon />;
      default: return <VariantIcon />;
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'color': return 'لون';
      case 'size': return 'حجم';
      case 'storage': return 'تخزين';
      case 'material': return 'مادة';
      default: return type;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const formatCurrency = (amount) => { return `${amount.toLocaleString()} ج.م`; };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  const totalValues = variants.reduce((sum, v) => sum + v.values.length, 0);
  const activeVariants = variants.filter(v => v.isActive).length;
  const totalStock = variants.reduce((sum, v) => 
    sum + v.values.reduce((vSum, val) => vSum + val.stock, 0), 0
  );
  const categories = [...new Set(variants.map(v => v.category))];

  return (
    <Box sx={{ p: 3 }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>إدارة خيارات المنتجات</Typography>
          <Typography variant="body1" color="text.secondary">إدارة الألوان والأحجام والخيارات المختلفة للمنتجات</Typography>
        </Box>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3} size={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">{variants.length}</Typography>
                    <Typography variant="h6">إجمالي الخيارات</Typography>
                  </Box>
                  <VariantIcon sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3} size={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)', color: 'white', borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">{activeVariants}</Typography>
                    <Typography variant="h6">خيارات نشطة</Typography>
                  </Box>
                  <TrendingIcon sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3} size={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)', color: 'white', borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">{totalValues}</Typography>
                    <Typography variant="h6">إجمالي القيم</Typography>
                  </Box>
                  <ColorIcon sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3} size={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)', color: 'white', borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">{totalStock}</Typography>
                    <Typography variant="h6">إجمالي المخزون</Typography>
                  </Box>
                  <StockIcon sx={{ fontSize: 40 }} />
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
              <Grid item xs={12} md={4}>
                <TextField fullWidth placeholder="البحث في الخيارات..." value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment> }}
                />
              </Grid>
              
              <Grid item xs={12} md={2}>
                <FormControl sx={{ minWidth: 120 }} fullWidth>
                  <InputLabel>النوع</InputLabel>
                  <Select value={filterType} onChange={(e) => setFilterType(e.target.value)} label="النوع">
                    <MenuItem value="">جميع الأنواع</MenuItem>
                    <MenuItem value="color">لون</MenuItem>
                    <MenuItem value="size">حجم</MenuItem>
                    <MenuItem value="storage">تخزين</MenuItem>
                    <MenuItem value="material">مادة</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <FormControl sx={{ minWidth: 120 }} fullWidth>
                  <InputLabel>الفئة</InputLabel>
                  <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} label="الفئة">
                    <MenuItem value="">جميع الفئات</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <Button variant="outlined" startIcon={<RefreshIcon sx={{ml: 1}}/>} onClick={loadVariants} fullWidth>تحديث</Button>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <Button variant="contained" startIcon={<AddIcon sx={{ml: 1}}/>} onClick={() => handleOpenDialog('add')} fullWidth
                  sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': { background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)' } }}>
                  إضافة خيار
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
                  <TableCell sx={{ fontWeight: 'bold' }} align='center'>الخيار</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align='center'>النوع والفئة</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align='center'>القيم</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align='center'>المخزون</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align='center'>الحالة</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align='center'>التاريخ</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align='center'>الإجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <AnimatePresence>
                  {filteredVariants.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((variant, index) => (
                      <motion.tr key={variant.id} component={TableRow}
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              {getTypeIcon(variant.type)}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="bold">{variant.name}</Typography>
                              <Typography variant="caption" color="text.secondary">ID: {variant.id}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Chip label={getTypeText(variant.type)} size="small" color="primary" sx={{ mb: 0.5 }} />
                            <Typography variant="body2" color="text.secondary" textAlign={'center'}>{variant.category}</Typography>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h6" fontWeight="bold" color="primary">{variant.values.length}</Typography>
                            <Typography variant="caption" color="text.secondary">قيمة</Typography>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold" align='center'>
                            {variant.values.reduce((sum, v) => sum + v.stock, 0)}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Chip label={variant.isActive ? 'نشط' : 'غير نشط'} color={variant.isActive ? 'success' : 'default'} size="small" />
                            <Switch checked={variant.isActive} onChange={(e) => handleToggleStatus(variant.id, e.target.checked)} size="small" />
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="caption" color="text.secondary" textAlign={'center'}>{formatDate(variant.createdAt)}</Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 , justifyContent: 'center' }}>
                            <Tooltip title="عرض">
                              <IconButton size="small" color="info" onClick={() => handleOpenDialog('view', variant)}>
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="تعديل">
                              <IconButton size="small" color="primary" onClick={() => handleOpenDialog('edit', variant)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="حذف">
                              <IconButton size="small" color="error" onClick={() => handleDeleteVariant(variant.id)}>
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
          
          <TablePagination component="div" count={filteredVariants.length} page={page}
            onPageChange={handleChangePage} rowsPerPage={rowsPerPage} onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="عدد الصفوف في الصفحة:" labelDisplayedRows={({ from, to, count }) => `${from}-${to} من ${count}`} />
        </Card>
      </motion.div>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', fontWeight: 'bold' }}>
          {dialogMode === 'add' ? 'إضافة خيار جديد' : 
           dialogMode === 'edit' ? 'تعديل الخيار' : 'عرض الخيار'}
        </DialogTitle>
        
        <DialogContent sx={{ p: 3, mt: 2 }}>
          {dialogMode === 'view' && selectedVariant ? (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>{selectedVariant.name}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip label={getTypeText(selectedVariant.type)} color="primary" />
                    <Chip label={selectedVariant.category} variant="outlined" />
                    <Chip label={selectedVariant.isActive ? 'نشط' : 'غير نشط'} 
                      color={selectedVariant.isActive ? 'success' : 'default'} />
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                    <Typography variant="h6" fontWeight="bold" color="primary">{selectedVariant.values.length}</Typography>
                    <Typography variant="body2">قيمة إجمالية</Typography>
                  </Card>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>القيم المتاحة:</Typography>
              <Grid container spacing={2}>
                {selectedVariant.values.map((value) => (
                  <Grid item xs={12} sm={6} md={4} key={value.id}>
                    <Card sx={{ p: 2, height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        {selectedVariant.type === 'color' && value.colorCode && (
                          <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: value.colorCode, border: '1px solid #ddd' }} />
                        )}
                        <Typography variant="subtitle2" fontWeight="bold">{value.value}</Typography>
                        <Chip label={value.isActive ? 'نشط' : 'غير نشط'} size="small" color={value.isActive ? 'success' : 'default'} />
                      </Box>
                      
                      {value.description && (
                        <Typography variant="body2" color="text.secondary" gutterBottom>{value.description}</Typography>
                      )}
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="caption">السعر: {formatCurrency(value.price)}</Typography>
                        <Typography variant="caption">المخزون: {value.stock}</Typography>
                      </Box>
                      
                      {value.sku && (
                        <Typography variant="caption" color="text.secondary">SKU: {value.sku}</Typography>
                      )}
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="اسم الخيار" value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    error={!!errors.name} helperText={errors.name} required />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required error={!!errors.type}>
                    <InputLabel>نوع الخيار</InputLabel>
                    <Select value={formData.type} onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))} label="نوع الخيار">
                      <MenuItem value="color">لون</MenuItem>
                      <MenuItem value="size">حجم</MenuItem>
                      <MenuItem value="storage">تخزين</MenuItem>
                      <MenuItem value="material">مادة</MenuItem>
                    </Select>
                    {errors.type && <Typography variant="caption" color="error" sx={{ mt: 1 }}>{errors.type}</Typography>}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="الفئة" value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    error={!!errors.category} helperText={errors.category} required />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch checked={formData.isActive}
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))} />
                    }
                    label="خيار نشط"
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">قيم الخيار:</Typography>
                <Button variant="outlined" startIcon={<AddIcon />} onClick={addVariantValue} disabled={!formData.type}>
                  إضافة قيمة
                </Button>
              </Box>

              {errors.values && (
                <Typography variant="caption" color="error" sx={{ mb: 2, display: 'block' }}>{errors.values}</Typography>
              )}

              <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                {formData.values.map((value, index) => (
                  <Card key={value.id} sx={{ p: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle2">قيمة #{index + 1}</Typography>
                      <IconButton size="small" color="error" onClick={() => removeVariantValue(value.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField fullWidth label="القيمة" value={value.value}
                          onChange={(e) => updateVariantValue(value.id, 'value', e.target.value)} size="small" required />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <TextField fullWidth label="الوصف" value={value.description || ''}
                          onChange={(e) => updateVariantValue(value.id, 'description', e.target.value)} size="small" />
                      </Grid>
                      
                      {formData.type === 'color' && (
                        <>
                          <Grid item xs={12} md={6}>
                            <TextField fullWidth label="كود اللون" type="color" value={value.colorCode || '#000000'}
                              onChange={(e) => updateVariantValue(value.id, 'colorCode', e.target.value)} size="small" />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField fullWidth label="رابط الصورة" value={value.image || ''}
                              onChange={(e) => updateVariantValue(value.id, 'image', e.target.value)} size="small" />
                          </Grid>
                        </>
                      )}
                      
                      {formData.type === 'size' && (
                        <Grid item xs={12}>
                          <TextField fullWidth label="القياسات" value={value.measurements || ''}
                            onChange={(e) => updateVariantValue(value.id, 'measurements', e.target.value)}
                            size="small" placeholder="مثال: الصدر: 90-95 سم" />
                        </Grid>
                      )}
                      
                      <Grid item xs={12} md={4}>
                        <TextField fullWidth label="السعر الإضافي" type="number" value={value.price}
                          onChange={(e) => updateVariantValue(value.id, 'price', parseFloat(e.target.value) || 0)} size="small" />
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <TextField fullWidth label="المخزون" type="number" value={value.stock}
                          onChange={(e) => updateVariantValue(value.id, 'stock', parseInt(e.target.value) || 0)} size="small" />
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <TextField fullWidth label="SKU" value={value.sku || ''}
                          onChange={(e) => updateVariantValue(value.id, 'sku', e.target.value)} size="small" />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Checkbox checked={value.isActive}
                              onChange={(e) => updateVariantValue(value.id, 'isActive', e.target.checked)} />
                          }
                          label="قيمة نشطة"
                        />
                      </Grid>
                    </Grid>
                  </Card>
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            {dialogMode === 'view' ? 'إغلاق' : 'إلغاء'}
          </Button>
          {dialogMode !== 'view' && (
            <Button variant="contained" onClick={handleSaveVariant}
              sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': { background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)' } }}>
              {dialogMode === 'add' ? 'إضافة' : 'حفظ التغييرات'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Variants; 