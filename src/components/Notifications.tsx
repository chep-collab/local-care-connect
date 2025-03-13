import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Card, CardContent, styled, IconButton } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import io from 'socket.io-client';

const NotificationCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  width: '100%',
  '@media (max-width: 600px)': {
    width: '90%',
  },
}));

const NotificationItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  borderRadius: '8px',
  marginBottom: theme.spacing(1),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateX(5px)',
    background: 'rgba(255, 255, 255, 0.05)',
  },
}));

interface Notification {
  id: number;
  message: string;
  time: string;
  category: 'appointment' | 'message' | 'system';
  read: boolean;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    socketRef.current.on('connect', () => console.log('Connected to Socket.IO server for notifications'));
    socketRef.current.on('notification', (notif: Notification) => {
      setNotifications((prev) => [...prev, { ...notif, read: false }]);
    });
    socketRef.current.on('connect_error', (error: any) => console.error('Socket.IO error:', error.message));
    socketRef.current.on('disconnect', () => console.log('Disconnected from Socket.IO server'));

    setNotifications([
      { id: 1, message: 'Your appointment is confirmed!', time: new Date().toLocaleString(), category: 'appointment', read: false },
      { id: 2, message: 'New message from Caregiver 1', time: new Date().toLocaleString(), category: 'message', read: false },
      { id: 3, message: 'System update available', time: new Date().toLocaleString(), category: 'system', read: false },
    ]);

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  const handleMarkAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const getCategoryColor = (category: Notification['category']) => {
    switch (category) {
      case 'appointment':
        return '#4caf50';
      case 'message':
        return '#2196f3';
      case 'system':
        return '#f44336';
      default:
        return '#ffffff';
    }
  };

  const notificationsEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    notificationsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [notifications]);

  return (
    <NotificationCard>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Notifications
        </Typography>
        <Box sx={{ maxHeight: '200px', overflowY: 'auto', mb: 2, p: 1, background: 'rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
          {notifications.map((notif) => (
            <NotificationItem
              key={notif.id}
              sx={{
                backgroundColor: notif.read ? 'transparent' : 'rgba(255, 255, 255, 0.05)',
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Typography sx={{ color: getCategoryColor(notif.category) }}>
                  {notif.message}
                </Typography>
                <Typography sx={{ color: '#bbbbbb' }}>{notif.time}</Typography>
              </Box>
              {!notif.read && (
                <IconButton onClick={() => handleMarkAsRead(notif.id)} sx={{ color: '#26c6da' }}>
                  <CheckCircle />
                </IconButton>
              )}
            </NotificationItem>
          ))}
          <div ref={notificationsEndRef} />
        </Box>
      </CardContent>
    </NotificationCard>
  );
};

export default Notifications;