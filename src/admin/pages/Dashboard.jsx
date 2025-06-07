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
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('هذا الشهر');
  const [dateDialogOpen, setDateDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);

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
        
        // Dashboard loaded successfully - no need for toast notification
      } catch (error) {
        toast.error('فشل في تحميل بيانات لوحة التحكم');
        console.error('Dashboard error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Action handlers (mock logic)
  const handleMenuClick = (event, order) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedOrder(order);
    setSelectedOrderId(order.id);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedOrder(null);
    setSelectedOrderId(null);
  };
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
  };
  const handleEditOrder = () => {
    toast.info('تعديل الطلب (تجريبي)');
    handleMenuClose();
  };
  const handleUpdateOrderStatus = (status) => {
    toast.success(`تم تحديث حالة الطلب إلى: ${status}`);
    handleMenuClose();
  };
  const handlePrintInvoice = () => {
    toast.info('طباعة الفاتورة (تجريبي)');
    handleMenuClose();
  };
  const handleExportPDF = () => {
    toast.info('تصدير PDF (تجريبي)');
    handleMenuClose();
  };
  const handleSendEmail = () => {
    toast.info('إرسال إيميل للعميل (تجريبي)');
    handleMenuClose();
  };
  const handleDeleteOrder = () => {
    toast.error('تم حذف الطلب (تجريبي)');
    handleMenuClose();
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };
  const handleFilterSelect = (option) => {
    if (option === 'تحديد تاريخ...') {
      setDateDialogOpen(true);
    } else {
      setSelectedFilter(option);
    }
    setFilterAnchorEl(null);
  };
  const handleDateDialogClose = () => {
    setDateDialogOpen(false);
  };
  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
  };
  const handleDateRangeApply = () => {
    if (dateRange[0] && dateRange[1]) {
      setSelectedFilter(`${dayjs(dateRange[0]).format('YYYY/MM/DD')} - ${dayjs(dateRange[1]).format('YYYY/MM/DD')}`);
    }
    setDateDialogOpen(false);
  };

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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Typography 
                  variant="h4" 
                  fontWeight="bold" 
                  gutterBottom
                  sx={{
                    background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'titleGradient 3s ease infinite',
                    '@keyframes titleGradient': {
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
                  نظرة عامة على لوحة التحكم
                </Typography>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Typography variant="body1" color="text.secondary">
                  مرحباً بك! إليك ما يحدث في متجرك
                </Typography>
              </motion.div>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outlined"
                  startIcon={<DateRange />}
                  onClick={handleFilterClick}
                  sx={{
                    borderColor: 'rgba(0,0,0,0.1)',
                    '&:hover': {
                      borderColor: 'primary.main',
                      background: 'rgba(0,0,0,0.02)',
                    }
                  }}
                >
                  {selectedFilter}
                </Button>
                <Menu
                  anchorEl={filterAnchorEl}
                  open={Boolean(filterAnchorEl)}
                  onClose={handleFilterClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <MenuItem onClick={() => handleFilterSelect('اليوم')}>اليوم</MenuItem>
                  <MenuItem onClick={() => handleFilterSelect('هذا الأسبوع')}>هذا الأسبوع</MenuItem>
                  <MenuItem onClick={() => handleFilterSelect('هذا الشهر')}>هذا الشهر</MenuItem>
                  <MenuItem onClick={() => handleFilterSelect('تحديد تاريخ...')}>تحديد تاريخ...</MenuItem>
                </Menu>
                <Dialog open={dateDialogOpen} onClose={handleDateDialogClose}>
                  <DialogTitle>تحديد الفترة</DialogTitle>
                  <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ar-sa">
                      <Stack direction="row" spacing={2}>
                        <DatePicker
                          label="من"
                          value={dateRange[0]}
                          onChange={date => setDateRange([date, dateRange[1]])}
                          renderInput={(params) => <TextField {...params} />}
                        />
                        <DatePicker
                          label="إلى"
                          value={dateRange[1]}
                          onChange={date => setDateRange([dateRange[0], date])}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </Stack>
                    </LocalizationProvider>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleDateDialogClose}>إلغاء</Button>
                    <Button onClick={handleDateRangeApply} variant="contained">تطبيق</Button>
                  </DialogActions>
                </Dialog>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outlined"
                  startIcon={<Analytics />}
                  onClick={() => {
                    const dataStr = JSON.stringify(dashboardData, null, 2);
                    const dataBlob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.json`;
                    link.click();
                    toast.success('تم تصدير البيانات بنجاح');
                  }}
                  sx={{
                    borderColor: 'rgba(0,0,0,0.1)',
                    '&:hover': {
                      borderColor: 'primary.main',
                      background: 'rgba(0,0,0,0.02)',
                    }
                  }}
                >
                  تصدير البيانات
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  startIcon={<Refresh />}
                  onClick={() => {
                    window.location.reload();
                    toast.success('جاري تحديث البيانات...');
                  }}
                  sx={{
                    background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
                    boxShadow: '0 4px 20px rgba(26,35,126,0.2)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
                      boxShadow: '0 6px 25px rgba(26,35,126,0.3)',
                    }
                  }}
                >
                  تحديث
                </Button>
              </motion.div>
            </Box>
          </Box>
        </Box>

        {/* Primary Stats Cards - Flex Layout */}
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
          <StatsCard
            title="إجمالي المستخدمين"
            value={dashboardData.totalUsers}
            icon={<UsersIcon sx={{ fontSize: 28 }} />}
            color="#1a237e"
            trend="up"
            trendValue={12.5}
            subtitle="العملاء النشطون"
          />
          <StatsCard
            title="المنتجات"
            value={dashboardData.totalProducts}
            icon={<ProductsIcon sx={{ fontSize: 28 }} />}
            color="#0d47a1"
            trend="up"
            trendValue={8.2}
            subtitle="في المخزون"
          />
          <StatsCard
            title="الطلبات"
            value={dashboardData.totalOrders}
            icon={<OrdersIcon sx={{ fontSize: 28 }} />}
            color="#1565c0"
            trend="up"
            trendValue={15.3}
            subtitle="إجمالي الطلبات"
          />
          <StatsCard
            title="الإيرادات"
            value={`$${(dashboardData.totalRevenue / 1000).toFixed(0)}K`}
            icon={<AttachMoney sx={{ fontSize: 28 }} />}
            color="#1976d2"
            trend="up"
            trendValue={23.1}
            subtitle="إجمالي الإيرادات"
          />
        </Box>

        {/* Secondary Stats - Flex Layout */}
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: { xs: 2, md: 3 }, 
          mb: 4,
          '& > *': { 
            flex: '1 1 auto',
            minWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(20% - 14.4px)' }
          }
        }}>
          <StatsCard
            title="الفئات"
            value={dashboardData.totalCategories}
            icon={<CategoryIcon sx={{ fontSize: 28 }} />}
            color="#2196f3"
            subtitle="فئات المنتجات"
          />
          <StatsCard
            title="الكوبونات النشطة"
            value={dashboardData.totalCoupons}
            icon={<CouponIcon sx={{ fontSize: 28 }} />}
            color="#42a5f5"
            subtitle="كوبونات الخصم"
          />
          <StatsCard
            title="المراجعات"
            value={dashboardData.totalReviews}
            icon={<ReviewsIcon sx={{ fontSize: 28 }} />}
            color="#64b5f6"
            trend="up"
            trendValue={5.7}
            subtitle="مراجعات العملاء"
          />
          <StatsCard
            title="عربات التسوق النشطة"
            value={dashboardData.totalCarts}
            icon={<CartIcon sx={{ fontSize: 28 }} />}
            color="#90caf9"
            subtitle="عربات التسوق"
          />
          <StatsCard
            title="خيارات المنتجات"
            value={dashboardData.totalVariants}
            icon={<VariantIcon sx={{ fontSize: 28 }} />}
            color="#bbdefb"
            subtitle="خيارات المنتجات"
          />
        </Box>
      </motion.div>
    </Box>
  );
};

export default Dashboard;
