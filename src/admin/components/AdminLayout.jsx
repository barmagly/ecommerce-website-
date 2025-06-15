import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Chip,
  useTheme,
  alpha,
  Paper,
  Tooltip,
  Collapse,
  Button,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  Category as CategoryIcon,
  LocalOffer as CouponIcon,
  RateReview as ReviewIcon,
  ShoppingBag as CartIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Language as LanguageIcon,
  ExitToApp as LogoutIcon,
  Analytics as AnalyticsIcon,
  Palette as VariantIcon,
  ExpandLess,
  ExpandMore,
  Close as CloseIcon,
  Search as SearchIcon,
  Email as EmailIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 320;

const menuItems = [
  {
    text: 'لوحة التحكم',
    icon: <DashboardIcon />,
    path: '/admin',
    color: '#1976d2',
    gradient: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
  },
  {
    text: 'المستخدمين',
    icon: <PeopleIcon />,
    path: '/admin/users',
    color: '#2e7d32',
    gradient: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)'
  },
  {
    text: 'المنتجات',
    icon: <InventoryIcon />,
    path: '/admin/products',
    color: '#ed6c02',
    gradient: 'linear-gradient(135deg, #ed6c02 0%, #e65100 100%)'
  },
  {
    text: 'الفئات',
    icon: <CategoryIcon />,
    path: '/admin/categories',
    color: '#d32f2f',
    gradient: 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)'
  },
  {
    text: 'الطلبات',
    icon: <ShoppingCartIcon />,
    path: '/admin/orders',
    color: '#9c27b0',
    gradient: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)'
  },

  {
    text: 'الكوبونات',
    icon: <CouponIcon />,
    path: '/admin/coupons',
    color: '#f57c00',
    gradient: 'linear-gradient(135deg, #f57c00 0%, #ef6c00 100%)'
  },
  {
    text: 'المراجعات',
    icon: <ReviewIcon />,
    path: '/admin/reviews',
    color: '#388e3c',
    gradient: 'linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)'
  },
  {
    text: 'عربات التسوق',
    icon: <CartIcon />,
    path: '/admin/carts',
    color: '#0288d1',
    gradient: 'linear-gradient(135deg, #0288d1 0%, #0277bd 100%)'
  },
  {
    text: 'الخيارات',
    icon: <VariantIcon />,
    path: '/admin/variants',
    color: '#7b1fa2',
    gradient: 'linear-gradient(135deg, #7b1fa2 0%, #6a1b9a 100%)'
  },

];

