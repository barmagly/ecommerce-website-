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
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { productService, categoryService } from '../services/api';
import AOS from 'aos';
import 'aos/dist/aos.css';

const mockProducts = [
  {
    id: 1,
    name: 'سماعة بلوتوث لاسلكية',
    description: 'سماعة عالية الجودة مع عزل ضوضاء.',
    price: 100,
    categoryId: 1,
    stock: 15,
    image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/ov6dm6mj_expires_30_days.png',
  },
  {
    id: 2,
    name: 'لوحة مفاتيح ميكانيكية',
    description: 'لوحة مفاتيح بإضاءة RGB.',
    price: 250,
    categoryId: 2,
    stock: 8,
    image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/i9a16i3f_expires_30_days.png',
  },
  {
    id: 3,
    name: 'كرسي ألعاب مريح',
    description: 'كرسي مريح مع دعم للظهر.',
    price: 500,
    categoryId: 3,
    stock: 3,
    image: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/ml7dbshd_expires_30_days.png',
  },
];

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    stock: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

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
      setProducts(productsResponse.data.length ? productsResponse.data : mockProducts);
      setCategories(categoriesResponse.data.length ? categoriesResponse.data : [
        { id: 1, name: 'إلكترونيات' },
        { id: 2, name: 'ملحقات' },
        { id: 3, name: 'أثاث' },
      ]);
    } catch (error) {
      setProducts(mockProducts);
      setCategories([
        { id: 1, name: 'إلكترونيات' },
        { id: 2, name: 'ملحقات' },
        { id: 3, name: 'أثاث' },
      ]);
      console.error('Error fetching data:', error);
      toast.error('حدث خطأ أثناء تحميل البيانات، تم عرض بيانات وهمية');
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
      price: '',
      categoryId: '',
      stock: '',
      image: null,
    });
    setImagePreview(null);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
    setImagePreview(null);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId,
      stock: product.stock,
      image: null,
    });
    setImagePreview(product.image);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      try {
        await productService.delete(id);
        setProducts(products.filter((product) => product.id !== id));
        toast.success('تم حذف المنتج بنجاح');
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('حدث خطأ أثناء حذف المنتج');
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = selectedProduct?.image;

      if (formData.image) {
        // يمكنك إضافة رفع صورة حقيقي هنا إذا أردت
        imageUrl = imagePreview;
      }

      const productData = {
        ...formData,
        image: imageUrl,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };

      if (selectedProduct) {
        const response = await productService.update(selectedProduct.id, productData);
        setProducts(
          products.map((product) =>
            product.id === selectedProduct.id ? response.data : product
          )
        );
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const columns = [
    { field: 'id', headerName: 'الرقم', width: 90 },
    {
      field: 'image',
      headerName: 'الصورة',
      width: 100,
      renderCell: (params) => (
        <img
          src={params.value}
          alt={params.row.name}
          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 12, boxShadow: '0 2px 8px #ff174455' }}
          data-aos="zoom-in"
        />
      ),
    },
    { field: 'name', headerName: 'اسم المنتج', width: 200 },
    { field: 'description', headerName: 'الوصف', width: 300 },
    {
      field: 'price',
      headerName: 'السعر',
      width: 130,
      valueFormatter: (params) => `₪ ${params.value}`,
    },
    {
      field: 'categoryId',
      headerName: 'التصنيف',
      width: 150,
      valueGetter: (params) =>
        categories.find((cat) => cat.id === params.value)?.name || '',
    },
    {
      field: 'stock',
      headerName: 'المخزون',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value > 0 ? 'success' : 'error'}
          size="small"
          sx={{ fontWeight: 700 }}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'الإجراءات',
      width: 150,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            onClick={() => handleEdit(params.row)}
            size="small"
            data-aos="fade-left"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row.id)}
            size="small"
            data-aos="fade-left"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
          sx={{
            background: 'linear-gradient(135deg, #ff1744 0%, #ff616f 100%)',
            color: '#fff',
            fontWeight: 700,
            borderRadius: 3,
            boxShadow: '0 4px 16px 0 rgba(255,0,0,0.15)',
            '&:hover': { background: '#ff1744' },
          }}
          data-aos="fade-left"
        >
          إضافة منتج
        </Button>
      </Box>

      <Paper
        data-aos="zoom-in-up"
        sx={{
          p: 2,
          borderRadius: 4,
          boxShadow: '0 8px 32px 0 rgba(255,0,0,0.10)',
          background: 'linear-gradient(135deg, #fff 60%, #ffebee 100%)',
          mb: 2,
        }}
      >
        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={products}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            disableSelectionOnClick
            sx={{
              background: 'transparent',
              borderRadius: 3,
              fontWeight: 600,
              boxShadow: 'none',
              '& .MuiDataGrid-columnHeaders': {
                background: '#ffebee',
                color: '#ff1744',
                fontWeight: 900,
                fontSize: 18,
              },
              '& .MuiDataGrid-row:hover': {
                background: '#ffebee',
                transition: 'background 0.3s',
              },
            }}
          />
        </div>
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: '#ff1744', fontWeight: 900, letterSpacing: 1 }}>
          {selectedProduct ? 'تعديل منتج' : 'إضافة منتج جديد'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  autoFocus
                  name="name"
                  label="اسم المنتج"
                  fullWidth
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="price"
                  label="السعر"
                  type="number"
                  fullWidth
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="stock"
                  label="المخزون"
                  type="number"
                  fullWidth
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>التصنيف</InputLabel>
                  <Select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    label="التصنيف"
                    required
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
                <TextField
                  name="description"
                  label="الوصف"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <input
                  accept="image/*"
                  type="file"
                  id="image-upload"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<ImageIcon />}
                    sx={{ color: '#ff1744', borderColor: '#ff1744', fontWeight: 700 }}
                  >
                    {imagePreview ? 'تغيير الصورة' : 'إضافة صورة'}
                  </Button>
                </label>
                {imagePreview && (
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="Preview"
                    sx={{
                      width: 100,
                      height: 100,
                      objectFit: 'cover',
                      ml: 2,
                      border: '2px solid #ff1744',
                      borderRadius: 2,
                      boxShadow: '0 2px 8px #ff174455',
                    }}
                  />
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} sx={{ color: '#ff1744', fontWeight: 700 }}>إلغاء</Button>
            <Button type="submit" variant="contained" sx={{ background: 'linear-gradient(135deg, #ff1744 0%, #ff616f 100%)', color: '#fff', fontWeight: 700 }}>
              {selectedProduct ? 'تحديث' : 'إضافة'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default Products; 