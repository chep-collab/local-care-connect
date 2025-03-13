import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, styled, TextField, Button } from '@mui/material';
import io from 'socket.io-client';

const DashboardCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  width: '100%',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
  },
  '@media (max-width: 600px)': {
    width: '90%',
  },
}));

const ActivityItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  borderRadius: '8px',
  marginBottom: theme.spacing(1),
  background: 'rgba(255, 255, 255, 0.05)',
  transition: 'background 0.3s ease',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.1)',
  },
}));

interface Activity {
  id: number;
  text: string;
  time: string;
  user: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState({ appointmentsToday: 0, activeUsers: 0 });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filterUser, setFilterUser] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    socket.on('connect', () => console.log('Connected to Socket.IO server for dashboard'));
    socket.on('activeConnections', (count: number) => setStats((prev) => ({ ...prev, activeUsers: count })));
    socket.on('activityUpdate', (activity: Activity) => setActivities((prev) => [...prev, activity].slice(-5)));
    socket.on('connect_error', (error: any) => console.error('Socket.IO error:', error.message));
    socket.on('disconnect', () => console.log('Disconnected from Socket.IO server'));

    setActivities([
      { id: 1, text: 'New appointment scheduled by John Doe', time: '2025-03-12 10:00', user: 'John Doe' },
      { id: 2, text: 'Caregiver 1 marked as available', time: '2025-03-12 09:30', user: 'Caregiver 1' },
    ]);

    return () => socket.disconnect();
  }, []);

  const handleLogout = () => {
    alert('Logged out!');
  };

  const filteredActivities = activities.filter((activity) => {
    const matchesUser = filterUser ? activity.user.toLowerCase().includes(filterUser.toLowerCase()) : true;
    const matchesDate = filterDate ? activity.time.includes(filterDate) : true;
    return matchesUser && matchesDate;
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Interactive Dashboard</Typography>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
      <DashboardCard>
        <CardContent>
          <Typography>Appointments Today: {stats.appointmentsToday}</Typography>
          <Typography>Active Users: {stats.activeUsers}</Typography>
        </CardContent>
      </DashboardCard>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Activity Timeline
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Filter by User"
          value={filterUser}
          onChange={(e) => setFilterUser(e.target.value)}
          variant="outlined"
        />
        <TextField
          label="Filter by Date"
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Box>
      <DashboardCard>
        <CardContent>
          {filteredActivities.map((activity) => (
            <ActivityItem key={activity.id}>
              <Typography>{activity.text}</Typography>
              <Typography sx={{ color: '#bbbbbb' }}>{activity.time} - {activity.user}</Typography>
            </ActivityItem>
          ))}
        </CardContent>
      </DashboardCard>
    </Box>
  );
};

export default Dashboard;