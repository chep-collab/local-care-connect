'use client';

import { useState } from 'react';
import { Box, Container, Grid, Paper, Typography, Button, IconButton } from '@mui/material';
import { Notifications, AccountCircle, Menu as MenuIcon } from '@mui/icons-material';
import { Providers } from './providers';
import { CaregiverCard } from '@/components/CaregiverProfile/CaregiverCard';
import { ChatWindow } from '@/components/Chat/ChatWindow';
import { AppointmentCard } from '@/components/Appointments/AppointmentCard';
import { ServiceSelector } from '@/components/Booking/ServiceSelector';
import { StatisticsCards } from '@/components/Dashboard/StatisticsCards';
import { ActivityTimeline } from '@/components/Dashboard/ActivityTimeline';
import { NotificationCenter } from '@/components/Notifications/NotificationCenter';
import { AchievementsBadges } from '@/components/Profile/AchievementsBadges';
import { ReviewsList } from '@/components/Reviews/ReviewsList';
import { PageTransition } from '@/components/Animations/PageTransition';
import { AnimatedCard } from '@/components/Animations/AnimatedCard';

// Sample data
const sampleCaregiver = {
  id: '1',
  name: 'Sarah Thompson',
  profileImage: '/images/sarah.jpg',
  specializations: ['personal_care', 'medical_assistance', 'mobility_support'],
  experience: 8,
  rating: 4.9,
  verificationStatus: 'verified',
  location: {
    city: 'London',
    postcode: 'SW1A 1AA',
    latitude: 51.5074,
    longitude: -0.1278
  }
};

const sampleAppointment = {
  id: '1',
  startTime: new Date('2025-03-04T10:00:00'),
  endTime: new Date('2025-03-04T12:00:00'),
  status: 'confirmed',
  patient: {
    id: 'p1',
    name: 'John Smith'
  },
  caregiver: {
    id: 'c1',
    name: 'Sarah Thompson'
  },
  location: {
    address: '123 Care Street, London',
    city: 'London',
    postcode: 'SW1A 1AA'
  },
  careServices: [
    {
      type: 'Personal Care',
      duration: 120
    }
  ],
  payment: {
    amount: 6000,
    status: 'pending'
  }
};

const sampleChatParticipant = {
  id: '1',
  name: 'Sarah Thompson',
  profileImage: '/images/sarah.jpg'
};

export default function Home() {
  const [messages] = useState([
    {
      id: '1',
      content: 'Hello! How can I help you today?',
      sender: 'them',
      timestamp: new Date(),
      type: 'text'
    }
  ]);

  return (
    <Providers>
      <PageTransition>
        {/* Header */}
        <Box 
          sx={{ 
            background: 'var(--gradient-primary)',
            color: 'white',
            py: 2,
            mb: 4
          }}
        >
          <Container maxWidth="lg">
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={2}>
                <IconButton color="inherit" sx={{ display: { md: 'none' } }}>
                  <MenuIcon />
                </IconButton>
                <Typography 
                  variant="h5" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 'bold',
                    background: 'white',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  LocalCareConnect
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center" gap={2}>
                <NotificationCenter />
                <IconButton color="inherit">
                  <AccountCircle />
                </IconButton>
              </Box>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Welcome Message */}
            <Grid item xs={12}>
              <AnimatedCard
                className="pattern-grid glass-effect"
                sx={{ 
                  p: 4,
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 2,
                  mb: 4
                }}
              >
                <Box>
                  <Typography 
                    variant="h4" 
                    component="h2" 
                    className="gradient-text"
                    gutterBottom
                  >
                    Welcome to Your Care Dashboard
                  </Typography>
                  <Typography color="text.secondary">
                    Find trusted caregivers, schedule appointments, and manage your care journey all in one place.
                  </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  size="large"
                  sx={{ 
                    background: 'var(--gradient-secondary)',
                    px: 4,
                    borderRadius: 2
                  }}
                >
                  Find a Caregiver
                </Button>
              </AnimatedCard>
            </Grid>

            {/* Statistics */}
            <Grid item xs={12}>
              <StatisticsCards />
            </Grid>

            {/* Main Content */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={4}>
                {/* Activity Timeline */}
                <Grid item xs={12}>
                  <ActivityTimeline />
                </Grid>

                {/* Reviews */}
                <Grid item xs={12}>
                  <ReviewsList caregiverId="1" />
                </Grid>
              </Grid>
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} md={4}>
              <Grid container spacing={4}>
                {/* Upcoming Appointment */}
                <Grid item xs={12}>
                  <AnimatedCard>
                    <Box p={3}>
                      <Typography 
                        variant="h6" 
                        gutterBottom
                        sx={{ fontWeight: 'bold' }}
                      >
                        Upcoming Appointment
                      </Typography>
                      <AppointmentCard
                        appointment={sampleAppointment}
                        userType="patient"
                        onCancel={(reason) => alert(`Cancelling with reason: ${reason}`)}
                        onReschedule={() => alert('Rescheduling appointment')}
                      />
                    </Box>
                  </AnimatedCard>
                </Grid>

                {/* Chat Window */}
                <Grid item xs={12}>
                  <AnimatedCard sx={{ height: '400px' }}>
                    <ChatWindow
                      chatId="1"
                      otherParticipant={sampleChatParticipant}
                      initialMessages={messages}
                    />
                  </AnimatedCard>
                </Grid>

                {/* Achievements */}
                <Grid item xs={12}>
                  <AchievementsBadges />
                </Grid>
              </Grid>
            </Grid>

            {/* Service Selector */}
            <Grid item xs={12}>
              <AnimatedCard>
                <Box p={3}>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ fontWeight: 'bold' }}
                  >
                    Available Services
                  </Typography>
                  <ServiceSelector
                    services={[]}
                    onServiceSelect={(selections) => console.log('Selected services:', selections)}
                  />
                </Box>
              </AnimatedCard>
            </Grid>
          </Grid>
        </Container>
      </PageTransition>
    </Providers>
  );
}
