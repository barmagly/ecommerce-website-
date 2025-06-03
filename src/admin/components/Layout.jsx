import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
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
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Paper,
  Badge,
  Tooltip,
  Switch,
  ListItemButton,
  Collapse,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ShoppingCart as ProductsIcon,
  Category as CategoriesIcon,
  LocalShipping as OrdersIcon,
  People as UsersIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ExpandLess,
  ExpandMore,
  Inventory as InventoryIcon,
  LocalOffer as CouponsIcon,
  Assessment as ReportsIcon,
  Mail as MailIcon,
  Chat as ChatIcon,
  Language as LanguageIcon,
  Palette as ThemeIcon,
  Security as SecurityIcon,
  Help as HelpIcon,
  Info as AboutIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { useDarkMode } from '../context/DarkModeContext';
import { darkModeColors } from '../theme/darkModeColors';

const drawerWidth = 280;

const menuItems = [
  { 
    text: 'لوحة التحكم', 
    icon: <DashboardIcon />, 
    path: '/admin/dashboard',
    color: '#1e88e5'
  },
  { 
    text: 'المنتجات', 
    icon: <ProductsIcon />, 
    path: '/admin/products',
    color: '#43a047',
    subItems: [
      { text: 'قائمة المنتجات', path: '/admin/products' },
      { text: 'إضافة منتج', path: '/admin/products/add' },
      { text: 'المنتجات المميزة', path: '/admin/products/featured' },
    ]
  },
  { 
    text: 'التصنيفات', 
    icon: <CategoriesIcon />, 
    path: '/admin/categories',
    color: '#fb8c00'
  },
  { 
    text: 'الطلبات', 
    icon: <OrdersIcon />, 
    path: '/admin/orders',
    color: '#e53935',
    badge: 5
  },
  { 
    text: 'المستخدمين', 
    icon: <UsersIcon />, 
    path: '/admin/users',
    color: '#8e24aa'
  },
  { 
    text: 'المخزون', 
    icon: <InventoryIcon />, 
    path: '/admin/inventory',
    color: '#00897b'
  },
  { 
    text: 'الكوبونات', 
    icon: <CouponsIcon />, 
    path: '/admin/coupons',
    color: '#d81b60'
  },
  { 
    text: 'التقارير', 
    icon: <ReportsIcon />, 
    path: '/admin/reports',
    color: '#546e7a',
    subItems: [
      { text: 'تقارير المبيعات', path: '/admin/reports/sales' },
      { text: 'تقارير المستخدمين', path: '/admin/reports/users' },
      { text: 'تقارير المنتجات', path: '/admin/reports/products' },
    ]
  },
];

const communicationItems = [
  { 
    text: 'البريد الوارد', 
    icon: <MailIcon />, 
    path: '/admin/inbox',
    color: '#0288d1',
    badge: 3
  },
  { 
    text: 'المحادثات', 
    icon: <ChatIcon />, 
    path: '/admin/chat',
    color: '#0097a7',
    badge: 2
  },
];

const settingsItems = [
  { 
    text: 'الإعدادات العامة', 
    icon: <SettingsIcon />, 
    path: '/admin/settings',
    color: '#757575'
  },
  { 
    text: 'اللغة', 
    icon: <LanguageIcon />, 
    path: '/admin/language',
    color: '#546e7a'
  },
  { 
    text: 'المظهر', 
    icon: <ThemeIcon />, 
    path: '/admin/theme',
    color: '#6d4c41'
  },
  { 
    text: 'الأمان', 
    icon: <SecurityIcon />, 
    path: '/admin/security',
    color: '#c62828'
  },
];

