import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, InputLabel, FormControl, CircularProgress
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, LocalOffer as LocalOfferIcon } from '@mui/icons-material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editOffer, setEditOffer] = useState(null);
  const [form, setForm] = useState({
    type: 'product', // 'product' or 'category'
    refId: '',
    discount: '',
    description: ''
  });
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // جلب العروض
  const fetchOffers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/api/offers`);
      setOffers(data.offers || []);
    } catch (err) {
      setOffers([]);
    }
    setLoading(false);
  };

  // جلب المنتجات والفئات
  const fetchProductsAndCategories = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        axios.get(`${API_URL}/api/products`),
        axios.get(`${API_URL}/api/categories`)
      ]);
      setProducts(prodRes.data.products || []);
      setCategories(catRes.data.categories || []);
    } catch {}
  };

  useEffect(() => {
    fetchOffers();
    fetchProductsAndCategories();
  }, []);

  // فتح نافذة إضافة/تعديل
  const handleOpen = (offer = null) => {
    setEditOffer(offer);
    if (offer) {
      setForm({
        type: offer.type,
        refId: offer.refId,
        discount: offer.discount,
        description: offer.description || ''
      });
    } else {
      setForm({ type: 'product', refId: '', discount: '', description: '' });
    }
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setEditOffer(null);
  };

  // إضافة أو تعديل عرض
  const handleSave = async () => {
    try {
      if (editOffer) {
        await axios.put(`${API_URL}/api/offers/${editOffer._id}`, form);
      } else {
        await axios.post(`${API_URL}/api/offers`, form);
      }
      fetchOffers();
      handleClose();
    } catch {}
  };

  // حذف عرض
  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا العرض؟')) return;
    try {
      await axios.delete(`${API_URL}/api/offers/${id}`);
      fetchOffers();
    } catch {}
  };

  return (
    <Box p={3}>
      <Box display="flex" alignItems="center" mb={3} gap={2}>
        <LocalOfferIcon color="secondary" fontSize="large" />
        <Typography variant="h4" fontWeight={700}>العروض والخصومات</Typography>
        <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ ml: 'auto' }}>
          إضافة عرض جديد
        </Button>
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>النوع</TableCell>
                <TableCell>المنتج/القسم</TableCell>
                <TableCell>نسبة الخصم (%)</TableCell>
                <TableCell>الوصف</TableCell>
                <TableCell>إجراءات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {offers.length === 0 ? (
                <TableRow><TableCell colSpan={5} align="center">لا توجد عروض حالياً</TableCell></TableRow>
              ) : offers.map((offer) => (
                <TableRow key={offer._id}>
                  <TableCell>{offer.type === 'product' ? 'منتج' : 'قسم'}</TableCell>
                  <TableCell>
                    {offer.type === 'product'
                      ? products.find(p => p._id === offer.refId)?.name || '—'
                      : categories.find(c => c._id === offer.refId)?.name || '—'}
                  </TableCell>
                  <TableCell>{offer.discount}</TableCell>
                  <TableCell>{offer.description || '—'}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpen(offer)}><EditIcon /></IconButton>
                    <IconButton color="error" onClick={() => handleDelete(offer._id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {/* Dialog لإضافة/تعديل عرض */}
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>{editOffer ? 'تعديل العرض' : 'إضافة عرض جديد'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>النوع</InputLabel>
            <Select
              value={form.type}
              label="النوع"
              onChange={e => setForm(f => ({ ...f, type: e.target.value, refId: '' }))}
            >
              <MenuItem value="product">منتج</MenuItem>
              <MenuItem value="category">قسم</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>{form.type === 'product' ? 'المنتج' : 'القسم'}</InputLabel>
            <Select
              value={form.refId}
              label={form.type === 'product' ? 'المنتج' : 'القسم'}
              onChange={e => setForm(f => ({ ...f, refId: e.target.value }))}
            >
              {(form.type === 'product' ? products : categories).map(opt => (
                <MenuItem key={opt._id} value={opt._id}>{opt.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="نسبة الخصم (%)"
            type="number"
            fullWidth
            margin="normal"
            value={form.discount}
            onChange={e => setForm(f => ({ ...f, discount: e.target.value }))}
          />
          <TextField
            label="وصف العرض (اختياري)"
            fullWidth
            margin="normal"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>إلغاء</Button>
          <Button onClick={handleSave} variant="contained" color="secondary">حفظ</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 