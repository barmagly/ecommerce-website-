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
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
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
  Edit as EditIcon,
  DeleteForever as DeleteIcon,
  Email as EmailIcon,
  PictureAsPdf as PdfIcon,
  Print as PrintIcon,
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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData, fetchDashboardStats } from '../store/slices/dashboardSlice';

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
  const navigate = useNavigate();
  
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
          background: `linear-gradient(135deg, ${alpha(color, 0.12)} 0%, ${alpha(color, 0.03)} 100%)`,
          border: `1px solid ${alpha(color, 0.15)}`,
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: `0 8px 32px ${alpha(color, 0.08)}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: `0 12px 48px ${alpha(color, 0.15)}`,
            border: `1px solid ${alpha(color, 0.3)}`,
            background: `linear-gradient(135deg, ${alpha(color, 0.15)} 0%, ${alpha(color, 0.05)} 100%)`,
            transform: 'translateY(-8px)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
            animation: 'shimmer 2s infinite',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: -50,
            right: -50,
            width: 120,
            height: 120,
            background: `radial-gradient(circle, ${alpha(color, 0.08)} 0%, transparent 70%)`,
            borderRadius: '50%',
            animation: 'pulse 3s infinite',
          },
          '@keyframes shimmer': {
            '0%': {
              backgroundPosition: '-200% 0',
            },
            '100%': {
              backgroundPosition: '200% 0',
            },
          },
          '@keyframes pulse': {
            '0%': {
              transform: 'scale(1)',
              opacity: 0.5,
            },
            '50%': {
              transform: 'scale(1.1)',
              opacity: 0.8,
            },
            '100%': {
              transform: 'scale(1)',
              opacity: 0.5,
            },
          },
        }}
      >
        <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ flex: 1 }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
                whileHover={{ scale: 1.05 }}
              >
                <Typography 
                  variant="h3" 
                  fontWeight="bold" 
                  sx={{ 
                    mb: 1,
                    background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'gradient 3s ease infinite',
                    '@keyframes gradient': {
                      '0%': {
                        backgroundPosition: '0% 50%',
                      },
                      '50%': {
                        backgroundPosition: '100% 50%',
                      },
                      '100%': {
                        backgroundPosition: '0% 50%',
                      },
                    },
                  }}
                >
                  <AnimatedCounter value={value} />
                </Typography>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Typography 
                  variant="h6" 
                  color="text.primary" 
                  fontWeight={600} 
                  sx={{ mb: 0.5 }}
                >
                  {title}
                </Typography>
              </motion.div>
              {subtitle && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ opacity: 0.8 }}
                  >
                    {subtitle}
                  </Typography>
                </motion.div>
              )}
              {trend && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5 }}>
                    {trend === 'up' ? (
                      <TrendingUp sx={{ 
                        color: '#4caf50', 
                        fontSize: 18, 
                        mr: 0.5,
                        animation: 'bounce 1s infinite',
                        '@keyframes bounce': {
                          '0%, 100%': {
                            transform: 'translateY(0)',
                          },
                          '50%': {
                            transform: 'translateY(-3px)',
                          },
                        },
                      }} />
                    ) : (
                      <TrendingDown sx={{ 
                        color: '#f44336', 
                        fontSize: 18, 
                        mr: 0.5,
                        animation: 'bounce 1s infinite',
                        '@keyframes bounce': {
                          '0%, 100%': {
                            transform: 'translateY(0)',
                          },
                          '50%': {
                            transform: 'translateY(3px)',
                          },
                        },
                      }} />
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
                width: 70,
                height: 70,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${alpha(color, 0.12)} 0%, ${alpha(color, 0.03)} 100%)`,
                border: `2px solid ${alpha(color, 0.15)}`,
                color: color,
                boxShadow: `0 8px 25px ${alpha(color, 0.12)}`,
                '& svg': {
                  fontSize: 28,
                  filter: `drop-shadow(0 2px 8px ${alpha(color, 0.3)})`,
                  animation: 'float 3s ease-in-out infinite',
                  '@keyframes float': {
                    '0%, 100%': {
                      transform: 'translateY(0)',
                    },
                    '50%': {
                      transform: 'translateY(-5px)',
                    },
                  },
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { overview, stats, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
    dispatch(fetchDashboardStats());
  }, [dispatch]);

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

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // Use default data if stats is not available
  const salesData = stats?.salesData || [];
  const categoryData = stats?.categoryData || [];
  const recentOrders = stats?.recentOrders || [];
  const topProducts = stats?.topProducts || [];
  const performanceMetrics = stats?.performanceMetrics || [];

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 }, 
      width: '100%', 
      maxWidth: '100%',
      minHeight: 'calc(100vh - 64px)',
      boxSizing: 'border-box',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
      backdropFilter: 'blur(10px)',
      animation: 'backgroundShift 15s ease infinite',
      '@keyframes backgroundShift': {
        '0%': {
          backgroundPosition: '0% 50%',
        },
        '50%': {
          backgroundPosition: '100% 50%',
        },
        '100%': {
          backgroundPosition: '0% 50%',
        },
      },
    }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box sx={{ 
          mb: 4,
          p: 3,
          borderRadius: 4,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
          border: '1px solid rgba(255,255,255,0.8)',
          animation: 'headerGlow 3s ease-in-out infinite',
          '@keyframes headerGlow': {
            '0%, 100%': {
              boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
            },
            '50%': {
              boxShadow: '0 8px 32px rgba(26,35,126,0.1)',
            },
          },
        }}>
          {/* Primary Stats Cards */}
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: { xs: 2, md: 3 }, 
            mb: 4,
            '& > *': { 
              flex: '1 1 auto',
              minWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' }
            }
          }}>
            <Box onClick={() => navigate('/admin/users')} sx={{ cursor: 'pointer' }}>
              <StatsCard
                title="إجمالي المستخدمين"
                value={overview.totalUsers}
                icon={<UsersIcon sx={{ fontSize: 28 }} />}
                color="#1a237e"
                trend="up"
                trendValue={12.5}
                subtitle="العملاء النشطون"
              />
            </Box>
            <Box onClick={() => navigate('/admin/products')} sx={{ cursor: 'pointer' }}>
              <StatsCard
                title="المنتجات"
                value={overview.totalProducts}
                icon={<ProductsIcon sx={{ fontSize: 28 }} />}
                color="#0d47a1"
                trend="up"
                trendValue={8.2}
                subtitle="في المخزون"
              />
            </Box>
            <Box onClick={() => navigate('/admin/orders')} sx={{ cursor: 'pointer' }}>
              <StatsCard
                title="الطلبات"
                value={overview.totalOrders}
                icon={<OrdersIcon sx={{ fontSize: 28 }} />}
                color="#1565c0"
                trend="up"
                trendValue={15.3}
                subtitle="إجمالي الطلبات"
              />
            </Box>
            <Box onClick={() => navigate('/admin/categories')} sx={{ cursor: 'pointer' }}>
              <StatsCard
                title="الفئات"
                value={overview.totalCategories}
                icon={<CategoryIcon sx={{ fontSize: 28 }} />}
                color="#2196f3"
                subtitle="فئات المنتجات"
              />
            </Box>
            <Box onClick={() => navigate('/admin/coupons')} sx={{ cursor: 'pointer' }}>
              <StatsCard
                title="الكوبونات النشطة"
                value={overview.totalCoupons}
                icon={<CouponIcon sx={{ fontSize: 28 }} />}
                color="#42a5f5"
                subtitle="كوبونات الخصم"
              />
            </Box>
            <Box onClick={() => navigate('/admin/reviews')} sx={{ cursor: 'pointer' }}>
              <StatsCard
                title="المراجعات"
                value={overview.totalReviews}
                icon={<ReviewsIcon sx={{ fontSize: 28 }} />}
                color="#64b5f6"
                trend="up"
                trendValue={5.7}
                subtitle="مراجعات العملاء"
              />
            </Box>
            <Box onClick={() => navigate('/admin/carts')} sx={{ cursor: 'pointer' }}>
              <StatsCard
                title="عربات التسوق النشطة"
                value={overview.totalCarts}
                icon={<CartIcon sx={{ fontSize: 28 }} />}
                color="#90caf9"
                subtitle="عربات التسوق"
              />
            </Box>
            <Box onClick={() => navigate('/admin/variants')} sx={{ cursor: 'pointer' }}>
              <StatsCard
                title="خيارات المنتجات"
                value={overview.totalVariants}
                icon={<VariantIcon sx={{ fontSize: 28 }} />}
                color="#bbdefb"
                subtitle="خيارات المنتجات"
              />
            </Box>
          </Box>

          {/* Charts and Tables */}
          <Grid container spacing={3}>
            {/* Sales Chart */}
            <Grid item xs={12} md={8}>
              <ChartCard title="المبيعات والإيرادات">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stackId="1"
                      stroke="#8884d8"
                      fill="#8884d8"
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stackId="2"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>
            </Grid>

            {/* Category Distribution */}
            <Grid item xs={12} md={4}>
              <ChartCard title="توزيع الفئات">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </Grid>

            {/* Recent Orders */}
            <Grid item xs={12} md={6}>
              <ChartCard title="آخر الطلبات">
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>الطلب</TableCell>
                        <TableCell>العميل</TableCell>
                        <TableCell>المبلغ</TableCell>
                        <TableCell>الحالة</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>{order.id}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>${order.total}</TableCell>
                          <TableCell>
                            <StatusBadge status={order.status} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ChartCard>
            </Grid>

            {/* Top Products */}
            <Grid item xs={12} md={6}>
              <ChartCard title="المنتجات الأكثر مبيعاً">
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>المنتج</TableCell>
                        <TableCell>المبيعات</TableCell>
                        <TableCell>الإيرادات</TableCell>
                        <TableCell>المخزون</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topProducts.map((product) => (
                        <TableRow key={product.name}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.sales}</TableCell>
                          <TableCell>${product.revenue}</TableCell>
                          <TableCell>{product.stock}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ChartCard>
            </Grid>
          </Grid>
        </Box>
      </motion.div>
    </Box>
  );
};

export default Dashboard;
