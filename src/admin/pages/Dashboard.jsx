import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  IconButton,
  Menu,
  Card,
  CardContent,
  LinearProgress,
  TextField,
  InputAdornment,
  Chip,
  Tooltip,
  ButtonGroup,
  Button,
} from '@mui/material';
import {
  ShoppingCart as OrdersIcon,
  AttachMoney as SalesIcon,
  People as UsersIcon,
  Category as ProductsIcon,
  ArrowUpward,
  ArrowDownward,
  Dashboard as DashboardIcon,
  MoreVert as MoreVertIcon,
  TrendingUp,
  Search as SearchIcon,
  Inventory as StockIcon,
  LocalOffer as OffersIcon,
  Star as RatingIcon,
  Timeline as TrendIcon,
  CalendarToday as CalendarIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Home as HomeIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { dashboardService } from '../services/api';
import { toast } from 'react-toastify';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { darkModeColors, lightModeColors } from '../theme/darkModeColors';
import { useDarkMode } from '../context/DarkModeContext';
import { useNavigate } from 'react-router-dom';
import TestEndpointsButton from '../components/TestEndpointsButton';

// Add new mock data for additional charts
const performanceMetrics = [
  { subject: 'رضا العملاء', A: 90, fullMark: 100 },
  { subject: 'معدل التسليم', A: 85, fullMark: 100 },
  { subject: 'جودة المنتجات', A: 95, fullMark: 100 },
  { subject: 'دعم العملاء', A: 88, fullMark: 100 },
  { subject: 'سرعة الشحن', A: 92, fullMark: 100 },
];

const monthlyStats = [
  { month: 'يناير', مبيعات: 4000, طلبات: 24, عائد: 3400 },
  { month: 'فبراير', مبيعات: 3000, طلبات: 18, عائد: 2800 },
  { month: 'مارس', مبيعات: 2000, طلبات: 15, عائد: 1900 },
  { month: 'أبريل', مبيعات: 2780, طلبات: 20, عائد: 2600 },
  { month: 'مايو', مبيعات: 1890, طلبات: 14, عائد: 1700 },
  { month: 'يونيو', مبيعات: 2390, طلبات: 17, عائد: 2100 },
];

const categoryData = [
  { name: 'ملابس', value: 30 },
  { name: 'إلكترونيات', value: 25 },
  { name: 'أثاث', value: 20 },
  { name: 'مستلزمات', value: 15 },
  { name: 'أخرى', value: 10 },
];

const COLORS = ['#1e88e5', '#43a047', '#fb8c00', '#e53935', '#8e24aa'];

const gradients = {
  blue: 'linear-gradient(45deg, #1e88e5 30%, #1976d2 90%)',
  green: 'linear-gradient(45deg, #43a047 30%, #388e3c 90%)',
  orange: 'linear-gradient(45deg, #fb8c00 30%, #f57c00 90%)',
  red: 'linear-gradient(45deg, #e53935 30%, #d32f2f 90%)',
  purple: 'linear-gradient(45deg, #8e24aa 30%, #7b1fa2 90%)',
  teal: 'linear-gradient(45deg, #00897b 30%, #00796b 90%)',
};

const darkModeStyles = {
  background: {
    main: '#0A0A0A',
    paper: '#121212',
    card: '#1A1A1A',
    hover: '#202020'
  },
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.7)',
    muted: 'rgba(255, 255, 255, 0.5)'
  },
  border: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.15)'
  },
  chart: {
    background: 'rgba(255, 255, 255, 0.05)',
    gridLines: 'rgba(255, 255, 255, 0.1)',
    text: 'rgba(255, 255, 255, 0.7)'
  }
};

