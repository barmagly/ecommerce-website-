import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const Reviews = () => {
  return (
    <Box sx={{ p: 3 }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>إدارة المراجعات</Typography>
        <Typography variant="body1" color="text.secondary">مراجعات وتقييمات العملاء</Typography>
      </motion.div>
    </Box>
  );
};

export default Reviews;
