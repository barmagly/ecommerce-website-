import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme, alpha } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const LoginSuccess = () => {
  const theme = useTheme();

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const checkmarkVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        ease: "backOut"
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.5
      }
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)}, ${alpha(theme.palette.secondary.main, 0.9)})`,
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: 'center',
            background: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            minWidth: 300,
          }}
        >
          <motion.div
            variants={checkmarkVariants}
            initial="hidden"
            animate="visible"
          >
            <CheckCircleIcon
              sx={{
                fontSize: 80,
                color: theme.palette.success.main,
                mb: 2,
                filter: 'drop-shadow(0 4px 8px rgba(76, 175, 80, 0.3))',
              }}
            />
          </motion.div>

          <motion.div
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: theme.palette.success.main,
                mb: 1,
              }}
            >
              تم تسجيل الدخول بنجاح!
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              جاري تحويلك إلى لوحة التحكم...
            </Typography>

            <Box
              component={motion.div}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              sx={{
                width: 40,
                height: 4,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                borderRadius: 2,
                mx: 'auto',
                mt: 2,
              }}
            />
          </motion.div>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default LoginSuccess; 