const helpItems = [
  { 
    text: 'المساعدة', 
    icon: <HelpIcon />, 
    path: '/admin/help',
    color: '#00acc1'
  },
  { 
    text: 'حول النظام', 
    icon: <AboutIcon />, 
    path: '/admin/about',
    color: '#5c6bc0'
  },
];

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, logout } = useAuth();
  const { userData } = useUser();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [expandedItem, setExpandedItem] = useState('');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  const handleItemClick = (item) => {
    if (item.subItems) {
      setExpandedItem(expandedItem === item.text ? '' : item.text);
    } else {
      navigate(item.path);
      setMobileOpen(false);
    }
  };

  const handleDarkModeToggle = () => {
    toggleDarkMode();
  };

  const handleProfileClick = () => {
    navigate('/admin/profile');
    handleMenuClose();
  };

  const drawer = (
    <Box 
      sx={{ 
        height: '100%', 
        background: darkMode ? darkModeColors.background.sidebar : 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
        color: darkMode ? '#fff' : 'inherit',
        position: 'relative',
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
        position: 'relative',
      }}>
        <IconButton
          onClick={drawerOpen ? handleDrawerClose : handleDrawerOpen}
          sx={{
            position: 'absolute',
            right: -15,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: darkMode ? '#1a237e' : '#fff',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            '&:hover': {
              backgroundColor: darkMode ? '#283593' : '#f5f5f5',
            },
          }}
        >
          {drawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
        <Avatar 
          src={userData.avatar}
          sx={{ 
            width: 80, 
            height: 80,
            mb: 2,
            background: 'linear-gradient(45deg, #1e88e5 30%, #1976d2 90%)',
            boxShadow: '0 3px 15px rgba(25,118,210,0.3)',
            border: '3px solid #fff'
          }}
        >
          {!userData.avatar && userData.name?.charAt(0)}
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#1e88e5' }}>
          {userData.name}
        </Typography>
        <Typography variant="body2" sx={{ color: '#43a047' }}>
          {userData.role}
        </Typography>
      </Box>
      
      <List sx={{ p: 2 }}>
        {menuItems.map((item) => (
          <React.Fragment key={item.text}>
            <ListItemButton
              onClick={() => handleItemClick(item)}
              selected={location.pathname === item.path}
              sx={{
                mb: 1,
                borderRadius: 2,
                '&.Mui-selected': {
                  background: darkMode ? 'rgba(255,255,255,0.1)' : item.color + '22',
                  color: item.color,
                  '&:hover': {
                    background: darkMode ? 'rgba(255,255,255,0.15)' : item.color + '33',
                  },
                },
                '&:hover': {
                  background: darkMode ? 'rgba(255,255,255,0.05)' : item.color + '11',
                },
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 40,
                color: location.pathname === item.path ? item.color : (darkMode ? '#fff' : item.color)
              }}>
                {item.badge ? (
                  <Badge badgeContent={item.badge} color="error">
                    {item.icon}
                  </Badge>
                ) : item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 700 : 500,
                  color: darkMode ? '#fff' : item.color,
                }}
              />
              {item.subItems && (
                expandedItem === item.text ? <ExpandLess /> : <ExpandMore />
              )}
            </ListItemButton>
            {item.subItems && (
              <Collapse in={expandedItem === item.text} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => (
                    <ListItemButton
                      key={subItem.text}
                      onClick={() => navigate(subItem.path)}
                      selected={location.pathname === subItem.path}
                      sx={{
                        pl: 6,
                        py: 1,
                        borderRadius: 2,
                        mb: 0.5,
                        '&.Mui-selected': {
                          background: darkMode ? 'rgba(255,255,255,0.1)' : item.color + '22',
                          color: item.color,
                        },
                      }}
                    >
                      <ListItemText 
                        primary={subItem.text}
                        primaryTypographyProps={{
                          fontSize: '0.9rem',
                          fontWeight: location.pathname === subItem.path ? 700 : 500,
                          color: darkMode ? '#fff' : 'text.primary',
                        }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>

      <Divider sx={{ my: 2, opacity: darkMode ? 0.1 : 0.08 }} />
      
      <List sx={{ p: 2 }}>
        <Typography
          variant="overline"
          sx={{
            px: 2,
            color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary',
            fontWeight: 700,
          }}
        >
          التواصل
        </Typography>
        {communicationItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{
              mb: 1,
              borderRadius: 2,
              '&:hover': {
                background: darkMode ? 'rgba(255,255,255,0.05)' : item.color + '11',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: darkMode ? '#fff' : item.color }}>
              <Badge badgeContent={item.badge} color="error">
                {item.icon}
              </Badge>
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ my: 2, opacity: darkMode ? 0.1 : 0.08 }} />

      <List sx={{ p: 2 }}>
        <Typography
          variant="overline"
          sx={{
            px: 2,
            color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary',
            fontWeight: 700,
          }}
        >
          الإعدادات
        </Typography>
        {settingsItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{
              mb: 1,
              borderRadius: 2,
              '&:hover': {
                background: darkMode ? 'rgba(255,255,255,0.05)' : item.color + '11',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: darkMode ? '#fff' : item.color }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ my: 2, opacity: darkMode ? 0.1 : 0.08 }} />

      <List sx={{ p: 2 }}>
        <Typography
          variant="overline"
          sx={{
            px: 2,
            color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary',
            fontWeight: 700,
          }}
        >
          المساعدة والدعم
        </Typography>
        {helpItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{
              mb: 1,
              borderRadius: 2,
              '&:hover': {
                background: darkMode ? 'rgba(255,255,255,0.05)' : item.color + '11',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: darkMode ? '#fff' : item.color }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ my: 2, opacity: darkMode ? 0.1 : 0.08 }} />

      <List sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            '&:hover': {
              background: darkMode ? 'rgba(211,47,47,0.15)' : 'rgba(211,47,47,0.08)',
              color: '#d32f2f',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: darkMode ? '#ff5252' : 'error.main' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="تسجيل الخروج" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerOpen ? drawerWidth : 0}px)` },
          ml: { sm: `${drawerOpen ? drawerWidth : 0}px` },
          background: darkMode ? darkModeColors.background.header : 'white',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Toolbar>
          <IconButton
            color={darkMode ? 'inherit' : 'primary'}
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="الإشعارات">
            <IconButton color={darkMode ? 'inherit' : 'primary'} sx={{ mr: 2 }}>
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="الملف الشخصي">
            <IconButton
              onClick={handleMenuOpen}
              size="small"
              sx={{ 
                ml: 2,
                background: darkMode ? 'rgba(255,255,255,0.1)' : 'linear-gradient(45deg, #1e88e5 30%, #1976d2 90%)',
                color: 'white',
                '&:hover': {
                  background: darkMode ? 'rgba(255,255,255,0.2)' : 'linear-gradient(45deg, #1976d2 30%, #1565c0 90%)',
                }
              }}
            >
              <Avatar sx={{ width: 32, height: 32 }} src={userData.avatar}>
                {!userData.avatar && userData.name?.charAt(0)}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                borderRadius: 2,
                minWidth: 180,
              }
            }}
          >
            <MenuItem onClick={handleProfileClick}>
              <ListItemIcon>
                <AccountIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>الملف الشخصي</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => { navigate('/admin/settings'); handleMenuClose(); }}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>الإعدادات</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{
              color: 'error.main',
              '&:hover': {
                background: 'rgba(211,47,47,0.08)',
              }
            }}>
              <ListItemIcon sx={{ color: 'error.main' }}>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>تسجيل الخروج</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ 
          width: { sm: drawerWidth }, 
          flexShrink: { sm: 0 },
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              boxShadow: '4px 0 20px rgba(0,0,0,0.08)',
              border: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerOpen ? drawerWidth : 0,
              boxShadow: '4px 0 20px rgba(0,0,0,0.08)',
              border: 'none',
              transition: 'width 0.3s ease-in-out',
              overflowX: 'hidden',
            },
          }}
          open={drawerOpen}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: drawerOpen ? { sm: `calc(100% - ${drawerWidth}px)` } : { sm: '100%' },
          minHeight: '100vh',
          background: darkMode ? '#121858' : '#f8f9fa',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Toolbar />
        <Paper
          sx={{
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            p: 3,
            background: darkMode ? '#1a237e' : '#fff',
            color: darkMode ? '#fff' : 'inherit',
          }}
        >
          <Outlet />
        </Paper>
      </Box>
      {!drawerOpen && (
        <IconButton
          onClick={handleDrawerOpen}
          sx={{
            position: 'fixed',
            top: 32,
            right: 24,
            left: 'auto',
            zIndex: 2000,
            background: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            border: '1px solid #eee',
            '&:hover': { background: '#f5f5f5' },
            transition: 'all 0.3s',
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
    </Box>
  );
}

export default Layout; 