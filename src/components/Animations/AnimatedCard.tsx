'use client';

import { motion } from 'framer-motion';
import { Paper, PaperProps } from '@mui/material';

interface AnimatedCardProps extends PaperProps {
  delay?: number;
}

export function AnimatedCard({ children, delay = 0, ...props }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.4, 0, 0.2, 1]
      }}
      whileHover={{
        y: -5,
        transition: { duration: 0.2 }
      }}
    >
      <Paper
        elevation={2}
        {...props}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          },
          ...props.sx
        }}
      >
        {children}
      </Paper>
    </motion.div>
  );
}
