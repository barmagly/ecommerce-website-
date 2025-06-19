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
  LocalOffer as LocalOfferIcon,
} from '@mui/icons-material';
import { fetchDashboardData } from '../store/slices/dashboardSlice';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const StatCard = ({ title, value, icon, color, onClick, gradient }) => (
  <motion.div
    whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
    whileTap={{ scale: 0.98 }}
    style={{ height: '100%' }}
    onClick={onClick}
  >
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: onClick ? 'pointer' : 'default',
        background: gradient || color + '15',
        boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
        border: `2px solid ${color}`,
        transition: 'all 0.3s',
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Box
            sx={{
              backgroundColor: color + '22',
              borderRadius: '50%',
              p: 1.5,
              ml: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 2px 8px ${color}33`,
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
  </motion.div>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  // بيانات الرسم البياني للمبيعات الشهرية
  const monthlySales = overview?.monthlySales || [
    { month: 'يناير', sales: 12000 },
    { month: 'فبراير', sales: 18000 },
    { month: 'مارس', sales: 15000 },
    { month: 'أبريل', sales: 21000 },
    { month: 'مايو', sales: 17000 },
    { month: 'يونيو', sales: 25000 },
    { month: 'يوليو', sales: 20000 },
    { month: 'أغسطس', sales: 22000 },
    { month: 'سبتمبر', sales: 19500 },
    { month: 'أكتوبر', sales: 23000 },
    { month: 'نوفمبر', sales: 24000 },
    { month: 'ديسمبر', sales: 26000 },
  ];

  // بيانات الرسم البياني الدائري لحالات الطلبات
  const orderStatusData = [
    { name: 'تم التوصيل', value: overview?.deliveredOrders || 120 },
    { name: 'في الإنتظار', value: overview?.pendingOrders || 30 },
    { name: 'ملغي', value: overview?.cancelledOrders || 10 },
    { name: 'تم الشحن', value: overview?.shippedOrders || 20 },
    { name: 'جاري المعالجة', value: overview?.processingOrders || 15 },
  ];
  const pieColors = ['#4caf50', '#ff9800', '#f44336', '#2196f3', '#ba68c8'];

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
            gradient="linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)"
            onClick={() => navigate('/admin/users')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="إجمالي الطلبات"
            value={overview?.totalOrders || 0}
            icon={<CartIcon sx={{ color: '#2e7d32' }} />}
            color="#2e7d32"
            gradient="linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)"
            onClick={() => navigate('/admin/orders')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="إجمالي المنتجات"
            value={overview?.totalProducts || 0}
            icon={<ProductsIcon sx={{ color: '#ed6c02' }} />}
            color="#ed6c02"
            gradient="linear-gradient(135deg, #ed6c02 0%, #ffb300 100%)"
            onClick={() => navigate('/admin/products')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="إجمالي المبيعات"
            value={formatCurrency(overview?.totalSales)}
            icon={<MoneyIcon sx={{ color: '#9c27b0' }} />}
            color="#9c27b0"
            gradient="linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)"
            onClick={() => navigate('/admin/orders')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="إجمالي المراجعات"
            value={overview?.totalReviews || 0}
            icon={<StarIcon sx={{ color: '#ff9800' }} />}
            color="#ff9800"
            gradient="linear-gradient(135deg, #ff9800 0%, #ffd54f 100%)"
            onClick={() => navigate('/admin/reviews')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="إجمالي الكوبونات"
            value={overview?.totalCoupons || 0}
            icon={<DiscountIcon sx={{ color: '#f44336' }} />}
            color="#f44336"
            gradient="linear-gradient(135deg, #f44336 0%, #ff8a65 100%)"
            onClick={() => navigate('/admin/coupons')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="إجمالي سلات التسوق"
            value={overview?.totalCarts || 0}
            icon={<TotalCartsIcon sx={{ color: '#607d8b' }} />}
            color="#607d8b"
            gradient="linear-gradient(135deg, #607d8b 0%, #90a4ae 100%)"
            onClick={() => navigate('/admin/carts')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="العروض والخصومات"
            value={overview?.totalOffers || 0}
            icon={<LocalOfferIcon sx={{ color: '#e91e63' }} />}
            color="#e91e63"
            gradient="linear-gradient(135deg, #e91e63 0%, #f06292 100%)"
            onClick={() => navigate('/admin/offers')}
          />
        </Grid>
      </Grid>
{/* Charts Section */}
<Grid container spacing={8} mt={8}>
        <Grid item xs={12} md={17}>
          <Box p={3} sx={{ background: 'white', borderRadius: 4, boxShadow: '0 4px 24px #0001', height: 350 ,width:400 }}>
            <Typography variant="h6" fontWeight={700} mb={2} color="primary">المبيعات الشهرية (ج.م)</Typography>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlySales} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <XAxis dataKey="month" fontSize={13} />
                <YAxis fontSize={13} />
                <Tooltip formatter={v => `${v} ج.م`} />
                <Bar dataKey="sales" fill="#1976d2" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
        <Grid item xs={12} md={5}>
          <Box p={3} sx={{ background: 'white', borderRadius: 4, boxShadow: '0 4px 24px #0001', height: 350,width:400 }}>
            <Typography variant="h6" fontWeight={700} mb={2} color="secondary">توزيع الطلبات حسب الحالة</Typography>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={orderStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {orderStatusData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={pieColors[idx % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={v => `${v} طلب`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Grid>
      {/* Recent Orders Table */}
      <Box mt={4}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontFamily: 'Cairo, sans-serif' }}>
          آخر الطلبات
        </Typography>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
          <TableContainer component={Paper} sx={{ boxShadow: '0 4px 24px #0001', borderRadius: 4 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: 'linear-gradient(90deg, #e3f2fd 0%, #fce4ec 100%)' }}>
                  <TableCell>الطلب #</TableCell>
                  <TableCell>المستخدم</TableCell>
                  <TableCell>المبلغ الكلي</TableCell>
                  <TableCell>الحالة</TableCell>
                  <TableCell>التاريخ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats?.recentOrders?.length > 0 ? (
                  stats.recentOrders.map((order, idx) => (
                    <motion.tr
                      key={order._id}
                      whileHover={{ scale: 1.01, backgroundColor: '#f8bbd0' }}
                      style={{ cursor: 'pointer', transition: 'all 0.2s', background: idx % 2 === 0 ? '#fafafa' : '#fce4ec' }}
                      onClick={() => navigate(`/admin/orders?id=${order._id}`)}
                    >
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
                    </motion.tr>
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
        </motion.div>
      </Box>

      {/* Top Products Table */}
      <Box mt={4}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontFamily: 'Cairo, sans-serif' }}>
          أكثر المنتجات مبيعًا
        </Typography>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
          <TableContainer component={Paper} sx={{ boxShadow: '0 4px 24px #0001', borderRadius: 4 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: 'linear-gradient(90deg, #fffde7 0%, #e1f5fe 100%)' }}>
                  <TableCell align='right' sx={{pr:4}}>المنتج</TableCell>
                  <TableCell>الفئة</TableCell>
                  <TableCell>المبيعات</TableCell>
                  <TableCell>الكمية المباعة</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats?.topProducts?.length > 0 ? (
                  stats.topProducts.map((product, idx) => (
                    <motion.tr
                      key={product._id}
                      whileHover={{ scale: 1.01, backgroundColor: '#ffe082' }}
                      style={{ cursor: 'pointer', transition: 'all 0.2s', background: idx % 2 === 0 ? '#fffde7' : '#e1f5fe' }}
                      onClick={() => navigate(`/admin/products?id=${product._id}`)}
                    >
                      <TableCell align='right' sx={{pr:4}}>
                        <Box display="flex" alignItems="center">
                          <Avatar src={product.imageCover} variant="rounded" sx={{ ml: 1 }} />
                          {product.name}
                        </Box>
                      </TableCell>
                      <TableCell>{product.category?.name || 'غير متاح'}</TableCell>
                      <TableCell>{formatCurrency(product.totalSales)}</TableCell>
                      <TableCell>{product.totalSold}</TableCell>
                    </motion.tr>
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
        </motion.div>
      </Box>

      

      {/* Add more sections/charts as needed */}
    </Box>
  );
};

export default Dashboard; 