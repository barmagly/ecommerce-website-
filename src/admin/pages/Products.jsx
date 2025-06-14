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
  Info as InfoIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { productsAPI, categoriesAPI } from '../services/api';
import axios from 'axios';

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
    hasVariants: false,
    price: '',
    stock: '',
    sku: '',
    imageCover: '',
    images: [],
    features: [],
    specifications: [],
    attributes: [] // Initialize attributes as an empty array
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  // Add new state for variants dialog
  const [openVariantsDialog, setOpenVariantsDialog] = useState(false);
  const [selectedProductForVariants, setSelectedProductForVariants] = useState(null);
  const [variantFormData, setVariantFormData] = useState({
    sku: '',
    attributes: new Map(),
    price: '',
    quantity: 0,
    images: [],
    sold: 0,
    inStock: true,
    optionField: ''
  });
  const [editingVariant, setEditingVariant] = useState(null); // New state for editing variant

  // State to hold dynamically generated variant combinations for the main product form
  const [generatedVariants, setGeneratedVariants] = useState([]);

  // Add new state for variants-only dialog
  const [openVariantsOnlyDialog, setOpenVariantsOnlyDialog] = useState(false);
  const [selectedProductForVariantsOnly, setSelectedProductForVariantsOnly] = useState(null);
  const [hasAnyProductWithVariants, setHasAnyProductWithVariants] = useState(false);

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
      setHasAnyProductWithVariants(response.data.products.some(p => p.hasVariants));
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

  const handleOpenDialog = (mode = 'add', product = null) => {
    if (product) {
      console.log('Editing product:', product);
      // Map the product data to match our form structure
      const mappedProduct = {
        name: product.name || '',
        description: product.description || '',
        brand: product.brand || '',
        category: (product.category && product.category._id) ? product.category._id : (product.category || ''),
        price: product.price?.toString() || '',
        hasVariants: product.hasVariants || false,
        stock: product.stock?.toString() || '',
        sku: product.sku || '',
        imageCover: product.imageCover?.url || product.imageCover || '',
        images: product.images?.map(img => img.url || img) || [],
        features: product.features || [],
        specifications: product.specifications || [],
        // Ensure attributes are correctly mapped with values as arrays
        attributes: product.attributes?.map(attr => ({
          name: attr.name,
          values: Array.isArray(attr.values) ? attr.values : (typeof attr.values === 'string' ? attr.values.split(',').map(v => v.trim()).filter(Boolean) : [])
        })) || [],
        variants: product.productVariants?.map(variant => ({
          sku: variant.sku,
          attributes: variant.attributes ? new Map(Object.entries(variant.attributes)) : new Map(),
          price: variant.price?.toString(),
          quantity: variant.quantity?.toString(),
          images: variant.images?.map(img => img.url || img) || []
        })) || []
      };
      setFormData(mappedProduct);
      setDialogMode('edit');
    } else {
      setFormData(initialFormData);
      setDialogMode('add');
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
    setFormErrors({});
    let hasErrors = false;

    // التحقق من صحة البيانات
    if (!formData.name || formData.name.length < 3 || formData.name.length > 200) {
      setFormErrors(prev => ({ ...prev, name: 'اسم المنتج يجب أن يكون بين 3 و 200 حرف' }));
      hasErrors = true;
    }

    if (!formData.description || formData.description.length < 20) {
      setFormErrors(prev => ({ ...prev, description: 'الوصف يجب أن يكون 20 حرف على الأقل' }));
      hasErrors = true;
    }

    if (!formData.brand) {
      setFormErrors(prev => ({ ...prev, brand: 'العلامة التجارية مطلوبة' }));
      hasErrors = true;
    }

    if (!formData.category) {
      setFormErrors(prev => ({ ...prev, category: 'التصنيف مطلوب' }));
      hasErrors = true;
    }

    if (!formData.imageCover) {
      setFormErrors(prev => ({ ...prev, imageCover: 'صورة الغلاف مطلوبة' }));
      hasErrors = true;
    }

    // التحقق من الحقول المطلوبة للمنتج غير المتغير
    if (!formData.hasVariants) {
      if (!formData.price || formData.price < 0) {
        setFormErrors(prev => ({ ...prev, price: 'السعر يجب أن يكون أكبر من 0' }));
        hasErrors = true;
      }

      if (!formData.stock || formData.stock < 0) {
        setFormErrors(prev => ({ ...prev, stock: 'المخزون يجب أن يكون أكبر من 0' }));
        hasErrors = true;
      }

      if (!formData.sku) {
        setFormErrors(prev => ({ ...prev, sku: 'رمز المنتج (SKU) مطلوب' }));
        hasErrors = true;
      }
    }

    if (hasErrors) return;

    try {
      setLoading(true);
      const formDataToSend = new FormData();

      // إضافة البيانات الأساسية
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('brand', formData.brand);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('hasVariants', formData.hasVariants);

      // إضافة السعر والمخزون وSKU إذا لم يكن المنتج متغير
      if (!formData.hasVariants) {
        formDataToSend.append('price', formData.price);
        formDataToSend.append('stock', formData.stock);
        formDataToSend.append('sku', formData.sku);
      } else {
        // إضافة قيم افتراضية للمنتج المتغير
        formDataToSend.append('price', '0');
        formDataToSend.append('stock', '0');
        formDataToSend.append('sku', 'VAR-' + Date.now());
      }

      // إضافة الصور
      if (formData.imageCover) {
        formDataToSend.append('imageCover', formData.imageCover);
      }
      formData.images.forEach((image, index) => {
        formDataToSend.append(`images`, image);
      });

      // إضافة المميزات
      formData.features.forEach((feature, index) => {
        formDataToSend.append(`features[${index}][name]`, feature.name);
        formDataToSend.append(`features[${index}][value]`, feature.value);
      });

      // إضافة المواصفات
      formData.specifications.forEach((spec, specIndex) => {
        formDataToSend.append(`specifications[${specIndex}][group]`, spec.group);
        spec.items.forEach((item, itemIndex) => {
          formDataToSend.append(`specifications[${specIndex}][items][${itemIndex}][name]`, item.name);
          formDataToSend.append(`specifications[${specIndex}][items][${itemIndex}][value]`, item.value);
        });
      });

      // إضافة السمات
      formData.attributes.forEach((attr, index) => {
        formDataToSend.append(`attributes[${index}][name]`, attr.name);
        formDataToSend.append(`attributes[${index}][values]`, attr.values.join(','));
      });

      // إضافة المتغيرات إذا كانت موجودة
      if (formData.hasVariants && generatedVariants.length > 0) {
        const variantsData = generatedVariants.map(variant => ({
          sku: variant.sku || ('VAR-' + Date.now()), // Generate SKU if not provided
          attributes: Object.fromEntries(variant.attributes), // Convert Map to object
          price: parseFloat(variant.price) || 0,
          quantity: parseInt(variant.quantity) || 0,
          sold: parseInt(variant.sold) || 0,
          inStock: variant.quantity > 0,
          images: variant.images.map((img, index) => ({
            url: img,
            alt: `Variant image ${index + 1}`,
            isPrimary: index === 0
          })),
          optionField: variant.optionField || ''
        }));
        formDataToSend.append('productVariants', JSON.stringify(variantsData));
      }

      if (selectedProduct) {
        const response = await productsAPI.update(selectedProduct._id, formDataToSend);
        if (response.data.status === 'success') {
          toast.success('تم تحديث المنتج بنجاح');
          handleCloseDialog();
          fetchProducts();
        }
      } else {
        const response = await productsAPI.create(formDataToSend);
        if (response.data.status === 'success') {
          toast.success('تم إضافة المنتج بنجاح');
          handleCloseDialog();
          fetchProducts();
        }
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء حفظ المنتج');
    } finally {
      setLoading(false);
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

  const handleVariantImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...variantFormData.images];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result);
        setVariantFormData(prev => ({
          ...prev,
          images: newImages
        }));
      };
      reader.readAsDataURL(file);
    });
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

  // Add new handlers for variants dialog
  const handleOpenVariantsDialog = (product, variant = null) => {
    setSelectedProductForVariants(product);
    setOpenVariantsDialog(true);
    if (variant) {
      setEditingVariant(variant);
      setVariantFormData({
        sku: variant.sku || '',
        attributes: variant.attributes ? new Map(Object.entries(variant.attributes)) : new Map(),
        price: variant.price?.toString() || '',
        quantity: variant.quantity || 0,
        images: variant.images?.map(img => img.url || img) || [],
        sold: variant.sold || 0, // Initialize sold field
        inStock: variant.inStock ?? (variant.quantity > 0), // Initialize inStock field
        optionField: variant.optionField || ''
      });
    } else {
      setEditingVariant(null);
      setVariantFormData({
        sku: '',
        attributes: new Map(),
        price: '',
        quantity: 0,
        images: [],
        sold: 0, // Default sold to 0 for new variants
        inStock: true, // Default inStock to true for new variants
        optionField: ''
      });
    }
  };

  const handleCloseVariantsDialog = () => {
    setOpenVariantsDialog(false);
    setSelectedProductForVariants(null);
    setEditingVariant(null); // Clear editing variant on close
    setVariantFormData({
      sku: '',
      attributes: new Map(),
      price: '',
      quantity: 0,
      images: [],
      sold: 0, // Reset sold field on close
      inStock: true, // Reset inStock field on close
      optionField: ''
    });
  };

  const handleVariantSubmit = async (e) => {
    e.preventDefault();
    const productId = selectedProductForVariants?._id || selectedProductForVariantsOnly?._id;
    if (!productId) return;

    try {
      // Validate required fields
      if (!variantFormData.sku) {
        toast.error('رمز المتغير مطلوب');
        return;
      }
      if (!variantFormData.price || variantFormData.price <= 0) {
        toast.error('السعر يجب أن يكون أكبر من صفر');
        return;
      }
      if (variantFormData.quantity < 0) {
        toast.error('الكمية لا يمكن أن تكون سالبة');
        return;
      }
      if (variantFormData.attributes.size === 0) {
        toast.error('يجب تحديد خصائص المتغير');
        return;
      }

      const variantPayload = {
        sku: variantFormData.sku,
        product: productId,
        attributes: Object.fromEntries(variantFormData.attributes),
        price: parseFloat(variantFormData.price),
        quantity: parseInt(variantFormData.quantity),
        sold: parseInt(variantFormData.sold) || 0,
        inStock: variantFormData.quantity > 0,
        images: variantFormData.images.map((img, index) => ({
          url: img,
          alt: `Variant image ${index + 1}`,
          isPrimary: index === 0
        })),
        // Assuming 'optionField' is part of the variant schema based on the table UI
        optionField: variantFormData.optionField || ''
      };

      const formDataToSend = new FormData();
      formDataToSend.append('sku', variantPayload.sku);
      formDataToSend.append('price', variantPayload.price);
      formDataToSend.append('quantity', variantPayload.quantity);
      formDataToSend.append('sold', variantPayload.sold);
      formDataToSend.append('inStock', variantPayload.inStock);
      formDataToSend.append('attributes', JSON.stringify(variantPayload.attributes));

      // Handle variant images (new files)
      const newImagesToUpload = [];
      const existingImageUrls = [];

      variantFormData.images.forEach(image => {
        if (image instanceof File) {
          newImagesToUpload.push(image);
        } else if (typeof image === 'string') {
          existingImageUrls.push(image);
        }
      });

      newImagesToUpload.forEach((image) => {
        formDataToSend.append(`images`, image);
      });

      // If updating and there are existing images, send their URLs
      if (editingVariant && existingImageUrls.length > 0) {
        formDataToSend.append('existingImages', JSON.stringify(existingImageUrls));
      }

      if (editingVariant) {
        await productsAPI.updateVariant(productId, editingVariant._id, formDataToSend);
        toast.success('تم تحديث المتغير بنجاح');
      } else {
        await productsAPI.createVariant(productId, formDataToSend);
        toast.success('تم إضافة المتغير بنجاح');
      }
      handleCloseVariantsDialog();
      fetchProducts();
    } catch (err) {
      console.error('Error saving variant:', err);
      toast.error(err.response?.data?.message || 'حدث خطأ أثناء حفظ المتغير');
    }
  };

  const handleDeleteVariant = async (productId, variantId) => {
    if (window.confirm('هل أنت متأكد أنك تريد حذف هذا المتغير؟')) {
      try {
        await productsAPI.deleteVariant(productId, variantId);
        toast.success('تم حذف المتغير بنجاح');
        fetchProducts();
      } catch (err) {
        console.error('Error deleting variant:', err);
        toast.error(err.response?.data?.message || 'حدث خطأ أثناء حذف المتغير');
      }
    }
  };

  // Add new handler for variants-only dialog
  const handleOpenVariantsOnlyDialog = () => {
    setOpenVariantsOnlyDialog(true);
  };

  const handleCloseVariantsOnlyDialog = () => {
    setOpenVariantsOnlyDialog(false);
    setSelectedProductForVariantsOnly(null);
    setVariantFormData({
      sku: '',
      attributes: new Map(),
      price: '',
      quantity: 0,
      images: [],
      sold: 0, // Reset sold field on close
      inStock: true, // Reset inStock field on close
      optionField: ''
    });
  };

  // Modify the table actions to include variant management
  const renderTableActions = (product) => (
    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
      <Tooltip title="إدارة المتغيرات" arrow>
        {product.hasVariants && (
          <IconButton
            size="small"
            color="secondary"
            onClick={() => handleOpenVariantsDialog(product)}
            sx={{
              borderRadius: 2,
              '&:hover': {
                backgroundColor: alpha('#9c27b0', 0.1),
                transform: 'scale(1.1)'
              }
            }}
          >
            <SettingsIcon fontSize="small" />
          </IconButton>
        )}
      </Tooltip>
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
  );

  // Add the variants dialog
  const renderVariantsDialog = () => (
    <Dialog
      open={openVariantsDialog}
      onClose={handleCloseVariantsDialog}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: '60vh',
          background: 'linear-gradient(to bottom right, #ffffff, #f8f9fa)'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: '1px solid #e0e0e0',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            {editingVariant ? 'تعديل المتغير' : 'إضافة متغيرات للمنتج'}: {selectedProductForVariants?.hasVariants ? selectedProductForVariants?.name : ''}
          </Typography>
          <IconButton onClick={handleCloseVariantsDialog} size="small" sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{
        p: 3,
        mt: 0,
        maxHeight: '70vh',
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '4px',
          '&:hover': {
            background: '#555',
          },
        },
      }}>
        <Box component="form" onSubmit={handleVariantSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                type="number"
                label="السعر"
                value={variantFormData.price}
                onChange={(e) => setVariantFormData(prev => ({ ...prev, price: e.target.value }))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                label="رمز المتغير"
                value={variantFormData.sku}
                onChange={(e) => setVariantFormData(prev => ({ ...prev, sku: e.target.value }))}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="المباع"
                value={variantFormData.sold}
                onChange={(e) => setVariantFormData(prev => ({ ...prev, sold: e.target.value }))}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                type="number"
                label="الكمية"
                value={variantFormData.quantity}
                onChange={(e) => setVariantFormData(prev => ({ ...prev, quantity: e.target.value }))}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                    },
                  },
                }}
              />
            </Grid>

            {/* Variant Attributes */}
            {selectedProductForVariants?.attributes?.map((attr, attrIndex) => (
              <Grid item xs={12} md={4} key={attrIndex}>
                <FormControl fullWidth>
                  <InputLabel>{attr.name}</InputLabel>
                  <Select
                    value={variantFormData.attributes.get(attr.name) || ''}
                    onChange={(e) => {
                      const newAttributes = new Map(variantFormData.attributes);
                      newAttributes.set(attr.name, e.target.value);
                      setVariantFormData(prev => ({ ...prev, attributes: newAttributes }));
                    }}
                    label={attr.name}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                      },
                    }}
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
            <Grid item xs={12}>
              <Box sx={{
                border: '2px dashed #667eea',
                borderRadius: 2,
                p: 2,
                textAlign: 'center',
                bgcolor: 'rgba(102, 126, 234, 0.05)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'rgba(102, 126, 234, 0.1)',
                }
              }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<ImageIcon />}
                  sx={{
                    borderColor: '#667eea',
                    color: '#667eea',
                    '&:hover': {
                      borderColor: '#764ba2',
                      color: '#764ba2',
                    }
                  }}
                >
                  صور المتغير
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handleVariantImagesChange}
                  />
                </Button>
                <Box sx={{
                  mt: 2,
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  justifyContent: 'center'
                }}>
                  {variantFormData.images.map((img, imgIndex) => (
                    <Box
                      key={imgIndex}
                      sx={{
                        position: 'relative',
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        }
                      }}
                    >
                      <img
                        src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                        alt={`Variant ${imgIndex + 1}`}
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: 'cover',
                          borderRadius: 8,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          bgcolor: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'rgba(0,0,0,0.9)',
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => {
                          setVariantFormData(prev => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== imgIndex)
                          }));
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>

          <DialogActions sx={{
            mt: 3,
            px: 3,
            py: 2,
            borderTop: '1px solid #e0e0e0',
            bgcolor: '#f8f9fa'
          }}>
            <Button
              onClick={handleCloseVariantsDialog}
              sx={{
                color: '#666',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.05)',
                }
              }}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                }
              }}
            >
              {editingVariant ? 'تحديث المتغير' : 'إضافة المتغير'}
            </Button>
          </DialogActions>
        </Box>

        {/* Existing Variants Section */}
        {selectedProductForVariants?.productVariants?.length > 0 && (
          <Box sx={{ mt: 4, p: 3, bgcolor: 'rgba(102, 126, 234, 0.05)', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#667eea', fontWeight: 600 }}>
                المتغيرات الحالية للمنتج
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => handleOpenVariantsDialog(selectedProductForVariants)}
                sx={{
                  borderColor: '#667eea',
                  color: '#667eea',
                  '&:hover': {
                    borderColor: '#764ba2',
                    color: '#764ba2',
                  }
                }}
              >
                إضافة متغير جديد
              </Button>
            </Box>
            <TableContainer component={Paper} elevation={1}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>SKU</TableCell>
                    <TableCell>السعر</TableCell>
                    <TableCell>الكمية</TableCell>
                    <TableCell>المباع</TableCell>
                    <TableCell>السمات</TableCell>
                    <TableCell align="right">الإجراءات</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedProductForVariants.productVariants.map((variant) => (
                    <TableRow key={variant._id}>
                      <TableCell>{variant.sku}</TableCell>
                      <TableCell>{variant.price} $</TableCell>
                      <TableCell>{variant.quantity}</TableCell>
                      <TableCell>{variant.sold}</TableCell>
                      <TableCell>
                        {variant.attributes && Object.entries(variant.attributes).map(([key, value]) => (
                          <Chip key={key} label={`${key}: ${value}`} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                        ))}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenVariantsDialog(selectedProductForVariants, variant)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteVariant(selectedProductForVariants._id, variant._id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );

  // Add the variants-only dialog
  const renderVariantsOnlyDialog = () => (
    <Dialog
      open={openVariantsOnlyDialog}
      onClose={handleCloseVariantsOnlyDialog}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: '60vh',
          background: 'linear-gradient(to bottom right, #ffffff, #f8f9fa)'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: '1px solid #e0e0e0',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            إضافة متغيرات جديدة
          </Typography>
          <IconButton onClick={handleCloseVariantsOnlyDialog} size="small" sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{
        p: 3,
        mt: 0,
        maxHeight: '70vh',
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '4px',
          '&:hover': {
            background: '#555',
          },
        },
      }}>
        <Box component="form" onSubmit={handleVariantSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            {/* Product Selection */}
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>اختر المنتج</InputLabel>
                <Select
                  value={selectedProductForVariantsOnly?._id || ''}
                  onChange={(e) => {
                    const product = products.find(p => p._id === e.target.value);
                    setSelectedProductForVariantsOnly(product);
                  }}
                  label="اختر المنتج"
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#667eea',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#667eea',
                    },
                  }}
                >
                  {products.map((product) => (
                    <MenuItem key={product._id} value={product._id}>
                      {product.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {selectedProductForVariantsOnly?.hasVariants && (
              <>
                {/* Basic Information */}
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    required
                    type="number"
                    label="السعر"
                    value={variantFormData.price}
                    onChange={(e) => setVariantFormData(prev => ({ ...prev, price: e.target.value }))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#667eea',
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    required
                    label="رمز المتغير"
                    value={variantFormData.sku}
                    onChange={(e) => setVariantFormData(prev => ({ ...prev, sku: e.target.value }))}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#667eea',
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="المباع"
                    value={variantFormData.sold}
                    onChange={(e) => setVariantFormData(prev => ({ ...prev, sold: e.target.value }))}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#667eea',
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    required
                    type="number"
                    label="الكمية"
                    value={variantFormData.quantity}
                    onChange={(e) => setVariantFormData(prev => ({ ...prev, quantity: e.target.value }))}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#667eea',
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Variant Attributes */}
                {selectedProductForVariantsOnly?.attributes?.map((attr, attrIndex) => (
                  <Grid item xs={12} md={4} key={attrIndex}>
                    <TextField
                      fullWidth
                      label={`${attr.name} (افصل القيم بفاصلة)`}
                      value={Array.from(variantFormData.attributes.entries())
                        .find(([key]) => key === attr.name)?.[1]
                        ?.split(',')
                        .map(v => v.trim())
                        .filter(Boolean)
                        .join(', ') || ''}
                      onChange={(e) => {
                        const newAttributes = new Map(variantFormData.attributes);
                        newAttributes.set(attr.name, e.target.value.split(',').map(v => v.trim()).filter(Boolean).join(','));
                        setVariantFormData(prev => ({ ...prev, attributes: newAttributes }));
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Tooltip title="افصل القيم بفاصلة" arrow>
                              <InfoIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                          },
                        },
                      }}
                    />
                    <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {Array.from(variantFormData.attributes.entries())
                        .find(([key]) => key === attr.name)?.[1]
                        ?.split(',')
                        .map(v => v.trim())
                        .filter(Boolean)
                        .map((value, valueIndex) => (
                          <Chip
                            key={valueIndex}
                            label={value}
                            onDelete={() => {
                              const currentValues = Array.from(variantFormData.attributes.entries())
                                .find(([key]) => key === attr.name)?.[1]
                                ?.split(',')
                                .map(v => v.trim())
                                .filter(Boolean) || [];
                              const newValues = currentValues.filter((_, i) => i !== valueIndex);
                              const newAttributes = new Map(variantFormData.attributes);
                              newAttributes.set(attr.name, newValues.join(','));
                              setVariantFormData(prev => ({ ...prev, attributes: newAttributes }));
                            }}
                            sx={{ bgcolor: alpha('#667eea', 0.1), color: '#667eea' }}
                          />
                        ))}
                    </Box>
                  </Grid>
                ))}

                {/* Variant Images */}
                <Grid item xs={12}>
                  <Box sx={{
                    border: '2px dashed #667eea',
                    borderRadius: 2,
                    p: 2,
                    textAlign: 'center',
                    bgcolor: 'rgba(102, 126, 234, 0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(102, 126, 234, 0.1)',
                    }
                  }}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<ImageIcon />}
                      sx={{
                        borderColor: '#667eea',
                        color: '#667eea',
                        '&:hover': {
                          borderColor: '#764ba2',
                          color: '#764ba2',
                        }
                      }}
                    >
                      صور المتغير
                      <input
                        type="file"
                        hidden
                        multiple
                        accept="image/*"
                        onChange={handleVariantImagesChange}
                      />
                    </Button>

                    {/* Display selected images */}
                    {variantFormData.images.length > 0 && (
                      <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        {variantFormData.images.map((image, index) => (
                          <Box
                            key={index}
                            sx={{
                              position: 'relative',
                              width: 100,
                              height: 100,
                              borderRadius: 1,
                              overflow: 'hidden',
                              border: '1px solid #e0e0e0'
                            }}
                          >
                            <img
                              src={image}
                              alt={`Variant image ${index + 1}`}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                            {index === 0 && (
                              <Chip
                                label="صورة رئيسية"
                                size="small"
                                sx={{
                                  position: 'absolute',
                                  top: 4,
                                  right: 4,
                                  bgcolor: 'rgba(102, 126, 234, 0.9)',
                                  color: 'white'
                                }}
                              />
                            )}
                            <IconButton
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: 4,
                                left: 4,
                                bgcolor: 'rgba(255, 255, 255, 0.8)',
                                '&:hover': {
                                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                                }
                              }}
                              onClick={() => {
                                const newImages = [...variantFormData.images];
                                newImages.splice(index, 1);
                                setVariantFormData(prev => ({
                                  ...prev,
                                  images: newImages
                                }));
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                      mt: 2,
                      py: 1.5,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                      }
                    }}
                  >
                    حفظ المتغير
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );

  // Update the table cell to use the new actions
  const renderTableCell = (product) => (
    <TableCell>
      {renderTableActions(product)}
    </TableCell>
  );

  // Helper function to generate all combinations of attributes
  const generateAttributeCombinations = (attributes) => {
    if (!attributes || attributes.length === 0) {
      return [];
    }

    const combinations = [];

    function backtrack(index, currentCombination) {
      if (index === attributes.length) {
        combinations.push(new Map(currentCombination));
        return;
      }

      const attribute = attributes[index];
      attribute.values.forEach(value => {
        currentCombination.set(attribute.name, value);
        backtrack(index + 1, currentCombination);
      });
    }

    backtrack(0, new Map());
    return combinations;
  };

  // Effect to generate variants whenever attributes change in the main form
  useEffect(() => {
    if (formData.hasVariants && formData.attributes.length > 0) {
      const combinations = generateAttributeCombinations(formData.attributes);
      // Initialize generated variants with existing data if available, or default values
      const newGeneratedVariants = combinations.map(combination => {
        const existingVariant = (selectedProduct?.productVariants || []).find(pv => {
          const pvAttributes = new Map(Object.entries(pv.attributes || {}));
          // Compare maps by converting to strings or by iterating key-value pairs
          if (pvAttributes.size !== combination.size) return false;
          for (let [key, value] of combination) {
            if (pvAttributes.get(key) !== value) return false;
          }
          return true;
        });

        return {
          attributes: combination,
          sku: existingVariant?.sku || '',
          price: existingVariant?.price?.toString() || '',
          quantity: existingVariant?.quantity?.toString() || '0',
          sold: existingVariant?.sold?.toString() || '0',
          inStock: existingVariant?.inStock ?? (existingVariant?.quantity > 0),
          images: existingVariant?.images?.map(img => img.url || img) || [],
          // Add an option field for flexibility
          optionField: existingVariant?.optionField || ''
        };
      });
      setGeneratedVariants(newGeneratedVariants);
    } else {
      setGeneratedVariants([]);
    }
  }, [formData.attributes, formData.hasVariants, selectedProduct]);

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
              {hasAnyProductWithVariants && (
                <Button
                  variant="contained"
                  startIcon={<SettingsIcon />}
                  onClick={handleOpenVariantsOnlyDialog}
                  sx={{
                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #6a4190 0%, #5a6fd8 100%)',
                    }
                  }}
                >
                  إضافة متغيرات
                </Button>
              )}
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
                              {product.price} جنية
                              {product.salePrice && (
                                <Typography
                                  component="span"
                                  variant="caption"
                                  sx={{ textDecoration: 'line-through', color: 'text.secondary', ml: 1 }}
                                >
                                  {product.salePrice} جنية
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
                                {new Date(product.createdAt).toLocaleDateString('en-US')}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(product.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            {renderTableActions(product)}
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

      {/* Modify the product form dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            minHeight: '80vh',
            background: 'linear-gradient(to bottom right, #ffffff, #f8f9fa)'
          }
        }}
      >
        <DialogTitle sx={{
          borderBottom: '1px solid #e0e0e0',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              {dialogMode === 'add' ? 'إضافة منتج جديد' : 'تعديل المنتج'}
            </Typography>
            <IconButton onClick={handleCloseDialog} size="small" sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{
          p: 3,
          mt: 0,
          maxHeight: '80vh',
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px',
            '&:hover': {
              background: '#555',
            },
          },
        }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              {/* Basic Information Section */}
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, bgcolor: 'rgba(102, 126, 234, 0.05)', borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#667eea', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SettingsIcon /> المعلومات الأساسية
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        required
                        label="اسم المنتج"
                        value={formData.name}
                        onChange={handleFormChange('name')}
                        error={!!formErrors.name}
                        helperText={formErrors.name}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: '#667eea',
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        required
                        label="العلامة التجارية"
                        value={formData.brand}
                        onChange={handleFormChange('brand')}
                        error={!!formErrors.brand}
                        helperText={formErrors.brand}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: '#667eea',
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
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
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: '#667eea',
                            },
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Pricing and Stock Section */}
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, bgcolor: 'rgba(118, 75, 162, 0.05)', borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#764ba2', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PriceIcon /> السعر والمخزون
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.hasVariants}
                            onChange={(e) => setFormData(prev => ({ ...prev, hasVariants: e.target.checked }))}
                            color="primary"
                          />
                        }
                        label="المنتج له متغيرات"
                      />
                    </Grid>
                    {!formData.hasVariants && (
                      <>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            required
                            type="number"
                            label="السعر"
                            value={formData.price}
                            onChange={handleFormChange('price')}
                            error={!!formErrors.price}
                            helperText={formErrors.price}
                            InputProps={{
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                  borderColor: '#764ba2',
                                },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            required
                            type="number"
                            label="المخزون"
                            value={formData.stock}
                            onChange={handleFormChange('stock')}
                            error={!!formErrors.stock}
                            helperText={formErrors.stock}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                  borderColor: '#764ba2',
                                },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            required
                            label="رمز المنتج (SKU)"
                            value={formData.sku}
                            onChange={handleFormChange('sku')}
                            error={!!formErrors.sku}
                            helperText={formErrors.sku}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                  borderColor: '#764ba2',
                                },
                              },
                            }}
                          />
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Paper>
              </Grid>

              {/* Category Section */}
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, bgcolor: 'rgba(102, 126, 234, 0.05)', borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#667eea', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CategoryIcon /> التصنيف
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <FormControl fullWidth required error={!!formErrors.category}>
                        <InputLabel>الفئة</InputLabel>
                        <Select
                          value={formData.category}
                          onChange={handleFormChange('category')}
                          label="الفئة"
                          sx={{
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#667eea',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#667eea',
                            },
                          }}
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
                  </Grid>
                </Paper>
              </Grid>

              {/* Product Images Section */}
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, bgcolor: 'rgba(118, 75, 162, 0.05)', borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#764ba2', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ImageIcon /> صور المنتج
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{
                        border: '2px dashed #764ba2',
                        borderRadius: 2,
                        p: 2,
                        textAlign: 'center',
                        bgcolor: 'rgba(118, 75, 162, 0.05)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: 'rgba(118, 75, 162, 0.1)',
                        }
                      }}>
                        <Button
                          variant="outlined"
                          component="label"
                          fullWidth
                          startIcon={<ImageIcon />}
                          sx={{
                            borderColor: '#764ba2',
                            color: '#764ba2',
                            '&:hover': {
                              borderColor: '#667eea',
                              color: '#667eea',
                            }
                          }}
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
                          <Box sx={{ mt: 2 }}>
                            <img
                              src={formData.imageCover}
                              alt="Cover"
                              style={{
                                maxWidth: '100%',
                                maxHeight: 200,
                                borderRadius: 8,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                              }}
                            />
                          </Box>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{
                        border: '2px dashed #764ba2',
                        borderRadius: 2,
                        p: 2,
                        textAlign: 'center',
                        bgcolor: 'rgba(118, 75, 162, 0.05)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: 'rgba(118, 75, 162, 0.1)',
                        }
                      }}>
                        <Button
                          variant="outlined"
                          component="label"
                          fullWidth
                          startIcon={<ImageIcon />}
                          sx={{
                            borderColor: '#764ba2',
                            color: '#764ba2',
                            '&:hover': {
                              borderColor: '#667eea',
                              color: '#667eea',
                            }
                          }}
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
                        <Box sx={{
                          mt: 2,
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 1,
                          justifyContent: 'center'
                        }}>
                          {formData.images.map((img, index) => (
                            <Box
                              key={index}
                              sx={{
                                position: 'relative',
                                transition: 'transform 0.2s ease',
                                '&:hover': {
                                  transform: 'scale(1.05)',
                                }
                              }}
                            >
                              <img
                                src={img}
                                alt={`Product ${index + 1}`}
                                style={{
                                  width: 100,
                                  height: 100,
                                  objectFit: 'cover',
                                  borderRadius: 8,
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}
                              />
                              <IconButton
                                size="small"
                                sx={{
                                  position: 'absolute',
                                  top: -8,
                                  right: -8,
                                  bgcolor: 'rgba(0,0,0,0.7)',
                                  color: 'white',
                                  '&:hover': {
                                    bgcolor: 'rgba(0,0,0,0.9)',
                                    transform: 'scale(1.1)'
                                  },
                                  transition: 'all 0.2s ease'
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
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Features Section */}
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, bgcolor: 'rgba(102, 126, 234, 0.05)', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ color: '#667eea', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <StarIcon /> المميزات
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          features: [...prev.features, { name: '', value: '' }]
                        }));
                      }}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                        }
                      }}
                    >
                      إضافة ميزة
                    </Button>
                  </Box>
                  {formData.features.map((feature, index) => (
                    <Paper
                      key={index}
                      sx={{
                        p: 3,
                        mb: 2,
                        bgcolor: 'white',
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }
                      }}
                    >
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={5}>
                          <TextField
                            fullWidth
                            label="اسم الميزة"
                            value={feature.name}
                            onChange={(e) => {
                              const newFeatures = [...formData.features];
                              newFeatures[index] = { ...feature, name: e.target.value };
                              setFormData(prev => ({ ...prev, features: newFeatures }));
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                  borderColor: '#667eea',
                                },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={5}>
                          <TextField
                            fullWidth
                            label="قيمة الميزة"
                            value={feature.value}
                            onChange={(e) => {
                              const newFeatures = [...formData.features];
                              newFeatures[index] = { ...feature, value: e.target.value };
                              setFormData(prev => ({ ...prev, features: newFeatures }));
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                  borderColor: '#667eea',
                                },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <Button
                            color="error"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                features: prev.features.filter((_, i) => i !== index)
                              }));
                            }}
                            startIcon={<DeleteIcon />}
                            sx={{
                              height: '100%',
                              '&:hover': {
                                bgcolor: 'rgba(211, 47, 47, 0.1)',
                              }
                            }}
                          >
                            حذف
                          </Button>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </Paper>
              </Grid>

              {/* Specifications Section */}
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, bgcolor: 'rgba(118, 75, 162, 0.05)', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ color: '#764ba2', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SettingsIcon /> المواصفات
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          specifications: [...prev.specifications, { group: '', items: [{ name: '', value: '' }] }]
                        }));
                      }}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                        }
                      }}
                    >
                      إضافة مجموعة مواصفات
                    </Button>
                  </Box>
                  {formData.specifications.map((spec, specIndex) => (
                    <Paper
                      key={specIndex}
                      sx={{
                        p: 3,
                        mb: 2,
                        bgcolor: 'white',
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }
                      }}
                    >
                      <Box sx={{ mb: 2 }}>
                        <TextField
                          fullWidth
                          label="اسم المجموعة"
                          value={spec.group}
                          onChange={(e) => {
                            const newSpecs = [...formData.specifications];
                            newSpecs[specIndex] = { ...spec, group: e.target.value };
                            setFormData(prev => ({ ...prev, specifications: newSpecs }));
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '&:hover fieldset': {
                                borderColor: '#764ba2',
                              },
                            },
                          }}
                        />
                      </Box>
                      {spec.items.map((item, itemIndex) => (
                        <Box key={itemIndex} sx={{ mb: 2 }}>
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={5}>
                              <TextField
                                fullWidth
                                label="اسم المواصفة"
                                value={item.name}
                                onChange={(e) => {
                                  const newSpecs = [...formData.specifications];
                                  newSpecs[specIndex].items[itemIndex] = { ...item, name: e.target.value };
                                  setFormData(prev => ({ ...prev, specifications: newSpecs }));
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                      borderColor: '#764ba2',
                                    },
                                  },
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} md={5}>
                              <TextField
                                fullWidth
                                label="قيمة المواصفة"
                                value={item.value}
                                onChange={(e) => {
                                  const newSpecs = [...formData.specifications];
                                  newSpecs[specIndex].items[itemIndex] = { ...item, value: e.target.value };
                                  setFormData(prev => ({ ...prev, specifications: newSpecs }));
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                      borderColor: '#764ba2',
                                    },
                                  },
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <Button
                                color="error"
                                onClick={() => {
                                  const newSpecs = [...formData.specifications];
                                  newSpecs[specIndex].items = spec.items.filter((_, i) => i !== itemIndex);
                                  setFormData(prev => ({ ...prev, specifications: newSpecs }));
                                }}
                                startIcon={<DeleteIcon />}
                                sx={{
                                  height: '100%',
                                  '&:hover': {
                                    bgcolor: 'rgba(211, 47, 47, 0.1)',
                                  }
                                }}
                              >
                                حذف
                              </Button>
                            </Grid>
                          </Grid>
                        </Box>
                      ))}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={() => {
                            const newSpecs = [...formData.specifications];
                            newSpecs[specIndex].items.push({ name: '', value: '' });
                            setFormData(prev => ({ ...prev, specifications: newSpecs }));
                          }}
                          sx={{
                            borderColor: '#764ba2',
                            color: '#764ba2',
                            '&:hover': {
                              borderColor: '#667eea',
                              color: '#667eea',
                            }
                          }}
                        >
                          إضافة مواصفة
                        </Button>
                        <Button
                          color="error"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              specifications: prev.specifications.filter((_, i) => i !== specIndex)
                            }));
                          }}
                          startIcon={<DeleteIcon />}
                          sx={{
                            '&:hover': {
                              bgcolor: 'rgba(211, 47, 47, 0.1)',
                            }
                          }}
                        >
                          حذف المجموعة
                        </Button>
                      </Box>
                    </Paper>
                  ))}
                </Paper>
              </Grid>

              {/* Attributes Section */}
              {formData.hasVariants && (
                <Grid item xs={12}>
                  <Paper elevation={0} sx={{ p: 3, bgcolor: 'rgba(102, 126, 234, 0.05)', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ color: '#667eea', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PaletteIcon /> السمات (المتغيرات)
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={addAttribute}
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                          }
                        }}
                      >
                        إضافة سمة
                      </Button>
                    </Box>
                    {formData.attributes.map((attribute, index) => (
                      <Paper
                        key={index}
                        sx={{
                          p: 3,
                          mb: 2,
                          bgcolor: 'white',
                          borderRadius: 2,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          }
                        }}
                      >
                        <Grid container spacing={3} alignItems="center">
                          <Grid item xs={12} md={5}>
                            <TextField
                              fullWidth
                              label="اسم السمة"
                              value={attribute.name}
                              onChange={(e) => updateAttribute(index, 'name', e.target.value)}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '&:hover fieldset': {
                                    borderColor: '#667eea',
                                  },
                                },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} md={5}>
                            <TextField
                              fullWidth
                              label="قيم السمة (افصل بينها بفاصلة)"
                              value={attribute.values.join(', ')}
                              onChange={(e) => updateAttribute(index, 'values', e.target.value.split(',').map(v => v.trim()).filter(Boolean))}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <Tooltip title="افصل القيم بفاصلة" arrow>
                                      <InfoIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                    </Tooltip>
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '&:hover fieldset': {
                                    borderColor: '#667eea',
                                  },
                                },
                              }}
                            />
                            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {attribute.values.map((value, valueIndex) => (
                                <Chip
                                  key={valueIndex}
                                  label={value}
                                  onDelete={() => {
                                    const newValues = attribute.values.filter((_, i) => i !== valueIndex);
                                    updateAttribute(index, 'values', newValues);
                                  }}
                                  sx={{ bgcolor: alpha('#667eea', 0.1), color: '#667eea' }}
                                />
                              ))}
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={2}>
                            <Button
                              color="error"
                              onClick={() => removeAttribute(index)}
                              startIcon={<DeleteIcon />}
                              sx={{
                                height: '100%',
                                '&:hover': {
                                  bgcolor: 'rgba(211, 47, 47, 0.1)',
                                }
                              }}
                            >
                              حذف
                            </Button>
                          </Grid>
                        </Grid>
                      </Paper>
                    ))}
                  </Paper>
                </Grid>
              )}

              {/* Dynamic Variants Table */}
              {formData.hasVariants && generatedVariants.length > 0 && (
                <Grid item xs={12}>
                  <Paper elevation={0} sx={{ p: 3, bgcolor: 'rgba(118, 75, 162, 0.05)', borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: '#764ba2', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <InventoryIcon /> إدارة المتغيرات
                    </Typography>
                    <TableContainer component={Paper} elevation={1} sx={{ mt: 2 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.08) }}>
                            <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem', color: theme.palette.secondary.dark }}>النسخة</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem', color: theme.palette.secondary.dark }}>السعر</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem', color: theme.palette.secondary.dark }}>الكمية</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem', color: theme.palette.secondary.dark }}>حقل اختياري</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {generatedVariants.map((variant, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                {Array.from(variant.attributes.values()).join(', ')}
                              </TableCell>
                              <TableCell>
                                <TextField
                                  size="small"
                                  type="number"
                                  value={variant.price}
                                  onChange={(e) => {
                                    const newVariants = [...generatedVariants];
                                    newVariants[index].price = e.target.value;
                                    setGeneratedVariants(newVariants);
                                  }}
                                  InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  size="small"
                                  type="number"
                                  value={variant.quantity}
                                  onChange={(e) => {
                                    const newVariants = [...generatedVariants];
                                    newVariants[index].quantity = e.target.value;
                                    setGeneratedVariants(newVariants);
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  size="small"
                                  value={variant.optionField}
                                  onChange={(e) => {
                                    const newVariants = [...generatedVariants];
                                    newVariants[index].optionField = e.target.value;
                                    setGeneratedVariants(newVariants);
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
              )}
            </Grid>

            <DialogActions sx={{
              mt: 3,
              px: 3,
              py: 2,
              borderTop: '1px solid #e0e0e0',
              bgcolor: '#f8f9fa'
            }}>
              <Button
                onClick={handleCloseDialog}
                sx={{
                  color: '#666',
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.05)',
                  }
                }}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  }
                }}
              >
                {dialogMode === 'add' ? 'إضافة' : 'تحديث'}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Add the variants dialog */}
      {renderVariantsDialog()}

      {/* Add the variants-only dialog */}
      {renderVariantsOnlyDialog()}
    </Box>
  );
};

export default Products; 