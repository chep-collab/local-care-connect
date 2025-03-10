import React from 'react';
import { Button, styled } from '@mui/material';

const ServiceContainer = styled('div')(({ theme }) => ({
  display: 'flex', flexWrap: 'wrap', gap: theme.spacing(1),
  background: theme.palette.background.paper,
  padding: theme.spacing(2),
  borderRadius: '10px',
  marginTop: theme.spacing(2),
  [theme.breakpoints.down('sm')]: { gap: theme.spacing(0.5) },
}));

const ServiceSelector = () => {
  const services = ['Personal Care', 'Nursing', 'Therapy'];
  return (
    <ServiceContainer>
      <h3>Services</h3>
      {services.map((service) => <Button key={service}>{service}</Button>)}
    </ServiceContainer>
  );
};
// In src/components/Header.tsx
const Header = () => {
  console.log('Header is rendering');
  // ... rest of the code
};

// In src/components/AppointmentManager.tsx
const AppointmentManager = () => {
  console.log('AppointmentManager is rendering');
  // ... rest of the code
};

// Repeat for Chat, ServiceSelector, ProfileCard, BadgeComponent
export default ServiceSelector;