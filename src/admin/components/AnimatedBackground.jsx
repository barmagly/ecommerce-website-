import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme, alpha } from '@mui/material/styles';

const AnimatedBackground = () => {
  const theme = useTheme();

  const waveVariants = {
    animate: {
      x: [0, -100, 0],
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.6, 0.3],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const rotateVariants = {
    animate: {
      rotate: [0, 360],
      transition: {
        duration: 30,
        repeat: Infinity,
        ease: "linear"
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
        overflow: 'hidden',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    >
      {/* Animated waves */}
      <Box
        component={motion.div}
        variants={waveVariants}
        animate="animate"
        sx={{
          position: 'absolute',
          top: '20%',
          left: 0,
          right: 0,
          height: 200,
          background: `linear-gradient(90deg, 
            transparent 0%, 
            ${alpha(theme.palette.primary.main, 0.1)} 25%, 
            ${alpha(theme.palette.secondary.main, 0.1)} 50%, 
            ${alpha(theme.palette.primary.main, 0.1)} 75%, 
            transparent 100%)`,
          transform: 'skewY(-5deg)',
        }}
      />

      <Box
        component={motion.div}
        variants={waveVariants}
        animate="animate"
        sx={{
          position: 'absolute',
          top: '60%',
          left: 0,
          right: 0,
          height: 150,
          background: `linear-gradient(90deg, 
            transparent 0%, 
            ${alpha(theme.palette.secondary.main, 0.08)} 25%, 
            ${alpha(theme.palette.primary.main, 0.08)} 50%, 
            ${alpha(theme.palette.secondary.main, 0.08)} 75%, 
            transparent 100%)`,
          transform: 'skewY(3deg)',
        }}
      />

      {/* Floating orbs */}
      <Box
        component={motion.div}
        variants={pulseVariants}
        animate="animate"
        sx={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.2)}, transparent)`,
          filter: 'blur(2px)',
        }}
      />

      <Box
        component={motion.div}
        variants={pulseVariants}
        animate="animate"
        sx={{
          position: 'absolute',
          top: '70%',
          right: '15%',
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.15)}, transparent)`,
          filter: 'blur(1px)',
        }}
      />

      {/* Rotating elements */}
      <Box
        component={motion.div}
        variants={rotateVariants}
        animate="animate"
        sx={{
          position: 'absolute',
          top: '40%',
          right: '5%',
          width: 60,
          height: 60,
          border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          borderRadius: '50%',
          borderTop: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
        }}
      />

      <Box
        component={motion.div}
        variants={rotateVariants}
        animate="animate"
        sx={{
          position: 'absolute',
          top: '80%',
          left: '5%',
          width: 40,
          height: 40,
          border: `2px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
          borderRadius: '50%',
          borderRight: `2px solid ${alpha(theme.palette.secondary.main, 0.3)}`,
        }}
      />

      {/* Grid pattern */}
      <Box
        component={motion.div}
        variants={waveVariants}
        animate="animate"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(${alpha(theme.palette.primary.main, 0.02)} 1px, transparent 1px),
            linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.02)} 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          opacity: 0.5,
        }}
      />
    </Box>
  );
};

export default AnimatedBackground; 