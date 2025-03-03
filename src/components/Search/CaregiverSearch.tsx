'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Autocomplete,
  Chip,
  Slider,
  Typography,
  Paper,
  Grid,
  Button,
  Rating,
  IconButton,
  Collapse,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList,
  LocationOn,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';
import { CaregiverCard } from '../CaregiverProfile/CaregiverCard';
import type { Caregiver } from '@/types';

const services = [
  'Personal Care',
  'Medical Assistance',
  'Companionship',
  'Mobility Support',
  'Meal Preparation',
  'Medication Management',
  'Light Housekeeping',
  'Transportation'
];

const availabilityOptions = [
  'Weekday Mornings',
  'Weekday Afternoons',
  'Weekday Evenings',
  'Weekends',
  'Overnight',
  'Live-in Care',
  '24/7 Care'
];

export function CaregiverSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [distance, setDistance] = useState<number>(10);
  const [minRating, setMinRating] = useState<number | null>(4);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);

  // Simulated search effect
  useEffect(() => {
    const searchCaregivers = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data
      const mockCaregivers: Caregiver[] = [
        {
          id: '1',
          name: 'Sarah Thompson',
          rating: 4.9,
          reviews: 128,
          specializations: ['Personal Care', 'Medical Assistance'],
          experience: 8,
          verified: true,
          location: {
            city: 'London',
            distance: 1.2
          },
          availability: ['Weekday Mornings', 'Weekday Afternoons'],
          hourlyRate: 25,
          bio: 'Experienced caregiver with a passion for helping others.',
          imageUrl: '/images/sarah.jpg'
        },
        // Add more mock caregivers...
      ];

      setCaregivers(mockCaregivers);
      setLoading(false);
    };

    searchCaregivers();
  }, [searchTerm, selectedServices, selectedAvailability, distance, minRating]);

  return (
    <Box>
      {/* Search Bar */}
      <Paper 
        elevation={3}
        sx={{ 
          p: 3,
          mb: 3,
          borderRadius: 3
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search caregivers by name or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Enter your location"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => setShowFilters(!showFilters)}
              endIcon={showFilters ? <ExpandLess /> : <ExpandMore />}
              sx={{ 
                height: '56px',
                background: 'var(--gradient-primary)'
              }}
            >
              <FilterList sx={{ mr: 1 }} /> Filters
            </Button>
          </Grid>
        </Grid>

        <Collapse in={showFilters}>
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography gutterBottom>Services Required</Typography>
                <Autocomplete
                  multiple
                  options={services}
                  value={selectedServices}
                  onChange={(_, newValue) => setSelectedServices(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Select services" />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option}
                        {...getTagProps({ index })}
                        sx={{ m: 0.5 }}
                      />
                    ))
                  }
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography gutterBottom>Availability</Typography>
                <Autocomplete
                  multiple
                  options={availabilityOptions}
                  value={selectedAvailability}
                  onChange={(_, newValue) => setSelectedAvailability(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Select availability" />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option}
                        {...getTagProps({ index })}
                        sx={{ m: 0.5 }}
                      />
                    ))
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography gutterBottom>Maximum Distance ({distance} miles)</Typography>
                <Slider
                  value={distance}
                  onChange={(_, newValue) => setDistance(newValue as number)}
                  min={1}
                  max={50}
                  valueLabelDisplay="auto"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography gutterBottom>Minimum Rating</Typography>
                <Rating
                  value={minRating}
                  onChange={(_, newValue) => setMinRating(newValue)}
                  precision={0.5}
                />
              </Grid>
            </Grid>
          </Box>
        </Collapse>
      </Paper>

      {/* Results */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {caregivers.map((caregiver) => (
            <Grid item xs={12} md={6} lg={4} key={caregiver.id}>
              <CaregiverCard
                caregiver={caregiver}
                distance={caregiver.location.distance}
                matchScore={0.95}
                onBookClick={() => {}}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
