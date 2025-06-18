import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Avatar,
  Chip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  Alert,
  CircularProgress,
  InputAdornment,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  VerifiedUser as VerifiedIcon,
  Block as BlockIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { usersAPI } from '../services/api';

const Users = () => {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogMode, setDialogMode] = useState('add'); // add, edit, view
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    status: 'active',
    addresses: '',
  });

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAll();
      // The backend returns an object with a 'users' key
      setUsers(response.data.users || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users');
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search and filters
  const filteredUsers = (users || []).filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone || '').includes(searchTerm);
    const matchesRole = roleFilter === '' || user.role === roleFilter;
    const matchesStatus = statusFilter === '' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleOpenDialog = (mode, user = null) => {
    setDialogMode(mode);
    setSelectedUser(user);
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        password: '',
        confirmPassword: '',
        role: user.role,
        status: user.status,
        addresses: Array.isArray(user.addresses) ? user.addresses.join(', ') : user.addresses || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'user',
        status: 'active',
        addresses: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: 'user',
      status: 'active',
      addresses: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords for new users
    if (dialogMode === 'add') {
      if (!formData.password) {
        toast.error('كلمة المرور مطلوبة للمستخدمين الجدد');
        return;
      }
      if (formData.password.length < 6) {
        toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('كلمة المرور وتأكيد كلمة المرور غير متطابقين');
        return;
      }
    }
    
    // Validate password change for existing users
    if (dialogMode === 'edit' && formData.password) {
      if (formData.password.length < 6) {
        toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('كلمة المرور وتأكيد كلمة المرور غير متطابقين');
        return;
      }
    }
    
    try {
      const submitData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: formData.status,
      };
      
      // Process addresses
      if (formData.addresses) {
        const addressArray = formData.addresses.split(',').map(addr => addr.trim()).filter(addr => addr);
        submitData.addresses = addressArray;
      }
      
      // Only include password if it's provided
      if (formData.password) {
        submitData.password = formData.password;
      }
      
      if (selectedUser) {
        await usersAPI.update(selectedUser._id, submitData);
        toast.success('تم تحديث المستخدم بنجاح');
      } else {
        await usersAPI.create(submitData);
        toast.success('تم إنشاء المستخدم بنجاح');
      }
      handleCloseDialog();
      fetchUsers();
    } catch (err) {
      toast.error(selectedUser ? 'فشل في تحديث المستخدم' : 'فشل في إنشاء المستخدم');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await usersAPI.delete(id);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (err) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
      await usersAPI.update(id, { status: newStatus });
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'blocked'} successfully`);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update user status');
    }
  };

  const getRoleBadge = (role) => {
    return role === 'admin' ? (
      <Chip
        sx={{ p: 1 }}
        icon={<AdminIcon />}
        label="مدير"
        color="error"
        variant="filled"
        size="small"
      />
    ) : (
      <Chip
        sx={{ p: 1 }}
        icon={<PersonIcon />}
        label="مستخدم"
        color="primary"
        variant="outlined"
        size="small"
      />
    );
  };

  const getStatusBadge = (status) => {
    return status === 'active' ? (
      <Chip
        icon={<VerifiedIcon />}
        label="نشط"
        color="success"
        variant="filled"
        size="small"
      />
    ) : (
      <Chip
        icon={<BlockIcon />}
        label="محظور"
        color="error"
        variant="filled"
        size="small"
      />
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
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

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            إدارة المستخدمين
          </Typography>
          <Typography variant="body1" color="text.secondary">
            إدارة حسابات المستخدمين والعملاء
          </Typography>
        </Box>

        {/* Filters and Actions */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="البحث بالاسم، الإيميل، أو الهاتف..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl sx={{ minWidth: 120 }} fullWidth>
                  <InputLabel>الدور</InputLabel>
                  <Select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    label="الدور"
                  >
                    <MenuItem value="">الكل</MenuItem>
                    <MenuItem value="user">مستخدم</MenuItem>
                    <MenuItem value="admin">مدير</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {/* <Grid item xs={12} md={2}>
                <FormControl sx={{ minWidth: 120 }} fullWidth>
                  <InputLabel>الحالة</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="الحالة"
                  >
                    <MenuItem value="">الكل</MenuItem>
                    <MenuItem value="active">نشط</MenuItem>
                    <MenuItem value="blocked">محظور</MenuItem>
                  </Select>
                </FormControl>
              </Grid> */}
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', gap: 2 }} >
                  <Button
                    size='large'
                    variant="contained"
                    startIcon={<AddIcon sx={{ ml: 1 }} />}
                    onClick={() => handleOpenDialog('add')}
                    sx={{ flexGrow: 1 }}
                  >
                    إضافة مستخدم
                  </Button>
                  <Button
                    size='large'
                    variant="outlined"
                    startIcon={<RefreshIcon  sx={{ ml: 1 }}/>}
                    onClick={() => window.location.reload()}
                  >
                    تحديث
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3} size={3}>
            <Card sx={{ bgcolor: alpha('#1976d2', 0.1), border: '1px solid', borderColor: alpha('#1976d2', 0.2) }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} position={'relative'}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color="#1976d2">
                      {users.length}
                    </Typography>
                    <Typography variant="h6" color="text.primary">
                      إجمالي المستخدمين
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: alpha('#1976d2', 0.1), color: '#1976d2', position: 'absolute', top: 0, left: 0 }}>
                    <PersonIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3} size={3}>
            <Card sx={{ bgcolor: alpha('#2e7d32', 0.1), border: '1px solid', borderColor: alpha('#2e7d32', 0.2) }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} position={'relative'}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color="#2e7d32">
                      {users.filter(u => u.status === 'active').length}
                    </Typography>
                    <Typography variant="h6" color="text.primary">
                      المستخدمين النشطين
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: alpha('#2e7d32', 0.1), color: '#2e7d32', position: 'absolute', top: 0, left: 0 }}>
                    <VerifiedIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3} size={3} >
            <Card sx={{ bgcolor: alpha('#d32f2f', 0.1), border: '1px solid', borderColor: alpha('#d32f2f', 0.2) }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} position={'relative'}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color="#d32f2f">
                      {users.filter(u => u.role === 'admin').length}
                    </Typography>
                    <Typography variant="h6" color="text.primary">
                      المديرين
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: alpha('#d32f2f', 0.1), color: '#d32f2f', position: 'absolute', top: 0, left: 0 }}>
                    <AdminIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3} size={3}>
            <Card sx={{ bgcolor: alpha('#f57c00', 0.1), border: '1px solid', borderColor: alpha('#f57c00', 0.2) }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} position={'relative'}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color="#f57c00">
                      {users.filter(u => u.status === 'blocked').length}
                    </Typography>
                    <Typography variant="h6" color="text.primary">
                      المحظورين
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: alpha('#f57c00', 0.1), color: '#f57c00', position: 'absolute', top: 0, left: 0 }}>
                    <BlockIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Users Table */}
        <Grid container spacing={3}>
          <Grid grid={{ xs: 12, md: 8 }} size={12}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">جدول المستخدمين</Typography>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                        <TableCell sx={{ fontWeight: 600 }} align='center'>المستخدم</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align='center'>معلومات الاتصال</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align='center'>الدور</TableCell>
                        {/* <TableCell sx={{ fontWeight: 600 }} align='center'>الحالة</TableCell> */}
                        <TableCell sx={{ fontWeight: 600 }} align='center'>تاريخ التسجيل</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align='center'>الإجراءات</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow
                          key={user._id}
                          sx={{ '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) } }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ width: 40, height: 40, ml: 2 }}>
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle2" fontWeight={600} align='right'>
                                  {user.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  ID: {user._id}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <EmailIcon sx={{ fontSize: 16, ml: 1, color: 'text.secondary' }} />
                                <Typography variant="body2">{user.email}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <PhoneIcon sx={{ fontSize: 16, ml: 1, color: 'text.secondary' }} />
                                <Typography variant="body2">{user.phone}</Typography>
                              </Box>
                              {user.addresses.length > 0 && (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <LocationIcon sx={{ fontSize: 16, ml: 1, color: 'text.secondary' }} />
                                  <Typography variant="caption" color="text.secondary">
                                    {user.addresses[0]}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            {getRoleBadge(user.role)}
                          </TableCell>
                          {/* <TableCell>
                            {getStatusBadge(user.status)}
                          </TableCell> */}
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="عرض التفاصيل">
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenDialog('view', user)}
                                >
                                  <ViewIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              {/* <Tooltip title="تعديل">
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenDialog('edit', user)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip> */}
                              {/* <Tooltip title={user.status === 'active' ? "حظر" : "إلغاء الحظر"}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleToggleStatus(user._id, user.status)}
                                  color={user.status === 'active' ? "error" : "success"}
                                >
                                  {user.status === 'active' ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                                </IconButton>
                              </Tooltip> */}
                              <Tooltip title="حذف">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDelete(user._id)}
                                  color="error"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* User Dialog */}
        <Grid grid={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
              >
                <DialogTitle>
                  {dialogMode === 'add' && 'إضافة مستخدم جديد'}
                  {dialogMode === 'edit' && 'تعديل المستخدم'}
                  {dialogMode === 'view' && 'تفاصيل المستخدم'}
                </DialogTitle>
                <DialogContent>
                  <Grid container spacing={3} sx={{ mt: 1 }}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="الاسم الكامل"
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={dialogMode === 'view'}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="البريد الإلكتروني"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={dialogMode === 'view'}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="رقم الهاتف"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={dialogMode === 'view'}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label={dialogMode === 'add' ? "كلمة المرور" : "كلمة المرور الجديدة (اختياري)"}
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        disabled={dialogMode === 'view'}
                        helperText={dialogMode === 'edit' ? "اتركها فارغة إذا كنت لا تريد تغيير كلمة المرور" : "يجب أن تكون 6 أحرف على الأقل"}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="تأكيد كلمة المرور"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        disabled={dialogMode === 'view'}
                        helperText={dialogMode === 'edit' ? "اتركها فارغة إذا كنت لا تريد تغيير كلمة المرور" : "أعد إدخال كلمة المرور للتأكيد"}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth disabled={dialogMode === 'view'}>
                        <InputLabel>الدور</InputLabel>
                        <Select
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          label="الدور"
                        >
                          <MenuItem value="user">مستخدم</MenuItem>
                          <MenuItem value="admin">مدير</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="العناوين"
                        multiline
                        rows={3}
                        name="addresses"
                        value={formData.addresses}
                        onChange={(e) => setFormData({ ...formData, addresses: e.target.value })}
                        disabled={dialogMode === 'view'}
                        helperText="اكتب كل عنوان في سطر منفصل أو افصل بينها بفاصلة"
                      />
                    </Grid>
                    {dialogMode !== 'add' && (
                      <Grid item xs={12}>
                        <FormControl fullWidth disabled={dialogMode === 'view'}>
                          <InputLabel>الحالة</InputLabel>
                          <Select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            label="الحالة"
                          >
                            <MenuItem value="active">نشط</MenuItem>
                            <MenuItem value="blocked">محظور</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    )}
                    {dialogMode === 'view' && selectedUser && (
                      <Grid item xs={12}>
                        <Alert severity="info">
                          المستخدم لديه {selectedUser.wishlist.length} منتج في قائمة الأمنيات
                        </Alert>
                      </Grid>
                    )}
                  </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                  <Button onClick={handleCloseDialog}>
                    {dialogMode === 'view' ? 'إغلاق' : 'إلغاء'}
                  </Button>
                  {dialogMode !== 'view' && (
                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      disabled={loading}
                      startIcon={loading && <CircularProgress size={20} />}
                    >
                      {dialogMode === 'add' ? 'إضافة' : 'حفظ التغييرات'}
                    </Button>
                  )}
                </DialogActions>
              </Dialog>
            </CardContent>
          </Card>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default Users;