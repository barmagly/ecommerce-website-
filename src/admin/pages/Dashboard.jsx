import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
} from '@mui/material';
import {
  People as PeopleIcon,
  ShoppingCart as CartIcon,
  Inventory as ProductsIcon,
  AttachMoney as MoneyIcon,
  Star as StarIcon,
  Discount as DiscountIcon,
  ShoppingBag as TotalCartsIcon,
  AccessTime as AccessTimeIcon,
  BarChart as BarChartIcon,
} from '@mui/icons-material';
import { fetchDashboardData } from '../store/slices/dashboardSlice';

const StatCard = ({ title, value, icon, color }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
    <CardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <Box
          sx={{
            backgroundColor: `${color}15`,
            borderRadius: '50%',
            p: 1,
            ml: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" color="text.secondary">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" fontWeight="bold">
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { overview, stats, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  console.log('Dashboard overview data:', overview);
  console.log('Dashboard stats data:', stats);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const formatCurrency = (amount) => {
    return `ج.م ${amount?.toLocaleString() || 0}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <Box p={3}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontFamily: 'Cairo, sans-serif' }}>
        لوحة التحكم
      </Typography>
      
      {/* Dashboard Metrics Cards */}
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="إجمالي المستخدمين"
            value={overview?.totalUsers || 0}
            icon={<PeopleIcon sx={{ color: '#1976d2' }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="إجمالي الطلبات"
            value={overview?.totalOrders || 0}
            icon={<CartIcon sx={{ color: '#2e7d32' }} />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="إجمالي المنتجات"
            value={overview?.totalProducts || 0}
            icon={<ProductsIcon sx={{ color: '#ed6c02' }} />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="إجمالي المبيعات"
            value={formatCurrency(overview?.totalSales)}
            icon={<MoneyIcon sx={{ color: '#9c27b0' }} />}
            color="#9c27b0"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="إجمالي المراجعات"
            value={overview?.totalReviews || 0}
            icon={<StarIcon sx={{ color: '#ff9800' }} />}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="إجمالي الكوبونات"
            value={overview?.totalCoupons || 0}
            icon={<DiscountIcon sx={{ color: '#f44336' }} />}
            color="#f44336"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="إجمالي سلات التسوق"
            value={overview?.totalCarts || 0}
            icon={<TotalCartsIcon sx={{ color: '#607d8b' }} />}
            color="#607d8b"
          />
        </Grid>
        {/* Add more cards as needed */}
      </Grid>

      {/* Recent Orders Table */}
      <Box mt={4}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontFamily: 'Cairo, sans-serif' }}>
          آخر الطلبات
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>الطلب #</TableCell>
                <TableCell>المستخدم</TableCell>
                <TableCell>المبلغ الكلي</TableCell>
                <TableCell>الحالة</TableCell>
                <TableCell>التاريخ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stats?.recentOrders?.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order._id.slice(-6)}</TableCell>
                    <TableCell>{order.user?.name || 'غير متاح'}</TableCell>
                    <TableCell>{formatCurrency(order.total)}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status === 'delivered' ? 'تم التوصيل' : order.status === 'pending' ? 'في الإنتظار' : order.status === 'cancelled' ? 'ملغي' : order.status === 'shipped' ? 'تم الشحن' : order.status === 'processing' ? 'جاري المعالجة' : order.status}
                        color={order.status === 'delivered' ? 'success' : order.status === 'pending' ? 'warning' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center' }}>
                    لا توجد طلبات حديثة
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Top Products Table */}
      <Box mt={4}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontFamily: 'Cairo, sans-serif' }}>
          أكثر المنتجات مبيعًا
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align='right' sx={{pr:4}}>المنتج</TableCell>
                <TableCell>الفئة</TableCell>
                <TableCell>المبيعات</TableCell>
                <TableCell>الكمية المباعة</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stats?.topProducts?.length > 0 ? (
                stats.topProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar src={product.imageCover} variant="rounded" sx={{ ml: 1 }} />
                        {product.name}
                      </Box>
                    </TableCell>
                    <TableCell>{product.category?.name || 'غير متاح'}</TableCell>
                    <TableCell>{formatCurrency(product.totalSales)}</TableCell>
                    <TableCell>{product.totalSold}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: 'center' }}>
                    لا توجد منتجات مبيعًا
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Add more sections/charts as needed */}
    </Box>
  );
};

export default Dashboard; 