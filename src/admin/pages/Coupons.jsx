import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const Coupons = () => {
  return (
    <Box sx={{ p: 3 }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>إدارة الكوبونات</Typography>
        <Typography variant="body1" color="text.secondary">إدارة كوبونات الخصم والعروض</Typography>
      </motion.div>
    </Box>
  );
};

export default Coupons; 