// src/components/Dashboard/StatisticsCards.tsx
import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
// import io from 'socket.io-client';

const StatisticsCards = () => {
  const [activeConnections, setActiveConnections] = useState<number>(0);

  useEffect(() => {
    // const socket = io(process.env.VITE_API_URL || 'http://localhost:5000', {
    //   transports: ['websocket', 'polling'],
    //   withCredentials: true,
    // });

    // socket.on('connect', () => {
    //   console.log('Connected to Socket.IO server');
    // });

    // socket.on('activeConnections', (count: number) => {
    //   setActiveConnections(count);
    // });

    // socket.on('connect_error', (error) => {
    //   console.error('Socket.IO connection error:', error.message);
    // });

    // socket.on('disconnect', () => {
    //   console.log('Disconnected from Socket.IO server');
    // });

    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  return (
    <Box sx={{ p: 3, borderRadius: 2, backgroundColor: 'rgba(255, 255, 255, 0.2)', mt: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#ffffff' }}>
        Community Overview
      </Typography>
      <Typography variant="body1" sx={{ color: '#ffffff' }}>
        Active Connections: {activeConnections}
      </Typography>
    </Box>
  );
};

export default StatisticsCards;