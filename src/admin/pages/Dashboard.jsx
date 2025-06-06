import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  CircularProgress,
  Alert,
  Tooltip,
  useTheme,
  alpha,
  Paper,
} from '@mui/material';
import {
  People as UsersIcon,
  ShoppingCart as OrdersIcon,
  Inventory as ProductsIcon,
  Category as CategoryIcon,
  LocalOffer as CouponIcon,
  Reviews as ReviewsIcon,
  ShoppingBag as CartIcon,
  TrendingUp,
  TrendingDown,
  AttachMoney,
  Visibility,
  MoreVert,
  Refresh,
  Analytics,
  DateRange,
  CheckCircle,
  Schedule,
  Info,
  Timeline,
  Error as ErrorIcon,
  Palette as VariantIcon,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
} from 'recharts';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

// Mock data for Arabic dashboard
const salesData = [
  { month: 'يناير', sales: 4000, orders: 240, revenue: 3400, users: 120 },
  { month: 'فبراير', sales: 3000, orders: 180, revenue: 2800, users: 98 },
  { month: 'مارس', sales: 5000, orders: 300, revenue: 4200, users: 156 },
  { month: 'أبريل', sales: 4500, orders: 280, revenue: 3900, users: 134 },
  { month: 'مايو', sales: 6000, orders: 350, revenue: 5100, users: 178 },
  { month: 'يونيو', sales: 5500, orders: 320, revenue: 4800, users: 162 },
];

const categoryData = [
  { name: 'إلكترونيات', value: 35, color: '#FF6B6B' },
  { name: 'ملابس', value: 25, color: '#4ECDC4' },
  { name: 'كتب', value: 20, color: '#45B7D1' },
  { name: 'منزل وحديقة', value: 15, color: '#96CEB4' },
  { name: 'رياضة', value: 5, color: '#FFEAA7' },
];

const recentOrders = [
  { id: '001', customer: 'أحمد محمد', total: 299.99, status: 'مكتمل', date: '2024-01-15' },
  { id: '002', customer: 'فاطمة علي', total: 159.50, status: 'معلق', date: '2024-01-15' },
  { id: '003', customer: 'محمد حسن', total: 449.99, status: 'مشحون', date: '2024-01-14' },
  { id: '004', customer: 'سارة أحمد', total: 89.99, status: 'قيد المعالجة', date: '2024-01-14' },
  { id: '005', customer: 'عمر خالد', total: 199.99, status: 'مكتمل', date: '2024-01-13' },
];

const topProducts = [
  { name: 'iPhone 15', sales: 1250, revenue: 1249900, stock: 45 },
  { name: 'Samsung TV', sales: 890, revenue: 445000, stock: 23 },
  { name: 'MacBook Pro', sales: 567, revenue: 1134000, stock: 15 },
  { name: 'AirPods Pro', sales: 2340, revenue: 584900, stock: 78 },
  { name: 'iPad Air', sales: 876, revenue: 525600, stock: 32 },
];

const performanceMetrics = [
  { subject: 'المبيعات', A: 90, fullMark: 100 },
  { subject: 'الطلبات', A: 85, fullMark: 100 },
  { subject: 'المستخدمين', A: 88, fullMark: 100 },
  { subject: 'الإيرادات', A: 92, fullMark: 100 },
  { subject: 'المنتجات', A: 78, fullMark: 100 },
  { subject: 'المراجعات', A: 95, fullMark: 100 },
];

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const startValue = 0;
    const endValue = parseInt(value);

    const animate = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * (endValue - startValue) + startValue));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
};

// Stats Card Component
const StatsCard = ({ title, value, icon, color, trend, trendValue, subtitle }) => {
  const theme = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card
        sx={{
          height: '100%',
          background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
          border: `1px solid ${alpha(color, 0.2)}`,
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: color,
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" color={color}>
                <AnimatedCounter value={value} />
              </Typography>
              <Typography variant="h6" color="text.primary" fontWeight={600}>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
              {trend && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  {trend === 'up' ? (
                    <TrendingUp sx={{ color: '#4caf50', fontSize: 16, mr: 0.5 }} />
                  ) : (
                    <TrendingDown sx={{ color: '#f44336', fontSize: 16, mr: 0.5 }} />
                  )}
                  <Typography 
                    variant="caption" 
                    color={trend === 'up' ? '#4caf50' : '#f44336'}
                    fontWeight={600}
                  >
                    {trendValue}% مقارنة بالشهر الماضي
                  </Typography>
                </Box>
              )}
            </Box>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: alpha(color, 0.1),
                color: color,
                border: `2px solid ${alpha(color, 0.2)}`,
              }}
            >
              {icon}
            </Avatar>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Chart Card Component
