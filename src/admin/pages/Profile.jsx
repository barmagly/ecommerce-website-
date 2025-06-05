import React, { useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Avatar,
  Button,
  TextField,
  Divider,
  IconButton,
  Badge,
  Card,
  CardContent,
  Switch,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  DarkMode as DarkModeIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';

const darkModeStyles = {
  background: {
    main: 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)',
    paper: 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)',
    card: 'linear-gradient(135deg, #242424 0%, #2d2d2d 100%)',
  },
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.7)',
    muted: 'rgba(255, 255, 255, 0.5)',
  },
  border: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.15)',
  }
};

export default function Profile() {
  const { admin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    name: admin?.user?.name || '',
    email: admin?.user?.email || '',
    phone: admin?.user?.phone || '',
    location: admin?.user?.location || '',
    role: admin?.user?.role || 'مدير',
    joinDate: admin?.user?.joinDate || '',
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // updateUserData({ avatar: reader.result }); // Remove userData for admin profile
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSave = () => {
    // updateUserData({
    //   name: formData.name,
    //   email: formData.email,
    //   role: formData.role
    // }); // Remove userData for admin profile
    setIsEditing(false);
  };

  return (
    <Box sx={{ 
      py: 3,
      background: darkMode ? darkModeStyles.background.main : 'inherit',
      minHeight: '100vh',
      transition: 'all 0.3s ease-in-out',
    }}>
      <Paper
        sx={{
          p: 3,
          background: darkMode ? darkModeStyles.background.paper : 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
          borderRadius: 4,
          boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.08)',
          border: darkMode ? `1px solid ${darkModeStyles.border.light}` : 'none',
          color: darkMode ? darkModeStyles.text.primary : 'inherit',
        }}
      >
        <Grid container spacing={4}>
          {/* Profile Header */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Typography variant="h4" sx={{ 
                fontWeight: 700, 
                color: darkMode ? '#ff1744' : '#ff1744',
                textShadow: darkMode ? '0 0 20px rgba(255,23,68,0.3)' : 'none',
              }}>
                الملف الشخصي
              </Typography>
              <Button
                variant={isEditing ? "outlined" : "contained"}
                color={isEditing ? "error" : "primary"}
                startIcon={isEditing ? <CancelIcon /> : <EditIcon />}
                sx={{ 
                  mr: 2, 
                  borderRadius: 2,
                  borderColor: darkMode ? darkModeStyles.border.light : undefined,
                }}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'إلغاء' : 'تعديل'}
              </Button>
              {isEditing && (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<SaveIcon />}
                  sx={{ borderRadius: 2 }}
                  onClick={handleSave}
                >
                  حفظ
                </Button>
              )}
            </Box>
          </Grid>

          {/* Profile Image and Basic Info */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                textAlign: 'center',
                p: 3,
                background: darkMode ? darkModeStyles.background.card : 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                borderRadius: 4,
                boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.08)',
                border: darkMode ? `1px solid ${darkModeStyles.border.light}` : 'none',
                color: darkMode ? darkModeStyles.text.primary : 'inherit',
              }}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  isEditing && (
                    <IconButton
                      component="label"
                      sx={{
                        bgcolor: '#ff1744',
                        color: 'white',
                        '&:hover': { bgcolor: '#d81b60' },
                      }}
                    >
                      <PhotoCameraIcon />
                      <input
                        hidden
                        accept="image/*"
                        type="file"
                        onChange={handleImageChange}
                      />
                    </IconButton>
                  )
                }
              >
                <Avatar
                  src={admin?.user?.avatar || ''}
                  sx={{ width: 120, height: 120, mb: 2 }}
                >
                  {!admin?.user?.avatar && formData.name?.charAt(0)}
                </Avatar>
              </Badge>
              <Typography variant="h5" sx={{ 
                fontWeight: 700, 
                mb: 1,
                color: darkMode ? darkModeStyles.text.primary : 'inherit',
              }}>
                {formData.name}
              </Typography>
              <Typography
                variant="body1"
                sx={{ 
                  color: darkMode ? darkModeStyles.text.secondary : 'text.secondary',
                  mb: 2 
                }}
              >
                {formData.role}
              </Typography>
              <Typography
                variant="body2"
                sx={{ 
                  color: darkMode ? darkModeStyles.text.muted : 'text.secondary',
                  mb: 2 
                }}
              >
                تاريخ الانضمام: {formData.joinDate}
              </Typography>
            </Card>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                p: 3,
                height: '100%',
                background: darkMode ? darkModeStyles.background.card : 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                borderRadius: 4,
                boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.08)',
                border: darkMode ? `1px solid ${darkModeStyles.border.light}` : 'none',
                color: darkMode ? darkModeStyles.text.primary : 'inherit',
              }}
            >
              <Typography variant="h6" sx={{ 
                mb: 3, 
                fontWeight: 700,
                color: darkMode ? darkModeStyles.text.primary : 'inherit',
              }}>
                معلومات الاتصال
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="الاسم"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    disabled={!isEditing}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : undefined,
                        '& fieldset': {
                          borderColor: darkMode ? darkModeStyles.border.light : undefined,
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: darkMode ? darkModeStyles.text.secondary : undefined,
                      },
                      '& .MuiInputBase-input': {
                        color: darkMode ? darkModeStyles.text.primary : undefined,
                      },
                    }}
                    InputProps={{
                      startAdornment: <EditIcon sx={{ mr: 1, color: darkMode ? darkModeStyles.text.muted : 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="البريد الإلكتروني"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    disabled={!isEditing}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : undefined,
                        '& fieldset': {
                          borderColor: darkMode ? darkModeStyles.border.light : undefined,
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: darkMode ? darkModeStyles.text.secondary : undefined,
                      },
                      '& .MuiInputBase-input': {
                        color: darkMode ? darkModeStyles.text.primary : undefined,
                      },
                    }}
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: darkMode ? darkModeStyles.text.muted : 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="رقم الهاتف"
                    value={formData.phone}
                    onChange={handleInputChange('phone')}
                    disabled={!isEditing}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : undefined,
                        '& fieldset': {
                          borderColor: darkMode ? darkModeStyles.border.light : undefined,
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: darkMode ? darkModeStyles.text.secondary : undefined,
                      },
                      '& .MuiInputBase-input': {
                        color: darkMode ? darkModeStyles.text.primary : undefined,
                      },
                    }}
                    InputProps={{
                      startAdornment: <PhoneIcon sx={{ mr: 1, color: darkMode ? darkModeStyles.text.muted : 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="العنوان"
                    value={formData.location}
                    onChange={handleInputChange('location')}
                    disabled={!isEditing}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : undefined,
                        '& fieldset': {
                          borderColor: darkMode ? darkModeStyles.border.light : undefined,
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: darkMode ? darkModeStyles.text.secondary : undefined,
                      },
                      '& .MuiInputBase-input': {
                        color: darkMode ? darkModeStyles.text.primary : undefined,
                      },
                    }}
                    InputProps={{
                      startAdornment: <LocationIcon sx={{ mr: 1, color: darkMode ? darkModeStyles.text.muted : 'text.secondary' }} />,
                    }}
                  />
                </Grid>
              </Grid>
            </Card>
          </Grid>

          {/* Settings */}
          <Grid item xs={12}>
            <Card
              sx={{
                p: 3,
                background: darkMode ? darkModeStyles.background.card : 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                borderRadius: 4,
                boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.08)',
                border: darkMode ? `1px solid ${darkModeStyles.border.light}` : 'none',
                color: darkMode ? darkModeStyles.text.primary : 'inherit',
              }}
            >
              <Typography variant="h6" sx={{ 
                mb: 3, 
                fontWeight: 700,
                color: darkMode ? darkModeStyles.text.primary : 'inherit',
              }}>
                الإعدادات
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <NotificationsIcon sx={{ color: darkMode ? darkModeStyles.text.secondary : undefined }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="الإشعارات"
                    secondary="تلقي إشعارات عن النشاطات الجديدة"
                    primaryTypographyProps={{
                      color: darkMode ? darkModeStyles.text.primary : 'inherit',
                    }}
                    secondaryTypographyProps={{
                      color: darkMode ? darkModeStyles.text.secondary : 'text.secondary',
                    }}
                  />
                  <ListItemSecondaryAction>
                    <Switch 
                      checked={darkMode}
                      onChange={() => setDarkMode(!darkMode)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon sx={{ color: darkMode ? darkModeStyles.text.secondary : undefined }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="المصادقة الثنائية"
                    secondary="تفعيل المصادقة الثنائية لحماية إضافية"
                    primaryTypographyProps={{
                      color: darkMode ? darkModeStyles.text.primary : 'inherit',
                    }}
                    secondaryTypographyProps={{
                      color: darkMode ? darkModeStyles.text.secondary : 'text.secondary',
                    }}
                  />
                  <ListItemSecondaryAction>
                    <Switch 
                      checked={darkMode}
                      onChange={() => setDarkMode(!darkMode)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LanguageIcon sx={{ color: darkMode ? darkModeStyles.text.secondary : undefined }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="اللغة"
                    secondary="العربية"
                    primaryTypographyProps={{
                      color: darkMode ? darkModeStyles.text.primary : 'inherit',
                    }}
                    secondaryTypographyProps={{
                      color: darkMode ? darkModeStyles.text.secondary : 'text.secondary',
                    }}
                  />
                  <ListItemSecondaryAction>
                    <Button variant="outlined" size="small" sx={{ color: darkMode ? darkModeStyles.text.primary : undefined }}>
                      تغيير
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <DarkModeIcon sx={{ color: darkMode ? darkModeStyles.text.secondary : undefined }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="الوضع الليلي"
                    secondary="تفعيل المظهر الداكن"
                    primaryTypographyProps={{
                      color: darkMode ? darkModeStyles.text.primary : 'inherit',
                    }}
                    secondaryTypographyProps={{
                      color: darkMode ? darkModeStyles.text.secondary : 'text.secondary',
                    }}
                  />
                  <ListItemSecondaryAction>
                    <Switch 
                      checked={darkMode}
                      onChange={() => setDarkMode(!darkMode)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
} 