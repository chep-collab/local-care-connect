'use client';

import {
  Box,
  Grid,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  TrendingUp,
  AccessTime,
  Group,
  Star,
  AttachMoney,
  CalendarMonth,
  ArrowUpward,
  ArrowDownward
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface StatCard {
  title: string;
  value: string | number;
  icon: JSX.Element;
  change: number;
  color: string;
  tooltip: string;
}

export function StatisticsCards() {
  const stats: StatCard[] = [
    {
      title: 'Total Hours',
      value: '256',
      icon: <AccessTime />,
      change: 12.5,
      color: '#2196F3',
      tooltip: 'Total care hours provided this month'
    },
    {
      title: 'Active Clients',
      value: '18',
      icon: <Group />,
      change: 8.3,
      color: '#4CAF50',
      tooltip: 'Number of clients currently under your care'
    },
    {
      title: 'Average Rating',
      value: '4.9',
      icon: <Star />,
      change: 2.1,
      color: '#FFC107',
      tooltip: 'Average rating from your last 30 days of service'
    },
    {
      title: 'Monthly Earnings',
      value: '£3,250',
      icon: <AttachMoney />,
      change: -5.2,
      color: '#E91E63',
      tooltip: 'Total earnings for the current month'
    },
    {
      title: 'Appointments',
      value: '45',
      icon: <CalendarMonth />,
      change: 15.7,
      color: '#9C27B0',
      tooltip: 'Total appointments scheduled this month'
    },
    {
      title: 'Growth Rate',
      value: '23%',
      icon: <TrendingUp />,
      change: 7.8,
      color: '#FF9800',
      tooltip: 'Client growth rate compared to last month'
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
    >
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={stat.title}>
            <motion.div variants={item}>
              <Paper
                className="hover-card"
                sx={{
                  p: 3,
                  borderRadius: 3,
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Background Pattern */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    p: 2,
                    opacity: 0.1,
                    transform: 'rotate(-15deg)',
                    '& svg': {
                      fontSize: '4rem',
                      color: stat.color
                    }
                  }}
                >
                  {stat.icon}
                </Box>

                <Box position="relative">
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography color="text.secondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Tooltip title={stat.tooltip}>
                      <IconButton size="small" sx={{ color: stat.color }}>
                        {stat.icon}
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Box display="flex" alignItems="baseline" gap={1} mb={1}>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {stat.value}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: stat.change >= 0 ? 'success.main' : 'error.main',
                      }}
                    >
                      {stat.change >= 0 ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
                      <Typography variant="body2">
                        {Math.abs(stat.change)}%
                      </Typography>
                    </Box>
                  </Box>

                  {/* Circular Progress */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: -30,
                      right: -30,
                      opacity: 0.1
                    }}
                  >
                    <CircularProgress
                      variant="determinate"
                      value={75}
                      size={100}
                      sx={{
                        color: stat.color,
                        '& .MuiCircularProgress-circle': {
                          strokeLinecap: 'round',
                        },
                      }}
                    />
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );
}
