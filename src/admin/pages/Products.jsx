import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  IconButton,
  Grid,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  Tooltip,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  Visibility as VisibilityIcon,
  ExpandMore as ExpandMoreIcon,
  AddCircleOutline as AddCircleOutlineIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { productService, categoryService, uploadService } from '../services/api';
import AOS from 'aos';
import 'aos/dist/aos.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [openVariant, setOpenVariant] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    price: '',
    category: '',
    stock: '',
    sku: '',
    hasVariants: false,
    imageCover: '',
    images: [],
    features: [],
    specifications: [],
    attributes: [],
  });
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [variantData, setVariantData] = useState({
    sku: '',
    attributes: {},
    price: '',
    quantity: '',
    images: [],
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [tab, setTab] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 900, once: true });
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsResponse, categoriesResponse] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
      ]);
      setProducts(productsResponse.data);
      setCategories(categoriesResponse.data);
    } catch (error) {
      setProducts([]);
      setCategories([]);
      toast.error('حدث خطأ أثناء تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
    setSelectedProduct(null);
    setFormData({
      name: '',
      description: '',
      brand: '',
      price: '',
      category: '',
      stock: '',
      sku: '',
      hasVariants: false,
      imageCover: '',
      images: [],
      features: [],
      specifications: [],
      attributes: [],
    });
    setImages([]);
    setImagePreview(null);
    setCoverImageFile(null);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
    setImagePreview(null);
    setCoverImageFile(null);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      brand: product.brand,
      price: product.price,
      category: product.category?._id || product.category,
      stock: product.stock,
      sku: product.sku,
      hasVariants: product.hasVariants,
      imageCover: product.imageCover,
      images: product.images || [],
      features: product.features || [],
      specifications: product.specifications || [],
      attributes: product.attributes || [],
    });
    setImages(product.images || []);
    setImagePreview(product.imageCover);
    setCoverImageFile(null);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      try {
        await productService.delete(id);
        setProducts(products.filter((product) => product._id !== id));
        toast.success('تم حذف المنتج بنجاح');
      } catch (error) {
        toast.error('حدث خطأ أثناء حذف المنتج');
      }
    }
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setOpenView(true);
  };

  const handleCloseView = () => {
    setOpenView(false);
    setSelectedProduct(null);
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const handleRemoveImage = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let coverImageUrl = formData.imageCover;
      
      // Upload cover image if a new file is selected
      if (coverImageFile) {
        const coverResponse = await uploadService.uploadImage(coverImageFile);
        coverImageUrl = coverResponse.data.url;
      }

      // Upload additional images
      let uploadedImages = [];
      for (const img of images) {
        if (img.file) {
          const response = await uploadService.uploadImage(img.file);
          uploadedImages.push({ url: response.data.url, alt: '', isPrimary: false });
        } else {
          uploadedImages.push(img);
        }
      }

      const productData = {
        ...formData,
        category: formData.category,
        imageCover: coverImageUrl,
        images: uploadedImages,
        price: formData.hasVariants ? undefined : parseFloat(formData.price),
        stock: formData.hasVariants ? undefined : parseInt(formData.stock),
      };

      if (selectedProduct) {
        const response = await productService.update(selectedProduct._id, productData);
        setProducts(products.map((product) => product._id === selectedProduct._id ? response.data : product));
        toast.success('تم تحديث المنتج بنجاح');
      } else {
        const response = await productService.create(productData);
        setProducts([...products, response.data]);
        toast.success('تم إضافة المنتج بنجاح');
      }
      handleClose();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('حدث خطأ أثناء حفظ المنتج');
    }
  };

  // Variant management
  const handleOpenVariant = (product) => {
    setSelectedProduct(product);
    setOpenVariant(true);
    setSelectedVariant(null);
    setVariantData({
      sku: '',
      attributes: {},
      price: '',
      quantity: '',
      images: [],
    });
  };
  const handleCloseVariant = () => {
    setOpenVariant(false);
    setSelectedVariant(null);
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) {
      toast.warning('يرجى اختيار منتجات للحذف');
      return;
    }
    
    if (window.confirm(`هل أنت متأكد من حذف ${selectedRows.length} منتج؟`)) {
      try {
        await Promise.all(selectedRows.map(id => productService.delete(id)));
        setProducts(products.filter(product => !selectedRows.includes(product._id)));
        setSelectedRows([]);
        toast.success(`تم حذف ${selectedRows.length} منتج بنجاح`);
      } catch (error) {
        toast.error('حدث خطأ أثناء حذف المنتجات');
      }
    }
  };

  // ... Add variant CRUD logic here (API calls, forms, etc.)

  // DataGrid columns
  const columns = [
    { field: 'imageCover', headerName: 'الصورة', width: 100, renderCell: (params) => (
      <img src={params.value} alt={params.row.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 12 }} />
    ) },
    { field: 'name', headerName: 'اسم المنتج', width: 180 },
    { field: 'brand', headerName: 'الماركة', width: 120 },
    { field: 'category', headerName: 'التصنيف', width: 120, valueGetter: (params) => categories.find(cat => cat._id === params.value)?.name || '' },
    { field: 'price', headerName: 'السعر', width: 100, valueFormatter: (params) => params.value ? `₪ ${params.value}` : '-' },
    { field: 'stock', headerName: 'المخزون', width: 100 },
    { field: 'hasVariants', headerName: 'متغيرات', width: 100, renderCell: (params) => params.value ? <Chip label="نعم" color="primary" /> : <Chip label="لا" color="default" /> },
    {
      field: 'actions',
      headerName: 'الإجراءات',
      width: 200,
      renderCell: (params) => (
        <Box>
          <Tooltip title="عرض التفاصيل">
            <IconButton color="info" onClick={() => handleView(params.row)}><VisibilityIcon /></IconButton>
          </Tooltip>
          <Tooltip title="تعديل المنتج">
            <IconButton color="primary" onClick={() => handleEdit(params.row)}><EditIcon /></IconButton>
          </Tooltip>
          <Tooltip title="حذف المنتج">
            <IconButton color="error" onClick={() => handleDelete(params.row._id)}><DeleteIcon /></IconButton>
          </Tooltip>
          {params.row.hasVariants && (
            <Tooltip title="إدارة المتغيرات">
              <IconButton color="secondary" onClick={() => handleOpenVariant(params.row)}><AddCircleOutlineIcon /></IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress color="error" />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" sx={{ color: '#ff1744', fontWeight: 900, letterSpacing: 1 }}>
          المنتجات
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {selectedRows.length > 0 && (
            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={handleBulkDelete}
              sx={{ color: '#ff1744', borderColor: '#ff1744', fontWeight: 700 }}
            >
              حذف المحدد ({selectedRows.length})
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
            sx={{ background: 'linear-gradient(135deg, #ff1744 0%, #ff616f 100%)', color: '#fff', fontWeight: 700, borderRadius: 3, boxShadow: '0 4px 16px 0 rgba(255,0,0,0.15)', '&:hover': { background: '#ff1744' } }}
          >
            إضافة منتج
          </Button>
        </Box>
      </Box>
      <Paper sx={{ p: 2, borderRadius: 4, boxShadow: '0 8px 32px 0 rgba(255,0,0,0.10)', background: 'linear-gradient(135deg, #fff 60%, #ffebee 100%)', mb: 2 }}>
        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={products}
            columns={columns}
            getRowId={row => row._id}
            pageSize={10}
            rowsPerPageOptions={[10]}
            checkboxSelection
            disableRowSelectionOnClick={false}
            onRowSelectionModelChange={(newSelection) => {
              setSelectedRows(newSelection);
            }}
            rowSelectionModel={selectedRows}
            sx={{ 
              background: 'transparent', 
              borderRadius: 3, 
              fontWeight: 600, 
              boxShadow: 'none', 
              '& .MuiDataGrid-columnHeaders': { 
                background: '#ffebee', 
                color: '#ff1744', 
                fontWeight: 900, 
                fontSize: 18 
              }, 
              '& .MuiDataGrid-row:hover': { 
                background: '#ffebee', 
                transition: 'background 0.3s' 
              },
              '& .MuiDataGrid-row.Mui-selected': {
                background: '#ffebee !important',
              },
              '& .MuiDataGrid-row.Mui-selected:hover': {
                background: '#ffcdd2 !important',
              }
            }}
          />
        </div>
      </Paper>
      {/* Product Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth dir="rtl">
        <DialogTitle sx={{ color: '#ff1744', fontWeight: 900, letterSpacing: 1, textAlign: 'center', fontSize: 26 }}>
          {selectedProduct ? 'تعديل منتج' : 'إضافة منتج جديد'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ p: 4, background: '#fff', borderRadius: 3, boxShadow: '0 8px 32px 0 rgba(255,0,0,0.10)' }}>
         
            <Grid container spacing={3}>
              {/* الصف الأول: الاسم - الماركة - التصنيف */}
              <Grid item xs={12} md={4}>
                <TextField
                  autoFocus
                  name="name"
                  label={<span>اسم المنتج <span style={{color:'red'}}>*</span></span>}
                  fullWidth
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                  helperText="أدخل اسم المنتج بشكل واضح"
                  sx={{ height: 56 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  name="brand"
                  label={<span>الماركة <span style={{color:'red'}}>*</span></span>}
                  fullWidth
                  value={formData.brand}
                  onChange={e => setFormData({ ...formData, brand: e.target.value })}
                  required
                  helperText="مثال: سامسونج، أبل ..."
                  sx={{ height: 56 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth required sx={{ height: 56, minWidth: 200 }}>
                  <InputLabel><span>التصنيف <span style={{color:'red'}}>*</span></span></InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    label="التصنيف"
                    sx={{ minWidth: 200 }}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>{category.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* الصف الثاني: الوصف */}
              <Grid item xs={12} md={12}>
                <TextField
                  name="description"
                  label={<span>الوصف <span style={{color:'red'}}>*</span></span>}
                  fullWidth
                  multiline
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  required
                  helperText="صف المنتج بشكل مختصر وجذاب"
                  sx={{ height: 56 }}
                />
              </Grid>
              <Divider sx={{ width: '100%', my: 2 }} />
              {/* الصف الثالث: صورة الغلاف - زر الصور */}
              <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<ImageIcon sx={{ fontSize: 28 }} />}
                  sx={{ color: '#ff1744', borderColor: '#ff1744', fontWeight: 700, fontSize: 18, px: 3, py: 1.5, width: '100%', height: 56 }}
                >
                  اختر صورة الغلاف
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleCoverImageChange}
                  />
                </Button>
              </Grid>
              <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<ImageIcon sx={{ fontSize: 28 }} />}
                  sx={{ color: '#ff1744', borderColor: '#ff1744', fontWeight: 700, fontSize: 18, px: 3, py: 1.5, width: '100%', height: 56 }}
                >
                  إضافة صور متعددة
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={handleImagesChange}
                  />
                </Button>
              </Grid>
              <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {imagePreview && (
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ display: 'block', mb: 1, color: '#ff1744', fontWeight: 600 }}>
                      معاينة صورة الغلاف
                    </Typography>
                    <img 
                      src={imagePreview} 
                      alt="معاينة صورة الغلاف" 
                      style={{ 
                        width: 80, 
                        height: 80, 
                        objectFit: 'cover', 
                        borderRadius: 8,
                        border: '2px solid #ff1744'
                      }} 
                    />
                  </Box>
                )}
              </Grid>
             
              {/* الصف الرابع: صور المنتج */}
              <Grid item xs={12}>
                <ImageList cols={4} rowHeight={100} sx={{ mb: 2 }}>
                  {images.map((img, idx) => (
                    <ImageListItem key={idx} sx={{ borderRadius: '50%', overflow: 'hidden', position: 'relative' }}>
                      <img src={img.url || img} alt="صورة المنتج" style={{ borderRadius: '50%', objectFit: 'cover', width: '100%', height: '100%' }} />
                      <ImageListItemBar
                        sx={{ background: 'rgba(0,0,0,0.3)', borderRadius: '0 0 50% 50%' }}
                        actionIcon={
                          <IconButton sx={{ color: 'white', background: '#ff1744', m: 0.5 }} onClick={() => handleRemoveImage(idx)}>
                            <DeleteIcon />
                          </IconButton>
                        }
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Grid>
              <Divider sx={{ width: '100%', my: 2 }} />
              {/* الصف الخامس: السعر - المخزون - SKU */}
              {!formData.hasVariants && (
                <>
                  <Grid item xs={12} md={4}>
                    <TextField
                      name="price"
                      label={<span>السعر <span style={{color:'red'}}>*</span></span>}
                      type="number"
                      fullWidth
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: e.target.value })}
                      required
                      helperText="سعر المنتج بالشيكل"
                      sx={{ height: 56 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      name="stock"
                      label={<span>المخزون <span style={{color:'red'}}>*</span></span>}
                      type="number"
                      fullWidth
                      value={formData.stock}
                      onChange={e => setFormData({ ...formData, stock: e.target.value })}
                      required
                      helperText="عدد القطع المتوفرة في المخزون"
                      sx={{ height: 56 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      name="sku"
                      label={<span>SKU <span style={{color:'red'}}>*</span></span>}
                      fullWidth
                      value={formData.sku}
                      onChange={e => setFormData({ ...formData, sku: e.target.value })}
                      required
                      helperText="رمز المنتج SKU (فريد)"
                      sx={{ height: 56 }}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
            <Button onClick={handleClose} sx={{ color: '#ff1744', fontWeight: 700, fontSize: 18, px: 4 }}>إلغاء</Button>
            <Button type="submit" variant="contained" sx={{ background: 'linear-gradient(135deg, #ff1744 0%, #ff616f 100%)', color: '#fff', fontWeight: 900, px: 6, borderRadius: 2, fontSize: 20, boxShadow: '0 4px 16px 0 rgba(255,0,0,0.15)' }}>
              {selectedProduct ? 'تحديث' : 'إضافة'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      {/* Product View Dialog */}
      <Dialog open={openView} onClose={handleCloseView} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: '#ff1744', fontWeight: 900, letterSpacing: 1 }}>تفاصيل المنتج</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <Box>
              <Typography variant="h6">{selectedProduct.name}</Typography>
              <Typography>الوصف: {selectedProduct.description}</Typography>
              <Typography>الماركة: {selectedProduct.brand}</Typography>
              <Typography>التصنيف: {categories.find(cat => cat._id === selectedProduct.category)?.name || ''}</Typography>
              <Typography>السعر: {selectedProduct.price ? `₪ ${selectedProduct.price}` : '-'}</Typography>
              <Typography>المخزون: {selectedProduct.stock}</Typography>
              <Typography>SKU: {selectedProduct.sku}</Typography>
              <img src={selectedProduct.imageCover} alt={selectedProduct.name} style={{ width: 120, marginTop: 10, borderRadius: 8 }} />
              {selectedProduct.hasVariants && (
                <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>المتغيرات</AccordionSummary>
                  <AccordionDetails>
                    {/* TODO: List variants here */}
                    <Typography>قريباً: عرض المتغيرات</Typography>
                  </AccordionDetails>
                </Accordion>
              )}
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 700 }}>صور المنتج:</Typography>
              <ImageList cols={4} rowHeight={100}>
                {(selectedProduct.images || []).map((img, idx) => (
                  <ImageListItem key={idx}>
                    <img src={img.url || img} alt="صورة المنتج" style={{ borderRadius: 8, objectFit: 'cover', width: '100%', height: '100%' }} />
                  </ImageListItem>
                ))}
              </ImageList>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseView} sx={{ color: '#ff1744', fontWeight: 700 }}>إغلاق</Button>
        </DialogActions>
      </Dialog>
      {/* Variant Management Dialog (Modal) */}
      <Dialog open={openVariant} onClose={handleCloseVariant} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#ff1744', fontWeight: 900, letterSpacing: 1 }}>إدارة متغيرات المنتج</DialogTitle>
        <DialogContent>
          {/* TODO: Add variant CRUD UI here */}
          <Typography>قريباً: إدارة المتغيرات</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseVariant} sx={{ color: '#ff1744', fontWeight: 700 }}>إغلاق</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Products; 