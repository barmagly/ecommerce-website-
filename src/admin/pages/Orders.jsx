import React, { useState, useEffect, useRef } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Stack,
  TablePagination,
  Menu,
  ListItemIcon,
} from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import InvoicePrint from '../components/InvoicePrint';
import { exportInvoiceAsPDF, printInvoice } from '../components/InvoiceExporter';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  ShoppingCart as OrdersIcon,
  CheckCircle,
  Schedule,
  LocalShipping,
  Cancel,
  AttachMoney,
  TrendingUp,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  Delete as DeleteIcon,
  Assignment as InvoiceIcon,
  PictureAsPdf as PdfIcon,

  Download as DownloadIcon,
  TableChart as ExportIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Orders = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [editOrderOpen, setEditOrderOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderToPrint, setOrderToPrint] = useState(null);
  
  // Print functionality
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `فاتورة-${orderToPrint?.orderNumber || 'غير محدد'}`,
    onAfterPrint: () => {
      setOrderToPrint(null);
    },
  });

  // Initialize orders data
  useEffect(() => {
    const savedOrders = localStorage.getItem('adminOrders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      // Sample data
      const sampleOrders = [
        {
          _id: 'ORD001',
          orderNumber: 'ORD-2024-001',
          customer: {
            name: 'أحمد محمد علي',
            email: 'ahmed@example.com',
            phone: '+966501234567',
            avatar: 'أم'
          },
          items: [
            {
              _id: 'item1',
              name: 'هاتف ذكي سامسونج',
              image: '/api/placeholder/60/60',
              price: 1299.99,
              quantity: 1,
              sku: 'SAM-A54-BLK'
            },
            {
              _id: 'item2',
              name: 'غطاء حماية شفاف',
              image: '/api/placeholder/60/60',
              price: 49.99,
              quantity: 2,
              sku: 'CASE-CLEAR-001'
            }
          ],
          subtotal: 1299.99,
          tax: 194.99,
          shipping: 25.00,
          discount: 50.00,
          total: 1469.98,
          status: 'pending',
          paymentStatus: 'paid',
          paymentMethod: 'credit_card',
          shippingAddress: {
            street: 'شارع الملك فهد، حي العليا',
            city: 'الرياض',
            state: 'منطقة الرياض',
            zipCode: '12345',
            country: 'المملكة العربية السعودية'
          },
          billingAddress: {
            street: 'شارع الملك فهد، حي العليا',
            city: 'الرياض',
            state: 'منطقة الرياض',
            zipCode: '12345',
            country: 'المملكة العربية السعودية'
          },
          trackingNumber: 'TRK123456789',
          estimatedDelivery: '2024-01-20',
          notes: 'يرجى التسليم في المساء',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
          orderHistory: [
            {
              status: 'pending',
              timestamp: '2024-01-15T10:30:00Z',
              note: 'تم إنشاء الطلب'
            }
          ]
        },
        {
          _id: 'ORD002',
          orderNumber: 'ORD-2024-002',
          customer: {
            name: 'فاطمة علي حسن',
            email: 'fatima@example.com',
            phone: '+966509876543',
            avatar: 'فع'
          },
          items: [
            {
              _id: 'item3',
              name: 'ساعة ذكية آبل',
              image: '/api/placeholder/60/60',
              price: 899.99,
              quantity: 1,
              sku: 'APL-WATCH-S9'
            }
          ],
          subtotal: 899.99,
          tax: 134.99,
          shipping: 0.00,
          discount: 100.00,
          total: 934.98,
          status: 'shipped',
          paymentStatus: 'paid',
          paymentMethod: 'apple_pay',
          shippingAddress: {
            street: 'طريق الأمير محمد بن عبدالعزيز',
            city: 'جدة',
            state: 'منطقة مكة المكرمة',
            zipCode: '21589',
            country: 'المملكة العربية السعودية'
          },
          billingAddress: {
            street: 'طريق الأمير محمد بن عبدالعزيز',
            city: 'جدة',
            state: 'منطقة مكة المكرمة',
            zipCode: '21589',
            country: 'المملكة العربية السعودية'
          },
          trackingNumber: 'TRK987654321',
          estimatedDelivery: '2024-01-18',
          notes: '',
          createdAt: '2024-01-14T14:20:00Z',
          updatedAt: '2024-01-16T09:15:00Z',
          orderHistory: [
            {
              status: 'pending',
              timestamp: '2024-01-14T14:20:00Z',
              note: 'تم إنشاء الطلب'
            },
            {
              status: 'processing',
              timestamp: '2024-01-15T08:00:00Z',
              note: 'تم تأكيد الطلب وبدء المعالجة'
            },
            {
              status: 'shipped',
              timestamp: '2024-01-16T09:15:00Z',
              note: 'تم شحن الطلب'
            }
          ]
        },
        {
          _id: 'ORD003',
          orderNumber: 'ORD-2024-003',
          customer: {
            name: 'محمد حسن أحمد',
            email: 'mohammed@example.com',
            phone: '+966512345678',
            avatar: 'مح'
          },
          items: [
            {
              _id: 'item4',
              name: 'لابتوب ديل XPS',
              image: '/api/placeholder/60/60',
              price: 3299.99,
              quantity: 1,
              sku: 'DELL-XPS-13'
            },
            {
              _id: 'item5',
              name: 'فأرة لاسلكية',
              image: '/api/placeholder/60/60',
              price: 79.99,
              quantity: 1,
              sku: 'MOUSE-WL-001'
            }
          ],
          subtotal: 3379.98,
          tax: 506.99,
          shipping: 50.00,
          discount: 200.00,
          total: 3736.97,
          status: 'completed',
          paymentStatus: 'paid',
          paymentMethod: 'bank_transfer',
          shippingAddress: {
            street: 'شارع التحلية، حي السليمانية',
            city: 'الرياض',
            state: 'منطقة الرياض',
            zipCode: '11564',
            country: 'المملكة العربية السعودية'
          },
          billingAddress: {
            street: 'شارع التحلية، حي السليمانية',
            city: 'الرياض',
            state: 'منطقة الرياض',
            zipCode: '11564',
            country: 'المملكة العربية السعودية'
          },
          trackingNumber: 'TRK456789123',
          estimatedDelivery: '2024-01-17',
          notes: 'تم التسليم بنجاح',
          createdAt: '2024-01-13T16:45:00Z',
          updatedAt: '2024-01-17T14:30:00Z',
          orderHistory: [
            {
              status: 'pending',
              timestamp: '2024-01-13T16:45:00Z',
              note: 'تم إنشاء الطلب'
            },
            {
              status: 'processing',
              timestamp: '2024-01-14T09:00:00Z',
              note: 'تم تأكيد الطلب وبدء المعالجة'
            },
            {
              status: 'shipped',
              timestamp: '2024-01-15T11:30:00Z',
              note: 'تم شحن الطلب'
            },
            {
              status: 'completed',
              timestamp: '2024-01-17T14:30:00Z',
              note: 'تم تسليم الطلب بنجاح'
            }
          ]
        },
        {
          _id: 'ORD004',
          orderNumber: 'ORD-2024-004',
          customer: {
            name: 'سارة عبدالله',
            email: 'sara@example.com',
            phone: '+966523456789',
            avatar: 'سع'
          },
          items: [
            {
              _id: 'item6',
              name: 'سماعات بلوتوث',
              image: '/api/placeholder/60/60',
              price: 199.99,
              quantity: 2,
              sku: 'BT-HEADPHONE-001'
            }
          ],
          subtotal: 399.98,
          tax: 59.99,
          shipping: 15.00,
          discount: 0.00,
          total: 474.97,
          status: 'cancelled',
          paymentStatus: 'refunded',
          paymentMethod: 'credit_card',
          shippingAddress: {
            street: 'شارع الأمير سلطان، حي الزهراء',
            city: 'الدمام',
            state: 'المنطقة الشرقية',
            zipCode: '31461',
            country: 'المملكة العربية السعودية'
          },
          billingAddress: {
            street: 'شارع الأمير سلطان، حي الزهراء',
            city: 'الدمام',
            state: 'المنطقة الشرقية',
            zipCode: '31461',
            country: 'المملكة العربية السعودية'
          },
          trackingNumber: '',
          estimatedDelivery: '',
          notes: 'تم إلغاء الطلب بناء على طلب العميل',
          createdAt: '2024-01-12T11:20:00Z',
          updatedAt: '2024-01-13T08:45:00Z',
          orderHistory: [
            {
              status: 'pending',
              timestamp: '2024-01-12T11:20:00Z',
              note: 'تم إنشاء الطلب'
            },
            {
              status: 'cancelled',
              timestamp: '2024-01-13T08:45:00Z',
              note: 'تم إلغاء الطلب بناء على طلب العميل'
            }
          ]
        }
      ];
      setOrders(sampleOrders);
      localStorage.setItem('adminOrders', JSON.stringify(sampleOrders));
    }
  }, []);

  // Save orders to localStorage whenever orders change
  const saveOrders = (updatedOrders) => {
    setOrders(updatedOrders);
    localStorage.setItem('adminOrders', JSON.stringify(updatedOrders));
  };

  // Utility functions
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'معلق', color: 'warning', icon: <Schedule sx={{ fontSize: 14 }} /> },
      processing: { label: 'قيد المعالجة', color: 'info', icon: <Schedule sx={{ fontSize: 14 }} /> },
      shipped: { label: 'مشحون', color: 'primary', icon: <LocalShipping sx={{ fontSize: 14 }} /> },
      completed: { label: 'مكتمل', color: 'success', icon: <CheckCircle sx={{ fontSize: 14 }} /> },
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

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      paid: { label: 'مدفوع', color: 'success' },
      pending: { label: 'معلق', color: 'warning' },
      failed: { label: 'فشل', color: 'error' },
      refunded: { label: 'مسترد', color: 'default' },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Chip
        label={config.label}
        color={config.color}
        variant="outlined"
        size="small"
      />
    );
  };

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    totalRevenue: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total, 0),
    avgOrderValue: orders.length > 0 ? orders.reduce((sum, o) => sum + o.total, 0) / orders.length : 0
  };

  // Event handlers
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setEditOrderOpen(true);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => {
      if (order._id === orderId) {
        const updatedOrder = {
          ...order,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          orderHistory: [
            ...order.orderHistory,
            {
              status: newStatus,
              timestamp: new Date().toISOString(),
              note: `تم تحديث الحالة إلى ${getStatusBadge(newStatus).props.label}`
            }
          ]
        };
        return updatedOrder;
      }
      return order;
    });
    saveOrders(updatedOrders);
    setMenuAnchorEl(null);
  };

  const handleDeleteOrder = (orderId) => {
    const updatedOrders = orders.filter(order => order._id !== orderId);
    saveOrders(updatedOrders);
    setMenuAnchorEl(null);
  };

  const handleMenuClick = (event, orderId) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedOrderId(orderId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedOrderId(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handlePrintInvoice = (order) => {
    setOrderToPrint(order);
    setTimeout(() => {
      printInvoice(printRef);
    }, 100);
  };

  const handleExportPDF = (order) => {
    setOrderToPrint(order);
    setTimeout(() => {
      exportInvoiceAsPDF(printRef, order.orderNumber);
    }, 100);
  };



  const handleSendEmail = (order) => {
    // في تطبيق حقيقي، سيتم إرسال إيميل للعميل
    alert(`سيتم إرسال إيميل للعميل ${order.customer.name} على ${order.customer.email}`);
  };

  const handlePrintReport = () => {
    try {
      const reportWindow = window.open('', '_blank', 'width=1200,height=800');
      const currentDate = new Date().toLocaleDateString('ar-EG', { calendar: 'gregory' });
      const currentTime = new Date().toLocaleTimeString('ar-SA');
      
      if (!reportWindow) {
        alert('يرجى السماح بفتح النوافذ المنبثقة لطباعة التقرير');
        return;
      }
    
    reportWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تقرير الطلبات</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Arial', 'Tahoma', sans-serif;
            direction: rtl;
            background: white;
            padding: 30px;
            line-height: 1.6;
            color: #333;
          }
          
          @media print {
            body { padding: 15px; }
            .no-print { display: none; }
          }
          
          .report-header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #1976d2;
            padding-bottom: 20px;
          }
          
          .company-title {
            font-size: 32px;
            font-weight: bold;
            color: #1976d2;
            margin-bottom: 10px;
          }
          
          .report-title {
            font-size: 24px;
            color: #666;
            margin-bottom: 10px;
          }
          
          .report-date {
            font-size: 14px;
            color: #888;
          }
          
          .stats-section {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
          }
          
          .stat-card {
            background: #f8f9fa;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
          }
          
          .stat-value {
            font-size: 28px;
            font-weight: bold;
            color: #1976d2;
            margin-bottom: 5px;
          }
          
          .stat-label {
            color: #666;
            font-size: 14px;
          }
          
          .orders-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            border: 1px solid #ddd;
          }
          
          .orders-table th,
          .orders-table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: right;
            font-size: 13px;
          }
          
          .orders-table th {
            background-color: #1976d2;
            color: white;
            font-weight: bold;
            text-align: center;
          }
          
          .orders-table tr:nth-child(even) {
            background-color: #f8f9fa;
          }
          
          .status-badge {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: bold;
            color: white;
          }
          
          .status-pending { background-color: #ff9800; }
          .status-processing { background-color: #2196f3; }
          .status-shipped { background-color: #4caf50; }
          .status-completed { background-color: #8bc34a; }
          .status-cancelled { background-color: #f44336; }
          
          .payment-paid { color: #4caf50; font-weight: bold; }
          .payment-pending { color: #ff9800; font-weight: bold; }
          
          .footer {
            margin-top: 40px;
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 12px;
          }
          
          @page {
            margin: 1cm;
            size: A4 landscape;
          }
        </style>
      </head>
      <body>
        <div class="report-header">
          <div class="company-title">🛍️ المتجر الإلكتروني</div>
          <div class="report-title">تقرير شامل للطلبات</div>
          <div class="report-date">تاريخ التقرير: ${currentDate} - ${currentTime}</div>
        </div>
        
        <div class="stats-section">
          <div class="stat-card">
            <div class="stat-value">${stats.total}</div>
            <div class="stat-label">إجمالي الطلبات</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.completed}</div>
            <div class="stat-label">طلبات مكتملة</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.pending}</div>
            <div class="stat-label">طلبات معلقة</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">$${stats.totalRevenue.toFixed(2)}</div>
            <div class="stat-label">إجمالي المبيعات</div>
          </div>
        </div>
        
        <table class="orders-table">
          <thead>
            <tr>
              <th>رقم الطلب</th>
              <th>العميل</th>
              <th>البريد الإلكتروني</th>
              <th>الهاتف</th>
              <th>عدد المنتجات</th>
              <th>الإجمالي</th>
              <th>حالة الطلب</th>
              <th>حالة الدفع</th>
              <th>التاريخ</th>
            </tr>
          </thead>
          <tbody>
            ${filteredOrders.map(order => `
              <tr>
                <td style="font-weight: bold;">${order.orderNumber}</td>
                <td>${order.customer.name}</td>
                <td>${order.customer.email}</td>
                <td>${order.customer.phone}</td>
                <td style="text-align: center;">${order.items.length}</td>
                <td style="text-align: center; font-weight: bold;">$${order.total.toFixed(2)}</td>
                <td style="text-align: center;">
                  <span class="status-badge status-${order.status}">
                    ${order.status === 'pending' ? 'معلق' : 
                      order.status === 'processing' ? 'قيد المعالجة' :
                      order.status === 'shipped' ? 'مشحون' :
                      order.status === 'completed' ? 'مكتمل' : 'ملغي'}
                  </span>
                </td>
                <td style="text-align: center;">
                  <span class="payment-${order.paymentStatus}">
                    ${order.paymentStatus === 'paid' ? 'مدفوع' : 'معلق'}
                  </span>
                </td>
                <td style="text-align: center;">${new Date(order.createdAt).toLocaleDateString('ar-EG', { calendar: 'gregory' })}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <p>تم إنشاء هذا التقرير في ${currentDate} الساعة ${currentTime}</p>
          <p>المتجر الإلكتروني - نظام إدارة الطلبات</p>
        </div>
        
        <script>
          window.onload = function() {
            setTimeout(() => {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            }, 1000);
          }
        </script>
      </body>
      </html>
    `);
    
         reportWindow.document.close();
    } catch (error) {
      console.error('Error printing report:', error);
      alert('حدث خطأ أثناء إنشاء التقرير. يرجى المحاولة مرة أخرى.');
    }
  };

  const handleExportCSV = () => {
    try {
      const headers = ['رقم الطلب', 'العميل', 'البريد الإلكتروني', 'الهاتف', 'عدد المنتجات', 'الإجمالي', 'حالة الطلب', 'حالة الدفع', 'التاريخ'];
      
      const csvData = filteredOrders.map(order => [
        order.orderNumber,
        order.customer.name,
        order.customer.email,
        order.customer.phone,
        order.items.length,
        `$${order.total.toFixed(2)}`,
        order.status === 'pending' ? 'معلق' : 
        order.status === 'processing' ? 'قيد المعالجة' :
        order.status === 'shipped' ? 'مشحون' :
        order.status === 'completed' ? 'مكتمل' : 'ملغي',
        order.paymentStatus === 'paid' ? 'مدفوع' : 'معلق',
                  new Date(order.createdAt).toLocaleDateString('ar-EG', { calendar: 'gregory' })
      ]);
      
      const csvContent = [headers, ...csvData]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');
      
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `تقرير-الطلبات-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert('تم تصدير التقرير بنجاح!');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('حدث خطأ أثناء تصدير التقرير. يرجى المحاولة مرة أخرى.');
    }
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
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>تصفية حسب الحالة</InputLabel>
                  <Select
                    value={statusFilter}
                    label="تصفية حسب الحالة"
                    onChange={(e) => setStatusFilter(e.target.value)}
                    startAdornment={<FilterIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                  >
                    <MenuItem value="all">جميع الطلبات</MenuItem>
                    <MenuItem value="pending">معلقة</MenuItem>
                    <MenuItem value="processing">قيد المعالجة</MenuItem>
                    <MenuItem value="shipped">مشحونة</MenuItem>
                    <MenuItem value="completed">مكتملة</MenuItem>
                    <MenuItem value="cancelled">ملغية</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    variant="outlined" 
                    startIcon={<PrintIcon />}
                    onClick={handlePrintReport}
                    sx={{
                      flex: 1,
                      '&:hover': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                        transform: 'translateY(-1px)'
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    طباعة
                  </Button>
                  <Button 
                    variant="contained" 
                    startIcon={<ExportIcon />}
                    onClick={handleExportCSV}
                    color="success"
                    sx={{
                      flex: 1,
                      '&:hover': {
                        transform: 'translateY(-1px)'
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    تصدير
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card sx={{ 
                bgcolor: alpha('#1976d2', 0.1),
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { transform: 'translateY(-4px)' }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" fontWeight="bold" color="#1976d2">
                        {stats.total}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">إجمالي الطلبات</Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: '#1976d2', color: 'white', width: 48, height: 48 }}>
                      <OrdersIcon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card sx={{ 
                bgcolor: alpha('#2e7d32', 0.1),
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { transform: 'translateY(-4px)' }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" fontWeight="bold" color="#2e7d32">
                        {stats.completed}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">طلبات مكتملة</Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: '#2e7d32', color: 'white', width: 48, height: 48 }}>
                      <CheckCircle />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card sx={{ 
                bgcolor: alpha('#ed6c02', 0.1),
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { transform: 'translateY(-4px)' }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" fontWeight="bold" color="#ed6c02">
                        {stats.pending}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">طلبات معلقة</Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: '#ed6c02', color: 'white', width: 48, height: 48 }}>
                      <Schedule />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Card sx={{ 
                bgcolor: alpha('#9c27b0', 0.1),
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { transform: 'translateY(-4px)' }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" fontWeight="bold" color="#9c27b0">
                        ${stats.totalRevenue.toFixed(2)}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">إجمالي المبيعات</Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: '#9c27b0', color: 'white', width: 48, height: 48 }}>
                      <AttachMoney />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
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
                    <TableCell sx={{ fontWeight: 600 }}>المنتجات</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>الإجمالي</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>حالة الطلب</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>حالة الدفع</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>التاريخ</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>الإجراءات</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((order, index) => (
                    <motion.tr
                      key={order._id}
                      component={TableRow}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      sx={{ 
                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02) },
                        cursor: 'pointer'
                      }}
                      onClick={() => handleViewOrder(order)}
                    >
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {order.orderNumber}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {order._id}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ width: 40, height: 40, mr: 2, fontSize: 14 }}>
                            {order.customer.avatar}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {order.customer.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {order.customer.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {order.items.length} منتج
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {order.items.reduce((sum, item) => sum + item.quantity, 0)} قطعة
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6" fontWeight={600} color="primary">
                          ${order.total.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(order.status)}
                      </TableCell>
                      <TableCell>
                        {getPaymentStatusBadge(order.paymentStatus)}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                                                        {new Date(order.createdAt).toLocaleDateString('ar-EG', { calendar: 'gregory' })}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(order.createdAt).toLocaleTimeString('ar-SA', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton 
                            size="small" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewOrder(order);
                            }}
                            sx={{ color: 'info.main' }}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditOrder(order);
                            }}
                            sx={{ color: 'warning.main' }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMenuClick(e, order._id);
                            }}
                          >
                            <MoreIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              component="div"
              count={filteredOrders.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelRowsPerPage="عدد الصفوف في الصفحة:"
              labelDisplayedRows={({ from, to, count }) => 
                `${from}-${to} من ${count !== -1 ? count : `أكثر من ${to}`}`
              }
            />
          </CardContent>
        </Card>
        {/* Action Menu */}
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={() => handleUpdateOrderStatus(selectedOrderId, 'processing')}>
            <ListItemIcon>
              <Schedule fontSize="small" />
            </ListItemIcon>
            <ListItemText>تحديث إلى "قيد المعالجة"</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleUpdateOrderStatus(selectedOrderId, 'shipped')}>
            <ListItemIcon>
              <LocalShipping fontSize="small" />
            </ListItemIcon>
            <ListItemText>تحديث إلى "مشحون"</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleUpdateOrderStatus(selectedOrderId, 'completed')}>
            <ListItemIcon>
              <CheckCircle fontSize="small" />
            </ListItemIcon>
            <ListItemText>تحديث إلى "مكتمل"</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => {
            const order = orders.find(o => o._id === selectedOrderId);
            if (order) handlePrintInvoice(order);
            handleMenuClose();
          }}>
            <ListItemIcon>
              <PrintIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>طباعة الفاتورة</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => {
            const order = orders.find(o => o._id === selectedOrderId);
            if (order) handleExportPDF(order);
            handleMenuClose();
          }}>
            <ListItemIcon>
              <PdfIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>تصدير كـ PDF</ListItemText>
          </MenuItem>

          <MenuItem onClick={() => {
            const order = orders.find(o => o._id === selectedOrderId);
            if (order) handleSendEmail(order);
            handleMenuClose();
          }}>
            <ListItemIcon>
              <EmailIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>إرسال إيميل للعميل</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleDeleteOrder(selectedOrderId)} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
            </ListItemIcon>
            <ListItemText>حذف الطلب</ListItemText>
          </MenuItem>
        </Menu>

        {/* Order Details Dialog */}
        <Dialog
          open={orderDetailsOpen}
          onClose={() => setOrderDetailsOpen(false)}
          maxWidth="md"
          fullWidth
        >
          {selectedOrder && (
            <>
              <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6">تفاصيل الطلب {selectedOrder.orderNumber}</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {getStatusBadge(selectedOrder.status)}
                    {getPaymentStatusBadge(selectedOrder.paymentStatus)}
                  </Box>
                </Box>
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ p: 2, mb: 2 }}>
                      <Typography variant="h6" gutterBottom>معلومات العميل</Typography>
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ width: 48, height: 48 }}>
                            {selectedOrder.customer.avatar}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {selectedOrder.customer.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {selectedOrder.customer.email}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {selectedOrder.customer.phone}
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                    </Card>

                    <Card sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>عنوان التسليم</Typography>
                      <Typography variant="body2">
                        {selectedOrder.shippingAddress.street}<br/>
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}<br/>
                        {selectedOrder.shippingAddress.zipCode}<br/>
                        {selectedOrder.shippingAddress.country}
                      </Typography>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card sx={{ p: 2, mb: 2 }}>
                      <Typography variant="h6" gutterBottom>تفاصيل الطلب</Typography>
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography>تاريخ الطلب:</Typography>
                          <Typography>{new Date(selectedOrder.createdAt).toLocaleString('ar-SA')}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography>طريقة الدفع:</Typography>
                          <Typography>{selectedOrder.paymentMethod}</Typography>
                        </Box>
                        {selectedOrder.trackingNumber && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography>رقم التتبع:</Typography>
                            <Typography fontWeight={600}>{selectedOrder.trackingNumber}</Typography>
                          </Box>
                        )}
                        {selectedOrder.estimatedDelivery && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography>تاريخ التسليم المتوقع:</Typography>
                            <Typography>{new Date(selectedOrder.estimatedDelivery).toLocaleDateString('ar-EG', { calendar: 'gregory' })}</Typography>
                          </Box>
                        )}
                      </Stack>
                    </Card>

                    <Card sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>ملخص المبالغ</Typography>
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography>المجموع الفرعي:</Typography>
                          <Typography>${selectedOrder.subtotal.toFixed(2)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography>الضريبة:</Typography>
                          <Typography>${selectedOrder.tax.toFixed(2)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography>الشحن:</Typography>
                          <Typography>${selectedOrder.shipping.toFixed(2)}</Typography>
                        </Box>
                        {selectedOrder.discount > 0 && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography>الخصم:</Typography>
                            <Typography color="success.main">-${selectedOrder.discount.toFixed(2)}</Typography>
                          </Box>
                        )}
                        <Divider />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="h6">المجموع الكلي:</Typography>
                          <Typography variant="h6" color="primary.main">
                            ${selectedOrder.total.toFixed(2)}
                          </Typography>
                        </Box>
                      </Stack>
                    </Card>
                  </Grid>

                  <Grid item xs={12}>
                    <Card sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>المنتجات</Typography>
                      <List>
                        {selectedOrder.items.map((item, index) => (
                          <React.Fragment key={item._id}>
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar
                                  variant="rounded"
                                  src={item.image}
                                  sx={{ width: 60, height: 60 }}
                                />
                              </ListItemAvatar>
                              <ListItemText
                                primary={item.name}
                                secondary={
                                  <Box>
                                    <Typography variant="body2" color="text.secondary">
                                      SKU: {item.sku}
                                    </Typography>
                                    <Typography variant="body2">
                                      الكمية: {item.quantity} × ${item.price.toFixed(2)}
                                    </Typography>
                                  </Box>
                                }
                              />
                              <Typography variant="h6" color="primary.main">
                                ${(item.price * item.quantity).toFixed(2)}
                              </Typography>
                            </ListItem>
                            {index < selectedOrder.items.length - 1 && <Divider />}
                          </React.Fragment>
                        ))}
                      </List>
                    </Card>
                  </Grid>

                  {selectedOrder.notes && (
                    <Grid item xs={12}>
                      <Card sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>ملاحظات</Typography>
                        <Typography variant="body2">{selectedOrder.notes}</Typography>
                      </Card>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Card sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>تاريخ الطلب</Typography>
                      <List>
                        {selectedOrder.orderHistory.map((history, index) => (
                          <ListItem key={index}>
                            <ListItemText
                              primary={history.note}
                              secondary={new Date(history.timestamp).toLocaleString('ar-SA')}
                            />
                            {getStatusBadge(history.status)}
                          </ListItem>
                        ))}
                      </List>
                    </Card>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ flexWrap: 'wrap', gap: 1, justifyContent: 'space-between' }}>
                <Button onClick={() => setOrderDetailsOpen(false)}>إغلاق</Button>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button 
                    variant="contained" 
                    startIcon={<PrintIcon />}
                    onClick={() => handlePrintInvoice(selectedOrder)}
                    size="small"
                  >
                    طباعة
                  </Button>
                  <Button 
                    variant="contained" 
                    color="secondary"
                    startIcon={<PdfIcon />}
                    onClick={() => handleExportPDF(selectedOrder)}
                    size="small"
                  >
                    PDF
                  </Button>

                  <Button 
                    variant="outlined" 
                    startIcon={<EmailIcon />}
                    onClick={() => handleSendEmail(selectedOrder)}
                    size="small"
                  >
                    إيميل
                  </Button>
                </Box>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Edit Order Dialog */}
        <Dialog
          open={editOrderOpen}
          onClose={() => setEditOrderOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          {selectedOrder && (
            <>
              <DialogTitle>تعديل الطلب {selectedOrder.orderNumber}</DialogTitle>
              <DialogContent>
                <Stack spacing={3} sx={{ mt: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel>حالة الطلب</InputLabel>
                    <Select
                      value={selectedOrder.status}
                      label="حالة الطلب"
                      onChange={(e) => setSelectedOrder({ ...selectedOrder, status: e.target.value })}
                    >
                      <MenuItem value="pending">معلق</MenuItem>
                      <MenuItem value="processing">قيد المعالجة</MenuItem>
                      <MenuItem value="shipped">مشحون</MenuItem>
                      <MenuItem value="completed">مكتمل</MenuItem>
                      <MenuItem value="cancelled">ملغي</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    label="رقم التتبع"
                    value={selectedOrder.trackingNumber || ''}
                    onChange={(e) => setSelectedOrder({ ...selectedOrder, trackingNumber: e.target.value })}
                  />

                  <TextField
                    fullWidth
                    label="ملاحظات"
                    multiline
                    rows={3}
                    value={selectedOrder.notes || ''}
                    onChange={(e) => setSelectedOrder({ ...selectedOrder, notes: e.target.value })}
                  />
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setEditOrderOpen(false)}>إلغاء</Button>
                <Button 
                  variant="contained"
                  onClick={() => {
                    const updatedOrders = orders.map(order => 
                      order._id === selectedOrder._id 
                        ? { 
                            ...selectedOrder, 
                            updatedAt: new Date().toISOString(),
                            orderHistory: [
                              ...order.orderHistory,
                              {
                                status: selectedOrder.status,
                                timestamp: new Date().toISOString(),
                                note: 'تم تحديث الطلب من قبل المدير'
                              }
                            ]
                          }
                        : order
                    );
                    saveOrders(updatedOrders);
                    setEditOrderOpen(false);
                  }}
                >
                  حفظ التغييرات
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Hidden Print Component */}
        <Box sx={{ display: 'none' }}>
          <InvoicePrint ref={printRef} order={orderToPrint} />
        </Box>
      </motion.div>
    </Box>
  );
};

export default Orders; 