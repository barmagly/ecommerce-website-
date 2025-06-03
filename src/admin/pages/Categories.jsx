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
  CircularProgress,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon,
  ShoppingCart as ProductIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { categoryService } from '../services/api';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Mock data for demonstration
const mockCategories = [
  {
    id: 1,
    name: 'إلكترونيات',
    description: 'الهواتف الذكية والأجهزة اللوحية والحواسيب',
    productsCount: 25,
    totalSales: 45000,
    growth: 15,
  },
  {
    id: 2,
    name: 'ملابس',
    description: 'ملابس رجالية ونسائية وأطفال',
    productsCount: 40,
    totalSales: 35000,
    growth: 8,
  },
  {
    id: 3,
    name: 'أثاث',
    description: 'أثاث منزلي ومكتبي',
    productsCount: 15,
    totalSales: 28000,
    growth: 12,
  },
  {
    id: 4,
    name: 'مستلزمات',
    description: 'مستلزمات منزلية متنوعة',
    productsCount: 30,
    totalSales: 22000,
    growth: -5,
  },
];

const COLORS = ['#2193b0', '#6dd5ed', '#00b09b', '#96c93d'];

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    AOS.init({ duration: 900, once: true });
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAll();
      // Use mock data if no data is returned
      setCategories(response.data.length ? response.data : mockCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories(mockCategories);
      toast.error('حدث خطأ أثناء تحميل التصنيفات، تم عرض بيانات وهمية');
    } finally {
      setLoading(false);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
    setSelectedCategory(null);
    setFormData({
      name: '',
      description: '',
    });
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCategory(null);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا التصنيف؟')) {
      try {
        await categoryService.delete(id);
        setCategories(categories.filter((category) => category.id !== id));
        toast.success('تم حذف التصنيف بنجاح');
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('حدث خطأ أثناء حذف التصنيف');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCategory) {
        const response = await categoryService.update(selectedCategory.id, formData);
        setCategories(
          categories.map((category) =>
            category.id === selectedCategory.id ? response.data : category
          )
        );
        toast.success('تم تحديث التصنيف بنجاح');
      } else {
        const response = await categoryService.create(formData);
        setCategories([...categories, response.data]);
        toast.success('تم إضافة التصنيف بنجاح');
      }
      handleClose();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('حدث خطأ أثناء حفظ التصنيف');
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
    { field: 'name', headerName: 'اسم التصنيف', width: 200 },
    { field: 'description', headerName: 'الوصف', width: 300 },
    {
      field: 'productsCount',
      headerName: 'عدد المنتجات',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color="primary"
          size="small"
          sx={{
            bgcolor: 'rgba(33,147,176,0.1)',
            color: '#2193b0',
            fontWeight: 700,
          }}
        />
      ),
    },
    {
      field: 'totalSales',
      headerName: 'إجمالي المبيعات',
      width: 150,
      renderCell: (params) => (
        <Typography sx={{ color: '#2193b0', fontWeight: 700 }}>
          ₪ {params.value.toLocaleString()}
        </Typography>
      ),
    },
    {
      field: 'growth',
      headerName: 'النمو',
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {params.value > 0 ? (
            <TrendingUpIcon sx={{ color: '#00b09b', mr: 1 }} />
          ) : (
            <TrendingUpIcon sx={{ color: '#ff1744', mr: 1, transform: 'rotate(180deg)' }} />
          )}
          <Typography
            sx={{
              color: params.value > 0 ? '#00b09b' : '#ff1744',
              fontWeight: 700,
            }}
          >
            {params.value}%
          </Typography>
        </Box>
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
            sx={{ color: '#2193b0' }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row.id)}
            size="small"
            sx={{ color: '#ff1744' }}
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
        <CircularProgress sx={{ color: '#2193b0' }} />
      </Box>
    );
  }

  // Prepare data for charts
  const salesData = categories.map(cat => ({
    name: cat.name,
    value: cat.totalSales
  }));

  const productsData = categories.map(cat => ({
    name: cat.name,
    products: cat.productsCount
  }));

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#2193b0', fontWeight: 900, letterSpacing: 1 }}>
          التصنيفات
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
          sx={{
            background: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
            borderRadius: 2,
            boxShadow: '0 4px 16px 0 rgba(33,147,176,0.2)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1c7a94 0%, #5ab8d9 100%)',
            },
          }}
        >
          إضافة تصنيف
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              bgcolor: 'rgba(33,147,176,0.1)',
              borderRadius: 4,
              boxShadow: '0 4px 16px 0 rgba(33,147,176,0.1)',
            }}
            data-aos="fade-up"
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CategoryIcon sx={{ color: '#2193b0', mr: 1 }} />
                <Typography variant="h6" sx={{ color: '#2193b0' }}>
                  إجمالي التصنيفات
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ color: '#2193b0', fontWeight: 900 }}>
                {categories.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              bgcolor: 'rgba(0,176,155,0.1)',
              borderRadius: 4,
              boxShadow: '0 4px 16px 0 rgba(0,176,155,0.1)',
            }}
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ProductIcon sx={{ color: '#00b09b', mr: 1 }} />
                <Typography variant="h6" sx={{ color: '#00b09b' }}>
                  إجمالي المنتجات
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ color: '#00b09b', fontWeight: 900 }}>
                {categories.reduce((sum, cat) => sum + cat.productsCount, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              bgcolor: 'rgba(150,201,61,0.1)',
              borderRadius: 4,
              boxShadow: '0 4px 16px 0 rgba(150,201,61,0.1)',
            }}
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ color: '#96c93d', mr: 1 }} />
                <Typography variant="h6" sx={{ color: '#96c93d' }}>
                  متوسط النمو
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ color: '#96c93d', fontWeight: 900 }}>
                {Math.round(
                  categories.reduce((sum, cat) => sum + cat.growth, 0) / categories.length
                )}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              boxShadow: '0 4px 16px 0 rgba(33,147,176,0.1)',
            }}
            data-aos="zoom-in-up"
          >
            <Typography variant="h6" sx={{ color: '#2193b0', mb: 2 }}>
              توزيع المبيعات حسب التصنيف
            </Typography>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={salesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {salesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              boxShadow: '0 4px 16px 0 rgba(33,147,176,0.1)',
            }}
            data-aos="zoom-in-up"
          >
            <Typography variant="h6" sx={{ color: '#2193b0', mb: 2 }}>
              عدد المنتجات في كل تصنيف
            </Typography>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={productsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="products" fill="#2193b0" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Paper>
        </Grid>

        {/* DataGrid */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              boxShadow: '0 4px 16px 0 rgba(33,147,176,0.1)',
            }}
            data-aos="fade-up"
          >
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={categories}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                sx={{
                  border: 'none',
                  '& .MuiDataGrid-columnHeaders': {
                    bgcolor: 'rgba(33,147,176,0.1)',
                    color: '#2193b0',
                    fontWeight: 700,
                  },
                  '& .MuiDataGrid-row:hover': {
                    bgcolor: 'rgba(33,147,176,0.05)',
                  },
                }}
              />
            </div>
          </Paper>
        </Grid>
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
          },
        }}
      >
        <DialogTitle sx={{ color: '#2193b0', fontWeight: 700 }}>
          {selectedCategory ? 'تعديل تصنيف' : 'إضافة تصنيف جديد'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="اسم التصنيف"
              type="text"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              required
              sx={{
                '& label.Mui-focused': {
                  color: '#2193b0',
                },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#2193b0',
                  },
                },
              }}
            />
            <TextField
              margin="dense"
              name="description"
              label="الوصف"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={handleChange}
              required
              sx={{
                '& label.Mui-focused': {
                  color: '#2193b0',
                },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#2193b0',
                  },
                },
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={handleClose}
              sx={{
                color: '#2193b0',
                '&:hover': {
                  bgcolor: 'rgba(33,147,176,0.1)',
                },
              }}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1c7a94 0%, #5ab8d9 100%)',
                },
              }}
            >
              {selectedCategory ? 'تحديث' : 'إضافة'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default Categories; 