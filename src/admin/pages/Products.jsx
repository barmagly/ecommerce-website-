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
    status: 'نشط',
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
    loadProducts();
  }, []);

  // Check for low stock products and show alerts
  useEffect(() => {
    if (products.length > 0) {
      const lowStockProducts = products.filter(p => p.stock <= 5 && p.stock > 0);
      const outOfStockProducts = products.filter(p => p.stock === 0);
      
      if (outOfStockProducts.length > 0) {
        toast.warning(`تحذير: ${outOfStockProducts.length} منتج نفد مخزونه`);
      }
      
      if (lowStockProducts.length > 0) {
        toast.info(`تنبيه: ${lowStockProducts.length} منتج مخزونه منخفض`);
      }
    }
  }, [products]);

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

  // Enhanced filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesCategory = !filterCategory || product.category === filterCategory;
    let matchesStatus = true;
    if (filterStatus) {
      switch (filterStatus) {
        case 'نشط':
          matchesStatus = product.status === 'نشط';
          break;
        case 'غير نشط':
          matchesStatus = product.status === 'غير نشط';
          break;
        case 'نفد المخزون':
          matchesStatus = product.stock === 0;
          break;
        default:
          matchesStatus = true;
      }
    }
    
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
      imageCover: '',
      status: 'نشط',
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
        name: product.name,
        description: product.description,
        price: product.price ? product.price.toString() : '',
        salePrice: product.salePrice ? product.salePrice.toString() : '',
        categoryId: product.categoryId.toString(),
        stock: product.stock ? product.stock.toString() : '',
        sku: product.sku || '',
        images: product.images || [''],
        imageCover: product.imageCover || '',
        status: product.status,
        featured: product.featured,
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

  const handleSaveProduct = () => {
    if (!validateForm()) return;

    try {
      const category = categories.find(cat => cat.id.toString() === formData.categoryId);
      
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: category ? category.name : '',
        categoryId: parseInt(formData.categoryId),
        images: formData.images.filter(img => img.trim()),
        imageCover: formData.imageCover.trim() || (formData.images.find(img => img.trim()) || ''),
        status: formData.status,
        featured: formData.featured,
        rating: 0,
        reviews: 0,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        weight: formData.weight ? parseFloat(formData.weight) : null,
        dimensions: formData.dimensions.trim() || null,
        brand: formData.brand.trim() || null,
        hasVariants: formData.hasVariants,
        attributes: formData.attributes,
        variants: formData.variants,
        features: formData.features,
        specifications: formData.specifications,
        updatedAt: new Date().toISOString(),
      };

      // Add price, stock, and sku only if not using variants
      if (!formData.hasVariants) {
        productData.price = parseFloat(formData.price);
        productData.salePrice = formData.salePrice ? parseFloat(formData.salePrice) : null;
        productData.stock = parseInt(formData.stock);
        productData.sku = formData.sku.trim();
      }

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
                onClick={loadProducts}
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
                      <MenuItem key={category.id} value={category.name}>
                        {category.name}
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
                  قائمة المنتجات ({filteredProducts.length})
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={loadProducts}
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
                                sx={{ 
                                  width: 60, 
                                  height: 60, 
                                  borderRadius: 3,
                                  border: 2,
                                  borderColor: 'primary.light'
                                }}
                              >
                                <ImageIcon />
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5 }}>
                                  {product.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" display="block">
                                  SKU: {product.sku}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" display="block">
                                  العلامة: {product.brand}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                                  {product.featured && (
                                    <Chip
                                      label="مميز"
                                      size="small"
                                      color="warning"
                                      sx={{ fontSize: '0.65rem', height: 20 }}
                                    />
                                  )}
                                  {product.salePrice && (
                                    <Chip
                                      label="خصم"
                                      size="small"
                                      color="error"
                                      sx={{ fontSize: '0.65rem', height: 20 }}
                                    />
                                  )}
                                </Box>
                              </Box>
                            </Box>
                          </TableCell>
                          
                          <TableCell>
                            <Box>
                              <Typography variant="h6" fontWeight="bold" color="primary.main">
                                ${product.price}
                              </Typography>
                              {product.salePrice && (
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ textDecoration: 'line-through' }}
                                  >
                                    ${product.salePrice}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="success.main"
                                    fontWeight="bold"
                                  >
                                    وفر ${(product.price - product.salePrice).toFixed(2)}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </TableCell>

                          <TableCell>
                            <Chip
                              label={product.category}
                              variant="outlined"
                              size="small"
                              color="primary"
                              icon={<CategoryIcon sx={{ fontSize: 14 }} />}
                            />
                          </TableCell>
                          
                          <TableCell>
                            <Box sx={{ textAlign: 'center' }}>
                              <Chip
                                label={product.stock}
                                color={product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'error'}
                                size="small"
                                sx={{ fontWeight: 'bold', minWidth: 50 }}
                              />
                              <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                {product.stock > 10 ? 'متوفر' : product.stock > 0 ? 'محدود' : 'نفد'}
                              </Typography>
                            </Box>
                          </TableCell>
                          
                          <TableCell>
                            <Box sx={{ textAlign: 'center' }}>
                              <Chip
                                label={product.status}
                                color={product.status === 'نشط' ? 'success' : 'default'}
                                size="small"
                                variant="filled"
                              />
                            </Box>
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
                              
                              <Tooltip title="نسخ المنتج" arrow>
                                <IconButton
                                  size="small"
                                  color="secondary"
                                  onClick={() => {
                                    const duplicatedProduct = {
                                      ...product,
                                      id: products.length + 1,
                                      name: `${product.name} - نسخة`,
                                      sku: `${product.sku}-COPY`,
                                      createdAt: new Date().toISOString(),
                                      updatedAt: new Date().toISOString()
                                    };
                                    const updatedProducts = [...products, duplicatedProduct];
                                    saveProducts(updatedProducts);
                                    toast.success('تم نسخ المنتج بنجاح');
                                  }}
                                  sx={{ 
                                    borderRadius: 2,
                                    '&:hover': {
                                      backgroundColor: alpha('#9c27b0', 0.1),
                                      transform: 'scale(1.1)'
                                    }
                                  }}
                                >
                                  <InventoryIcon />
                                </IconButton>
                              </Tooltip>
                              
                              <Tooltip title="حذف المنتج" arrow>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => {
                                    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
                                      handleDeleteProduct(product.id);
                                    }
                                  }}
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
          fontWeight: 'bold',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            animation: 'shimmer 2s infinite',
          },
          '@keyframes shimmer': {
            '0%': { left: '-100%' },
            '100%': { left: '100%' }
          }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            {dialogMode === 'add' && <AddIcon />}
            {dialogMode === 'edit' && <EditIcon />}
            {dialogMode === 'view' && <ViewIcon />}
            <Typography variant="h6" component="span">
          {dialogMode === 'add' ? 'إضافة منتج جديد' : 
           dialogMode === 'edit' ? 'تعديل المنتج' : 'عرض المنتج'}
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0, mt: 0, maxHeight: '70vh', overflowY: 'auto', bgcolor: '#f7f8fa' }}>
          <form>
            <Grid container spacing={3} sx={{ p: 3 }}>
              {/* General Info Section */}
              <Grid xs={12}>
                <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: 'primary.main' }}>
                    📝 معلومات المنتج الأساسية
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid xs={12} md={6}>
                      <TextField fullWidth label="اسم المنتج" value={formData.name || ''} onChange={handleFormChange('name')} required variant="outlined" />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField fullWidth label="العلامة التجارية" value={formData.brand || ''} onChange={handleFormChange('brand')} required variant="outlined" />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>الفئة</InputLabel>
                        <Select value={formData.category || ''} onChange={handleFormChange('category')} label="الفئة">
                          {/* TODO: Map categories from backend */}
                          <MenuItem value="">اختر الفئة</MenuItem>
                          <MenuItem value="electronics">إلكترونيات</MenuItem>
                          <MenuItem value="clothing">ملابس</MenuItem>
                          <MenuItem value="books">كتب</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid xs={12}>
                      <TextField fullWidth label="الوصف" value={formData.description || ''} onChange={handleFormChange('description')} required multiline minRows={3} variant="outlined" />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Images Section */}
              <Grid xs={12}>
                <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: 'primary.main' }}>
                    🖼️ الصور
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid xs={12} md={6}>
                      <Button variant="outlined" component="label" fullWidth sx={{ height: 56 }} startIcon={<ImageIcon />}>اختر صورة الغلاف
                        <input type="file" accept="image/*" hidden onChange={e => { const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onload = ev => { setFormData(prev => ({ ...prev, imageCover: ev.target.result, imageCoverFile: file })); }; reader.readAsDataURL(file); } }} />
                      </Button>
                      {formData.imageCover && (<Box sx={{ mt: 2, textAlign: 'center' }}><img src={formData.imageCover} alt="cover preview" style={{ maxWidth: '100%', maxHeight: 120, borderRadius: 8, border: '1px solid #eee' }} /></Box>)}
                    </Grid>
                    <Grid xs={12} md={6}>
                      <Button variant="outlined" component="label" fullWidth sx={{ height: 56 }} startIcon={<ImageIcon />}>اختر صور متعددة
                        <input type="file" accept="image/*" multiple hidden onChange={e => { const files = Array.from(e.target.files); if (files.length) { Promise.all(files.map(file => { return new Promise(resolve => { const reader = new FileReader(); reader.onload = ev => resolve({ url: ev.target.result, file }); reader.readAsDataURL(file); }); })).then(images => { setFormData(prev => ({ ...prev, images: images.map(img => img.url), imagesFiles: images.map(img => img.file) })); }); } }} />
                      </Button>
                      {formData.images && formData.images.length > 0 && (<Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>{formData.images.map((img, idx) => (<img key={idx} src={img} alt={`gallery-${idx}`} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid #eee' }} />))}</Box>)}
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Features Section */}
              <Grid xs={12}>
                <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: 'primary.main' }}>⭐ الميزات</Typography>
                  {formData.features && formData.features.map((feature, idx) => (
                    <Grid container spacing={2} key={feature.id || idx} sx={{ mb: 1 }}>
                      <Grid xs={12} md={5}><TextField fullWidth label="اسم الميزة" value={feature.name} onChange={e => updateFeature(feature.id, 'name', e.target.value)} /></Grid>
                      <Grid xs={12} md={5}><TextField fullWidth label="قيمة الميزة" value={feature.value} onChange={e => updateFeature(feature.id, 'value', e.target.value)} /></Grid>
                      <Grid xs={12} md={2}><Button color="error" onClick={() => removeFeature(feature.id)}>حذف</Button></Grid>
                    </Grid>
                  ))}
                  <Button variant="outlined" onClick={addFeature}>إضافة ميزة</Button>
                </Paper>
              </Grid>

              {/* Specifications Section */}
              <Grid xs={12}>
                <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: 'primary.main' }}>📋 المواصفات</Typography>
                  {formData.specifications && formData.specifications.map((spec, idx) => (
                    <Box key={spec.id || idx} sx={{ border: '1px solid #eee', borderRadius: 2, p: 2, mt: 2 }}>
                      <Grid container spacing={2}>
                        <Grid xs={12} md={6}><TextField fullWidth label="اسم المجموعة" value={spec.group} onChange={e => updateSpecificationGroup(spec.id, e.target.value)} /></Grid>
                        <Grid xs={12} md={6}><Button variant="outlined" fullWidth onClick={() => addSpecificationItem(spec.id)}>إضافة عنصر</Button></Grid>
                        {spec.items && spec.items.map((item, itemIdx) => (
                          <React.Fragment key={item.id || itemIdx}>
                            <Grid xs={12} md={5}><TextField fullWidth label="اسم العنصر" value={item.name} onChange={e => updateSpecificationItem(spec.id, item.id, 'name', e.target.value)} /></Grid>
                            <Grid xs={12} md={5}><TextField fullWidth label="قيمة العنصر" value={item.value} onChange={e => updateSpecificationItem(spec.id, item.id, 'value', e.target.value)} /></Grid>
                            <Grid xs={12} md={2}><Button color="error" onClick={() => removeSpecificationItem(spec.id, item.id)}>حذف</Button></Grid>
                          </React.Fragment>
                        ))}
                        <Grid xs={12}><Button color="error" onClick={() => removeSpecificationGroup(spec.id)}>حذف المجموعة</Button></Grid>
                      </Grid>
                    </Box>
                  ))}
                  <Button variant="outlined" onClick={addSpecificationGroup}>إضافة مجموعة مواصفات</Button>
                </Paper>
              </Grid>

              {/* Attributes Section */}
              <Grid xs={12}>
                <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: 'primary.main' }}>🎨 السمات (للمتغيرات)</Typography>
                  {formData.attributes && formData.attributes.map((attr, idx) => (
                    <Grid container spacing={2} key={attr.id || idx} sx={{ mb: 1 }}>
                      <Grid xs={12} md={5}><TextField fullWidth label="اسم السمة" value={attr.name} onChange={e => updateAttribute(attr.id, 'name', e.target.value)} /></Grid>
                      <Grid xs={12} md={5}><TextField fullWidth label="القيم (مفصولة بفاصلة)" value={attr.values.join(',')} onChange={e => updateAttribute(attr.id, 'values', e.target.value.split(','))} /></Grid>
                      <Grid xs={12} md={2}><Button color="error" onClick={() => removeAttribute(attr.id)}>حذف</Button></Grid>
                    </Grid>
                  ))}
                  <Button variant="outlined" onClick={addAttribute}>إضافة سمة</Button>
                </Paper>
              </Grid>

              {/* Variants Switch */}
              <Grid xs={12}>
                <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                  <FormControlLabel control={<Switch checked={formData.hasVariants || false} onChange={handleFormChange('hasVariants')} color="primary" />} label="المنتج له متغيرات (مقاسات، ألوان، إلخ)" />
                </Paper>
              </Grid>

              {/* Inventory & Pricing Section (Simple Product) */}
              {!formData.hasVariants && (
                <Grid xs={12}>
                  <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: 'primary.main' }}>💰 المخزون والتسعير</Typography>
                    <Grid container spacing={2}>
                      <Grid xs={12} md={4}><TextField fullWidth label="السعر" type="number" value={formData.price || ''} onChange={handleFormChange('price')} required variant="outlined" /></Grid>
                      <Grid xs={12} md={4}><TextField fullWidth label="الكمية في المخزون" type="number" value={formData.stock || ''} onChange={handleFormChange('stock')} required variant="outlined" /></Grid>
                      <Grid xs={12} md={4}><TextField fullWidth label="رمز المنتج (SKU)" value={formData.sku || ''} onChange={handleFormChange('sku')} required variant="outlined" /></Grid>
                    </Grid>
                  </Paper>
                </Grid>
              )}

              {/* Variants Section (if hasVariants) */}
              {formData.hasVariants && (
                <Grid xs={12}>
                  <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: 'primary.main' }}>🧩 المتغيرات</Typography>
                    <Button variant="outlined" onClick={addVariant}>إضافة متغير</Button>
                    {formData.variants && formData.variants.map((variant, idx) => (
                      <Box key={variant.id || idx} sx={{ border: '1px solid #eee', borderRadius: 2, p: 2, mt: 2 }}>
                        <Grid container spacing={2}>
                          <Grid xs={12} md={3}><TextField fullWidth label="SKU المتغير" value={variant.sku} onChange={e => updateVariant(variant.id, 'sku', e.target.value)} required /></Grid>
                          {/* Dynamic attributes */}
                          {formData.attributes && formData.attributes.map((attr, aIdx) => (
                            <Grid xs={12} md={2} key={aIdx}>
                              <TextField fullWidth label={attr.name} value={variant.attributes ? variant.attributes[attr.name] || '' : ''} onChange={e => updateVariantAttribute(variant.id, attr.name, e.target.value)} />
                            </Grid>
                          ))}
                          <Grid xs={12} md={2}><TextField fullWidth label="السعر" type="number" value={variant.price} onChange={e => updateVariant(variant.id, 'price', e.target.value)} required /></Grid>
                          <Grid xs={12} md={2}><TextField fullWidth label="الكمية" type="number" value={variant.quantity} onChange={e => updateVariant(variant.id, 'quantity', e.target.value)} required /></Grid>
                          <Grid xs={12} md={3}><Button color="error" onClick={() => removeVariant(variant.id)}>حذف المتغير</Button></Grid>
                        </Grid>
                        {/* Variant Images */}
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                          <Grid xs={12} md={6}>
                            <Button variant="outlined" component="label" fullWidth sx={{ height: 56 }} startIcon={<ImageIcon />}>اختر صور المتغير
                              <input type="file" accept="image/*" multiple hidden onChange={e => {
                                const files = Array.from(e.target.files);
                                if (files.length) {
                                  Promise.all(files.map(file => {
                                    return new Promise(resolve => {
                                      const reader = new FileReader();
                                      reader.onload = ev => resolve({ url: ev.target.result, file });
                                      reader.readAsDataURL(file);
                                    });
                                  })).then(images => {
                                    updateVariant(variant.id, 'images', images.map(img => img.url));
                                  });
                                }
                              }} />
                            </Button>
                            {variant.images && variant.images.length > 0 && (<Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>{variant.images.map((img, idx) => (<img key={idx} src={img} alt={`variant-gallery-${idx}`} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid #eee' }} />))}</Box>)}
                          </Grid>
                        </Grid>
                      </Box>
                    ))}
                  </Paper>
                </Grid>
              )}

              {/* Status Section */}
              <Grid xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: 'primary.main' }}>⚡ الحالة</Typography>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>الحالة</InputLabel>
                    <Select value={formData.status || ''} onChange={handleFormChange('status')} label="الحالة">
                      <MenuItem value="active">نشط</MenuItem>
                      <MenuItem value="inactive">غير نشط</MenuItem>
                    </Select>
                  </FormControl>
                </Paper>
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