const ChartCard = ({ title, children, height = 300, actions }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              {title}
            </Typography>
            {actions && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {actions}
              </Box>
            )}
          </Box>
          <Box sx={{ height }}>
            {children}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'مكتمل':
        return { color: 'success', icon: <CheckCircle sx={{ fontSize: 14 }} /> };
      case 'معلق':
        return { color: 'warning', icon: <Schedule sx={{ fontSize: 14 }} /> };
      case 'مشحون':
        return { color: 'info', icon: <Info sx={{ fontSize: 14 }} /> };
      case 'قيد المعالجة':
        return { color: 'primary', icon: <Timeline sx={{ fontSize: 14 }} /> };
      case 'ملغي':
        return { color: 'error', icon: <ErrorIcon sx={{ fontSize: 14 }} /> };
      default:
        return { color: 'default', icon: null };
    }
  };

  const config = getStatusConfig(status);
  
  return (
    <Chip
      label={status}
      color={config.color}
      variant="filled"
      size="small"
      icon={config.icon}
      sx={{ 
        fontWeight: 600,
        fontSize: '0.75rem'
      }}
    />
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCategories: 0,
    totalCoupons: 0,
    totalReviews: 0,
    totalCarts: 0,
    totalVariants: 0,
  });

  // Simulate loading and fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Simulate API calls to all endpoints
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock data based on backend endpoints
        setDashboardData({
          totalUsers: 12847,
          totalProducts: 1256,
          totalOrders: 8934,
          totalRevenue: 2847293,
          totalCategories: 24,
          totalCoupons: 18,
          totalReviews: 4562,
          totalCarts: 234,
          totalVariants: 892,
        });
        
        toast.success('تم تحميل بيانات لوحة التحكم بنجاح!');
      } catch (error) {
        toast.error('فشل في تحميل بيانات لوحة التحكم');
        console.error('Dashboard error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="70vh"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">
          جاري تحميل لوحة التحكم...
        </Typography>
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
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                نظرة عامة على لوحة التحكم
              </Typography>
              <Typography variant="body1" color="text.secondary">
                مرحباً بك! إليك ما يحدث في متجرك
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<DateRange />}
              >
                هذا الشهر
              </Button>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={() => window.location.reload()}
              >
                تحديث
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Primary Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="إجمالي المستخدمين"
              value={dashboardData.totalUsers}
              icon={<UsersIcon sx={{ fontSize: 28 }} />}
              color="#667eea"
              trend="up"
              trendValue={12.5}
              subtitle="العملاء النشطون"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="المنتجات"
              value={dashboardData.totalProducts}
              icon={<ProductsIcon sx={{ fontSize: 28 }} />}
              color="#4facfe"
              trend="up"
              trendValue={8.2}
              subtitle="في المخزون"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="الطلبات"
              value={dashboardData.totalOrders}
              icon={<OrdersIcon sx={{ fontSize: 28 }} />}
              color="#fa709a"
              trend="up"
              trendValue={15.3}
              subtitle="إجمالي الطلبات"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="الإيرادات"
              value={`$${(dashboardData.totalRevenue / 1000).toFixed(0)}K`}
              icon={<AttachMoney sx={{ fontSize: 28 }} />}
              color="#96CEB4"
              trend="up"
              trendValue={23.1}
              subtitle="إجمالي الإيرادات"
            />
          </Grid>
        </Grid>

        {/* Secondary Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatsCard
              title="الفئات"
              value={dashboardData.totalCategories}
              icon={<CategoryIcon sx={{ fontSize: 28 }} />}
              color="#ff9a9e"
              subtitle="فئات المنتجات"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatsCard
              title="الكوبونات النشطة"
              value={dashboardData.totalCoupons}
              icon={<CouponIcon sx={{ fontSize: 28 }} />}
              color="#a8edea"
              subtitle="كوبونات الخصم"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatsCard
              title="المراجعات"
              value={dashboardData.totalReviews}
              icon={<ReviewsIcon sx={{ fontSize: 28 }} />}
              color="#ffeaa7"
              trend="up"
              trendValue={5.7}
              subtitle="مراجعات العملاء"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatsCard
              title="عربات التسوق النشطة"
              value={dashboardData.totalCarts}
              icon={<CartIcon sx={{ fontSize: 28 }} />}
              color="#fd79a8"
              subtitle="عربات التسوق"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatsCard
              title="خيارات المنتجات"
              value={dashboardData.totalVariants}
              icon={<VariantIcon sx={{ fontSize: 28 }} />}
              color="#7b1fa2"
              subtitle="خيارات المنتجات"
            />
          </Grid>
        </Grid>

        {/* Charts Row */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Sales Trend */}
          <Grid item xs={12} lg={8}>
            <ChartCard
              title="اتجاه المبيعات والإيرادات"
              height={400}
              actions={[
                <Tooltip title="التحليلات">
                  <IconButton size="small">
                    <Analytics />
                  </IconButton>
                </Tooltip>
              ]}
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.primary, 0.1)} />
                  <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
                  <YAxis stroke={theme.palette.text.secondary} />
                  <RechartsTooltip 
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 8,
                    }}
                  />
                  <Legend />
                  <Bar dataKey="orders" fill="#667eea" name="الطلبات" radius={[4, 4, 0, 0]} />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    fill="url(#salesGradient)" 
                    stroke="#4facfe" 
                    name="المبيعات"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#fa709a" 
                    strokeWidth={3}
                    name="الإيرادات"
                    dot={{ fill: '#fa709a', strokeWidth: 2, r: 6 }}
                  />
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4facfe" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4facfe" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                </ComposedChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>

          {/* Category Distribution */}
          <Grid item xs={12} lg={4}>
            <ChartCard title="توزيع الفئات" height={400}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 8,
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
        </Grid>

        {/* Performance Radar and Recent Activity */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Performance Metrics */}
          <Grid item xs={12} md={6}>
            <ChartCard title="مقاييس الأداء" height={350}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={performanceMetrics}>
                  <PolarGrid stroke={alpha(theme.palette.text.primary, 0.1)} />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={{ fontSize: 10 }}
                  />
                  <Radar
                    name="الأداء"
                    dataKey="A"
                    stroke="#667eea"
                    fill="#667eea"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <RechartsTooltip 
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 8,
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>

          {/* Top Products */}
          <Grid item xs={12} md={6}>
            <ChartCard title="المنتجات الأكثر مبيعاً" height={350}>
              <List sx={{ maxHeight: 320, overflow: 'auto' }}>
                {topProducts.map((product, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: categoryData[index % categoryData.length]?.color || '#667eea',
                          fontWeight: 'bold',
                        }}
                      >
                        #{index + 1}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" fontWeight={600}>
                          {product.name}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            المبيعات: {product.sales} • الإيرادات: ${product.revenue.toLocaleString()}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <Typography variant="caption" sx={{ mr: 1 }}>
                              المخزون:
                            </Typography>
                            <Chip
                              label={product.stock}
                              size="small"
                              color={product.stock > 50 ? 'success' : product.stock > 20 ? 'warning' : 'error'}
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </ChartCard>
          </Grid>
        </Grid>

        {/* Recent Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, pb: 0 }}>
                <Typography variant="h6" fontWeight="bold">
                  الطلبات الحديثة
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  أحدث طلبات العملاء وحالتها
                </Typography>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>رقم الطلب</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>العميل</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>الإجمالي</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>الحالة</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>التاريخ</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>الإجراءات</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow 
                        key={order.id}
                        sx={{ '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) } }}
                      >
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight={600}>
                            #{order.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ width: 32, height: 32, mr: 2, fontSize: 14 }}>
                              {order.customer.split(' ').map(n => n[0]).join('')}
                            </Avatar>
                            <Typography variant="body2">
                              {order.customer}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight={600}>
                            ${order.total}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={order.status} />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(order.date).toLocaleDateString('ar-SA')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Tooltip title="عرض التفاصيل">
                            <IconButton size="small">
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="المزيد من الإجراءات">
                            <IconButton size="small">
                              <MoreVert fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </Box>
  );
};

export default Dashboard;
