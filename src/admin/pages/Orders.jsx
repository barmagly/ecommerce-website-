import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Grid,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  ShoppingCart as OrdersIcon,
  CheckCircle,
  Schedule,
  LocalShipping,
  Cancel,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Orders = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');

  const mockOrders = [
    { _id: '1', user: 'أحمد محمد', total: 299.99, status: 'pending', createdAt: '2024-01-15', items: [] },
    { _id: '2', user: 'فاطمة علي', total: 159.50, status: 'completed', createdAt: '2024-01-14', items: [] },
    { _id: '3', user: 'محمد حسن', total: 449.99, status: 'shipped', createdAt: '2024-01-13', items: [] },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'معلق', color: 'warning', icon: <Schedule sx={{ fontSize: 14 }} /> },
      completed: { label: 'مكتمل', color: 'success', icon: <CheckCircle sx={{ fontSize: 14 }} /> },
      shipped: { label: 'مشحون', color: 'info', icon: <LocalShipping sx={{ fontSize: 14 }} /> },
      cancelled: { label: 'ملغي', color: 'error', icon: <Cancel sx={{ fontSize: 14 }} /> },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Chip
        label={config.label}
        color={config.color}
        variant="filled"
        size="small"
        icon={config.icon}
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
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            إدارة الطلبات
          </Typography>
          <Typography variant="body1" color="text.secondary">
            متابعة وإدارة طلبات العملاء
          </Typography>
        </Box>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="البحث في الطلبات..."
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
            </Grid>
          </CardContent>
        </Card>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: alpha('#1976d2', 0.1) }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color="#1976d2">
                      8,934
                    </Typography>
                    <Typography variant="h6">إجمالي الطلبات</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: alpha('#1976d2', 0.1), color: '#1976d2' }}>
                    <OrdersIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card>
          <CardContent sx={{ p: 0 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                    <TableCell sx={{ fontWeight: 600 }}>رقم الطلب</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>العميل</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>الإجمالي</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>الحالة</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>التاريخ</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>الإجراءات</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockOrders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          #{order._id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ width: 32, height: 32, mr: 2, fontSize: 14 }}>
                            {order.user.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                          <Typography variant="body2">{order.user}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          ${order.total}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(order.status)}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton size="small">
                          <ViewIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default Orders; 