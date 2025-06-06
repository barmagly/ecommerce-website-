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
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.3, type: "spring", stiffness: 200 }
      }}
    >
      <Card
        sx={{
          height: '100%',
          background: `linear-gradient(135deg, ${alpha(color, 0.15)} 0%, ${alpha(color, 0.05)} 100%)`,
          border: `2px solid ${alpha(color, 0.2)}`,
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: `0 8px 40px ${alpha(color, 0.12)}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: `0 12px 60px ${alpha(color, 0.2)}`,
            border: `2px solid ${alpha(color, 0.4)}`,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: `linear-gradient(90deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: -50,
            right: -50,
            width: 100,
            height: 100,
            background: `radial-gradient(circle, ${alpha(color, 0.1)} 0%, transparent 70%)`,
            borderRadius: '50%',
          }
        }}
      >
        <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ flex: 1 }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
              >
                <Typography variant="h3" fontWeight="bold" color={color} sx={{ mb: 1 }}>
                  <AnimatedCounter value={value} />
                </Typography>
              </motion.div>
              <Typography variant="h6" color="text.primary" fontWeight={700} sx={{ mb: 0.5 }}>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8 }}>
                  {subtitle}
                </Typography>
              )}
              {trend && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5 }}>
                    {trend === 'up' ? (
                      <TrendingUp sx={{ color: '#4caf50', fontSize: 18, mr: 0.5 }} />
                    ) : (
                      <TrendingDown sx={{ color: '#f44336', fontSize: 18, mr: 0.5 }} />
                    )}
                    <Typography 
                      variant="body2" 
                      fontWeight="bold"
                      color={trend === 'up' ? '#4caf50' : '#f44336'}
                    >
                      {trendValue}% مقارنة بالشهر الماضي
                    </Typography>
                  </Box>
                </motion.div>
              )}
            </Box>
            
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
              whileHover={{ 
                scale: 1.1, 
                rotate: 5,
                transition: { duration: 0.2 }
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: 85,
                height: 85,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${alpha(color, 0.15)} 0%, ${alpha(color, 0.05)} 100%)`,
                border: `3px solid ${alpha(color, 0.2)}`,
                color: color,
                boxShadow: `0 8px 25px ${alpha(color, 0.15)}`,
                '& svg': {
                  fontSize: 32,
                  filter: `drop-shadow(0 2px 8px ${alpha(color, 0.3)})`,
                }
              }}>
                {icon}
              </Box>
            </motion.div>
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
      whileHover={{ 
        y: -3,
        transition: { duration: 0.2 }
      }}
    >
      <Card
        sx={{
          borderRadius: 4,
          border: '2px solid',
          borderColor: 'divider',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 12px 48px rgba(0,0,0,0.12)',
            borderColor: 'primary.main',
          }
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {title}
            </Typography>
            {actions && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {actions}
              </Box>
            )}
          </Box>
                     <Box sx={{ 
             height, 
             width: '100%',
             '& .recharts-wrapper': {
               width: '100% !important',
               maxWidth: '100% !important',
             },
             '& .recharts-responsive-container': {
               width: '100% !important',
               maxWidth: '100% !important',
             }
           }}>
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
    <Box sx={{ 
      p: { xs: 2, md: 3 }, 
      width: '100%', 
      maxWidth: '100%',
      minHeight: 'calc(100vh - 64px)',
      boxSizing: 'border-box'
    }}>
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
         <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4, width: '100%', margin: 0 }}>
          <Grid item xs={12}>
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
          <Grid item xs={12}>
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
          <Grid item xs={12}>
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
          <Grid item xs={12}>
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
         <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4, width: '100%', margin: 0 }}>
          <Grid item xs={12}>
            <StatsCard
              title="الفئات"
              value={dashboardData.totalCategories}
              icon={<CategoryIcon sx={{ fontSize: 28 }} />}
              color="#ff9a9e"
              subtitle="فئات المنتجات"
            />
          </Grid>
          <Grid item xs={12}>
            <StatsCard
              title="الكوبونات النشطة"
              value={dashboardData.totalCoupons}
              icon={<CouponIcon sx={{ fontSize: 28 }} />}
              color="#a8edea"
              subtitle="كوبونات الخصم"
            />
          </Grid>
          <Grid item xs={12}>
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
          <Grid item xs={12}>
            <StatsCard
              title="عربات التسوق النشطة"
              value={dashboardData.totalCarts}
              icon={<CartIcon sx={{ fontSize: 28 }} />}
              color="#fd79a8"
              subtitle="عربات التسوق"
            />
          </Grid>
          <Grid item xs={12}>
            <StatsCard
              title="خيارات المنتجات"
              value={dashboardData.totalVariants}
              icon={<VariantIcon sx={{ fontSize: 28 }} />}
              color="#7b1fa2"
              subtitle="خيارات المنتجات"
            />
          </Grid>
        </Grid>

                 {/* Sales Trend Chart - Full Width */}
         <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4, width: '100%', margin: 0 }}>
          <Grid item xs={12}>
            <ChartCard
              title="اتجاه المبيعات والإيرادات"
              height={450}
              actions={[
                <Tooltip title="التحليلات">
                  <IconButton size="small">
                    <Analytics />
                  </IconButton>
                </Tooltip>
              ]}
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
        </Grid>

                 {/* Category Distribution Chart - Full Width */}
                 <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4, width: '100%', margin: 0 }}>
                   <Grid item xs={12}>
                     <ChartCard title="توزيع الفئات" height={400}>
                       <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                           <Pie
                             data={categoryData}
                             cx="50%"
                             cy="50%"
                             innerRadius={60}
                             outerRadius={140}
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

                 {/* Performance Metrics Chart - Full Width */}
                 <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4, width: '100%', margin: 0 }}>
                   <Grid item xs={12}>
                     <ChartCard title="مقاييس الأداء" height={400}>
                       <ResponsiveContainer width="100%" height="100%">
                         <RadarChart data={performanceMetrics} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
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
                 </Grid>

                 {/* Top Products - Full Width */}
         <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4, width: '100%', margin: 0 }}>
          <Grid item xs={12}>
            <ChartCard title="المنتجات الأكثر مبيعاً" height={400}>
              <Grid container spacing={2}>
                {topProducts.map((product, index) => (
                  <Grid item xs={12} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <Card sx={{ 
                        height: '100%', 
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: alpha(categoryData[index % categoryData.length]?.color || '#667eea', 0.2),
                        background: `linear-gradient(135deg, ${alpha(categoryData[index % categoryData.length]?.color || '#667eea', 0.05)} 0%, transparent 100%)`,
                        '&:hover': {
                          boxShadow: `0 8px 25px ${alpha(categoryData[index % categoryData.length]?.color || '#667eea', 0.15)}`,
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease'
                      }}>
                        <CardContent sx={{ p: 2.5, textAlign: 'center' }}>
                          <Avatar
                            sx={{
                              width: 50,
                              height: 50,
                              bgcolor: categoryData[index % categoryData.length]?.color || '#667eea',
                              fontWeight: 'bold',
                              mx: 'auto',
                              mb: 2,
                              fontSize: '1.2rem'
                            }}
                          >
                            #{index + 1}
                          </Avatar>
                          <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                            {product.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            المبيعات: {product.sales.toLocaleString()}
                          </Typography>
                          <Typography variant="subtitle2" color="primary" fontWeight={600} sx={{ mb: 1 }}>
                            ${product.revenue.toLocaleString()}
                          </Typography>
                          <Chip
                            label={`مخزون: ${product.stock}`}
                            size="small"
                            color={product.stock > 50 ? 'success' : product.stock > 20 ? 'warning' : 'error'}
                            variant="outlined"
                            sx={{ fontSize: '0.75rem' }}
                          />
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </ChartCard>
          </Grid>
        </Grid>

        {/* Recent Orders Table - Full Width */}
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4, width: '100%', margin: 0 }}>
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
          <Card sx={{ 
            borderRadius: 4, 
            border: '2px solid', 
            borderColor: 'divider',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
            backdropFilter: 'blur(10px)',
          }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 4, pb: 2 }}>
                <Typography variant="h5" fontWeight="bold" sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}>
                  الطلبات الحديثة
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  أحدث طلبات العملاء وحالتها
                </Typography>
              </Box>
              <TableContainer sx={{ 
                maxHeight: 500, 
                '&::-webkit-scrollbar': {
                  width: 8,
                },
                '&::-webkit-scrollbar-track': {
                  background: alpha('#000', 0.05),
                  borderRadius: 4,
                },
                '&::-webkit-scrollbar-thumb': {
                  background: alpha('#000', 0.2),
                  borderRadius: 4,
                  '&:hover': {
                    background: alpha('#000', 0.3),
                  }
                }
              }}>
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
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default Dashboard;
