import React, { useState, useEffect } from 'react';
import { Button, TextField, Card, CardContent, Typography, styled, IconButton, Box, InputAdornment } from '@mui/material';
import { Delete, Search as SearchIcon } from '@mui/icons-material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import io from 'socket.io-client';

const ManagerCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  width: '100%',
  '@media (max-width: 600px)': {
    width: '90%',
  },
}));

const CalendarContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(2),
  '.react-calendar': {
    border: 'none',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: theme.palette.text.primary,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  },
  '.react-calendar__tile': {
    color: theme.palette.text.primary,
    transition: 'background 0.3s ease',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.2)',
    },
  },
  '.react-calendar__tile--active': {
    background: theme.palette.primary.main,
    color: theme.palette.text.primary,
  },
  '.react-calendar__navigation button': {
    color: theme.palette.text.primary,
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.2)',
    },
  },
}));

const AppointmentRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  borderRadius: '8px',
  marginTop: theme.spacing(1),
  background: 'rgba(255, 255, 255, 0.05)',
  transition: 'background 0.3s ease',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.1)',
  },
}));

interface Appointment {
  _id: string;
  client: string;
  time: string;
  caregiverId?: string;
}

const AppointmentManager = () => {
  const [client, setClient] = useState('');
  const [time, setTime] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [calendarDate, setCalendarDate] = useState<Date | null>(null);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    socket.on('connect', () => console.log('Connected to Socket.IO server for appointments'));
    socket.on('appointmentUpdate', (updatedAppointments: Appointment[]) => setAppointments(updatedAppointments));
    socket.on('connect_error', (error) => console.error('Socket.IO error:', error.message));
    socket.on('disconnect', () => console.log('Disconnected from Socket.IO server'));

    return () => socket.disconnect();
  }, []);

  const handleSchedule = () => {
    if (client && time) {
      const newAppointment = { _id: String(Date.now()), client, time };
      setAppointments([...appointments, newAppointment]);
      alert(`Appointment scheduled for ${client} at ${time}!`);
      setClient('');
      setTime('');
      setCalendarDate(null);
    }
  };

  const handleReschedule = (id: string, newTime: string) => {
    const updatedAppointments = appointments.map((apt) =>
      apt._id === id ? { ...apt, time: newTime } : apt
    );
    setAppointments(updatedAppointments);
    alert(`Rescheduled appointment ID ${id} to ${newTime}`);
  };

  const handleCancel = (id: string) => {
    const filteredAppointments = appointments.filter((apt) => apt._id !== id);
    setAppointments(filteredAppointments);
    alert(`Cancelled appointment ID ${id}`);
  };

  const handleCalendarChange = (date: Date) => {
    setCalendarDate(date);
    const formattedDate = date.toISOString().slice(0, 16);
    setTime(formattedDate);
  };

  const filteredAppointments = appointments.filter((apt) =>
    apt.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    new Date(apt.time).toLocaleString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ManagerCard>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Book a Local Appointment
        </Typography>
        <TextField
          label="Your Name"
          value={client}
          onChange={(e) => setClient(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
          required
        />
        <TextField
          label="Date and Time"
          type="datetime-local"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          required
        />
        <CalendarContainer>
          <Calendar onChange={handleCalendarChange} value={calendarDate || new Date()} />
        </CalendarContainer>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSchedule}
          fullWidth
          disabled={!client.trim() || !time}
        >
          Schedule
        </Button>
        {appointments.length > 0 && (
          <div>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Your Appointments
            </Typography>
            <TextField
              label="Search Appointments"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
              }}
            />
            {filteredAppointments.map((apt) => (
              <AppointmentRow key={apt._id}>
                <Typography sx={{ flexGrow: 1 }}>
                  {apt.client} at {new Date(apt.time).toLocaleString()}
                </Typography>
                <TextField
                  type="datetime-local"
                  defaultValue={apt.time}
                  onBlur={(e) => handleReschedule(apt._id, e.target.value)}
                  sx={{ ml: 2, width: '200px' }}
                  InputLabelProps={{ shrink: true }}
                />
                <IconButton color="secondary" onClick={() => handleCancel(apt._id)} sx={{ ml: 1 }}>
                  <Delete />
                </IconButton>
              </AppointmentRow>
            ))}
          </div>
        )}
      </CardContent>
    </ManagerCard>
  );
};

export default AppointmentManager;