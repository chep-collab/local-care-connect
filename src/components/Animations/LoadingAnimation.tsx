'use client';

import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';

interface LoadingAnimationProps {
  message?: string;
}

export function LoadingAnimation({ message = 'Loading...' }: LoadingAnimationProps) {
  const containerVariants = {
    start: {
      transition: {
        staggerChildren: 0.2
      }
    },
    end: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const circleVariants = {
    start: {
      y: '0%'
    },
    end: {
      y: '100%'
    }
  };

  const circleTransition = {
    duration: 0.5,
    repeat: Infinity,
    repeatType: 'reverse',
    ease: 'easeInOut'
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight={200}
    >
      <motion.div
        variants={containerVariants}
        initial="start"
        animate="end"
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px'
        }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            variants={circleVariants}
            transition={circleTransition}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: 'var(--gradient-primary)',
            }}
          />
        ))}
      </motion.div>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          opacity: 0.8,
          animation: 'pulse 2s infinite'
        }}
      >
        {message}
      </Typography>
    </Box>
  );
}
