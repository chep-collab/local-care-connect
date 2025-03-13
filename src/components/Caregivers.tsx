import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, styled, Button, Select, MenuItem, FormControl, InputLabel, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const CaregiverCard = styled(Card)(({ theme }) => ({
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

interface Caregiver {
  _id: string;
  name: string;
  rating: number;
  specialization: string;
  available: boolean;
  reviews: string[];
  points: number;
}

const Caregivers = () => {
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [sortBy, setSortBy] = useState<'rating' | 'availability'>('rating');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setCaregivers([
      { _id: '1', name: 'Caregiver 1', rating: 4.5, specialization: 'General Care', available: true, reviews: ['Great!', 'Very helpful'], points: 100 },
      { _id: '2', name: 'Caregiver 2', rating: 4.0, specialization: 'Elderly Care', available: false, reviews: ['Good service'], points: 80 },
    ]);
  }, []);

  const handleSortChange = (event: any) => {
    setSortBy(event.target.value as 'rating' | 'availability');
  };

  const sortedCaregivers = [...caregivers].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'availability') return a.available === b.available ? 0 : a.available ? -1 : 1;
    return 0;
  });

  const filteredCaregivers = sortedCaregivers.filter((caregiver) =>
    caregiver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    caregiver.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Available Caregivers
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel>Sort By</InputLabel>
          <Select value={sortBy} onChange={handleSortChange} label="Sort By">
            <MenuItem value="rating">Rating</MenuItem>
            <MenuItem value="availability">Availability</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Search Caregivers"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#bbbbbb' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      {filteredCaregivers.map((caregiver) => (
        <CaregiverCard key={caregiver._id}>
          <CardContent>
            <Typography>
              {caregiver.name} - {caregiver.specialization} (Rating: {caregiver.rating})
            </Typography>
            <Typography sx={{ color: caregiver.available ? '#4caf50' : '#f44336' }}>
              {caregiver.available ? 'AVAILABLE' : 'NOT AVAILABLE'}
            </Typography>
            <Typography sx={{ color: '#bbbbbb' }}>
              Reviews: {caregiver.reviews.join(', ')}
            </Typography>
            <Typography sx={{ color: '#bbbbbb' }}>
              Points: {caregiver.points}
            </Typography>
            <Button variant="contained" color="primary" sx={{ mt: 1 }}>
              View Profile
            </Button>
          </CardContent>
        </CaregiverCard>
      ))}
    </Box>
  );
};

export default Caregivers;