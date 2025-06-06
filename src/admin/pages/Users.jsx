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
  Paper,
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
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

// Mock users data based on user.js controller
const mockUsers = [
  {
    _id: '1',
    name: 'أحمد محمد العلي',
    email: 'ahmed@example.com',
    phone: '01234567890',
    role: 'user',
    active: true,
    addresses: ['الرياض، المملكة العربية السعودية'],
    createdAt: '2024-01-15',
    wishlist: ['product1', 'product2']
  },
  {
    _id: '2',
    name: 'فاطمة سالم',
    email: 'fatima@example.com',
    phone: '01987654321',
    role: 'admin',
    active: true,
    addresses: ['جدة، المملكة العربية السعودية'],
    createdAt: '2024-01-10',
    wishlist: []
  },
  {
    _id: '3',
    name: 'محمد حسن',
    email: 'mohammed@example.com',
    phone: '01122334455',
    role: 'user',
    active: false,
    addresses: ['الدمام، المملكة العربية السعودية'],
    createdAt: '2024-01-05',
    wishlist: ['product3']
  },
  {
    _id: '4',
    name: 'سارة أحمد',
    email: 'sarah@example.com',
    phone: '01555666777',
    role: 'user',
    active: true,
    addresses: ['مكة المكرمة، المملكة العربية السعودية'],
    createdAt: '2024-01-12',
    wishlist: ['product1', 'product4']
  }
];

const Users = () => {
  const theme = useTheme();
  const [users, setUsers] = useState(mockUsers);
  const [loading, setLoading] = useState(false);
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
    role: 'user',
    active: true,
    addresses: '',
  });

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm);
    const matchesRole = roleFilter === '' || user.role === roleFilter;
    const matchesStatus = statusFilter === '' || user.active.toString() === statusFilter;
    
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
        role: user.role,
        active: user.active,
        addresses: user.addresses.join(', '),
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'user',
        active: true,
        addresses: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (dialogMode === 'add') {
        const newUser = {
          _id: Date.now().toString(),
          ...formData,
          addresses: formData.addresses.split(',').map(addr => addr.trim()),
          createdAt: new Date().toISOString().split('T')[0],
          wishlist: []
        };
        setUsers([...users, newUser]);
        toast.success('تم إضافة المستخدم بنجاح!');
      } else if (dialogMode === 'edit') {
        const updatedUsers = users.map(user =>
          user._id === selectedUser._id
            ? {
                ...user,
                ...formData,
                addresses: formData.addresses.split(',').map(addr => addr.trim())
              }
            : user
        );
        setUsers(updatedUsers);
        toast.success('تم تحديث المستخدم بنجاح!');
      }
      
      handleCloseDialog();
    } catch (error) {
      toast.error('حدث خطأ في العملية');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setUsers(users.filter(user => user._id !== userId));
        toast.success('تم حذف المستخدم بنجاح!');
      } catch (error) {
        toast.error('فشل في حذف المستخدم');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      const updatedUsers = users.map(user =>
        user._id === userId ? { ...user, active: !user.active } : user
      );
      setUsers(updatedUsers);
      toast.success('تم تحديث حالة المستخدم!');
    } catch (error) {
      toast.error('فشل في تحديث الحالة');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    return role === 'admin' ? (
      <Chip
        icon={<AdminIcon />}
        label="مدير"
        color="error"
        variant="filled"
        size="small"
      />
    ) : (
      <Chip
        icon={<PersonIcon />}
        label="مستخدم"
        color="primary"
        variant="outlined"
        size="small"
      />
    );
  };

  const getStatusBadge = (active) => {
    return active ? (
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
                <FormControl fullWidth>
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
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>الحالة</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="الحالة"
                  >
                    <MenuItem value="">الكل</MenuItem>
                    <MenuItem value="true">نشط</MenuItem>
                    <MenuItem value="false">محظور</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog('add')}
                    sx={{ flexGrow: 1 }}
                  >
                    إضافة مستخدم
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
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
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: alpha('#1976d2', 0.1), border: '1px solid', borderColor: alpha('#1976d2', 0.2) }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color="#1976d2">
                      {users.length}
                    </Typography>
                    <Typography variant="h6" color="text.primary">
                      إجمالي المستخدمين
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: alpha('#1976d2', 0.1), color: '#1976d2' }}>
                    <PersonIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: alpha('#2e7d32', 0.1), border: '1px solid', borderColor: alpha('#2e7d32', 0.2) }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color="#2e7d32">
                      {users.filter(u => u.active).length}
                    </Typography>
                    <Typography variant="h6" color="text.primary">
                      المستخدمين النشطين
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: alpha('#2e7d32', 0.1), color: '#2e7d32' }}>
                    <VerifiedIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: alpha('#d32f2f', 0.1), border: '1px solid', borderColor: alpha('#d32f2f', 0.2) }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color="#d32f2f">
                      {users.filter(u => u.role === 'admin').length}
                    </Typography>
                    <Typography variant="h6" color="text.primary">
                      المديرين
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: alpha('#d32f2f', 0.1), color: '#d32f2f' }}>
                    <AdminIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: alpha('#f57c00', 0.1), border: '1px solid', borderColor: alpha('#f57c00', 0.2) }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color="#f57c00">
                      {users.filter(u => !u.active).length}
                    </Typography>
                    <Typography variant="h6" color="text.primary">
                      المحظورين
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: alpha('#f57c00', 0.1), color: '#f57c00' }}>
                    <BlockIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Users Table */}
        <Card>
          <CardContent sx={{ p: 0 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                    <TableCell sx={{ fontWeight: 600 }}>المستخدم</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>معلومات الاتصال</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>الدور</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>الحالة</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>تاريخ التسجيل</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>الإجراءات</TableCell>
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
                          <Avatar sx={{ width: 40, height: 40, mr: 2 }}>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
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
                            <EmailIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">{user.email}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <PhoneIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">{user.phone}</Typography>
                          </Box>
                          {user.addresses.length > 0 && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <LocationIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
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
                      <TableCell>
                        {getStatusBadge(user.active)}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(user.createdAt).toLocaleDateString('ar-SA')}
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
                          <Tooltip title="تعديل">
                            <IconButton 
                              size="small" 
                              onClick={() => handleOpenDialog('edit', user)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={user.active ? "حظر" : "إلغاء الحظر"}>
                            <IconButton 
                              size="small" 
                              onClick={() => handleToggleStatus(user._id)}
                              color={user.active ? "error" : "success"}
                            >
                              <BlockIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
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

        {/* User Dialog */}
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
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={dialogMode === 'view'}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="رقم الهاتف"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={dialogMode === 'view'}
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
                      value={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.value })}
                      label="الحالة"
                    >
                      <MenuItem value={true}>نشط</MenuItem>
                      <MenuItem value={false}>محظور</MenuItem>
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
      </motion.div>
    </Box>
  );
};

export default Users;