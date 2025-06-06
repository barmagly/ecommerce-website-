import React, { useState, useEffect } from 'react';
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
  TablePagination,
  Paper,
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
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Inventory as InventoryIcon,
  FilterList as FilterIcon,
  Image as ImageIcon,
  LocalOffer as PriceIcon,
  Category as CategoryIcon,
  Star as StarIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

// Mock categories for dropdown
const categories = [
  { id: 1, name: 'إلكترونيات' },
  { id: 2, name: 'ملابس' },
  { id: 3, name: 'كتب' },
  { id: 4, name: 'منزل وحديقة' },
  { id: 5, name: 'رياضة' },
  { id: 6, name: 'جمال وعناية' },
  { id: 7, name: 'ألعاب' },
  { id: 8, name: 'مجوهرات' },
];

// Initial sample products
const initialProducts = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    description: 'أحدث هاتف من آبل مع تقنيات متطورة',
    price: 999.99,
    salePrice: 899.99,
    category: 'إلكترونيات',
    categoryId: 1,
    stock: 50,
    sku: 'IP15P-001',
    images: ['https://via.placeholder.com/150x150?text=iPhone'],
    status: 'نشط',
    featured: true,
    rating: 4.8,
    reviews: 245,
    tags: ['هاتف', 'آبل', 'جديد'],
    weight: 0.2,
    dimensions: '15.5 x 7.5 x 0.8 cm',
    brand: 'Apple',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Samsung Galaxy S24',
    description: 'هاتف ذكي متطور من سامسونج',
    price: 799.99,
    salePrice: null,
    category: 'إلكترونيات',
    categoryId: 1,
    stock: 30,
    sku: 'SGS24-002',
    images: ['https://via.placeholder.com/150x150?text=Samsung'],
    status: 'نشط',
    featured: false,
    rating: 4.6,
    reviews: 189,
    tags: ['هاتف', 'سامسونج', 'أندرويد'],
    weight: 0.22,
    dimensions: '16 x 7.8 x 0.85 cm',
    brand: 'Samsung',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'قميص قطني أزرق',
    description: 'قميص قطني عالي الجودة للرجال',
    price: 49.99,
    salePrice: 39.99,
    category: 'ملابس',
    categoryId: 2,
    stock: 100,
    sku: 'SHIRT-003',
    images: ['https://via.placeholder.com/150x150?text=Shirt'],
    status: 'نشط',
    featured: true,
    rating: 4.3,
    reviews: 67,
    tags: ['قميص', 'رجالي', 'قطن'],
    weight: 0.3,
    dimensions: 'L x XL',
    brand: 'Fashion Brand',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const Products = () => {
  const theme = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add', 'edit', 'view'
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    salePrice: '',
    categoryId: '',
    stock: '',
    sku: '',
    images: [''],
    status: 'نشط',
    featured: false,
    tags: '',
    weight: '',
    dimensions: '',
    brand: '',
  });

  const [errors, setErrors] = useState({});

  // Load products from localStorage on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    setLoading(true);
    try {
      const savedProducts = localStorage.getItem('adminProducts');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      } else {
        // Initialize with sample data
        setProducts(initialProducts);
        localStorage.setItem('adminProducts', JSON.stringify(initialProducts));
      }
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('فشل في تحميل المنتجات');
    } finally {
      setLoading(false);
    }
  };

  const saveProducts = (updatedProducts) => {
    try {
      localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error saving products:', error);
      toast.error('فشل في حفظ البيانات');
    }
  };

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !filterCategory || product.categoryId.toString() === filterCategory;
    const matchesStatus = !filterStatus || product.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
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
      description: '',
      price: '',
      salePrice: '',
      categoryId: '',
      stock: '',
      sku: '',
      images: [''],
      status: 'نشط',
      featured: false,
      tags: '',
      weight: '',
      dimensions: '',
      brand: '',
    });
    setErrors({});
  };

  const handleOpenDialog = (mode, product = null) => {
    setDialogMode(mode);
    setSelectedProduct(product);
    
    if (mode === 'edit' && product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        salePrice: product.salePrice ? product.salePrice.toString() : '',
        categoryId: product.categoryId.toString(),
        stock: product.stock.toString(),
        sku: product.sku,
        images: product.images,
        status: product.status,
        featured: product.featured,
        tags: product.tags ? product.tags.join(', ') : '',
        weight: product.weight ? product.weight.toString() : '',
        dimensions: product.dimensions || '',
        brand: product.brand || '',
      });
    } else {
      resetForm();
    }
    
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
    resetForm();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'اسم المنتج مطلوب';
    if (!formData.description.trim()) newErrors.description = 'وصف المنتج مطلوب';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'السعر مطلوب ويجب أن يكون أكبر من صفر';
    if (!formData.categoryId) newErrors.categoryId = 'الفئة مطلوبة';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'الكمية مطلوبة ويجب أن تكون صفر أو أكبر';
    if (!formData.sku.trim()) newErrors.sku = 'رمز المنتج مطلوب';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProduct = () => {
    if (!validateForm()) return;

    try {
      const category = categories.find(cat => cat.id.toString() === formData.categoryId);
      
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        category: category ? category.name : '',
        categoryId: parseInt(formData.categoryId),
        stock: parseInt(formData.stock),
        sku: formData.sku.trim(),
        images: formData.images.filter(img => img.trim()),
        status: formData.status,
        featured: formData.featured,
        rating: 0,
        reviews: 0,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        weight: formData.weight ? parseFloat(formData.weight) : null,
        dimensions: formData.dimensions.trim() || null,
        brand: formData.brand.trim() || null,
        updatedAt: new Date().toISOString(),
      };

      let updatedProducts;

      if (dialogMode === 'add') {
        const newId = Math.max(...products.map(p => p.id), 0) + 1;
        const newProduct = {
          ...productData,
          id: newId,
          createdAt: new Date().toISOString(),
        };
        updatedProducts = [...products, newProduct];
        toast.success('تم إضافة المنتج بنجاح');
      } else {
        updatedProducts = products.map(product =>
          product.id === selectedProduct.id
            ? { ...product, ...productData }
            : product
        );
        toast.success('تم تحديث المنتج بنجاح');
      }

      saveProducts(updatedProducts);
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('فشل في حفظ المنتج');
    }
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      try {
        const updatedProducts = products.filter(product => product.id !== productId);
        saveProducts(updatedProducts);
        toast.success('تم حذف المنتج بنجاح');
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('فشل في حذف المنتج');
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

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, images: newImages }));
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            إدارة المنتجات
          </Typography>
          <Typography variant="body1" color="text.secondary">
            إدارة وتحرير منتجات المتجر
          </Typography>
        </Box>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="البحث في المنتجات..."
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
              <Grid item xs={12} md={6}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog('add')}
                  sx={{ 
                    float: 'left',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    }
                  }}
                >
                  إضافة منتج جديد
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: alpha('#1976d2', 0.1) }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color="#1976d2">
                      1,256
                    </Typography>
                    <Typography variant="h6">إجمالي المنتجات</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: alpha('#1976d2', 0.1), color: '#1976d2' }}>
                    <InventoryIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card>
          <CardContent sx={{ p: 0 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                    <TableCell sx={{ fontWeight: 600 }}>المنتج</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>السعر</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>الفئة</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>المخزون</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>الحالة</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>التقييم</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>الإجراءات</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <AnimatePresence>
                    {filteredProducts
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((product, index) => (
                        <motion.tr
                          key={product.id}
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
                                src={product.images?.[0]}
                                sx={{ width: 50, height: 50, borderRadius: 2 }}
                              >
                                <ImageIcon />
                          </Avatar>
                              <Box>
                                <Typography variant="subtitle2" fontWeight="bold">
                                  {product.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  SKU: {product.sku}
                          </Typography>
                                {product.featured && (
                                  <Chip
                                    label="مميز"
                                    size="small"
                                    color="warning"
                                    sx={{ ml: 1, fontSize: '0.7rem' }}
                                  />
                                )}
                              </Box>
                        </Box>
                      </TableCell>
                          
                          <TableCell>
                            <Chip
                              label={product.category}
                              variant="outlined"
                              size="small"
                              color="primary"
                            />
                          </TableCell>
                          
                      <TableCell>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="bold">
                                ${product.price}
                              </Typography>
                              {product.salePrice && (
                                <Typography
                                  variant="caption"
                                  color="error"
                                  sx={{ textDecoration: 'line-through' }}
                                >
                                  ${product.salePrice}
                                </Typography>
                              )}
                            </Box>
                      </TableCell>
                          
                      <TableCell>
                        <Chip
                          label={product.stock}
                              color={product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'error'}
                              size="small"
                            />
                          </TableCell>
                          
                          <TableCell>
                            <Chip
                              label={product.status}
                              color={product.status === 'نشط' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                          
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <StarIcon sx={{ color: '#ffc107', fontSize: 16 }} />
                              <Typography variant="caption">
                                {product.rating} ({product.reviews})
                              </Typography>
                            </Box>
                          </TableCell>
                          
                      <TableCell>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <Tooltip title="عرض">
                                <IconButton
                                  size="small"
                                  color="info"
                                  onClick={() => handleOpenDialog('view', product)}
                                >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                              </Tooltip>
                              
                              <Tooltip title="تعديل">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => handleOpenDialog('edit', product)}
                                >
                          <EditIcon fontSize="small" />
                        </IconButton>
                              </Tooltip>
                              
                              <Tooltip title="حذف">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDeleteProduct(product.id)}
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
          </CardContent>
        </Card>
      </motion.div>

      <TablePagination
        component="div"
        count={filteredProducts.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="عدد الصفوف في الصفحة:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} من ${count}`}
      />



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
          {dialogMode === 'add' ? 'إضافة منتج جديد' : 
           dialogMode === 'edit' ? 'تعديل المنتج' : 'عرض المنتج'}
        </DialogTitle>
        
        <DialogContent sx={{ p: 3, mt: 2 }}>
          {dialogMode === 'view' && selectedProduct ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Avatar
                  src={selectedProduct.images?.[0]}
                  sx={{ width: 200, height: 200, borderRadius: 3, mx: 'auto' }}
                >
                  <ImageIcon sx={{ fontSize: 80 }} />
                </Avatar>
              </Grid>
              
              <Grid item xs={12} md={8}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {selectedProduct.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {selectedProduct.description}
                </Typography>
                
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">السعر</Typography>
                    <Typography variant="h6" color="primary">${selectedProduct.price}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">المخزون</Typography>
                    <Typography variant="h6">{selectedProduct.stock}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">الفئة</Typography>
                    <Typography variant="body1">{selectedProduct.category}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">الحالة</Typography>
                    <Chip label={selectedProduct.status} size="small" />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="اسم المنتج"
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
                  label="رمز المنتج (SKU)"
                  value={formData.sku}
                  onChange={handleFormChange('sku')}
                  error={!!errors.sku}
                  helperText={errors.sku}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="وصف المنتج"
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
                <TextField
                  fullWidth
                  label="السعر"
                  type="number"
                  value={formData.price}
                  onChange={handleFormChange('price')}
                  error={!!errors.price}
                  helperText={errors.price}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="سعر التخفيض"
                  type="number"
                  value={formData.salePrice}
                  onChange={handleFormChange('salePrice')}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="الكمية في المخزون"
                  type="number"
                  value={formData.stock}
                  onChange={handleFormChange('stock')}
                  error={!!errors.stock}
                  helperText={errors.stock}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.categoryId}>
                  <InputLabel>الفئة</InputLabel>
                  <Select
                    value={formData.categoryId}
                    onChange={handleFormChange('categoryId')}
                    label="الفئة"
                    required
                  >
                    {categories.map(category => (
                      <MenuItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.categoryId && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, mx: 1.5 }}>
                      {errors.categoryId}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>الحالة</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={handleFormChange('status')}
                    label="الحالة"
                  >
                    <MenuItem value="نشط">نشط</MenuItem>
                    <MenuItem value="غير نشط">غير نشط</MenuItem>
                    <MenuItem value="نفد المخزون">نفد المخزون</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="العلامة التجارية"
                  value={formData.brand}
                  onChange={handleFormChange('brand')}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="الوزن (كجم)"
                  type="number"
                  value={formData.weight}
                  onChange={handleFormChange('weight')}
                  step="0.1"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="الأبعاد"
                  value={formData.dimensions}
                  onChange={handleFormChange('dimensions')}
                  placeholder="الطول x العرض x الارتفاع"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="الكلمات المفتاحية"
                  value={formData.tags}
                  onChange={handleFormChange('tags')}
                  placeholder="فصل بالفاصلة"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>صور المنتج</Typography>
                {formData.images.map((image, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <TextField
                      fullWidth
                      placeholder="رابط الصورة"
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                    />
                    {formData.images.length > 1 && (
                      <IconButton 
                        color="error" 
                        onClick={() => removeImageField(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={addImageField}
                  size="small"
                >
                  إضافة صورة
                </Button>
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
              onClick={handleSaveProduct}
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

export default Products; 