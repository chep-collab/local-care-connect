// src/components/Services.tsx
import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, styled, Button, Checkbox, FormControlLabel } from '@mui/material';

const ServiceCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.4)',
  borderRadius: '10px',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  width: '100%',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  '@media (max-width: 600px)': {
    width: '90%',
  },
}));

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
}

const Services = () => {
  const [services] = useState<Service[]>([
    { id: 1, name: 'General Care', description: 'Basic daily assistance', price: 25 },
    { id: 2, name: 'Elderly Care', description: 'Specialized elderly support', price: 35 },
    { id: 3, name: 'Pediatric Care', description: 'Care for children', price: 30 },
  ]);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);

  const handleSelect = (id: number) => {
    setSelectedServices((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const handleBook = () => {
    if (selectedServices.length > 0) {
      alert(`Booked services: ${selectedServices.map((id) => services.find((s) => s.id === id)?.name).join(', ')}`);
    } else {
      alert('Please select at least one service.');
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: '#ffffff', mb: 2 }}>
        Select Care Services
      </Typography>
      {services.map((service) => (
        <ServiceCard key={service.id}>
          <CardContent>
            <Typography sx={{ color: '#ffffff' }}>{service.name}</Typography>
            <Typography sx={{ color: '#bbbbbb' }}>{service.description} - ${service.price}/hour</Typography>
            <FormControlLabel
              control={<Checkbox checked={selectedServices.includes(service.id)} onChange={() => handleSelect(service.id)} />}
              label="Select"
              sx={{ color: '#bbbbbb' }}
            />
          </CardContent>
        </ServiceCard>
      ))}
      <Button variant="contained" color="primary" onClick={handleBook} sx={{ mt: 2 }}>
        Book Selected Services
      </Button>
    </Box>
  );
};

export default Services;