const StatCard = ({ title, value, icon, color, trend, percentage, darkMode }) => {
  const colors = darkMode ? darkModeColors : lightModeColors;
  const bg = darkMode
    ? `linear-gradient(135deg, ${colors.background.card} 60%, ${color}22 100%)`
    : `${color}10`;
  const hoverBg = darkMode
    ? `linear-gradient(135deg, ${colors.background.cardHover} 60%, ${color}33 100%)`
    : `${color}22`;
  return (
    <Paper
      sx={{
        p: 2,
        height: '100%',
        background: bg,
        color: colors.text.primary,
        borderRadius: 2,
        border: `1px solid ${colors.border.light}`,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-3px)',
          background: hoverBg,
          boxShadow: `0 8px 20px ${color}22`,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: darkMode ? 'rgba(255, 255, 255, 0.1)' : `${color}15`,
            color: color,
            mr: 1,
          }}
        >
          {icon}
        </Avatar>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            color: colors.text.secondary,
            fontWeight: 500 
          }}
        >
          {title}
        </Typography>
      </Box>
      <Typography 
        variant="h5" 
        sx={{ 
          fontWeight: 700, 
          color: color,
          mb: 0.5,
        }}
      >
        {value}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {trend === 'up' ? (
          <ArrowUpward sx={{ fontSize: 16, color: colors.stats.up }} />
        ) : (
          <ArrowDownward sx={{ fontSize: 16, color: colors.stats.down }} />
        )}
        <Typography 
          variant="caption" 
          sx={{ 
            color: trend === 'up' ? colors.stats.up : colors.stats.down,
            fontWeight: 500 
          }}
        >
          {percentage}%
        </Typography>
      </Box>
    </Paper>
  );
};

const ChartCard = ({ title, chart, gradient, aos, delay }) => (
  <Paper
    data-aos={aos}
    data-aos-delay={delay}
    sx={{
      p: 3,
      borderRadius: 4,
      background: '#fff',
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 40px 0 rgba(0,0,0,0.15)',
      },
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      <IconButton size="small">
        <MoreVertIcon />
      </IconButton>
    </Box>
    {chart}
  </Paper>
);

const ProgressCard = ({ title, value, max, color, aos, delay }) => (
  <Paper
    data-aos={aos}
    data-aos-delay={delay}
    sx={{
      p: 3,
      borderRadius: 4,
      background: '#fff',
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 40px 0 rgba(0,0,0,0.15)',
      },
    }}
  >
    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
      {title}
    </Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <Box sx={{ flexGrow: 1, mr: 2 }}>
        <LinearProgress
          variant="determinate"
          value={(value / max) * 100}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: `${color}22`,
            '& .MuiLinearProgress-bar': {
              backgroundColor: color,
            },
          }}
        />
      </Box>
      <Typography variant="body2" sx={{ fontWeight: 700, color }}>
        {value}/{max}
      </Typography>
    </Box>
  </Paper>
);

