import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Divider,
  CircularProgress,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { orderService } from '../services/api';

// Mock data for demonstration
const initialOrders = [
  {
    id: 1,
    orderNumber: 'ORD-001',
    customerName: 'أحمد محمد',
    date: '2024-02-20',
    total: 1500,
    status: 'pending',
    items: [
      { name: 'منتج 1', quantity: 2, price: 500 },
      { name: 'منتج 2', quantity: 1, price: 500 },
    ],
  },
  {
    id: 2,
    orderNumber: 'ORD-002',
    customerName: 'سارة أحمد',
    date: '2024-02-19',
    total: 2300,
    status: 'completed',
    items: [
      { name: 'منتج 3', quantity: 3, price: 500 },
      { name: 'منتج 4', quantity: 2, price: 400 },
    ],
  },
  {
    id: 3,
    orderNumber: 'ORD-003',
    customerName: 'محمد علي',
    date: '2024-02-18',
    total: 1800,
    status: 'shipped',
    items: [
      { name: 'منتج 5', quantity: 1, price: 800 },
      { name: 'منتج 6', quantity: 2, price: 500 },
    ],
  },
];

const statusColors = {
  pending: 'warning',
  processing: 'info',
  shipped: 'primary',
  completed: 'success',
  cancelled: 'error',
};

const statusLabels = {
  pending: 'قيد الانتظار',
  processing: 'قيد المعالجة',
  shipped: 'تم الشحن',
  completed: 'مكتمل',
  cancelled: 'ملغي',
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [open, setOpen] = useState(false);

  const columns = [
    { field: 'orderNumber', headerName: 'رقم الطلب', width: 130 },
    { field: 'customerName', headerName: 'اسم العميل', width: 200 },
    { field: 'date', headerName: 'التاريخ', width: 130 },
    {
      field: 'total',
      headerName: 'المبلغ',
      width: 130,
      valueFormatter: (params) => `₪ ${params.value}`,
    },
    {
      field: 'status',
      headerName: 'الحالة',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={statusLabels[params.value]}
          color={statusColors[params.value]}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'الإجراءات',
      width: 100,
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => handleViewOrder(params.row)}
          size="small"
        >
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAll();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('حدث خطأ أثناء تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
  };

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    try {
      await orderService.updateStatus(selectedOrder.id, newStatus);
      setOrders(
        orders.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, status: newStatus }
            : order
        )
      );
      toast.success('تم تحديث حالة الطلب بنجاح');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('حدث خطأ أثناء تحديث حالة الطلب');
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
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        الطلبات
      </Typography>

      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={orders}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
        />
      </div>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        {selectedOrder && (
          <>
            <DialogTitle>
              تفاصيل الطلب - {selectedOrder.orderNumber}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    معلومات العميل
                  </Typography>
                  <Typography>
                    الاسم: {selectedOrder.customerName}
                  </Typography>
                  <Typography>
                    البريد الإلكتروني: {selectedOrder.customerEmail}
                  </Typography>
                  <Typography>
                    رقم الهاتف: {selectedOrder.customerPhone}
                  </Typography>
                  <Typography>
                    العنوان: {selectedOrder.shippingAddress}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    المنتجات
                  </Typography>
                  {selectedOrder.items.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 1,
                      }}
                    >
                      <Typography>
                        {item.name} × {item.quantity}
                      </Typography>
                      <Typography>₪ {item.price * item.quantity}</Typography>
                    </Box>
                  ))}
                  <Divider sx={{ my: 1 }} />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mt: 1,
                    }}
                  >
                    <Typography variant="subtitle1">المجموع</Typography>
                    <Typography variant="subtitle1">
                      ₪ {selectedOrder.total}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel>حالة الطلب</InputLabel>
                    <Select
                      value={selectedOrder.status}
                      onChange={handleStatusChange}
                      label="حالة الطلب"
                    >
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <MenuItem key={value} value={value}>
                          {label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>إغلاق</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default Orders; 