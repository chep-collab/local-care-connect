'use client';

import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Button,
  Divider
} from '@mui/material';
import {
  Schedule,
  CheckCircle,
  Cancel,
  Message,
  Payment,
  Event,
  MoreVert
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface Activity {
  id: string;
  type: 'appointment' | 'message' | 'payment' | 'review';
  title: string;
  description: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'cancelled';
  user?: {
    name: string;
    avatar?: string;
  };
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function ActivityTimeline() {
  const activities: Activity[] = [
    {
      id: '1',
      type: 'appointment',
      title: 'Appointment with John Smith',
      description: 'Personal care session scheduled',
      timestamp: new Date('2025-03-03T10:00:00'),
      status: 'completed',
      user: {
        name: 'John Smith',
        avatar: '/avatars/john.jpg'
      }
    },
    {
      id: '2',
      type: 'message',
      title: 'New message received',
      description: 'Emma Wilson sent you a message about tomorrow\'s schedule',
      timestamp: new Date('2025-03-03T09:30:00'),
      status: 'pending',
      user: {
        name: 'Emma Wilson'
      },
      action: {
        label: 'Reply',
        onClick: () => console.log('Reply to message')
      }
    },
    {
      id: '3',
      type: 'payment',
      title: 'Payment received',
      description: 'Payment of £60.00 received for services',
      timestamp: new Date('2025-03-03T09:00:00'),
      status: 'completed'
    },
    {
      id: '4',
      type: 'review',
      title: 'New Review',
      description: 'Sarah left you a 5-star review',
      timestamp: new Date('2025-03-03T08:45:00'),
      status: 'completed',
      user: {
        name: 'Sarah',
        avatar: '/avatars/sarah.jpg'
      },
      action: {
        label: 'View',
        onClick: () => console.log('View review')
      }
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Event />;
      case 'message':
        return <Message />;
      case 'payment':
        return <Payment />;
      default:
        return <Schedule />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle fontSize="small" />;
      case 'cancelled':
        return <Cancel fontSize="small" />;
      default:
        return <Schedule fontSize="small" />;
    }
  };

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Recent Activity</Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<Schedule />}
        >
          View All
        </Button>
      </Box>

      <Box>
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                mb: index < activities.length - 1 ? 3 : 0,
                position: 'relative'
              }}
            >
              {/* Timeline line */}
              {index < activities.length - 1 && (
                <Box
                  sx={{
                    position: 'absolute',
                    left: 20,
                    top: 40,
                    bottom: -20,
                    width: 2,
                    bgcolor: 'divider'
                  }}
                />
              )}

              {/* Activity icon */}
              <Avatar
                sx={{
                  bgcolor: `${getStatusColor(activity.status)}.light`,
                  color: `${getStatusColor(activity.status)}.main`,
                  width: 40,
                  height: 40
                }}
              >
                {getActivityIcon(activity.type)}
              </Avatar>

              <Box flex={1}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="subtitle2">
                      {activity.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {activity.description}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center" gap={1}>
                    <Chip
                      size="small"
                      label={activity.status}
                      color={getStatusColor(activity.status) as any}
                      icon={getStatusIcon(activity.status)}
                    />
                    <IconButton size="small">
                      <MoreVert />
                    </IconButton>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2} mt={1}>
                  {activity.user && (
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar
                        src={activity.user.avatar}
                        sx={{ width: 24, height: 24 }}
                      >
                        {activity.user.name[0]}
                      </Avatar>
                      <Typography variant="body2" color="text.secondary">
                        {activity.user.name}
                      </Typography>
                    </Box>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {format(activity.timestamp, 'HH:mm')}
                  </Typography>
                  {activity.action && (
                    <Button
                      size="small"
                      onClick={activity.action.onClick}
                      sx={{ ml: 'auto' }}
                    >
                      {activity.action.label}
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
            {index < activities.length - 1 && (
              <Divider sx={{ my: 2 }} />
            )}
          </motion.div>
        ))}
      </Box>
    </Paper>
  );
}
