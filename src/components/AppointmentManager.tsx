import React, { useState } from 'react';
import { Button, TextField, styled } from '@mui/material';

const ManagerContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  background: theme.palette.background.paper,
  borderRadius: '10px',
  marginTop: theme.spacing(2),
  [theme.breakpoints.down('sm')]: { padding: theme.spacing(1) },
}));

const AppointmentManager = () => {
  const [appointments, setAppointments] = useState<{ id: number; client: string; time: string }[]>([]);
  const [client, setClient] = useState('');
  const [time, setTime] = useState('');

  const addAppointment = () => {
    setAppointments([...appointments, { id: Date.now(), client, time }]);
    setClient(''); setTime('');
  };

  const cancelAppointment = (id: number) => {
    setAppointments(appointments.filter((apt) => apt.id !== id));
  };

  return (
    <ManagerContainer>
      <h3>Appointments</h3>
      <TextField label="Client" value={client} onChange={(e) => setClient(e.target.value)} />
      <TextField label="Time" type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} />
      <Button onClick={addAppointment}>Schedule</Button>
      {appointments.map((apt) => (
        <p key={apt.id}>
          {apt.client} at {apt.time} <Button onClick={() => cancelAppointment(apt.id)}>Cancel</Button>
        </p>
      ))}
    </ManagerContainer>
  );
};

export default AppointmentManager;