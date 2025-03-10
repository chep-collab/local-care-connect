'use client';

import { Paper, PaperProps } from '@mui/material';
import { motion } from 'framer-motion';

interface AnimatedCardProps extends PaperProps {
  children: React.ReactNode;
}

export const AnimatedCard = ({ children, sx, ...props }: AnimatedCardProps) => {
  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        overflow: 'hidden',
        borderRadius: 2,
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        ...sx
      }}
      elevation={0}
      {...props}
    >
      {children}
    </Paper>
  );
};
