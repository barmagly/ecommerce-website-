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
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Snackbar,
  FormHelperText,
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
  ExpandMore as ExpandMoreIcon,
  Palette as PaletteIcon,
  Straighten as SizeIcon,
  Settings as SettingsIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { productsAPI, categoriesAPI } from '../services/api';

const Products = () => {
  const theme = useTheme();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  const initialFormData = {
    name: '',
    description: '',
    brand: '',
    category: '',
    price: '',
    hasVariants: false,
    stock: '',
    sku: '',
    imageCover: '',
    images: [],
    features: [],
    specifications: [],
    attributes: [],
    variants: []
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  // Load products from localStorage on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Check for low stock products and show alerts
  useEffect(() => {
    if ((products || []).length > 0) {
      const lowStockProducts = (products || []).filter(p => p.stock <= 5 && p.stock > 0);
      const outOfStockProducts = (products || []).filter(p => p.stock === 0);
      
      if (outOfStockProducts.length > 0) {
        toast.warning(`تحذير: ${outOfStockProducts.length} منتج نفد مخزونه`);
      }
      
      if (lowStockProducts.length > 0) {
        toast.info(`تنبيه: ${lowStockProducts.length} منتج مخزونه منخفض`);
      }
    }
  }, [products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      setProducts(response.data.products || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data.categories || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      toast.error('Failed to load categories');
    }
  };

  // Update useEffect to fetch both products and categories
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchProducts(), fetchCategories()]);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setFormErrors({});
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      console.log('Editing product:', product); // Debugging line
      // Map the product data to match our form structure
      const mappedProduct = {
        name: product.name || '',
        description: product.description || '',
        brand: product.brand || '',
        // Handle both object and string for category
        category: (product.category && product.category._id) ? product.category._id : (product.category || ''),
        price: product.price?.toString() || '',
        hasVariants: product.hasVariants || false,
        stock: product.stock?.toString() || '',
        sku: product.sku || '',
        imageCover: product.imageCover?.url || product.imageCover || '',
        images: product.images?.map(img => img.url || img) || [],
        features: product.features || [],
        specifications: product.specifications || [],
        attributes: product.attributes || [],
        variants: product.productVariants?.map(variant => ({
          sku: variant.sku,
          attributes: Object.fromEntries(variant.attributes),
          price: variant.price?.toString(),
          quantity: variant.quantity?.toString(),
          images: variant.images?.map(img => img.url || img) || []
        })) || []
      };
      setFormData(mappedProduct);
    } else {
      setFormData(initialFormData);
    }
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form', formData); // Debug log
    
    // Validate form
    const errors = {};
    if (!formData.name) errors.name = 'اسم المنتج مطلوب';
    if (!formData.description || formData.description.length < 20) {
      errors.description = 'الوصف مطلوب ويجب أن يكون 20 حرف على الأقل';
    }
    if (!formData.brand) errors.brand = 'العلامة التجارية مطلوبة';
    if (!formData.category) errors.category = 'الفئة مطلوبة';
    if (!formData.imageCover) errors.imageCover = 'صورة الغلاف مطلوبة';
    
    if (!formData.hasVariants) {
      if (!formData.price) errors.price = 'السعر مطلوب';
      if (!formData.stock) errors.stock = 'الكمية مطلوبة';
      if (!formData.sku) errors.sku = 'رمز المنتج مطلوب';
    } else {
      if (!formData.variants.length) {
        errors.variants = 'يجب إضافة متغير واحد على الأقل';
      }
      // Validate variants
      formData.variants.forEach((variant, index) => {
        if (!variant.sku) errors[`variant_${index}_sku`] = 'رمز المتغير مطلوب';
        if (!variant.price) errors[`variant_${index}_price`] = 'سعر المتغير مطلوب';
        if (variant.quantity === undefined) errors[`variant_${index}_quantity`] = 'كمية المتغير مطلوبة';
        if (!variant.attributes || Object.keys(variant.attributes).length === 0) {
          errors[`variant_${index}_attributes`] = 'سمات المتغير مطلوبة';
        }
      });
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      // Create FormData instance
      const formDataToSend = new FormData();

      // Add basic product data
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formData.append('brand', formData.brand);
      formData.append('category', formData.category);
      formData.append('hasVariants', formData.hasVariants);

      // Add simple product fields if no variants
      if (!formData.hasVariants) {
        formDataToSend.append('price', formData.price);
        formDataToSend.append('stock', formData.stock);
        formDataToSend.append('sku', formData.sku);
      }

      // Add image cover
      if (formData.imageCover instanceof File) {
        formDataToSend.append('imageCover', formData.imageCover);
      } else if (typeof formData.imageCover === 'string' && formData.imageCover.startsWith('data:')) {
        // Convert base64 to file if it's a new image
        const response = await fetch(formData.imageCover);
        const blob = await response.blob();
        const file = new File([blob], 'imageCover.jpg', { type: 'image/jpeg' });
        formDataToSend.append('imageCover', file);
      }

      // Add additional images
      formData.images.forEach((image, index) => {
        if (image instanceof File) {
          formDataToSend.append(`images`, image);
        } else if (typeof image === 'string' && image.startsWith('data:')) {
          // Convert base64 to file if it's a new image
          fetch(image)
            .then(res => res.blob())
            .then(blob => {
              const file = new File([blob], `image${index}.jpg`, { type: 'image/jpeg' });
              formDataToSend.append('images', file);
            });
        }
      });

      // Add attributes
      formDataToSend.append('attributes', formData.attributes ? JSON.stringify(formData.attributes) : []);

      // Add variants if product has variants
      if (formData.hasVariants) {
        const variants = formData.variants.map(variant => {
          const variantData = {
            sku: variant.sku,
            attributes: Object.fromEntries(variant.attributes),
            price: Number(variant.price),
            quantity: Number(variant.quantity),
            images: []
          };

          // Handle variant images
          variant.images.forEach((image, index) => {
            if (image instanceof File) {
              formDataToSend.append(`variant_${variant.sku}_images`, image);
            } else if (typeof image === 'string' && image.startsWith('data:')) {
              // Convert base64 to file if it's a new image
              fetch(image)
                .then(res => res.blob())
                .then(blob => {
                  const file = new File([blob], `variant_${variant.sku}_${index}.jpg`, { type: 'image/jpeg' });
                  formDataToSend.append(`variant_${variant.sku}_images`, file);
                });
            } else {
              // If it's an existing image URL, just add it to the images array
              variantData.images.push({
                url: image,
                alt: `${formData.name} - ${variant.sku}`,
                isPrimary: false
              });
            }
          });

          return variantData;
        });

        formDataToSend.append('variants', JSON.stringify(variants));
      }

      // Add features and specifications
      formDataToSend.append('features', JSON.stringify(formData.features));
      formDataToSend.append('specifications', JSON.stringify(formData.specifications));

      // Send the request
      if (selectedProduct) {
        await productsAPI.update(selectedProduct._id, formDataToSend);
        toast.success('تم تحديث المنتج بنجاح');
      } else {
        await productsAPI.create(formDataToSend);
        toast.success('تم إضافة المنتج بنجاح');
      }
      
      handleCloseDialog();
      fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      toast.error(err.response?.data?.message || 'حدث خطأ أثناء حفظ المنتج');
    }
  };

  // Update image handling functions
  const handleImageCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        imageCover: file
      }));
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...files]
      }));
    }
  };

  const handleVariantImagesChange = (variantIndex, e) => {
    const files = Array.from(e.target.files);
    if (files.length) {
      setFormData(prev => ({
        ...prev,
        variants: prev.variants.map((variant, idx) => 
          idx === variantIndex 
            ? { ...variant, images: [...variant.images, ...files] }
            : variant
        )
      }));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.delete(id);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (err) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleToggleStatus = async (id, isActive) => {
    try {
      const product = products.find(p => p._id === id);
      if (!product) return;

      const updatedData = {
        ...product,
        status: isActive ? 'active' : 'inactive'
      };

      await productsAPI.update(id, updatedData);
      toast.success(`Product ${isActive ? 'activated' : 'deactivated'} successfully`);
      fetchProducts();
    } catch (err) {
      console.error('Error toggling product status:', err);
      toast.error('Failed to update product status');
    }
  };

  const handleFormChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
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

  // Attribute management functions
  const addAttribute = () => {
    const newAttribute = {
      name: '',
      values: []
    };
    setFormData(prev => ({
      ...prev,
      attributes: [...prev.attributes, newAttribute]
    }));
  };

  const removeAttribute = (index) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, idx) => idx !== index)
    }));
  };

  const updateAttribute = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.map((attr, idx) => {
        if (idx !== index) return attr;
        
        if (field === 'values') {
          // Handle values as an array
          const values = typeof value === 'string' 
            ? value.split(',').map(v => v.trim()).filter(Boolean)
            : value;
          return { ...attr, values };
        }
        
        return { ...attr, [field]: value };
      })
    }));
  };

  const addAttributeValue = (attributeId) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.map(attr =>
        attr.id === attributeId
          ? { ...attr, values: [...attr.values, ''] }
          : attr
      )
    }));
  };

  const removeAttributeValue = (attributeId, valueIndex) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.map(attr =>
        attr.id === attributeId
          ? { ...attr, values: attr.values.filter((_, i) => i !== valueIndex) }
          : attr
      )
    }));
  };

  const updateAttributeValue = (attributeId, valueIndex, value) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.map(attr =>
        attr.id === attributeId
          ? {
              ...attr,
              values: attr.values.map((val, i) => i === valueIndex ? value : val)
            }
          : attr
      )
    }));
  };

  // Variant management functions
  const addVariant = () => {
    const newVariant = {
      sku: '',
      attributes: new Map(),
      price: '',
      quantity: 0,
      images: []
    };
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, newVariant]
    }));
  };

  const updateVariant = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, idx) => {
        if (idx !== index) return variant;
        
        if (field === 'attributes') {
          // Handle attributes as a Map
          const newAttributes = new Map(variant.attributes);
          Object.entries(value).forEach(([key, val]) => {
            newAttributes.set(key, val);
          });
          return { ...variant, attributes: newAttributes };
        }
        
        return { ...variant, [field]: value };
      })
    }));
  };

  const removeVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, idx) => idx !== index)
    }));
  };

  // Feature management functions
  const addFeature = () => {
    const newFeature = { id: Date.now(), name: '', value: '' };
    setFormData(prev => ({ ...prev, features: [...prev.features, newFeature] }));
  };

  const removeFeature = (featureId) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(feature => feature.id !== featureId)
    }));
  };

  const updateFeature = (featureId, field, value) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map(feature =>
        feature.id === featureId ? { ...feature, [field]: value } : feature
      )
    }));
  };

  // Specification management functions
  const addSpecificationGroup = () => {
    const newGroup = { id: Date.now(), group: '', items: [{ id: Date.now(), name: '', value: '' }] };
    setFormData(prev => ({ ...prev, specifications: [...prev.specifications, newGroup] }));
  };

  const removeSpecificationGroup = (groupId) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter(spec => spec.id !== groupId)
    }));
  };

  const updateSpecificationGroup = (groupId, groupName) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.map(spec =>
        spec.id === groupId ? { ...spec, group: groupName } : spec
      )
    }));
  };

  const addSpecificationItem = (groupId) => {
    const newItem = { id: Date.now(), name: '', value: '' };
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.map(spec =>
        spec.id === groupId
          ? { ...spec, items: [...spec.items, newItem] }
          : spec
      )
    }));
  };

  const removeSpecificationItem = (groupId, itemId) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.map(spec =>
        spec.id === groupId
          ? { ...spec, items: spec.items.filter(item => item.id !== itemId) }
          : spec
      )
    }));
  };

  const updateSpecificationItem = (groupId, itemId, field, value) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.map(spec =>
        spec.id === groupId
          ? {
              ...spec,
              items: spec.items.map(item =>
                item.id === itemId ? { ...item, [field]: value } : item
              )
            }
          : spec
      )
    }));
  };

  // Update the category options to match the backend values
  const categoryOptions = [
    { value: 'electronics', label: 'إلكترونيات' },
    { value: 'clothing', label: 'ملابس' },
    { value: 'books', label: 'كتب' }
  ];

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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                إدارة المنتجات
              </Typography>
              <Typography variant="body1" color="text.secondary">
                إدارة وتحرير منتجات المتجر بكفاءة عالية
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchProducts}
              >
                تحديث
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('add')}
                sx={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  }
                }}
              >
                إضافة منتج جديد
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Enhanced Search and Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="البحث في المنتجات والأكواد..."
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
                  <InputLabel>تصفية حسب الفئة</InputLabel>
                  <Select
                    value={filterCategory}
                    label="تصفية حسب الفئة"
                    onChange={(e) => setFilterCategory(e.target.value)}
                    startAdornment={<CategoryIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                  >
                    <MenuItem value="">جميع الفئات</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category._id || category.id} value={typeof category === 'object' ? category.name : category}>
                        {typeof category === 'object' ? category.name : category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>تصفية حسب الحالة</InputLabel>
                  <Select
                    value={filterStatus}
                    label="تصفية حسب الحالة"
                    onChange={(e) => setFilterStatus(e.target.value)}
                    startAdornment={<FilterIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                  >
                    <MenuItem value="">جميع الحالات</MenuItem>
                    <MenuItem value="نشط">نشط</MenuItem>
                    <MenuItem value="غير نشط">غير نشط</MenuItem>
                    <MenuItem value="نفد المخزون">نفد المخزون</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  onClick={() => {
                    setSearchTerm('');
                    setFilterCategory('');
                    setFilterStatus('');
                    toast.info('تم مسح جميع المرشحات');
                  }}
                >
                  مسح المرشحات
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Enhanced Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card sx={{ 
                bgcolor: alpha('#1976d2', 0.1),
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { transform: 'translateY(-4px)' }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" fontWeight="bold" color="#1976d2">
                        {products.length}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">إجمالي المنتجات</Typography>
                      <Typography variant="caption" color="success.main">
                        +{products.filter(p => p.featured).length} منتج مميز
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: '#1976d2', color: 'white', width: 48, height: 48 }}>
                      <InventoryIcon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card sx={{ 
                bgcolor: alpha('#2e7d32', 0.1),
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { transform: 'translateY(-4px)' }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" fontWeight="bold" color="#2e7d32">
                        {products.filter(p => p.status === 'نشط').length}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">منتجات نشطة</Typography>
                      <Typography variant="caption" color="text.secondary">
                        من أصل {products.length} منتج
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: '#2e7d32', color: 'white', width: 48, height: 48 }}>
                      <StarIcon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card sx={{ 
                bgcolor: alpha('#ed6c02', 0.1),
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { transform: 'translateY(-4px)' }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" fontWeight="bold" color="#ed6c02">
                        {products.filter(p => p.stock <= 10).length}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">مخزون منخفض</Typography>
                      <Typography variant="caption" color="error.main">
                        {products.filter(p => p.stock === 0).length} نفد المخزون
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: '#ed6c02', color: 'white', width: 48, height: 48 }}>
                      <Alert />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Card sx={{ 
                bgcolor: alpha('#9c27b0', 0.1),
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { transform: 'translateY(-4px)' }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" fontWeight="bold" color="#9c27b0">
                        ${products.reduce((total, p) => total + (p.price * p.stock), 0).toFixed(0)}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">قيمة المخزون</Typography>
                      <Typography variant="caption" color="text.secondary">
                        متوسط السعر: ${products.length > 0 ? (products.reduce((total, p) => total + p.price, 0) / products.length).toFixed(2) : '0.00'}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: '#9c27b0', color: 'white', width: 48, height: 48 }}>
                      <PriceIcon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Enhanced Products Table */}
        <Card elevation={3}>
          <CardContent sx={{ p: 0 }}>
            {/* Table Header with Actions */}
            <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="bold">
                  قائمة المنتجات ({products.length})
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={fetchProducts}
                  >
                    تحديث
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      const data = products.map(p => ({
                        Name: p.name,
                        SKU: p.sku,
                        Price: p.price,
                        Stock: p.stock,
                        Category: p.category,
                        Status: p.status
                      }));
                      const csv = [
                        Object.keys(data[0]).join(','),
                        ...data.map(row => Object.values(row).join(','))
                      ].join('\n');
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = 'products.csv';
                      link.click();
                      toast.success('تم تصدير البيانات بنجاح');
                    }}
                  >
                    تصدير CSV
                  </Button>
                </Box>
              </Box>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    '& .MuiTableCell-head': {
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      color: theme.palette.primary.dark
                    }
                  }}>
                    <TableCell sx={{ width: '25%' }}>المنتج</TableCell>
                    <TableCell sx={{ width: '15%' }}>السعر والخصم</TableCell>
                    <TableCell sx={{ width: '12%' }}>الفئة</TableCell>
                    <TableCell sx={{ width: '10%' }}>المخزون</TableCell>
                    <TableCell sx={{ width: '10%' }}>الحالة</TableCell>
                    <TableCell sx={{ width: '12%' }}>التقييم والمراجعات</TableCell>
                    <TableCell sx={{ width: '10%' }}>تاريخ الإضافة</TableCell>
                    <TableCell sx={{ width: '16%' }}>الإجراءات</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <AnimatePresence>
                    {products
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((product, index) => (
                        <motion.tr
                          key={product._id}
                          component={TableRow}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                          sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar
                                src={typeof product.imageCover === 'string' ? product.imageCover : undefined}
                                sx={{ bgcolor: 'primary.main' }}
                              >
                                <ImageIcon />
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {product.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {product.sku}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {product.price} ريال
                              {product.salePrice && (
                                <Typography
                                  component="span"
                                  variant="caption"
                                  sx={{ textDecoration: 'line-through', color: 'text.secondary', ml: 1 }}
                                >
                                  {product.salePrice} ريال
                                </Typography>
                              )}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {typeof product.category === 'object' ? product.category.name : product.category}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={product.stock > 0 ? `${product.stock} متوفر` : 'نفذ المخزون'}
                              color={product.stock > 0 ? 'success' : 'error'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={product.status === 'active'}
                              onChange={(e) => handleToggleStatus(product._id, e.target.checked)}
                              color="success"
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ textAlign: 'center' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'center' }}>
                                <StarIcon sx={{ color: '#ffc107', fontSize: 18 }} />
                                <Typography variant="subtitle2" fontWeight="bold">
                                  {product.rating}
                                </Typography>
                              </Box>
                              <Typography variant="caption" color="text.secondary">
                                {product.reviews} مراجعة
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="body2" fontWeight="500">
                                {new Date(product.createdAt).toLocaleDateString('ar-SA')}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(product.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                              <Tooltip title="عرض التفاصيل" arrow>
                                <IconButton
                                  size="small"
                                  color="info"
                                  onClick={() => handleOpenDialog(product)}
                                  sx={{ 
                                    borderRadius: 2,
                                    '&:hover': {
                                      backgroundColor: alpha('#1976d2', 0.1),
                                      transform: 'scale(1.1)'
                                    }
                                  }}
                                >
                                  <ViewIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              
                              <Tooltip title="تعديل المنتج" arrow>
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => handleOpenDialog(product)}
                                  sx={{ 
                                    borderRadius: 2,
                                    '&:hover': {
                                      backgroundColor: alpha('#2e7d32', 0.1),
                                      transform: 'scale(1.1)'
                                    }
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              
                              <Tooltip title="حذف المنتج" arrow>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDelete(product._id)}
                                  sx={{ 
                                    borderRadius: 2,
                                    '&:hover': {
                                      backgroundColor: alpha('#d32f2f', 0.1),
                                      transform: 'scale(1.1)'
                                    }
                                  }}
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
        count={products.length}
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
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            minHeight: '80vh'
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" component="div">
              {selectedProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
            </Typography>
            <IconButton onClick={handleCloseDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 0, mt: 0, maxHeight: '70vh', overflowY: 'auto', bgcolor: '#f7f8fa' }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              {/* Basic Info */}
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="اسم المنتج"
                  value={formData.name}
                  onChange={handleFormChange('name')}
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="العلامة التجارية"
                  value={formData.brand}
                  onChange={handleFormChange('brand')}
                  error={!!formErrors.brand}
                  helperText={formErrors.brand}
                />
              </Grid>
              <Grid xs={12}>
                <TextField
                  fullWidth
                  required
                  label="الوصف"
                  multiline
                  minRows={3}
                  value={formData.description}
                  onChange={handleFormChange('description')}
                  error={!!formErrors.description}
                  helperText={formErrors.description}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <FormControl fullWidth required error={!!formErrors.category}>
                  <InputLabel>الفئة</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={handleFormChange('category')}
                    label="الفئة"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.category && (
                    <FormHelperText>{formErrors.category}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.hasVariants}
                      onChange={(e) => handleFormChange('hasVariants')(e)}
                    />
                  }
                  label="المنتج له متغيرات"
                />
              </Grid>

              {/* Simple Product Fields */}
              {!formData.hasVariants && (
                <>
                  <Grid xs={12} md={4}>
                    <TextField
                      fullWidth
                      required
                      type="number"
                      label="السعر"
                      value={formData.price}
                      onChange={handleFormChange('price')}
                      error={!!formErrors.price}
                      helperText={formErrors.price}
                    />
                  </Grid>
                  <Grid xs={12} md={4}>
                    <TextField
                      fullWidth
                      required
                      type="number"
                      label="الكمية"
                      value={formData.stock}
                      onChange={handleFormChange('stock')}
                      error={!!formErrors.stock}
                      helperText={formErrors.stock}
                    />
                  </Grid>
                  <Grid xs={12} md={4}>
                    <TextField
                      fullWidth
                      required
                      label="رمز المنتج"
                      value={formData.sku}
                      onChange={handleFormChange('sku')}
                      error={!!formErrors.sku}
                      helperText={formErrors.sku}
                    />
                  </Grid>
                </>
              )}

              {/* Product Images */}
              <Grid xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  صور المنتج
                </Typography>
                <Grid container spacing={2}>
                  <Grid xs={12} md={6}>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      startIcon={<ImageIcon />}
                    >
                      صورة الغلاف
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageCoverChange}
                      />
                    </Button>
                    {formData.imageCover && (
                      <Box sx={{ mt: 1 }}>
                        <img
                          src={formData.imageCover}
                          alt="Cover"
                          style={{ maxWidth: '100%', maxHeight: 200 }}
                        />
                      </Box>
                    )}
                  </Grid>
                  <Grid xs={12} md={6}>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      startIcon={<ImageIcon />}
                    >
                      صور إضافية
                      <input
                        type="file"
                        hidden
                        multiple
                        accept="image/*"
                        onChange={handleImagesChange}
                      />
                    </Button>
                    <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {formData.images.map((img, index) => (
                        <Box key={index} sx={{ position: 'relative' }}>
                          <img
                            src={img}
                            alt={`Product ${index + 1}`}
                            style={{ width: 100, height: 100, objectFit: 'cover' }}
                          />
                          <IconButton
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 0,
                              right: 0,
                              bgcolor: 'rgba(0,0,0,0.5)',
                              color: 'white',
                              '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                            }}
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                images: prev.images.filter((_, i) => i !== index)
                              }));
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              {/* Variants Section */}
              {formData.hasVariants && (
                <Grid xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      المتغيرات
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={addVariant}
                    >
                      إضافة متغير
                    </Button>
                  </Box>
                  {formData.variants.map((variant, index) => (
                    <Paper key={index} sx={{ p: 2, mb: 2 }}>
                      <Grid container spacing={2}>
                        <Grid xs={12} md={3}>
                          <TextField
                            fullWidth
                            required
                            label="رمز المتغير"
                            value={variant.sku}
                            onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                            error={!!formErrors[`variant_${index}_sku`]}
                            helperText={formErrors[`variant_${index}_sku`]}
                          />
                        </Grid>
                        <Grid xs={12} md={3}>
                          <TextField
                            fullWidth
                            required
                            type="number"
                            label="السعر"
                            value={variant.price}
                            onChange={(e) => updateVariant(index, 'price', e.target.value)}
                            error={!!formErrors[`variant_${index}_price`]}
                            helperText={formErrors[`variant_${index}_price`]}
                          />
                        </Grid>
                        <Grid xs={12} md={3}>
                          <TextField
                            fullWidth
                            required
                            type="number"
                            label="الكمية"
                            value={variant.quantity}
                            onChange={(e) => updateVariant(index, 'quantity', e.target.value)}
                            error={!!formErrors[`variant_${index}_quantity`]}
                            helperText={formErrors[`variant_${index}_quantity`]}
                          />
                        </Grid>
                        <Grid xs={12} md={3}>
                          <Button
                            color="error"
                            onClick={() => removeVariant(index)}
                            startIcon={<DeleteIcon />}
                          >
                            حذف
                          </Button>
                        </Grid>
                        {/* Variant Attributes */}
                        {formData.attributes.map((attr, attrIndex) => (
                          <Grid xs={12} md={4} key={attrIndex}>
                            <FormControl fullWidth>
                              <InputLabel>{attr.name}</InputLabel>
                              <Select
                                value={variant.attributes[attr.name] || ''}
                                onChange={(e) => {
                                  const newAttributes = {
                                    ...variant.attributes,
                                    [attr.name]: e.target.value
                                  };
                                  updateVariant(index, 'attributes', newAttributes);
                                }}
                                label={attr.name}
                              >
                                {attr.values.map((value) => (
                                  <MenuItem key={value} value={value}>
                                    {value}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                        ))}
                        {/* Variant Images */}
                        <Grid xs={12}>
                          <Button
                            variant="outlined"
                            component="label"
                            startIcon={<ImageIcon />}
                          >
                            صور المتغير
                            <input
                              type="file"
                              hidden
                              multiple
                              accept="image/*"
                              onChange={(e) => handleVariantImagesChange(index, e)}
                            />
                          </Button>
                          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {variant.images.map((img, imgIndex) => (
                              <Box key={imgIndex} sx={{ position: 'relative' }}>
                                <img
                                  src={img}
                                  alt={`Variant ${index + 1} - ${imgIndex + 1}`}
                                  style={{ width: 100, height: 100, objectFit: 'cover' }}
                                />
                                <IconButton
                                  size="small"
                                  sx={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    bgcolor: 'rgba(0,0,0,0.5)',
                                    color: 'white',
                                    '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                                  }}
                                  onClick={() => {
                                    const newImages = variant.images.filter(
                                      (_, i) => i !== imgIndex
                                    );
                                    updateVariant(index, 'images', newImages);
                                  }}
                                >
                                  <CloseIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            ))}
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </Grid>
              )}

              {/* Attributes Section */}
              <Grid xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    السمات
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={addAttribute}
                  >
                    إضافة سمة
                  </Button>
                </Box>
                {formData.attributes.map((attr, index) => (
                  <Paper key={index} sx={{ p: 2, mb: 2 }}>
                    <Grid container spacing={2}>
                      <Grid xs={12} md={5}>
                        <TextField
                          fullWidth
                          label="اسم السمة"
                          value={attr.name}
                          onChange={(e) => updateAttribute(index, 'name', e.target.value)}
                        />
                      </Grid>
                      <Grid xs={12} md={5}>
                        <TextField
                          fullWidth
                          label="القيم (مفصولة بفاصلة)"
                          value={Array.isArray(attr.values) ? attr.values.join(',') : attr.values}
                          onChange={(e) => updateAttribute(index, 'values', e.target.value)}
                        />
                      </Grid>
                      <Grid xs={12} md={2}>
                        <Button
                          color="error"
                          onClick={() => removeAttribute(index)}
                          startIcon={<DeleteIcon />}
                        >
                          حذف
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </Grid>
            </Grid>

            <DialogActions sx={{ mt: 3 }}>
              <Button onClick={handleCloseDialog}>إلغاء</Button>
              <Button type="submit" variant="contained" color="primary">
                {selectedProduct ? 'تحديث' : 'إضافة'}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Products; 