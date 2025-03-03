'use client';

import { useState, useEffect } from 'react';
import {
  Badge,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Divider,
  Button,
  Chip
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Message,
  Event,
  Payment,
  CheckCircle,
  Error,
  Info
} from '@mui/icons-material';
import { format } from 'date-fns';

interface Notification {
  id: string;
  type: 'message' | 'appointment' | 'payment' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'message',
      title: 'New message from Sarah Thompson',
      description: 'Hello! I wanted to confirm our appointment...',
      timestamp: new Date(),
      read: false,
      priority: 'medium',
      action: {
        label: 'Reply',
        onClick: () => console.log('Reply to message')
      }
    },
    {
      id: '2',
      type: 'appointment',
      title: 'Upcoming Appointment Reminder',
      description: 'You have an appointment tomorrow at 10:00 AM',
      timestamp: new Date(),
      read: false,
      priority: 'high',
      action: {
        label: 'View Details',
        onClick: () => console.log('View appointment details')
      }
    },
    {
      id: '3',
      type: 'payment',
      title: 'Payment Successful',
      description: 'Your payment of £60.00 has been processed',
      timestamp: new Date(),
      read: true,
      priority: 'low'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <Message />;
      case 'appointment':
        return <Event />;
      case 'payment':
        return <Payment />;
      default:
        return <Info />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(notifications.map(n => 
      n.id === notification.id ? { ...n, read: true } : n
    ));

    // Execute action if available
    if (notification.action) {
      notification.action.onClick();
    }
  };

  return (
    <>
      <IconButton color="inherit" onClick={() => setOpen(true)}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: 360,
            maxWidth: '100%'
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" component="h2">
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Button
                size="small"
                onClick={markAllAsRead}
                sx={{ textTransform: 'none' }}
              >
                Mark all as read
              </Button>
            )}
          </Box>

          <List sx={{ pt: 0 }}>
            {notifications.map((notification, index) => (
              <Box key={notification.id}>
                {index > 0 && <Divider />}
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    bgcolor: notification.read ? 'transparent' : 'action.hover',
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: `${getPriorityColor(notification.priority)}.light` }}>
                      {getIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2" component="span">
                          {notification.title}
                        </Typography>
                        <Chip
                          size="small"
                          label={format(notification.timestamp, 'HH:mm')}
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {notification.description}
                        </Typography>
                        {notification.action && (
                          <Button
                            size="small"
                            sx={{ mt: 1, textTransform: 'none' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              notification.action?.onClick();
                            }}
                          >
                            {notification.action.label}
                          </Button>
                        )}
                      </>
                    }
                  />
                </ListItem>
              </Box>
            ))}
          </List>

          {notifications.length === 0 && (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              py={4}
            >
              <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                You're all caught up!
              </Typography>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
}
