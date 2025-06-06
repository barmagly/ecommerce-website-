import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Button, IconButton, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Grid, TextField, InputAdornment, Chip, Avatar, useTheme, alpha } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, Category as CategoryIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const Categories = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const mockCategories = [
    { _id: '1', name: 'إلكترونيات', description: 'أجهزة إلكترونية متنوعة' },
    { _id: '2', name: 'ملابس', description: 'ملابس رجالية ونسائية' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>إدارة الفئات</Typography>
          <Typography variant="body1" color="text.secondary">تصنيف وتنظيم المنتجات</Typography>
        </Box>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField fullWidth placeholder="البحث في الفئات..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Button variant="contained" startIcon={<AddIcon />} sx={{ float: 'left' }}>إضافة فئة جديدة</Button>
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
                    <Typography variant="h4" fontWeight="bold" color="#1976d2">24</Typography>
                    <Typography variant="h6">إجمالي الفئات</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: alpha('#1976d2', 0.1), color: '#1976d2' }}><CategoryIcon /></Avatar>
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
                    <TableCell sx={{ fontWeight: 600 }}>الفئة</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>الوصف</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>الإجراءات</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockCategories.map((category) => (
                    <TableRow key={category._id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ width: 40, height: 40, mr: 2 }}>{category.name[0]}</Avatar>
                          <Typography variant="subtitle2" fontWeight={600}>{category.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell>
                        <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                        <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
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

export default Categories; 