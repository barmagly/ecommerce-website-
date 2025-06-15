import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  InputAdornment,
  Tooltip,
  useTheme,
  alpha,
  CircularProgress,
  Avatar,
  Rating,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Badge,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Search as SearchIcon,
  Star as StarIcon,
  ThumbUp as LikeIcon,
  ThumbDown as DislikeIcon,
  Reply as ReplyIcon,
  Block as BlockIcon,
  CheckCircle as ApproveIcon,
  Refresh as RefreshIcon,
  FilterAlt as FilterIcon,
  TrendingUp as TrendingIcon,
  Reviews as ReviewsIcon,
  Report as ReportIcon,
  Person as PersonIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { reviewsAPI } from '../services/api';

const Reviews = () => {
  const theme = useTheme();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterRating, setFilterRating] = useState('');
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('view');
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const response = await reviewsAPI.getAll();
      if (response.data.status === 'success') {
        setReviews(response.data.reviews.map(review => ({
          id: review._id,
          productId: review.product?._id || null,
          productName: review.product?.name || 'Deleted Product',
          userId: review.user?._id || null,
          userName: review.user?.name || 'Deleted User',
          userAvatar: review.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user?.name || 'U')}&background=random`,
          rating: review.rating || 0,
          title: review.comment?.split('\n')[0] || 'No Title',
          comment: review.comment || '',
          images: review.images || [],
          status: review.status || 'pending',
          isVerified: review.isVerified || false,
          helpfulCount: review.helpfulCount || 0,
          notHelpfulCount: review.notHelpfulCount || 0,
          replies: review.replies || [],
          reportCount: review.reportCount || 0,
          createdAt: review.createdAt || new Date().toISOString(),
          updatedAt: review.updatedAt || new Date().toISOString(),
        })));
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast.error('فشل في تحميل المراجعات');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateReviewStatus = async (reviewId, newStatus) => {
    try {
      const response = await reviewsAPI.updateStatus(reviewId, newStatus);
      if (response.data.status === 'success') {
        setReviews(prevReviews =>
          prevReviews.map(review =>
            review.id === reviewId ? { ...review, status: newStatus } : review
          )
        );
        toast.success('تم تحديث حالة المراجعة بنجاح');
      }
    } catch (error) {
      console.error('Error updating review status:', error);
      toast.error('فشل في تحديث حالة المراجعة');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا التقييم؟")) return;

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('يرجى تسجيل الدخول أولاً');
            return;
        }

        const response = await reviewsAPI.delete(reviewId);
        if (response.data.status === 'success') {
            setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId));
            toast.success(response.data.message || 'تم حذف المراجعة بنجاح');
        } else {
            throw new Error(response.data.message || 'فشل في حذف المراجعة');
        }
    } catch (error) {
        console.error('Error deleting review:', error);
        // Show more specific error messages based on the error type
        if (error.response) {
            // Server responded with an error
            const errorMessage = error.response.data?.message || error.response.data?.error || 'فشل في حذف المراجعة';
            toast.error(errorMessage);
        } else if (error.request) {
            // No response received
            toast.error('لا يمكن الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت');
        } else {
            // Other errors
            toast.error(error.message || 'فشل في حذف المراجعة');
        }
    }
  };

  const handleAddReply = async (reviewId, replyText) => {
    try {
      const response = await reviewsAPI.addReply(reviewId, { reply: replyText });
      if (response.data.status === 'success') {
        setReviews(prevReviews =>
          prevReviews.map(review =>
            review.id === reviewId
              ? { ...review, replies: [...review.replies, response.data.reply] }
              : review
          )
        );
        toast.success('تم إضافة الرد بنجاح');
      }
    } catch (error) {
      console.error('Error adding reply:', error);
      toast.error('فشل في إضافة الرد');
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || review.status === filterStatus;
    const matchesRating = !filterRating || review.rating.toString() === filterRating;
    return matchesSearch && matchesStatus && matchesRating;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (mode, review = null) => {
    setDialogMode(mode);
    setSelectedReview(review);
    setReplyText('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReview(null);
    setReplyText('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'تمت الموافقة';
      case 'pending': return 'قيد المراجعة';
      case 'rejected': return 'مرفوض';
      default: return status;
    }
  };

  const getRatingColor = (rating) => {
    switch (rating) {
      case 5: return '#2e7d32';
      case 4: return '#388e3c';
      case 3: return '#f57c00';
      case 2: return '#d32f2f';
      case 1: return '#c62828';
      default: return '#757575';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  const approvedReviews = reviews.filter(r => r.status === 'approved').length;
  const pendingReviews = reviews.filter(r => r.status === 'pending').length;
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            إدارة المراجعات
          </Typography>
          <Typography variant="body1" color="text.secondary">
            إدارة مراجعات وتقييمات العملاء للمنتجات
          </Typography>
        </Box>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">{reviews.length}</Typography>
                    <Typography variant="h6">إجمالي المراجعات</Typography>
                  </Box>
                  <ReviewsIcon sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
              color: 'white',
              borderRadius: 3
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">{approvedReviews}</Typography>
                    <Typography variant="h6">مراجعات موافق عليها</Typography>
                  </Box>
                  <ApproveIcon sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
              color: 'white',
              borderRadius: 3
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">{pendingReviews}</Typography>
                    <Typography variant="h6">في الانتظار</Typography>
                  </Box>
                  <TrendingIcon sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)',
              color: 'white',
              borderRadius: 3
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">{averageRating}</Typography>
                    <Typography variant="h6">متوسط التقييم</Typography>
                  </Box>
                  <StarIcon sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card sx={{ mb: 4, borderRadius: 3 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="البحث في المراجعات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>الحالة</InputLabel>
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    label="الحالة"
                  >
                    <MenuItem value="">جميع الحالات</MenuItem>
                    <MenuItem value="approved">موافق عليها</MenuItem>
                    <MenuItem value="pending">في الانتظار</MenuItem>
                    <MenuItem value="rejected">مرفوضة</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>التقييم</InputLabel>
                  <Select
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value)}
                    label="التقييم"
                  >
                    <MenuItem value="">جميع التقييمات</MenuItem>
                    <MenuItem value="5">5 نجوم</MenuItem>
                    <MenuItem value="4">4 نجوم</MenuItem>
                    <MenuItem value="3">3 نجوم</MenuItem>
                    <MenuItem value="2">2 نجوم</MenuItem>
                    <MenuItem value="1">1 نجمة</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={loadReviews}
                  fullWidth
                >
                  تحديث
                </Button>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <Button
                  variant="contained"
                  startIcon={<FilterIcon />}
                  fullWidth
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    }
                  }}
                >
                  تصفية
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Reviews Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>المنتج والعميل</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>التقييم والمراجعة</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>التفاعل</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>الحالة</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>التاريخ</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>الإجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <AnimatePresence>
                  {filteredReviews
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((review, index) => (
                      <motion.tr
                        key={review.id}
                        component={TableRow}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        hover
                      >
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                              {review.productName}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar src={review.userAvatar} sx={{ width: 32, height: 32 }}>
                                <PersonIcon />
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {review.userName}
                                </Typography>
                                {review.isVerified && (
                                  <Chip
                                    label="عميل محقق"
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    sx={{ fontSize: '0.7rem', height: 20 }}
                                  />
                                )}
                              </Box>
                            </Box>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Rating value={review.rating} readOnly size="small" />
                              <Chip
                                label={review.rating}
                                size="small"
                                color={getRatingColor(review.rating)}
                                sx={{ minWidth: 35 }}
                              />
                            </Box>
                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                              {review.title}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}
                            >
                              {review.comment}
                            </Typography>
                            {review.images.length > 0 && (
                              <Chip
                                label={`${review.images.length} صورة`}
                                size="small"
                                color="info"
                                sx={{ mt: 1, fontSize: '0.7rem' }}
                              />
                            )}
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LikeIcon color="success" fontSize="small" />
                              <Typography variant="caption">{review.helpfulCount}</Typography>
                              <DislikeIcon color="error" fontSize="small" />
                              <Typography variant="caption">{review.notHelpfulCount}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <ReplyIcon fontSize="small" color="action" />
                              <Typography variant="caption">{review.replies.length} رد</Typography>
                            </Box>
                            {review.reportCount > 0 && (
                              <Badge badgeContent={review.reportCount} color="error">
                                <ReportIcon fontSize="small" color="error" />
                              </Badge>
                            )}
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Chip
                            label={getStatusText(review.status)}
                            color={getStatusColor(review.status)}
                            size="small"
                          />
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(review.createdAt)}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="عرض التفاصيل">
                              <IconButton
                                size="small"
                                color="info"
                                onClick={() => handleOpenDialog('view', review)}
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="إضافة رد">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleOpenDialog('reply', review)}
                              >
                                <ReplyIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            {review.status === 'pending' && (
                              <Tooltip title="موافقة">
                                <IconButton
                                  size="small"
                                  color="success"
                                  onClick={() => handleUpdateReviewStatus(review.id, 'approved')}
                                >
                                  <ApproveIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            
                            {review.status !== 'rejected' && (
                              <Tooltip title="رفض">
                                <IconButton
                                  size="small"
                                  color="warning"
                                  onClick={() => handleUpdateReviewStatus(review.id, 'rejected')}
                                >
                                  <BlockIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            
                            <Tooltip title="حذف">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteReview(review.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </motion.tr>
                    ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            component="div"
            count={filteredReviews.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="عدد الصفوف في الصفحة:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} من ${count}`}
          />
        </Card>
      </motion.div>

      {/* Review Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 'bold'
        }}>
          {dialogMode === 'view' ? 'تفاصيل المراجعة' : 'إضافة رد على المراجعة'}
        </DialogTitle>
        
        <DialogContent sx={{ p: 3, mt: 2 }}>
          {selectedReview && (
            <Box>
              {/* Review Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar src={selectedReview.userAvatar} sx={{ width: 60, height: 60 }}>
                  <PersonIcon />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight="bold">
                    {selectedReview.userName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedReview.productName}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <Rating value={selectedReview.rating} readOnly />
                    <Typography variant="body2">
                      {formatDate(selectedReview.createdAt)}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={getStatusText(selectedReview.status)}
                  color={getStatusColor(selectedReview.status)}
                />
              </Box>

              {/* Review Content */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {selectedReview.title}
                </Typography>
                <Typography variant="body1" paragraph>
                  {selectedReview.comment}
                </Typography>
                
                {/* Images */}
                {selectedReview.images.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>صور المراجعة:</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {selectedReview.images.map((image, index) => (
                        <Avatar
                          key={index}
                          src={image}
                          variant="rounded"
                          sx={{ width: 80, height: 80 }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>

              {/* Existing Replies */}
              {selectedReview.replies.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>الردود:</Typography>
                  <List>
                    {selectedReview.replies.map((reply, index) => (
                      <React.Fragment key={reply.id}>
                        <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: reply.isAdmin ? 'primary.main' : 'grey.500' }}>
                              {reply.author.charAt(0)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="subtitle2" fontWeight="bold">
                                  {reply.author}
                                </Typography>
                                {reply.isAdmin && (
                                  <Chip label="إدارة" size="small" color="primary" />
                                )}
                                <Typography variant="caption" color="text.secondary">
                                  {formatDate(reply.date)}
                                </Typography>
                              </Box>
                            }
                            secondary={reply.message}
                          />
                        </ListItem>
                        {index < selectedReview.replies.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </Box>
              )}

              {/* Reply Form */}
              {dialogMode === 'reply' && (
                <Box>
                  <Typography variant="h6" gutterBottom>إضافة رد:</Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="اكتب ردك هنا..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    variant="outlined"
                  />
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            {dialogMode === 'view' ? 'إغلاق' : 'إلغاء'}
          </Button>
          {dialogMode === 'reply' && (
            <Button
              variant="contained"
              onClick={() => handleAddReply(selectedReview.id, replyText)}
              disabled={!replyText.trim()}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                }
              }}
            >
              إضافة الرد
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Reviews; 