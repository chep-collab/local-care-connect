// components/AppointmentForm.tsx
import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import axios from 'axios';

const AppointmentForm: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [date, setDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !date) {
      setError('Please fill out all fields');
      return;
    }

    try {
      const formattedDate = format(date, 'MM/dd/yyyy HH:mm');
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments`, {
        name,
        date: formattedDate,
      });
      setSuccess('Appointment scheduled successfully!');
      setName('');
      setDate(null);
      setError(null);
    } catch (err) {
      setError('Failed to schedule appointment. Please try again.');
      console.error('Error scheduling appointment:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          backgroundColor: '#e0e7ff',
          boxShadow: 2,
          maxWidth: 400,
          margin: '0 auto',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Book a Local Appointment
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="success.main">{success}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Date and Time"
              value={date}
              onChange={(newDate) => setDate(newDate)}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" />
              )}
            />
          </LocalizationProvider>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Schedule
          </Button>
        </form>
      </Box>
    </motion.div>
  );
};

export default AppointmentForm;