// Animated Menu Item Component
const AnimatedMenuItem = ({ item, isActive, onClick, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <ListItem disablePadding sx={{ mb: 1.5 }}>
        <ListItemButton
          onClick={onClick}
          sx={{
            borderRadius: 3,
            py: 1.5,
            px: 2.5,
            background: isActive ? item.gradient : 'transparent',
            color: isActive ? 'white' : 'text.primary',
            boxShadow: isActive ? '0 8px 32px rgba(0,0,0,0.12)' : 'none',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              background: isActive ? item.gradient : alpha(item.color, 0.08),
              transform: 'translateX(-8px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: isActive ? '100%' : '0%',
              height: '100%',
              background: alpha(item.color, 0.1),
              transition: 'width 0.3s ease',
            },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <ListItemIcon
            sx={{
              color: isActive ? 'white' : item.color,
              minWidth: 45,
              '& svg': {
                fontSize: 24,
                filter: isActive ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'none',
              }
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={item.text}
            sx={{
              '& .MuiListItemText-primary': {
                fontWeight: isActive ? 700 : 500,
                fontSize: '1rem',
                color: isActive ? 'white' : 'text.primary',
                textAlign: 'center',
              },
            }}
          />
          {isActive && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}
              />
            </motion.div>
          )}
        </ListItemButton>
      </ListItem>
    </motion.div>
  );
};

function AdminLayout({ children }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isMenuOpen = Boolean(anchorEl);

  const drawer = (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%)',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '200px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '0 0 30px 30px',
      }
    }}>
      {/* Enhanced Logo Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <Box
          sx={{
            p: 4,
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            color: 'white',
          }}
        >
          <motion.div
            whileHover={{
              scale: 1.1,
              rotate: 360,
              transition: { duration: 0.6 }
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                border: '3px solid rgba(255,255,255,0.3)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              }}
            >
              <AnalyticsIcon sx={{ fontSize: 40, color: 'white' }} />
            </Avatar>
          </motion.div>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>
            لوحة التحكم
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            نظام إدارة المتجر
          </Typography>

        </Box>
      </motion.div>

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, px: 2.5, mt: 2 }}>
        <List>
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <AnimatedMenuItem
                key={item.text}
                item={item}
                isActive={isActive}
                onClick={() => navigate(item.path)}
                index={index}
              />
            );
          })}
        </List>
      </Box>

      {/* Enhanced Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Divider sx={{ mb: 2, opacity: 0.3 }} />
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 1500 }}>
            🚀 Barmagly
          </Typography>

        </Box>
      </motion.div>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Enhanced App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mr: { md: `${drawerWidth}px` },
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
          backdropFilter: 'blur(20px)',
          color: 'text.primary',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: 'none',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              ml: 2,
              display: { md: 'none' },
              background: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                background: alpha(theme.palette.primary.main, 0.2),
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h6" noWrap sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                مرحباً بك في لوحة التحكم
              </Typography>
            </motion.div>
          </Box>

          {/* Enhanced Action Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Tooltip title="العودة للصفحة الرئيسية">
                <IconButton
                  onClick={() => window.open('/', '_blank')}
                  sx={{
                    background: alpha(theme.palette.success.main, 0.1),
                    '&:hover': { background: alpha(theme.palette.success.main, 0.2) }
                  }}
                >
                  <HomeIcon sx={{ color: theme.palette.success.main }} />
                </IconButton>
              </Tooltip>
            </motion.div>



            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Tooltip title="الملف الشخصي">
                <IconButton
                  onClick={handleProfileMenuOpen}
                  sx={{
                    background: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': { background: alpha(theme.palette.primary.main, 0.2) }
                  }}
                >
                  <Avatar sx={{
                    width: 40,
                    height: 40,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                  }}>
                    <AccountCircleIcon />
                  </Avatar>
                </IconButton>
              </Tooltip>
            </motion.div>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Enhanced Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 3,
            mt: 1.5,
            minWidth: 200,
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem sx={{ py: 2, borderRadius: 2, mx: 1, mb: 1 }}>
          <Avatar sx={{
            mr: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }} />
          <Box>
           
            <Typography variant="caption" color="text.secondary">
              {user?.role || 'مدير النظام'}
            </Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => navigate('/admin/profile')}
          sx={{ borderRadius: 2, mx: 1, my: 0.5 }}
        >
          <AccountCircleIcon sx={{ mr: 2, color: 'primary.main' }} />
          الملف الشخصي
        </MenuItem>
      
        <MenuItem
          onClick={() => window.open('/', '_blank')}
          sx={{ borderRadius: 2, mx: 1, my: 0.5 }}
        >
          <HomeIcon sx={{ mr: 2, color: 'success.main' }} />
          العودة للموقع
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={logout}
          sx={{ borderRadius: 2, mx: 1, mt: 0.5, color: 'error.main' }}
        >
          <LogoutIcon sx={{ mr: 2 }} />
          تسجيل الخروج
        </MenuItem>
      </Menu>

      {/* Sidebar Drawer - Positioned on the Right */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              boxShadow: '-8px 0 32px rgba(0,0,0,0.1)',
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', p: 1 }}>
            <IconButton onClick={handleDrawerToggle}>
              <CloseIcon />
            </IconButton>
          </Box>
          {drawer}
        </Drawer>

        {/* Desktop Drawer - Right Side */}
        <Drawer
          variant="permanent"
          anchor="right"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              boxShadow: '-8px 0 32px rgba(0,0,0,0.1)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Enhanced Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.02"%3E%3Cpath d="m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.4,
          }
        }}
      >
        <Toolbar />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            padding: 0,
            position: 'relative',
            zIndex: 1,
            width: '100%',
            height: '100%',
          }}
        >
          {children}
        </motion.div>
      </Box>
    </Box>
  );
}

export default AdminLayout; 