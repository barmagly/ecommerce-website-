import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Tab,
  Tabs,
  useTheme,
  alpha,
  Avatar,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Palette as ThemeIcon,
  Search as SEOIcon,
  Notifications as NotificationsIcon,
  Analytics as AnalyticsIcon,
  Speed as PerformanceIcon,
  Backup as BackupIcon,
  Save as SaveIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Public as PublicIcon,
  Payment as PaymentIcon,
  Info as InfoIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Add as AddIcon,
  AccountCircle as AccountCircleIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { settingsAPI } from '../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSettings, updateSettings, resetSettings, setDirty } from '../store/slices/settingsSlice';

// SEO Pages configuration
const SITE_PAGES = [
  { id: 'home', name: 'الصفحة الرئيسية', path: '/', icon: <PublicIcon /> },
  { id: 'about', name: 'معلومات عنا', path: '/about', icon: <InfoIcon /> },
  { id: 'contact', name: 'اتصل بنا', path: '/contact', icon: <EmailIcon /> },
  { id: 'products', name: 'المنتجات', path: '/products', icon: <InventoryIcon /> },
  { id: 'cart', name: 'عربة التسوق', path: '/cart', icon: <ShoppingCartIcon /> },
  { id: 'profile', name: 'الملف الشخصي', path: '/profile', icon: <AccountCircleIcon /> },
  { id: 'login', name: 'تسجيل الدخول', path: '/login', icon: <LockIcon /> },
  { id: 'signup', name: 'إنشاء حساب', path: '/signup', icon: <AddIcon /> },
];

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Settings = () => {
  const dispatch = useDispatch();
  const { settings, loading, error, isDirty } = useSelector((state) => state.settings);
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedSEOPage, setSelectedSEOPage] = useState('home');
  
  // Load settings from API
  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  const handleSettingChange = (category, key, value) => {
    dispatch(setDirty(true));
    const updatedSettings = {
      ...settings,
      [category]: typeof settings[category] === 'object' ? 
        { ...settings[category], [key]: value } : value
    };
    dispatch(updateSettings(updatedSettings));
  };

  const handleSEOChange = (pageId, field, value) => {
    dispatch(setDirty(true));
    const updatedSettings = {
      ...settings,
      seoPages: {
        ...settings.seoPages,
        [pageId]: {
          ...settings.seoPages[pageId],
          [field]: value
        }
      }
    };
    dispatch(updateSettings(updatedSettings));
  };

  const handleSaveSettings = async () => {
    try {
      await dispatch(updateSettings(settings)).unwrap();
      toast.success('تم حفظ الإعدادات بنجاح!');
    } catch (error) {
      toast.error('حدث خطأ في حفظ الإعدادات!');
    }
  };

  const handleResetSettings = async () => {
    try {
      await dispatch(resetSettings()).unwrap();
      toast.success('تم إعادة تعيين الإعدادات بنجاح!');
    } catch (error) {
      toast.error('حدث خطأ في إعادة تعيين الإعدادات!');
    }
  };

  const handleExportSettings = () => {
    try {
      const dataStr = JSON.stringify(settings, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `settings-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('تم تصدير الإعدادات بنجاح!');
    } catch (error) {
      console.error('Error exporting settings:', error);
      toast.error('حدث خطأ في تصدير الإعدادات!');
    }
  };

  const handleImportSettings = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          dispatch(updateSettings(importedSettings));
          toast.success('تم استيراد الإعدادات بنجاح!');
        } catch (error) {
          console.error('Error importing settings:', error);
          toast.error('خطأ في ملف الإعدادات!');
        }
      };
      reader.readAsText(file);
    }
  };

  const tabs = [
    { label: 'عام', icon: <SettingsIcon />, color: '#1976d2' },
    { label: 'SEO', icon: <SEOIcon />, color: '#2e7d32' },
    { label: 'المظهر', icon: <ThemeIcon />, color: '#ed6c02' },
    { label: 'الأمان', icon: <SecurityIcon />, color: '#d32f2f' },
    { label: 'الإشعارات', icon: <NotificationsIcon />, color: '#9c27b0' },
    { label: 'التحليلات', icon: <AnalyticsIcon />, color: '#0288d1' },
    { label: 'الأداء', icon: <PerformanceIcon />, color: '#388e3c' },
    { label: 'النسخ الاحتياطي', icon: <BackupIcon />, color: '#f57c00' },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!settings) {
    return null;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          sx={{
            mb: 3,
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <SettingsIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    ⚙️ إعدادات النظام
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    إدارة شاملة لجميع إعدادات الموقع والنظام
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                  startIcon={<SaveIcon />}
                  onClick={handleSaveSettings}
                  disabled={!isDirty}
                >
                  حفظ
                </Button>
                <Button
                  variant="outlined"
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.5)', 
                    color: 'white',
                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                  startIcon={<DownloadIcon />}
                  onClick={handleExportSettings}
                >
                  تصدير
                </Button>
                <Button
                  component="label"
                  variant="outlined"
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.5)', 
                    color: 'white',
                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                  startIcon={<UploadIcon />}
                >
                  استيراد
                  <input type="file" hidden accept=".json" onChange={handleImportSettings} />
                </Button>
                <Button
                  variant="outlined"
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.5)', 
                    color: 'white',
                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                  startIcon={<RefreshIcon />}
                  onClick={handleResetSettings}
                >
                  إعادة تعيين
                </Button>
              </Box>
            </Box>
            
            {isDirty && (
              <Alert 
                severity="warning" 
                sx={{ 
                  mt: 2, 
                  bgcolor: 'rgba(255, 193, 7, 0.1)', 
                  border: '1px solid rgba(255, 193, 7, 0.3)',
                  '& .MuiAlert-message': { color: 'white' },
                  '& .MuiAlert-icon': { color: '#ffb74d' }
                }}
              >
                يوجد تغييرات غير محفوظة. لا تنس حفظ الإعدادات!
              </Alert>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTabs-indicator': {
              height: 4,
              borderRadius: 2,
            }
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {React.cloneElement(tab.icon, { sx: { color: tab.color } })}
                  {tab.label}
                </Box>
              }
              sx={{
                minHeight: 64,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
              }}
            />
          ))}
        </Tabs>
      </Card>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* General Settings */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, height: 'fit-content' }}>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PublicIcon color="primary" />
                  معلومات الموقع الأساسية
                </Typography>
                
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="اسم الموقع"
                    value={settings.siteName}
                    onChange={(e) => handleSettingChange('siteName', 'siteName', e.target.value)}
                  />
                  
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="وصف الموقع"
                    value={settings.siteDescription}
                    onChange={(e) => handleSettingChange('siteDescription', 'siteDescription', e.target.value)}
                  />
                  
                  <TextField
                    fullWidth
                    label="البريد الإلكتروني للتواصل"
                    value={settings.contactEmail}
                    onChange={(e) => handleSettingChange('contactEmail', 'contactEmail', e.target.value)}
                  />
                  
                  <TextField
                    fullWidth
                    label="رقم الهاتف"
                    value={settings.contactPhone}
                    onChange={(e) => handleSettingChange('contactPhone', 'contactPhone', e.target.value)}
                  />
                  
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="العنوان"
                    value={settings.address}
                    onChange={(e) => handleSettingChange('address', 'address', e.target.value)}
                  />
                </Stack>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, height: 'fit-content' }}>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PaymentIcon color="primary" />
                  إعدادات المدفوعات والشحن
                </Typography>
                
                <Stack spacing={3}>
                  <FormControl fullWidth>
                    <InputLabel>العملة</InputLabel>
                    <Select
                      value={settings.currency}
                      label="العملة"
                      onChange={(e) => handleSettingChange('currency', 'currency', e.target.value)}
                    >
                      <MenuItem value="EGP">جنيه مصري (EGP)</MenuItem>
                      <MenuItem value="SAR">ريال سعودي (SAR)</MenuItem>
                      <MenuItem value="USD">دولار أمريكي (USD)</MenuItem>
                      <MenuItem value="EUR">يورو (EUR)</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <TextField
                    fullWidth
                    type="number"
                    label="معدل الضريبة (%)"
                    value={settings.taxRate}
                    onChange={(e) => handleSettingChange('taxRate', 'taxRate', parseFloat(e.target.value))}
                  />
                  
                  <TextField
                    fullWidth
                    type="number"
                    label="الحد الأدنى للشحن المجاني"
                    value={settings.freeShippingThreshold}
                    onChange={(e) => handleSettingChange('freeShippingThreshold', 'freeShippingThreshold', parseFloat(e.target.value))}
                  />
                  
                  <FormControl fullWidth>
                    <InputLabel>طريقة حساب الشحن</InputLabel>
                    <Select
                      value={settings.shippingCalculation}
                      label="طريقة حساب الشحن"
                      onChange={(e) => handleSettingChange('shippingCalculation', 'shippingCalculation', e.target.value)}
                    >
                      <MenuItem value="weight">حسب الوزن</MenuItem>
                      <MenuItem value="price">حسب السعر</MenuItem>
                      <MenuItem value="fixed">سعر ثابت</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* SEO Settings */}
        <TabPanel value={activeTab} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, height: '500px', overflow: 'auto' }}>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SEOIcon color="primary" />
                  صفحات الموقع
                </Typography>
                
                <List>
                  {SITE_PAGES.map((page) => (
                    <ListItem
                      key={page.id}
                      button
                      selected={selectedSEOPage === page.id}
                      onClick={() => setSelectedSEOPage(page.id)}
                      sx={{
                        borderRadius: 2,
                        mb: 1,
                        '&.Mui-selected': {
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.15),
                          }
                        }
                      }}
                    >
                      <ListItemIcon>
                        {page.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={page.name}
                        secondary={page.path}
                      />
                    </ListItem>
                  ))}
                </List>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  إعدادات SEO لصفحة: {SITE_PAGES.find(p => p.id === selectedSEOPage)?.name}
                </Typography>
                
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="عنوان الصفحة (Title)"
                    value={settings.seoPages[selectedSEOPage]?.title || ''}
                    onChange={(e) => handleSEOChange(selectedSEOPage, 'title', e.target.value)}
                    helperText="يظهر في تبويب المتصفح ونتائج البحث (60 حرف كحد أقصى)"
                  />
                  
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="وصف الصفحة (Meta Description)"
                    value={settings.seoPages[selectedSEOPage]?.description || ''}
                    onChange={(e) => handleSEOChange(selectedSEOPage, 'description', e.target.value)}
                    helperText="يظهر في نتائج البحث (160 حرف كحد أقصى)"
                  />
                  
                  <TextField
                    fullWidth
                    label="الكلمات المفتاحية (Keywords)"
                    value={settings.seoPages[selectedSEOPage]?.keywords || ''}
                    onChange={(e) => handleSEOChange(selectedSEOPage, 'keywords', e.target.value)}
                    helperText="فصل بفواصل، مثال: تسوق, إلكترونيات, جوالات"
                  />
                  
                  <Divider />
                  
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    إعدادات Open Graph (فيسبوك/تويتر)
                  </Typography>
                  
                  <TextField
                    fullWidth
                    label="عنوان Open Graph"
                    value={settings.seoPages[selectedSEOPage]?.ogTitle || ''}
                    onChange={(e) => handleSEOChange(selectedSEOPage, 'ogTitle', e.target.value)}
                  />
                  
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="وصف Open Graph"
                    value={settings.seoPages[selectedSEOPage]?.ogDescription || ''}
                    onChange={(e) => handleSEOChange(selectedSEOPage, 'ogDescription', e.target.value)}
                  />
                  
                  <TextField
                    fullWidth
                    label="صورة Open Graph (URL)"
                    value={settings.seoPages[selectedSEOPage]?.ogImage || ''}
                    onChange={(e) => handleSEOChange(selectedSEOPage, 'ogImage', e.target.value)}
                  />
                  
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.seoPages[selectedSEOPage]?.robotsIndex || true}
                          onChange={(e) => handleSEOChange(selectedSEOPage, 'robotsIndex', e.target.checked)}
                        />
                      }
                      label="السماح بالفهرسة (Index)"
                    />
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.seoPages[selectedSEOPage]?.robotsFollow || true}
                          onChange={(e) => handleSEOChange(selectedSEOPage, 'robotsFollow', e.target.checked)}
                        />
                      }
                      label="السماح بتتبع الروابط (Follow)"
                    />
                  </Box>
                  
                  <TextField
                    fullWidth
                    label="الرابط المعياري (Canonical URL)"
                    value={settings.seoPages[selectedSEOPage]?.canonicalUrl || ''}
                    onChange={(e) => handleSEOChange(selectedSEOPage, 'canonicalUrl', e.target.value)}
                    helperText="اتركه فارغاً لاستخدام الرابط الافتراضي"
                  />
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Theme Settings */}
        <TabPanel value={activeTab} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ThemeIcon color="primary" />
                  إعدادات المظهر
                </Typography>
                
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>اللون الأساسي</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {['#1976d2', '#2e7d32', '#ed6c02', '#d32f2f', '#9c27b0', '#0288d1'].map(color => (
                        <Button
                          key={color}
                          variant={settings.primaryColor === color ? 'contained' : 'outlined'}
                          sx={{
                            minWidth: 40,
                            height: 40,
                            bgcolor: color,
                            border: `2px solid ${color}`,
                            '&:hover': { bgcolor: color, opacity: 0.8 }
                          }}
                          onClick={() => {
                            handleSettingChange('primaryColor', null, color);
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                  
                  <FormControl fullWidth>
                    <InputLabel>خط النص</InputLabel>
                    <Select
                      value={settings.fontFamily}
                      label="خط النص"
                      onChange={(e) => handleSettingChange('fontFamily', null, e.target.value)}
                    >
                      <MenuItem value="Arial">Arial</MenuItem>
                      <MenuItem value="Tahoma">Tahoma</MenuItem>
                      <MenuItem value="Segoe UI">Segoe UI</MenuItem>
                      <MenuItem value="Roboto">Roboto</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.darkMode}
                          onChange={(e) => handleSettingChange('darkMode', null, e.target.checked)}
                        />
                      }
                      label="الوضع المظلم"
                    />
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.rtl}
                          onChange={(e) => handleSettingChange('rtl', null, e.target.checked)}
                        />
                      }
                      label="النص من اليمين لليسار"
                    />
                  </Box>
                </Stack>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>معاينة المظهر</Typography>
                <Card 
                  sx={{ 
                    p: 3, 
                    bgcolor: settings.darkMode ? '#333' : '#fff',
                    color: settings.darkMode ? '#fff' : '#333',
                    border: `2px solid ${settings.primaryColor}`,
                    borderRadius: 2
                  }}
                >
                  <Typography variant="h6" sx={{ color: settings.primaryColor, mb: 2 }}>
                    عنوان تجريبي
                  </Typography>
                  <Typography sx={{ mb: 2, fontFamily: settings.fontFamily }}>
                    هذا نص تجريبي لمعاينة الخط المختار والألوان.
                  </Typography>
                  <Button 
                    variant="contained" 
                    sx={{ bgcolor: settings.primaryColor }}
                  >
                    زر تجريبي
                  </Button>
                </Card>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Security Settings */}
        <TabPanel value={activeTab} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SecurityIcon color="primary" />
                  إعدادات الأمان
                </Typography>
                
                <Stack spacing={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.twoFactorAuth}
                        onChange={(e) => handleSettingChange('twoFactorAuth', null, e.target.checked)}
                      />
                    }
                    label="المصادقة الثنائية"
                  />
                  
                  <TextField
                    fullWidth
                    type="number"
                    label="انتهاء الجلسة (دقيقة)"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', null, parseInt(e.target.value))}
                  />
                  
                  <TextField
                    fullWidth
                    type="number"
                    label="حد أقصى لمحاولات تسجيل الدخول"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => handleSettingChange('maxLoginAttempts', null, parseInt(e.target.value))}
                  />
                </Stack>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>سياسة كلمات المرور</Typography>
                
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    type="number"
                    label="الحد الأدنى لطول كلمة المرور"
                    value={settings.passwordPolicy.minLength}
                    onChange={(e) => handleSettingChange('passwordPolicy', 'minLength', parseInt(e.target.value))}
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.passwordPolicy.requireUppercase}
                        onChange={(e) => handleSettingChange('passwordPolicy', 'requireUppercase', e.target.checked)}
                      />
                    }
                    label="يتطلب أحرف كبيرة"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.passwordPolicy.requireNumbers}
                        onChange={(e) => handleSettingChange('passwordPolicy', 'requireNumbers', e.target.checked)}
                      />
                    }
                    label="يتطلب أرقام"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.passwordPolicy.requireSymbols}
                        onChange={(e) => handleSettingChange('passwordPolicy', 'requireSymbols', e.target.checked)}
                      />
                    }
                    label="يتطلب رموز خاصة"
                  />
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Notifications */}
        <TabPanel value={activeTab} index={4}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <NotificationsIcon color="primary" />
              إعدادات الإشعارات
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={(e) => handleSettingChange('emailNotifications', null, e.target.checked)}
                      />
                    }
                    label="إشعارات البريد الإلكتروني"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.smsNotifications}
                        onChange={(e) => handleSettingChange('smsNotifications', null, e.target.checked)}
                      />
                    }
                    label="إشعارات الرسائل النصية"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.pushNotifications}
                        onChange={(e) => handleSettingChange('pushNotifications', null, e.target.checked)}
                      />
                    }
                    label="الإشعارات المباشرة"
                  />
                </Stack>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.orderNotifications}
                        onChange={(e) => handleSettingChange('orderNotifications', null, e.target.checked)}
                      />
                    }
                    label="إشعارات الطلبات"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.reviewNotifications}
                        onChange={(e) => handleSettingChange('reviewNotifications', null, e.target.checked)}
                      />
                    }
                    label="إشعارات المراجعات"
                  />
                </Stack>
              </Grid>
            </Grid>
          </Card>
        </TabPanel>

        {/* Analytics */}
        <TabPanel value={activeTab} index={5}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <AnalyticsIcon color="primary" />
              إعدادات التحليلات والتتبع
            </Typography>
            
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Google Analytics ID"
                value={settings.googleAnalytics}
                onChange={(e) => handleSettingChange('googleAnalytics', null, e.target.value)}
                placeholder="GA-XXXXXXXXX-X"
              />
              
              <TextField
                fullWidth
                label="Facebook Pixel ID"
                value={settings.facebookPixel}
                onChange={(e) => handleSettingChange('facebookPixel', null, e.target.value)}
                placeholder="XXXXXXXXXXXXXXX"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.trackingEnabled}
                    onChange={(e) => handleSettingChange('trackingEnabled', null, e.target.checked)}
                  />
                }
                label="تفعيل التتبع"
              />
            </Stack>
          </Card>
        </TabPanel>

        {/* Performance */}
        <TabPanel value={activeTab} index={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PerformanceIcon color="primary" />
              إعدادات الأداء والتحسين
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.cacheEnabled}
                        onChange={(e) => handleSettingChange('cacheEnabled', null, e.target.checked)}
                      />
                    }
                    label="تفعيل التخزين المؤقت"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.compressionEnabled}
                        onChange={(e) => handleSettingChange('compressionEnabled', null, e.target.checked)}
                      />
                    }
                    label="ضغط الملفات"
                  />
                </Stack>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.lazyLoading}
                        onChange={(e) => handleSettingChange('lazyLoading', null, e.target.checked)}
                      />
                    }
                    label="التحميل التدريجي"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.imageOptimization}
                        onChange={(e) => handleSettingChange('imageOptimization', null, e.target.checked)}
                      />
                    }
                    label="تحسين الصور"
                  />
                </Stack>
              </Grid>
            </Grid>
          </Card>
        </TabPanel>

        {/* Backup */}
        <TabPanel value={activeTab} index={7}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <BackupIcon color="primary" />
              إعدادات النسخ الاحتياطي
            </Typography>
            
            <Stack spacing={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoBackup}
                    onChange={(e) => handleSettingChange('autoBackup', null, e.target.checked)}
                  />
                }
                label="النسخ الاحتياطي التلقائي"
              />
              
              <FormControl fullWidth>
                <InputLabel>تكرار النسخ الاحتياطي</InputLabel>
                <Select
                  value={settings.backupFrequency}
                  label="تكرار النسخ الاحتياطي"
                  onChange={(e) => handleSettingChange('backupFrequency', null, e.target.value)}
                >
                  <MenuItem value="daily">يومياً</MenuItem>
                  <MenuItem value="weekly">أسبوعياً</MenuItem>
                  <MenuItem value="monthly">شهرياً</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                type="number"
                label="مدة الاحتفاظ بالنسخ (أيام)"
                value={settings.backupRetention}
                onChange={(e) => handleSettingChange('backupRetention', null, parseInt(e.target.value))}
              />
              
              <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
                <Button 
                  variant="contained" 
                  startIcon={<BackupIcon />}
                  onClick={() => toast.success('تم إنشاء نسخة احتياطية!')}
                >
                  إنشاء نسخة احتياطية الآن
                </Button>
                
                <Button 
                  variant="outlined" 
                  startIcon={<UploadIcon />}
                  onClick={() => toast.info('استعادة من نسخة احتياطية')}
                >
                  استعادة من نسخة احتياطية
                </Button>
              </Box>
            </Stack>
          </Card>
        </TabPanel>
      </motion.div>

      {/* Floating Save Button */}
      {isDirty && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<SaveIcon />}
            onClick={handleSaveSettings}
            sx={{
              borderRadius: '50px',
              px: 3,
              py: 1.5,
              fontSize: '1.1rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              '&:hover': {
                boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
                transform: 'translateY(-2px)',
              }
            }}
          >
            حفظ التغييرات
          </Button>
        </motion.div>
      )}
    </Box>
  );
};

export default Settings;
