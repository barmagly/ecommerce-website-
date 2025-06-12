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
import { productsAPI } from '../services/api';

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

// Enhanced sample products with more variety
const initialProducts = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    description: 'أحدث هاتف من آبل مع تقنيات متطورة وكاميرا Pro وشاشة Super Retina XDR',
    price: 1199.99,
    salePrice: 1099.99,
    category: 'إلكترونيات',
    categoryId: 1,
    stock: 45,
    sku: 'IP15PM-001',
    images: ['https://via.placeholder.com/150x150?text=iPhone+15'],
    status: 'نشط',
    featured: true,
    rating: 4.9,
    reviews: 345,
    tags: ['هاتف', 'آبل', 'جديد', 'برو'],
    weight: 0.22,
    dimensions: '16.0 x 7.7 x 0.83 cm',
    brand: 'Apple',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Samsung Galaxy S24 Ultra',
    description: 'هاتف ذكي متطور من سامسونج مع قلم S Pen وكاميرا 200 ميجابكسل',
    price: 1299.99,
    salePrice: null,
    category: 'إلكترونيات',
    categoryId: 1,
    stock: 28,
    sku: 'SGS24U-002',
    images: ['https://via.placeholder.com/150x150?text=Samsung+S24'],
    status: 'نشط',
    featured: true,
    rating: 4.7,
    reviews: 289,
    tags: ['هاتف', 'سامسونج', 'أندرويد', 'قلم'],
    weight: 0.23,
    dimensions: '16.3 x 7.9 x 0.86 cm',
    brand: 'Samsung',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'MacBook Pro 16 بوصة',
    description: 'لابتوب قوي للمحترفين مع معالج M3 Pro وذاكرة 32GB',
    price: 2999.99,
    salePrice: 2799.99,
    category: 'إلكترونيات',
    categoryId: 1,
    stock: 12,
    sku: 'MBP16-003',
    images: ['https://via.placeholder.com/150x150?text=MacBook'],
    status: 'نشط',
    featured: true,
    rating: 4.8,
    reviews: 156,
    tags: ['لابتوب', 'آبل', 'محترف', 'M3'],
    weight: 2.1,
    dimensions: '35.5 x 24.8 x 1.6 cm',
    brand: 'Apple',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'قميص بولو كلاسيكي',
    description: 'قميص بولو قطني عالي الجودة متوفر بألوان متعددة',
    price: 89.99,
    salePrice: 69.99,
    category: 'ملابس',
    categoryId: 2,
    stock: 85,
    sku: 'POLO-004',
    images: ['https://via.placeholder.com/150x150?text=Polo+Shirt'],
    status: 'نشط',
    featured: false,
    rating: 4.4,
    reviews: 123,
    tags: ['قميص', 'بولو', 'قطن', 'كلاسيكي'],
    weight: 0.25,
    dimensions: 'S, M, L, XL',
    brand: 'Classic Wear',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 5,
    name: 'سماعات AirPods Pro 2',
    description: 'سماعات لاسلكية مع إلغاء الضوضاء النشط وجودة صوت فائقة',
    price: 249.99,
    salePrice: null,
    category: 'إلكترونيات',
    categoryId: 1,
    stock: 67,
    sku: 'APP2-005',
    images: ['https://via.placeholder.com/150x150?text=AirPods'],
    status: 'نشط',
    featured: true,
    rating: 4.6,
    reviews: 892,
    tags: ['سماعات', 'لاسلكي', 'آبل', 'إلغاء ضوضاء'],
    weight: 0.05,
    dimensions: '3.1 x 2.1 x 2.4 cm',
    brand: 'Apple',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 6,
    name: 'كتاب البرمجة المتقدمة',
    description: 'دليل شامل لتعلم البرمجة المتقدمة بلغات متعددة',
    price: 45.99,
    salePrice: null,
    category: 'كتب',
    categoryId: 3,
    stock: 156,
    sku: 'BOOK-006',
    images: ['https://via.placeholder.com/150x150?text=Programming+Book'],
    status: 'نشط',
    featured: false,
    rating: 4.7,
    reviews: 78,
    tags: ['كتاب', 'برمجة', 'تعليم', 'تقنية'],
    weight: 0.8,
    dimensions: '24 x 17 x 3 cm',
    brand: 'Tech Publications',
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 7,
    name: 'طاولة مكتب خشبية',
    description: 'طاولة مكتب عملية من الخشب الطبيعي مع أدراج للتخزين',
    price: 299.99,
    salePrice: 249.99,
    category: 'منزل وحديقة',
    categoryId: 4,
    stock: 8,
    sku: 'DESK-007',
    images: ['https://via.placeholder.com/150x150?text=Wooden+Desk'],
    status: 'نشط',
    featured: false,
    rating: 4.5,
    reviews: 45,
    tags: ['أثاث', 'مكتب', 'خشب', 'تخزين'],
    weight: 35.5,
    dimensions: '120 x 60 x 75 cm',
    brand: 'Home Furniture',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 8,
    name: 'حذاء رياضي للجري',
    description: 'حذاء رياضي مريح ومبطن خصيصاً للجري والأنشطة الرياضية',
    price: 129.99,
    salePrice: 99.99,
    category: 'رياضة',
    categoryId: 5,
    stock: 0,
    sku: 'SHOE-008',
    images: ['https://via.placeholder.com/150x150?text=Running+Shoes'],
    status: 'نشط',
    featured: false,
    rating: 4.3,
    reviews: 234,
    tags: ['حذاء', 'رياضة', 'جري', 'مريح'],
    weight: 0.6,
    dimensions: '42, 43, 44, 45',
    brand: 'SportMax',
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const Products = () => {
  const theme = useTheme();
  const [products, setProducts] = useState([]);
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
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    salePrice: '',
    categoryId: '',
    stock: '',
    sku: '',
    images: [''],
    imageCover: '',
    status: 'active',
    featured: false,
    tags: '',
    weight: '',
    dimensions: '',
    brand: '',
    hasVariants: false,
    attributes: [],
    variants: [],
    features: [],
    specifications: [],
    category: 'clothing',
  });

  const [errors, setErrors] = useState({});

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
      imageCover: '',
      status: 'active',
      featured: false,
      tags: '',
      weight: '',
      dimensions: '',
      brand: '',
      hasVariants: false,
      attributes: [],
      variants: [],
      features: [],
      specifications: [],
      category: 'clothing',
    });
    setErrors({});
  };

  const handleOpenDialog = (mode, product = null) => {
    setDialogMode(mode);
    setSelectedProduct(product);
    
    if (mode === 'edit' && product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price ? product.price.toString() : '',
        salePrice: product.salePrice ? product.salePrice.toString() : '',
        categoryId: product.categoryId ? product.categoryId.toString() : '',
        stock: product.stock ? product.stock.toString() : '',
        sku: product.sku || '',
        images: product.images || [''],
        imageCover: product.imageCover || '',
        status: product.status || 'active',
        featured: product.featured || false,
        tags: product.tags ? product.tags.join(', ') : '',
        weight: product.weight ? product.weight.toString() : '',
        dimensions: product.dimensions || '',
        brand: product.brand || '',
        hasVariants: product.hasVariants || false,
        attributes: (product.attributes || []).map(attr => ({
          ...attr,
          id: attr.id || Date.now() + Math.random()
        })),
        variants: (product.variants || []).map(variant => ({
          ...variant,
          id: variant.id || Date.now() + Math.random(),
          images: variant.images || ['']
        })),
        features: (product.features || []).map(feature => ({
          ...feature,
          id: feature.id || Date.now() + Math.random()
        })),
        specifications: (product.specifications || []).map(spec => ({
          ...spec,
          id: spec.id || Date.now() + Math.random(),
          items: (spec.items || []).map(item => ({
            ...item,
            id: item.id || Date.now() + Math.random()
          }))
        })),
        category: product.category ? (typeof product.category === 'object' ? product.category.name : product.category) : 'clothing'
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
    if (!formData.categoryId) newErrors.categoryId = 'الفئة مطلوبة';
    if (!formData.imageCover.trim() && (!formData.images || !formData.images.some(img => img.trim()))) {
      newErrors.imageCover = 'صورة الغلاف مطلوبة';
    }
    
    // Conditional validation based on hasVariants
    if (!formData.hasVariants) {
      if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'السعر مطلوب ويجب أن يكون أكبر من صفر';
      if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'الكمية مطلوبة ويجب أن تكون صفر أو أكبر';
      if (!formData.sku.trim()) newErrors.sku = 'رمز المنتج مطلوب';
    } else {
      if (formData.variants.length === 0) newErrors.variants = 'يجب إضافة متغير واحد على الأقل للمنتج';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    try {
      // Format the data before sending to server
      const formattedData = {
        ...formData,
        // Convert string numbers to actual numbers
        price: formData.price ? parseFloat(formData.price) : undefined,
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined,
        stock: formData.stock ? parseInt(formData.stock) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        // Convert category to categoryId if it's a string
        categoryId: typeof formData.category === 'string' ? formData.category : formData.categoryId,
        // Remove temporary IDs from arrays
        attributes: formData.attributes?.map(({ id, ...attr }) => attr),
        variants: formData.variants?.map(({ id, ...variant }) => ({
          ...variant,
          price: parseFloat(variant.price),
          quantity: parseInt(variant.quantity)
        })),
        features: formData.features?.map(({ id, ...feature }) => feature),
        specifications: formData.specifications?.map(({ id, ...spec }) => ({
          ...spec,
          items: spec.items?.map(({ id, ...item }) => item)
        })),
        // Convert tags string to array
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []
      };

      // Remove undefined values
      Object.keys(formattedData).forEach(key => {
        if (formattedData[key] === undefined) {
          delete formattedData[key];
        }
      });

      if (selectedProduct) {
        const response = await productsAPI.update(selectedProduct._id, formattedData);
        if (response.data) {
          toast.success('Product updated successfully');
          handleCloseDialog();
          fetchProducts();
        }
      } else {
        const response = await productsAPI.create(formattedData);
        if (response.data) {
          toast.success('Product created successfully');
          handleCloseDialog();
          fetchProducts();
        }
      }
    } catch (err) {
      console.error('Error updating product:', err);
      const errorMessage = err.response?.data?.message || (selectedProduct ? 'Failed to update product' : 'Failed to create product');
      toast.error(errorMessage);
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

  // Attribute management functions
  const addAttribute = () => {
    const newAttribute = {
      id: Date.now(),
      name: '',
      values: ['']
    };
    setFormData(prev => ({ ...prev, attributes: [...prev.attributes, newAttribute] }));
  };

  const removeAttribute = (attributeId) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.filter(attr => attr.id !== attributeId)
    }));
  };

  const updateAttribute = (attributeId, field, value) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.map(attr =>
        attr.id === attributeId ? { ...attr, [field]: value } : attr
      )
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
      id: Date.now(),
      sku: '',
      attributes: {},
      price: '',
      quantity: '',
      images: ['']
    };
    setFormData(prev => ({ ...prev, variants: [...prev.variants, newVariant] }));
  };

  const removeVariant = (variantId) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter(variant => variant.id !== variantId)
    }));
  };

  const updateVariant = (variantId, field, value) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map(variant =>
        variant.id === variantId ? { ...variant, [field]: value } : variant
      )
    }));
  };

  const updateVariantAttribute = (variantId, attributeName, value) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map(variant =>
        variant.id === variantId
          ? { ...variant, attributes: { ...variant.attributes, [attributeName]: value } }
          : variant
      )
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
                                  onClick={() => handleOpenDialog('view', product)}
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
                                  onClick={() => handleOpenDialog('edit', product)}
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
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3} sx={{ p: 3 }}>
              {/* General Info Section */}
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="اسم المنتج"
                  value={formData.name}
                  onChange={handleFormChange('name')}
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <FormControl fullWidth error={!!errors.category}>
                  <InputLabel>الفئة</InputLabel>
                  <Select
                    value={formData.category || ''}
                    onChange={handleFormChange('category')}
                    label="الفئة"
                  >
                    {categoryOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.category && (
                    <FormHelperText>{errors.category}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="السعر"
                  type="number"
                  value={formData.price}
                  onChange={handleFormChange('price')}
                  error={!!errors.price}
                  helperText={errors.price}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="سعر البيع"
                  type="number"
                  value={formData.salePrice}
                  onChange={handleFormChange('salePrice')}
                  error={!!errors.salePrice}
                  helperText={errors.salePrice}
                />
              </Grid>
              <Grid xs={12}>
                <TextField
                  fullWidth
                  label="الوصف"
                  value={formData.description}
                  onChange={handleFormChange('description')}
                  multiline
                  minRows={3}
                  error={!!errors.description}
                  helperText={errors.description}
                />
              </Grid>
            </Grid>
          </form>
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

export default Products; 