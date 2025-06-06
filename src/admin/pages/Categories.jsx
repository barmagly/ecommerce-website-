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
  Avatar,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Category as CategoryIcon,
  Refresh as RefreshIcon,
  Image as ImageIcon,
  Inventory as ProductsIcon,
  TrendingUp as TrendingIcon,
  LocalOffer as OffersIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

// Initial sample categories
const initialCategories = [
  {
    id: 1,
    name: 'إلكترونيات',
    slug: 'electronics',
    description: 'جميع المنتجات الإلكترونية والأجهزة الذكية',
    image: 'https://via.placeholder.com/200x200?text=Electronics',
    parentId: null,
    level: 0,
    isActive: true,
    isFeatured: true,
    sortOrder: 1,
    productsCount: 125,
    metaTitle: 'إلكترونيات - متجر إلكتروني',
    metaDescription: 'تسوق أحدث الأجهزة الإلكترونية والهواتف الذكية',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'هواتف ذكية',
    slug: 'smartphones',
    description: 'أحدث الهواتف الذكية من جميع العلامات التجارية',
    image: 'https://via.placeholder.com/200x200?text=Phones',
    parentId: 1,
    level: 1,
    isActive: true,
    isFeatured: false,
    sortOrder: 1,
    productsCount: 45,
    metaTitle: 'هواتف ذكية',
    metaDescription: 'هواتف ذكية بأحدث التقنيات',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'ملابس',
    slug: 'clothing',
    description: 'أزياء عصرية للرجال والنساء والأطفال',
    image: 'https://via.placeholder.com/200x200?text=Clothing',
    parentId: null,
    level: 0,
    isActive: true,
    isFeatured: true,
    sortOrder: 2,
    productsCount: 89,
    metaTitle: 'ملابس وأزياء',
    metaDescription: 'أحدث صيحات الموضة والأزياء العصرية',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'ملابس رجالية',
    slug: 'mens-clothing',
    description: 'ملابس أنيقة للرجال',
    image: 'https://via.placeholder.com/200x200?text=Mens',
    parentId: 3,
    level: 1,
    isActive: true,
    isFeatured: false,
    sortOrder: 1,
    productsCount: 34,
    metaTitle: 'ملابس رجالية',
    metaDescription: 'ملابس رجالية أنيقة وعصرية',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 5,
    name: 'كتب',
    slug: 'books',
    description: 'كتب في جميع المجالات والتخصصات',
    image: 'https://via.placeholder.com/200x200?text=Books',
    parentId: null,
    level: 0,
    isActive: true,
    isFeatured: false,
    sortOrder: 3,
    productsCount: 67,
    metaTitle: 'كتب ومراجع',
    metaDescription: 'مكتبة شاملة للكتب والمراجع',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 6,
    name: 'منزل وحديقة',
    slug: 'home-garden',
    description: 'أدوات ومستلزمات المنزل والحديقة',
    image: 'https://via.placeholder.com/200x200?text=Home',
    parentId: null,
    level: 0,
    isActive: false,
    isFeatured: false,
    sortOrder: 4,
    productsCount: 23,
    metaTitle: 'منزل وحديقة',
    metaDescription: 'كل ما تحتاجه للمنزل والحديقة',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const Categories = () => {
  const theme = useTheme();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add', 'edit', 'view'
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    parentId: '',
    isActive: true,
    isFeatured: false,
    sortOrder: '',
    metaTitle: '',
    metaDescription: '',
  });

  const [errors, setErrors] = useState({});

  // Load categories from localStorage on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    setLoading(true);
    try {
      const savedCategories = localStorage.getItem('adminCategories');
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories));
      } else {
        // Initialize with sample data
        setCategories(initialCategories);
        localStorage.setItem('adminCategories', JSON.stringify(initialCategories));
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('فشل في تحميل الفئات');
    } finally {
      setLoading(false);
    }
  };

  const saveCategories = (updatedCategories) => {
    try {
      localStorage.setItem('adminCategories', JSON.stringify(updatedCategories));
      setCategories(updatedCategories);
    } catch (error) {
      console.error('Error saving categories:', error);
      toast.error('فشل في حفظ البيانات');
    }
  };

  // Generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[أإآ]/g, 'a')
      .replace(/[ة]/g, 'h')
      .replace(/[ي]/g, 'y')
      .replace(/[و]/g, 'w')
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  // Get parent categories (level 0)
  const getParentCategories = () => {
    return categories.filter(cat => cat.level === 0);
  };

  // Get category hierarchy display
  const getCategoryHierarchy = (category) => {
    if (category.level === 0) return category.name;
    const parent = categories.find(cat => cat.id === category.parentId);
    return parent ? `${parent.name} > ${category.name}` : category.name;
  };

  // Filter categories based on search and filters
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filterStatus || 
      (filterStatus === 'active' && category.isActive) ||
      (filterStatus === 'inactive' && !category.isActive);
    
    const matchesLevel = !filterLevel || category.level.toString() === filterLevel;
    
    return matchesSearch && matchesStatus && matchesLevel;
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
      name: '',
      slug: '',
      description: '',
      image: '',
      parentId: '',
      isActive: true,
      isFeatured: false,
      sortOrder: '',
      metaTitle: '',
      metaDescription: '',
    });
    setErrors({});
  };

  const handleOpenDialog = (mode, category = null) => {
    setDialogMode(mode);
    setSelectedCategory(category);
    
    if (mode === 'edit' && category) {
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        parentId: category.parentId ? category.parentId.toString() : '',
        isActive: category.isActive,
        isFeatured: category.isFeatured,
        sortOrder: category.sortOrder.toString(),
        metaTitle: category.metaTitle || '',
        metaDescription: category.metaDescription || '',
      });
    } else {
      resetForm();
    }
    
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCategory(null);
    resetForm();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'اسم الفئة مطلوب';
    if (!formData.slug.trim()) newErrors.slug = 'رابط الفئة مطلوب';
    if (!formData.description.trim()) newErrors.description = 'وصف الفئة مطلوب';
    if (!formData.sortOrder || parseInt(formData.sortOrder) < 0) newErrors.sortOrder = 'ترتيب الفئة مطلوب';

    // Check if slug is unique
    const existingCategory = categories.find(cat => 
      cat.slug === formData.slug && (!selectedCategory || cat.id !== selectedCategory.id)
    );
    if (existingCategory) newErrors.slug = 'رابط الفئة موجود بالفعل';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveCategory = () => {
    if (!validateForm()) return;

    try {
      const categoryData = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim(),
        image: formData.image.trim() || 'https://via.placeholder.com/200x200?text=Category',
        parentId: formData.parentId ? parseInt(formData.parentId) : null,
        level: formData.parentId ? 1 : 0,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        sortOrder: parseInt(formData.sortOrder),
        productsCount: 0,
        metaTitle: formData.metaTitle.trim() || formData.name.trim(),
        metaDescription: formData.metaDescription.trim() || formData.description.trim(),
        updatedAt: new Date().toISOString(),
      };

      let updatedCategories;

      if (dialogMode === 'add') {
        const newId = Math.max(...categories.map(c => c.id), 0) + 1;
        const newCategory = {
          ...categoryData,
          id: newId,
          createdAt: new Date().toISOString(),
        };
        updatedCategories = [...categories, newCategory];
        toast.success('تم إضافة الفئة بنجاح');
      } else {
        updatedCategories = categories.map(category =>
          category.id === selectedCategory.id
            ? { ...category, ...categoryData }
            : category
        );
        toast.success('تم تحديث الفئة بنجاح');
      }

      saveCategories(updatedCategories);
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('فشل في حفظ الفئة');
    }
  };

  const handleDeleteCategory = (categoryId) => {
    // Check if category has subcategories
    const hasSubcategories = categories.some(cat => cat.parentId === categoryId);
    if (hasSubcategories) {
      toast.error('لا يمكن حذف فئة تحتوي على فئات فرعية');
      return;
    }

    if (window.confirm('هل أنت متأكد من حذف هذه الفئة؟')) {
      try {
        const updatedCategories = categories.filter(category => category.id !== categoryId);
        saveCategories(updatedCategories);
        toast.success('تم حذف الفئة بنجاح');
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('فشل في حذف الفئة');
      }
    }
  };

  const handleToggleStatus = (categoryId, newStatus) => {
    try {
      const updatedCategories = categories.map(category =>
        category.id === categoryId ? { ...category, isActive: newStatus } : category
      );
      saveCategories(updatedCategories);
      toast.success(newStatus ? 'تم تفعيل الفئة' : 'تم إلغاء تفعيل الفئة');
    } catch (error) {
      console.error('Error toggling category status:', error);
      toast.error('فشل في تغيير حالة الفئة');
    }
  };

  const handleFormChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug when name changes
    if (field === 'name' && value) {
      setFormData(prev => ({ ...prev, slug: generateSlug(value) }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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
            إدارة الفئات
          </Typography>
          <Typography variant="body1" color="text.secondary">
            إدارة فئات المنتجات والتصنيفات
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
                  placeholder="البحث في الفئات..."
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
                  <InputLabel>المستوى</InputLabel>
                  <Select
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value)}
                    label="المستوى"
                  >
                    <MenuItem value="">جميع المستويات</MenuItem>
                    <MenuItem value="0">فئة رئيسية</MenuItem>
                    <MenuItem value="1">فئة فرعية</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={loadCategories}
                  fullWidth
                >
                  تحديث
                </Button>
              </Grid>
              
              <Grid item xs={12} md={2}>
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
                  إضافة فئة
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
                      {categories.length}
                    </Typography>
                    <Typography variant="h6">إجمالي الفئات</Typography>
                  </Box>
                  <CategoryIcon sx={{ fontSize: 40 }} />
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
                      {categories.filter(c => c.isActive).length}
                    </Typography>
                    <Typography variant="h6">فئات نشطة</Typography>
                  </Box>
                  <TrendingIcon sx={{ fontSize: 40 }} />
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
                      {categories.filter(c => c.level === 0).length}
                    </Typography>
                    <Typography variant="h6">فئات رئيسية</Typography>
                  </Box>
                  <OffersIcon sx={{ fontSize: 40 }} />
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
                      {categories.reduce((sum, c) => sum + c.productsCount, 0)}
                    </Typography>
                    <Typography variant="h6">إجمالي المنتجات</Typography>
                  </Box>
                  <ProductsIcon sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      {/* Categories Table */}
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
                  <TableCell sx={{ fontWeight: 'bold' }}>الفئة</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>التسلسل الهرمي</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>المنتجات</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>الترتيب</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>الحالة</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>الإجراءات</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                <AnimatePresence>
                  {filteredCategories
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((category, index) => (
                      <motion.tr
                        key={category.id}
                        component={TableRow}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        hover
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              src={category.image}
                              sx={{ width: 50, height: 50, borderRadius: 2 }}
                            >
                              <ImageIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {category.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {category.slug}
                              </Typography>
                              <Box sx={{ mt: 0.5 }}>
                                {category.isFeatured && (
                                  <Chip
                                    label="مميزة"
                                    size="small"
                                    color="warning"
                                    sx={{ mr: 0.5, fontSize: '0.7rem' }}
                                  />
                                )}
                                <Chip
                                  label={category.level === 0 ? 'رئيسية' : 'فرعية'}
                                  size="small"
                                  variant="outlined"
                                  color={category.level === 0 ? 'primary' : 'secondary'}
                                  sx={{ fontSize: '0.7rem' }}
                                />
                              </Box>
                            </Box>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2">
                            {getCategoryHierarchy(category)}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Chip
                            label={category.productsCount}
                            color={category.productsCount > 0 ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {category.sortOrder}
                          </Typography>
                        </TableCell>
                        
                      <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Chip
                              label={category.isActive ? 'نشط' : 'غير نشط'}
                              color={category.isActive ? 'success' : 'default'}
                              size="small"
                            />
                            <Switch
                              checked={category.isActive}
                              onChange={(e) => handleToggleStatus(category.id, e.target.checked)}
                              size="small"
                            />
                        </Box>
                      </TableCell>
                        
                      <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="عرض">
                              <IconButton
                                size="small"
                                color="info"
                                onClick={() => handleOpenDialog('view', category)}
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="تعديل">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleOpenDialog('edit', category)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="حذف">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteCategory(category.id)}
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
            count={filteredCategories.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="عدد الصفوف في الصفحة:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} من ${count}`}
          />
        </Card>
      </motion.div>

      {/* Category Dialog */}
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
          {dialogMode === 'add' ? 'إضافة فئة جديدة' : 
           dialogMode === 'edit' ? 'تعديل الفئة' : 'عرض الفئة'}
        </DialogTitle>
        
        <DialogContent sx={{ p: 3, mt: 2 }}>
          {dialogMode === 'view' && selectedCategory ? (
            // View Mode
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Avatar
                  src={selectedCategory.image}
                  sx={{ width: 200, height: 200, borderRadius: 3, mx: 'auto' }}
                >
                  <ImageIcon sx={{ fontSize: 80 }} />
                </Avatar>
              </Grid>
              
              <Grid item xs={12} md={8}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {selectedCategory.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {selectedCategory.description}
                </Typography>
                
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">الرابط</Typography>
                    <Typography variant="body1">{selectedCategory.slug}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">عدد المنتجات</Typography>
                    <Typography variant="h6">{selectedCategory.productsCount}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">المستوى</Typography>
                    <Typography variant="body1">{selectedCategory.level === 0 ? 'فئة رئيسية' : 'فئة فرعية'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">الترتيب</Typography>
                    <Typography variant="body1">{selectedCategory.sortOrder}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            // Add/Edit Mode
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="اسم الفئة"
                  value={formData.name}
                  onChange={handleFormChange('name')}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="رابط الفئة"
                  value={formData.slug}
                  onChange={handleFormChange('slug')}
                  error={!!errors.slug}
                  helperText={errors.slug}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="وصف الفئة"
                  value={formData.description}
                  onChange={handleFormChange('description')}
                  error={!!errors.description}
                  helperText={errors.description}
                  multiline
                  rows={3}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="رابط الصورة"
                  value={formData.image}
                  onChange={handleFormChange('image')}
                  placeholder="https://example.com/image.jpg"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>الفئة الأساسية</InputLabel>
                  <Select
                    value={formData.parentId}
                    onChange={handleFormChange('parentId')}
                    label="الفئة الأساسية"
                  >
                    <MenuItem value="">فئة رئيسية</MenuItem>
                    {getParentCategories().map((category) => (
                      <MenuItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ترتيب الفئة"
                  type="number"
                  value={formData.sortOrder}
                  onChange={handleFormChange('sortOrder')}
                  error={!!errors.sortOrder}
                  helperText={errors.sortOrder}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="عنوان SEO"
                  value={formData.metaTitle}
                  onChange={handleFormChange('metaTitle')}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="وصف SEO"
                  value={formData.metaDescription}
                  onChange={handleFormChange('metaDescription')}
                  multiline
                  rows={2}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isActive}
                        onChange={handleFormChange('isActive')}
                        color="primary"
                      />
                    }
                    label="فئة نشطة"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isFeatured}
                        onChange={handleFormChange('isFeatured')}
                        color="secondary"
                      />
                    }
                    label="فئة مميزة"
                  />
                </Box>
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
              onClick={handleSaveCategory}
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

export default Categories; 