const StatMiniCard = ({ title, value, icon, color, trend, percentage, darkMode }) => (
  <Paper
    sx={{
      p: 2,
      height: '100%',
      background: darkMode 
        ? `linear-gradient(135deg, ${darkModeColors.background.card} 60%, ${color}22 100%)`
        : `${color}10`,
      borderRadius: 2,
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s ease-in-out',
      border: darkMode ? `1px solid ${darkModeColors.border.light}` : 'none',
      color: darkMode ? darkModeColors.text.primary : 'inherit',
      '&:hover': {
        transform: 'translateY(-3px)',
        background: darkMode 
          ? `linear-gradient(135deg, ${darkModeColors.background.cardHover} 60%, ${color}33 100%)`
          : `${color}22`,
        boxShadow: darkMode 
          ? `0 8px 20px ${color}22`
          : `0 8px 20px ${color}22`,
      },
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <Avatar
        sx={{
          width: 40,
          height: 40,
          bgcolor: darkMode ? 'rgba(255, 255, 255, 0.1)' : color,
          color: darkMode ? color : 'white',
          mr: 1,
        }}
      >
        {icon}
      </Avatar>
      <Typography 
        variant="subtitle2" 
        sx={{ 
          color: darkMode ? darkModeColors.text.secondary : 'text.secondary',
          fontWeight: 500 
        }}
      >
        {title}
      </Typography>
    </Box>
    <Typography 
      variant="h5" 
      sx={{ 
        fontWeight: 700, 
        color: darkMode ? color : color,
        mb: 0.5,
        textShadow: darkMode ? `0 0 20px ${color}33` : 'none',
      }}
    >
      {value}
    </Typography>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {trend === 'up' ? (
        <ArrowUpward sx={{ fontSize: 16, color: darkMode ? darkModeColors.stats.up : '#4caf50' }} />
      ) : (
        <ArrowDownward sx={{ fontSize: 16, color: darkMode ? darkModeColors.stats.down : '#f44336' }} />
      )}
      <Typography 
        variant="caption" 
        sx={{ 
          color: trend === 'up' 
            ? (darkMode ? darkModeColors.stats.up : '#4caf50')
            : (darkMode ? darkModeColors.stats.down : '#f44336'),
          fontWeight: 500 
        }}
      >
        {percentage}%
      </Typography>
    </Box>
  </Paper>
);

function Dashboard() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalSales: 0
  });
  const [salesData, setSalesData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [period, setPeriod] = useState('week');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('week');

  const colors = darkMode ? darkModeColors : lightModeColors;

  useEffect(() => {
    AOS.init({ duration: 900, once: true });
    fetchDashboardData();
  }, [period]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      if (!token) {
        alert('يجب تسجيل الدخول أولاً لاختبار نقاط النهاية');
        return;
      }
      const [statsResponse, salesResponse, ordersResponse] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getSalesChart(period),
        dashboardService.getRecentOrders(),
      ]);
      
      // Ensure data is properly structured
      setStats(statsResponse?.data || {
        totalProducts: 0,
        totalCategories: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalSales: 0
      });
      setSalesData(Array.isArray(salesResponse?.data) ? salesResponse.data : []);
      setRecentOrders(Array.isArray(ordersResponse?.data) ? ordersResponse.data : []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('حدث خطأ أثناء تحميل البيانات');
      
      // Set fallback data on error
      setStats({
        totalProducts: 0,
        totalCategories: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalSales: 0
      });
      setSalesData([]);
      setRecentOrders([]);
    } finally {
      setLoading(false);
    }
  };

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
    <Box sx={{ 
      py: 3,
      minHeight: '100vh',
      background: colors.background.default,
      color: colors.text.primary,
      width: '100%',
      maxWidth: 'none',
      mx: 0,
    }}>
      {/* Insert the TestEndpointsButton at the top */}
      <TestEndpointsButton />
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <Typography variant="h4" sx={{ 
              color: colors.text.primary,
              fontWeight: 900,
              fontSize: '2.2rem',
              textShadow: darkMode 
                ? '2px 2px 4px rgba(255,23,68,0.4)'
                : '2px 2px 4px rgba(255,23,68,0.2)'
            }}>
              لوحة التحكم
            </Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              justifyContent: 'flex-end',
              alignItems: 'center',
              '& .MuiTextField-root': {
                bgcolor: colors.background.paper,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: colors.border.light,
                  },
                  '&:hover fieldset': {
                    borderColor: colors.border.medium,
                  },
                },
                '& .MuiInputBase-input': {
                  color: colors.text.primary,
                },
                '& .MuiInputLabel-root': {
                  color: colors.text.secondary,
                },
              }
            }}>
              {/* زر الصفحة الرئيسية */}
              <Tooltip title="الصفحة الرئيسية">
                <IconButton onClick={() => navigate('/')} color="primary">
                  <HomeIcon />
                </IconButton>
              </Tooltip>
              {/* زر الوضع الليلي */}
              <Tooltip title={darkMode ? "الوضع النهاري" : "الوضع الليلي"}>
                <IconButton onClick={toggleDarkMode} color="primary">
                  {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>
              <TextField
                placeholder="بحث..."
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  width: 200,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: colors.text.muted }} />
                    </InputAdornment>
                  ),
                }}
              />
              <ButtonGroup 
                size="small"
                sx={{
                  '& .MuiButton-root': {
                    color: colors.text.primary,
                    borderColor: colors.border.light,
                    '&.Mui-selected': {
                      bgcolor: darkMode ? 'rgba(255,23,68,0.2)' : undefined,
                    },
                    '&:hover': {
                      bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : undefined,
                    },
                  },
                }}
              >
                <Button
                  variant={timeRange === 'day' ? 'contained' : 'outlined'}
                  onClick={() => setTimeRange('day')}
                  color="primary"
                >
                  يوم
                </Button>
                <Button
                  variant={timeRange === 'week' ? 'contained' : 'outlined'}
                  onClick={() => setTimeRange('week')}
                  color="primary"
                >
                  أسبوع
                </Button>
                <Button
                  variant={timeRange === 'month' ? 'contained' : 'outlined'}
                  onClick={() => setTimeRange('month')}
                  color="primary"
                >
                  شهر
                </Button>
              </ButtonGroup>
              <Tooltip title="تحديث">
                <IconButton onClick={() => fetchDashboardData()}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Quick Stats Grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="المبيعات اليومية"
            value="₪ 12,500"
            icon={<SalesIcon />}
            color={colors.stats.card1}
            trend="up"
            percentage="12"
            darkMode={darkMode}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="الطلبات الجديدة"
            value="48"
            icon={<OrdersIcon />}
            color={colors.stats.card2}
            trend="up"
            percentage="8"
            darkMode={darkMode}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="المنتجات النشطة"
            value="156"
            icon={<ProductsIcon />}
            color={colors.stats.card3}
            trend="down"
            percentage="5"
            darkMode={darkMode}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="العملاء الجدد"
            value="25"
            icon={<UsersIcon />}
            color={colors.stats.card4}
            trend="up"
            percentage="15"
            darkMode={darkMode}
          />
        </Grid>
      </Grid>

      {/* Additional Stats Grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2}>
          <StatMiniCard
            title="المخزون"
            value="1,250"
            icon={<StockIcon />}
            color={colors.stats.card5}
            trend="down"
            percentage="3"
            darkMode={darkMode}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatMiniCard
            title="العروض النشطة"
            value="12"
            icon={<OffersIcon />}
            color={colors.stats.card6}
            trend="up"
            percentage="10"
            darkMode={darkMode}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatMiniCard
            title="متوسط التقييم"
            value="4.8"
            icon={<RatingIcon />}
            color={colors.stats.card7}
            trend="up"
            percentage="2"
            darkMode={darkMode}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatMiniCard
            title="معدل التحويل"
            value="3.2%"
            icon={<TrendIcon />}
            color={colors.stats.card8}
            trend="up"
            percentage="7"
            darkMode={darkMode}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatMiniCard
            title="الزيارات"
            value="2.5K"
            icon={<TrendingUp />}
            color={colors.stats.card9}
            trend="up"
            percentage="12"
            darkMode={darkMode}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatMiniCard
            title="متوسط الطلب"
            value="₪ 280"
            icon={<CalendarIcon />}
            color={colors.stats.card10}
            trend="up"
            percentage="5"
            darkMode={darkMode}
          />
        </Grid>
      </Grid>

      {/* Filter Chips */}
      <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip
          label="الكل"
          onClick={() => setSelectedFilter('all')}
          color={selectedFilter === 'all' ? 'primary' : 'default'}
          variant={selectedFilter === 'all' ? 'filled' : 'outlined'}
        />
        <Chip
          label="المبيعات"
          onClick={() => setSelectedFilter('sales')}
          color={selectedFilter === 'sales' ? 'primary' : 'default'}
          variant={selectedFilter === 'sales' ? 'filled' : 'outlined'}
        />
        <Chip
          label="الطلبات"
          onClick={() => setSelectedFilter('orders')}
          color={selectedFilter === 'orders' ? 'primary' : 'default'}
          variant={selectedFilter === 'orders' ? 'filled' : 'outlined'}
        />
        <Chip
          label="المنتجات"
          onClick={() => setSelectedFilter('products')}
          color={selectedFilter === 'products' ? 'primary' : 'default'}
          variant={selectedFilter === 'products' ? 'filled' : 'outlined'}
        />
        <Chip
          label="العملاء"
          onClick={() => setSelectedFilter('customers')}
          color={selectedFilter === 'customers' ? 'primary' : 'default'}
          variant={selectedFilter === 'customers' ? 'filled' : 'outlined'}
        />
      </Box>

      {/* Stats Cards Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3} sx={{ height: '100%' }}>
          <StatCard
            title="إجمالي المبيعات"
            value={`₪ ${stats?.totalSales || 0}`}
            icon={<SalesIcon />}
            color={colors.stats.card1}
            trend="up"
            percentage="12"
            darkMode={darkMode}
            sx={{ height: '100%' }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ height: '100%' }}>
          <StatCard
            title="الطلبات"
            value={stats?.totalOrders || 0}
            icon={<OrdersIcon />}
            color={colors.stats.card2}
            trend="up"
            percentage="8"
            darkMode={darkMode}
            sx={{ height: '100%' }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ height: '100%' }}>
          <StatCard
            title="المستخدمين"
            value={stats?.totalUsers || 0}
            icon={<UsersIcon />}
            color={colors.stats.card3}
            trend="up"
            percentage="15"
            darkMode={darkMode}
            sx={{ height: '100%' }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ height: '100%' }}>
          <StatCard
            title="المنتجات"
            value={stats?.totalProducts || 0}
            icon={<ProductsIcon />}
            color={colors.stats.card4}
            trend="down"
            percentage="5"
            darkMode={darkMode}
            sx={{ height: '100%' }}
          />
        </Grid>
      </Grid>

    
     
    </Box>
  );
}

export default Dashboard; 