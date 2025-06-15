import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  TextField,
  Grid,
  Divider,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Security as SecurityIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile, fetchProfile, updatePassword } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { 
    user, 
    loading: authLoading, 
    error: authError,
    profileLoading,
    profileError,
    isAuthenticated 
  } = useSelector((state) => state.auth);

  console.log('Profile Component Render - isAuthenticated:', isAuthenticated, 'User:', user, 'profileLoading:', profileLoading, 'authLoading:', authLoading);

  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Fetch profile data when component mounts or user data is missing and a token exists
  useEffect(() => {
    const token = localStorage.getItem("adminToken"); // Use 'adminToken' as per authSlice.js
    console.log('useEffect triggered - token:', !!token, 'user:', !!user, 'isAuthenticated:', isAuthenticated);
    if (token && !user) { // If token exists and user data is not loaded, fetch profile
      console.log('Dispatching fetchProfile...');
      dispatch(fetchProfile());
    }
  }, [dispatch, user]); // Depend only on dispatch and user, as token presence is checked inside

  // Update form data and image preview when user data changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      }));
      if (user.avatar) {
        setImagePreview(user.avatar);
      }
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToUpdate = new FormData();
      dataToUpdate.append('name', formData.name);
      dataToUpdate.append('email', formData.email);
      dataToUpdate.append('phone', formData.phone);
      dataToUpdate.append('address', formData.address);

      if (selectedImage) {
        dataToUpdate.append('avatar', selectedImage);
      }

      let updatePromise;
      // Only update profile if password fields are empty
      if (!formData.currentPassword && !formData.newPassword && !formData.confirmPassword) {
        updatePromise = dispatch(updateProfile(dataToUpdate));
      } else {
        // Validate password fields
        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
          throw new Error('All password fields are required');
        }
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error('New passwords do not match');
        }
        if (formData.newPassword.length < 6) {
          throw new Error('New password must be at least 6 characters long');
        }
        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/.test(formData.newPassword)) {
          throw new Error('Password must contain at least one letter and one number');
        }

        // Update password
        updatePromise = dispatch(updatePassword({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }));
      }

      await updatePromise.unwrap(); // This is where the error from Redux thunk will propagate

      toast.success('تم تحديث الملف الشخصي بنجاح!'); // Success notification
      setIsEditing(false);
      setSelectedImage(null); // Clear selected image after successful upload
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (err) {
      console.error('Failed to update - Full Error Object:', JSON.stringify(err, Object.getOwnPropertyNames(err)));

      // More robust error message for toast
      let errorMessage = 'فشل تحديث الملف الشخصي. يرجى المحاولة مرة أخرى.';
      if (err && typeof err === 'object') {
        if (err.message) {
          errorMessage = err.message;
        } else if (err.profileError) { // Check for profileError if it's from redux state
          errorMessage = getErrorMessage(err.profileError);
        } else if (err.passwordError) { // Check for passwordError
          errorMessage = getErrorMessage(err.passwordError);
        } else if (err.error) { // Generic error from Redux Toolkit
          errorMessage = getErrorMessage(err.error);
        } else if (err.response && err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      toast.error(errorMessage);
    }
  };

  // Helper function to get error message
  const getErrorMessage = (error) => {
    if (!error) return '';
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    if (error.status && error.message) return `${error.status}: ${error.message}`;
    return 'An error occurred';
  };

  // Show loading state
  if (authLoading || profileLoading) {
    console.log('Showing loading state...');
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show error state
  if (authError || profileError) {
    console.log('Showing error state:', authError || profileError);
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {getErrorMessage(authError || profileError)}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => dispatch(fetchProfile())}
          startIcon={<RefreshIcon />}
        >
          Retry
        </Button>
      </Box>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedImage(null);
    setImagePreview(user?.avatar || null);
    setFormData({
      ...formData,
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(file);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Grid container spacing={3}>
          {/* Profile Header */}
          <Grid xs={12}>
            <Card sx={{
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box sx={{ position: 'relative' }}>
                    <Avatar
                      src={imagePreview || user?.avatar}
                      sx={{
                        width: 120,
                        height: 120,
                        border: '4px solid white',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      }}
                    />
                    {isEditing && (
                      <>
                        <input
                          accept="image/*"
                          style={{ display: 'none' }}
                          id="icon-button-file"
                          type="file"
                          onChange={handleImageChange}
                        />
                        <label htmlFor="icon-button-file">
                          <IconButton
                            sx={{
                              position: 'absolute',
                              bottom: 0,
                              right: 0,
                              bgcolor: 'primary.main',
                              color: 'white',
                              '&:hover': { bgcolor: 'primary.dark' },
                            }}
                            component="span"
                          >
                            <PhotoIcon />
                          </IconButton>
                        </label>
                      </>
                    )}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                      {user?.name || 'المستخدم'}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                      {user?.role === 'admin' ? 'مدير النظام' : 'مستخدم'}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      {!isEditing ? (
                        <Button
                          variant="contained"
                          startIcon={<EditIcon />}
                          onClick={() => setIsEditing(true)}
                          sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                            },
                          }}
                        >
                          تعديل الملف الشخصي
                        </Button>
                      ) : (
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleSubmit}
                            disabled={authLoading}
                            sx={{
                              background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #45a049 0%, #4CAF50 100%)',
                              },
                            }}
                          >
                            {authLoading ? <CircularProgress size={24} color="inherit" /> : 'حفظ التغييرات'}
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<CancelIcon />}
                            onClick={handleCancel}
                            disabled={authLoading}
                          >
                            إلغاء
                          </Button>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Profile Details */}
          <Grid xs={12} md={8}>
            <Card sx={{
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  المعلومات الشخصية
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={3}>
                  <Grid xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="الاسم"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="البريد الإلكتروني"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="رقم الهاتف"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                  </Grid>
                 
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Change Password */}
          <Grid xs={12} md={4}>
            <Card sx={{
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  تغيير كلمة المرور
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    type="password"
                    label="كلمة المرور الحالية"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    disabled={!isEditing}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: <SecurityIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                  <TextField
                    fullWidth
                    type="password"
                    label="كلمة المرور الجديدة"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    disabled={!isEditing}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: <SecurityIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                  <TextField
                    fullWidth
                    type="password"
                    label="تأكيد كلمة المرور"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <SecurityIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Success Message */}
        <Snackbar
          open={showSuccess}
          autoHideDuration={6000}
          onClose={() => setShowSuccess(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setShowSuccess(false)}
            severity="success"
            variant="filled"
            sx={{ width: '100%' }}
          >
            تم تحديث الملف الشخصي بنجاح
          </Alert>
        </Snackbar>

        {/* Error Message */}
        {authError && (
          <Snackbar
            open={!!authError}
            autoHideDuration={6000}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert severity="error" variant="filled" sx={{ width: '100%' }}>
              {getErrorMessage(authError)}
            </Alert>
          </Snackbar>
        )}
      </motion.div>
    </Box>
  );
};

export default Profile; 