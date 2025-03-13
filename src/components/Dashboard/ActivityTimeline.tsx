import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, styled } from '@mui/material';

const TimelineCard = styled(Card)(({ theme }) => ({
  background: '#ffffff',
  borderRadius: '10px',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  width: '100',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
}));

const ActivityTimeline = () => {
  console.log('ActivityTimeline is rendering');
  const [activities, setActivities] = useState([
    { id: 1, message: 'New message received', time: '10:00' },
    { id: 2, message: 'Appointment scheduled', time: '09:30' },
    { id: 3, message: 'Review submitted', time: '08:45' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivities((prev) => [
        ...prev,
        { id: Date.now(), message: `New update at ${new Date().toLocaleTimeString()}`, time: new Date().toLocaleTimeString() },
      ].slice(-3));
    }, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Typography variant="h6" gutterBottom sx={{ color: '#333' }}>
        Recent Updates
      </Typography>
      {activities.map((activity) => (
        <TimelineCard key={activity.id}>
          <CardContent>
            <Typography variant="body1" color="#333">
              {activity.message}
            </Typography>
            <Typography variant="caption" color="#666">
              {activity.time}
            </Typography>
          </CardContent>
        </TimelineCard>
      ))}
    </div>
  );
};

export { ActivityTimeline };
